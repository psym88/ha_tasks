"""Pure recurrence calculations."""

import calendar
from collections.abc import Iterator
from datetime import datetime, timedelta, timezone
from typing import Any

from homeassistant.util import dt as dt_util

from .datetime_utils import parse_aware_datetime
from .models import (
    AfterCompletionSchedule,
    FixedSchedule,
    ProblemTrigger,
    trigger_from_mapping,
)

def _resolve_local(value: datetime) -> datetime:
    """Resolve imaginary local times and choose the first ambiguous occurrence."""
    value = value.replace(fold=0)
    return value.astimezone(timezone.utc).astimezone(value.tzinfo)


def _with_date(value: datetime, year: int, month: int, day: int) -> datetime:
    """Move a local datetime to a calendar date while preserving its wall time."""
    return _resolve_local(value.replace(year=year, month=month, day=day))


def _with_schedule_time(task: dict[str, Any], value: datetime) -> datetime:
    """Apply an optional fixed wall-clock time to a local datetime."""
    if not (schedule_time := task.get("schedule_time")):
        return value
    hour, minute = (int(part) for part in schedule_time.split(":"))
    return _resolve_local(
        value.replace(hour=hour, minute=minute, second=0, microsecond=0)
    )


def add_interval(value: datetime, schedule_interval: int, unit: str) -> datetime:
    """Advance a local datetime by one recurrence interval."""
    if unit == "day":
        return _resolve_local(value + timedelta(days=schedule_interval))
    if unit == "week":
        return _resolve_local(value + timedelta(weeks=schedule_interval))
    day = value.day
    if unit == "month":
        index = value.month - 1 + schedule_interval
        year, month = value.year + index // 12, index % 12 + 1
        return _with_date(
            value, year, month, min(day, calendar.monthrange(year, month)[1])
        )
    if unit == "year":
        year = value.year + schedule_interval
        return _with_date(
            value,
            year,
            value.month,
            min(day, calendar.monthrange(year, value.month)[1]),
        )
    raise ValueError("invalid_frequency")


def _calendar_datetime(
    template: datetime, year: int, month: int, selected: int | str
) -> datetime:
    """Return a selected local datetime, clamped to the month's last day."""
    last = calendar.monthrange(year, month)[1]
    day = last if selected == "last" else min(int(selected), last)
    return _with_date(template, year, month, day)


def _fixed_due_on_or_after(
    task: dict[str, Any], anchor: datetime, boundary: datetime
) -> datetime:
    """Return the first anchored fixed occurrence on or after a boundary."""
    schedule_interval = max(1, int(task.get("schedule_interval") or 1))
    schedule_unit = task.get("schedule_unit", "monthly")
    if schedule_unit == "daily":
        elapsed = max(0, boundary.toordinal() - anchor.toordinal())
        steps = elapsed // schedule_interval
        candidate = add_interval(anchor, steps * schedule_interval, "day")
        if candidate < boundary:
            candidate = add_interval(candidate, schedule_interval, "day")
        return candidate
    if schedule_unit == "weekly":
        schedule_weekdays = sorted(set(int(day) for day in task["schedule_weekdays"]))
        anchor_week = anchor.toordinal() - anchor.weekday()
        for offset in range(schedule_interval * 7 + 7):
            target = add_interval(boundary, offset, "day")
            candidate = _with_date(anchor, target.year, target.month, target.day)
            week = target.toordinal() - target.weekday()
            if (
                (week - anchor_week) // 7
            ) % schedule_interval == 0 and (
                candidate.weekday() in schedule_weekdays
                and candidate >= boundary
            ):
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
            candidate = _calendar_datetime(anchor, year, month, selected)
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
            candidate = _calendar_datetime(anchor, year, month, selected)
            if candidate >= boundary:
                return candidate
        raise ValueError("invalid_yearly_schedule")
    raise ValueError("invalid_frequency")


def occurrences(
    task: dict[str, Any], from_datetime: datetime
) -> Iterator[datetime]:
    """Yield local datetimes after a completion or new schedule boundary."""
    if from_datetime.tzinfo is None:
        raise ValueError("recurrence_timezone_required")
    trigger = trigger_from_mapping(task)
    if isinstance(trigger, ProblemTrigger):
        raise ValueError("invalid_frequency")
    boundary = dt_util.as_local(from_datetime)
    current_due = (
        dt_util.as_local(parse_aware_datetime(task["task_due"]))
        if task.get("task_due")
        else None
    )
    anchor = (
        _with_schedule_time(task, current_due or boundary)
        if isinstance(trigger, FixedSchedule)
        else current_due
    )

    schedule_interval = trigger.interval
    schedule_unit = trigger.unit

    if current_due is None:
        if isinstance(trigger, AfterCompletionSchedule):
            due = add_interval(
                boundary,
                schedule_interval,
                schedule_unit.interval_unit,
            )
        else:
            assert anchor is not None
            due = _fixed_due_on_or_after(
                task,
                anchor,
                boundary + timedelta(microseconds=1),
            )
        anchor = due
    elif isinstance(trigger, AfterCompletionSchedule):
        due = add_interval(
            boundary, schedule_interval, schedule_unit.interval_unit
        )
    else:
        # Completing a calendar task early must not consume its upcoming occurrence.
        assert anchor is not None
        due = (
            current_due
            if boundary < current_due
            else _fixed_due_on_or_after(
                task,
                anchor,
                boundary + timedelta(microseconds=1),
            )
        )

    while True:
        yield due
        if isinstance(trigger, AfterCompletionSchedule):
            due = add_interval(
                due,
                schedule_interval,
                schedule_unit.interval_unit,
            )
        else:
            assert anchor is not None
            due = _fixed_due_on_or_after(
                task,
                anchor,
                due + timedelta(microseconds=1),
            )
