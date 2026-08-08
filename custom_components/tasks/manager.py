"""Application service for Tasks reads and mutations."""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import datetime
from pathlib import Path
from typing import Any, Callable

from homeassistant.core import Context, HomeAssistant, callback

from .const import DOMAIN, EVENT_TASKS
from .notifications import (
    async_notify_task_due,
    dismiss_task_notification,
    has_due_notification,
)
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


def get_manager(hass: HomeAssistant) -> TaskManager | None:
    """Return the loaded Tasks application service."""
    entries = hass.config_entries.async_entries(DOMAIN)
    if not entries or not hasattr(entries[0], "runtime_data"):
        return None
    return entries[0].runtime_data


class TaskManager:
    """Expose the Tasks use cases and publish committed changes."""

    def __init__(self, hass: HomeAssistant, store: TasksStore) -> None:
        self._hass = hass
        self._store = store
        self._listeners: set[Callable[[TaskChange], None]] = set()
        self._revision = 0
        self._problem_warnings: set[str] = set()
        self._problem_health_auditor: Callable[[], None] | None = None

    def _with_runtime_state(self, task: dict[str, Any]) -> dict[str, Any]:
        if task["schedule"]["type"] == "sensor":
            task["problem_warning"] = task["id"] in self._problem_warnings
        return task

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

    @callback
    def set_problem_warnings(self, task_ids: set[str]) -> None:
        """Replace all problem health warnings."""
        warnings = set(task_ids)
        if warnings == self._problem_warnings:
            return
        self._problem_warnings = warnings
        self._changed("problem_warnings", "runtime")

    @callback
    def set_problem_warning(self, task_id: str, warning: bool) -> None:
        """Update the health warning for one saved task."""
        warnings = self._problem_warnings | {task_id} if warning else (
            self._problem_warnings - {task_id}
        )
        self.set_problem_warnings(warnings)

    @callback
    def set_problem_health_auditor(
        self, auditor: Callable[[], None] | None
    ) -> None:
        """Register the trigger-neutral problem health audit."""
        self._problem_health_auditor = auditor

    @callback
    def audit_problem_health(self) -> None:
        """Refresh warning flags without touching trigger trackers."""
        if self._problem_health_auditor:
            self._problem_health_auditor()

    @property
    def tasks(self) -> list[dict[str, Any]]:
        return [self._with_runtime_state(task) for task in self._store.tasks]

    def snapshot(self) -> dict[str, Any]:
        snapshot = self._store.snapshot()
        snapshot["tasks"] = [
            self._with_runtime_state(task) for task in snapshot["tasks"]
        ]
        return snapshot

    def task(self, task_id: str) -> dict[str, Any]:
        return self._with_runtime_state(self._store.task(task_id))

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

    async def async_update_task(
        self,
        task_id: str,
        payload: dict[str, Any],
        now: datetime | None = None,
        *,
        context: Context | None = None,
    ) -> dict[str, Any]:
        task = await self._store.async_update_task(task_id, payload, now)
        self._changed(
            "updated",
            "task",
            task_id,
            context=context,
            resource_name=task["name"],
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
            resource_name=task["name"],
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
        data = {"resource_name": task.get("name")}
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
        results = await self._store.async_bulk_mutate(
            operations, user_id, user_name, now
        )
        for result in results:
            task_id = result["id"]
            if result["action"] in {"complete", "delete"}:
                dismiss_task_notification(self._hass, task_id)
        self._changed(
            "bulk_mutated",
            "task",
            context=context,
            operations=[
                {
                    "action": result["action"],
                    "id": result["id"],
                }
                for result in results
            ],
        )
        return results

    async def async_save_task(
        self,
        task_id: str | None,
        payload: dict[str, Any],
        uploads: list[tuple[str, str, bytes]],
        deleted_attachment_ids: list[str],
        deleted_history_entry_ids: list[str],
        now: datetime,
        *,
        context: Context | None = None,
    ) -> dict[str, Any]:
        """Commit all changes made in one task editor session."""
        previous = self._store.task(task_id) if task_id else None
        result = await self._store.async_save_task(
            task_id,
            payload,
            uploads,
            deleted_attachment_ids,
            deleted_history_entry_ids,
            now,
        )
        task = result["task"]
        self._changed(
            "saved",
            "task",
            task["id"],
            context=context,
            resource_name=task["name"],
            created=previous is None,
        )
        return result

    async def async_trigger_problem_task(
        self,
        task_id: str,
        occurred_at: str,
        message: str | None,
    ) -> dict[str, Any] | None:
        """Open one problem incident and publish it becoming due."""
        task = await self._store.async_trigger_problem_task(
            task_id, occurred_at, message
        )
        if task is not None:
            self.task_became_due(task)
        return task

    @callback
    def task_became_due(self, task: dict[str, Any]) -> None:
        """Publish and handle a task reaching its due time."""
        self._changed(
            "due",
            "task",
            task["id"],
            resource_name=task["name"],
            due=task["due"],
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
        self._hass.bus.async_fire(
            EVENT_TASKS,
            {
                "action": action,
                "resource_type": resource_type,
                "resource_id": resource_id,
                **data,
            },
            context=context,
        )
