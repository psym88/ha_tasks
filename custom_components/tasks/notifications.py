"""Task due notifications."""

from __future__ import annotations

import logging
from typing import Any

from homeassistant.components import persistent_notification
from homeassistant.components.device_automation import action as device_action
from homeassistant.const import CONF_DEVICE_ID, CONF_DOMAIN, CONF_TYPE
from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.helpers.translation import async_get_translations

from .const import DOMAIN, EVENT_TASKS

_LOGGER = logging.getLogger(__name__)

MOBILE_APP_DOMAIN = "mobile_app"
TRANSLATION_CATEGORY = "frontend"


def notification_id(task_id: str) -> str:
    """Return the stable notification ID for a task."""
    return f"tasks_due_{task_id}"


def has_due_notification(task: dict[str, Any]) -> bool:
    """Return whether a task has any due notification enabled."""
    target = task.get("notification_target") or {}
    return bool(target.get("device_id") or task.get("notification_persistent"))


async def _notification_content(
    hass: HomeAssistant,
    task: dict[str, Any],
) -> tuple[str, str]:
    language = getattr(getattr(hass, "config", None), "language", "en")
    translations = await async_get_translations(
        hass,
        language,
        TRANSLATION_CATEGORY,
        integrations={DOMAIN},
    )
    task_name = task["task_name"]
    kind = "problem" if task.get("schedule_type") == "sensor" else "due"
    prefix = f"component.{DOMAIN}.{TRANSLATION_CATEGORY}.notification.{kind}"
    return (
        translations[f"{prefix}_title"],
        translations[f"{prefix}_message"].format(task_name=task_name),
    )


def _mobile_data(task: dict[str, Any]) -> dict[str, Any]:
    data: dict[str, Any] = {"tag": notification_id(task["task_id"])}
    if notification_route := task.get("notification_route"):
        data["url"] = notification_route
    if task.get("notification_critical"):
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
    if task.get("notification_persistent"):
        persistent_notification.async_create(
            hass,
            message,
            title=title,
            notification_id=notification_id(task["task_id"]),
        )

    for device_id in (task.get("notification_target") or {}).get("device_id", []):
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
                task["task_id"],
            )


@callback
def async_setup_listener(hass: HomeAssistant):
    """Dismiss panel notifications when their task is completed or deleted."""

    @callback
    def _handle_event(event: Event) -> None:
        if (
            event.data.get("resource_type") == "task"
            and event.data.get("action") in {"completed", "deleted"}
            and (task_id := event.data.get("resource_id"))
        ):
            persistent_notification.async_dismiss(hass, notification_id(task_id))

    return hass.bus.async_listen(EVENT_TASKS, _handle_event)
