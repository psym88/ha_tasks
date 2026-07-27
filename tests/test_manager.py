"""Tests for the Tasks application service."""

import asyncio
from datetime import datetime, timezone
from types import SimpleNamespace

import pytest

from custom_components.tasks.const import EVENT_TASKS
from custom_components.tasks.manager import TaskManager


def _hass():
    events = []
    hass = SimpleNamespace(
        bus=SimpleNamespace(
            async_fire=lambda event_type, data, context=None: events.append(
                (event_type, data, context)
            )
        )
    )
    return hass, events


def test_update_publishes_one_committed_domain_change():
    class Store:
        def task(self, task_id):
            return {
                "task_id": task_id,
                "task_name": "Pump",
                "active": False,
                "schedule_type": "sensor",
                "problem_sensor": "binary_sensor.pump",
            }

        async def async_update_task(self, task_id, payload, now):
            return {
                **self.task(task_id),
                **payload,
            }

    async def run():
        hass, events = _hass()
        context = object()
        manager = TaskManager(hass, Store())
        changes = []
        unsubscribe = manager.subscribe(changes.append)

        task = await manager.async_update_task(
            "task-1", {"active": True}, context=context
        )

        assert task["active"] is True
        assert changes[0].action == "updated"
        assert changes[0].resource_id == "task-1"
        assert changes[0].data["problem_trigger_changed"] is True
        assert changes[0].revision == 1
        assert manager.revision == 1
        assert events == [
            (
                EVENT_TASKS,
                {
                    "action": "updated",
                    "resource_type": "task",
                    "resource_id": "task-1",
                    "resource_name": "Pump",
                    "problem_trigger_changed": True,
                },
                context,
            )
        ]
        unsubscribe()
        await manager.async_update_task("task-1", {"active": True})
        assert len(changes) == 1
        assert manager.revision == 2

    asyncio.run(run())


def test_failed_mutation_does_not_publish_a_change():
    class Store:
        async def async_add_task(self, payload, now):
            raise RuntimeError("save failed")

    async def run():
        hass, events = _hass()
        manager = TaskManager(hass, Store())

        with pytest.raises(RuntimeError, match="save failed"):
            await manager.async_add_task({"task_name": "Pump"})

        assert events == []
        assert manager.revision == 0

    asyncio.run(run())


def test_attachment_delete_event_uses_pre_delete_task_id():
    class Store:
        def attachment(self, attachment_id):
            return {
                "attachment_id": attachment_id,
                "task_id": "task-1",
            }

        async def async_delete_attachment(self, attachment_id):
            return None

    async def run():
        hass, events = _hass()
        manager = TaskManager(hass, Store())

        await manager.async_delete_attachment("file-1")

        assert events[0][1] == {
            "action": "deleted",
            "resource_type": "attachment",
            "resource_id": "file-1",
            "task_id": "task-1",
        }

    asyncio.run(run())


def test_problem_trigger_notifies_internal_and_public_consumers():
    class Store:
        async def async_trigger_problem_task(self, task_id, triggered_at):
            return {
                "task_id": task_id,
                "task_name": "Pump",
                "task_due": triggered_at,
                "schedule_type": "sensor",
            }

    async def run():
        hass, events = _hass()
        manager = TaskManager(hass, Store())
        changes = []
        manager.subscribe(changes.append)

        await manager.async_trigger_problem_task(
            "task-1", "2026-07-27T10:00:00+00:00"
        )

        assert [change.action for change in changes] == ["task_due"]
        assert events[0][1]["action"] == "task_due"
        assert events[0][1]["task_due"] == "2026-07-27T10:00:00+00:00"

    asyncio.run(run())


def test_bulk_mutation_publishes_one_revision(monkeypatch):
    class Store:
        def task(self, task_id):
            return {
                "task_id": task_id,
                "task_name": "Pump",
                "active": True,
                "schedule_type": "sensor",
                "problem_sensor": "binary_sensor.old",
            }

        async def async_bulk_mutate(
            self, operations, user_id, user_name, now
        ):
            return [
                {
                    "action": "update",
                    "task_id": "task-1",
                    "task": {
                        **self.task("task-1"),
                        "problem_sensor": "binary_sensor.new",
                    },
                },
                {
                    "action": "complete",
                    "task_id": "task-2",
                    "task": {"task_id": "task-2", "task_name": "Filter"},
                },
            ]

    async def run():
        dismissed = []
        monkeypatch.setattr(
            "custom_components.tasks.manager.dismiss_task_notification",
            lambda hass, task_id: dismissed.append(task_id),
        )
        hass, events = _hass()
        manager = TaskManager(hass, Store())
        changes = []
        manager.subscribe(changes.append)

        results = await manager.async_bulk_mutate(
            [
                {
                    "action": "update",
                    "task_id": "task-1",
                    "changes": {
                        "problem_sensor": "binary_sensor.new",
                    },
                },
                {"action": "complete", "task_id": "task-2"},
            ],
            "user-1",
            "Alex",
            datetime(2026, 7, 27, 10, tzinfo=timezone.utc),
        )

        assert len(results) == 2
        assert manager.revision == 1
        assert [change.action for change in changes] == ["bulk_mutated"]
        assert changes[0].data["problem_task_ids"] == ["task-1"]
        assert dismissed == ["task-2"]
        assert [event[1]["action"] for event in events] == ["bulk_mutated"]

    asyncio.run(run())


def test_editor_save_publishes_one_task_change():
    class Store:
        def task(self, task_id):
            return {
                "task_id": task_id,
                "task_name": "Pump",
                "schedule_type": "sensor",
                "problem_sensor": "binary_sensor.old",
                "active": True,
            }

        async def async_save_task(
            self,
            task_id,
            payload,
            uploads,
            deleted_attachment_ids,
            deleted_history_entry_ids,
            now,
        ):
            self.received = (
                task_id,
                payload,
                uploads,
                deleted_attachment_ids,
                deleted_history_entry_ids,
                now,
            )
            return {
                "task": {
                    **self.task(task_id),
                    **payload,
                },
                "attachments": [],
            }

    async def run():
        hass, events = _hass()
        store = Store()
        manager = TaskManager(hass, store)
        changes = []
        manager.subscribe(changes.append)
        now = datetime(2026, 7, 27, 10, tzinfo=timezone.utc)

        result = await manager.async_save_task(
            "task-1",
            {"problem_sensor": "binary_sensor.new"},
            [],
            ["file-1"],
            ["history-1"],
            now,
        )

        assert result["task"]["problem_sensor"] == "binary_sensor.new"
        assert manager.revision == 1
        assert changes[0].action == "saved"
        assert changes[0].resource_id == "task-1"
        assert changes[0].data["created"] is False
        assert changes[0].data["problem_trigger_changed"] is True
        assert events[0][1]["action"] == "saved"

    asyncio.run(run())
