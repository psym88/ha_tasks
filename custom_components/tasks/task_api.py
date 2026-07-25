"""Authenticated Tasks WebSocket API."""

from datetime import timedelta
from functools import wraps
from itertools import islice
import json
import mimetypes
from typing import Any
import zipfile

import voluptuous as vol
from homeassistant.components import websocket_api
from homeassistant.components.file_upload import process_uploaded_file
from homeassistant.components.http.auth import async_sign_path
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers import config_validation as cv
from homeassistant.helpers.selector import FileSelector, FileSelectorConfig
from homeassistant.util import dt as dt_util

from .const import DOWNLOAD_URL
from .attachment_api import _parse_archive_with_report
from .due_events import normalize_task_due, parse_task_due
from .recurrence import occurrences
from .task_events import async_fire_tasks_event
from .task_store import get_store

TEXT = vol.Any(str, None)
RECURRENCE_FIELDS = {
    vol.Required("schedule_type"): vol.In(("fixed", "sliding")),
    vol.Required("schedule_unit"): vol.In(("daily", "weekly", "monthly", "yearly")),
    vol.Required("schedule_interval"): vol.All(vol.Coerce(int), vol.Range(min=1)),
    vol.Optional("schedule_weekdays", default=[]): [
        vol.All(vol.Coerce(int), vol.Range(min=0, max=6))
    ],
    vol.Optional("schedule_day"): vol.Any(
        vol.All(vol.Coerce(int), vol.Range(min=1, max=31)), "last", None
    ),
    vol.Optional("schedule_month"): vol.Any(
        vol.All(vol.Coerce(int), vol.Range(min=1, max=12)), None
    ),
}
SCHEDULE_FIELDS = {
    vol.Required("schedule_type"): vol.In(("fixed", "sliding", "sensor")),
    vol.Optional("schedule_unit"): vol.In(("daily", "weekly", "monthly", "yearly")),
    vol.Optional("schedule_interval"): vol.All(vol.Coerce(int), vol.Range(min=1)),
    vol.Optional("schedule_weekdays", default=[]): [
        vol.All(vol.Coerce(int), vol.Range(min=0, max=6))
    ],
    vol.Optional("schedule_day"): vol.Any(
        vol.All(vol.Coerce(int), vol.Range(min=1, max=31)), "last", None
    ),
    vol.Optional("schedule_month"): vol.Any(
        vol.All(vol.Coerce(int), vol.Range(min=1, max=12)), None
    ),
    vol.Optional("problem_sensor"): TEXT,
}
TASK_CREATE_FIELDS = {
    vol.Required("task_name"): str,
    vol.Optional("task_icon"): TEXT,
    vol.Optional("task_description"): TEXT,
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
ARCHIVE_FILE_SELECTOR = FileSelector(
    FileSelectorConfig(accept=".zip,application/zip")
)


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


def _parse_uploaded_archive_with_report(
    hass: HomeAssistant, file_id: str
) -> tuple[dict, dict[str, bytes], dict]:
    """Consume a native backup upload and include its conversion report."""
    with process_uploaded_file(hass, file_id) as file_path:
        return _parse_archive_with_report(file_path.read_bytes())


@callback
def async_register(hass: HomeAssistant) -> None:
    for command in COMMANDS:
        websocket_api.async_register_command(hass, command)


def require_store(func):
    @wraps(func)
    async def wrapper(hass, connection, msg):
        store = get_store(hass)
        if store is None:
            connection.send_error(msg["id"], "not_loaded", "Integration not loaded")
            return
        try:
            await func(hass, connection, msg, store)
        except (ValueError, KeyError) as err:
            connection.send_error(msg["id"], str(err), str(err))
    return wrapper


def updated(
    hass: HomeAssistant,
    connection,
    msg: dict[str, Any],
    action: str,
    resource_type: str,
    resource_id: str | None = None,
    **data: Any,
) -> None:
    async_fire_tasks_event(
        hass,
        action,
        resource_type,
        resource_id,
        context=connection.context(msg),
        **data,
    )


@websocket_api.websocket_command({vol.Required("type"): "tasks/list"})
@websocket_api.async_response
@require_store
async def ws_list(hass, connection, msg, store):
    result = store.snapshot()
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
@require_store
async def ws_task_create(hass, connection, msg, store):
    result = await store.async_add_task(msg, dt_util.utcnow())
    connection.send_result(msg["id"], result)
    updated(
        hass, connection, msg, "created", "task", result["task_id"],
        resource_name=result["task_name"],
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "tasks/task/update",
        vol.Required("task_id"): str,
        **TASK_UPDATE_FIELDS,
    }
)
@websocket_api.async_response
@require_store
async def ws_task_update(hass, connection, msg, store):
    previous = store.task(msg["task_id"])
    result = await store.async_update_task(
        msg["task_id"], msg, dt_util.utcnow()
    )
    connection.send_result(msg["id"], result)
    updated(
        hass, connection, msg, "updated", "task", msg["task_id"],
        resource_name=result["task_name"],
        problem_trigger_changed=(
            previous.get("schedule_type") != result.get("schedule_type")
            or previous.get("problem_sensor") != result.get("problem_sensor")
        ),
    )


@websocket_api.websocket_command({vol.Required("type"): "tasks/task/delete", vol.Required("task_id"): str})
@websocket_api.async_response
@require_store
async def ws_task_delete(hass, connection, msg, store):
    task = store.task(msg["task_id"])
    await store.async_delete_task(msg["task_id"])
    connection.send_result(msg["id"])
    updated(
        hass, connection, msg, "deleted", "task", msg["task_id"],
        resource_name=task.get("task_name") if task else None,
    )


@websocket_api.websocket_command(
    {vol.Required("type"): "tasks/task/preview_next_due", **PREVIEW_FIELDS}
)
@websocket_api.async_response
@require_store
async def ws_task_preview_next_due(hass, connection, msg, store):
    """Preview recurrence using the authoritative backend scheduler."""
    if msg.get("task_due"):
        current = parse_task_due(msg["task_due"])
        task_dues = [
            current,
            *islice(occurrences(msg, current), PREVIEW_COUNT - 1),
        ]
    else:
        task_dues = list(
            islice(occurrences(msg, dt_util.utcnow()), PREVIEW_COUNT)
        )
    serialized = [normalize_task_due(due.isoformat()) for due in task_dues]
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
@require_store
async def ws_task_complete(hass, connection, msg, store):
    user = connection.user
    result = await store.async_complete_task(
        msg["task_id"],
        msg.get("completed_at", dt_util.utcnow().isoformat()),
        user.id if user else None,
        user.name if user else "system",
        msg.get("notes"),
    )
    connection.send_result(msg["id"], result)
    updated(
        hass, connection, msg, "completed", "task", msg["task_id"],
        resource_name=result.get("task_name"),
    )


@websocket_api.websocket_command({vol.Required("type"): "tasks/history/list", vol.Required("task_id"): str})
@websocket_api.async_response
@require_store
async def ws_history_list(hass, connection, msg, store):
    connection.send_result(msg["id"], {"history": store.history(msg["task_id"])})


@websocket_api.websocket_command({vol.Required("type"): "tasks/history/delete", vol.Required("task_id"): str, vol.Required("history_entry_id"): str})
@websocket_api.async_response
@require_store
async def ws_history_delete(hass, connection, msg, store):
    result = await store.async_delete_history(msg["task_id"], msg["history_entry_id"])
    connection.send_result(msg["id"], result)
    updated(
        hass, connection, msg, "deleted", "history", msg["history_entry_id"],
        task_id=msg["task_id"],
    )


@websocket_api.websocket_command(
    {
        vol.Required("type"): "tasks/archive/import",
        vol.Required("file_id"): ARCHIVE_FILE_SELECTOR,
    }
)
@websocket_api.async_response
@require_store
async def ws_archive_import(hass, connection, msg, store):
    try:
        data, files, archive_report = await hass.async_add_executor_job(
            _parse_uploaded_archive_with_report, hass, msg["file_id"]
        )
        import_report = await store.async_import_archive(data, files)
    except (
        ValueError,
        KeyError,
        json.JSONDecodeError,
        zipfile.BadZipFile,
    ) as err:
        connection.send_error(msg["id"], "invalid_archive", str(err))
        return
    connection.send_result(
        msg["id"], {"imported": True, **archive_report, **import_report}
    )
    updated(hass, connection, msg, "imported", "archive")


@websocket_api.websocket_command(
    {
        vol.Required("type"): "tasks/attachment/urls",
        vol.Required("task_id"): str,
    }
)
@websocket_api.async_response
@require_store
async def ws_attachment_urls(hass, connection, msg, store):
    if store.task(msg["task_id"]) is None:
        raise ValueError("unknown_task")
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
                for item in store.snapshot()["attachments"]
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
@require_store
async def ws_attachment_create(hass, connection, msg, store):
    filename, content_type, content = await hass.async_add_executor_job(
        _read_uploaded_file, hass, msg["file_id"]
    )
    record = await store.async_add_attachment(
        msg["task_id"], filename, content_type, content
    )
    connection.send_result(msg["id"], record)
    updated(
        hass,
        connection,
        msg,
        "created",
        "attachment",
        record["attachment_id"],
        task_id=msg["task_id"],
    )


@websocket_api.websocket_command({vol.Required("type"): "tasks/attachment/delete", vol.Required("attachment_id"): str})
@websocket_api.async_response
@require_store
async def ws_attachment_delete(hass, connection, msg, store):
    attachment = store.attachment(msg["attachment_id"])
    await store.async_delete_attachment(msg["attachment_id"])
    connection.send_result(msg["id"])
    updated(
        hass, connection, msg, "deleted", "attachment", msg["attachment_id"],
        task_id=attachment.get("task_id") if attachment else None,
    )


COMMANDS = (ws_list, ws_task_create, ws_task_update, ws_task_delete, ws_task_preview_next_due, ws_task_complete, ws_history_list, ws_history_delete, ws_archive_import, ws_attachment_urls, ws_attachment_create, ws_attachment_delete)
