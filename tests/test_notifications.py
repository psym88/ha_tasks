"""Tests for task due notifications."""

import asyncio
from types import SimpleNamespace

from custom_components.tasks import notifications


def _task(**values):
    return {
        "id": "task",
        "name": "Replace water filter",
        "due": "2026-07-25T10:15:00+00:00",
        "schedule": {"type": "sliding", "unit": "daily", "interval": 1},
        "notification": {
            "device_ids": [],
            "persistent": False,
            "critical": False,
            "route": None,
        },
        **values,
    }


def _hass(language="de"):
    async def async_add_executor_job(target, *args):
        return target(*args)

    return SimpleNamespace(
        config=SimpleNamespace(language=language),
        async_add_executor_job=async_add_executor_job,
    )


def test_due_notification_sends_native_mobile_app_device_actions(monkeypatch):
    calls = []

    async def call_action(hass, config, variables, context):
        calls.append((hass, config, variables, context))

    monkeypatch.setattr(
        notifications.device_action,
        "async_call_action_from_config",
        call_action,
    )
    hass = _hass()
    task = _task(
        notification={
            "device_ids": ["phone", "tablet"],
            "persistent": False,
            "critical": True,
            "route": None,
        },
    )

    asyncio.run(notifications.async_notify_task_due(hass, task))

    assert [call[1]["device_id"] for call in calls] == ["phone", "tablet"]
    assert all(call[1]["domain"] == "mobile_app" for call in calls)
    assert all(call[1]["type"] == "notify" for call in calls)
    assert all(call[1]["title"] == "Task fällig" for call in calls)
    assert all(
        call[1]["message"]
        == "„Replace water filter“ ist jetzt fällig."
        for call in calls
    )
    data = calls[0][1]["data"]
    assert data["ttl"] == 0
    assert data["priority"] == "high"
    assert data["channel"] == "alarm_stream"
    assert data["push"]["sound"] == {
        "name": "default",
        "critical": 1,
        "volume": 1.0,
    }
    assert data["tag"] == "tasks_due_task"
    assert "url" not in data


def test_panel_notification_uses_stable_id(monkeypatch):
    created = []
    monkeypatch.setattr(
        notifications.persistent_notification,
        "async_create",
        lambda hass, message, title=None, notification_id=None: created.append(
            (hass, message, title, notification_id)
        ),
    )
    hass = _hass()

    asyncio.run(
        notifications.async_notify_task_due(
            hass,
            _task(
                notification={
                    "device_ids": [],
                    "persistent": True,
                    "critical": False,
                    "route": None,
                }
            ),
        )
    )

    assert created == [
        (
            hass,
            "„Replace water filter“ ist jetzt fällig.",
            "Task fällig",
            "tasks_due_task",
        )
    ]


def test_problem_notification_uses_problem_wording(monkeypatch):
    created = []
    monkeypatch.setattr(
        notifications.persistent_notification,
        "async_create",
        lambda hass, message, title=None, notification_id=None: created.append(
            (message, title)
        ),
    )

    asyncio.run(
        notifications.async_notify_task_due(
            _hass(),
            _task(
                name="Check heat pump",
                schedule={"type": "sensor", "entity_id": "binary_sensor.pump"},
                notification={
                    "device_ids": [],
                    "persistent": True,
                    "critical": False,
                    "route": None,
                },
            ),
        )
    )

    assert created == [
        ("„Check heat pump“ benötigt deine Aufmerksamkeit.", "Problem erkannt")
    ]


def test_notification_uses_home_assistant_instance_language(monkeypatch):
    created = []
    monkeypatch.setattr(
        notifications.persistent_notification,
        "async_create",
        lambda hass, message, title=None, notification_id=None: created.append(
            (message, title)
        ),
    )

    asyncio.run(
        notifications.async_notify_task_due(
            _hass("en"),
            _task(
                notification={
                    "device_ids": [],
                    "persistent": True,
                    "critical": False,
                    "route": None,
                }
            ),
        )
    )

    assert created == [
        ("“Replace water filter” is now due.", "Task due")
    ]


def test_notification_falls_back_to_english(monkeypatch):
    created = []
    monkeypatch.setattr(
        notifications.persistent_notification,
        "async_create",
        lambda hass, message, title=None, notification_id=None: created.append(
            (message, title)
        ),
    )

    asyncio.run(
        notifications.async_notify_task_due(
            _hass("fr-CH"),
            _task(
                notification={
                    "device_ids": [],
                    "persistent": True,
                    "critical": False,
                    "route": None,
                }
            ),
        )
    )

    assert created == [
        ("“Replace water filter” is now due.", "Task due")
    ]


def test_task_notification_can_be_dismissed_directly(monkeypatch):
    dismissed = []
    hass = SimpleNamespace()
    monkeypatch.setattr(
        notifications.persistent_notification,
        "async_dismiss",
        lambda received_hass, notification_id: dismissed.append(
            (received_hass, notification_id)
        ),
    )

    notifications.dismiss_task_notification(hass, "task")

    assert dismissed == [(hass, "tasks_due_task")]


def test_notification_enablement_requires_a_target_or_panel():
    assert not notifications.has_due_notification(_task())
    assert notifications.has_due_notification(
        _task(
            notification={
                "device_ids": ["phone"],
                "persistent": False,
                "critical": False,
                "route": None,
            }
        )
    )
    assert notifications.has_due_notification(
        _task(
            notification={
                "device_ids": [],
                "persistent": True,
                "critical": False,
                "route": None,
            }
        )
    )


def test_mobile_notification_uses_the_configured_route():
    data = notifications._mobile_data(
        _task(
            notification={
                "device_ids": [],
                "persistent": False,
                "critical": False,
                "route": "/lovelace/maintenance",
            }
        )
    )

    assert data["url"] == "/lovelace/maintenance"
    assert data["clickAction"] == "/lovelace/maintenance"
