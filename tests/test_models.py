"""Tests for typed Tasks domain values."""

import pytest

from custom_components.tasks.models import (
    AfterCompletionSchedule,
    FixedSchedule,
    ProblemTrigger,
    ScheduleUnit,
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
