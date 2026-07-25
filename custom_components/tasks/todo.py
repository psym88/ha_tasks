"""Home Assistant-native task list."""

from homeassistant.components.todo import (
    TodoItem,
    TodoItemStatus,
    TodoListEntity,
    TodoListEntityFeature,
)
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import Event, HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.util import dt as dt_util

from . import TasksData
from .const import EVENT_TASKS, TASKS_DEVICE_INFO
from .datetime_utils import parse_aware_datetime
from .task_events import async_fire_tasks_event


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry[TasksData],
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up the single Tasks to-do list."""
    entity = TasksTodoList(hass, entry.runtime_data.store)
    async_add_entities([entity])

    async def refresh(_event: Event) -> None:
        entity.refresh()

    entry.async_on_unload(hass.bus.async_listen(EVENT_TASKS, refresh))


class TasksTodoList(TodoListEntity):
    """Expose all managed tasks as one native to-do list."""

    _attr_has_entity_name = True
    _attr_name = None
    _attr_unique_id = "tasks"
    _attr_should_poll = False
    _attr_device_info = TASKS_DEVICE_INFO
    _attr_supported_features = (
        TodoListEntityFeature.UPDATE_TODO_ITEM
        | TodoListEntityFeature.SET_DUE_DATETIME_ON_ITEM
    )

    def __init__(self, hass: HomeAssistant, store) -> None:
        self._home_assistant = hass
        self._store = store

    @property
    def todo_items(self) -> list[TodoItem]:
        return [
            TodoItem(
                uid=task["task_id"],
                summary=task["task_name"],
                due=(
                    parse_aware_datetime(task["task_due"])
                    if task.get("task_due")
                    else None
                ),
                status=TodoItemStatus.NEEDS_ACTION,
            )
            for task in sorted(
                (
                    task
                    for task in self._store.tasks
                    if task.get("schedule_type") != "sensor"
                    or task.get("task_due")
                ),
                key=lambda task: (
                    task.get("task_due") is None,
                    task.get("task_due") or "",
                    task["task_name"].casefold(),
                ),
            )
        ]

    def refresh(self) -> None:
        """Push the current store contents to Home Assistant."""
        if self.hass is not None and self.entity_id is not None:
            self.async_write_ha_state()

    def _notify(
        self,
        action: str,
        task: dict,
    ) -> None:
        async_fire_tasks_event(
            self._home_assistant,
            action,
            "task",
            task["task_id"],
            context=self._context,
            resource_name=task.get("task_name"),
        )

    async def async_update_todo_item(self, item: TodoItem) -> None:
        """Update or complete a task through Home Assistant's to-do API."""
        task_id = item.uid
        if task_id is None:
            raise ValueError("task_id_required")

        if item.status == TodoItemStatus.COMPLETED:
            user_id = getattr(self._context, "user_id", None)
            user = (
                await self._home_assistant.auth.async_get_user(user_id)
                if user_id
                else None
            )
            task = await self._store.async_complete_task(
                task_id,
                dt_util.utcnow().isoformat(),
                user_id,
                user.name if user and user.name else "system",
                "tasks.history.completed_via_todo",
            )
            self._notify("completed", task)
            return

        task = await self._store.async_update_task(
            task_id,
            {"task_name": item.summary},
            dt_util.utcnow(),
        )
        self._notify("updated", task)
