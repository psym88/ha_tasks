"""Tests for task persistence normalization."""

import asyncio
from datetime import datetime, timezone

import pytest

from custom_components.tasks.task_store import TasksStore


def date(year, month, day):
    return datetime(year, month, day, 10, 15, tzinfo=timezone.utc)


def _store(task):
    store = TasksStore.__new__(TasksStore)
    store._lock = asyncio.Lock()
    store._data = {
        "tasks": [task]
    }

    async def commit(data):
        store._data = data

    store._commit = commit
    return store


async def _save_new(store, payload, now):
    return (
        await store.async_save_task(None, payload, [], [], [], now)
    )["task"]


def _weekly_task():
    return {
        "id": "task",
        "name": "Task",
        "icon": None,
        "description": None,
        "active": True,
        "assignee_id": None,
        "label_ids": [],
        "nfc_tag_id": None,
        "due": "2026-07-29T10:15:00+00:00",
        "schedule": {
            "type": "fixed",
            "unit": "weekly",
            "interval": 1,
            "weekdays": [2],
        },
        "notification": {
            "device_ids": [],
            "persistent": False,
            "critical": False,
            "route": None,
        },
        "completions": [],
        "attachments": [],
    }


def test_failed_save_keeps_current_snapshot():
    class FailingRepository:
        async def async_save(self, data):
            raise RuntimeError("save failed")

    async def run():
        store = _store(_weekly_task())
        store._repository = FailingRepository()
        del store._commit
        before = store._data

        with pytest.raises(RuntimeError, match="save failed"):
            await store.async_update_task("task", {"name": "Changed"})

        assert store._data is before
        assert store.tasks[0]["name"] == "Task"

    asyncio.run(run())


def test_new_sliding_task_starts_due_after_its_first_interval():
    async def run():
        store = _store(_weekly_task())
        store._data["tasks"] = []
        created = await _save_new(
            store,
            {
                "name": "Replace filter",
                "schedule": {
                    "type": "sliding",
                    "unit": "weekly",
                    "interval": 2,
                },
            },
            date(2026, 7, 25),
        )

        assert created["due"] == "2026-08-08T10:15:00+00:00"
        assert created["active"] is True

    asyncio.run(run())


def test_active_state_does_not_change_the_stored_due():
    async def run():
        store = _store(_weekly_task())
        due = store.tasks[0]["due"]

        inactive = await store.async_update_task("task", {"active": False})
        assert inactive["active"] is False
        assert inactive["due"] == due
        assert not store.is_due(inactive, date(2026, 7, 30))

        active = await store.async_update_task("task", {"active": True})
        assert active["active"] is True
        assert active["due"] == due
        assert store.is_due(active, date(2026, 7, 30))

    asyncio.run(run())


def test_schedule_update_discards_inactive_values():
    async def run():
        store = _store(_weekly_task())
        updated = await store.async_update_task(
            "task",
            {
                "schedule": {
                    "type": "fixed",
                    "unit": "monthly",
                    "interval": 1,
                    "day": 15,
                },
            },
            date(2026, 7, 24),
        )

        assert updated["schedule"] == {
            "type": "fixed",
            "unit": "monthly",
            "interval": 1,
            "day": 15,
        }

    asyncio.run(run())


def test_fixed_schedule_time_is_stored_and_recalculates_due():
    async def run():
        store = _store(_weekly_task())

        updated = await store.async_update_task(
            "task",
            {
                "schedule": {
                    **_weekly_task()["schedule"],
                    "time": "08:30",
                }
            },
            date(2026, 7, 24),
        )

        assert updated["schedule"]["time"] == "08:30"
        assert updated["due"] == "2026-07-29T08:30:00+00:00"

    asyncio.run(run())


def test_sliding_schedule_discards_fixed_time():
    async def run():
        task = _weekly_task()
        task["schedule"]["time"] = "08:30"
        store = _store(task)

        updated = await store.async_update_task(
            "task",
            {
                "schedule": {
                    "type": "sliding",
                    "unit": "weekly",
                    "interval": 1,
                },
            },
            date(2026, 7, 24),
        )

        assert "time" not in updated["schedule"]

    asyncio.run(run())


def test_schedule_update_replaces_the_complete_variant():
    async def run():
        task = _weekly_task()
        store = _store(task)

        updated = await store.async_update_task(
            "task",
            {
                "schedule": {
                    "type": "fixed",
                    "unit": "weekly",
                    "interval": 2,
                    "weekdays": [2],
                }
            },
            date(2026, 7, 24),
        )

        assert updated["schedule"] == {
            "type": "fixed",
            "unit": "weekly",
            "interval": 2,
            "weekdays": [2],
        }

    asyncio.run(run())


def test_task_icon_is_updated_without_affecting_schedule():
    async def run():
        store = _store(_weekly_task())
        updated = await store.async_update_task(
            "task", {"icon": "mdi:washing-machine"}, date(2026, 7, 24)
        )

        assert updated["icon"] == "mdi:washing-machine"
        assert updated["due"] == "2026-07-29T10:15:00+00:00"

    asyncio.run(run())


def test_notification_settings_are_normalized_without_affecting_schedule():
    async def run():
        store = _store(_weekly_task())
        updated = await store.async_update_task(
            "task",
            {
                "notification": {
                    "device_ids": ["phone", "phone", "tablet"],
                    "persistent": True,
                    "critical": True,
                    "route": " /lovelace/maintenance ",
                },
            },
            date(2026, 7, 24),
        )

        assert updated["notification"] == {
            "device_ids": ["phone", "tablet"],
            "persistent": True,
            "critical": True,
            "route": "/lovelace/maintenance",
        }
        assert updated["due"] == "2026-07-29T10:15:00+00:00"

    asyncio.run(run())


def test_task_notification_route_rejects_absolute_urls():
    async def run():
        store = _store(_weekly_task())

        try:
            await store.async_update_task(
                "task",
                {
                    "notification": {
                        **_weekly_task()["notification"],
                        "route": "https://example.com",
                    }
                },
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
            "task",
            {
                "notification": {
                    **_weekly_task()["notification"],
                    "route": "",
                }
            },
            date(2026, 7, 24),
        )

        assert updated["notification"]["route"] is None

    asyncio.run(run())


def test_sensor_task_waits_without_due_and_discards_recurrence_fields():
    async def run():
        store = _store(_weekly_task())
        store._data["tasks"] = []

        created = await _save_new(
            store,
            {
                "name": "Check heat pump",
                "schedule": {
                    "type": "sensor",
                    "entity_id": "binary_sensor.heat_pump_problem",
                },
            },
            date(2026, 7, 25),
        )

        assert created["due"] is None
        assert created["schedule"] == {
            "type": "sensor",
            "entity_id": "binary_sensor.heat_pump_problem",
        }

    asyncio.run(run())


@pytest.mark.parametrize(
    ("payload", "error"),
    (
        (
            {
                "name": "Incomplete recurrence",
                "schedule": {"type": "sliding", "interval": 1},
            },
            "invalid_frequency",
        ),
        (
            {
                "name": "Invalid problem sensor",
                "schedule": {
                    "type": "sensor",
                    "entity_id": "sensor.temperature",
                },
            },
            "problem_sensor_required",
        ),
    ),
)
def test_store_rejects_incomplete_trigger_configurations(payload, error):
    async def run():
        store = _store(_weekly_task())
        store._data["tasks"] = []

        with pytest.raises(ValueError, match=error):
            await _save_new(store, payload, date(2026, 7, 25))

    asyncio.run(run())


def test_problem_trigger_sets_due_once_until_task_is_completed():
    async def run():
        task = {
            **_weekly_task(),
            "name": "Check heat pump",
            "schedule": {
                "type": "sensor",
                "entity_id": "binary_sensor.heat_pump_problem",
            },
            "due": None,
        }
        store = _store(task)

        triggered = await store.async_trigger_problem_task(
            "task", "2026-07-25T10:00:00+00:00"
        )
        duplicate = await store.async_trigger_problem_task(
            "task", "2026-07-25T10:01:00+00:00"
        )

        assert triggered["due"] == "2026-07-25T10:00:00+00:00"
        assert duplicate is None

        completed = await store.async_complete_task(
            "task", "2026-07-25T10:15:00+00:00", "user-1", "Marco"
        )
        assert completed["due"] is None

        retriggered = await store.async_trigger_problem_task(
            "task", "2026-07-26T08:00:00+00:00"
        )
        assert retriggered["due"] == "2026-07-26T08:00:00+00:00"

    asyncio.run(run())


def test_inactive_problem_task_does_not_trigger():
    async def run():
        task = {
            **_weekly_task(),
            "name": "Check heat pump",
            "active": False,
            "schedule": {
                "type": "sensor",
                "entity_id": "binary_sensor.heat_pump_problem",
            },
            "due": None,
        }
        store = _store(task)

        assert await store.async_trigger_problem_task(
            "task", "2026-07-25T10:00:00+00:00"
        ) is None
        assert task["due"] is None

    asyncio.run(run())


def test_bulk_mutations_persist_one_snapshot():
    async def run():
        first = _weekly_task()
        second = {**_weekly_task(), "id": "task-2", "name": "Second"}
        store = _store(first)
        store._data["tasks"].append(
            second
        )
        commits = []

        async def commit(data):
            commits.append(data)
            store._data = data

        store._commit = commit
        results = await store.async_bulk_mutate(
            [
                {
                    "action": "update",
                    "id": "task",
                    "changes": {"assignee_id": "alex"},
                },
                {
                    "action": "complete",
                    "id": "task-2",
                    "notes": "Done together",
                },
            ],
            "user-1",
            "Alex",
            date(2026, 7, 30),
        )

        assert len(commits) == 1
        assert results[0]["task"]["assignee_id"] == "alex"
        assert results[1]["task"]["due"] == (
            "2026-08-05T10:15:00+00:00"
        )
        assert store.history("task-2")[0]["notes"] == "Done together"

    asyncio.run(run())


def test_failed_bulk_mutation_keeps_the_entire_previous_snapshot():
    async def run():
        store = _store(_weekly_task())
        before = store._data
        commits = []

        async def commit(data):
            commits.append(data)
            store._data = data

        store._commit = commit
        with pytest.raises(ValueError, match="unknown_task"):
            await store.async_bulk_mutate(
                [
                    {
                        "action": "update",
                        "id": "task",
                        "changes": {"name": "Should roll back"},
                    },
                    {
                        "action": "delete",
                        "id": "missing",
                    },
                ],
                None,
                "system",
                date(2026, 7, 30),
            )

        assert commits == []
        assert store._data is before
        assert store.tasks[0]["name"] == "Task"

    asyncio.run(run())


def test_bulk_delete_removes_attachment_files_after_commit():
    async def run():
        store = _store(_weekly_task())
        store._data["tasks"][0]["attachments"] = [
            {"id": "file-1"}
        ]
        calls = []

        async def commit(data):
            calls.append("commit")
            store._data = data

        class Repository:
            async def async_delete_attachment(self, attachment_id):
                calls.append(f"delete:{attachment_id}")

        store._commit = commit
        store._repository = Repository()
        await store.async_bulk_mutate(
            [{"action": "delete", "id": "task"}],
            None,
            "system",
            date(2026, 7, 30),
        )

        assert calls == ["commit", "delete:file-1"]
        assert store.tasks == []
        assert store._data["tasks"] == []

    asyncio.run(run())


def test_failed_bulk_save_keeps_files_and_metadata():
    async def run():
        store = _store(_weekly_task())
        store._data["tasks"][0]["attachments"] = [
            {"id": "file-1"}
        ]
        before = store._data
        deleted = []

        async def commit(data):
            raise RuntimeError("save failed")

        class Repository:
            async def async_delete_attachment(self, attachment_id):
                deleted.append(attachment_id)

        store._commit = commit
        store._repository = Repository()
        with pytest.raises(RuntimeError, match="save failed"):
            await store.async_bulk_mutate(
                [{"action": "delete", "id": "task"}],
                None,
                "system",
                date(2026, 7, 30),
            )

        assert store._data is before
        assert store.tasks[0]["id"] == "task"
        assert deleted == []

    asyncio.run(run())


def test_editor_save_commits_task_files_and_history_once(tmp_path):
    class Repository:
        def __init__(self):
            self.saves = 0

        def file_path(self, file_id):
            return tmp_path / file_id

        async def async_write_attachment_files(self, files):
            paths = []
            for file_id, content in files.items():
                path = self.file_path(file_id)
                path.write_bytes(content)
                paths.append(path)
            return paths

        async def async_remove_attachment_files(self, files):
            for path in files:
                path.unlink(missing_ok=True)

        async def async_save(self, data):
            self.saves += 1

    async def run():
        store = _store(_weekly_task())
        repository = Repository()
        store._repository = repository
        del store._commit
        old_file = tmp_path / "old-file"
        old_file.write_bytes(b"old")
        store._data["tasks"][0]["attachments"] = [
            {"id": "old-file"}
        ]
        store._data["tasks"][0]["completions"] = [
            {"id": "old-history"}
        ]

        result = await store.async_save_task(
            "task",
            {"name": "Updated"},
            [("manual.pdf", "application/pdf", b"new")],
            ["old-file"],
            ["old-history"],
            date(2026, 7, 30),
        )

        assert repository.saves == 1
        assert result["task"]["name"] == "Updated"
        assert not old_file.exists()
        assert store.history("task") == []
        [attachment] = result["task"]["attachments"]
        assert repository.file_path(attachment["id"]).read_bytes() == b"new"
        assert [
            item["id"]
            for item in store._data["tasks"][0]["attachments"]
        ] == [attachment["id"]]

    asyncio.run(run())


def test_failed_editor_save_rolls_back_snapshot_and_new_files(tmp_path):
    class Repository:
        def file_path(self, file_id):
            return tmp_path / file_id

        async def async_write_attachment_files(self, files):
            paths = []
            for file_id, content in files.items():
                path = self.file_path(file_id)
                path.write_bytes(content)
                paths.append(path)
            return paths

        async def async_remove_attachment_files(self, files):
            for path in files:
                path.unlink(missing_ok=True)

        async def async_save(self, data):
            raise RuntimeError("save failed")

    async def run():
        store = _store(_weekly_task())
        repository = Repository()
        store._repository = repository
        del store._commit
        before = store._data

        with pytest.raises(RuntimeError, match="save failed"):
            await store.async_save_task(
                "task",
                {"name": "Not saved"},
                [("manual.pdf", "application/pdf", b"new")],
                [],
                [],
                date(2026, 7, 30),
            )

        assert store._data is before
        assert store.tasks[0]["name"] == "Task"
        assert list(tmp_path.iterdir()) == []

    asyncio.run(run())
