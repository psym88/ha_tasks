"""Authenticated Tasks WebSocket API."""

from datetime import timedelta
from functools import wraps
from itertools import islice

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.components.http.auth import async_sign_path
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import config_validation as cv
from homeassistant.util import dt as dt_util

from .attachment_api import async_consume_uploads
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
FIXED_SCHEDULE = vol.Schema(
    {
        vol.Required("type"): "fixed",
        vol.Required("unit"): SCHEDULE_UNIT,
        vol.Required("interval"): SCHEDULE_INTERVAL,
        vol.Optional("weekdays", default=[]): SCHEDULE_WEEKDAYS,
        vol.Optional("day"): SCHEDULE_DAY,
        vol.Optional("month"): SCHEDULE_MONTH,
        vol.Optional("time"): SCHEDULE_TIME,
    },
    extra=vol.PREVENT_EXTRA,
)
SLIDING_SCHEDULE = vol.Schema(
    {
        vol.Required("type"): "sliding",
        vol.Required("unit"): SCHEDULE_UNIT,
        vol.Required("interval"): SCHEDULE_INTERVAL,
    },
    extra=vol.PREVENT_EXTRA,
)
SENSOR_SCHEDULE = vol.Schema(
    {
        vol.Required("type"): "sensor",
        vol.Required("condition_template"): str,
        vol.Optional("message_template"): TEXT,
    },
    extra=vol.PREVENT_EXTRA,
)
SCHEDULE = vol.Any(FIXED_SCHEDULE, SLIDING_SCHEDULE, SENSOR_SCHEDULE)
NOTIFICATION = vol.Schema(
    {
        vol.Optional("device_ids", default=[]): [str],
        vol.Optional("persistent", default=False): cv.boolean,
        vol.Optional("critical", default=False): cv.boolean,
        vol.Optional("route"): vol.Any(
            None, vol.All(str, vol.Length(max=2048))
        ),
    },
    extra=vol.PREVENT_EXTRA,
)
TASK_FIELDS = {
    vol.Required("name"): str,
    vol.Optional("icon"): TEXT,
    vol.Optional("description"): TEXT,
    vol.Optional("active"): cv.boolean,
    vol.Optional("assignee_id"): TEXT,
    vol.Optional("label_ids"): [str],
    vol.Optional("nfc_tag_id"): TEXT,
    vol.Optional("notification"): NOTIFICATION,
    vol.Optional("due"): vol.Any(str, None),
    vol.Required("schedule"): SCHEDULE,
}
TASK_UPDATE_FIELDS = {
    vol.Optional(key.schema): validator
    for key, validator in TASK_FIELDS.items()
}
BULK_OPERATION = vol.Any(
    vol.Schema(
        {
            vol.Required("action"): "update",
            vol.Required("id"): str,
            vol.Required("changes"): vol.Schema(
                TASK_UPDATE_FIELDS, extra=vol.PREVENT_EXTRA
            ),
        },
        extra=vol.PREVENT_EXTRA,
    ),
    vol.Schema(
        {
            vol.Required("action"): "complete",
            vol.Required("id"): str,
            vol.Optional("completed_at"): str,
            vol.Optional("notes"): TEXT,
        },
        extra=vol.PREVENT_EXTRA,
    ),
    vol.Schema(
        {
            vol.Required("action"): "delete",
            vol.Required("id"): str,
        },
        extra=vol.PREVENT_EXTRA,
    ),
)
PREVIEW_FIELDS = {
    vol.Optional("due"): str,
    vol.Required("schedule"): vol.Any(FIXED_SCHEDULE, SLIDING_SCHEDULE),
}
PREVIEW_COUNT = 24
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


@websocket_api.websocket_command(
    {
        vol.Required("type"): "tasks/task/save",
        vol.Optional("task_id"): str,
        vol.Optional("file_ids", default=[]): [str],
        vol.Optional("deleted_attachment_ids", default=[]): [str],
        vol.Optional("deleted_history_entry_ids", default=[]): [str],
        **TASK_FIELDS,
    }
)
@websocket_api.async_response
@require_manager
async def ws_task_save(hass, connection, msg, manager):
    """Commit one complete editor session."""
    user = connection.user
    uploads = await async_consume_uploads(
        hass,
        msg["file_ids"],
        user.id if user else None,
    )
    result = await manager.async_save_task(
        msg.get("task_id"),
        msg,
        uploads,
        msg["deleted_attachment_ids"],
        msg["deleted_history_entry_ids"],
        dt_util.utcnow(),
        context=connection.context(msg),
    )
    connection.send_result(msg["id"], result)


@websocket_api.websocket_command(
    {
        vol.Required("type"): "tasks/task/bulk",
        vol.Required("operations"): vol.All(
            [BULK_OPERATION], vol.Length(min=1)
        ),
    }
)
@websocket_api.async_response
@require_manager
async def ws_task_bulk(hass, connection, msg, manager):
    """Apply multiple task changes as one transaction."""
    user = connection.user
    results = await manager.async_bulk_mutate(
        msg["operations"],
        user.id if user else None,
        user.name if user else "system",
        dt_util.utcnow(),
        context=connection.context(msg),
    )
    connection.send_result(msg["id"], {"results": results})


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
    recurrence = {"schedule": msg["schedule"], "due": msg.get("due")}
    if msg.get("due"):
        current = parse_aware_datetime(msg["due"])
        dues = [
            current,
            *islice(occurrences(recurrence, current), PREVIEW_COUNT - 1),
        ]
    else:
        dues = list(
            islice(
                occurrences(recurrence, dt_util.utcnow()), PREVIEW_COUNT
            )
        )
    serialized = [normalize_utc_datetime(due) for due in dues]
    connection.send_result(
        msg["id"],
        {"dues": serialized},
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


@websocket_api.websocket_command(
    {
        vol.Required("type"): "tasks/attachment/urls",
        vol.Required("task_id"): str,
    }
)
@websocket_api.async_response
@require_manager
async def ws_attachment_urls(hass, connection, msg, manager):
    task = manager.task(msg["task_id"])
    connection.send_result(
        msg["id"],
        {
            "signed_files": {
                item["id"]: async_sign_path(
                    hass,
                    f"{DOWNLOAD_URL}/{item['id']}",
                    timedelta(hours=1),
                    refresh_token_id=connection.refresh_token_id,
                )
                for item in task["attachments"]
            }
        },
    )


COMMANDS = (
    ws_subscribe,
    ws_list,
    ws_task_update,
    ws_task_save,
    ws_task_bulk,
    ws_task_delete,
    ws_task_preview_next_due,
    ws_task_complete,
    ws_history_list,
    ws_attachment_urls,
)
