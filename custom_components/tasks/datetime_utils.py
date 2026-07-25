"""Datetime parsing and serialization helpers."""

from datetime import datetime

from homeassistant.util import dt as dt_util


def parse_aware_datetime(value: str) -> datetime:
    """Parse a timezone-aware datetime."""
    parsed = datetime.fromisoformat(value)
    if parsed.tzinfo is None:
        raise ValueError("datetime_timezone_required")
    return parsed


def normalize_utc_datetime(value: str | datetime) -> str:
    """Return a canonical UTC datetime string."""
    parsed = parse_aware_datetime(value) if isinstance(value, str) else value
    if parsed.tzinfo is None:
        raise ValueError("datetime_timezone_required")
    return dt_util.as_utc(parsed).isoformat()
