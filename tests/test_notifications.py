"""Tests for task due notifications."""

import asyncio
from types import SimpleNamespace

from custom_components.tasks import notifications


def _task(**values):
    return {
        "task_id": "task",
        "task_name": "Replace water filter",
        "task_due": "2026-07-25T10:15:00+00:00",
        "notification_target": {},
        "notification_persistent": False,
        "notification_critical": False,
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
        notification_target={"device_id": ["phone", "tablet"]},
        notification_critical=True,
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
            hass, _task(notification_persistent=True)
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
                task_name="Check heat pump",
                schedule_type="sensor",
                notification_persistent=True,
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
            _task(notification_persistent=True),
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
            _task(notification_persistent=True),
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
        _task(notification_target={"device_id": ["phone"]})
    )
    assert notifications.has_due_notification(
        _task(notification_persistent=True)
    )


def test_mobile_notification_uses_the_configured_route():
    data = notifications._mobile_data(
        _task(notification_route="/lovelace/maintenance")
    )

    assert data["url"] == "/lovelace/maintenance"
    assert data["clickAction"] == "/lovelace/maintenance"
