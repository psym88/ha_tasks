"""Versioned persistence for Tasks."""

from __future__ import annotations

import asyncio
from copy import deepcopy
from dataclasses import replace
from datetime import datetime
from pathlib import Path
from typing import Any
from uuid import uuid4

from homeassistant.core import HomeAssistant
from homeassistant.util import dt as dt_util

from .const import DOMAIN
from .datetime_utils import normalize_utc_datetime, parse_aware_datetime
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
from .repository import TasksRepository

def get_store(hass: HomeAssistant):
    """Return the loaded singleton store."""
    entries = hass.config_entries.async_entries(DOMAIN)
    if not entries or not hasattr(entries[0], "runtime_data"):
        return None
    data = entries[0].runtime_data
    return getattr(data, "store", None)


class TasksStore:
    """Serialize mutations and persist one compact snapshot."""

    def __init__(
        self,
        hass: HomeAssistant | None = None,
        upload_dir: Path | None = None,
        *,
        repository: TasksRepository | None = None,
    ) -> None:
        if repository is None:
            if hass is None or upload_dir is None:
                raise TypeError("TasksRepository is required")
            repository = TasksRepository(hass, upload_dir)
        self._repository = repository
        self._lock = asyncio.Lock()
        self._data: dict[str, Any] = {
            "tasks": [],
            "history": {},
            "attachments": [],
        }

    async def async_load(self) -> None:
        self._data = await self._repository.async_load(self._data)

    def snapshot(self) -> dict[str, Any]:
        return {
            "tasks": list(self._data["tasks"]),
            "attachments": list(self._data["attachments"]),
        }

    async def async_export_archive(self) -> tuple[dict[str, Any], dict[str, bytes]]:
        """Return a consistent copy of all persisted data and attachment content."""
        async with self._lock:
            data = deepcopy(self._data)
            files = await self._repository.async_read_attachment_files(
                data["attachments"]
            )
            return data, files

    async def async_import_archive(
        self, data: Any, files: dict[str, bytes | Path]
    ) -> dict[str, Any]:
        """Add new archive records without overwriting existing data."""
        imported = deepcopy(data)
        async with self._lock:
            existing_task_ids = {task["task_id"] for task in self._data["tasks"]}
            existing_attachment_ids = {
                attachment["attachment_id"] for attachment in self._data["attachments"]
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
                and not self._repository.file_path(
                    attachment["attachment_id"]
                ).exists()
            ]
            new_attachment_ids = {
                attachment["attachment_id"] for attachment in new_attachments
            }
            merged = deepcopy(self._data)
            merged["tasks"].extend(new_tasks)
            merged["attachments"].extend(new_attachments)
            merged["history"].update({
                task_id: entries
                for task_id, entries in imported["history"].items()
                if task_id in new_task_ids
            })
            created_files = await self._repository.async_write_attachment_files(
                {
                    file_id: content
                    for file_id, content in files.items()
                    if file_id in new_attachment_ids
                }
            )
            try:
                await self._commit(merged)
            except Exception:
                await self._repository.async_remove_attachment_files(
                    created_files
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

    @property
    def tasks(self) -> list[dict[str, Any]]:
        return list(self._data["tasks"])

    @staticmethod
    def _find_in(
        data: dict[str, Any], kind: str, item_id: str
    ) -> dict[str, Any]:
        id_key = {"tasks": "task_id", "attachments": "attachment_id"}[kind]
        item = next((x for x in data[kind] if x[id_key] == item_id), None)
        if item is None:
            raise ValueError(f"unknown_{kind[:-1]}")
        return item

    def _find(self, kind: str, item_id: str) -> dict[str, Any]:
        return self._find_in(self._data, kind, item_id)

    def _normalize_nfc_tag_id(
        self,
        value: Any,
        exclude_task_id: str | None = None,
        data: dict[str, Any] | None = None,
    ) -> str | None:
        tag_id = str(value or "").strip() or None
        if tag_id and any(
            task["task_id"] != exclude_task_id and task.get("nfc_tag_id") == tag_id
            for task in (data or self._data)["tasks"]
        ):
            raise ValueError("nfc_tag_already_assigned")
        return tag_id

    def task(self, task_id: str) -> dict[str, Any]:
        """Return one task for validation by the API layer."""
        return dict(self._find("tasks", task_id))

    async def _commit(self, data: dict[str, Any]) -> None:
        await self._repository.async_save(data)
        self._data = data

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
            data = deepcopy(self._data)
            nfc_tag_id = self._normalize_nfc_tag_id(
                payload.get("nfc_tag_id"), data=data
            )
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
            data["tasks"].append(task)
            await self._commit(data)
            return task

    async def async_update_task(
        self,
        task_id: str,
        payload: dict[str, Any],
        now: datetime | None = None,
    ) -> dict[str, Any]:
        async with self._lock:
            data = deepcopy(self._data)
            task = self._find_in(data, "tasks", task_id)
            current = Task.from_mapping(task)
            values = {
                key: payload[key]
                for key in TASK_MUTABLE_FIELDS
                if key in payload
            }
            if "nfc_tag_id" in values:
                values["nfc_tag_id"] = self._normalize_nfc_tag_id(
                    values["nfc_tag_id"], task_id, data
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
            await self._commit(data)
            return task

    async def async_delete_task(self, task_id: str) -> None:
        async with self._lock:
            data = deepcopy(self._data)
            self._find_in(data, "tasks", task_id)
            file_ids = [
                attachment["attachment_id"]
                for attachment in data["attachments"]
                if attachment["task_id"] == task_id
            ]
            data["tasks"] = [
                task for task in data["tasks"] if task["task_id"] != task_id
            ]
            data["attachments"] = [
                attachment
                for attachment in data["attachments"]
                if attachment["task_id"] != task_id
            ]
            data["history"].pop(task_id, None)
            await self._commit(data)
            for file_id in file_ids:
                await self._repository.async_delete_attachment(file_id)

    async def async_complete_task(
        self,
        task_id: str,
        completed_at: str,
        user_id: str | None,
        user_name: str,
        notes: str | None = None,
    ) -> dict[str, Any]:
        async with self._lock:
            data = deepcopy(self._data)
            task = self._find_in(data, "tasks", task_id)
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
            }).storage_fields()
            task["task_due"] = task_due_after
            data["history"].setdefault(task_id, []).append(record)
            await self._commit(data)
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
            data = deepcopy(self._data)
            task = self._find_in(data, "tasks", task_id)
            entries = data["history"].get(task_id, [])
            if not any(
                entry["history_entry_id"] == history_entry_id
                for entry in entries
            ):
                raise ValueError("unknown_history_entry")
            data["history"][task_id] = [
                entry
                for entry in entries
                if entry["history_entry_id"] != history_entry_id
            ]
            await self._commit(data)
            return task

    def attachment(self, attachment_id: str) -> dict[str, Any] | None:
        return next((x for x in self._data["attachments"] if x["attachment_id"] == attachment_id), None)

    async def async_add_attachment(self, task_id: str, filename: str, content_type: str, data: bytes) -> dict[str, Any]:
        async with self._lock:
            snapshot = deepcopy(self._data)
            self._find_in(snapshot, "tasks", task_id)
            attachment = Attachment(
                id=uuid4().hex,
                task_id=task_id,
                filename=filename,
                content_type=content_type,
                size=len(data),
                uploaded_at=dt_util.utcnow(),
            ).storage_fields()
            await self._repository.async_write_attachment(
                attachment["attachment_id"], data
            )
            snapshot["attachments"].append(attachment)
            try:
                await self._commit(snapshot)
            except Exception:
                await self._repository.async_delete_attachment(
                    attachment["attachment_id"]
                )
                raise
            return attachment

    async def async_delete_attachment(self, attachment_id: str) -> None:
        async with self._lock:
            data = deepcopy(self._data)
            self._find_in(data, "attachments", attachment_id)
            data["attachments"] = [
                attachment
                for attachment in data["attachments"]
                if attachment["attachment_id"] != attachment_id
            ]
            await self._commit(data)
            await self._repository.async_delete_attachment(attachment_id)

    def file_path(self, file_id: str) -> Path:
        return self._repository.file_path(file_id)

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
            data = deepcopy(self._data)
            task = self._find_in(data, "tasks", task_id)
            if (
                not task.get("active", True)
                or task.get("schedule_type") != "sensor"
                or task.get("task_due")
            ):
                return None
            task["task_due"] = normalize_utc_datetime(triggered_at)
            await self._commit(data)
            return dict(task)
