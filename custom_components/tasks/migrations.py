"""Sequential migrations for persisted Tasks data."""

from collections.abc import Callable
from copy import deepcopy
from datetime import datetime, timezone
from typing import Any

from .const import STORAGE_VERSION


def _utc_datetime(value: Any) -> Any:
    """Convert a legacy ISO date or datetime to an aware UTC datetime."""
    if not isinstance(value, str):
        return value
    try:
        parsed = datetime.fromisoformat(value)
    except ValueError:
        return value
    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)
    return parsed.astimezone(timezone.utc).isoformat()


def _upgrade_task_datetimes(data: dict[str, Any]) -> dict[str, Any]:
    """Convert legacy task and history values to UTC datetimes."""
    upgraded = deepcopy(data)
    for task in upgraded.get("tasks", []):
        if isinstance(task, dict) and task.get("task_due") is not None:
            task["task_due"] = _utc_datetime(task["task_due"])

    history = upgraded.get("history", {})
    if isinstance(history, dict):
        for entries in history.values():
            if not isinstance(entries, list):
                continue
            for entry in entries:
                if not isinstance(entry, dict):
                    continue
                completed_at = entry.get(
                    "completed_at",
                    entry.get("recorded_at", entry.get("completion_date")),
                )
                if completed_at is not None:
                    entry["completed_at"] = _utc_datetime(completed_at)
                entry.pop("completion_date", None)
                entry.pop("recorded_at", None)
                for field in ("task_due_before", "task_due_after"):
                    if entry.get(field) is not None:
                        entry[field] = _utc_datetime(entry[field])
    return upgraded


def _upgrade_store_1_to_2(data: dict[str, Any]) -> dict[str, Any]:
    return _upgrade_task_datetimes(data)


def _upgrade_store_2_to_3(data: dict[str, Any]) -> dict[str, Any]:
    """Add defaults introduced by task scheduling and pausing."""
    upgraded = deepcopy(data)
    for task in upgraded.get("tasks", []):
        if not isinstance(task, dict) or "task_id" not in task:
            continue
        task.setdefault("active", True)
        task.setdefault("schedule_time", None)
    return upgraded


def _upgrade_store_3_to_4(data: dict[str, Any]) -> dict[str, Any]:
    """Embed each task's schedule, notifications, history, and attachments."""
    if all(
        isinstance(task, dict) and "id" in task and "schedule" in task
        for task in data.get("tasks", [])
    ) and set(data) == {"tasks"}:
        return deepcopy(data)

    history = data.get("history") or {}
    attachments = data.get("attachments") or []
    return {
        "tasks": [
            _legacy_task_to_record(
                task,
                history.get(task["task_id"], []),
                [
                    attachment
                    for attachment in attachments
                    if attachment.get("task_id") == task["task_id"]
                ],
            )
            for task in data.get("tasks", [])
        ]
    }


def _legacy_schedule(task: dict[str, Any]) -> dict[str, Any]:
    """Convert one flat schedule inside the converter boundary."""
    schedule_type = task.get("schedule_type")
    if schedule_type == "sensor":
        return {"type": "sensor", "entity_id": task.get("problem_sensor")}
    schedule = {
        "type": schedule_type,
        "unit": task.get("schedule_unit"),
        "interval": task.get("schedule_interval"),
    }
    if schedule_type == "fixed":
        unit = task.get("schedule_unit")
        if unit == "weekly":
            schedule["weekdays"] = list(task.get("schedule_weekdays") or [])
        elif unit == "monthly":
            schedule["day"] = task.get("schedule_day")
        elif unit == "yearly":
            schedule["day"] = task.get("schedule_day")
            schedule["month"] = task.get("schedule_month")
        if task.get("schedule_time") is not None:
            schedule["time"] = task["schedule_time"]
    return schedule


def _legacy_task_to_record(
    task: dict[str, Any],
    completions: list[dict[str, Any]],
    attachments: list[dict[str, Any]],
) -> dict[str, Any]:
    """Convert one flat task aggregate without retaining unknown fields."""
    target = task.get("notification_target") or {}
    return {
        "id": task["task_id"],
        "name": task["task_name"],
        "icon": task.get("task_icon"),
        "description": task.get("task_description"),
        "active": bool(task.get("active", True)),
        "assignee_id": task.get("assignee_id"),
        "label_ids": list(dict.fromkeys(task.get("label_ids") or [])),
        "nfc_tag_id": task.get("nfc_tag_id"),
        "due": task.get("task_due"),
        "schedule": _legacy_schedule(task),
        "notification": {
            "device_ids": list(dict.fromkeys(target.get("device_id") or [])),
            "persistent": bool(task.get("notification_persistent", False)),
            "critical": bool(task.get("notification_critical", False)),
            "route": task.get("notification_route"),
        },
        "completions": [
            {
                "id": entry["history_entry_id"],
                "completed_at": entry["completed_at"],
                "user_id": entry.get("user_id"),
                "user_name": entry.get("user_name") or "system",
                "notes": entry.get("notes"),
            }
            for entry in completions
        ],
        "attachments": [
            {
                "id": attachment["attachment_id"],
                "filename": attachment["filename"],
                "content_type": attachment["content_type"],
                "size": attachment["size"],
                "uploaded_at": attachment["uploaded_at"],
            }
            for attachment in attachments
        ],
    }


def _upgrade_store_4_to_5(data: dict[str, Any]) -> dict[str, Any]:
    """Remove retired schedule metadata from the published schema 4."""
    upgraded = deepcopy(data)
    for task in upgraded.get("tasks", []):
        if not isinstance(task, dict):
            continue
        extra = task.get("extra")
        if not isinstance(extra, dict):
            continue
        extra.pop("schedule_anchor_date", None)
        extra.pop("schedule_start_date", None)
        if not extra:
            task.pop("extra")
    return upgraded


def _upgrade_store_5_to_6(data: dict[str, Any]) -> dict[str, Any]:
    """Keep only fields defined by the current task aggregate."""
    upgraded = deepcopy(data)
    cleaned = []
    for task in upgraded.get("tasks", []):
        if not isinstance(task, dict):
            continue
        schedule = task.get("schedule") or {}
        schedule_keys = {"type", "unit", "interval"}
        if schedule.get("type") == "fixed":
            schedule_keys |= {"weekdays", "day", "month", "time"}
        elif schedule.get("type") == "sensor":
            schedule_keys = {"type", "entity_id"}
        cleaned.append({
            key: value
            for key, value in task.items()
            if key
            in {
                "id",
                "name",
                "icon",
                "description",
                "active",
                "assignee_id",
                "label_ids",
                "nfc_tag_id",
                "due",
                "schedule",
                "notification",
                "completions",
                "attachments",
            }
        })
        cleaned[-1]["schedule"] = {
            key: value for key, value in schedule.items()
            if key in schedule_keys
        }
        notification = task.get("notification") or {}
        cleaned[-1]["notification"] = {
            key: value for key, value in notification.items()
            if key in {"device_ids", "persistent", "critical", "route"}
        }
        cleaned[-1]["completions"] = [
            {
                key: value for key, value in entry.items()
                if key in {
                    "id", "completed_at", "user_id", "user_name", "notes"
                }
            }
            for entry in task.get("completions", [])
            if isinstance(entry, dict)
        ]
        cleaned[-1]["attachments"] = [
            {
                key: value for key, value in attachment.items()
                if key in {
                    "id",
                    "filename",
                    "content_type",
                    "size",
                    "uploaded_at",
                }
            }
            for attachment in task.get("attachments", [])
            if isinstance(attachment, dict)
        ]
    upgraded["tasks"] = cleaned
    return upgraded


STORE_UPGRADES: dict[int, Callable[[dict[str, Any]], dict[str, Any]]] = {
    1: _upgrade_store_1_to_2,
    2: _upgrade_store_2_to_3,
    3: _upgrade_store_3_to_4,
    4: _upgrade_store_4_to_5,
    5: _upgrade_store_5_to_6,
}


def upgrade_store_data(old_version: int, data: Any) -> dict[str, Any]:
    """Upgrade persisted data from one published schema to the current version."""
    if (
        type(old_version) is not int
        or old_version < 1
        or old_version > STORAGE_VERSION
        or not isinstance(data, dict)
    ):
        raise ValueError("unsupported_store_version")

    upgraded = deepcopy(data)
    version = old_version
    while version < STORAGE_VERSION:
        converter = STORE_UPGRADES.get(version)
        if converter is None:
            raise ValueError("unsupported_store_version")
        upgraded = converter(upgraded)
        version += 1
    return upgraded
