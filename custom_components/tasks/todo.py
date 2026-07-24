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
from .due_events import parse_task_due
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
        TodoListEntityFeature.DELETE_TODO_ITEM
        | TodoListEntityFeature.UPDATE_TODO_ITEM
        | TodoListEntityFeature.SET_DUE_DATE_ON_ITEM
        | TodoListEntityFeature.SET_DESCRIPTION_ON_ITEM
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
                description=task.get("task_description"),
                due=parse_task_due(task["task_due"]),
                status=TodoItemStatus.NEEDS_ACTION,
            )
            for task in sorted(
                self._store.tasks,
                key=lambda task: (
                    task["task_due"],
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
        *,
        resource_name: str | None = None,
    ) -> None:
        async_fire_tasks_event(
            self._home_assistant,
            action,
            "task",
            task["task_id"],
            context=self._context,
            resource_name=resource_name or task.get("task_name"),
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
                dt_util.now().date().isoformat(),
                user_id,
                user.name if user and user.name else "system",
            )
            self._notify("completed", task)
            return

        previous = self._store.task(task_id)
        due = item.due
        task = await self._store.async_update_task(
            task_id,
            {
                "task_name": item.summary,
                "task_description": item.description,
                **(
                    {"task_due": due.isoformat()}
                    if due is not None and due.isoformat() != previous["task_due"]
                    else {}
                ),
            },
            dt_util.now().date(),
        )
        self._notify("updated", task)

    async def async_delete_todo_items(self, uids: list[str]) -> None:
        """Delete tasks through Home Assistant's to-do API."""
        for task_id in uids:
            task = self._store.task(task_id)
            await self._store.async_delete_task(task_id)
            self._notify("deleted", task)
