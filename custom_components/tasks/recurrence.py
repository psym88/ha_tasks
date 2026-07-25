"""Pure recurrence calculations."""

import calendar
from collections.abc import Iterator
from datetime import date, timedelta
from typing import Any

from .due_events import task_due_date

_INTERVAL_UNITS = {
    "daily": "day",
    "weekly": "week",
    "monthly": "month",
    "yearly": "year",
}


def validate_schedule(task: dict[str, Any]) -> None:
    """Reject incomplete recurrence rules."""
    if (
        task.get("schedule_type") not in {"fixed", "sliding"}
        or task.get("schedule_unit") not in _INTERVAL_UNITS
        or task.get("schedule_interval") is None
    ):
        raise ValueError("invalid_frequency")
    if task.get("schedule_type") != "fixed":
        return
    if task.get("schedule_unit") == "weekly" and not task.get("schedule_weekdays"):
        raise ValueError("select_at_least_one_weekday")
    if task.get("schedule_unit") == "monthly" and task.get("schedule_day") is None:
        raise ValueError("select_day_of_month")
    if task.get("schedule_unit") == "yearly":
        if task.get("schedule_month") is None:
            raise ValueError("select_month_of_year")
        if task.get("schedule_day") is None:
            raise ValueError("select_day_of_month")


def validate_trigger(task: dict[str, Any]) -> None:
    """Reject incomplete recurrence and problem-sensor triggers."""
    if task.get("schedule_type") == "sensor":
        problem_sensor = str(task.get("problem_sensor") or "").strip()
        if not problem_sensor.startswith("binary_sensor."):
            raise ValueError("problem_sensor_required")
        return
    validate_schedule(task)


def add_interval(value: date, schedule_interval: int, unit: str) -> date:
    """Advance a date by a simple sliding schedule_interval."""
    if unit == "day":
        return value + timedelta(days=schedule_interval)
    if unit == "week":
        return value + timedelta(weeks=schedule_interval)
    day = value.day
    if unit == "month":
        index = value.month - 1 + schedule_interval
        year, month = value.year + index // 12, index % 12 + 1
        return date(year, month, min(day, calendar.monthrange(year, month)[1]))
    if unit == "year":
        year = value.year + schedule_interval
        return date(year, value.month, min(day, calendar.monthrange(year, value.month)[1]))
    raise ValueError("invalid_frequency")


def _calendar_date(year: int, month: int, selected: int | str) -> date:
    """Return a selected calendar day, clamped to the month's last day."""
    last = calendar.monthrange(year, month)[1]
    day = last if selected == "last" else min(int(selected), last)
    return date(year, month, day)


def _fixed_due_on_or_after(
    task: dict[str, Any], anchor: date, boundary: date
) -> date:
    """Return the first anchored fixed occurrence on or after a boundary."""
    schedule_interval = max(1, int(task.get("schedule_interval") or 1))
    schedule_unit = task.get("schedule_unit", "monthly")
    if schedule_unit == "daily":
        elapsed = max(0, (boundary - anchor).days)
        steps = (elapsed + schedule_interval - 1) // schedule_interval
        return anchor + timedelta(days=steps * schedule_interval)
    if schedule_unit == "weekly":
        schedule_weekdays = sorted(set(int(day) for day in task["schedule_weekdays"]))
        anchor_week = anchor - timedelta(days=anchor.weekday())
        for offset in range(schedule_interval * 7 + 7):
            candidate = boundary + timedelta(days=offset)
            week = candidate - timedelta(days=candidate.weekday())
            if (
                (week - anchor_week).days // 7
            ) % schedule_interval == 0 and candidate.weekday() in schedule_weekdays:
                return candidate
        raise ValueError("invalid_weekly_schedule")
    if schedule_unit == "monthly":
        selected = task["schedule_day"]
        month_delta = (
            (boundary.year - anchor.year) * 12 + boundary.month - anchor.month
        )
        for offset in range(
            max(0, month_delta),
            max(0, month_delta) + schedule_interval + 2,
        ):
            if offset % schedule_interval:
                continue
            index = anchor.month - 1 + offset
            year, month = anchor.year + index // 12, index % 12 + 1
            candidate = _calendar_date(year, month, selected)
            if candidate >= boundary:
                return candidate
        raise ValueError("invalid_monthly_schedule")
    if schedule_unit == "yearly":
        month = int(task["schedule_month"])
        selected = task["schedule_day"]
        for year in range(
            max(boundary.year, anchor.year),
            max(boundary.year, anchor.year) + schedule_interval + 2,
        ):
            if (year - anchor.year) % schedule_interval:
                continue
            candidate = _calendar_date(year, month, selected)
            if candidate >= boundary:
                return candidate
        raise ValueError("invalid_yearly_schedule")
    raise ValueError("invalid_frequency")


def occurrences(task: dict[str, Any], from_date: date) -> Iterator[date]:
    """Yield every occurrence after a completion or from a new schedule boundary."""
    current_due = task_due_date(task) if task.get("task_due") else None
    schedule = dict(task)
    anchor = current_due

    validate_schedule(schedule)
    schedule_interval = max(1, int(schedule.get("schedule_interval") or 1))
    schedule_unit = schedule.get("schedule_unit", "monthly")
    schedule_type = schedule["schedule_type"]

    if current_due is None:
        boundary = from_date
        if schedule_type == "sliding":
            due = add_interval(
                boundary,
                schedule_interval,
                _INTERVAL_UNITS[schedule_unit],
            )
        else:
            due = _fixed_due_on_or_after(
                schedule,
                boundary,
                boundary + timedelta(days=1),
            )
        anchor = due
    elif schedule_type == "sliding":
        unit = _INTERVAL_UNITS[schedule_unit]
        due = add_interval(from_date, schedule_interval, unit)
    else:
        # Completing a calendar task early must not consume its upcoming occurrence.
        assert anchor is not None
        due = (
            current_due
            if from_date < current_due
            else _fixed_due_on_or_after(
                schedule,
                anchor,
                from_date + timedelta(days=1),
            )
        )

    while True:
        yield due
        if schedule_type == "sliding":
            due = add_interval(
                due,
                schedule_interval,
                _INTERVAL_UNITS[schedule_unit],
            )
        else:
            assert anchor is not None
            due = _fixed_due_on_or_after(
                schedule,
                anchor,
                due + timedelta(days=1),
            )
