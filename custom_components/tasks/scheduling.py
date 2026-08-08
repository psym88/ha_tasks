"""Runtime scheduling for due times and problem sensors."""

from __future__ import annotations

from datetime import datetime
import re
from typing import Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import TemplateError
from homeassistant.helpers.event import (
    async_track_point_in_time,
    async_track_template_result,
)
from homeassistant.helpers.template import Template
from homeassistant.helpers.event import TrackTemplate
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
        self._cancel_template_listeners: list[Any] = []
        self._message_results: dict[str, str | None] = {}

    async def async_start(self) -> None:
        """Start listeners and reconcile the current task state."""
        self._cancel_listener = self._manager.subscribe(self._handle_change)
        self.reschedule()
        self._subscribe_templates()

    @callback
    def stop(self) -> None:
        """Stop time, task-change, and state listeners."""
        for listener in (
            self._cancel_timer,
            self._cancel_listener,
            *self._cancel_template_listeners,
        ):
            if listener:
                listener()
        self._cancel_timer = None
        self._cancel_listener = None
        self._cancel_template_listeners = []

    @callback
    def _handle_change(self, change: TaskChange) -> None:
        if change.affects_tasks and change.action not in {
            "due", "problem_runtime"
        }:
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
            and task.get("due")
            and (due := parse_aware_datetime(task["due"])) > now
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
            if not task.get("active", True) or not task.get("due"):
                continue
            due = parse_aware_datetime(task["due"])
            if target <= due <= fired_at:
                self._manager.task_became_due(task)
        self.reschedule()


    @staticmethod
    def _is_problem_task(task: dict[str, Any]) -> bool:
        """Return whether a task uses problem templates."""
        return (
            task["schedule"]["type"] == "sensor"
            and bool(task["schedule"].get("condition_template"))
        )

    @callback
    def _subscribe_templates(self) -> None:
        """Create one HA template subscription group per problem task."""
        for cancel in self._cancel_template_listeners:
            cancel()
        self._cancel_template_listeners = []
        self._message_results = {}
        for task in self._manager.tasks:
            if not self._is_problem_task(task):
                continue
            task_id = task["id"]
            task_active = task.get("active", True)
            condition = Template(
                task["schedule"]["condition_template"], self._hass
            )
            binary_sensor = re.fullmatch(
                r"\s*{{\s*is_state\(['\"](binary_sensor\.[^'\"]+)['\"],"
                r"\s*['\"]on['\"]\)\s*}}\s*",
                task["schedule"]["condition_template"],
            )
            binary_sensor_id = binary_sensor.group(1) if binary_sensor else None
            tracked = [TrackTemplate(condition, None)]
            message_value = task["schedule"].get("message_template")
            message = (
                Template(message_value, self._hass)
                if task_active and message_value else None
            )
            if message is not None:
                tracked.append(TrackTemplate(message, None))

            @callback
            def handle_updates(event, updates, *, task_id=task_id,
                               condition=condition, message=message,
                               binary_sensor_id=binary_sensor_id,
                               task_active=task_active) -> None:
                condition_update = next(
                    (item for item in updates if item.template is condition), None
                )
                message_update = next(
                    (item for item in updates if item.template is message), None
                )
                active = None
                if condition_update is not None:
                    sensor_state = (
                        self._hass.states.get(binary_sensor_id)
                        if binary_sensor_id else None
                    )
                    if binary_sensor_id and sensor_state is None:
                        status = "missing"
                    elif binary_sensor_id and sensor_state.state in {
                        "unknown", "unavailable"
                    }:
                        status = sensor_state.state
                    elif isinstance(condition_update.result, TemplateError) or not isinstance(
                        condition_update.result, bool
                    ):
                        status = "invalid"
                    else:
                        status = "valid"
                    active = (
                        task_active
                        and status == "valid"
                        and condition_update.result is True
                    )
                    self._manager.set_problem_runtime(
                        task_id, active, status, binary_sensor_id
                    )
                if message_update is not None and not isinstance(
                    message_update.result, TemplateError
                ):
                    self._message_results[task_id] = str(
                        message_update.result
                    ).strip() or None
                trigger = active is True
                record_message = trigger or (
                    message_update is not None
                    and message_update.last_result is not None
                )
                if trigger or record_message:
                    self._hass.async_create_task(
                        self._manager.async_record_problem_update(
                            task_id,
                            (
                                event.time_fired
                                if event is not None else dt_util.utcnow()
                            ).isoformat(),
                            trigger=trigger,
                            message=(
                                self._message_results.get(task_id)
                                if record_message else None
                            ),
                        )
                    )

            info = async_track_template_result(
                self._hass, tracked, handle_updates
            )
            self._cancel_template_listeners.append(info.async_remove)
            info.async_refresh()

    @callback
    def _handle_problem_change(self, change: TaskChange) -> None:
        if change.action == "bulk_mutated":
            if change.data.get("problem_trigger_changed"):
                self._subscribe_templates()
            return
        problem_trigger_changed = bool(
            change.data.get("problem_trigger_changed")
        )
        if (
            change.resource_type == "archive"
            or (
                change.resource_type == "task"
                and (
                    change.action == "deleted"
                    or change.action in {"updated", "saved"}
                    and problem_trigger_changed
                )
            )
        ):
            self._subscribe_templates()
