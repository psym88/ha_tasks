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
        "tasks": [store._aggregate_from_fields(task, [], [])]
    }
    return store


def test_completion_notes_are_trimmed_and_optional():
    async def run():
        store = _store({
            "task_id": "task-1",
            "task_name": "Task",
            "task_due": "2026-07-21T10:15:00+00:00",
            "schedule_type": "sliding",
            "schedule_unit": "daily",
            "schedule_interval": 1,
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
            "task_id": "task-1",
            "task_name": "Task",
            "task_due": "2026-07-21T10:15:00+00:00",
            "schedule_type": "sliding",
            "schedule_unit": "monthly",
            "schedule_interval": 1,
        })

        completed = await store.async_complete_task(
            "task-1", "2026-07-25T10:15:00+00:00", "user-1", "Marco"
        )

        assert completed["task_due"] == "2026-08-25T10:15:00+00:00"
        assert "task_due_before" not in store.history("task-1")[0]
        assert "task_due_after" not in store.history("task-1")[0]
        assert store._repository.data["tasks"][0]["due"] == "2026-08-25T10:15:00+00:00"

    asyncio.run(run())


def test_completing_calendar_task_early_keeps_upcoming_task_due():
    async def run():
        store = _store({
            "task_id": "task-1",
            "task_name": "Task",
            "task_due": "2026-07-22T10:15:00+00:00",
            "schedule_type": "fixed",
            "schedule_unit": "weekly",
            "schedule_interval": 1,
            "schedule_weekdays": [2],
        })

        completed = await store.async_complete_task(
            "task-1", "2026-07-20T10:15:00+00:00", "user-1", "Marco"
        )

        assert completed["task_due"] == "2026-07-22T10:15:00+00:00"

    asyncio.run(run())


def _history_store(schedule_type="sliding"):
    task = {
        "task_id": "task-1",
        "task_name": "Task",
        "task_due": "2026-07-21T10:15:00+00:00",
        "schedule_type": schedule_type,
        "schedule_unit": "daily",
        "schedule_interval": 1,
    }
    return _store(task)


def test_deleting_completions_only_removes_audit_records():
    async def run():
        store = _history_store()
        await store.async_complete_task("task-1", "2026-07-21T10:15:00+00:00", "user-1", "Marco")
        await store.async_complete_task("task-1", "2026-07-22T10:15:00+00:00", "user-1", "Marco")
        oldest, newest = sorted(
            store._data["tasks"][0]["completions"],
            key=lambda entry: entry["completed_at"],
        )

        task = await store.async_delete_history("task-1", oldest["id"])
        assert task["task_due"] == "2026-07-23T10:15:00+00:00"
        assert [
            entry["history_entry_id"] for entry in store.history("task-1")
        ] == [newest["id"]]

        task = await store.async_delete_history("task-1", newest["id"])
        assert task["task_due"] == "2026-07-23T10:15:00+00:00"
        assert store.history("task-1") == []

    asyncio.run(run())


def test_deleting_legacy_completion_context_keeps_current_due():
    async def run():
        store = _history_store("fixed")
        store._data["tasks"][0]["completions"] = [
            {
                "id": "legacy",
                "completed_at": "2026-07-20T10:15:00+00:00",
                "extra": {
                    "task_due_before": "2026-07-21T10:15:00+00:00",
                    "task_due_after": "2026-07-22T10:15:00+00:00",
                },
            }
        ]

        task = await store.async_delete_history("task-1", "legacy")
        assert task["task_due"] == "2026-07-21T10:15:00+00:00"
        assert store.history("task-1") == []

    asyncio.run(run())


def test_store_calculates_initial_due_and_preserves_it_for_metadata_updates():
    async def run():
        store = TasksStore.__new__(TasksStore)
        store._lock = asyncio.Lock()
        store._repository = MemoryRepository()
        store._data = {"tasks": []}
        task = await store.async_add_task(
            {
                "task_name": "Bins",
                "task_description": None,
                "assignee_id": None,
                "schedule_type": "fixed",
                "schedule_unit": "weekly",
                "schedule_interval": 2,
                "schedule_weekdays": [3],
                "schedule_day": None,
                "schedule_month": None,
            },
            date(2026, 7, 21),
        )
        assert task["task_due"] == "2026-07-23T10:15:00+00:00"

        updated = await store.async_update_task(
            task["task_id"], {"task_name": "Recycling bins"}, date(2026, 7, 28)
        )
        assert updated["task_due"] == "2026-07-23T10:15:00+00:00"

        replanned = await store.async_update_task(
            task["task_id"], {"schedule_weekdays": [4]}, date(2026, 7, 28)
        )
        assert replanned["task_due"] == "2026-07-31T10:15:00+00:00"

    asyncio.run(run())
