"""Sequential migrations for persisted Tasks data and archive manifests."""

from collections.abc import Callable
from copy import deepcopy
from datetime import datetime, timezone
from typing import Any

import voluptuous as vol

from .const import DOMAIN, STORAGE_VERSION
from .models import Attachment, Completion, Task

ARCHIVE_FORMAT = 3

_FORMAT_1_SCHEMA = vol.Schema(
    {
        vol.Required("format"): vol.Equal(1),
        vol.Required("data"): dict,
    },
    extra=vol.PREVENT_EXTRA,
)


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
            Task.from_mapping(task).record(
                completions=[
                    Completion.from_mapping(entry).record()
                    for entry in history.get(task["task_id"], [])
                ],
                attachments=[
                    Attachment.from_mapping(attachment).record()
                    for attachment in attachments
                    if attachment.get("task_id") == task["task_id"]
                ],
            )
            for task in data.get("tasks", [])
        ]
    }


def _upgrade_store_4_to_5(data: dict[str, Any]) -> dict[str, Any]:
    """Remove retired schedule metadata that has no runtime semantics."""
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


STORE_UPGRADES: dict[int, Callable[[dict[str, Any]], dict[str, Any]]] = {
    1: _upgrade_store_1_to_2,
    2: _upgrade_store_2_to_3,
    3: _upgrade_store_3_to_4,
    4: _upgrade_store_4_to_5,
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


def _upgrade_archive_1_to_2(manifest: dict[str, Any]) -> dict[str, Any]:
    legacy = _FORMAT_1_SCHEMA(manifest)
    return {
        "integration": DOMAIN,
        "format": 2,
        "data": legacy["data"],
    }


def _upgrade_archive_2_to_3(manifest: dict[str, Any]) -> dict[str, Any]:
    """Upgrade legacy date-based task and history values to UTC datetimes."""
    upgraded = deepcopy(manifest)
    data = upgraded.get("data")
    if isinstance(data, dict):
        upgraded["data"] = _upgrade_task_datetimes(data)
    upgraded["format"] = 3
    return upgraded


ARCHIVE_UPGRADES: dict[int, Callable[[dict[str, Any]], dict[str, Any]]] = {
    1: _upgrade_archive_1_to_2,
    2: _upgrade_archive_2_to_3,
}


def upgrade_archive_manifest(
    manifest: Any, conversions: list[tuple[int, int]] | None = None
) -> dict[str, Any]:
    """Return an archive manifest upgraded to the current format."""
    if not isinstance(manifest, dict) or type(manifest.get("format")) is not int:
        raise ValueError("invalid_archive")

    upgraded = dict(manifest)
    while upgraded["format"] < ARCHIVE_FORMAT:
        source_format = upgraded["format"]
        converter = ARCHIVE_UPGRADES.get(source_format)
        if converter is None:
            raise ValueError("unsupported_archive_format")
        try:
            upgraded = converter(upgraded)
        except vol.Invalid as err:
            raise ValueError("invalid_archive") from err
        if conversions is not None:
            conversions.append((source_format, upgraded["format"]))

    if upgraded["format"] != ARCHIVE_FORMAT:
        raise ValueError("unsupported_archive_format")
    return upgraded
