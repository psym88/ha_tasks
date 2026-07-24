"""Shared entity metadata for Tasks."""

from homeassistant.helpers.device_registry import DeviceInfo

from .const import DOMAIN

TASKS_DEVICE_INFO = DeviceInfo(
    identifiers={(DOMAIN, DOMAIN)},
    name="Tasks",
    manufacturer="Tasks",
)
