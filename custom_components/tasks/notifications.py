"""Task due notifications."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.components import persistent_notification
from homeassistant.components.device_automation import action as device_action
from homeassistant.const import CONF_DEVICE_ID, CONF_DOMAIN, CONF_TYPE
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import TemplateError
from homeassistant.helpers.template import Template

_LOGGER = logging.getLogger(__name__)

MOBILE_APP_DOMAIN = "mobile_app"


def notification_id(task_id: str) -> str:
    """Return the stable notification ID for a task."""
    return f"tasks_due_{task_id}"


def has_due_notification(task: dict[str, Any]) -> bool:
    """Return whether a task has any due notification enabled."""
    notification = task["notification"]
    return bool(notification["device_ids"] or notification["persistent"])


async def _notification_content(
    hass: HomeAssistant,
    task: dict[str, Any],
) -> tuple[str, str]:
    """Build notification content from the task itself."""
    due = task.get("due")
    problem_message = next(
        (
            str(entry.get("message") or "").strip()
            for entry in reversed(task.get("history", []))
            if entry.get("type") == "problem" and entry.get("occurred_at") == due
        ),
        "",
    )
    description = ""
    if source := str(task.get("description") or "").strip():
        try:
            description = str(Template(source, hass).async_render(strict=True)).strip()
        except TemplateError:
            _LOGGER.warning(
                "Failed to render notification description for task %s",
                task["id"],
            )
    return task["name"], "\n\n".join(
        part for part in (problem_message, description) if part
    )


def _mobile_data(task: dict[str, Any]) -> dict[str, Any]:
    data: dict[str, Any] = {"tag": notification_id(task["id"])}
    notification = task["notification"]
    if notification_route := notification.get("route"):
        data["url"] = notification_route
        data["clickAction"] = notification_route
    if notification["critical"]:
        data.update(
            {
                "ttl": 0,
                "priority": "high",
                "channel": "alarm_stream",
                "push": {
                    "sound": {
                        "name": "default",
                        "critical": 1,
                        "volume": 1.0,
                    }
                },
            }
        )
    return data


async def async_notify_task_due(
    hass: HomeAssistant,
    task: dict[str, Any],
) -> None:
    """Send every notification configured for a due task."""
    title, message = await _notification_content(hass, task)
    if task["notification"]["persistent"]:
        persistent_notification.async_create(
            hass,
            message,
            title=title,
            notification_id=notification_id(task["id"]),
        )

    for device_id in task["notification"]["device_ids"]:
        try:
            await device_action.async_call_action_from_config(
                hass,
                {
                    CONF_DEVICE_ID: device_id,
                    CONF_DOMAIN: MOBILE_APP_DOMAIN,
                    CONF_TYPE: "notify",
                    "title": title,
                    "message": message,
                    "data": _mobile_data(task),
                },
                {},
                None,
            )
        except Exception:  # noqa: BLE001
            _LOGGER.exception(
                "Failed to notify mobile app device %s for task %s",
                device_id,
                task["id"],
            )


def dismiss_task_notification(hass: HomeAssistant, task_id: str) -> None:
    """Dismiss the persistent due notification for one task."""
    persistent_notification.async_dismiss(hass, notification_id(task_id))
