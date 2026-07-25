"""Upgrade imported Tasks archive manifests to the current format."""

from collections.abc import Callable
from copy import deepcopy
from datetime import datetime, timezone
from typing import Any

import voluptuous as vol

from .const import DOMAIN

ARCHIVE_FORMAT = 3

_FORMAT_1_SCHEMA = vol.Schema(
    {
        vol.Required("format"): vol.Equal(1),
        vol.Required("data"): dict,
    },
    extra=vol.PREVENT_EXTRA,
)


def _upgrade_1_to_2(manifest: dict[str, Any]) -> dict[str, Any]:
    legacy = _FORMAT_1_SCHEMA(manifest)
    return {
        "integration": DOMAIN,
        "format": 2,
        "data": legacy["data"],
    }


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


def _upgrade_2_to_3(manifest: dict[str, Any]) -> dict[str, Any]:
    """Upgrade legacy date-based task and history values to UTC datetimes."""
    upgraded = deepcopy(manifest)
    data = upgraded.get("data")
    if not isinstance(data, dict):
        return upgraded

    for task in data.get("tasks", []):
        if isinstance(task, dict) and task.get("task_due") is not None:
            task["task_due"] = _utc_datetime(task["task_due"])

    history = data.get("history", {})
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

    upgraded["format"] = 3
    return upgraded


_UPGRADES: dict[int, Callable[[dict[str, Any]], dict[str, Any]]] = {
    1: _upgrade_1_to_2,
    2: _upgrade_2_to_3,
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
        converter = _UPGRADES.get(source_format)
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
