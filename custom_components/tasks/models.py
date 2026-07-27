"""Typed Tasks domain values with schema-3 compatibility."""

from __future__ import annotations

from dataclasses import dataclass
from enum import StrEnum
from typing import Any, ClassVar, Literal, Mapping, TypeAlias

TRIGGER_FIELDS = (
    "schedule_type",
    "schedule_unit",
    "schedule_interval",
    "schedule_weekdays",
    "schedule_day",
    "schedule_month",
    "schedule_time",
    "problem_sensor",
)

ScheduleDay: TypeAlias = int | Literal["last"] | None


class ScheduleUnit(StrEnum):
    """Supported recurrence units."""

    DAILY = "daily"
    WEEKLY = "weekly"
    MONTHLY = "monthly"
    YEARLY = "yearly"

    @property
    def interval_unit(self) -> str:
        """Return the singular interval name used by date arithmetic."""
        return {
            ScheduleUnit.DAILY: "day",
            ScheduleUnit.WEEKLY: "week",
            ScheduleUnit.MONTHLY: "month",
            ScheduleUnit.YEARLY: "year",
        }[self]


def _recurrence_values(data: Mapping[str, Any]) -> tuple[ScheduleUnit, int]:
    """Parse values shared by fixed and after-completion schedules."""
    try:
        unit = ScheduleUnit(data.get("schedule_unit"))
        interval = max(1, int(data.get("schedule_interval") or 1))
    except (TypeError, ValueError) as err:
        raise ValueError("invalid_frequency") from err
    if data.get("schedule_interval") is None:
        raise ValueError("invalid_frequency")
    return unit, interval


def _empty_storage_fields() -> dict[str, Any]:
    """Return every schema-3 trigger field with an inactive value."""
    return {
        "schedule_type": None,
        "schedule_unit": None,
        "schedule_interval": None,
        "schedule_weekdays": [],
        "schedule_day": None,
        "schedule_month": None,
        "schedule_time": None,
        "problem_sensor": None,
    }


@dataclass(frozen=True, slots=True)
class FixedSchedule:
    """Calendar-anchored recurrence."""

    type: ClassVar[str] = "fixed"
    unit: ScheduleUnit
    interval: int
    weekdays: tuple[int, ...] = ()
    day: ScheduleDay = None
    month: int | None = None
    time: str | None = None

    def signature(self) -> tuple[Any, ...]:
        """Return values that affect this schedule."""
        values: list[Any] = [self.type, self.unit.value, self.interval, self.time]
        if self.unit is ScheduleUnit.WEEKLY:
            values.append(tuple(sorted(self.weekdays)))
        elif self.unit is ScheduleUnit.MONTHLY:
            values.append(self.day)
        elif self.unit is ScheduleUnit.YEARLY:
            values.extend((self.month, self.day))
        return tuple(values)

    def storage_fields(self) -> dict[str, Any]:
        """Serialize to the published schema-3 task fields."""
        fields = _empty_storage_fields()
        fields.update(
            {
                "schedule_type": self.type,
                "schedule_unit": self.unit.value,
                "schedule_interval": self.interval,
                "schedule_weekdays": (
                    list(self.weekdays)
                    if self.unit is ScheduleUnit.WEEKLY
                    else []
                ),
                "schedule_day": (
                    self.day
                    if self.unit in {ScheduleUnit.MONTHLY, ScheduleUnit.YEARLY}
                    else None
                ),
                "schedule_month": (
                    self.month if self.unit is ScheduleUnit.YEARLY else None
                ),
                "schedule_time": self.time,
            }
        )
        return fields


@dataclass(frozen=True, slots=True)
class AfterCompletionSchedule:
    """Recurrence measured from each completion."""

    type: ClassVar[str] = "sliding"
    unit: ScheduleUnit
    interval: int

    def signature(self) -> tuple[Any, ...]:
        """Return values that affect this schedule."""
        return (self.type, self.unit.value, self.interval)

    def storage_fields(self) -> dict[str, Any]:
        """Serialize to the published schema-3 task fields."""
        fields = _empty_storage_fields()
        fields.update(
            {
                "schedule_type": self.type,
                "schedule_unit": self.unit.value,
                "schedule_interval": self.interval,
            }
        )
        return fields


@dataclass(frozen=True, slots=True)
class ProblemTrigger:
    """Binary-sensor problem trigger."""

    type: ClassVar[str] = "sensor"
    entity_id: str

    def signature(self) -> tuple[Any, ...]:
        """Return values that affect this trigger."""
        return (self.type, self.entity_id)

    def storage_fields(self) -> dict[str, Any]:
        """Serialize to the published schema-3 task fields."""
        fields = _empty_storage_fields()
        fields.update(
            {
                "schedule_type": self.type,
                "problem_sensor": self.entity_id,
            }
        )
        return fields


TaskTrigger: TypeAlias = FixedSchedule | AfterCompletionSchedule | ProblemTrigger


def trigger_from_mapping(data: Mapping[str, Any]) -> TaskTrigger:
    """Parse and validate one trigger from API or schema-3 task fields."""
    schedule_type = data.get("schedule_type")
    if schedule_type == ProblemTrigger.type:
        entity_id = str(data.get("problem_sensor") or "").strip()
        if not entity_id.startswith("binary_sensor."):
            raise ValueError("problem_sensor_required")
        return ProblemTrigger(entity_id)
    if schedule_type not in {FixedSchedule.type, AfterCompletionSchedule.type}:
        raise ValueError("invalid_frequency")

    unit, interval = _recurrence_values(data)
    if schedule_type == AfterCompletionSchedule.type:
        return AfterCompletionSchedule(unit, interval)

    selected_weekdays = tuple(
        int(day) for day in data.get("schedule_weekdays") or ()
    )
    selected_day = data.get("schedule_day")
    selected_month = data.get("schedule_month")
    if unit is ScheduleUnit.WEEKLY and not selected_weekdays:
        raise ValueError("select_at_least_one_weekday")
    if unit is ScheduleUnit.MONTHLY and selected_day is None:
        raise ValueError("select_day_of_month")
    if unit is ScheduleUnit.YEARLY:
        if selected_month is None:
            raise ValueError("select_month_of_year")
        if selected_day is None:
            raise ValueError("select_day_of_month")
    return FixedSchedule(
        unit=unit,
        interval=interval,
        weekdays=(
            selected_weekdays if unit is ScheduleUnit.WEEKLY else ()
        ),
        day=(
            selected_day
            if unit in {ScheduleUnit.MONTHLY, ScheduleUnit.YEARLY}
            else None
        ),
        month=(
            int(selected_month)
            if unit is ScheduleUnit.YEARLY and selected_month is not None
            else None
        ),
        time=data.get("schedule_time"),
    )
