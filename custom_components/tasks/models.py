"""Typed schema-4 task aggregates with schema-3 boundary compatibility."""

from __future__ import annotations

from copy import deepcopy
from dataclasses import dataclass, field
from datetime import datetime
from enum import StrEnum
from typing import Any, ClassVar, Literal, Mapping, TypeAlias

from .datetime_utils import normalize_utc_datetime, parse_aware_datetime

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
TASK_MUTABLE_FIELDS = (
    "task_name",
    "task_icon",
    "task_description",
    "active",
    "assignee_id",
    "label_ids",
    "nfc_tag_id",
    "notification_target",
    "notification_persistent",
    "notification_critical",
    "notification_route",
    "task_due",
    *TRIGGER_FIELDS,
)
_TASK_FIELDS = frozenset(("task_id", *TASK_MUTABLE_FIELDS))
_COMPLETION_FIELDS = frozenset(
    (
        "history_entry_id",
        "completed_at",
        "user_id",
        "user_name",
        "notes",
    )
)
_ATTACHMENT_FIELDS = frozenset(
    (
        "attachment_id",
        "task_id",
        "filename",
        "content_type",
        "size",
        "uploaded_at",
    )
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

    def record(self) -> dict[str, Any]:
        """Serialize the schedule into the schema-4 aggregate."""
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

    def record(self) -> dict[str, Any]:
        """Serialize the schedule into the schema-4 aggregate."""
        return {
            "type": self.type,
            "unit": self.unit.value,
            "interval": self.interval,
        }

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

    def record(self) -> dict[str, Any]:
        """Serialize the trigger into the schema-4 aggregate."""
        return {"type": self.type, "entity_id": self.entity_id}

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


def trigger_from_record(data: Mapping[str, Any]) -> TaskTrigger:
    """Parse one schema-4 schedule record."""
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
    return FixedSchedule(
        unit,
        interval,
        tuple(int(day) for day in data.get("weekdays", ())),
        data.get("day"),
        data.get("month"),
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
    def from_mapping(cls, data: Mapping[str, Any]) -> NotificationSettings:
        """Parse notification values from schema-3 task fields."""
        target = data.get("notification_target") or {}
        device_ids = tuple(dict.fromkeys(target.get("device_id", ())))
        route = str(data.get("notification_route") or "").strip()
        if route and (not route.startswith("/") or route.startswith("//")):
            raise ValueError("invalid_notification_route")
        return cls(
            device_ids=device_ids,
            persistent=bool(data.get("notification_persistent", False)),
            critical=bool(data.get("notification_critical", False)),
            route=route or None,
        )

    def storage_fields(self) -> dict[str, Any]:
        """Serialize to the published schema-3 task fields."""
        return {
            "notification_target": (
                {"device_id": list(self.device_ids)} if self.device_ids else {}
            ),
            "notification_persistent": self.persistent,
            "notification_critical": self.critical,
            "notification_route": self.route,
        }

    @classmethod
    def from_record(
        cls, data: Mapping[str, Any]
    ) -> NotificationSettings:
        """Parse notification settings from the schema-4 aggregate."""
        return cls(
            device_ids=tuple(
                dict.fromkeys(data.get("device_ids") or ())
            ),
            persistent=bool(data.get("persistent", False)),
            critical=bool(data.get("critical", False)),
            route=data.get("route"),
        )

    def record(self) -> dict[str, Any]:
        """Serialize notification settings into the schema-4 aggregate."""
        return {
            "device_ids": list(self.device_ids),
            "persistent": self.persistent,
            "critical": self.critical,
            "route": self.route,
        }


@dataclass(frozen=True, slots=True)
class Task:
    """Typed task aggregate root compatible with schema 3."""

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
    extra: dict[str, Any] = field(default_factory=dict, compare=False)

    @classmethod
    def from_mapping(cls, data: Mapping[str, Any]) -> Task:
        """Parse one API or schema-3 task record."""
        name = str(data.get("task_name") or "").strip()
        if not name:
            raise ValueError("name_required")
        task_id = str(data.get("task_id") or "").strip()
        if not task_id:
            raise ValueError("unknown_task")
        due_value = data.get("task_due")
        due = (
            parse_aware_datetime(due_value)
            if due_value is not None
            else None
        )
        nfc_tag_id = str(data.get("nfc_tag_id") or "").strip() or None
        return cls(
            id=task_id,
            name=name,
            trigger=trigger_from_mapping(data),
            due=due,
            icon=data.get("task_icon"),
            description=data.get("task_description"),
            active=bool(data.get("active", True)),
            assignee_id=data.get("assignee_id"),
            label_ids=tuple(dict.fromkeys(data.get("label_ids") or ())),
            nfc_tag_id=nfc_tag_id,
            notifications=NotificationSettings.from_mapping(data),
            extra=deepcopy(
                {
                    key: value
                    for key, value in data.items()
                    if key not in _TASK_FIELDS
                }
            ),
        )

    def storage_fields(self) -> dict[str, Any]:
        """Serialize to the published schema-3 task representation."""
        return {
            **deepcopy(self.extra),
            "task_id": self.id,
            "task_icon": self.icon,
            "task_description": self.description,
            "assignee_id": self.assignee_id,
            **self.trigger.storage_fields(),
            "task_name": self.name,
            "active": self.active,
            "label_ids": list(self.label_ids),
            "nfc_tag_id": self.nfc_tag_id,
            **self.notifications.storage_fields(),
            "task_due": (
                normalize_utc_datetime(self.due) if self.due is not None else None
            ),
        }

    @classmethod
    def from_record(cls, data: Mapping[str, Any]) -> Task:
        """Parse one task from the schema-4 aggregate."""
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
            extra=deepcopy(data.get("extra") or {}),
        )

    def record(
        self,
        *,
        completions: list[dict[str, Any]] | None = None,
        attachments: list[dict[str, Any]] | None = None,
    ) -> dict[str, Any]:
        """Serialize this task into the schema-4 aggregate."""
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
        if self.extra:
            record["extra"] = deepcopy(self.extra)
        return record


@dataclass(frozen=True, slots=True)
class Completion:
    """One task-completion audit record."""

    id: str
    completed_at: datetime
    user_id: str | None
    user_name: str
    notes: str | None = None
    extra: dict[str, Any] = field(default_factory=dict, compare=False)

    @classmethod
    def from_mapping(cls, data: Mapping[str, Any]) -> Completion:
        """Parse one schema-3 completion record."""
        return cls(
            id=str(data["history_entry_id"]),
            completed_at=parse_aware_datetime(data["completed_at"]),
            user_id=data.get("user_id"),
            user_name=str(data.get("user_name") or "system"),
            notes=str(data.get("notes") or "").strip() or None,
            extra=deepcopy(
                {
                    key: value
                    for key, value in data.items()
                    if key not in _COMPLETION_FIELDS
                }
            ),
        )

    def storage_fields(self) -> dict[str, Any]:
        """Serialize to the published schema-3 history representation."""
        return {
            **deepcopy(self.extra),
            "history_entry_id": self.id,
            "completed_at": normalize_utc_datetime(self.completed_at),
            "user_id": self.user_id,
            "user_name": self.user_name,
            "notes": self.notes,
        }

    @classmethod
    def from_record(cls, data: Mapping[str, Any]) -> Completion:
        """Parse one completion from the schema-4 aggregate."""
        return cls(
            id=str(data["id"]),
            completed_at=parse_aware_datetime(data["completed_at"]),
            user_id=data.get("user_id"),
            user_name=str(data.get("user_name") or "system"),
            notes=str(data.get("notes") or "").strip() or None,
            extra=deepcopy(data.get("extra") or {}),
        )

    def record(self) -> dict[str, Any]:
        """Serialize this completion into the schema-4 aggregate."""
        record = {
            "id": self.id,
            "completed_at": normalize_utc_datetime(self.completed_at),
            "user_id": self.user_id,
            "user_name": self.user_name,
            "notes": self.notes,
        }
        if self.extra:
            record["extra"] = deepcopy(self.extra)
        return record


@dataclass(frozen=True, slots=True)
class Attachment:
    """Metadata for one task attachment."""

    id: str
    task_id: str
    filename: str
    content_type: str
    size: int
    uploaded_at: datetime
    extra: dict[str, Any] = field(default_factory=dict, compare=False)

    @classmethod
    def from_mapping(cls, data: Mapping[str, Any]) -> Attachment:
        """Parse one schema-3 attachment record."""
        return cls(
            id=str(data["attachment_id"]),
            task_id=str(data["task_id"]),
            filename=str(data["filename"]),
            content_type=str(data["content_type"]),
            size=int(data["size"]),
            uploaded_at=parse_aware_datetime(data["uploaded_at"]),
            extra=deepcopy(
                {
                    key: value
                    for key, value in data.items()
                    if key not in _ATTACHMENT_FIELDS
                }
            ),
        )

    def storage_fields(self) -> dict[str, Any]:
        """Serialize to the published schema-3 attachment representation."""
        return {
            **deepcopy(self.extra),
            "attachment_id": self.id,
            "task_id": self.task_id,
            "filename": self.filename,
            "content_type": self.content_type,
            "size": self.size,
            "uploaded_at": normalize_utc_datetime(self.uploaded_at),
        }

    @classmethod
    def from_record(
        cls, data: Mapping[str, Any], task_id: str
    ) -> Attachment:
        """Parse attachment metadata from the schema-4 aggregate."""
        return cls(
            id=str(data["id"]),
            task_id=task_id,
            filename=str(data["filename"]),
            content_type=str(data["content_type"]),
            size=int(data["size"]),
            uploaded_at=parse_aware_datetime(data["uploaded_at"]),
            extra=deepcopy(data.get("extra") or {}),
        )

    def record(self) -> dict[str, Any]:
        """Serialize attachment metadata into its owning task."""
        record = {
            "id": self.id,
            "filename": self.filename,
            "content_type": self.content_type,
            "size": self.size,
            "uploaded_at": normalize_utc_datetime(self.uploaded_at),
        }
        if self.extra:
            record["extra"] = deepcopy(self.extra)
        return record
