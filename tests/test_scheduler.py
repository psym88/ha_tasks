"""Scheduler unit tests."""

from datetime import date
from itertools import islice

from custom_components.tasks.scheduler import (
    add_interval,
    occurrences,
    validate_schedule,
)


def task(**values):
    return {
        "task_due": "2026-07-20",
        "schedule_anchor_date": "2026-07-20",
        "schedule_type": "fixed",
        "schedule_unit": "daily",
        "schedule_interval": 1,
        **values,
    }


def schedule(**values):
    return {
        key: value
        for key, value in task(**values).items()
        if key not in {"task_due", "schedule_anchor_date"}
    }


def sequence(value, from_date, count=1):
    return list(islice(occurrences(value, from_date), count))


def test_sliding_intervals():
    assert add_interval(date(2026, 7, 20), 2, "day") == date(2026, 7, 22)
    assert sequence(
        task(
            schedule_type="sliding",
            schedule_unit="weekly",
            schedule_interval=2,
        ),
        date(2026, 7, 21),
    ) == [date(2026, 8, 4)]


def test_sliding_monthly_uses_completion_day():
    value = task(
        task_due="2026-01-31",
        schedule_anchor_date="2026-01-31",
        schedule_type="sliding",
        schedule_unit="monthly",
    )
    assert sequence(value, date(2026, 2, 10)) == [date(2026, 3, 10)]


def test_fixed_schedule_requires_calendar_selection():
    invalid = (
        (
            schedule(schedule_unit="weekly", schedule_weekdays=[]),
            "select_at_least_one_weekday",
        ),
        (
            schedule(schedule_unit="monthly", schedule_day=None),
            "select_day_of_month",
        ),
    )
    for value, expected in invalid:
        try:
            next(occurrences(value, date(2026, 7, 20)))
        except ValueError as err:
            assert str(err) == expected
        else:
            raise AssertionError(f"Expected {expected}")


def test_validate_schedule_keeps_api_validation_available():
    value = schedule(schedule_unit="weekly", schedule_weekdays=[])
    try:
        validate_schedule(value)
    except ValueError as err:
        assert str(err) == "select_at_least_one_weekday"
    else:
        raise AssertionError("Expected select_at_least_one_weekday")


def test_fixed_daily_skips_overdue_occurrences():
    assert sequence(task(schedule_interval=3), date(2026, 7, 27)) == [
        date(2026, 7, 29)
    ]


def test_completing_fixed_schedule_early_keeps_upcoming_occurrence():
    cases = (
        task(
            task_due="2026-07-21",
            schedule_anchor_date="2026-07-21",
            schedule_unit="daily",
            schedule_interval=3,
        ),
        task(
            task_due="2026-07-22",
            schedule_anchor_date="2026-07-22",
            schedule_unit="weekly",
            schedule_weekdays=[2],
        ),
        task(
            task_due="2026-07-31",
            schedule_anchor_date="2026-07-31",
            schedule_unit="monthly",
            schedule_day=31,
        ),
        task(
            task_due="2026-12-25",
            schedule_anchor_date="2026-12-25",
            schedule_unit="yearly",
            schedule_month=12,
            schedule_day=25,
        ),
    )

    for value in cases:
        assert sequence(value, date(2026, 7, 20)) == [
            date.fromisoformat(value["task_due"])
        ]


def test_fixed_weekdays():
    value = task(
        schedule_unit="weekly",
        schedule_weekdays=[0, 2, 4],
        schedule_interval=1,
    )
    assert sequence(value, date(2026, 7, 20)) == [date(2026, 7, 22)]
    assert sequence(value, date(2026, 7, 24)) == [date(2026, 7, 27)]


def test_every_other_week():
    value = task(
        schedule_unit="weekly",
        schedule_weekdays=[0],
        schedule_interval=2,
    )
    assert sequence(value, date(2026, 7, 20)) == [date(2026, 8, 3)]


def test_month_anchor_and_last_day():
    value = task(
        task_due="2026-01-31",
        schedule_anchor_date="2026-01-31",
        schedule_unit="monthly",
        schedule_day=31,
    )
    assert sequence(value, date(2026, 1, 31)) == [date(2026, 2, 28)]
    value["task_due"] = "2026-02-28"
    assert sequence(value, date(2026, 2, 28)) == [date(2026, 3, 31)]
    value["schedule_day"] = "last"
    value["task_due"] = "2026-03-31"
    assert sequence(value, date(2026, 3, 31)) == [date(2026, 4, 30)]


def test_monthly_legacy_data_without_selected_day_uses_anchor():
    value = task(
        task_due="2026-01-31",
        schedule_anchor_date="2026-01-31",
        schedule_unit="monthly",
        schedule_day=None,
    )
    assert sequence(value, date(2026, 1, 31)) == [date(2026, 2, 28)]


def test_occurrences_uses_each_occurrence_as_the_next_completion():
    assert sequence(
        task(
            schedule_type="sliding",
            schedule_unit="monthly",
            schedule_interval=1,
        ),
        date(2026, 7, 21),
        2,
    ) == [date(2026, 8, 21), date(2026, 9, 21)]

    assert sequence(
        task(schedule_unit="weekly", schedule_weekdays=[0, 2, 4]),
        date(2026, 7, 21),
        5,
    ) == [
        date(2026, 7, 22),
        date(2026, 7, 24),
        date(2026, 7, 27),
        date(2026, 7, 29),
        date(2026, 7, 31),
    ]


def test_initial_fixed_weekly_due_starts_on_first_selected_weekday():
    value = schedule(
        schedule_unit="weekly",
        schedule_interval=2,
        schedule_weekdays=[3],
    )
    assert sequence(value, date(2026, 7, 21), 3) == [
        date(2026, 7, 23),
        date(2026, 8, 6),
        date(2026, 8, 20),
    ]
    assert sequence(value, date(2026, 7, 23)) == [date(2026, 7, 23)]


def test_start_date_is_boundary_for_calendar_and_due_for_sliding():
    fixed = schedule(
        schedule_unit="weekly",
        schedule_weekdays=[3],
        schedule_start_date="2026-09-01",
    )
    assert sequence(fixed, date(2026, 7, 21)) == [date(2026, 9, 3)]
    sliding = schedule(
        schedule_type="sliding",
        schedule_start_date="2026-09-01",
    )
    assert sequence(sliding, date(2026, 7, 21)) == [date(2026, 9, 1)]
    sliding["schedule_start_date"] = None
    assert sequence(sliding, date(2026, 7, 21)) == [date(2026, 7, 21)]


def test_fixed_yearly_schedule_and_leap_day_clamping():
    yearly = schedule(
        schedule_unit="yearly",
        schedule_month=7,
        schedule_day=1,
    )
    assert sequence(yearly, date(2026, 7, 1)) == [date(2026, 7, 1)]
    assert sequence(yearly, date(2026, 7, 2)) == [date(2027, 7, 1)]
    yearly["schedule_interval"] = 2
    assert sequence(yearly, date(2026, 7, 2), 3) == [
        date(2027, 7, 1),
        date(2029, 7, 1),
        date(2031, 7, 1),
    ]
    leap = schedule(
        schedule_unit="yearly",
        schedule_month=2,
        schedule_day=29,
    )
    assert sequence(leap, date(2027, 1, 1), 3) == [
        date(2027, 2, 28),
        date(2028, 2, 29),
        date(2029, 2, 28),
    ]


def test_sliding_yearly_uses_completion_date():
    value = task(
        schedule_type="sliding",
        schedule_unit="yearly",
        schedule_interval=2,
    )
    assert sequence(value, date(2026, 7, 21)) == [date(2028, 7, 21)]


def test_every_generated_sequence_strictly_advances():
    values = (
        task(schedule_interval=2),
        task(schedule_unit="weekly", schedule_weekdays=[0, 2, 4]),
        task(schedule_unit="monthly", schedule_day="last"),
        task(schedule_unit="yearly", schedule_month=2, schedule_day=29),
        task(
            schedule_type="sliding",
            schedule_unit="monthly",
            schedule_interval=1,
        ),
    )
    for value in values:
        dates = sequence(value, date(2026, 7, 20), 24)
        assert all(
            previous < following
            for previous, following in zip(dates, dates[1:])
        )
