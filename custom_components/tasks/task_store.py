"""Versioned persistence for Tasks."""

from __future__ import annotations

import asyncio
import contextlib
from copy import deepcopy
from dataclasses import replace
from datetime import datetime
from pathlib import Path
import shutil
from typing import Any
from uuid import uuid4

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import DOMAIN, STORAGE_KEY, STORAGE_VERSION
from .datetime_utils import normalize_utc_datetime, parse_aware_datetime
from .migrations import upgrade_store_data
from .models import (
    Attachment,
    Completion,
    ProblemTrigger,
    TASK_MUTABLE_FIELDS,
    TRIGGER_FIELDS,
    Task,
    trigger_from_mapping,
)
from .recurrence import occurrences

def get_store(hass: HomeAssistant):
    """Return the loaded singleton store."""
    entries = hass.config_entries.async_entries(DOMAIN)
    if not entries or not hasattr(entries[0], "runtime_data"):
        return None
    data = entries[0].runtime_data
    return getattr(data, "store", None)


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


class TasksStore:
    """Serialize mutations and persist one compact snapshot."""

    def __init__(self, hass: HomeAssistant, upload_dir: Path) -> None:
        self._hass = hass
        self._store: Store[dict[str, Any]] = _TasksDataStore(
            hass, STORAGE_VERSION, STORAGE_KEY
        )
        self._upload_dir = upload_dir
        self._lock = asyncio.Lock()
        self._data: dict[str, Any] = {
            "tasks": [],
            "history": {},
            "attachments": [],
        }

    async def async_load(self) -> None:
        if stored := await self._store.async_load():
            self._data = {key: stored.get(key, default) for key, default in self._data.items()}

    def snapshot(self) -> dict[str, Any]:
        return {
            "tasks": list(self._data["tasks"]),
            "attachments": list(self._data["attachments"]),
        }

    async def async_export_archive(self) -> tuple[dict[str, Any], dict[str, bytes]]:
        """Return a consistent copy of all persisted data and attachment content."""
        async with self._lock:
            data = deepcopy(self._data)
            files = await self._hass.async_add_executor_job(
                self._read_attachment_files, data["attachments"]
            )
            return data, files

    def _read_attachment_files(
        self, attachments: list[dict[str, Any]]
    ) -> dict[str, bytes]:
        return {
            item["attachment_id"]: self.file_path(item["attachment_id"]).read_bytes()
            for item in attachments
        }

    async def async_import_archive(
        self, data: Any, files: dict[str, bytes | Path]
    ) -> dict[str, Any]:
        """Add new archive records without overwriting existing data."""
        imported = deepcopy(data)
        async with self._lock:
            old_data = self._data
            existing_task_ids = {task["task_id"] for task in old_data["tasks"]}
            existing_attachment_ids = {
                attachment["attachment_id"] for attachment in old_data["attachments"]
            }
            new_tasks = [
                task for task in imported["tasks"]
                if task["task_id"] not in existing_task_ids
            ]
            skipped_tasks = [
                task for task in imported["tasks"]
                if task["task_id"] in existing_task_ids
            ]
            new_task_ids = {task["task_id"] for task in new_tasks}
            new_attachments = [
                attachment for attachment in imported["attachments"]
                if attachment["task_id"] in new_task_ids
                and attachment["attachment_id"] not in existing_attachment_ids
                and not self.file_path(attachment["attachment_id"]).exists()
            ]
            new_attachment_ids = {
                attachment["attachment_id"] for attachment in new_attachments
            }
            merged = deepcopy(old_data)
            merged["tasks"].extend(new_tasks)
            merged["attachments"].extend(new_attachments)
            merged["history"].update({
                task_id: entries
                for task_id, entries in imported["history"].items()
                if task_id in new_task_ids
            })
            created_files = await self._hass.async_add_executor_job(
                self._write_attachment_files,
                {
                    file_id: content for file_id, content in files.items()
                    if file_id in new_attachment_ids
                },
            )
            self._data = merged
            try:
                await self._save()
            except Exception:
                self._data = old_data
                await self._hass.async_add_executor_job(
                    self._remove_attachment_files, created_files
                )
                raise
            return {
                "tasks_imported": len(new_tasks),
                "tasks_skipped": [
                    task.get("task_name") or task["task_id"]
                    for task in skipped_tasks
                ],
                "history_entries_imported": sum(
                    len(imported["history"].get(task_id, []))
                    for task_id in new_task_ids
                ),
                "attachments_imported": len(new_attachments),
                "attachments_skipped": len(imported["attachments"])
                - len(new_attachments),
            }

    def _write_attachment_files(
        self, files: dict[str, bytes | Path]
    ) -> list[Path]:
        self._upload_dir.mkdir(parents=True, exist_ok=True)
        created: list[Path] = []
        try:
            for file_id, content in files.items():
                path = self._upload_dir / file_id
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

    @staticmethod
    def _remove_attachment_files(files: list[Path]) -> None:
        for path in files:
            path.unlink(missing_ok=True)

    @property
    def tasks(self) -> list[dict[str, Any]]:
        return list(self._data["tasks"])

    def _find(self, kind: str, item_id: str) -> dict[str, Any]:
        id_key = {"tasks": "task_id", "attachments": "attachment_id"}[kind]
        item = next((x for x in self._data[kind] if x[id_key] == item_id), None)
        if item is None:
            raise ValueError(f"unknown_{kind[:-1]}")
        return item

    def _normalize_nfc_tag_id(
        self, value: Any, exclude_task_id: str | None = None
    ) -> str | None:
        tag_id = str(value or "").strip() or None
        if tag_id and any(
            task["task_id"] != exclude_task_id and task.get("nfc_tag_id") == tag_id
            for task in self._data["tasks"]
        ):
            raise ValueError("nfc_tag_already_assigned")
        return tag_id

    def task(self, task_id: str) -> dict[str, Any]:
        """Return one task for validation by the API layer."""
        return dict(self._find("tasks", task_id))

    async def _save(self) -> None:
        await self._store.async_save(self._data)

    async def async_add_task(
        self, payload: dict[str, Any], now: datetime | None = None
    ) -> dict[str, Any]:
        trigger = trigger_from_mapping(payload)
        created_at = now or dt_util.utcnow()
        task_due = (
            None
            if isinstance(trigger, ProblemTrigger)
            else normalize_utc_datetime(
                payload.get("task_due")
                or next(occurrences(payload, created_at))
            )
        )
        async with self._lock:
            nfc_tag_id = self._normalize_nfc_tag_id(payload.get("nfc_tag_id"))
            values = {
                key: payload[key]
                for key in TASK_MUTABLE_FIELDS
                if key in payload
            }
            task = Task.from_mapping({
                **values,
                "task_id": uuid4().hex,
                **trigger.storage_fields(),
                "nfc_tag_id": nfc_tag_id,
                "task_due": task_due,
            }).storage_fields()
            self._data["tasks"].append(task)
            await self._save()
            return task

    async def async_update_task(
        self,
        task_id: str,
        payload: dict[str, Any],
        now: datetime | None = None,
    ) -> dict[str, Any]:
        async with self._lock:
            task = self._find("tasks", task_id)
            current = Task.from_mapping(task)
            values = {
                key: payload[key]
                for key in TASK_MUTABLE_FIELDS
                if key in payload
            }
            if "nfc_tag_id" in values:
                values["nfc_tag_id"] = self._normalize_nfc_tag_id(
                    values["nfc_tag_id"], task_id
                )
            schedule_update = any(
                key in payload for key in TRIGGER_FIELDS
            )
            updated = Task.from_mapping(
                {**current.storage_fields(), **values}
            )
            schedule_changed = (
                schedule_update
                and updated.trigger.signature() != current.trigger.signature()
            )
            if schedule_changed:
                if isinstance(updated.trigger, ProblemTrigger):
                    updated = replace(updated, due=None)
                else:
                    boundary = dt_util.as_local(now or dt_util.utcnow())
                    if current.due and not isinstance(
                        current.trigger, ProblemTrigger
                    ):
                        previous_due = dt_util.as_local(current.due)
                        boundary = boundary.replace(
                            hour=previous_due.hour,
                            minute=previous_due.minute,
                            second=previous_due.second,
                            microsecond=previous_due.microsecond,
                            fold=0,
                        )
                    schedule = updated.storage_fields()
                    schedule.pop("task_due")
                    updated = replace(
                        updated,
                        due=next(occurrences(schedule, boundary)),
                    )
            task.clear()
            task.update(updated.storage_fields())
            await self._save()
            return task

    async def async_delete_task(self, task_id: str) -> None:
        async with self._lock:
            self._find("tasks", task_id)
            file_ids = [a["attachment_id"] for a in self._data["attachments"] if a["task_id"] == task_id]
            self._data["tasks"] = [t for t in self._data["tasks"] if t["task_id"] != task_id]
            self._data["attachments"] = [a for a in self._data["attachments"] if a["task_id"] != task_id]
            self._data["history"].pop(task_id, None)
            for file_id in file_ids:
                await self._unlink(file_id)
            await self._save()

    async def async_complete_task(
        self,
        task_id: str,
        completed_at: str,
        user_id: str | None,
        user_name: str,
        notes: str | None = None,
    ) -> dict[str, Any]:
        async with self._lock:
            task = self._find("tasks", task_id)
            task_due_before = task.get("task_due")
            completion = parse_aware_datetime(completed_at)
            if task.get("schedule_type") == "sensor":
                task_due_after = None
            else:
                task_due_after = normalize_utc_datetime(
                    next(occurrences(task, completion))
                )
            record = Completion.from_mapping({
                "history_entry_id": uuid4().hex,
                "completed_at": normalize_utc_datetime(completion),
                "user_id": user_id,
                "user_name": user_name,
                "notes": str(notes or "").strip() or None,
                "task_due_before": task_due_before,
                "task_due_after": task_due_after,
            }).storage_fields()
            task["task_due"] = task_due_after
            self._data["history"].setdefault(task_id, []).append(record)
            await self._save()
            return task

    def history(self, task_id: str) -> list[dict[str, Any]]:
        self._find("tasks", task_id)
        return sorted(
            self._data["history"].get(task_id, []),
            key=lambda x: x["completed_at"],
            reverse=True,
        )

    async def async_delete_history(self, task_id: str, history_entry_id: str) -> dict[str, Any]:
        async with self._lock:
            task = self._find("tasks", task_id)
            entries = self._data["history"].get(task_id, [])
            removed = next((x for x in entries if x["history_entry_id"] == history_entry_id), None)
            if removed is None:
                raise ValueError("unknown_history_entry")
            if (
                task.get("schedule_type") == "sensor"
                or removed.get("task_due_before") is None
                or removed.get("task_due_after") is None
            ):
                self._data["history"][task_id] = [
                    entry
                    for entry in entries
                    if entry["history_entry_id"] != history_entry_id
                ]
                await self._save()
                return task
            chronological = sorted(
                entries, key=lambda entry: entry["completed_at"]
            )
            original_due = chronological[0]["task_due_before"]
            remaining = [entry for entry in chronological if entry["history_entry_id"] != history_entry_id]
            replay_task = {**task, "task_due": original_due}
            for entry in remaining:
                entry["task_due_before"] = replay_task["task_due"]
                entry["task_due_after"] = normalize_utc_datetime(
                    next(
                        occurrences(
                            replay_task,
                            parse_aware_datetime(entry["completed_at"]),
                        )
                    )
                )
                replay_task["task_due"] = entry["task_due_after"]
            self._data["history"][task_id] = remaining
            task["task_due"] = replay_task["task_due"]
            await self._save()
            return task

    def attachment(self, attachment_id: str) -> dict[str, Any] | None:
        return next((x for x in self._data["attachments"] if x["attachment_id"] == attachment_id), None)

    async def async_add_attachment(self, task_id: str, filename: str, content_type: str, data: bytes) -> dict[str, Any]:
        async with self._lock:
            self._find("tasks", task_id)
            attachment = Attachment(
                id=uuid4().hex,
                task_id=task_id,
                filename=filename,
                content_type=content_type,
                size=len(data),
                uploaded_at=dt_util.utcnow(),
            ).storage_fields()
            await self._hass.async_add_executor_job(self._write, attachment["attachment_id"], data)
            self._data["attachments"].append(attachment)
            await self._save()
            return attachment

    async def async_delete_attachment(self, attachment_id: str) -> None:
        async with self._lock:
            if self.attachment(attachment_id) is None:
                raise ValueError("unknown_attachment")
            self._data["attachments"] = [x for x in self._data["attachments"] if x["attachment_id"] != attachment_id]
            await self._unlink(attachment_id)
            await self._save()

    def _write(self, file_id: str, data: bytes) -> None:
        self._upload_dir.mkdir(parents=True, exist_ok=True)
        (self._upload_dir / file_id).write_bytes(data)

    async def _unlink(self, file_id: str) -> None:
        await self._hass.async_add_executor_job(self._unlink_sync, file_id)

    def _unlink_sync(self, file_id: str) -> None:
        with contextlib.suppress(FileNotFoundError):
            (self._upload_dir / file_id).unlink()

    def file_path(self, file_id: str) -> Path:
        if (
            not isinstance(file_id, str)
            or not file_id
            or file_id in {".", ".."}
            or "/" in file_id
            or "\\" in file_id
        ):
            raise ValueError("invalid_attachment_id")
        return self._upload_dir / file_id

    @staticmethod
    def is_due(task: dict[str, Any], now: datetime) -> bool:
        return (
            task.get("active", True)
            and bool(task.get("task_due"))
            and parse_aware_datetime(task["task_due"]) <= now
        )

    async def async_trigger_problem_task(
        self, task_id: str, triggered_at: str
    ) -> dict[str, Any] | None:
        """Make one waiting sensor task due exactly once."""
        async with self._lock:
            task = self._find("tasks", task_id)
            if (
                not task.get("active", True)
                or task.get("schedule_type") != "sensor"
                or task.get("task_due")
            ):
                return None
            task["task_due"] = normalize_utc_datetime(triggered_at)
            await self._save()
            return dict(task)
