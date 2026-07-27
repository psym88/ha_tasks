"""Tests for typed Tasks domain values."""

from datetime import datetime, timezone
import json
from pathlib import Path

import pytest

from custom_components.tasks.models import (
    AfterCompletionSchedule,
    Attachment,
    Completion,
    FixedSchedule,
    NotificationSettings,
    ProblemTrigger,
    ScheduleUnit,
    Task,
    trigger_from_mapping,
)


def test_fixed_weekly_schedule_round_trips_schema_three_fields():
    trigger = trigger_from_mapping(
        {
            "schedule_type": "fixed",
            "schedule_unit": "weekly",
            "schedule_interval": 2,
            "schedule_weekdays": [4, 1],
            "schedule_day": 23,
            "schedule_month": 7,
            "schedule_time": "08:30",
            "problem_sensor": "binary_sensor.ignored",
        }
    )

    assert trigger == FixedSchedule(
        unit=ScheduleUnit.WEEKLY,
        interval=2,
        weekdays=(4, 1),
        time="08:30",
    )
    assert trigger.signature() == (
        "fixed",
        "weekly",
        2,
        "08:30",
        (1, 4),
    )
    assert trigger.storage_fields() == {
        "schedule_type": "fixed",
        "schedule_unit": "weekly",
        "schedule_interval": 2,
        "schedule_weekdays": [4, 1],
        "schedule_day": None,
        "schedule_month": None,
        "schedule_time": "08:30",
        "problem_sensor": None,
    }


def test_fixed_yearly_schedule_keeps_only_yearly_values():
    trigger = trigger_from_mapping(
        {
            "schedule_type": "fixed",
            "schedule_unit": "yearly",
            "schedule_interval": 1,
            "schedule_weekdays": [1],
            "schedule_day": "last",
            "schedule_month": 2,
            "schedule_time": "09:15",
        }
    )

    assert trigger == FixedSchedule(
        unit=ScheduleUnit.YEARLY,
        interval=1,
        day="last",
        month=2,
        time="09:15",
    )
    assert trigger.storage_fields()["schedule_weekdays"] == []
    assert trigger.storage_fields()["schedule_day"] == "last"
    assert trigger.storage_fields()["schedule_month"] == 2


def test_after_completion_schedule_discards_calendar_values():
    trigger = trigger_from_mapping(
        {
            "schedule_type": "sliding",
            "schedule_unit": "monthly",
            "schedule_interval": 3,
            "schedule_weekdays": [1],
            "schedule_day": 15,
            "schedule_month": 6,
            "schedule_time": "10:00",
            "problem_sensor": "binary_sensor.ignored",
        }
    )

    assert trigger == AfterCompletionSchedule(ScheduleUnit.MONTHLY, 3)
    assert trigger.storage_fields() == {
        "schedule_type": "sliding",
        "schedule_unit": "monthly",
        "schedule_interval": 3,
        "schedule_weekdays": [],
        "schedule_day": None,
        "schedule_month": None,
        "schedule_time": None,
        "problem_sensor": None,
    }


def test_problem_trigger_discards_every_recurrence_value():
    trigger = trigger_from_mapping(
        {
            "schedule_type": "sensor",
            "schedule_unit": "weekly",
            "schedule_interval": 2,
            "schedule_weekdays": [1],
            "schedule_day": 15,
            "schedule_month": 6,
            "schedule_time": "10:00",
            "problem_sensor": "  binary_sensor.heat_pump_problem  ",
        }
    )

    assert trigger == ProblemTrigger("binary_sensor.heat_pump_problem")
    assert trigger.storage_fields() == {
        "schedule_type": "sensor",
        "schedule_unit": None,
        "schedule_interval": None,
        "schedule_weekdays": [],
        "schedule_day": None,
        "schedule_month": None,
        "schedule_time": None,
        "problem_sensor": "binary_sensor.heat_pump_problem",
    }


@pytest.mark.parametrize(
    ("value", "error"),
    (
        ({"schedule_type": "sliding"}, "invalid_frequency"),
        (
            {
                "schedule_type": "fixed",
                "schedule_unit": "weekly",
                "schedule_interval": 1,
                "schedule_weekdays": [],
            },
            "select_at_least_one_weekday",
        ),
        (
            {
                "schedule_type": "sensor",
                "problem_sensor": "sensor.temperature",
            },
            "problem_sensor_required",
        ),
    ),
)
def test_trigger_validation_preserves_public_error_codes(value, error):
    with pytest.raises(ValueError, match=error):
        trigger_from_mapping(value)


def test_task_round_trips_schema_three_and_preserves_unknown_values():
    task = Task.from_mapping(
        {
            "task_id": "task-1",
            "task_name": "  Replace filter  ",
            "task_icon": "mdi:air-filter",
            "task_description": "Upstairs",
            "active": True,
            "assignee_id": "user-1",
            "label_ids": ["label-1", "label-1", "label-2"],
            "nfc_tag_id": " tag-1 ",
            "notification_target": {
                "device_id": ["phone", "phone", "tablet"]
            },
            "notification_persistent": True,
            "notification_critical": False,
            "notification_route": " /lovelace/maintenance ",
            "task_due": "2026-07-30T12:00:00+02:00",
            "schedule_type": "sliding",
            "schedule_unit": "monthly",
            "schedule_interval": 1,
            "schedule_weekdays": [2],
            "schedule_day": 30,
            "schedule_month": 7,
            "schedule_time": "08:30",
            "problem_sensor": None,
            "future_field": {"keep": True},
        }
    )

    assert task.name == "Replace filter"
    assert task.label_ids == ("label-1", "label-2")
    assert task.nfc_tag_id == "tag-1"
    assert task.notifications == NotificationSettings(
        device_ids=("phone", "tablet"),
        persistent=True,
        route="/lovelace/maintenance",
    )
    assert task.storage_fields() == {
        "future_field": {"keep": True},
        "task_id": "task-1",
        "task_icon": "mdi:air-filter",
        "task_description": "Upstairs",
        "assignee_id": "user-1",
        "schedule_type": "sliding",
        "schedule_unit": "monthly",
        "schedule_interval": 1,
        "schedule_weekdays": [],
        "schedule_day": None,
        "schedule_month": None,
        "schedule_time": None,
        "problem_sensor": None,
        "task_name": "Replace filter",
        "active": True,
        "label_ids": ["label-1", "label-2"],
        "nfc_tag_id": "tag-1",
        "notification_target": {"device_id": ["phone", "tablet"]},
        "notification_persistent": True,
        "notification_critical": False,
        "notification_route": "/lovelace/maintenance",
        "task_due": "2026-07-30T10:00:00+00:00",
    }


@pytest.mark.parametrize(
    ("values", "error"),
    (
        (
            {
                "task_id": "task-1",
                "task_name": " ",
                "schedule_type": "sliding",
                "schedule_unit": "daily",
                "schedule_interval": 1,
            },
            "name_required",
        ),
        (
            {
                "task_id": "task-1",
                "task_name": "Task",
                "schedule_type": "sliding",
                "schedule_unit": "daily",
                "schedule_interval": 1,
                "notification_route": "https://example.com",
            },
            "invalid_notification_route",
        ),
    ),
)
def test_task_validation_preserves_public_error_codes(values, error):
    with pytest.raises(ValueError, match=error):
        Task.from_mapping(values)


def test_completion_round_trips_schema_three_and_normalizes_notes():
    completion = Completion.from_mapping(
        {
            "history_entry_id": "history-1",
            "completed_at": "2026-07-27T12:00:00+02:00",
            "user_id": "user-1",
            "user_name": "Marco",
            "notes": "  Replaced filter  ",
            "task_due_before": "2026-07-27T08:00:00+00:00",
            "task_due_after": "2026-08-27T12:00:00+02:00",
            "future_field": True,
        }
    )

    assert completion.notes == "Replaced filter"
    assert completion.storage_fields() == {
        "future_field": True,
        "history_entry_id": "history-1",
        "completed_at": "2026-07-27T10:00:00+00:00",
        "user_id": "user-1",
        "user_name": "Marco",
        "notes": "Replaced filter",
        "task_due_before": "2026-07-27T08:00:00+00:00",
        "task_due_after": "2026-08-27T12:00:00+02:00",
    }


def test_attachment_round_trips_schema_three():
    attachment = Attachment(
        id="attachment-1",
        task_id="task-1",
        filename="manual.pdf",
        content_type="application/pdf",
        size=42,
        uploaded_at=datetime(2026, 7, 27, 10, 0, tzinfo=timezone.utc),
    )

    assert attachment.storage_fields() == {
        "attachment_id": "attachment-1",
        "task_id": "task-1",
        "filename": "manual.pdf",
        "content_type": "application/pdf",
        "size": 42,
        "uploaded_at": "2026-07-27T10:00:00+00:00",
    }
    assert Attachment.from_mapping(attachment.storage_fields()) == attachment


def test_published_schema_three_fixture_crosses_the_typed_boundary():
    stored = json.loads(
        (Path(__file__).parent / "fixtures" / "store_v3.json").read_text()
    )["data"]

    for task in stored["tasks"]:
        serialized = Task.from_mapping(task).storage_fields()
        assert {
            key: serialized[key] for key in task
        } == task
    assert {
        task_id: [
            Completion.from_mapping(entry).storage_fields()
            for entry in entries
        ]
        for task_id, entries in stored["history"].items()
    } == stored["history"]
    assert [
        Attachment.from_mapping(item).storage_fields()
        for item in stored["attachments"]
    ] == stored["attachments"]
