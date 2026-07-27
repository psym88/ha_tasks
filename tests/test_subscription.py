"""Tests for the Tasks snapshot subscription."""

from datetime import datetime, timezone
from types import SimpleNamespace

from custom_components.tasks.manager import TaskChange
from custom_components.tasks import task_api


class Manager:
    def __init__(self):
        self.tasks = [{"task_id": "task-1", "task_name": "Initial"}]
        self.listener = None
        self.unsubscribed = False

    def snapshot(self):
        return {"tasks": list(self.tasks), "attachments": []}

    def subscribe(self, listener):
        self.listener = listener

        def unsubscribe():
            self.unsubscribed = True

        return unsubscribe


class Connection:
    def __init__(self):
        self.subscriptions = {}
        self.results = []
        self.events = []
        self.errors = []

    def send_result(self, message_id):
        self.results.append(message_id)

    def send_event(self, message_id, event):
        self.events.append((message_id, event))

    def send_error(self, message_id, code, message):
        self.errors.append((message_id, code, message))


def test_subscription_sends_initial_and_updated_snapshots(monkeypatch):
    manager = Manager()
    connection = Connection()
    now = datetime(2026, 7, 27, 10, tzinfo=timezone.utc)
    monkeypatch.setattr(task_api, "get_manager", lambda hass: manager)
    monkeypatch.setattr(task_api.dt_util, "utcnow", lambda: now)

    task_api.ws_subscribe(
        SimpleNamespace(), connection, {"id": 7, "type": "tasks/subscribe"}
    )

    assert connection.results == [7]
    assert connection.events == [
        (
            7,
            {
                "type": "snapshot",
                "tasks": [{"task_id": "task-1", "task_name": "Initial"}],
                "attachments": [],
                "now": now.isoformat(),
            },
        )
    ]
    assert callable(connection.subscriptions[7])

    manager.tasks[0] = {"task_id": "task-1", "task_name": "Updated"}
    manager.listener(
        TaskChange("updated", "task", "task-1", {"resource_name": "Updated"})
    )

    assert connection.events[-1][1] == {
        "type": "snapshot",
        "tasks": [{"task_id": "task-1", "task_name": "Updated"}],
        "attachments": [],
        "now": now.isoformat(),
        "change": {
            "action": "updated",
            "resource_type": "task",
            "resource_id": "task-1",
            "resource_name": "Updated",
        },
    }
    connection.subscriptions[7]()
    assert manager.unsubscribed


def test_subscription_reports_unloaded_integration(monkeypatch):
    connection = Connection()
    monkeypatch.setattr(task_api, "get_manager", lambda hass: None)

    task_api.ws_subscribe(
        SimpleNamespace(), connection, {"id": 8, "type": "tasks/subscribe"}
    )

    assert connection.errors == [
        (8, "not_loaded", "Integration not loaded")
    ]
    assert connection.events == []
