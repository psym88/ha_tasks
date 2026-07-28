"""Tests for Tasks summary sensors."""

import asyncio
from datetime import datetime, timezone
from types import SimpleNamespace
from unittest.mock import Mock, patch

from custom_components.tasks.manager import TaskChange
from custom_components.tasks.sensor import TasksDueSensor


def test_tasks_due_counts_reached_datetimes():
    store = SimpleNamespace(
        tasks=[
            {"due": "2026-07-22T12:00:00+00:00"},
            {"due": "2026-07-23T12:00:00+00:00"},
            {"active": False, "due": "2026-07-22T12:00:00+00:00"},
        ],
        is_due=lambda task, now: (
            task.get("active", True) and task["due"] <= now.isoformat()
        ),
    )

    with patch(
        "custom_components.tasks.sensor.dt_util.utcnow",
        return_value=datetime(2026, 7, 23, 12, tzinfo=timezone.utc),
    ):
        sensor = TasksDueSensor(store)
        assert sensor.native_value == 2

    assert sensor.unique_id == "tasks_due"
    assert sensor.translation_key == "tasks_due"
    assert sensor.has_entity_name
    assert sensor.suggested_object_id == "due"
    assert sensor.device_info["name"] == "Tasks"
    assert sensor.device_info["identifiers"] == {("tasks", "tasks")}
    assert not sensor.should_poll


def test_tasks_due_subscribes_on_entity_add_and_tracks_cleanup():
    unsubscribe = Mock()
    manager = SimpleNamespace(
        tasks=[],
        is_due=Mock(return_value=False),
        subscribe=Mock(return_value=unsubscribe),
    )
    sensor = TasksDueSensor(manager)
    cleanup_callbacks = []
    sensor.async_on_remove = cleanup_callbacks.append

    asyncio.run(sensor.async_added_to_hass())

    manager.subscribe.assert_called_once_with(sensor._handle_change)
    assert cleanup_callbacks == [unsubscribe]


def test_tasks_due_refreshes_only_for_task_changes():
    manager = SimpleNamespace(tasks=[], is_due=Mock(return_value=False))
    sensor = TasksDueSensor(manager)
    sensor.async_write_ha_state = Mock()

    sensor._handle_change(TaskChange("updated", "task"))
    sensor._handle_change(TaskChange("imported", "archive"))
    sensor._handle_change(TaskChange("updated", "attachment"))

    assert sensor.async_write_ha_state.call_count == 2
