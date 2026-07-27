"""Shared task due-date and due-event handling."""

from __future__ import annotations

from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.event import async_track_point_in_time
from homeassistant.util import dt as dt_util

from .datetime_utils import parse_aware_datetime
from .manager import TaskChange, TaskManager


class TaskDueEventScheduler:
    """Fire one Tasks event for every task as it becomes due."""

    def __init__(self, hass: HomeAssistant, manager: TaskManager) -> None:
        self._hass = hass
        self._manager = manager
        self._cancel_timer = None
        self._cancel_listener = None

    @callback
    def start(self) -> None:
        """Start listening for task changes and schedule the next due time."""
        self._cancel_listener = self._manager.subscribe(self._handle_change)
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
    def _handle_change(self, change: TaskChange) -> None:
        if change.affects_tasks and change.action != "task_due":
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
            for task in self._manager.tasks
            if task.get("active", True)
            and task.get("task_due")
            and (due := parse_aware_datetime(task["task_due"])) > now
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
        for task in self._manager.tasks:
            if not task.get("active", True) or not task.get("task_due"):
                continue
            due = parse_aware_datetime(task["task_due"])
            if target <= due <= fired_at:
                self._manager.task_became_due(task)
        self.reschedule()
