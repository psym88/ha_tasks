"""Tests for Tasks summary sensors."""

from datetime import datetime, timezone
from types import SimpleNamespace
from unittest.mock import patch

from custom_components.tasks.sensor import TasksDueSensor


def test_tasks_due_counts_reached_datetimes():
    store = SimpleNamespace(
        tasks=[
            {"task_due": "2026-07-22T12:00:00+00:00"},
            {"task_due": "2026-07-23T12:00:00+00:00"},
            {"active": False, "task_due": "2026-07-22T12:00:00+00:00"},
        ],
        is_due=lambda task, now: (
            task.get("active", True) and task["task_due"] <= now.isoformat()
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
