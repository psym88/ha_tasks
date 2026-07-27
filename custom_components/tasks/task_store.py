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

from .datetime_utils import normalize_utc_datetime, parse_aware_datetime
from .models import (
    Attachment,
    Completion,
    ProblemTrigger,
    TASK_MUTABLE_FIELDS,
    TRIGGER_FIELDS,
    Task,
    trigger_from_record,
)
from .recurrence import occurrences
from .repository import TasksRepository


class TasksStore:
    """Persist and mutate versioned task aggregates."""

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
        self._data: dict[str, Any] = {"tasks": []}

    async def async_load(self) -> None:
        self._data = await self._repository.async_load(self._data)

    def snapshot(self) -> dict[str, Any]:
        return deepcopy(self._data)

    async def async_export_archive(
        self,
    ) -> tuple[dict[str, Any], dict[str, bytes]]:
        """Return a consistent current archive and its attachment content."""
        async with self._lock:
            data = deepcopy(self._data)
            attachments = [
                attachment
                for task in data["tasks"]
                for attachment in task["attachments"]
            ]
            files = await self._repository.async_read_attachment_files(
                attachments
            )
            return data, files

    async def async_import_archive(
        self, data: Any, files: dict[str, bytes | Path]
    ) -> dict[str, Any]:
        """Add converted current archive records as complete task aggregates."""
        imported = deepcopy(data)
        async with self._lock:
            existing_task_ids = {task["id"] for task in self._data["tasks"]}
            existing_attachment_ids = {
                attachment["id"]
                for task in self._data["tasks"]
                for attachment in task["attachments"]
            }
            candidates = [
                task for task in imported["tasks"]
                if task["id"] not in existing_task_ids
            ]
            skipped_tasks = [
                task for task in imported["tasks"]
                if task["id"] in existing_task_ids
            ]
            new_attachment_ids: set[str] = set()
            attachment_count = sum(
                len(task["attachments"]) for task in imported["tasks"]
            )
            new_tasks = []
            for task in candidates:
                accepted = []
                for attachment in task["attachments"]:
                    file_id = attachment["id"]
                    if (
                        file_id in existing_attachment_ids
                        or file_id in new_attachment_ids
                        or self._repository.file_path(file_id).exists()
                    ):
                        continue
                    Attachment.from_record(attachment)
                    new_attachment_ids.add(file_id)
                    accepted.append(Attachment.from_record(attachment).record())
                completions = [
                    Completion.from_record(entry).record()
                    for entry in task["completions"]
                ]
                new_tasks.append(
                    Task.from_record(task).record(
                        completions=completions,
                        attachments=accepted,
                    )
                )
            merged = deepcopy(self._data)
            merged["tasks"].extend(new_tasks)
            created_files = (
                await self._repository.async_write_attachment_files({
                    file_id: content
                    for file_id, content in files.items()
                    if file_id in new_attachment_ids
                })
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
                    task.get("name") or task["id"]
                    for task in skipped_tasks
                ],
                "history_entries_imported": sum(
                    len(task["completions"]) for task in new_tasks
                ),
                "attachments_imported": len(new_attachment_ids),
                "attachments_skipped": attachment_count
                - len(new_attachment_ids),
            }

    @property
    def tasks(self) -> list[dict[str, Any]]:
        return deepcopy(self._data["tasks"])

    @staticmethod
    def _find_task_in(
        data: dict[str, Any], task_id: str
    ) -> dict[str, Any]:
        task = next(
            (task for task in data["tasks"] if task["id"] == task_id),
            None,
        )
        if task is None:
            raise ValueError("unknown_task")
        return task

    @classmethod
    def _find_attachment_in(
        cls, data: dict[str, Any], attachment_id: str
    ) -> tuple[dict[str, Any], dict[str, Any]]:
        for task in data["tasks"]:
            attachment = next(
                (
                    item
                    for item in task["attachments"]
                    if item["id"] == attachment_id
                ),
                None,
            )
            if attachment is not None:
                return task, attachment
        raise ValueError("unknown_attachment")

    def _normalize_nfc_tag_id(
        self,
        value: Any,
        exclude_task_id: str | None = None,
        data: dict[str, Any] | None = None,
    ) -> str | None:
        tag_id = str(value or "").strip() or None
        if tag_id and any(
            task["id"] != exclude_task_id
            and task.get("nfc_tag_id") == tag_id
            for task in (data or self._data)["tasks"]
        ):
            raise ValueError("nfc_tag_already_assigned")
        return tag_id

    def task(self, task_id: str) -> dict[str, Any]:
        """Return one task aggregate."""
        return deepcopy(self._find_task_in(self._data, task_id))

    async def _commit(self, data: dict[str, Any]) -> None:
        await self._repository.async_save(data)
        self._data = data

    def _add_task_in(
        self,
        data: dict[str, Any],
        payload: dict[str, Any],
        now: datetime | None = None,
    ) -> dict[str, Any]:
        trigger = trigger_from_record(payload["schedule"])
        created_at = now or dt_util.utcnow()
        record = {
            **{
                key: payload[key]
                for key in TASK_MUTABLE_FIELDS
                if key in payload
            },
            "id": uuid4().hex,
            "nfc_tag_id": self._normalize_nfc_tag_id(
                payload.get("nfc_tag_id"), data=data
            ),
            "notification": payload.get("notification") or {},
            "completions": [],
            "attachments": [],
        }
        due = (
            None
            if isinstance(trigger, ProblemTrigger)
            else normalize_utc_datetime(
                payload.get("due")
                or next(occurrences({**record, "due": None}, created_at))
            )
        )
        record["due"] = due
        task = Task.from_record(record)
        stored = task.record()
        data["tasks"].append(stored)
        return deepcopy(stored)

    async def async_update_task(
        self,
        task_id: str,
        payload: dict[str, Any],
        now: datetime | None = None,
    ) -> dict[str, Any]:
        async with self._lock:
            data = deepcopy(self._data)
            task = self._update_task_in(data, task_id, payload, now)
            await self._commit(data)
            return task

    def _update_task_in(
        self,
        data: dict[str, Any],
        task_id: str,
        payload: dict[str, Any],
        now: datetime | None = None,
    ) -> dict[str, Any]:
        record = self._find_task_in(data, task_id)
        current = Task.from_record(record)
        values = {
            key: payload[key]
            for key in TASK_MUTABLE_FIELDS
            if key in payload
        }
        if "nfc_tag_id" in values:
            values["nfc_tag_id"] = self._normalize_nfc_tag_id(
                values["nfc_tag_id"], task_id, data
            )
        candidate = {**record, **values}
        updated = Task.from_record(candidate)
        if (
            any(key in payload for key in TRIGGER_FIELDS)
            and updated.trigger.signature() != current.trigger.signature()
        ):
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
                updated = replace(
                    updated,
                    due=next(
                        occurrences(
                            {**updated.record(), "due": None}, boundary
                        )
                    ),
                )
        children = {
            "completions": record["completions"],
            "attachments": record["attachments"],
        }
        record.clear()
        record.update(
            updated.record(**children)
        )
        return deepcopy(record)

    async def async_delete_task(self, task_id: str) -> None:
        async with self._lock:
            data = deepcopy(self._data)
            file_ids = self._delete_task_in(data, task_id)
            await self._commit(data)
            for file_id in file_ids:
                await self._repository.async_delete_attachment(file_id)

    def _delete_task_in(
        self, data: dict[str, Any], task_id: str
    ) -> list[str]:
        task = self._find_task_in(data, task_id)
        file_ids = [
            attachment["id"] for attachment in task["attachments"]
        ]
        data["tasks"].remove(task)
        return file_ids

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
            task = self._complete_task_in(
                data,
                task_id,
                completed_at,
                user_id,
                user_name,
                notes,
            )
            await self._commit(data)
            return task

    def _complete_task_in(
        self,
        data: dict[str, Any],
        task_id: str,
        completed_at: str,
        user_id: str | None,
        user_name: str,
        notes: str | None = None,
    ) -> dict[str, Any]:
        task = self._find_task_in(data, task_id)
        completion = parse_aware_datetime(completed_at)
        task["due"] = (
            None
            if task["schedule"]["type"] == "sensor"
            else normalize_utc_datetime(
                next(occurrences(task, completion))
            )
        )
        task["completions"].append(
            Completion(
                uuid4().hex,
                completion,
                user_id,
                user_name,
                str(notes or "").strip() or None,
            ).record()
        )
        return deepcopy(task)

    async def async_bulk_mutate(
        self,
        operations: list[dict[str, Any]],
        user_id: str | None,
        user_name: str,
        now: datetime,
    ) -> list[dict[str, Any]]:
        """Apply task operations to one snapshot and persist exactly once."""
        async with self._lock:
            data = deepcopy(self._data)
            results = []
            deleted_files = []
            for operation in operations:
                action = operation["action"]
                task_id = operation["id"]
                if action == "update":
                    task = self._update_task_in(
                        data, task_id, operation["changes"], now
                    )
                elif action == "complete":
                    task = self._complete_task_in(
                        data,
                        task_id,
                        operation.get(
                            "completed_at",
                            normalize_utc_datetime(now),
                        ),
                        user_id,
                        user_name,
                        operation.get("notes"),
                    )
                else:
                    deleted_files.extend(
                        self._delete_task_in(data, task_id)
                    )
                    task = None
                results.append(
                    {"action": action, "id": task_id, "task": task}
                )
            await self._commit(data)
            for file_id in deleted_files:
                await self._repository.async_delete_attachment(file_id)
            return results

    def history(self, task_id: str) -> list[dict[str, Any]]:
        task = self._find_task_in(self._data, task_id)
        return sorted(
            deepcopy(task["completions"]),
            key=lambda entry: entry["completed_at"],
            reverse=True,
        )

    async def async_save_task(
        self,
        task_id: str | None,
        payload: dict[str, Any],
        uploads: list[tuple[str, str, bytes]],
        deleted_attachment_ids: list[str],
        deleted_history_entry_ids: list[str],
        now: datetime,
    ) -> dict[str, Any]:
        """Save editor task, attachment, and history changes atomically."""
        async with self._lock:
            data = deepcopy(self._data)
            task_fields = (
                self._update_task_in(data, task_id, payload, now)
                if task_id
                else self._add_task_in(data, payload, now)
            )
            task_id = task_fields["id"]
            task = self._find_task_in(data, task_id)
            known_attachment_ids = {
                attachment["id"] for attachment in task["attachments"]
            }
            if not set(deleted_attachment_ids) <= known_attachment_ids:
                raise ValueError("unknown_attachment")
            deleted_files = [
                self._repository.file_path(attachment_id)
                for attachment_id in deleted_attachment_ids
            ]
            task["attachments"] = [
                attachment
                for attachment in task["attachments"]
                if attachment["id"] not in deleted_attachment_ids
            ]
            known_history_ids = {
                entry["id"] for entry in task["completions"]
            }
            if not set(deleted_history_entry_ids) <= known_history_ids:
                raise ValueError("unknown_history_entry")
            task["completions"] = [
                entry
                for entry in task["completions"]
                if entry["id"] not in deleted_history_entry_ids
            ]
            attachments = [
                Attachment(
                    uuid4().hex,
                    filename,
                    content_type,
                    len(content),
                    now,
                ).record()
                for filename, content_type, content in uploads
            ]
            task["attachments"].extend(attachments)
            created_files = (
                await self._repository.async_write_attachment_files({
                    attachment["id"]: upload[2]
                    for attachment, upload in zip(
                        attachments, uploads, strict=True
                    )
                })
                if attachments
                else []
            )
            try:
                await self._commit(data)
            except Exception:
                await self._repository.async_remove_attachment_files(
                    created_files
                )
                raise
            if deleted_files:
                await self._repository.async_remove_attachment_files(
                    deleted_files
                )
            return {
                "task": deepcopy(task),
            }

    def attachment(self, attachment_id: str) -> dict[str, Any] | None:
        try:
            _, attachment = self._find_attachment_in(
                self._data, attachment_id
            )
        except ValueError:
            return None
        return deepcopy(attachment)

    def file_path(self, file_id: str) -> Path:
        return self._repository.file_path(file_id)

    @staticmethod
    def is_due(task: dict[str, Any], now: datetime) -> bool:
        return (
            task.get("active", True)
            and bool(task.get("due"))
            and parse_aware_datetime(task["due"]) <= now
        )

    async def async_trigger_problem_task(
        self, task_id: str, triggered_at: str
    ) -> dict[str, Any] | None:
        """Make one waiting sensor task due exactly once."""
        async with self._lock:
            data = deepcopy(self._data)
            task = self._find_task_in(data, task_id)
            if (
                not task.get("active", True)
                or task["schedule"]["type"] != "sensor"
                or task.get("due")
            ):
                return None
            task["due"] = normalize_utc_datetime(triggered_at)
            await self._commit(data)
            return deepcopy(task)
