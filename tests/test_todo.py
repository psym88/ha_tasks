"""Tests for the Home Assistant-native task list."""

import asyncio
from datetime import datetime, timezone
from types import SimpleNamespace
from unittest.mock import ANY, AsyncMock

from homeassistant.components.todo import (
    TodoItem,
    TodoItemStatus,
    TodoListEntityFeature,
)

from custom_components.tasks.todo import TasksTodoList


def task(**values):
    return {
        "task_id": "task-1",
        "task_name": "Clean kitchen",
        "task_due": "2026-07-24T08:00:00+00:00",
        **values,
    }


def entity(store):
    hass = SimpleNamespace(
        bus=SimpleNamespace(async_fire=lambda *args, **kwargs: None),
        auth=SimpleNamespace(async_get_user=AsyncMock(return_value=None)),
    )
    return TasksTodoList(hass, store)


def test_tasks_are_native_todo_items_sorted_by_task_due():
    store = SimpleNamespace(
        tasks=[
            task(task_id="later", task_name="Later", task_due="2026-07-25T08:00:00+00:00"),
            task(task_id="first", task_name="First", task_due="2026-07-24T08:00:00+00:00"),
        ]
    )

    items = entity(store).todo_items

    assert [item.uid for item in items] == ["first", "later"]
    assert items[0] == TodoItem(
        uid="first",
        summary="First",
        due=datetime(2026, 7, 24, 8, tzinfo=timezone.utc),
        status=TodoItemStatus.NEEDS_ACTION,
    )


def test_waiting_sensor_task_is_hidden_from_native_todo_list():
    items = entity(
        SimpleNamespace(
            tasks=[
                task(task_id="dated", task_due="2026-07-25T08:00:00+00:00"),
                task(
                    task_id="sensor",
                    task_due=None,
                    schedule_type="sensor",
                    problem_sensor="binary_sensor.problem",
                ),
            ]
        )
    ).todo_items

    assert [item.uid for item in items] == ["dated"]


def test_triggered_sensor_task_appears_in_native_todo_list():
    items = entity(
        SimpleNamespace(
            tasks=[
                task(
                    task_id="sensor",
                    task_due="2026-07-25T10:00:00+00:00",
                    schedule_type="sensor",
                    problem_sensor="binary_sensor.problem",
                )
            ]
        )
    ).todo_items

    assert [item.uid for item in items] == ["sensor"]


def test_todo_preserves_an_exact_due_datetime():
    due = datetime(2026, 7, 24, 8, tzinfo=timezone.utc)
    item = entity(
        SimpleNamespace(tasks=[task(task_due=due.isoformat())])
    ).todo_items[0]

    assert item.due == due


def test_todo_list_uses_shared_device_and_counts_open_tasks():
    todo = entity(SimpleNamespace(tasks=[task(), task(task_id="task-2")]))

    assert todo.device_info["name"] == "Tasks"
    assert todo.device_info["identifiers"] == {("tasks", "tasks")}
    assert todo.state == 2
    assert todo.unique_id == "tasks"
    assert todo.name is None
    assert todo.has_entity_name
    assert not todo.supported_features & TodoListEntityFeature.CREATE_TODO_ITEM
    assert todo.supported_features & TodoListEntityFeature.UPDATE_TODO_ITEM
    assert not todo.supported_features & TodoListEntityFeature.DELETE_TODO_ITEM
    assert not todo.supported_features & TodoListEntityFeature.SET_DUE_DATE_ON_ITEM
    assert todo.supported_features & TodoListEntityFeature.SET_DUE_DATETIME_ON_ITEM
    assert not todo.supported_features & TodoListEntityFeature.SET_DESCRIPTION_ON_ITEM


def test_completing_item_uses_tasks_completion_flow():
    completed = task(task_due="2026-08-24T08:00:00+00:00")
    store = SimpleNamespace(
        tasks=[task()],
        async_complete_task=AsyncMock(return_value=completed),
    )
    todo = entity(store)

    asyncio.run(
        todo.async_update_todo_item(
            TodoItem(
                uid="task-1",
                summary="Clean kitchen",
                status=TodoItemStatus.COMPLETED,
                due=datetime(2026, 7, 24, 8, tzinfo=timezone.utc),
            )
        )
    )

    store.async_complete_task.assert_awaited_once_with(
        "task-1",
        ANY,
        None,
        "system",
        "tasks.history.completed_via_todo",
    )


def test_editing_item_only_updates_title():
    updated = task(task_name="Kitchen")
    store = SimpleNamespace(
        tasks=[task()],
        async_update_task=AsyncMock(return_value=updated),
    )
    todo = entity(store)

    asyncio.run(
        todo.async_update_todo_item(
            TodoItem(
                uid="task-1",
                summary="Kitchen",
                description=None,
                status=TodoItemStatus.NEEDS_ACTION,
                due=datetime(2026, 7, 30, 8, tzinfo=timezone.utc),
            )
        )
    )

    store.async_update_task.assert_awaited_once_with(
        "task-1",
        {"task_name": "Kitchen"},
        ANY,
    )
