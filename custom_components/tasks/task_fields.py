"""Declarative API and persistence rules for task fields."""

from __future__ import annotations

from dataclasses import dataclass
from typing import Any, Callable

import voluptuous as vol
from homeassistant.helpers import config_validation as cv

TEXT = vol.Any(str, None)
NOTIFICATION_TARGET = vol.Schema(
    {vol.Optional("device_id"): [str]},
    extra=vol.PREVENT_EXTRA,
)


def _identity(value: Any) -> Any:
    return value


def _name(value: Any) -> str:
    name = str(value or "").strip()
    if not name:
        raise ValueError("name_required")
    return name


def _unique_list(value: Any) -> list[str]:
    return list(dict.fromkeys(value or []))


def _notification_target(value: Any) -> dict[str, list[str]]:
    device_ids = _unique_list((value or {}).get("device_id"))
    return {"device_id": device_ids} if device_ids else {}


def _notification_route(value: Any) -> str | None:
    route = str(value or "").strip()
    if not route:
        return None
    if not route.startswith("/") or route.startswith("//"):
        raise ValueError("invalid_notification_route")
    return route


@dataclass(frozen=True, slots=True)
class TaskField:
    """Describe one independently normalized task value."""

    validator: Any
    default: Any = None
    required: bool = False
    normalize: Callable[[Any], Any] = _identity


TASK_FIELDS = {
    "task_name": TaskField(str, required=True, normalize=_name),
    "task_icon": TaskField(TEXT),
    "task_description": TaskField(TEXT),
    "assignee_id": TaskField(TEXT),
    "label_ids": TaskField([str], default=list, normalize=_unique_list),
    "nfc_tag_id": TaskField(TEXT),
    "notification_target": TaskField(
        NOTIFICATION_TARGET, default=dict, normalize=_notification_target
    ),
    "notification_persistent": TaskField(cv.boolean, False, normalize=bool),
    "notification_critical": TaskField(cv.boolean, False, normalize=bool),
    "notification_route": TaskField(
        vol.Any(None, vol.All(str, vol.Length(max=2048))),
        normalize=_notification_route,
    ),
    "task_due": TaskField(str),
}

SCHEDULE_FIELDS = {
    vol.Required("schedule_type"): vol.In(("fixed", "sliding")),
    vol.Required("schedule_unit"): vol.In(
        ("daily", "weekly", "monthly", "yearly")
    ),
    vol.Required("schedule_interval"): vol.All(
        vol.Coerce(int), vol.Range(min=1)
    ),
    vol.Optional("schedule_weekdays", default=[]): [
        vol.All(vol.Coerce(int), vol.Range(min=0, max=6))
    ],
    vol.Optional("schedule_day"): vol.Any(
        vol.All(vol.Coerce(int), vol.Range(min=1, max=31)), "last", None
    ),
    vol.Optional("schedule_month"): vol.Any(
        vol.All(vol.Coerce(int), vol.Range(min=1, max=12)), None
    ),
    vol.Optional("schedule_start_date"): TEXT,
}
SCHEDULE_FIELD_NAMES = tuple(key.schema for key in SCHEDULE_FIELDS)


def api_task_fields(*, update: bool = False) -> dict[Any, Any]:
    """Build the WebSocket fields from the authoritative task registry."""
    fields = {
        (
            vol.Optional(name)
            if update or not field.required
            else vol.Required(name)
        ): field.validator
        for name, field in TASK_FIELDS.items()
    }
    fields.update(
        {
            vol.Optional(key.schema) if update else key: validator
            for key, validator in SCHEDULE_FIELDS.items()
        }
    )
    return fields


def normalize_task_fields(
    payload: dict[str, Any], *, include_defaults: bool = False
) -> dict[str, Any]:
    """Normalize independent fields present in a task mutation."""
    values: dict[str, Any] = {}
    for name, field in TASK_FIELDS.items():
        if name in payload:
            values[name] = field.normalize(payload[name])
        elif include_defaults and field.required:
            values[name] = field.normalize(None)
        elif include_defaults and not field.required:
            default = field.default() if callable(field.default) else field.default
            values[name] = field.normalize(default)
    return values
