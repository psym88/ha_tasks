"""Complete tasks from Home Assistant tag scans."""

from __future__ import annotations

from homeassistant.core import Event, HomeAssistant, callback
from homeassistant.util import dt as dt_util

from .manager import TaskManager

EVENT_TAG_SCANNED = "tag_scanned"
NFC_COMPLETION_NOTE = "tasks.history.completed_via_nfc"


async def async_handle_tag_scanned(
    hass: HomeAssistant, manager: TaskManager, event: Event
) -> None:
    """Complete the task assigned to a scanned Home Assistant tag."""
    tag_id = str(event.data.get("tag_id") or "").strip()
    task = next(
        (item for item in manager.tasks if item.get("nfc_tag_id") == tag_id),
        None,
    )
    if not tag_id or task is None:
        return

    user_id = event.context.user_id
    user = await hass.auth.async_get_user(user_id) if user_id else None
    await manager.async_complete_task(
        task["task_id"],
        dt_util.utcnow().isoformat(),
        user.id if user else None,
        user.name if user and user.name else "NFC tag",
        NFC_COMPLETION_NOTE,
        context=event.context,
        source="nfc",
    )


@callback
def async_setup_listener(hass: HomeAssistant, manager: TaskManager):
    """Listen for Home Assistant tag scans for this config entry."""

    @callback
    def _handle_tag_scanned(event: Event) -> None:
        hass.async_create_task(async_handle_tag_scanned(hass, manager, event))

    return hass.bus.async_listen(EVENT_TAG_SCANNED, _handle_tag_scanned)
