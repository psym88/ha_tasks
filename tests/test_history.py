"""History persistence tests."""

import asyncio
from datetime import datetime, timezone

from custom_components.tasks.task_store import TasksStore


def date(year, month, day):
    return datetime(year, month, day, 10, 15, tzinfo=timezone.utc)


class MemoryRepository:
    """Minimal Tasks repository replacement."""

    async def async_save(self, data):
        self.data = data


def _store(task):
    store = TasksStore.__new__(TasksStore)
    store._lock = asyncio.Lock()
    store._repository = MemoryRepository()
    store._data = {
        "tasks": [task]
    }
    return store


async def _save_new(store, payload, now):
    return (
        await store.async_save_task(None, payload, [], [], [], now)
    )["task"]


def test_completion_notes_are_trimmed_and_optional():
    async def run():
        store = _store({
            **_task(),
        })

        await store.async_complete_task(
            "task-1", "2026-07-21T10:15:00+00:00", "user-1", "Marco", "  Filter replaced  "
        )
        await store.async_complete_task(
            "task-1", "2026-07-22T10:15:00+00:00", "user-1", "Marco", "   "
        )

        history = store.history("task-1")
        assert {entry["notes"] for entry in history} == {"Filter replaced", None}
        assert all(entry["completed_at"] for entry in history)
        assert all("recorded_at" not in entry for entry in history)

    asyncio.run(run())


def test_completing_task_sets_next_task_due_from_completion_datetime():
    async def run():
        store = _store({
            **_task(unit="monthly"),
        })

        completed = await store.async_complete_task(
            "task-1", "2026-07-25T10:15:00+00:00", "user-1", "Marco"
        )

        assert completed["due"] == "2026-08-25T10:15:00+00:00"
        assert store._repository.data["tasks"][0]["due"] == "2026-08-25T10:15:00+00:00"

    asyncio.run(run())


def test_completing_calendar_task_early_keeps_upcoming_task_due():
    async def run():
        store = _store({
            **_task(
                schedule_type="fixed",
                unit="weekly",
                due="2026-07-22T10:15:00+00:00",
                weekdays=[2],
            ),
        })

        completed = await store.async_complete_task(
            "task-1", "2026-07-20T10:15:00+00:00", "user-1", "Marco"
        )

        assert completed["due"] == "2026-07-22T10:15:00+00:00"

    asyncio.run(run())


def _task(
    schedule_type="sliding",
    unit="daily",
    due="2026-07-21T10:15:00+00:00",
    **schedule,
):
    schedule_record = (
        {
            "type": "sensor",
            "entity_id": schedule.get(
                "entity_id", "binary_sensor.problem"
            ),
        }
        if schedule_type == "sensor"
        else {
            "type": schedule_type,
            "unit": unit,
            "interval": schedule.pop("interval", 1),
            **schedule,
        }
    )
    return {
        "id": "task-1",
        "name": "Task",
        "icon": None,
        "description": None,
        "active": True,
        "assignee_id": None,
        "label_ids": [],
        "nfc_tag_id": None,
        "due": due,
        "schedule": schedule_record,
        "notification": {
            "device_ids": [],
            "persistent": False,
            "critical": False,
            "route": None,
        },
        "completions": [],
        "attachments": [],
    }


def _history_store(schedule_type="sliding"):
    return _store(_task(schedule_type))


def test_deleting_oldest_completion_replays_from_newest_remaining():
    async def run():
        store = _history_store()
        await store.async_complete_task("task-1", "2026-07-21T10:15:00+00:00", "user-1", "Marco")
        await store.async_complete_task("task-1", "2026-07-22T10:15:00+00:00", "user-1", "Marco")
        oldest, newest = sorted(
            store._data["tasks"][0]["completions"],
            key=lambda entry: entry["completed_at"],
        )

        result = await store.async_save_task(
            "task-1", {}, [], [], [oldest["id"]], date(2026, 7, 23)
        )
        task = result["task"]
        assert task["due"] == "2026-07-23T10:15:00+00:00"
        assert [
            entry["id"] for entry in store.history("task-1")
        ] == [newest["id"]]

        result = await store.async_save_task(
            "task-1", {}, [], [], [newest["id"]], date(2026, 7, 23)
        )
        task = result["task"]
        assert task["due"] == "2026-07-23T10:15:00+00:00"
        assert store.history("task-1") == []

    asyncio.run(run())


def test_deleting_newest_completion_replays_sliding_due():
    async def run():
        store = _history_store()
        await store.async_complete_task(
            "task-1",
            "2026-07-21T10:15:00+00:00",
            "user-1",
            "Marco",
        )
        await store.async_complete_task(
            "task-1",
            "2026-07-22T10:15:00+00:00",
            "user-1",
            "Marco",
        )
        oldest, newest = sorted(
            store._data["tasks"][0]["completions"],
            key=lambda entry: entry["completed_at"],
        )

        result = await store.async_save_task(
            "task-1", {}, [], [], [newest["id"]], date(2026, 7, 23)
        )
        task = result["task"]
        assert task["due"] == "2026-07-22T10:15:00+00:00"
        assert [
            entry["id"] for entry in store.history("task-1")
        ] == [oldest["id"]]

    asyncio.run(run())


def test_deleting_newest_completion_replays_fixed_due():
    async def run():
        store = _store(
            _task(
                schedule_type="fixed",
                unit="weekly",
                interval=2,
                due="2026-07-23T10:15:00+00:00",
                weekdays=[3],
            )
        )
        await store.async_complete_task(
            "task-1",
            "2026-07-23T10:15:00+00:00",
            "user-1",
            "Marco",
        )
        await store.async_complete_task(
            "task-1",
            "2026-08-06T10:15:00+00:00",
            "user-1",
            "Marco",
        )
        _, newest = sorted(
            store._data["tasks"][0]["completions"],
            key=lambda entry: entry["completed_at"],
        )

        result = await store.async_save_task(
            "task-1", {}, [], [], [newest["id"]], date(2026, 8, 7)
        )

        assert result["task"]["due"] == "2026-08-06T10:15:00+00:00"

    asyncio.run(run())


def test_deleting_completion_preserves_sensor_due():
    async def run():
        store = _history_store("sensor")
        await store.async_complete_task(
            "task-1",
            "2026-07-21T10:15:00+00:00",
            "user-1",
            "Marco",
        )
        await store.async_trigger_problem_task(
            "task-1", "2026-07-22T10:15:00+00:00"
        )
        await store.async_complete_task(
            "task-1",
            "2026-07-22T10:15:00+00:00",
            "user-1",
            "Marco",
        )
        await store.async_trigger_problem_task(
            "task-1", "2026-07-23T10:15:00+00:00"
        )
        _, newest = sorted(
            store._data["tasks"][0]["completions"],
            key=lambda entry: entry["completed_at"],
        )

        result = await store.async_save_task(
            "task-1", {}, [], [], [newest["id"]], date(2026, 7, 24)
        )

        assert result["task"]["due"] == "2026-07-23T10:15:00+00:00"

    asyncio.run(run())


def test_store_calculates_initial_due_and_preserves_it_for_metadata_updates():
    async def run():
        store = TasksStore.__new__(TasksStore)
        store._lock = asyncio.Lock()
        store._repository = MemoryRepository()
        store._data = {"tasks": []}
        task = await _save_new(
            store,
            {
                "name": "Bins",
                "description": None,
                "assignee_id": None,
                "schedule": {
                    "type": "fixed",
                    "unit": "weekly",
                    "interval": 2,
                    "weekdays": [3],
                },
            },
            date(2026, 7, 21),
        )
        assert task["due"] == "2026-07-23T10:15:00+00:00"

        updated = await store.async_update_task(
            task["id"], {"name": "Recycling bins"}, date(2026, 7, 28)
        )
        assert updated["due"] == "2026-07-23T10:15:00+00:00"

        replanned = await store.async_update_task(
            task["id"],
            {
                "schedule": {
                    "type": "fixed",
                    "unit": "weekly",
                    "interval": 2,
                    "weekdays": [4],
                }
            },
            date(2026, 7, 28),
        )
        assert replanned["due"] == "2026-07-31T10:15:00+00:00"

    asyncio.run(run())
