"""Typed task aggregates."""

from __future__ import annotations

from copy import deepcopy
from dataclasses import dataclass, field
from datetime import datetime
from enum import StrEnum
from typing import Any, ClassVar, Literal, Mapping, TypeAlias

from .datetime_utils import normalize_utc_datetime, parse_aware_datetime

TRIGGER_FIELDS = ("schedule",)
TASK_MUTABLE_FIELDS = (
    "name",
    "icon",
    "description",
    "active",
    "assignee_id",
    "label_ids",
    "nfc_tag_id",
    "notification",
    "due",
    *TRIGGER_FIELDS,
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

    def record(self) -> dict[str, Any]:
        """Serialize the schedule into the persisted aggregate."""
        record: dict[str, Any] = {
            "type": self.type,
            "unit": self.unit.value,
            "interval": self.interval,
        }
        if self.unit is ScheduleUnit.WEEKLY:
            record["weekdays"] = list(self.weekdays)
        elif self.unit is ScheduleUnit.MONTHLY:
            record["day"] = self.day
        elif self.unit is ScheduleUnit.YEARLY:
            record.update({"day": self.day, "month": self.month})
        if self.time is not None:
            record["time"] = self.time
        return record

@dataclass(frozen=True, slots=True)
class AfterCompletionSchedule:
    """Recurrence measured from each completion."""

    type: ClassVar[str] = "sliding"
    unit: ScheduleUnit
    interval: int

    def signature(self) -> tuple[Any, ...]:
        """Return values that affect this schedule."""
        return (self.type, self.unit.value, self.interval)

    def record(self) -> dict[str, Any]:
        """Serialize the schedule into the persisted aggregate."""
        return {
            "type": self.type,
            "unit": self.unit.value,
            "interval": self.interval,
        }

@dataclass(frozen=True, slots=True)
class ProblemTrigger:
    """Binary-sensor problem trigger."""

    type: ClassVar[str] = "sensor"
    entity_id: str

    def signature(self) -> tuple[Any, ...]:
        """Return values that affect this trigger."""
        return (self.type, self.entity_id)

    def record(self) -> dict[str, Any]:
        """Serialize the trigger into the persisted aggregate."""
        return {"type": self.type, "entity_id": self.entity_id}

TaskTrigger: TypeAlias = FixedSchedule | AfterCompletionSchedule | ProblemTrigger


def trigger_from_record(data: Mapping[str, Any]) -> TaskTrigger:
    """Parse and validate the current schedule representation."""
    schedule_type = data.get("type")
    if schedule_type == ProblemTrigger.type:
        entity_id = str(data.get("entity_id") or "").strip()
        if not entity_id.startswith("binary_sensor."):
            raise ValueError("problem_sensor_required")
        return ProblemTrigger(entity_id)
    try:
        unit = ScheduleUnit(data.get("unit"))
        interval = max(1, int(data.get("interval")))
    except (TypeError, ValueError) as err:
        raise ValueError("invalid_frequency") from err
    if schedule_type == AfterCompletionSchedule.type:
        return AfterCompletionSchedule(unit, interval)
    if schedule_type != FixedSchedule.type:
        raise ValueError("invalid_frequency")
    weekdays = tuple(int(day) for day in data.get("weekdays", ()))
    day = data.get("day")
    month = data.get("month")
    if unit is ScheduleUnit.WEEKLY and not weekdays:
        raise ValueError("select_at_least_one_weekday")
    if unit is ScheduleUnit.MONTHLY and day is None:
        raise ValueError("select_day_of_month")
    if unit is ScheduleUnit.YEARLY:
        if month is None:
            raise ValueError("select_month_of_year")
        if day is None:
            raise ValueError("select_day_of_month")
    return FixedSchedule(
        unit,
        interval,
        weekdays if unit is ScheduleUnit.WEEKLY else (),
        day if unit in {ScheduleUnit.MONTHLY, ScheduleUnit.YEARLY} else None,
        int(month) if unit is ScheduleUnit.YEARLY else None,
        data.get("time"),
    )


@dataclass(frozen=True, slots=True)
class NotificationSettings:
    """Task due-notification settings."""

    device_ids: tuple[str, ...] = ()
    persistent: bool = False
    critical: bool = False
    route: str | None = None

    @classmethod
    def from_record(
        cls, data: Mapping[str, Any]
    ) -> NotificationSettings:
        """Parse notification settings from the persisted aggregate."""
        route = str(data.get("route") or "").strip()
        if route and (not route.startswith("/") or route.startswith("//")):
            raise ValueError("invalid_notification_route")
        return cls(
            device_ids=tuple(
                dict.fromkeys(data.get("device_ids") or ())
            ),
            persistent=bool(data.get("persistent", False)),
            critical=bool(data.get("critical", False)),
            route=route or None,
        )

    def record(self) -> dict[str, Any]:
        """Serialize notification settings into the persisted aggregate."""
        return {
            "device_ids": list(self.device_ids),
            "persistent": self.persistent,
            "critical": self.critical,
            "route": self.route,
        }


@dataclass(frozen=True, slots=True)
class Task:
    """Typed task aggregate root."""

    id: str
    name: str
    trigger: TaskTrigger
    due: datetime | None
    icon: str | None = None
    description: str | None = None
    active: bool = True
    assignee_id: str | None = None
    label_ids: tuple[str, ...] = ()
    nfc_tag_id: str | None = None
    notifications: NotificationSettings = field(
        default_factory=NotificationSettings
    )
    @classmethod
    def from_record(cls, data: Mapping[str, Any]) -> Task:
        """Parse one task from the persisted aggregate."""
        name = str(data.get("name") or "").strip()
        task_id = str(data.get("id") or "").strip()
        if not name:
            raise ValueError("name_required")
        if not task_id:
            raise ValueError("unknown_task")
        due_value = data.get("due")
        return cls(
            id=task_id,
            name=name,
            trigger=trigger_from_record(data.get("schedule") or {}),
            due=(
                parse_aware_datetime(due_value)
                if due_value is not None
                else None
            ),
            icon=data.get("icon"),
            description=data.get("description"),
            active=bool(data.get("active", True)),
            assignee_id=data.get("assignee_id"),
            label_ids=tuple(
                dict.fromkeys(data.get("label_ids") or ())
            ),
            nfc_tag_id=str(data.get("nfc_tag_id") or "").strip() or None,
            notifications=NotificationSettings.from_record(
                data.get("notification") or {}
            ),
        )

    def record(
        self,
        *,
        completions: list[dict[str, Any]] | None = None,
        attachments: list[dict[str, Any]] | None = None,
    ) -> dict[str, Any]:
        """Serialize this task into the persisted aggregate."""
        record = {
            "id": self.id,
            "name": self.name,
            "icon": self.icon,
            "description": self.description,
            "active": self.active,
            "assignee_id": self.assignee_id,
            "label_ids": list(self.label_ids),
            "nfc_tag_id": self.nfc_tag_id,
            "due": (
                normalize_utc_datetime(self.due)
                if self.due is not None
                else None
            ),
            "schedule": self.trigger.record(),
            "notification": self.notifications.record(),
            "completions": deepcopy(completions or []),
            "attachments": deepcopy(attachments or []),
        }
        return record


@dataclass(frozen=True, slots=True)
class Completion:
    """One task-completion audit record."""

    id: str
    completed_at: datetime
    user_id: str | None
    user_name: str
    notes: str | None = None
    @classmethod
    def from_record(cls, data: Mapping[str, Any]) -> Completion:
        """Parse one completion from the persisted aggregate."""
        return cls(
            id=str(data["id"]),
            completed_at=parse_aware_datetime(data["completed_at"]),
            user_id=data.get("user_id"),
            user_name=str(data.get("user_name") or "system"),
            notes=str(data.get("notes") or "").strip() or None,
        )

    def record(self) -> dict[str, Any]:
        """Serialize this completion into the persisted aggregate."""
        return {
            "id": self.id,
            "completed_at": normalize_utc_datetime(self.completed_at),
            "user_id": self.user_id,
            "user_name": self.user_name,
            "notes": self.notes,
        }


@dataclass(frozen=True, slots=True)
class Attachment:
    """Metadata for one task attachment."""

    id: str
    filename: str
    content_type: str
    size: int
    uploaded_at: datetime
    @classmethod
    def from_record(cls, data: Mapping[str, Any]) -> Attachment:
        """Parse attachment metadata from the persisted aggregate."""
        return cls(
            id=str(data["id"]),
            filename=str(data["filename"]),
            content_type=str(data["content_type"]),
            size=int(data["size"]),
            uploaded_at=parse_aware_datetime(data["uploaded_at"]),
        )

    def record(self) -> dict[str, Any]:
        """Serialize attachment metadata into its owning task."""
        return {
            "id": self.id,
            "filename": self.filename,
            "content_type": self.content_type,
            "size": self.size,
            "uploaded_at": normalize_utc_datetime(self.uploaded_at),
        }
