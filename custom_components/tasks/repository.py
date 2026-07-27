"""Versioned aggregate persistence and attachment files for Tasks."""

from __future__ import annotations

import contextlib
from copy import deepcopy
from pathlib import Path
import shutil
from typing import Any

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store

from .const import STORAGE_KEY, STORAGE_VERSION
from .migrations import upgrade_store_data


class _TasksDataStore(Store[dict[str, Any]]):
    """Home Assistant store with Tasks schema migrations."""

    async def _async_migrate_func(
        self,
        old_major_version: int,
        old_minor_version: int,
        old_data: dict[str, Any],
    ) -> dict[str, Any]:
        del old_minor_version
        return upgrade_store_data(old_major_version, old_data)


class TasksRepository:
    """Persist task aggregates and manage attachment files."""

    def __init__(
        self,
        hass: HomeAssistant,
        upload_dir: Path,
        *,
        store: Store[dict[str, Any]] | None = None,
    ) -> None:
        self.hass = hass
        self.upload_dir = upload_dir
        self.store = store or _TasksDataStore(
            hass, STORAGE_VERSION, STORAGE_KEY
        )

    async def async_load(
        self, defaults: dict[str, Any]
    ) -> dict[str, Any]:
        """Load a complete snapshot while preserving current defaults."""
        stored = await self.store.async_load()
        if not stored:
            return deepcopy(defaults)
        return {
            key: stored.get(key, deepcopy(default))
            for key, default in defaults.items()
        }

    async def async_save(self, data: dict[str, Any]) -> None:
        """Persist one current aggregate snapshot."""
        await self.store.async_save(data)

    async def async_read_attachment_files(
        self, attachments: list[dict[str, Any]]
    ) -> dict[str, bytes]:
        """Read all attachment content outside the event loop."""
        return await self.hass.async_add_executor_job(
            self._read_attachment_files, attachments
        )

    def _read_attachment_files(
        self, attachments: list[dict[str, Any]]
    ) -> dict[str, bytes]:
        return {
            item["attachment_id"]: self.file_path(
                item["attachment_id"]
            ).read_bytes()
            for item in attachments
        }

    async def async_write_attachment_files(
        self, files: dict[str, bytes | Path]
    ) -> list[Path]:
        """Create attachment files outside the event loop."""
        return await self.hass.async_add_executor_job(
            self._write_attachment_files, files
        )

    def _write_attachment_files(
        self, files: dict[str, bytes | Path]
    ) -> list[Path]:
        self.upload_dir.mkdir(parents=True, exist_ok=True)
        created: list[Path] = []
        try:
            for file_id, content in files.items():
                path = self.file_path(file_id)
                with path.open("xb") as output:
                    created.append(path)
                    if isinstance(content, Path):
                        with content.open("rb") as source:
                            shutil.copyfileobj(source, output)
                    else:
                        output.write(content)
            return created
        except Exception:
            self._remove_attachment_files(created)
            raise

    async def async_remove_attachment_files(self, files: list[Path]) -> None:
        """Remove attachment paths outside the event loop."""
        await self.hass.async_add_executor_job(
            self._remove_attachment_files, files
        )

    @staticmethod
    def _remove_attachment_files(files: list[Path]) -> None:
        for path in files:
            path.unlink(missing_ok=True)

    async def async_write_attachment(self, file_id: str, data: bytes) -> None:
        """Write one attachment outside the event loop."""
        await self.hass.async_add_executor_job(
            self._write_attachment, file_id, data
        )

    def _write_attachment(self, file_id: str, data: bytes) -> None:
        self.upload_dir.mkdir(parents=True, exist_ok=True)
        self.file_path(file_id).write_bytes(data)

    async def async_delete_attachment(self, file_id: str) -> None:
        """Delete one attachment outside the event loop."""
        await self.hass.async_add_executor_job(
            self._delete_attachment, file_id
        )

    def _delete_attachment(self, file_id: str) -> None:
        with contextlib.suppress(FileNotFoundError):
            self.file_path(file_id).unlink()

    def file_path(self, file_id: str) -> Path:
        """Return the validated local path for an attachment ID."""
        if (
            not isinstance(file_id, str)
            or not file_id
            or file_id in {".", ".."}
            or "/" in file_id
            or "\\" in file_id
        ):
            raise ValueError("invalid_attachment_id")
        return self.upload_dir / file_id
