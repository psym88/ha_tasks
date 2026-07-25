"""Versioned persistence for Tasks."""

from __future__ import annotations

import asyncio
import contextlib
from copy import deepcopy
from datetime import date, datetime
from pathlib import Path
from typing import Any
from uuid import uuid4

from homeassistant.core import HomeAssistant
from homeassistant.helpers.storage import Store
from homeassistant.util import dt as dt_util

from .const import DOMAIN, STORAGE_KEY, STORAGE_VERSION
from .due_events import (
    normalize_task_due,
    parse_task_due,
    task_due_date,
    task_due_datetime,
    task_due_with_date,
)
from .recurrence import occurrences, validate_schedule

_SCHEDULE_FIELDS = (
    "schedule_start_date",
    "schedule_type",
    "schedule_unit",
    "schedule_interval",
    "schedule_weekdays",
    "schedule_day",
    "schedule_month",
)
_TASK_FIELDS = (
    "task_name",
    "task_icon",
    "task_description",
    "assignee_id",
    "nfc_tag_id",
    "notification_target",
    "notification_persistent",
    "notification_critical",
    "notification_route",
    "task_due",
)

def get_store(hass: HomeAssistant):
    """Return the loaded singleton store."""
    entries = hass.config_entries.async_entries(DOMAIN)
    if not entries or not hasattr(entries[0], "runtime_data"):
        return None
    data = entries[0].runtime_data
    return getattr(data, "store", None)


def _now() -> str:
    return dt_util.utcnow().isoformat()


def _schedule_signature(task: dict[str, Any]) -> tuple[Any, ...]:
    """Return only values that affect the active recurrence rule."""
    mode = task.get("schedule_type")
    schedule_unit = task.get("schedule_unit")
    values: list[Any] = [task.get("schedule_start_date") or None, mode, schedule_unit, int(task.get("schedule_interval") or 1)]
    if mode == "fixed" and schedule_unit == "weekly":
        values.append(tuple(sorted(int(day) for day in task.get("schedule_weekdays") or [])))
    elif mode == "fixed" and schedule_unit == "monthly":
        values.append(task.get("schedule_day"))
    elif mode == "fixed" and schedule_unit == "yearly":
        values.extend((task.get("schedule_month"), task.get("schedule_day")))
    return tuple(values)


def _normalize_schedule(task: dict[str, Any]) -> dict[str, Any]:
    """Clear recurrence values that do not belong to the active rule."""
    normalized = dict(task)
    normalized["schedule_weekdays"] = (
        list(task.get("schedule_weekdays") or [])
        if task.get("schedule_type") == "fixed"
        and task.get("schedule_unit") == "weekly"
        else []
    )
    normalized["schedule_day"] = (
        task.get("schedule_day")
        if task.get("schedule_type") == "fixed"
        and task.get("schedule_unit") in {"monthly", "yearly"}
        else None
    )
    normalized["schedule_month"] = (
        task.get("schedule_month")
        if task.get("schedule_type") == "fixed"
        and task.get("schedule_unit") == "yearly"
        else None
    )
    return normalized


class TasksStore:
    """Serialize mutations and persist one compact snapshot."""

    def __init__(self, hass: HomeAssistant, upload_dir: Path) -> None:
        self._hass = hass
        self._store: Store[dict[str, Any]] = Store(hass, STORAGE_VERSION, STORAGE_KEY)
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
        self, data: Any, files: dict[str, bytes]
    ) -> None:
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

    def _write_attachment_files(self, files: dict[str, bytes]) -> list[Path]:
        self._upload_dir.mkdir(parents=True, exist_ok=True)
        created: list[Path] = []
        try:
            for file_id, content in files.items():
                path = self._upload_dir / file_id
                with path.open("xb") as output:
                    created.append(path)
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

    @staticmethod
    def _required_name(value: Any) -> str:
        name = str(value or "").strip()
        if not name:
            raise ValueError("name_required")
        return name

    @staticmethod
    def _notification_target(value: Any) -> dict[str, list[str]]:
        device_ids = list(dict.fromkeys((value or {}).get("device_id", [])))
        return {"device_id": device_ids} if device_ids else {}

    @staticmethod
    def _notification_route(value: Any) -> str | None:
        route = str(value or "").strip()
        if route and (not route.startswith("/") or route.startswith("//")):
            raise ValueError("invalid_notification_route")
        return route or None

    async def async_add_task(self, payload: dict[str, Any], today: date | None = None) -> dict[str, Any]:
        task_due = normalize_task_due(
            str(
                payload.get("task_due")
                or next(occurrences(payload, today or dt_util.now().date())).isoformat()
            )
        )
        parsed_due = parse_task_due(task_due)
        due_date = (
            dt_util.as_local(parsed_due).date()
            if isinstance(parsed_due, datetime)
            else parsed_due
        )
        async with self._lock:
            nfc_tag_id = self._normalize_nfc_tag_id(payload.get("nfc_tag_id"))
            task = _normalize_schedule({
                "task_id": uuid4().hex,
                **{
                    key: payload.get(key)
                    for key in (
                        "task_icon",
                        "task_description",
                        "assignee_id",
                        *_SCHEDULE_FIELDS,
                    )
                },
                "task_name": self._required_name(payload.get("task_name")),
                "label_ids": list(dict.fromkeys(payload.get("label_ids") or [])),
                "nfc_tag_id": nfc_tag_id,
                "notification_target": self._notification_target(
                    payload.get("notification_target")
                ),
                "notification_persistent": bool(
                    payload.get("notification_persistent", False)
                ),
                "notification_critical": bool(
                    payload.get("notification_critical", False)
                ),
                "notification_route": self._notification_route(
                    payload.get("notification_route")
                ),
                "task_due": task_due,
                "schedule_anchor_date": due_date.isoformat(),
            })
            self._data["tasks"].append(task)
            await self._save()
            return task

    async def async_update_task(self, task_id: str, payload: dict[str, Any], today: date | None = None) -> dict[str, Any]:
        async with self._lock:
            task = self._find("tasks", task_id)
            values = {key: payload[key] for key in _TASK_FIELDS if key in payload}
            if "task_name" in values:
                values["task_name"] = self._required_name(values["task_name"])
            if "label_ids" in payload:
                values["label_ids"] = list(dict.fromkeys(payload["label_ids"]))
            if "nfc_tag_id" in values:
                values["nfc_tag_id"] = self._normalize_nfc_tag_id(
                    values["nfc_tag_id"], task_id
                )
            if "notification_target" in values:
                values["notification_target"] = self._notification_target(
                    values["notification_target"]
                )
            for key in ("notification_persistent", "notification_critical"):
                if key in values:
                    values[key] = bool(values[key])
            if "notification_route" in values:
                values["notification_route"] = self._notification_route(
                    values["notification_route"]
                )
            old_schedule = _schedule_signature(task)
            schedule_update = any(
                key in payload for key in _SCHEDULE_FIELDS
            )
            normalized_schedule = None
            if schedule_update:
                merged_schedule = {
                    **task,
                    **{
                        key: payload[key]
                        for key in _SCHEDULE_FIELDS
                        if key in payload
                    },
                }
                validate_schedule(merged_schedule)
                normalized_schedule = _normalize_schedule(merged_schedule)
            task.update(values)
            if normalized_schedule is not None:
                for key in _SCHEDULE_FIELDS:
                    task[key] = normalized_schedule[key]
            schedule_changed = _schedule_signature(task) != old_schedule
            if schedule_changed:
                schedule = {
                    key: value
                    for key, value in task.items()
                    if key not in {"task_due", "schedule_anchor_date"}
                }
                due = next(occurrences(schedule, today or dt_util.now().date()))
                task["task_due"] = task_due_with_date(task, due)
                task["schedule_anchor_date"] = due.isoformat()
            elif "task_due" in payload:
                task["task_due"] = normalize_task_due(str(payload["task_due"]))
                due = task_due_date(task)
                task["schedule_start_date"] = due.isoformat()
                task["schedule_anchor_date"] = due.isoformat()
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
        completion_date: str,
        user_id: str | None,
        user_name: str,
        notes: str | None = None,
    ) -> dict[str, Any]:
        async with self._lock:
            task = self._find("tasks", task_id)
            task_due_before = task["task_due"]
            next_date = next(occurrences(task, date.fromisoformat(completion_date)))
            task_due_after = task_due_with_date(task, next_date)
            record = {
                "history_entry_id": uuid4().hex,
                "completion_date": completion_date,
                "recorded_at": _now(),
                "user_id": user_id,
                "user_name": user_name,
                "notes": str(notes or "").strip() or None,
                "task_due_before": task_due_before,
                "task_due_after": task_due_after,
            }
            task["task_due"] = task_due_after
            self._data["history"].setdefault(task_id, []).append(record)
            await self._save()
            return task

    def history(self, task_id: str) -> list[dict[str, Any]]:
        self._find("tasks", task_id)
        return sorted(self._data["history"].get(task_id, []), key=lambda x: x["recorded_at"], reverse=True)

    async def async_delete_history(self, task_id: str, history_entry_id: str) -> dict[str, Any]:
        async with self._lock:
            task = self._find("tasks", task_id)
            entries = self._data["history"].get(task_id, [])
            removed = next((x for x in entries if x["history_entry_id"] == history_entry_id), None)
            if removed is None:
                raise ValueError("unknown_history_entry")
            chronological = sorted(entries, key=lambda entry: entry["recorded_at"])
            original_due = chronological[0]["task_due_before"]
            remaining = [entry for entry in chronological if entry["history_entry_id"] != history_entry_id]
            replay_task = {**task, "task_due": original_due}
            for entry in remaining:
                entry["task_due_before"] = replay_task["task_due"]
                entry["task_due_after"] = task_due_with_date(
                    replay_task,
                    next(
                        occurrences(
                            replay_task,
                            date.fromisoformat(entry["completion_date"]),
                        )
                    ),
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
            attachment = {"attachment_id": uuid4().hex, "task_id": task_id, "filename": filename, "content_type": content_type, "size": len(data), "uploaded_at": _now()}
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
        return task_due_datetime(task) <= now
