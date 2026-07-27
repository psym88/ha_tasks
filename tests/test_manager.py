"""Tests for the Tasks application service."""

import asyncio
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

        task = await manager.async_update_task(
            "task-1", {"active": True}, context=context
        )

        assert task["active"] is True
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
