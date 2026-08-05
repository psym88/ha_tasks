"""LLM tools for Tasks."""

from datetime import datetime, timedelta
from typing import Any, override

import voluptuous as vol

from homeassistant.components.llm import LLMTools
from homeassistant.core import HomeAssistant, callback
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.llm import LLM_API_ASSIST, LLMContext, Tool, ToolInput
from homeassistant.util import dt as dt_util
from homeassistant.util.json import JsonObjectType

from .const import DOMAIN
from .datetime_utils import parse_aware_datetime
from .manager import get_manager

PENDING_DELETIONS = f"{DOMAIN}_llm_pending_deletions"
DELETE_CONFIRMATION_TTL = timedelta(minutes=5)

SCHEDULE_UNIT = vol.In(["daily", "weekly", "monthly", "yearly"])
SCHEDULE_INTERVAL = vol.All(int, vol.Range(min=1))
SCHEDULE_TIME = vol.Match(r"^(?:[01]\d|2[0-3]):[0-5]\d$")
SCHEDULE_DAY = vol.Any(vol.All(int, vol.Range(min=1, max=31)), "last")
SCHEDULE_MONTH = vol.All(int, vol.Range(min=1, max=12))
WEEKDAYS = vol.All(
    [vol.All(int, vol.Range(min=0, max=6))], vol.Length(min=1)
)

def _validate_schedule(schedule: dict[str, Any]) -> dict[str, Any]:
    """Validate fields that depend on the selected recurrence shape."""
    calendar_fields = {"weekdays", "day", "month", "time"}
    if schedule["type"] == "sliding":
        if calendar_fields.intersection(schedule):
            raise vol.Invalid(
                "sliding schedules cannot contain calendar fields"
            )
        return schedule

    if "time" not in schedule:
        raise vol.Invalid(
            "time is required for fixed schedules; ask the user"
        )
    unit = schedule["unit"]
    required = {
        "daily": set(),
        "weekly": {"weekdays"},
        "monthly": {"day"},
        "yearly": {"day", "month"},
    }[unit]
    missing = required.difference(schedule)
    if missing:
        raise vol.Invalid(
            f"{', '.join(sorted(missing))} required for fixed {unit} schedule"
        )
    allowed = {"type", "unit", "interval", "time", *required}
    unexpected = set(schedule).difference(allowed)
    if unexpected:
        raise vol.Invalid(
            f"unexpected fields for fixed {unit} schedule: "
            f"{', '.join(sorted(unexpected))}"
        )
    return schedule


SCHEDULE = vol.All(
    vol.Schema(
        {
            vol.Required(
                "type",
                description=(
                    "fixed for calendar dates/times; sliding for recurrence "
                    "after completion."
                ),
            ): vol.In(["fixed", "sliding"]),
            vol.Required("unit"): SCHEDULE_UNIT,
            vol.Required(
                "interval",
                description=(
                    "Number of selected units between occurrences. Use 1 for "
                    "every week or every year, not 7 or 365."
                ),
            ): SCHEDULE_INTERVAL,
            vol.Optional(
                "weekdays",
                description=(
                    "Required only for fixed weekly schedules. Array using "
                    "0=Monday through 6=Sunday; Thursday is [3]."
                ),
            ): WEEKDAYS,
            vol.Optional(
                "day",
                description=(
                    "Required for fixed monthly/yearly schedules: day 1-31 "
                    "or last. Do not use month_day."
                ),
            ): SCHEDULE_DAY,
            vol.Optional(
                "month",
                description=(
                    "Required for fixed yearly schedules: 1=January through "
                    "12=December; August is 8."
                ),
            ): SCHEDULE_MONTH,
            vol.Optional(
                "time",
                description=(
                    "Required for every fixed schedule. Explicit user-provided "
                    "local time in 24-hour HH:MM; never invent a default."
                ),
            ): SCHEDULE_TIME,
        },
        extra=vol.PREVENT_EXTRA,
    ),
    _validate_schedule,
)


async def _users(hass: HomeAssistant) -> list[Any]:
    """Return active assignable Home Assistant users."""
    return [
        user
        for user in await hass.auth.async_get_users()
        if getattr(user, "is_active", True)
        and not getattr(user, "system_generated", False)
    ]


def _resolve_user(
    users: list[Any], value: str, current_user_id: str | None = None
) -> Any:
    """Resolve exactly one user by stable ID or case-insensitive name."""
    requested = value.strip()
    if requested == "current_user":
        if current_user_id is None:
            raise HomeAssistantError("Current Home Assistant user is unavailable")
        requested = current_user_id
    by_id = [user for user in users if user.id == requested]
    if by_id:
        return by_id[0]
    matches = [
        user
        for user in users
        if (user.name or "").strip().casefold() == requested.casefold()
    ]
    if not matches:
        raise HomeAssistantError(f"Person not found: {requested}")
    if len(matches) > 1:
        raise HomeAssistantError(f"Person name is ambiguous: {requested}")
    return matches[0]


def _task_result(
    task: dict[str, Any],
    users_by_id: dict[str, Any] | None = None,
    now: datetime | None = None,
) -> JsonObjectType:
    """Return the task fields useful to an LLM."""
    assignee = None
    if users_by_id and (user := users_by_id.get(task.get("assignee_id"))):
        assignee = {"id": user.id, "name": user.name or user.id}
    due_status = "waiting"
    local_due = None
    if due := task.get("due"):
        current = now or dt_util.now()
        local_due = dt_util.as_local(parse_aware_datetime(due))
        if local_due <= current:
            due_status = (
                "overdue" if local_due.date() < current.date() else "due"
            )
        else:
            due_status = "upcoming"
    return {
        "id": task["id"],
        "name": task["name"],
        "description": task.get("description"),
        "due": local_due.isoformat() if local_due else None,
        "due_status": due_status,
        "schedule": task["schedule"],
        "assignee": assignee,
    }


def _manager(hass: HomeAssistant):
    """Return the loaded manager or raise a tool-safe error."""
    manager = get_manager(hass)
    if manager is None:
        raise HomeAssistantError("Tasks integration is not loaded")
    return manager


class ListOpenTasksTool(Tool):
    """List active Tasks awaiting their next completion."""

    name = "tasks_list_open"
    description = (
        "List active Tasks awaiting their next completion, optionally filtered "
        "by assigned person and by due, today, or the current Monday-Sunday "
        "week. Due includes every reached due time, including overdue Tasks. "
        "Call this before completing a task to obtain its exact ID."
    )
    parameters = vol.Schema(
        {
            vol.Optional(
                "assignee",
                description=(
                    "Exact Home Assistant user name or ID, or current_user for "
                    "first-person requests such as my Tasks or Tasks for me, "
                    "or unassigned when only Tasks without a person are asked "
                    "for. "
                    "This parameter must be provided whenever the request "
                    "identifies a person."
                ),
            ): str,
            vol.Optional(
                "range",
                default="all",
                description=(
                    "Use due for currently due or overdue Tasks, today for the "
                    "calendar day, week for Monday-Sunday, or all."
                ),
            ): vol.In(
                ["all", "due", "today", "week"]
            ),
        }
    )

    @override
    async def async_call(
        self,
        hass: HomeAssistant,
        tool_input: ToolInput,
        llm_context: LLMContext,
    ) -> JsonObjectType:
        """Return active tasks."""
        data = self.parameters(tool_input.tool_args)
        users = await _users(hass)
        users_by_id = {user.id: user for user in users}
        assignee_id = None
        unassigned = data.get("assignee") == "unassigned"
        if assignee := data.get("assignee"):
            if not unassigned:
                context = llm_context.context
                assignee_id = _resolve_user(
                    users,
                    assignee,
                    context.user_id if context else None,
                ).id

        now = dt_util.now()
        start = end = None
        if data["range"] in {"today", "week"}:
            start = now.replace(hour=0, minute=0, second=0, microsecond=0)
            if data["range"] == "week":
                start -= timedelta(days=start.weekday())
                end = start + timedelta(days=7)
            else:
                end = start + timedelta(days=1)

        def matches(task: dict[str, Any]) -> bool:
            if not task.get("active", True):
                return False
            if unassigned and task.get("assignee_id"):
                return False
            if assignee_id and task.get("assignee_id") != assignee_id:
                return False
            if data["range"] == "all":
                return True
            due = task.get("due")
            if due is None:
                return False
            local_due = dt_util.as_local(parse_aware_datetime(due))
            if data["range"] == "due":
                return local_due <= now
            assert start is not None and end is not None
            return start <= local_due < end

        tasks = [
            _task_result(task, users_by_id, now)
            for task in _manager(hass).tasks
            if matches(task)
        ]
        return {
            "current_time": now.isoformat(),
            "timezone": str(now.tzinfo),
            "applied_filters": {
                "assignee": (
                    "unassigned"
                    if unassigned
                    else {
                        "id": assignee_id,
                        "name": users_by_id[assignee_id].name or assignee_id,
                    }
                    if assignee_id
                    else None
                ),
                "range": data["range"],
            },
            "tasks": tasks,
        }


class TaskDetailsTool(Tool):
    """Return one task and its completion history."""

    name = "tasks_get_details"
    description = (
        "Get details and completion history for one Task using an exact ID "
        "returned by tasks_list_open."
    )
    parameters = vol.Schema({vol.Required("task_id"): str})

    @override
    async def async_call(
        self,
        hass: HomeAssistant,
        tool_input: ToolInput,
        llm_context: LLMContext,
    ) -> JsonObjectType:
        """Return targeted task details instead of exposing all history."""
        del llm_context
        data = self.parameters(tool_input.tool_args)
        manager = _manager(hass)
        try:
            task = manager.task(data["task_id"])
            history = manager.history(task["id"])
        except (KeyError, ValueError) as err:
            raise HomeAssistantError("Task not found") from err
        users = await _users(hass)
        return {
            "task": _task_result(task, {user.id: user for user in users}),
            "history": history,
        }


class CompleteTaskTool(Tool):
    """Complete one Task by its stable ID."""

    name = "tasks_complete"
    description = (
        "Complete one Task using the exact ID returned by tasks_list_open. "
        "Never guess an ID from a task name. Completing is not deleting; never "
        "use this tool when the user asks to delete or remove a Task."
    )
    parameters = vol.Schema(
        {
            vol.Required("task_id"): str,
            vol.Optional("notes"): vol.Any(str, None),
        }
    )

    @override
    async def async_call(
        self,
        hass: HomeAssistant,
        tool_input: ToolInput,
        llm_context: LLMContext,
    ) -> JsonObjectType:
        """Complete a task through the application service."""
        data = self.parameters(tool_input.tool_args)
        manager = _manager(hass)
        try:
            current = manager.task(data["task_id"])
        except (KeyError, ValueError) as err:
            raise HomeAssistantError("Task not found") from err
        if not current.get("active", True):
            raise HomeAssistantError("Task is paused")

        context = llm_context.context
        user_id = context.user_id if context else None
        user = await hass.auth.async_get_user(user_id) if user_id else None
        try:
            task = await manager.async_complete_task(
                current["id"],
                dt_util.utcnow().isoformat(),
                user_id,
                user.name if user and user.name else "system",
                data.get("notes"),
                context=context,
                source="llm",
            )
        except (KeyError, ValueError) as err:
            raise HomeAssistantError("Task could not be completed") from err
        users = await _users(hass)
        return {
            "task": _task_result(task, {user.id: user for user in users})
        }


class CreateTaskTool(Tool):
    """Create one recurring Task with an explicit schedule."""

    name = "tasks_create"
    description = (
        "Create a recurring Task only after the user has provided an explicit "
        "schedule. Sliding schedules recur from completion; fixed schedules "
        "follow calendar dates and require a 24-hour HH:MM time. Ask the user "
        "for the time when it is missing and do not call this tool yet. For "
        "example, every Thursday at 09:00 is "
        '{"type":"fixed","unit":"weekly","interval":1,'
        '"weekdays":[3],"time":"09:00"}; every August 1 at 09:00 is '
        '{"type":"fixed","unit":"yearly","interval":1,"day":1,'
        '"month":8,"time":"09:00"}. A person may be assigned by name.'
    )
    parameters = vol.Schema(
        {
            vol.Required("name"): vol.All(str, vol.Length(min=1)),
            vol.Optional("description"): vol.Any(str, None),
            vol.Optional(
                "assignee",
                description=(
                    "Exact Home Assistant user name or ID, or current_user "
                    "when the user asks to assign the new Task to me."
                ),
            ): str,
            vol.Required("schedule"): SCHEDULE,
        }
    )

    @override
    async def async_call(
        self,
        hass: HomeAssistant,
        tool_input: ToolInput,
        llm_context: LLMContext,
    ) -> JsonObjectType:
        """Create a task through the editor transaction service."""
        data = self.parameters(tool_input.tool_args)
        payload = {
            "name": data["name"].strip(),
            "description": data.get("description"),
            "active": True,
            "schedule": data["schedule"],
        }
        if not payload["name"]:
            raise HomeAssistantError("Task name is required")
        if assignee := data.get("assignee"):
            context = llm_context.context
            payload["assignee_id"] = _resolve_user(
                await _users(hass),
                assignee,
                context.user_id if context else None,
            ).id
        try:
            result = await _manager(hass).async_save_task(
                None,
                payload,
                [],
                [],
                [],
                dt_util.utcnow(),
                context=llm_context.context,
            )
        except (KeyError, ValueError) as err:
            raise HomeAssistantError("Task could not be created") from err
        users = await _users(hass)
        return {
            "task": _task_result(
                result["task"], {user.id: user for user in users}
            )
        }


class AssignTaskTool(Tool):
    """Assign or unassign one Task."""

    name = "tasks_assign"
    description = (
        "Assign one Task to a Home Assistant person by exact name or ID. "
        "Use null to remove the assignment and an exact Task ID from "
        "tasks_list_open."
    )
    parameters = vol.Schema(
        {
            vol.Required("task_id"): str,
            vol.Required(
                "assignee",
                description=(
                    "Exact Home Assistant user name or ID, current_user for "
                    "first-person requests, or null to remove the assignment."
                ),
            ): vol.Any(str, None),
        }
    )

    @override
    async def async_call(
        self,
        hass: HomeAssistant,
        tool_input: ToolInput,
        llm_context: LLMContext,
    ) -> JsonObjectType:
        """Update only the assignment through the application service."""
        data = self.parameters(tool_input.tool_args)
        users = await _users(hass)
        assignee = data["assignee"]
        context = llm_context.context
        assignee_id = (
            _resolve_user(
                users,
                assignee,
                context.user_id if context else None,
            ).id
            if assignee is not None
            else None
        )
        try:
            task = await _manager(hass).async_update_task(
                data["task_id"],
                {"assignee_id": assignee_id},
                dt_util.utcnow(),
                context=llm_context.context,
            )
        except (KeyError, ValueError) as err:
            raise HomeAssistantError("Task could not be assigned") from err
        return {
            "task": _task_result(task, {user.id: user for user in users})
        }


class DeleteTaskTool(Tool):
    """Delete one Task only after a separate confirmation turn."""

    name = "tasks_delete"
    description = (
        "Permanently delete one Task using an exact ID from tasks_list_open. "
        "The first call must use confirmed=false and only prepares a specific "
        "confirmation question. Stop and ask the user that question. Only "
        "after the user explicitly confirms may a later call use "
        "confirmed=true. Never call both steps in the same response."
    )
    parameters = vol.Schema(
        {
            vol.Required("task_id"): str,
            vol.Required(
                "confirmed",
                description=(
                    "False before asking the user; true only in a later turn "
                    "after the user explicitly confirms deletion."
                ),
            ): bool,
        }
    )

    @override
    async def async_call(
        self,
        hass: HomeAssistant,
        tool_input: ToolInput,
        llm_context: LLMContext,
    ) -> JsonObjectType:
        """Prepare or execute a confirmed permanent deletion."""
        data = self.parameters(tool_input.tool_args)
        context = llm_context.context
        user_id = context.user_id if context else None
        if user_id is None:
            raise HomeAssistantError(
                "A Home Assistant user is required to delete a Task"
            )

        manager = _manager(hass)
        try:
            task = manager.task(data["task_id"])
        except (KeyError, ValueError) as err:
            raise HomeAssistantError("Task not found") from err

        pending = hass.data.setdefault(PENDING_DELETIONS, {})
        key = (user_id, task["id"])
        now = dt_util.utcnow()
        if not data["confirmed"]:
            pending[key] = now
            return {
                "confirmation_required": True,
                "task": {"id": task["id"], "name": task["name"]},
                "question": (
                    f'Do you really want to permanently delete the Task '
                    f'"{task["name"]}"?'
                ),
            }

        prepared_at = pending.pop(key, None)
        if prepared_at is None or now - prepared_at > DELETE_CONFIRMATION_TTL:
            raise HomeAssistantError(
                "Deletion was not prepared or its confirmation expired"
            )
        try:
            await manager.async_delete_task(task["id"], context=context)
        except (KeyError, ValueError) as err:
            raise HomeAssistantError("Task could not be deleted") from err
        return {
            "deleted": True,
            "task": {"id": task["id"], "name": task["name"]},
        }


@callback
def async_get_tools(
    hass: HomeAssistant, llm_context: LLMContext, api_id: str
) -> LLMTools | None:
    """Return Tasks tools for the built-in Assist LLM API."""
    if api_id != LLM_API_ASSIST or get_manager(hass) is None:
        return None
    return LLMTools(
        tools=[
            ListOpenTasksTool(),
            TaskDetailsTool(),
            CompleteTaskTool(),
            CreateTaskTool(),
            AssignTaskTool(),
            DeleteTaskTool(),
        ],
        prompt=(
            "Use the Tasks tools for the Tasks integration. Always call "
            "tasks_list_open before tasks_complete and use the returned ID. "
            "Due Tasks include overdue Tasks. Always use current_time and "
            "due_status returned by the tool instead of the model's date. "
            "When the user names a person, always pass that name as the "
            "assignee filter and only report Tasks returned by that filtered "
            "call; never include unassigned Tasks. For first-person requests "
            "such as my Tasks or Tasks for me, pass assignee=current_user. "
            "When the user asks for Tasks without a person assignment, pass "
            "assignee=unassigned; an assignee value of null means no filter. "
            "Only report Tasks returned by the applied filter, and treat a "
            "Task whose assignee is null as unassigned. "
            "Never claim that a Task was deleted after tasks_complete. For "
            "deletion, call tasks_delete with confirmed=false, stop and ask "
            "the returned question, then call it with confirmed=true only in "
            "a later turn after explicit user confirmation. "
            "After any tool error, state that the requested operation failed; "
            "never claim success and never invent or announce a default time. "
            "Do not create a Task until its recurrence and, for fixed "
            "schedules, its time are explicit; ask the user for missing data."
        ),
    )
