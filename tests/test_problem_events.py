"""Tests for binary-sensor task triggers."""

import asyncio
from datetime import datetime, timezone
from types import SimpleNamespace

from custom_components.tasks.manager import TaskChange, TaskManager
from custom_components.tasks.scheduling import ProblemSensorScheduler
from custom_components.tasks.task_store import TasksStore


class ProblemStore:
    def __init__(self, task):
        self.tasks = [task]
        self.triggered = []
        self.due = []
        self.listeners = []

    def subscribe(self, listener):
        self.listeners.append(listener)
        return lambda: self.listeners.remove(listener)

    def task(self, task_id):
        return next(task for task in self.tasks if task["task_id"] == task_id)

    async def async_trigger_problem_task(self, task_id, triggered_at):
        task = self.task(task_id)
        if task.get("task_due"):
            return None
        task["task_due"] = triggered_at
        self.triggered.append(task_id)
        result = dict(task)
        self.due.append(result)
        return result


def test_problem_sensor_triggers_only_when_state_becomes_on():
    async def run():
        pending = []
        task = {
            "task_id": "pump",
            "task_name": "Check pump",
            "schedule_type": "sensor",
            "problem_sensor": "binary_sensor.pump_problem",
            "task_due": None,
        }
        store = ProblemStore(task)
        hass = SimpleNamespace(
            async_create_task=lambda coroutine: pending.append(
                asyncio.create_task(coroutine)
            )
        )
        scheduler = ProblemSensorScheduler(hass, store)
        fired_at = datetime(2026, 7, 25, 10, tzinfo=timezone.utc)

        scheduler._handle_state_event(
            SimpleNamespace(
                data={
                    "entity_id": "binary_sensor.pump_problem",
                    "old_state": SimpleNamespace(state="off"),
                    "new_state": SimpleNamespace(state="on"),
                },
                time_fired=fired_at,
            )
        )
        await asyncio.gather(*pending)

        assert store.triggered == ["pump"]
        assert task["task_due"] == fired_at.isoformat()
        assert [item["task_id"] for item in store.due] == ["pump"]

        pending.clear()
        scheduler._handle_state_event(
            SimpleNamespace(
                data={
                    "entity_id": "binary_sensor.pump_problem",
                    "old_state": SimpleNamespace(state="on"),
                    "new_state": SimpleNamespace(state="on"),
                },
                time_fired=fired_at,
            )
        )
        assert pending == []

    asyncio.run(run())


def test_problem_sensor_catches_up_active_problem_on_start(monkeypatch):
    async def run():
        tracked = []
        task = {
            "task_id": "pump",
            "task_name": "Check pump",
            "schedule_type": "sensor",
            "problem_sensor": "binary_sensor.pump_problem",
            "task_due": None,
        }
        store = ProblemStore(task)
        hass = SimpleNamespace(
            states=SimpleNamespace(
                is_state=lambda entity_id, state: (
                    entity_id == "binary_sensor.pump_problem" and state == "on"
                )
            ),
        )
        monkeypatch.setattr(
            "custom_components.tasks.scheduling.async_track_state_change_event",
            lambda hass, entity_ids, action: (
                tracked.append(set(entity_ids)),
                lambda: None,
            )[1],
        )
        scheduler = ProblemSensorScheduler(hass, store)
        await scheduler.async_start()

        assert tracked == [{"binary_sensor.pump_problem"}]
        assert len(store.listeners) == 1
        assert store.triggered == ["pump"]
        assert [item["task_id"] for item in store.due] == ["pump"]

    asyncio.run(run())


def test_problem_sensor_ignores_inactive_task(monkeypatch):
    async def run():
        tracked = []
        task = {
            "task_id": "pump",
            "task_name": "Check pump",
            "active": False,
            "schedule_type": "sensor",
            "problem_sensor": "binary_sensor.pump_problem",
            "task_due": None,
        }
        store = ProblemStore(task)
        hass = SimpleNamespace(
            states=SimpleNamespace(is_state=lambda *_args: True)
        )
        monkeypatch.setattr(
            "custom_components.tasks.scheduling.async_track_state_change_event",
            lambda hass, entity_ids, action: (
                tracked.append(set(entity_ids)),
                lambda: None,
            )[1],
        )
        scheduler = ProblemSensorScheduler(hass, store)
        await scheduler.async_start()

        assert store.triggered == []
        assert tracked == [set()]

    asyncio.run(run())


def test_problem_sensor_subscription_updates_only_for_trigger_changes(
    monkeypatch,
):
    task = {
        "task_id": "pump",
        "task_name": "Check pump",
        "active": True,
        "schedule_type": "sensor",
        "problem_sensor": "binary_sensor.pump",
        "task_due": None,
    }
    manager = ProblemStore(task)
    tracked = []
    monkeypatch.setattr(
        "custom_components.tasks.scheduling.async_track_state_change_event",
        lambda hass, entity_ids, action: (
            tracked.append(set(entity_ids)),
            lambda: None,
        )[1],
    )
    scheduler = ProblemSensorScheduler(
        SimpleNamespace(async_create_task=lambda coroutine: coroutine.close()),
        manager,
    )

    scheduler._subscribe_sensors()
    scheduler._handle_task_change(
        TaskChange("updated", "task", "pump", {"problem_trigger_changed": False})
    )
    task["problem_sensor"] = "binary_sensor.replacement"
    scheduler._handle_task_change(
        TaskChange("updated", "task", "pump", {"problem_trigger_changed": True})
    )

    assert tracked == [
        {"binary_sensor.pump"},
        {"binary_sensor.replacement"},
    ]


def test_problem_sensor_retriggers_after_completion_and_new_transition(
    monkeypatch,
):
    async def run():
        monkeypatch.setattr(
            "custom_components.tasks.manager.dismiss_task_notification",
            lambda hass, task_id: None,
        )
        pending = []
        events = []
        task = {
            "task_id": "pump",
            "task_name": "Check pump",
            "schedule_type": "sensor",
            "problem_sensor": "binary_sensor.pump_problem",
            "task_due": None,
        }
        store = TasksStore.__new__(TasksStore)
        store._lock = asyncio.Lock()
        store._data = {
            "tasks": [store._aggregate_from_fields(task, [], [])]
        }

        async def commit(data):
            store._data = data

        store._commit = commit
        hass = SimpleNamespace(
            async_create_task=lambda coroutine: pending.append(
                asyncio.create_task(coroutine)
            ),
            bus=SimpleNamespace(
                async_fire=lambda event_type, data, context=None: events.append(
                    data
                )
            ),
        )
        manager = TaskManager(hass, store)
        scheduler = ProblemSensorScheduler(hass, manager)

        def change(old_state, new_state, fired_at):
            scheduler._handle_state_event(
                SimpleNamespace(
                    data={
                        "entity_id": "binary_sensor.pump_problem",
                        "old_state": SimpleNamespace(state=old_state),
                        "new_state": SimpleNamespace(state=new_state),
                    },
                    time_fired=fired_at,
                )
            )

        first = datetime(2026, 7, 25, 10, tzinfo=timezone.utc)
        change("off", "on", first)
        await asyncio.gather(*pending)
        pending.clear()

        await manager.async_complete_task(
            "pump", "2026-07-25T10:00:00+00:00", "user-1", "Marco"
        )
        change("on", "on", first)
        change("on", "off", first)
        assert pending == []

        second = datetime(2026, 7, 26, 8, tzinfo=timezone.utc)
        change("off", "on", second)
        await asyncio.gather(*pending)

        assert [
            event["task_due"]
            for event in events
            if event["action"] == "task_due"
        ] == [first.isoformat(), second.isoformat()]
        assert manager.tasks[0]["task_due"] == second.isoformat()

    asyncio.run(run())
