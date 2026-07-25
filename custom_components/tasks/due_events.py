"""Shared task due-date and due-event handling."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers.event import async_track_point_in_time
from homeassistant.util import dt as dt_util

from .const import EVENT_TASKS
from .notifications import async_notify_task_due, has_due_notification
from .task_events import async_fire_tasks_event


def parse_task_due(value: str) -> datetime:
    """Parse a timezone-aware task due datetime."""
    parsed = datetime.fromisoformat(value)
    if parsed.tzinfo is None:
        raise ValueError("task_due_timezone_required")
    return parsed


def normalize_task_due(value: str) -> str:
    """Return a canonical UTC task due datetime string."""
    return dt_util.as_utc(parse_task_due(value)).isoformat()


@callback
def fire_task_due(hass: HomeAssistant, task: dict[str, Any]) -> None:
    """Fire the shared due event and configured notifications for one task."""
    async_fire_tasks_event(
        hass,
        "task_due",
        "task",
        task["task_id"],
        resource_name=task["task_name"],
        task_due=task["task_due"],
    )
    if has_due_notification(task):
        hass.async_create_task(async_notify_task_due(hass, task))


class TaskDueEventScheduler:
    """Fire one Tasks event for every task as it becomes due."""

    def __init__(self, hass: HomeAssistant, store: Any) -> None:
        self._hass = hass
        self._store = store
        self._cancel_timer = None
        self._cancel_listener = None

    @callback
    def start(self) -> None:
        """Start listening for task changes and schedule the next due time."""
        self._cancel_listener = self._hass.bus.async_listen(
            EVENT_TASKS, self._handle_event
        )
        self.reschedule()

    @callback
    def stop(self) -> None:
        """Stop event and time listeners."""
        if self._cancel_timer:
            self._cancel_timer()
            self._cancel_timer = None
        if self._cancel_listener:
            self._cancel_listener()
            self._cancel_listener = None

    @callback
    def _handle_event(self, event: Event) -> None:
        if event.data.get("action") != "task_due":
            self.reschedule()

    @callback
    def reschedule(self) -> None:
        """Keep exactly one timer for the nearest future due value."""
        if self._cancel_timer:
            self._cancel_timer()
            self._cancel_timer = None
        now = dt_util.utcnow()
        future = [
            due
            for task in self._store.tasks
            if task.get("task_due")
            and (due := parse_task_due(task["task_due"])) > now
        ]
        if future:
            target = min(future)

            @callback
            def fire_due(fired_at: datetime) -> None:
                self._fire_due(target, fired_at)

            self._cancel_timer = async_track_point_in_time(
                self._hass,
                fire_due,
                target,
            )

    @callback
    def _fire_due(self, target: datetime, fired_at: datetime) -> None:
        """Fire each task due at the scheduled time and plan the next one."""
        self._cancel_timer = None
        for task in self._store.tasks:
            if not task.get("task_due"):
                continue
            due = parse_task_due(task["task_due"])
            if target <= due <= fired_at:
                fire_task_due(self._hass, task)
        self.reschedule()
