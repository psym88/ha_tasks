"""Sequential migrations for persisted Tasks store data."""

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


def _upgrade_1_to_2(data: dict[str, Any]) -> dict[str, Any]:
    """Convert legacy date-based task and history values to UTC datetimes."""
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


def _upgrade_2_to_3(data: dict[str, Any]) -> dict[str, Any]:
    """Add defaults introduced by task scheduling and pausing."""
    upgraded = deepcopy(data)
    for task in upgraded.get("tasks", []):
        if not isinstance(task, dict):
            continue
        task.setdefault("active", True)
        task.setdefault("schedule_time", None)
    return upgraded


STORE_UPGRADES: dict[int, Callable[[dict[str, Any]], dict[str, Any]]] = {
    1: _upgrade_1_to_2,
    2: _upgrade_2_to_3,
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
