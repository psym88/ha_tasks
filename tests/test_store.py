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
    store._data = {"tasks": [task], "history": {}, "attachments": []}

    async def commit(data):
        store._data = data

    store._commit = commit
    return store


def _weekly_task():
    return {
        "task_id": "task",
        "task_name": "Task",
        "task_description": None,
        "assignee_id": None,
        "label_ids": [],
        "nfc_tag_id": None,
        "task_due": "2026-07-29T10:15:00+00:00",
        "schedule_type": "fixed",
        "schedule_unit": "weekly",
        "schedule_interval": 1,
        "schedule_weekdays": [2],
        "schedule_day": 29,
        "schedule_month": 7,
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
            await store.async_update_task("task", {"task_name": "Changed"})

        assert store._data is before
        assert store.tasks[0]["task_name"] == "Task"

    asyncio.run(run())


def test_new_sliding_task_starts_due_after_its_first_interval():
    async def run():
        store = _store(_weekly_task())
        store._data["tasks"] = []
        created = await store.async_add_task(
            {
                "task_name": "Replace filter",
                "schedule_type": "sliding",
                "schedule_unit": "weekly",
                "schedule_interval": 2,
                "schedule_weekdays": [],
                "schedule_day": None,
                "schedule_month": None,
            },
            date(2026, 7, 25),
        )

        assert created["task_due"] == "2026-08-08T10:15:00+00:00"
        assert created["active"] is True

    asyncio.run(run())


def test_active_state_does_not_change_the_stored_due():
    async def run():
        store = _store(_weekly_task())
        due = store.tasks[0]["task_due"]

        inactive = await store.async_update_task("task", {"active": False})
        assert inactive["active"] is False
        assert inactive["task_due"] == due
        assert not store.is_due(inactive, date(2026, 7, 30))

        active = await store.async_update_task("task", {"active": True})
        assert active["active"] is True
        assert active["task_due"] == due
        assert store.is_due(active, date(2026, 7, 30))

    asyncio.run(run())


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


def test_fixed_schedule_time_is_stored_and_recalculates_due():
    async def run():
        store = _store(_weekly_task())

        updated = await store.async_update_task(
            "task", {"schedule_time": "08:30"}, date(2026, 7, 24)
        )

        assert updated["schedule_time"] == "08:30"
        assert updated["task_due"] == "2026-07-29T08:30:00+00:00"

    asyncio.run(run())


def test_sliding_schedule_discards_fixed_time():
    async def run():
        task = _weekly_task()
        task["schedule_time"] = "08:30"
        store = _store(task)

        updated = await store.async_update_task(
            "task",
            {
                "schedule_type": "sliding",
                "schedule_unit": "weekly",
                "schedule_interval": 1,
                "schedule_time": None,
            },
            date(2026, 7, 24),
        )

        assert updated["schedule_time"] is None

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
        assert updated["task_due"] == "2026-07-29T10:15:00+00:00"

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
        assert updated["task_due"] == "2026-07-29T10:15:00+00:00"

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


def test_sensor_task_waits_without_due_and_discards_recurrence_fields():
    async def run():
        store = _store(_weekly_task())
        store._data["tasks"] = []

        created = await store.async_add_task(
            {
                "task_name": "Check heat pump",
                "schedule_type": "sensor",
                "problem_sensor": "binary_sensor.heat_pump_problem",
            },
            date(2026, 7, 25),
        )

        assert created["task_due"] is None
        assert created["problem_sensor"] == "binary_sensor.heat_pump_problem"
        assert created["schedule_unit"] is None
        assert created["schedule_interval"] is None

    asyncio.run(run())


@pytest.mark.parametrize(
    ("payload", "error"),
    (
        (
            {
                "task_name": "Incomplete recurrence",
                "schedule_type": "sliding",
                "schedule_interval": 1,
            },
            "invalid_frequency",
        ),
        (
            {
                "task_name": "Invalid problem sensor",
                "schedule_type": "sensor",
                "problem_sensor": "sensor.temperature",
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
            await store.async_add_task(payload, date(2026, 7, 25))

    asyncio.run(run())


def test_problem_trigger_sets_due_once_until_task_is_completed():
    async def run():
        task = {
            "task_id": "task",
            "task_name": "Check heat pump",
            "schedule_type": "sensor",
            "problem_sensor": "binary_sensor.heat_pump_problem",
            "task_due": None,
        }
        store = _store(task)

        triggered = await store.async_trigger_problem_task(
            "task", "2026-07-25T10:00:00+00:00"
        )
        duplicate = await store.async_trigger_problem_task(
            "task", "2026-07-25T10:01:00+00:00"
        )

        assert triggered["task_due"] == "2026-07-25T10:00:00+00:00"
        assert duplicate is None

        completed = await store.async_complete_task(
            "task", "2026-07-25T10:15:00+00:00", "user-1", "Marco"
        )
        assert completed["task_due"] is None
        assert "task_due_after" not in store.history("task")[0]

        retriggered = await store.async_trigger_problem_task(
            "task", "2026-07-26T08:00:00+00:00"
        )
        assert retriggered["task_due"] == "2026-07-26T08:00:00+00:00"

    asyncio.run(run())


def test_inactive_problem_task_does_not_trigger():
    async def run():
        task = {
            "task_id": "task",
            "task_name": "Check heat pump",
            "active": False,
            "schedule_type": "sensor",
            "problem_sensor": "binary_sensor.heat_pump_problem",
            "task_due": None,
        }
        store = _store(task)

        assert await store.async_trigger_problem_task(
            "task", "2026-07-25T10:00:00+00:00"
        ) is None
        assert task["task_due"] is None

    asyncio.run(run())


def test_bulk_mutations_persist_one_snapshot():
    async def run():
        first = _weekly_task()
        second = {**_weekly_task(), "task_id": "task-2", "task_name": "Second"}
        store = _store(first)
        store._data["tasks"].append(second)
        commits = []

        async def commit(data):
            commits.append(data)
            store._data = data

        store._commit = commit
        results = await store.async_bulk_mutate(
            [
                {
                    "action": "update",
                    "task_id": "task",
                    "changes": {"assignee_id": "alex"},
                },
                {
                    "action": "complete",
                    "task_id": "task-2",
                    "notes": "Done together",
                },
            ],
            "user-1",
            "Alex",
            date(2026, 7, 30),
        )

        assert len(commits) == 1
        assert results[0]["task"]["assignee_id"] == "alex"
        assert results[1]["task"]["task_due"] == (
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
                        "task_id": "task",
                        "changes": {"task_name": "Should roll back"},
                    },
                    {
                        "action": "delete",
                        "task_id": "missing",
                    },
                ],
                None,
                "system",
                date(2026, 7, 30),
            )

        assert commits == []
        assert store._data is before
        assert store.tasks[0]["task_name"] == "Task"

    asyncio.run(run())


def test_bulk_delete_removes_attachment_files_after_commit():
    async def run():
        store = _store(_weekly_task())
        store._data["attachments"] = [
            {"attachment_id": "file-1", "task_id": "task"}
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
            [{"action": "delete", "task_id": "task"}],
            None,
            "system",
            date(2026, 7, 30),
        )

        assert calls == ["commit", "delete:file-1"]
        assert store.tasks == []
        assert store._data["attachments"] == []

    asyncio.run(run())


def test_failed_bulk_save_keeps_files_and_metadata():
    async def run():
        store = _store(_weekly_task())
        store._data["attachments"] = [
            {"attachment_id": "file-1", "task_id": "task"}
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
                [{"action": "delete", "task_id": "task"}],
                None,
                "system",
                date(2026, 7, 30),
            )

        assert store._data is before
        assert store.tasks[0]["task_id"] == "task"
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
        store._data["attachments"] = [
            {"attachment_id": "old-file", "task_id": "task"}
        ]
        store._data["history"]["task"] = [
            {"history_entry_id": "old-history"}
        ]

        result = await store.async_save_task(
            "task",
            {"task_name": "Updated"},
            [("manual.pdf", "application/pdf", b"new")],
            ["old-file"],
            ["old-history"],
            date(2026, 7, 30),
        )

        assert repository.saves == 1
        assert result["task"]["task_name"] == "Updated"
        assert not old_file.exists()
        assert store.history("task") == []
        [attachment] = result["attachments"]
        assert repository.file_path(attachment["attachment_id"]).read_bytes() == b"new"
        assert store._data["attachments"] == [attachment]

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
                {"task_name": "Not saved"},
                [("manual.pdf", "application/pdf", b"new")],
                [],
                [],
                date(2026, 7, 30),
            )

        assert store._data is before
        assert store.tasks[0]["task_name"] == "Task"
        assert list(tmp_path.iterdir()) == []

    asyncio.run(run())
