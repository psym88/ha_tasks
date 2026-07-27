"""Tasks event helpers."""

from __future__ import annotations

from typing import Any

from homeassistant.core import Context, HomeAssistant, callback

from .const import EVENT_TASKS


@callback
def async_fire_tasks_event(
    hass: HomeAssistant,
    action: str,
    resource_type: str,
    resource_id: str | None = None,
    *,
    context: Context | None = None,
    **data: Any,
) -> None:
    """Publish a stored change to Home Assistant users and automations."""
    hass.bus.async_fire(
        EVENT_TASKS,
        {
            "action": action,
            "resource_type": resource_type,
            "resource_id": resource_id,
            **data,
        },
        context=context,
    )
