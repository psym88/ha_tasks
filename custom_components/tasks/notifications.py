"""Task due notifications."""

from __future__ import annotations

import json
import logging
from functools import cache
from pathlib import Path
from typing import Any

from homeassistant.components import persistent_notification
from homeassistant.components.device_automation import action as device_action
from homeassistant.const import CONF_DEVICE_ID, CONF_DOMAIN, CONF_TYPE
from homeassistant.core import HomeAssistant

_LOGGER = logging.getLogger(__name__)

MOBILE_APP_DOMAIN = "mobile_app"
FRONTEND_TRANSLATIONS = Path(__file__).parent / "frontend_translations"


@cache
def _load_translations(language: str) -> dict[str, str]:
    """Load a frontend translation catalog, falling back to English."""
    language = language.lower().replace("_", "-").split("-", 1)[0]
    path = FRONTEND_TRANSLATIONS / f"{language}.json"
    if not path.is_file():
        path = FRONTEND_TRANSLATIONS / "en.json"
    return json.loads(path.read_text(encoding="utf-8"))["frontend"]


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
    translations = await hass.async_add_executor_job(_load_translations, language)
    task_name = task["task_name"]
    kind = "problem" if task.get("schedule_type") == "sensor" else "due"
    return (
        translations[f"notification.{kind}_title"],
        translations[f"notification.{kind}_message"].format(task_name=task_name),
    )


def _mobile_data(task: dict[str, Any]) -> dict[str, Any]:
    data: dict[str, Any] = {"tag": notification_id(task["task_id"])}
    if notification_route := task.get("notification_route"):
        data["url"] = notification_route
        data["clickAction"] = notification_route
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


def dismiss_task_notification(hass: HomeAssistant, task_id: str) -> None:
    """Dismiss the persistent due notification for one task."""
    persistent_notification.async_dismiss(hass, notification_id(task_id))
