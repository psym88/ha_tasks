"""NFC tag assignment and completion tests."""

import asyncio
from datetime import datetime, timezone
from types import SimpleNamespace

import pytest

from custom_components.tasks import nfc_completion as nfc
from custom_components.tasks.const import EVENT_TASKS
from custom_components.tasks.manager import TaskManager
from custom_components.tasks.task_store import TasksStore


class MemoryRepository:
    async def async_save(self, data):
        self.data = data


def _store(tasks):
    store = TasksStore.__new__(TasksStore)
    store._lock = asyncio.Lock()
    store._repository = MemoryRepository()
    store._data = {
        "tasks": tasks,
    }
    return store


async def _save_new(store, payload, now):
    return (
        await store.async_save_task(None, payload, [], [], [], now)
    )["task"]


def _task(task_id="task-1", tag_id=None):
    return {
        "id": task_id,
        "name": task_id,
        "nfc_tag_id": tag_id,
        "due": "2026-07-22T10:15:00+00:00",
        "schedule": {"type": "sliding", "unit": "daily", "interval": 1},
        "notification": {
            "device_ids": [],
            "persistent": False,
            "critical": False,
            "route": None,
        },
        "completions": [],
        "attachments": [],
    }


def test_tag_id_is_trimmed_and_unique():
    async def run():
        store = _store([_task(tag_id="existing")])
        payload = {
            **_task("new", "  tag-2  "),
        }
        created = await _save_new(
            store,
            payload, datetime(2026, 7, 22, 10, 15, tzinfo=timezone.utc)
        )
        assert created["nfc_tag_id"] == "tag-2"
        with pytest.raises(ValueError, match="nfc_tag_already_assigned"):
            await store.async_update_task(created["id"], {"nfc_tag_id": "existing"})

    asyncio.run(run())


def test_task_labels_are_stored_and_updated_without_duplicates():
    async def run():
        store = _store([])
        created = await _save_new(
            store,
            {**_task("new"), "label_ids": ["chores", "upstairs", "chores"]},
            datetime(2026, 7, 22, 10, 15, tzinfo=timezone.utc),
        )
        assert created["label_ids"] == ["chores", "upstairs"]
        updated = await store.async_update_task(
            created["id"], {"label_ids": ["garden", "garden"]}
        )
        assert updated["label_ids"] == ["garden"]

    asyncio.run(run())


def test_matching_scan_completes_task_with_event_user(monkeypatch):
    async def run():
        monkeypatch.setattr(
            "custom_components.tasks.manager.dismiss_task_notification",
            lambda hass, task_id: None,
        )
        store = _store([_task(tag_id="tag-1")])
        user = SimpleNamespace(id="user-1", name="Alex")
        updates = []
        hass = SimpleNamespace(
            auth=SimpleNamespace(
                async_get_user=lambda user_id: _async_value(user)
            ),
            bus=SimpleNamespace(
                async_fire=lambda event_type, data, context=None: updates.append(
                    (event_type, data, context)
                )
            ),
        )
        manager = TaskManager(hass, store)
        event = SimpleNamespace(
            data={"tag_id": "tag-1", "device_id": "reader-1"},
            context=SimpleNamespace(user_id="user-1"),
        )
        await nfc.async_handle_tag_scanned(hass, manager, event)
        history = store.history("task-1")
        assert len(history) == 1
        assert history[0]["user_id"] == "user-1"
        assert history[0]["user_name"] == "Alex"
        assert history[0]["notes"] == nfc.NFC_COMPLETION_NOTE
        assert updates == [
            (
                EVENT_TASKS,
                {
                    "action": "completed",
                    "resource_type": "task",
                    "resource_id": "task-1",
                    "resource_name": "task-1",
                    "source": "nfc",
                },
                event.context,
            )
        ]

    asyncio.run(run())


def test_unknown_scan_is_ignored():
    async def run():
        store = _store([_task(tag_id="tag-1")])
        updates = []
        hass = SimpleNamespace(
            auth=None,
            bus=SimpleNamespace(
                async_fire=lambda *args, **kwargs: updates.append(
                    (args, kwargs)
                )
            ),
        )
        manager = TaskManager(hass, store)
        event = SimpleNamespace(
            data={"tag_id": "other"}, context=SimpleNamespace(user_id=None)
        )
        await nfc.async_handle_tag_scanned(hass, manager, event)
        assert store.history("task-1") == []
        assert updates == []

    asyncio.run(run())


async def _async_value(value):
    return value
