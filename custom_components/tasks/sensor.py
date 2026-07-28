"""Summary sensors for Tasks."""

from homeassistant.components.sensor import SensorEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.util import dt as dt_util

from . import TasksData
from .const import TASKS_DEVICE_INFO
from .manager import TaskChange, TaskManager


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry[TasksData],
    async_add_entities: AddEntitiesCallback,
) -> None:
    manager = entry.runtime_data.manager
    async_add_entities([TasksDueSensor(manager)])


class TasksDueSensor(SensorEntity):
    """Count tasks whose due time has been reached."""

    _attr_has_entity_name = True
    _attr_translation_key = "tasks_due"
    _attr_unique_id = "tasks_due"
    _attr_device_info = TASKS_DEVICE_INFO
    _attr_native_unit_of_measurement = "tasks"
    _attr_icon = "mdi:clipboard-alert-outline"
    _attr_should_poll = False

    def __init__(self, manager: TaskManager) -> None:
        self._manager = manager

    async def async_added_to_hass(self) -> None:
        """Subscribe to task changes after the entity is registered."""
        await super().async_added_to_hass()
        self.async_on_remove(self._manager.subscribe(self._handle_change))

    @callback
    def _handle_change(self, change: TaskChange) -> None:
        """Refresh the state after a committed task change."""
        if change.affects_tasks:
            self.async_write_ha_state()

    @property
    def suggested_object_id(self) -> str:
        """Keep the entity ID stable across backend languages."""
        return "due"

    @property
    def native_value(self) -> int:
        now = dt_util.utcnow()
        return sum(
            self._manager.is_due(task, now) for task in self._manager.tasks
        )
