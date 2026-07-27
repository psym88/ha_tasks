"""Runtime scheduling for due times and problem sensors."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from homeassistant.const import STATE_ON
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers.event import (
    async_track_point_in_time,
    async_track_state_change_event,
)
from homeassistant.util import dt as dt_util

from .datetime_utils import parse_aware_datetime
from .manager import TaskChange, TaskManager


class TaskEngine:
    """Run calendar due timers and binary-sensor task triggers."""

    def __init__(self, hass: HomeAssistant, manager: TaskManager) -> None:
        self._hass = hass
        self._manager = manager
        self._cancel_timer = None
        self._cancel_listener = None
        self._cancel_state_listener = None

    async def async_start(self) -> None:
        """Start listeners and reconcile the current task state."""
        self._cancel_listener = self._manager.subscribe(self._handle_change)
        self.reschedule()
        self._subscribe_sensors()
        for task in self._manager.tasks:
            if self._is_active_problem(task):
                await self._trigger(task["task_id"])

    @callback
    def stop(self) -> None:
        """Stop time, task-change, and state listeners."""
        for listener in (
            self._cancel_timer,
            self._cancel_listener,
            self._cancel_state_listener,
        ):
            if listener:
                listener()
        self._cancel_timer = None
        self._cancel_listener = None
        self._cancel_state_listener = None

    @callback
    def _handle_change(self, change: TaskChange) -> None:
        if change.affects_tasks and change.action != "task_due":
            self.reschedule()
        self._handle_problem_change(change)

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


    @staticmethod
    def _is_problem_task(task: dict[str, Any]) -> bool:
        """Return whether a task is active and uses a problem sensor."""
        return (
            task.get("active", True)
            and task.get("schedule_type") == "sensor"
            and bool(task.get("problem_sensor"))
        )

    @callback
    def _subscribe_sensors(self) -> None:
        """Track only sensors referenced by active problem tasks."""
        if self._cancel_state_listener:
            self._cancel_state_listener()
        self._cancel_state_listener = async_track_state_change_event(
            self._hass,
            {
                task["problem_sensor"]
                for task in self._manager.tasks
                if self._is_problem_task(task)
            },
            self._handle_state_event,
        )

    def _is_active_problem(self, task: dict[str, Any]) -> bool:
        entity_id = task.get("problem_sensor")
        return self._is_problem_task(task) and self._hass.states.is_state(
            entity_id, STATE_ON
        )

    @callback
    def _handle_state_event(self, event: Event) -> None:
        new_state = event.data.get("new_state")
        old_state = event.data.get("old_state")
        if (
            new_state is None
            or new_state.state != STATE_ON
            or (old_state is not None and old_state.state == STATE_ON)
        ):
            return
        entity_id = event.data.get("entity_id")
        for task in self._manager.tasks:
            if (
                self._is_problem_task(task)
                and task.get("problem_sensor") == entity_id
            ):
                self._hass.async_create_task(
                    self._trigger(task["task_id"], event.time_fired)
                )

    @callback
    def _handle_problem_change(self, change: TaskChange) -> None:
        if change.action == "bulk_mutated":
            if change.data.get("problem_trigger_changed"):
                self._subscribe_sensors()
                for task_id in change.data.get("problem_task_ids", []):
                    self._hass.async_create_task(self._reconcile(task_id))
            return
        if (
            change.resource_type == "archive"
            or change.resource_type == "task"
            and (
                change.action in {"created", "deleted"}
                or change.action in {"updated", "saved"}
                and change.data.get("problem_trigger_changed")
            )
        ):
            self._subscribe_sensors()
        if (
            change.resource_type != "task"
            or change.action not in {"created", "updated", "saved"}
            or (
                change.action in {"updated", "saved"}
                and not change.data.get("problem_trigger_changed")
            )
        ):
            return
        if change.resource_id:
            self._hass.async_create_task(
                self._reconcile(change.resource_id)
            )

    async def _reconcile(self, task_id: str) -> None:
        try:
            task = self._manager.task(task_id)
        except ValueError:
            return
        if self._is_active_problem(task):
            await self._trigger(task_id)

    async def _trigger(
        self, task_id: str, triggered_at: datetime | None = None
    ) -> None:
        await self._manager.async_trigger_problem_task(
            task_id, (triggered_at or dt_util.utcnow()).isoformat()
        )
