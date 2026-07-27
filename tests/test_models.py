"""Tests for the current typed Tasks aggregate."""

from datetime import datetime, timezone

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
    trigger_from_record,
)


def test_current_schedule_variants_round_trip():
    weekly = trigger_from_record(
        {
            "type": "fixed",
            "unit": "weekly",
            "interval": 2,
            "weekdays": [4, 1],
            "time": "08:30",
        }
    )
    assert weekly == FixedSchedule(
        ScheduleUnit.WEEKLY, 2, (4, 1), time="08:30"
    )
    assert weekly.signature() == ("fixed", "weekly", 2, "08:30", (1, 4))
    assert weekly.record() == {
        "type": "fixed",
        "unit": "weekly",
        "interval": 2,
        "weekdays": [4, 1],
        "time": "08:30",
    }
    assert trigger_from_record(
        {"type": "sliding", "unit": "monthly", "interval": 3}
    ) == AfterCompletionSchedule(ScheduleUnit.MONTHLY, 3)
    assert trigger_from_record(
        {"type": "sensor", "entity_id": "binary_sensor.problem"}
    ) == ProblemTrigger("binary_sensor.problem")


@pytest.mark.parametrize(
    ("value", "error"),
    (
        ({"type": "sliding"}, "invalid_frequency"),
        (
            {
                "type": "fixed",
                "unit": "weekly",
                "interval": 1,
                "weekdays": [],
            },
            "select_at_least_one_weekday",
        ),
        (
            {"type": "sensor", "entity_id": "sensor.temperature"},
            "problem_sensor_required",
        ),
    ),
)
def test_current_schedule_validation(value, error):
    with pytest.raises(ValueError, match=error):
        trigger_from_record(value)


def test_task_round_trips_only_current_aggregate_fields():
    record = {
        "id": "task-1",
        "name": "  Replace filter  ",
        "icon": "mdi:air-filter",
        "description": "Upstairs",
        "active": True,
        "assignee_id": "user-1",
        "label_ids": ["label-1", "label-1", "label-2"],
        "nfc_tag_id": " tag-1 ",
        "due": "2026-07-30T12:00:00+02:00",
        "schedule": {"type": "sliding", "unit": "monthly", "interval": 1},
        "notification": {
            "device_ids": ["phone", "phone", "tablet"],
            "persistent": True,
            "critical": False,
            "route": " /lovelace/maintenance ",
        },
        "completions": [],
        "attachments": [],
        "unknown": "discarded",
    }
    task = Task.from_record(record)

    assert task.name == "Replace filter"
    assert task.label_ids == ("label-1", "label-2")
    assert task.nfc_tag_id == "tag-1"
    assert task.notifications == NotificationSettings(
        device_ids=("phone", "tablet"),
        persistent=True,
        route="/lovelace/maintenance",
    )
    serialized = task.record()
    assert "unknown" not in serialized
    assert serialized["due"] == "2026-07-30T10:00:00+00:00"
    assert serialized["schedule"] == {
        "type": "sliding",
        "unit": "monthly",
        "interval": 1,
    }


def test_current_children_round_trip_without_unknown_fields():
    completion = Completion.from_record(
        {
            "id": "history-1",
            "completed_at": "2026-07-27T12:00:00+02:00",
            "user_id": "user-1",
            "user_name": "Marco",
            "notes": "  Replaced filter  ",
            "unknown": True,
        }
    )
    assert completion.record() == {
        "id": "history-1",
        "completed_at": "2026-07-27T10:00:00+00:00",
        "user_id": "user-1",
        "user_name": "Marco",
        "notes": "Replaced filter",
    }

    attachment = Attachment(
        id="attachment-1",
        filename="manual.pdf",
        content_type="application/pdf",
        size=42,
        uploaded_at=datetime(2026, 7, 27, 10, tzinfo=timezone.utc),
    )
    assert Attachment.from_record(attachment.record()) == attachment
