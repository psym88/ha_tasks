"""Tests for binary-sensor task triggers."""

import asyncio
from datetime import datetime, timezone
from types import SimpleNamespace

from custom_components.tasks.problem_events import ProblemSensorScheduler
from custom_components.tasks.task_store import TasksStore


class ProblemStore:
    def __init__(self, task):
        self.tasks = [task]
        self.triggered = []

    def task(self, task_id):
        return next(task for task in self.tasks if task["task_id"] == task_id)

    async def async_trigger_problem_task(self, task_id, triggered_at):
        task = self.task(task_id)
        if task.get("task_due"):
            return None
        task["task_due"] = triggered_at
        self.triggered.append(task_id)
        return dict(task)


def test_problem_sensor_triggers_only_when_state_becomes_on(monkeypatch):
    async def run():
        fired = []
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
        monkeypatch.setattr(
            "custom_components.tasks.problem_events.fire_task_due",
            lambda received_hass, received_task: fired.append(received_task),
        )
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
        assert [item["task_id"] for item in fired] == ["pump"]

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
        fired = []
        listeners = []
        task = {
            "task_id": "pump",
            "task_name": "Check pump",
            "schedule_type": "sensor",
            "problem_sensor": "binary_sensor.pump_problem",
            "task_due": None,
        }
        store = ProblemStore(task)
        hass = SimpleNamespace(
            bus=SimpleNamespace(
                async_listen=lambda event_type, callback: (
                    listeners.append((event_type, callback)),
                    lambda: None,
                )[1]
            ),
            states=SimpleNamespace(
                is_state=lambda entity_id, state: (
                    entity_id == "binary_sensor.pump_problem" and state == "on"
                )
            ),
        )
        scheduler = ProblemSensorScheduler(hass, store)
        monkeypatch.setattr(
            "custom_components.tasks.problem_events.fire_task_due",
            lambda received_hass, received_task: fired.append(received_task),
        )

        await scheduler.async_start()

        assert len(listeners) == 2
        assert store.triggered == ["pump"]
        assert [item["task_id"] for item in fired] == ["pump"]

    asyncio.run(run())


def test_problem_sensor_ignores_inactive_task(monkeypatch):
    async def run():
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
            bus=SimpleNamespace(async_listen=lambda *_args: lambda: None),
            states=SimpleNamespace(is_state=lambda *_args: True),
        )
        scheduler = ProblemSensorScheduler(hass, store)
        monkeypatch.setattr(
            "custom_components.tasks.problem_events.fire_task_due",
            lambda *_args: None,
        )

        await scheduler.async_start()

        assert store.triggered == []

    asyncio.run(run())


def test_problem_sensor_retriggers_after_completion_and_new_transition(monkeypatch):
    async def run():
        fired = []
        pending = []
        task = {
            "task_id": "pump",
            "task_name": "Check pump",
            "schedule_type": "sensor",
            "problem_sensor": "binary_sensor.pump_problem",
            "task_due": None,
        }
        store = TasksStore.__new__(TasksStore)
        store._lock = asyncio.Lock()
        store._data = {"tasks": [task], "history": {}, "attachments": []}

        async def save():
            return None

        store._save = save
        hass = SimpleNamespace(
            async_create_task=lambda coroutine: pending.append(
                asyncio.create_task(coroutine)
            )
        )
        scheduler = ProblemSensorScheduler(hass, store)
        monkeypatch.setattr(
            "custom_components.tasks.problem_events.fire_task_due",
            lambda received_hass, received_task: fired.append(
                received_task["task_due"]
            ),
        )

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

        await store.async_complete_task(
            "pump", "2026-07-25T10:00:00+00:00", "user-1", "Marco"
        )
        change("on", "on", first)
        change("on", "off", first)
        assert pending == []

        second = datetime(2026, 7, 26, 8, tzinfo=timezone.utc)
        change("off", "on", second)
        await asyncio.gather(*pending)

        assert fired == [first.isoformat(), second.isoformat()]
        assert task["task_due"] == second.isoformat()

    asyncio.run(run())
