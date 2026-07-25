"""Problem-sensor task handling."""

from __future__ import annotations

from datetime import datetime
from typing import Any

from homeassistant.const import EVENT_STATE_CHANGED, STATE_ON
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.util import dt as dt_util

from .const import EVENT_TASKS
from .due_events import fire_task_due


class ProblemSensorScheduler:
    """Make sensor-triggered tasks due when their binary sensor turns on."""

    def __init__(self, hass: HomeAssistant, store: Any) -> None:
        self._hass = hass
        self._store = store
        self._cancel_state_listener = None
        self._cancel_task_listener = None

    async def async_start(self) -> None:
        """Start listeners and catch up active problems after startup."""
        self._cancel_state_listener = self._hass.bus.async_listen(
            EVENT_STATE_CHANGED, self._handle_state_event
        )
        self._cancel_task_listener = self._hass.bus.async_listen(
            EVENT_TASKS, self._handle_task_event
        )
        for task in self._store.tasks:
            if self._is_active_problem(task):
                await self._trigger(task["task_id"])

    @callback
    def stop(self) -> None:
        """Stop event listeners."""
        for listener in (self._cancel_state_listener, self._cancel_task_listener):
            if listener:
                listener()
        self._cancel_state_listener = None
        self._cancel_task_listener = None

    def _is_active_problem(self, task: dict[str, Any]) -> bool:
        entity_id = task.get("problem_sensor")
        return (
            task.get("schedule_type") == "sensor"
            and bool(entity_id)
            and self._hass.states.is_state(entity_id, STATE_ON)
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
        for task in self._store.tasks:
            if (
                task.get("schedule_type") == "sensor"
                and task.get("problem_sensor") == entity_id
            ):
                self._hass.async_create_task(
                    self._trigger(task["task_id"], event.time_fired)
                )

    @callback
    def _handle_task_event(self, event: Event) -> None:
        if (
            event.data.get("resource_type") != "task"
            or event.data.get("action") not in {"created", "updated"}
            or (
                event.data.get("action") == "updated"
                and not event.data.get("problem_trigger_changed")
            )
        ):
            return
        task_id = event.data.get("resource_id")
        if task_id:
            self._hass.async_create_task(self._reconcile(task_id))

    async def _reconcile(self, task_id: str) -> None:
        try:
            task = self._store.task(task_id)
        except ValueError:
            return
        if self._is_active_problem(task):
            await self._trigger(task_id)

    async def _trigger(
        self, task_id: str, triggered_at: datetime | None = None
    ) -> None:
        task = await self._store.async_trigger_problem_task(
            task_id, (triggered_at or dt_util.utcnow()).isoformat()
        )
        if task is not None:
            fire_task_due(self._hass, task)
