"""Application service for Tasks reads and mutations."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any, Callable

from homeassistant.core import Context, HomeAssistant, callback

from .const import DOMAIN
from .notifications import (
    async_notify_task_due,
    dismiss_task_notification,
    has_due_notification,
)
from .task_events import async_fire_tasks_event
from .task_store import TasksStore


@dataclass(frozen=True, slots=True)
class TaskChange:
    """One committed internal application change."""

    action: str
    resource_type: str
    resource_id: str | None = None
    data: dict[str, Any] = field(default_factory=dict)
    revision: int = 0

    @property
    def affects_tasks(self) -> bool:
        return self.resource_type in {"task", "archive"}


def get_manager(hass: HomeAssistant):
    """Return the loaded Tasks application service."""
    entries = hass.config_entries.async_entries(DOMAIN)
    if not entries or not hasattr(entries[0], "runtime_data"):
        return None
    return getattr(entries[0].runtime_data, "manager", None)


class TaskManager:
    """Expose the Tasks use cases and publish committed changes."""

    def __init__(self, hass: HomeAssistant, store: TasksStore) -> None:
        self._hass = hass
        self._store = store
        self._listeners: set[Callable[[TaskChange], None]] = set()
        self._revision = 0

    @property
    def revision(self) -> int:
        """Return the current process-local change revision."""
        return self._revision

    @callback
    def subscribe(
        self, listener: Callable[[TaskChange], None]
    ) -> Callable[[], None]:
        """Subscribe to committed internal changes."""
        self._listeners.add(listener)

        @callback
        def unsubscribe() -> None:
            self._listeners.discard(listener)

        return unsubscribe

    @property
    def tasks(self) -> list[dict[str, Any]]:
        return self._store.tasks

    def snapshot(self) -> dict[str, Any]:
        return self._store.snapshot()

    def task(self, task_id: str) -> dict[str, Any]:
        return self._store.task(task_id)

    def history(self, task_id: str) -> list[dict[str, Any]]:
        return self._store.history(task_id)

    def attachment(self, attachment_id: str) -> dict[str, Any] | None:
        return self._store.attachment(attachment_id)

    def file_path(self, file_id: str) -> Path:
        return self._store.file_path(file_id)

    def is_due(self, task: dict[str, Any], now: datetime) -> bool:
        return self._store.is_due(task, now)

    async def async_export_archive(
        self,
    ) -> tuple[dict[str, Any], dict[str, bytes]]:
        return await self._store.async_export_archive()

    async def async_import_archive(
        self,
        data: Any,
        files: dict[str, bytes | Path],
        *,
        context: Context | None = None,
    ) -> dict[str, Any]:
        result = await self._store.async_import_archive(data, files)
        self._changed("imported", "archive", context=context)
        return result

    async def async_add_task(
        self,
        payload: dict[str, Any],
        now: datetime | None = None,
        *,
        context: Context | None = None,
    ) -> dict[str, Any]:
        task = await self._store.async_add_task(payload, now)
        self._changed(
            "created",
            "task",
            task["task_id"],
            context=context,
            resource_name=task["task_name"],
        )
        return task

    async def async_update_task(
        self,
        task_id: str,
        payload: dict[str, Any],
        now: datetime | None = None,
        *,
        context: Context | None = None,
    ) -> dict[str, Any]:
        previous = self._store.task(task_id)
        task = await self._store.async_update_task(task_id, payload, now)
        self._changed(
            "updated",
            "task",
            task_id,
            context=context,
            resource_name=task["task_name"],
            problem_trigger_changed=(
                previous.get("schedule_type") != task.get("schedule_type")
                or previous.get("problem_sensor") != task.get("problem_sensor")
                or previous.get("active", True) != task.get("active", True)
            ),
        )
        return task

    async def async_delete_task(
        self, task_id: str, *, context: Context | None = None
    ) -> None:
        task = self._store.task(task_id)
        await self._store.async_delete_task(task_id)
        dismiss_task_notification(self._hass, task_id)
        self._changed(
            "deleted",
            "task",
            task_id,
            context=context,
            resource_name=task["task_name"],
        )

    async def async_complete_task(
        self,
        task_id: str,
        completed_at: str,
        user_id: str | None,
        user_name: str,
        notes: str | None = None,
        *,
        context: Context | None = None,
        source: str | None = None,
    ) -> dict[str, Any]:
        task = await self._store.async_complete_task(
            task_id, completed_at, user_id, user_name, notes
        )
        dismiss_task_notification(self._hass, task_id)
        data = {"resource_name": task.get("task_name")}
        if source:
            data["source"] = source
        self._changed(
            "completed", "task", task_id, context=context, **data
        )
        return task

    async def async_bulk_mutate(
        self,
        operations: list[dict[str, Any]],
        user_id: str | None,
        user_name: str,
        now: datetime,
        *,
        context: Context | None = None,
    ) -> list[dict[str, Any]]:
        """Apply task mutations as one persisted and published change."""
        previous = {
            operation["task_id"]: self._store.task(operation["task_id"])
            for operation in operations
            if operation["action"] == "update"
        }
        results = await self._store.async_bulk_mutate(
            operations, user_id, user_name, now
        )
        problem_task_ids = []
        for result in results:
            task_id = result["task_id"]
            if result["action"] in {"complete", "delete"}:
                dismiss_task_notification(self._hass, task_id)
            if result["action"] != "update":
                continue
            before = previous[task_id]
            task = result["task"]
            if (
                before.get("schedule_type") != task.get("schedule_type")
                or before.get("problem_sensor") != task.get("problem_sensor")
                or before.get("active", True) != task.get("active", True)
            ):
                problem_task_ids.append(task_id)
        self._changed(
            "bulk_mutated",
            "task",
            context=context,
            operations=[
                {
                    "action": result["action"],
                    "task_id": result["task_id"],
                }
                for result in results
            ],
            problem_trigger_changed=bool(problem_task_ids),
            problem_task_ids=problem_task_ids,
        )
        return results

    async def async_delete_history(
        self,
        task_id: str,
        history_entry_id: str,
        *,
        context: Context | None = None,
    ) -> dict[str, Any]:
        task = await self._store.async_delete_history(
            task_id, history_entry_id
        )
        self._changed(
            "deleted",
            "history",
            history_entry_id,
            context=context,
            task_id=task_id,
        )
        return task

    async def async_add_attachment(
        self,
        task_id: str,
        filename: str,
        content_type: str,
        data: bytes,
        *,
        context: Context | None = None,
    ) -> dict[str, Any]:
        attachment = await self._store.async_add_attachment(
            task_id, filename, content_type, data
        )
        self._changed(
            "created",
            "attachment",
            attachment["attachment_id"],
            context=context,
            task_id=task_id,
        )
        return attachment

    async def async_delete_attachment(
        self,
        attachment_id: str,
        *,
        context: Context | None = None,
    ) -> None:
        attachment = self._store.attachment(attachment_id)
        if attachment is None:
            raise ValueError("unknown_attachment")
        await self._store.async_delete_attachment(attachment_id)
        self._changed(
            "deleted",
            "attachment",
            attachment_id,
            context=context,
            task_id=attachment["task_id"],
        )

    async def async_trigger_problem_task(
        self, task_id: str, triggered_at: str
    ) -> dict[str, Any] | None:
        task = await self._store.async_trigger_problem_task(
            task_id, triggered_at
        )
        if task is not None:
            self.task_became_due(task)
        return task

    @callback
    def task_became_due(self, task: dict[str, Any]) -> None:
        """Publish and handle a task reaching its due time."""
        self._changed(
            "task_due",
            "task",
            task["task_id"],
            resource_name=task["task_name"],
            task_due=task["task_due"],
        )
        if has_due_notification(task):
            self._hass.async_create_task(
                async_notify_task_due(self._hass, task)
            )

    def _changed(
        self,
        action: str,
        resource_type: str,
        resource_id: str | None = None,
        *,
        context: Context | None = None,
        **data: Any,
    ) -> None:
        self._revision += 1
        change = TaskChange(
            action,
            resource_type,
            resource_id,
            data,
            revision=self._revision,
        )
        for listener in tuple(self._listeners):
            listener(change)
        async_fire_tasks_event(
            self._hass,
            action,
            resource_type,
            resource_id,
            context=context,
            **data,
        )
