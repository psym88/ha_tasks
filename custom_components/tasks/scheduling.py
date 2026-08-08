"""Runtime scheduling for due times and problem sensors."""

from __future__ import annotations

from collections.abc import Callable
from datetime import datetime
from typing import Any

from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import TemplateError
from homeassistant.helpers.event import (
    TrackTemplate,
    async_track_point_in_time,
    async_track_template_result,
)
from homeassistant.helpers.start import async_at_started
from homeassistant.helpers.template import Template
from homeassistant.util import dt as dt_util

from .datetime_utils import parse_aware_datetime
from .manager import TaskChange, TaskManager


def _condition_has_warning(
    hass: HomeAssistant, condition_template: str
) -> bool:
    """Return whether a condition cannot currently prove it can trigger."""
    try:
        info = Template(condition_template, hass).async_render_to_info(
            strict=True
        )
        result = info.result()
    except TemplateError:
        return True
    if not isinstance(result, bool):
        return True
    if result:
        return False
    if info.is_static:
        return True
    return any(
        (state := hass.states.get(entity_id)) is None
        or state.state in {"unknown", "unavailable"}
        for entity_id in info.entities
    )


class TaskEngine:
    """Run calendar due timers and problem-template task triggers."""

    def __init__(self, hass: HomeAssistant, manager: TaskManager) -> None:
        self._hass = hass
        self._manager = manager
        self._cancel_timer: Callable[[], None] | None = None
        self._cancel_listener: Callable[[], None] | None = None
        self._cancel_startup_audit: Callable[[], None] | None = None
        self._problem_trackers: dict[
            str, tuple[str, Callable[[], None]]
        ] = {}

    async def async_start(self) -> None:
        """Start listeners and reconcile the current task state."""
        self._manager.set_problem_health_auditor(
            self._audit_problem_health
        )
        self._cancel_listener = self._manager.subscribe(self._handle_change)
        self.reschedule()
        self._sync_problem_trackers()
        self._cancel_startup_audit = async_at_started(
            self._hass, self._audit_problem_health
        )

    @callback
    def stop(self) -> None:
        """Stop time, task-change, startup, and template listeners."""
        self._manager.set_problem_health_auditor(None)
        for listener in (
            self._cancel_timer,
            self._cancel_listener,
            self._cancel_startup_audit,
            *(cancel for _, cancel in self._problem_trackers.values()),
        ):
            if listener:
                listener()
        self._cancel_timer = None
        self._cancel_listener = None
        self._cancel_startup_audit = None
        self._problem_trackers.clear()

    @callback
    def _handle_change(self, change: TaskChange) -> None:
        if not change.affects_tasks:
            return
        if change.action != "due":
            self.reschedule()
        completed_ids = (
            [change.resource_id]
            if change.action == "completed" and change.resource_id
            else [
                operation["id"]
                for operation in change.data.get("operations", [])
                if operation["action"] == "complete"
            ]
            if change.action == "bulk_mutated"
            else []
        )
        for task_id in completed_ids:
            if tracked := self._problem_trackers.pop(task_id, None):
                tracked[1]()
        self._sync_problem_trackers()
        if change.action == "saved" and change.resource_id:
            self._hass.async_create_task(
                self._refresh_problem_warning(change.resource_id)
            )

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
    def _is_active_problem_task(task: dict[str, Any]) -> bool:
        """Return whether a task needs a live problem-condition tracker."""
        return (
            task.get("active", True)
            and task["schedule"]["type"] == "sensor"
            and bool(task["schedule"].get("condition_template"))
        )

    @callback
    def _sync_problem_trackers(self) -> None:
        """Add, retain, or remove the one tracker needed by each task."""
        desired = {
            task["id"]: task["schedule"]["condition_template"]
            for task in self._manager.tasks
            if self._is_active_problem_task(task)
        }
        for task_id, (template, cancel) in tuple(
            self._problem_trackers.items()
        ):
            if desired.get(task_id) != template:
                cancel()
                del self._problem_trackers[task_id]
        for task_id, condition_template in desired.items():
            if task_id in self._problem_trackers:
                continue
            condition = Template(condition_template, self._hass)

            @callback
            def handle_update(event, updates, *, task_id=task_id) -> None:
                result = updates[0].result
                if result is not True:
                    return
                occurred_at = (
                    event.time_fired if event is not None else dt_util.utcnow()
                ).isoformat()
                self._hass.async_create_task(
                    self._trigger_problem(task_id, occurred_at)
                )

            tracker = async_track_template_result(
                self._hass,
                [TrackTemplate(condition, None)],
                handle_update,
                strict=True,
            )
            self._problem_trackers[task_id] = (
                condition_template,
                tracker.async_remove,
            )
            tracker.async_refresh()

    async def _trigger_problem(
        self, task_id: str, occurred_at: str
    ) -> None:
        """Snapshot the current message and open one problem incident."""
        try:
            task = self._manager.task(task_id)
        except ValueError:
            return
        message_template = task["schedule"].get("message_template")
        message = None
        if message_template:
            try:
                message = str(
                    Template(message_template, self._hass).async_render(
                        strict=True
                    )
                ).strip() or None
            except TemplateError:
                pass
        await self._manager.async_trigger_problem_task(
            task_id, occurred_at, message
        )

    @callback
    def _audit_problem_health(
        self, _hass: HomeAssistant | None = None
    ) -> None:
        """Refresh every active problem task's health warning."""
        self._cancel_startup_audit = None
        warnings = {
            task["id"]
            for task in self._manager.tasks
            if self._is_active_problem_task(task)
            and _condition_has_warning(
                self._hass, task["schedule"]["condition_template"]
            )
        }
        self._manager.set_problem_warnings(warnings)

    async def _refresh_problem_warning(self, task_id: str) -> None:
        """Recheck only the problem task just saved in the editor."""
        try:
            task = self._manager.task(task_id)
        except ValueError:
            return
        warning = self._is_active_problem_task(task) and (
            _condition_has_warning(
                self._hass, task["schedule"]["condition_template"]
            )
        )
        self._manager.set_problem_warning(task_id, warning)
