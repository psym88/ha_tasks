"""Tests for task persistence normalization."""

import asyncio
from datetime import date

from custom_components.tasks.task_store import TasksStore


def _store(task):
    store = TasksStore.__new__(TasksStore)
    store._lock = asyncio.Lock()
    store._data = {"tasks": [task], "history": {}, "attachments": []}

    async def save():
        return None

    store._save = save
    return store


def _weekly_task():
    return {
        "task_id": "task",
        "task_name": "Task",
        "task_description": None,
        "assignee_id": None,
        "label_ids": [],
        "nfc_tag_id": None,
        "task_due": "2026-07-29",
        "schedule_start_date": None,
        "schedule_anchor_date": "2026-07-29",
        "schedule_type": "fixed",
        "schedule_unit": "weekly",
        "schedule_interval": 1,
        "schedule_weekdays": [2],
        "schedule_day": 29,
        "schedule_month": 7,
    }


def test_schedule_update_discards_inactive_values():
    async def run():
        store = _store(_weekly_task())
        updated = await store.async_update_task(
            "task",
            {
                "schedule_type": "fixed",
                "schedule_unit": "monthly",
                "schedule_interval": 1,
                "schedule_weekdays": [2],
                "schedule_day": 15,
                "schedule_month": 7,
            },
            date(2026, 7, 24),
        )

        assert updated["schedule_weekdays"] == []
        assert updated["schedule_day"] == 15
        assert updated["schedule_month"] is None

    asyncio.run(run())


def test_partial_schedule_update_merges_before_normalizing():
    async def run():
        task = _weekly_task()
        task["schedule_day"] = 29
        task["schedule_month"] = 7
        store = _store(task)

        updated = await store.async_update_task(
            "task", {"schedule_interval": 2}, date(2026, 7, 24)
        )

        assert updated["schedule_unit"] == "weekly"
        assert updated["schedule_weekdays"] == [2]
        assert updated["schedule_day"] is None
        assert updated["schedule_month"] is None

    asyncio.run(run())


def test_task_icon_is_updated_without_affecting_schedule():
    async def run():
        store = _store(_weekly_task())
        updated = await store.async_update_task(
            "task", {"task_icon": "mdi:washing-machine"}, date(2026, 7, 24)
        )

        assert updated["task_icon"] == "mdi:washing-machine"
        assert updated["task_due"] == "2026-07-29"

    asyncio.run(run())


def test_notification_settings_are_normalized_without_affecting_schedule():
    async def run():
        store = _store(_weekly_task())
        updated = await store.async_update_task(
            "task",
            {
                "notification_target": {
                    "device_id": ["phone", "phone", "tablet"]
                },
                "notification_persistent": True,
                "notification_critical": True,
                "notification_route": " /lovelace/maintenance ",
            },
            date(2026, 7, 24),
        )

        assert updated["notification_target"] == {
            "device_id": ["phone", "tablet"]
        }
        assert updated["notification_persistent"] is True
        assert updated["notification_critical"] is True
        assert updated["notification_route"] == "/lovelace/maintenance"
        assert updated["task_due"] == "2026-07-29"

    asyncio.run(run())


def test_task_notification_route_rejects_absolute_urls():
    async def run():
        store = _store(_weekly_task())

        try:
            await store.async_update_task(
                "task",
                {"notification_route": "https://example.com"},
                date(2026, 7, 24),
            )
        except ValueError as err:
            assert str(err) == "invalid_notification_route"
        else:
            raise AssertionError("absolute notification URL was accepted")

    asyncio.run(run())


def test_empty_task_notification_route_is_stored_as_none():
    async def run():
        store = _store(_weekly_task())

        updated = await store.async_update_task(
            "task", {"notification_route": ""}, date(2026, 7, 24)
        )

        assert updated["notification_route"] is None

    asyncio.run(run())
