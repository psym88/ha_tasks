"""Authenticated file upload and download."""

from io import BytesIO
import json
from pathlib import Path
import shutil
import tempfile
import zipfile

from aiohttp import web
from homeassistant.components.http import HomeAssistantView
from homeassistant.core import HomeAssistant
import voluptuous as vol

from .const import ARCHIVE_URL, DOMAIN, DOWNLOAD_URL
from .manager import get_manager
from .migrations import ARCHIVE_FORMAT, upgrade_archive_manifest

ARCHIVE_MANIFEST_SCHEMA = vol.Schema(
    {
        vol.Required("integration"): str,
        vol.Required("format"): int,
        vol.Required("data"): {
            vol.Required("tasks"): list,
            vol.Required("history"): dict,
            vol.Required("attachments"): list,
        },
    },
    extra=vol.PREVENT_EXTRA,
)


def _build_archive(data: dict, files: dict[str, bytes]) -> bytes:
    """Build an archive outside the Home Assistant event loop."""
    output = BytesIO()
    with zipfile.ZipFile(output, "w", zipfile.ZIP_DEFLATED) as archive:
        archive.writestr(
            "tasks.json",
            json.dumps(
                {"integration": DOMAIN, "format": ARCHIVE_FORMAT, "data": data},
                ensure_ascii=False,
                indent=2,
            ),
        )
        for file_id, content in files.items():
            archive.writestr(f"attachments/{file_id}", content)
    return output.getvalue()


def _parse_archive_manifest(
    archive: zipfile.ZipFile,
) -> tuple[dict, list[zipfile.ZipInfo], list[tuple[int, int]]]:
    """Validate the archive envelope and return its migrated data."""
    items = archive.infolist()
    names = [item.filename for item in items]
    if len(names) != len(set(names)) or "tasks.json" not in names or any(
        name != "tasks.json" and not name.startswith("attachments/")
        for name in names
    ):
        raise ValueError("invalid_archive")
    conversions: list[tuple[int, int]] = []
    try:
        manifest = upgrade_archive_manifest(
            json.loads(archive.read("tasks.json")), conversions
        )
        manifest = ARCHIVE_MANIFEST_SCHEMA(manifest)
    except vol.Invalid as err:
        raise ValueError("invalid_archive") from err
    if manifest["integration"] != DOMAIN:
        raise ValueError("invalid_archive_integration")
    return manifest["data"], items, conversions


def _parse_archive_file_with_report(
    archive_path: Path, staging_dir: Path
) -> tuple[dict, dict[str, Path], dict[str, list[tuple[int, int]]]]:
    """Parse an archive and stream attachments into a staging directory."""
    files: dict[str, Path] = {}
    with zipfile.ZipFile(archive_path) as archive:
        data, items, conversions = _parse_archive_manifest(archive)
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
    return data, files, {"conversions": conversions}


def archive_error_code(error: Exception) -> str:
    """Return a safe translated error code for an archive failure."""
    code = str(error)
    return code if code in {
        "invalid_archive",
        "invalid_archive_integration",
    } else "invalid_archive"


def async_register_views(hass: HomeAssistant) -> None:
    hass.http.register_view(DownloadView)
    hass.http.register_view(ArchiveView)


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
                data, files, archive_report = await hass.async_add_executor_job(
                    _parse_archive_file_with_report, archive_path, temp_path
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
        return self.json({"imported": True, **archive_report, **import_report})
