"""Authenticated file upload and download."""

import asyncio
from dataclasses import dataclass
from io import BytesIO
import json
import mimetypes
from pathlib import Path
import shutil
import tempfile
from typing import Final
from uuid import uuid4
import zipfile

from aiohttp import BodyPartReader, hdrs, web
from homeassistant.components.http import (
    KEY_HASS,
    KEY_HASS_USER,
    HomeAssistantView,
)
from homeassistant.const import EVENT_HOMEASSISTANT_STOP
from homeassistant.core import HomeAssistant, callback
from homeassistant.util import raise_if_invalid_filename
from .const import (
    ARCHIVE_URL,
    DOMAIN,
    DOWNLOAD_URL,
    STORAGE_VERSION,
    UPLOAD_URL,
)
from .manager import get_manager
from .migrations import upgrade_store_data

ONE_MEGABYTE: Final = 1024 * 1024
MAX_ATTACHMENT_SIZE: Final = 100 * ONE_MEGABYTE
UPLOAD_DATA_KEY: Final = f"{DOMAIN}_temporary_uploads"


@dataclass(frozen=True, slots=True)
class PendingUpload:
    """One temporary attachment upload."""

    filename: str
    content_type: str
    path: Path
    user_id: str | None


class TemporaryUploads:
    """Own temporary attachment files until an editor save consumes them."""

    def __init__(self, hass: HomeAssistant, root: Path) -> None:
        self.hass = hass
        self.root = root
        self.files: dict[str, PendingUpload] = {}
        self.lock = asyncio.Lock()

    @classmethod
    async def async_create(cls, hass: HomeAssistant) -> TemporaryUploads:
        """Create a clean process-local upload directory."""
        root = Path(tempfile.gettempdir()) / "home-assistant-tasks-upload"

        def prepare() -> None:
            if root.exists():
                shutil.rmtree(root)
            root.mkdir(mode=0o700)

        await hass.async_add_executor_job(prepare)
        uploads = cls(hass, root)

        @callback
        def cleanup(_event) -> None:
            hass.async_add_executor_job(shutil.rmtree, root, True)

        hass.bus.async_listen_once(EVENT_HOMEASSISTANT_STOP, cleanup)
        return uploads

    async def async_store(
        self,
        upload: BodyPartReader,
        filename: str,
        user_id: str | None,
    ) -> str:
        """Stream one multipart file into temporary storage."""
        file_id = uuid4().hex
        directory = self.root / file_id
        path = directory / filename
        content_type = (
            upload.headers.get(hdrs.CONTENT_TYPE)
            or mimetypes.guess_type(filename)[0]
            or "application/octet-stream"
        )

        await self.hass.async_add_executor_job(directory.mkdir)
        size = 0
        try:
            output = await self.hass.async_add_executor_job(
                path.open, "xb"
            )
            try:
                while chunk := await upload.read_chunk(ONE_MEGABYTE):
                    size += len(chunk)
                    if size > MAX_ATTACHMENT_SIZE:
                        raise web.HTTPRequestEntityTooLarge(
                            max_size=MAX_ATTACHMENT_SIZE,
                            actual_size=size,
                        )
                    await self.hass.async_add_executor_job(
                        output.write, chunk
                    )
            finally:
                await self.hass.async_add_executor_job(output.close)
        except Exception:
            await self.hass.async_add_executor_job(
                shutil.rmtree, directory, True
            )
            raise

        self.files[file_id] = PendingUpload(
            filename, content_type, path, user_id
        )
        return file_id

    async def async_consume(
        self, file_ids: list[str], user_id: str | None
    ) -> list[tuple[str, str, bytes]]:
        """Consume a set of uploads owned by the requesting user."""
        if len(file_ids) != len(set(file_ids)):
            raise ValueError("invalid_upload")
        async with self.lock:
            records = []
            for file_id in file_ids:
                record = self.files.get(file_id)
                if record is None or record.user_id != user_id:
                    raise ValueError("invalid_upload")
                records.append(record)
            for file_id in file_ids:
                self.files.pop(file_id)

        def read_and_remove() -> list[tuple[str, str, bytes]]:
            try:
                return [
                    (
                        record.filename,
                        record.content_type,
                        record.path.read_bytes(),
                    )
                    for record in records
                ]
            finally:
                for record in records:
                    shutil.rmtree(record.path.parent, ignore_errors=True)

        return await self.hass.async_add_executor_job(read_and_remove)


async def _async_uploads(hass: HomeAssistant) -> TemporaryUploads:
    """Return the process-local temporary upload store."""
    if UPLOAD_DATA_KEY not in hass.data:
        hass.data[UPLOAD_DATA_KEY] = await TemporaryUploads.async_create(hass)
    return hass.data[UPLOAD_DATA_KEY]


async def async_consume_uploads(
    hass: HomeAssistant,
    file_ids: list[str],
    user_id: str | None,
) -> list[tuple[str, str, bytes]]:
    """Consume temporary Tasks uploads for one editor save."""
    if not file_ids:
        return []
    return await (await _async_uploads(hass)).async_consume(
        file_ids, user_id
    )

def _build_archive(data: dict, files: dict[str, bytes]) -> bytes:
    """Build an archive outside the Home Assistant event loop."""
    output = BytesIO()
    with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED) as archive:
        archive.writestr(
            "tasks.json",
            json.dumps(
                {"version": STORAGE_VERSION, "data": data},
                ensure_ascii=False,
                indent=2,
            ),
        )
        for file_id, content in files.items():
            archive.writestr(f"attachments/{file_id}", content)
    return output.getvalue()


def _parse_archive_snapshot(
    archive: zipfile.ZipFile,
) -> tuple[dict, list[zipfile.ZipInfo]]:
    """Validate the stored snapshot and return its migrated data."""
    items = archive.infolist()
    names = [item.filename for item in items]
    if len(names) != len(set(names)) or "tasks.json" not in names or any(
        name != "tasks.json" and not name.startswith("attachments/")
        for name in names
    ):
        raise ValueError("invalid_archive")
    snapshot = json.loads(archive.read("tasks.json"))
    if (
        not isinstance(snapshot, dict)
        or set(snapshot) != {"version", "data"}
        or type(snapshot["version"]) is not int
        or not isinstance(snapshot["data"], dict)
    ):
        raise ValueError("invalid_archive")
    data = upgrade_store_data(snapshot["version"], snapshot["data"])
    if set(data) != {"tasks"} or not isinstance(data["tasks"], list):
        raise ValueError("invalid_archive")
    return data, items


def _parse_archive_file(
    archive_path: Path, staging_dir: Path
) -> tuple[dict, dict[str, Path]]:
    """Parse an archive and stream attachments into a staging directory."""
    files: dict[str, Path] = {}
    with zipfile.ZipFile(archive_path) as archive:
        data, items = _parse_archive_snapshot(archive)
        for index, item in enumerate(items):
            if not item.filename.startswith("attachments/") or item.is_dir():
                continue
            file_id = item.filename.removeprefix("attachments/")
            if (
                not file_id
                or file_id in {".", ".."}
                or "/" in file_id
                or "\\" in file_id
            ):
                raise ValueError("invalid_archive")
            target = staging_dir / str(index)
            with archive.open(item) as source, target.open("xb") as output:
                shutil.copyfileobj(source, output)
            files[file_id] = target
    return data, files


def archive_error_code(error: Exception) -> str:
    """Return a safe translated error code for an archive failure."""
    code = str(error)
    return code if code in {
        "invalid_archive",
        "unsupported_store_version",
    } else "invalid_archive"


def async_register_views(hass: HomeAssistant) -> None:
    hass.http.register_view(UploadView)
    hass.http.register_view(DownloadView)
    hass.http.register_view(ArchiveView)


class UploadView(HomeAssistantView):
    """Accept temporary Tasks attachment uploads."""

    url = UPLOAD_URL
    name = "api:tasks:upload"
    requires_auth = True

    async def post(self, request: web.Request) -> web.Response:
        """Stream one multipart file into Tasks-owned temporary storage."""
        request._client_max_size = 0  # noqa: SLF001
        reader = await request.multipart()
        upload = await reader.next()
        filename = upload.filename if isinstance(upload, BodyPartReader) else None
        if (
            not isinstance(upload, BodyPartReader)
            or upload.name != "file"
            or filename is None
        ):
            raise web.HTTPBadRequest(text="Expected a file")
        try:
            raise_if_invalid_filename(filename)
        except ValueError as err:
            raise web.HTTPBadRequest from err
        hass = request.app[KEY_HASS]
        user = request.get(KEY_HASS_USER)
        file_id = await (await _async_uploads(hass)).async_store(
            upload,
            filename,
            getattr(user, "id", None),
        )
        return self.json({"file_id": file_id})


class DownloadView(HomeAssistantView):
    url = f"{DOWNLOAD_URL}/{{attachment_id}}"
    name = "api:tasks:download"
    requires_auth = True

    async def get(self, request: web.Request, attachment_id: str) -> web.StreamResponse:
        manager = get_manager(request.app["hass"])
        record = manager.attachment(attachment_id) if manager else None
        if record is None or not manager.file_path(attachment_id).exists():
            raise web.HTTPNotFound()
        return web.FileResponse(manager.file_path(attachment_id), headers={"Content-Type": record["content_type"], "Content-Disposition": f'inline; filename="{record["filename"]}"'})


class ArchiveView(HomeAssistantView):
    url = ARCHIVE_URL
    name = "api:tasks:archive"
    requires_auth = True

    async def get(self, request: web.Request) -> web.Response:
        manager = get_manager(request.app["hass"])
        if manager is None:
            raise web.HTTPServiceUnavailable()
        data, files = await manager.async_export_archive()
        body = await request.app["hass"].async_add_executor_job(
            _build_archive, data, files
        )
        return web.Response(
            body=body,
            content_type="application/zip",
            headers={"Content-Disposition": 'attachment; filename="tasks-backup.zip"'},
        )

    async def post(self, request: web.Request) -> web.Response:
        """Stream, validate, and import a Tasks archive."""
        request._client_max_size = 0  # noqa: SLF001
        hass = request.app["hass"]
        manager = get_manager(hass)
        if manager is None:
            raise web.HTTPServiceUnavailable()
        try:
            with tempfile.TemporaryDirectory(prefix="tasks-import-") as temp_dir:
                temp_path = Path(temp_dir)
                archive_path = temp_path / "archive.zip"
                with archive_path.open("wb") as output:
                    while chunk := await request.content.readany():
                        await hass.async_add_executor_job(output.write, chunk)
                data, files = await hass.async_add_executor_job(
                    _parse_archive_file, archive_path, temp_path
                )
                import_report = await manager.async_import_archive(data, files)
        except (
            ValueError,
            KeyError,
            json.JSONDecodeError,
            zipfile.BadZipFile,
        ) as err:
            code = archive_error_code(err)
            return self.json({"code": code}, status_code=400)
        return self.json({"imported": True, **import_report})
