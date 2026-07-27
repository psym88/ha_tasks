"""Authenticated Tasks WebSocket API."""

from datetime import timedelta
from functools import wraps
from itertools import islice
import mimetypes

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.components.file_upload import process_uploaded_file
from homeassistant.components.http.auth import async_sign_path
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.selector import FileSelector, FileSelectorConfig
from homeassistant.util import dt as dt_util

from .const import DOWNLOAD_URL
from .datetime_utils import normalize_utc_datetime, parse_aware_datetime
from .manager import TaskChange, get_manager
from .recurrence import occurrences

TEXT = vol.Any(str, None)
SCHEDULE_UNIT = vol.In(("daily", "weekly", "monthly", "yearly"))
SCHEDULE_INTERVAL = vol.All(vol.Coerce(int), vol.Range(min=1))
SCHEDULE_WEEKDAYS = [vol.All(vol.Coerce(int), vol.Range(min=0, max=6))]
SCHEDULE_DAY = vol.Any(
    vol.All(vol.Coerce(int), vol.Range(min=1, max=31)), "last", None
)
SCHEDULE_MONTH = vol.Any(
    vol.All(vol.Coerce(int), vol.Range(min=1, max=12)), None
)
SCHEDULE_TIME = vol.Match(r"^(?:[01]\d|2[0-3]):[0-5]\d$")
SCHEDULE_DETAILS = {
    vol.Optional("schedule_weekdays", default=[]): SCHEDULE_WEEKDAYS,
    vol.Optional("schedule_day"): SCHEDULE_DAY,
    vol.Optional("schedule_month"): SCHEDULE_MONTH,
    vol.Optional("schedule_time"): SCHEDULE_TIME,
}
RECURRENCE_FIELDS = {
    vol.Required("schedule_type"): vol.In(("fixed", "sliding")),
    vol.Required("schedule_unit"): SCHEDULE_UNIT,
    vol.Required("schedule_interval"): SCHEDULE_INTERVAL,
    **SCHEDULE_DETAILS,
}
SCHEDULE_FIELDS = {
    vol.Required("schedule_type"): vol.In(("fixed", "sliding", "sensor")),
    vol.Optional("schedule_unit"): SCHEDULE_UNIT,
    vol.Optional("schedule_interval"): SCHEDULE_INTERVAL,
    **SCHEDULE_DETAILS,
    vol.Optional("problem_sensor"): TEXT,
}
TASK_CREATE_FIELDS = {
    vol.Required("task_name"): str,
    vol.Optional("task_icon"): TEXT,
    vol.Optional("task_description"): TEXT,
    vol.Optional("active"): cv.boolean,
    vol.Optional("assignee_id"): TEXT,
    vol.Optional("label_ids"): [str],
    vol.Optional("nfc_tag_id"): TEXT,
    vol.Optional("notification_target"): vol.Schema(
        {vol.Optional("device_id"): [str]},
        extra=vol.PREVENT_EXTRA,
    ),
    vol.Optional("notification_persistent"): cv.boolean,
    vol.Optional("notification_critical"): cv.boolean,
    vol.Optional("notification_route"): vol.Any(
        None, vol.All(str, vol.Length(max=2048))
    ),
    vol.Optional("task_due"): vol.Any(str, None),
    **SCHEDULE_FIELDS,
}
TASK_UPDATE_FIELDS = {
    vol.Optional(key.schema): validator
    for key, validator in TASK_CREATE_FIELDS.items()
}
PREVIEW_FIELDS = {
    vol.Optional("task_due"): str,
    **RECURRENCE_FIELDS,
}
PREVIEW_COUNT = 24
ATTACHMENT_FILE_SELECTOR = FileSelector(FileSelectorConfig(accept="*/*"))


def _read_uploaded_file(
    hass: HomeAssistant, file_id: str
) -> tuple[str, str, bytes]:
    """Consume a native Home Assistant file upload outside the event loop."""
    with process_uploaded_file(hass, file_id) as file_path:
        filename = file_path.name
        content_type = (
            mimetypes.guess_type(filename)[0] or "application/octet-stream"
        )
        return filename, content_type, file_path.read_bytes()


@callback
def async_register(hass: HomeAssistant) -> None:
    for command in COMMANDS:
        websocket_api.async_register_command(hass, command)


def require_manager(func):
    @wraps(func)
    async def wrapper(hass, connection, msg):
        manager = get_manager(hass)
        if manager is None:
            connection.send_error(msg["id"], "not_loaded", "Integration not loaded")
            return
        try:
            await func(hass, connection, msg, manager)
        except (ValueError, KeyError) as err:
            connection.send_error(msg["id"], str(err), str(err))
    return wrapper


def _subscription_snapshot(
    manager, change: TaskChange | None = None
) -> dict:
    result = {
        "type": "snapshot",
        "revision": change.revision if change else manager.revision,
        **manager.snapshot(),
        "now": dt_util.utcnow().isoformat(),
    }
    if change is not None:
        result["change"] = {
            "action": change.action,
            "resource_type": change.resource_type,
            "resource_id": change.resource_id,
            **change.data,
        }
    return result


@websocket_api.websocket_command(
    {vol.Required("type"): "tasks/subscribe"}
)
@callback
def ws_subscribe(hass, connection, msg):
    """Subscribe with an immediate consistent Tasks snapshot."""
    manager = get_manager(hass)
    if manager is None:
        connection.send_error(
            msg["id"], "not_loaded", "Integration not loaded"
        )
        return
    snapshot = _subscription_snapshot(manager)
    connection.subscriptions[msg["id"]] = manager.subscribe(
        lambda change: connection.send_event(
            msg["id"], _subscription_snapshot(manager, change)
        )
    )
    connection.send_result(msg["id"])
    connection.send_event(msg["id"], snapshot)


@websocket_api.websocket_command({vol.Required("type"): "tasks/list"})
@websocket_api.async_response
@require_manager
async def ws_list(hass, connection, msg, manager):
    result = manager.snapshot()
    result["now"] = dt_util.utcnow().isoformat()
    result["users"] = [
        {"id": user.id, "name": user.name or user.id}
        for user in await hass.auth.async_get_users()
        if getattr(user, "is_active", True)
        and not getattr(user, "system_generated", False)
    ]
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {vol.Required("type"): "tasks/task/create", **TASK_CREATE_FIELDS}
)
@websocket_api.async_response
@require_manager
async def ws_task_create(hass, connection, msg, manager):
    result = await manager.async_add_task(
        msg, dt_util.utcnow(), context=connection.context(msg)
    )
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "tasks/task/update",
        vol.Required("task_id"): str,
        **TASK_UPDATE_FIELDS,
    }
)
@websocket_api.async_response
@require_manager
async def ws_task_update(hass, connection, msg, manager):
    result = await manager.async_update_task(
        msg["task_id"],
        msg,
        dt_util.utcnow(),
        context=connection.context(msg),
    )
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command({vol.Required("type"): "tasks/task/delete", vol.Required("task_id"): str})
@websocket_api.async_response
@require_manager
async def ws_task_delete(hass, connection, msg, manager):
    await manager.async_delete_task(
        msg["task_id"], context=connection.context(msg)
    )
    connection.send_result(msg["id"])


@websocket_api.websocket_command(
    {vol.Required("type"): "tasks/task/preview_next_due", **PREVIEW_FIELDS}
)
@websocket_api.async_response
@require_manager
async def ws_task_preview_next_due(hass, connection, msg, manager):
    """Preview recurrence using the authoritative backend scheduler."""
    if msg.get("task_due"):
        current = parse_aware_datetime(msg["task_due"])
        task_dues = [
            current,
            *islice(occurrences(msg, current), PREVIEW_COUNT - 1),
        ]
    else:
        task_dues = list(
            islice(occurrences(msg, dt_util.utcnow()), PREVIEW_COUNT)
        )
    serialized = [normalize_utc_datetime(due) for due in task_dues]
    connection.send_result(
        msg["id"],
        {"task_dues": serialized},
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "tasks/task/complete",
        vol.Required("task_id"): str,
        vol.Optional("completed_at"): str,
        vol.Optional("notes"): TEXT,
    }
)
@websocket_api.async_response
@require_manager
async def ws_task_complete(hass, connection, msg, manager):
    user = connection.user
    result = await manager.async_complete_task(
        msg["task_id"],
        msg.get("completed_at", dt_util.utcnow().isoformat()),
        user.id if user else None,
        user.name if user else "system",
        msg.get("notes"),
        context=connection.context(msg),
    )
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command({vol.Required("type"): "tasks/history/list", vol.Required("task_id"): str})
@websocket_api.async_response
@require_manager
async def ws_history_list(hass, connection, msg, manager):
    connection.send_result(
        msg["id"], {"history": manager.history(msg["task_id"])}
    )


@websocket_api.websocket_command({vol.Required("type"): "tasks/history/delete", vol.Required("task_id"): str, vol.Required("history_entry_id"): str})
@websocket_api.async_response
@require_manager
async def ws_history_delete(hass, connection, msg, manager):
    result = await manager.async_delete_history(
        msg["task_id"],
        msg["history_entry_id"],
        context=connection.context(msg),
    )
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "tasks/attachment/urls",
        vol.Required("task_id"): str,
    }
)
@websocket_api.async_response
@require_manager
async def ws_attachment_urls(hass, connection, msg, manager):
    manager.task(msg["task_id"])
    connection.send_result(
        msg["id"],
        {
            "signed_files": {
                item["attachment_id"]: async_sign_path(
                    hass,
                    f"{DOWNLOAD_URL}/{item['attachment_id']}",
                    timedelta(hours=1),
                    refresh_token_id=connection.refresh_token_id,
                )
                for item in manager.snapshot()["attachments"]
                if item["task_id"] == msg["task_id"]
            }
        },
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "tasks/attachment/create",
        vol.Required("task_id"): str,
        vol.Required("file_id"): ATTACHMENT_FILE_SELECTOR,
    }
)
@websocket_api.async_response
@require_manager
async def ws_attachment_create(hass, connection, msg, manager):
    filename, content_type, content = await hass.async_add_executor_job(
        _read_uploaded_file, hass, msg["file_id"]
    )
    record = await manager.async_add_attachment(
        msg["task_id"],
        filename,
        content_type,
        content,
        context=connection.context(msg),
    )
    connection.send_result(msg["id"], record)


@websocket_api.websocket_command({vol.Required("type"): "tasks/attachment/delete", vol.Required("attachment_id"): str})
@websocket_api.async_response
@require_manager
async def ws_attachment_delete(hass, connection, msg, manager):
    await manager.async_delete_attachment(
        msg["attachment_id"], context=connection.context(msg)
    )
    connection.send_result(msg["id"])


COMMANDS = (ws_subscribe, ws_list, ws_task_create, ws_task_update, ws_task_delete, ws_task_preview_next_due, ws_task_complete, ws_history_list, ws_history_delete, ws_attachment_urls, ws_attachment_create, ws_attachment_delete)
