"""Scheduler unit tests."""

from datetime import datetime, timezone
from itertools import islice
from zoneinfo import ZoneInfo

from custom_components.tasks.recurrence import (
    add_interval,
    occurrences,
)


def date(year, month, day):
    """Return the shared aware datetime used by recurrence tests."""
    return datetime(year, month, day, 14, 37, tzinfo=timezone.utc)


def task(**values):
    return {
        "task_due": "2026-07-20T14:37:00+00:00",
        "schedule_type": "fixed",
        "schedule_unit": "daily",
        "schedule_interval": 1,
        **values,
    }


def schedule(**values):
    return {
        key: value
        for key, value in task(**values).items()
        if key != "task_due"
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


def test_daily_interval_preserves_local_wall_time_across_dst():
    local_zone = ZoneInfo("Europe/Zurich")

    assert add_interval(
        datetime(2026, 3, 28, 14, 37, tzinfo=local_zone), 1, "day"
    ) == datetime(2026, 3, 29, 14, 37, tzinfo=local_zone)
    assert add_interval(
        datetime(2026, 10, 24, 14, 37, tzinfo=local_zone), 1, "day"
    ) == datetime(2026, 10, 25, 14, 37, tzinfo=local_zone)


def test_monthly_interval_preserves_local_wall_time_across_dst():
    local_zone = ZoneInfo("Europe/Zurich")

    assert add_interval(
        datetime(2026, 3, 21, 8, 0, tzinfo=local_zone), 1, "month"
    ) == datetime(2026, 4, 21, 8, 0, tzinfo=local_zone)


def test_imaginary_dst_time_moves_to_next_valid_local_time():
    local_zone = ZoneInfo("Europe/Zurich")

    assert add_interval(
        datetime(2026, 3, 28, 2, 30, tzinfo=local_zone), 1, "day"
    ) == datetime(2026, 3, 29, 3, 30, tzinfo=local_zone)


def test_sliding_monthly_uses_completion_day():
    value = task(
        task_due="2026-01-31T14:37:00+00:00",
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


def test_fixed_daily_skips_overdue_occurrences():
    assert sequence(task(schedule_interval=3), date(2026, 7, 27)) == [
        date(2026, 7, 29)
    ]


def test_initial_fixed_schedule_uses_selected_time():
    value = schedule(schedule_time="08:15")

    assert sequence(value, date(2026, 7, 20)) == [
        datetime(2026, 7, 21, 8, 15, tzinfo=timezone.utc)
    ]
    assert sequence(
        value,
        datetime(2026, 7, 20, 7, 0, tzinfo=timezone.utc),
    ) == [datetime(2026, 7, 20, 8, 15, tzinfo=timezone.utc)]


def test_existing_fixed_schedule_without_selected_time_keeps_due_time():
    assert sequence(task(), date(2026, 7, 20)) == [date(2026, 7, 21)]


def test_completing_fixed_schedule_early_keeps_upcoming_occurrence():
    cases = (
        task(
            task_due="2026-07-21T14:37:00+00:00",
            schedule_unit="daily",
            schedule_interval=3,
        ),
        task(
            task_due="2026-07-22T14:37:00+00:00",
            schedule_unit="weekly",
            schedule_weekdays=[2],
        ),
        task(
            task_due="2026-07-31T14:37:00+00:00",
            schedule_unit="monthly",
            schedule_day=31,
        ),
        task(
            task_due="2026-12-25T14:37:00+00:00",
            schedule_unit="yearly",
            schedule_month=12,
            schedule_day=25,
        ),
    )

    for value in cases:
        assert sequence(value, date(2026, 7, 20)) == [
            datetime.fromisoformat(value["task_due"])
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
        task_due="2026-01-31T14:37:00+00:00",
        schedule_unit="monthly",
        schedule_day=31,
    )
    assert sequence(value, date(2026, 1, 31)) == [date(2026, 2, 28)]
    value["task_due"] = "2026-02-28T14:37:00+00:00"
    assert sequence(value, date(2026, 2, 28)) == [date(2026, 3, 31)]
    value["schedule_day"] = "last"
    value["task_due"] = "2026-03-31T14:37:00+00:00"
    assert sequence(value, date(2026, 3, 31)) == [date(2026, 4, 30)]


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
    assert sequence(value, date(2026, 7, 23)) == [date(2026, 8, 6)]


def test_initial_fixed_due_is_always_in_the_future():
    now = date(2026, 7, 23)
    schedules = (
        (schedule(schedule_interval=3), date(2026, 7, 26)),
        (
            schedule(
                schedule_unit="weekly",
                schedule_interval=2,
                schedule_weekdays=[3],
            ),
            date(2026, 8, 6),
        ),
        (
            schedule(
                schedule_unit="monthly",
                schedule_interval=2,
                schedule_day=23,
            ),
            date(2026, 9, 23),
        ),
        (
            schedule(
                schedule_unit="yearly",
                schedule_interval=2,
                schedule_month=7,
                schedule_day=23,
            ),
            date(2028, 7, 23),
        ),
    )
    for value, expected in schedules:
        assert sequence(value, now) == [expected]


def test_fixed_yearly_schedule_and_leap_day_clamping():
    yearly = schedule(
        schedule_unit="yearly",
        schedule_month=7,
        schedule_day=1,
    )
    assert sequence(yearly, date(2026, 7, 1)) == [date(2027, 7, 1)]
    assert sequence(yearly, date(2026, 7, 2)) == [date(2027, 7, 1)]
    yearly["schedule_interval"] = 2
    assert sequence(yearly, date(2026, 7, 2), 3) == [
        date(2028, 7, 1),
        date(2030, 7, 1),
        date(2032, 7, 1),
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


def test_sliding_yearly_uses_completion_datetime():
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
