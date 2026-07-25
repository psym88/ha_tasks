"""Tests for native task due values and due events."""

from datetime import datetime, timedelta, timezone
from types import SimpleNamespace

import pytest

from custom_components.tasks.datetime_utils import (
    normalize_utc_datetime,
    parse_aware_datetime,
)
from custom_components.tasks.due_events import TaskDueEventScheduler


def test_task_due_requires_an_aware_datetime_and_normalizes_to_utc():
    assert parse_aware_datetime("2026-07-25T08:00:00+02:00") == datetime(
        2026, 7, 25, 8, tzinfo=timezone(timedelta(hours=2))
    )
    assert normalize_utc_datetime("2026-07-25T08:00:00+02:00") == (
        "2026-07-25T06:00:00+00:00"
    )
    assert normalize_utc_datetime(
        datetime(2026, 7, 25, 8, tzinfo=timezone(timedelta(hours=2)))
    ) == "2026-07-25T06:00:00+00:00"
    with pytest.raises(ValueError, match="datetime_timezone_required"):
        parse_aware_datetime("2026-07-25")
    with pytest.raises(ValueError, match="datetime_timezone_required"):
        parse_aware_datetime("2026-07-25T08:00:00")


def test_due_scheduler_fires_one_event_per_task(monkeypatch):
    events = []
    hass = SimpleNamespace(
        bus=SimpleNamespace(
            async_fire=lambda event_type, data, context=None: events.append(
                (event_type, data)
            )
        )
    )
    store = SimpleNamespace(
        tasks=[
            {
                "task_id": "waiting",
                "task_name": "Waiting",
                "task_due": None,
            },
            {
                "task_id": "one",
                "task_name": "One",
                "task_due": "2026-07-25T08:00:00+00:00",
            },
            {
                "task_id": "two",
                "task_name": "Two",
                "task_due": "2026-07-25T08:00:00+00:00",
            },
            {
                "task_id": "later",
                "task_name": "Later",
                "task_due": "2026-07-25T09:00:00+00:00",
            },
        ]
    )
    scheduler = TaskDueEventScheduler(hass, store)
    monkeypatch.setattr(scheduler, "reschedule", lambda: None)

    scheduler._fire_due(
        datetime(2026, 7, 25, 8, tzinfo=timezone.utc),
        datetime(2026, 7, 25, 8, 0, 1, tzinfo=timezone.utc),
    )

    assert [data["resource_id"] for _, data in events] == ["one", "two"]
    assert all(data["action"] == "task_due" for _, data in events)


def test_due_scheduler_timer_callback_stays_on_event_loop(monkeypatch):
    now = datetime(2026, 7, 25, 8, tzinfo=timezone.utc)
    target = now + timedelta(seconds=10)
    captured = {}
    hass = SimpleNamespace()
    store = SimpleNamespace(
        tasks=[
            {
                "task_id": "one",
                "task_name": "One",
                "task_due": target.isoformat(),
            }
        ]
    )

    def track_point_in_time(received_hass, action, point):
        captured.update(hass=received_hass, action=action, point=point)
        return lambda: None

    monkeypatch.setattr(
        "custom_components.tasks.due_events.dt_util.utcnow", lambda: now
    )
    monkeypatch.setattr(
        "custom_components.tasks.due_events.async_track_point_in_time",
        track_point_in_time,
    )

    TaskDueEventScheduler(hass, store).reschedule()

    assert captured["hass"] is hass
    assert captured["point"] == target
    assert getattr(captured["action"], "_hass_callback", False)
