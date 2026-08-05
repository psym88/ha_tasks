"""Tests for Tasks LLM tools."""

import asyncio
from datetime import datetime, timezone
from types import SimpleNamespace
from unittest.mock import ANY, AsyncMock
from zoneinfo import ZoneInfo

import pytest
import voluptuous as vol
from homeassistant.core import Context
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.llm import LLM_API_ASSIST, LLMContext, ToolInput

from custom_components.tasks import llm as tasks_llm


def task(**values):
    """Return one representative task record."""
    return {
        "id": "task-1",
        "name": "Clean kitchen",
        "description": None,
        "active": True,
        "due": "2026-08-10T08:00:00+00:00",
        "schedule": {"type": "sliding", "unit": "monthly", "interval": 1},
        **values,
    }


def llm_context(context=None):
    """Return an Assist LLM request context."""
    return LLMContext(
        platform="test",
        context=context,
        language="en",
        assistant="conversation",
        device_id=None,
    )


def user(user_id="user-1", name="Marco"):
    """Return one assignable Home Assistant user."""
    return SimpleNamespace(
        id=user_id,
        name=name,
        is_active=True,
        system_generated=False,
    )


def hass_with_users(users):
    """Return a minimal Home Assistant object with an auth provider."""
    return SimpleNamespace(
        auth=SimpleNamespace(
            async_get_users=AsyncMock(return_value=users),
            async_get_user=AsyncMock(
                side_effect=lambda user_id: next(
                    (item for item in users if item.id == user_id), None
                )
            ),
        )
    )


def test_tools_are_contributed_only_to_assist_when_tasks_are_loaded(monkeypatch):
    """The integration contributes its three tools only to Assist."""
    hass = SimpleNamespace()
    monkeypatch.setattr(tasks_llm, "get_manager", lambda _hass: object())

    result = tasks_llm.async_get_tools(hass, llm_context(), LLM_API_ASSIST)

    assert [tool.name for tool in result.tools] == [
        "tasks_list_open",
        "tasks_get_details",
        "tasks_complete",
        "tasks_create",
        "tasks_assign",
        "tasks_delete",
    ]
    assert "tasks_list_open before tasks_complete" in result.prompt
    assert "After any tool error" in result.prompt
    assert "never invent or announce a default time" in result.prompt
    assert tasks_llm.async_get_tools(hass, llm_context(), "other") is None

    monkeypatch.setattr(tasks_llm, "get_manager", lambda _hass: None)
    assert tasks_llm.async_get_tools(hass, llm_context(), LLM_API_ASSIST) is None


def test_list_open_tasks_excludes_paused_tasks(monkeypatch):
    """Listing returns only active tasks and stable completion IDs."""
    manager = SimpleNamespace(
        tasks=[task(), task(id="paused", name="Paused", active=False)]
    )
    monkeypatch.setattr(tasks_llm, "get_manager", lambda _hass: manager)
    monkeypatch.setattr(
        tasks_llm.dt_util,
        "now",
        lambda: datetime(2026, 8, 5, 12, tzinfo=timezone.utc),
    )

    result = asyncio.run(
        tasks_llm.ListOpenTasksTool().async_call(
            hass_with_users([]),
            ToolInput("tasks_list_open", {}),
            llm_context(),
        )
    )

    assert result == {
        "current_time": "2026-08-05T12:00:00+00:00",
        "timezone": "UTC",
        "applied_filters": {"assignee": None, "range": "all"},
        "tasks": [
            {
                "id": "task-1",
                "name": "Clean kitchen",
                "description": None,
                "due": "2026-08-10T08:00:00+00:00",
                "due_status": "upcoming",
                "schedule": {
                    "type": "sliding",
                    "unit": "monthly",
                    "interval": 1,
                },
                "assignee": None,
            }
        ]
    }


def test_list_open_tasks_filters_assignee_and_current_week(monkeypatch):
    """Person and week questions are evaluated in Home Assistant time."""
    marco = user()
    manager = SimpleNamespace(
        tasks=[
            task(
                id="marco-week",
                assignee_id=marco.id,
                due="2026-08-07T08:00:00+00:00",
            ),
            task(
                id="marco-overdue",
                assignee_id=marco.id,
                due="2026-07-20T08:00:00+00:00",
            ),
            task(
                id="unassigned-overdue",
                assignee_id=None,
                due="2026-07-21T08:00:00+00:00",
            ),
            task(
                id="marco-later",
                assignee_id=marco.id,
                due="2026-08-10T08:00:00+00:00",
            ),
            task(id="other", assignee_id="user-2"),
        ]
    )
    monkeypatch.setattr(tasks_llm, "get_manager", lambda _hass: manager)
    zurich = ZoneInfo("Europe/Zurich")
    monkeypatch.setattr(tasks_llm.dt_util, "DEFAULT_TIME_ZONE", zurich)
    monkeypatch.setattr(
        tasks_llm.dt_util,
        "now",
        lambda: datetime(2026, 8, 5, 14, tzinfo=zurich),
    )

    result = asyncio.run(
        tasks_llm.ListOpenTasksTool().async_call(
            hass_with_users([marco]),
            ToolInput(
                "tasks_list_open", {"assignee": "marco", "range": "week"}
            ),
            llm_context(),
        )
    )

    assert [item["id"] for item in result["tasks"]] == ["marco-week"]
    assert result["tasks"][0]["assignee"] == {
        "id": "user-1",
        "name": "Marco",
    }
    assert result["applied_filters"] == {
        "assignee": {"id": "user-1", "name": "Marco"},
        "range": "week",
    }

    due_result = asyncio.run(
        tasks_llm.ListOpenTasksTool().async_call(
            hass_with_users([marco]),
            ToolInput(
                "tasks_list_open",
                {"assignee": "current_user", "range": "due"},
            ),
            llm_context(Context(user_id=marco.id)),
        )
    )

    assert [item["id"] for item in due_result["tasks"]] == [
        "marco-overdue"
    ]
    assert due_result["tasks"][0]["due_status"] == "overdue"
    assert due_result["current_time"] == "2026-08-05T14:00:00+02:00"
    assert due_result["timezone"] == "Europe/Zurich"
    assert due_result["tasks"][0]["due"] == "2026-07-20T10:00:00+02:00"
    assert all(
        item["assignee"]["id"] == "user-1"
        for item in due_result["tasks"]
    )

    unassigned_result = asyncio.run(
        tasks_llm.ListOpenTasksTool().async_call(
            hass_with_users([marco]),
            ToolInput(
                "tasks_list_open",
                {"assignee": "unassigned", "range": "due"},
            ),
            llm_context(),
        )
    )

    assert [item["id"] for item in unassigned_result["tasks"]] == [
        "unassigned-overdue"
    ]
    assert unassigned_result["tasks"][0]["assignee"] is None
    assert unassigned_result["applied_filters"] == {
        "assignee": "unassigned",
        "range": "due",
    }


def test_complete_task_uses_manager_and_request_user(monkeypatch):
    """Completion retains attribution and the Tasks recurrence flow."""
    completed = task(due="2026-09-10T08:00:00+00:00")
    manager = SimpleNamespace(
        task=lambda task_id: task(id=task_id),
        async_complete_task=AsyncMock(return_value=completed),
    )
    monkeypatch.setattr(tasks_llm, "get_manager", lambda _hass: manager)
    hass = hass_with_users([user()])
    context = Context(user_id="user-1")

    result = asyncio.run(
        tasks_llm.CompleteTaskTool().async_call(
            hass,
            ToolInput(
                "tasks_complete", {"task_id": "task-1", "notes": "Done"}
            ),
            llm_context(context),
        )
    )

    manager.async_complete_task.assert_awaited_once_with(
        "task-1",
        ANY,
        "user-1",
        "Marco",
        "Done",
        context=context,
        source="llm",
    )
    assert result["task"]["due"] == "2026-09-10T08:00:00+00:00"


def test_create_task_requires_and_preserves_explicit_schedule(monkeypatch):
    """Creation reuses the editor transaction without inventing a schedule."""
    schedule = {
        "type": "fixed",
        "unit": "weekly",
        "interval": 1,
        "weekdays": [4],
        "time": "18:00",
    }
    created = task(
        name="Take out trash", assignee_id="user-1", schedule=schedule
    )
    manager = SimpleNamespace(
        async_save_task=AsyncMock(return_value={"task": created})
    )
    monkeypatch.setattr(tasks_llm, "get_manager", lambda _hass: manager)
    context = Context(user_id="user-1")

    result = asyncio.run(
        tasks_llm.CreateTaskTool().async_call(
            hass_with_users([user()]),
            ToolInput(
                "tasks_create",
                {
                    "name": " Take out trash ",
                    "assignee": "Marco",
                    "schedule": schedule,
                },
            ),
            llm_context(context),
        )
    )

    manager.async_save_task.assert_awaited_once_with(
        None,
        {
            "name": "Take out trash",
            "description": None,
            "active": True,
            "assignee_id": "user-1",
            "schedule": schedule,
        },
        [],
        [],
        [],
        ANY,
        context=context,
    )
    assert result["task"]["schedule"] == schedule

    with pytest.raises(vol.Invalid):
        asyncio.run(
            tasks_llm.CreateTaskTool().async_call(
                SimpleNamespace(),
                ToolInput("tasks_create", {"name": "No schedule"}),
                llm_context(),
            )
        )

    with pytest.raises(vol.Invalid):
        tasks_llm.CreateTaskTool().parameters(
            {
                "name": "Missing time",
                "schedule": {
                    "type": "fixed",
                    "unit": "weekly",
                    "interval": 1,
                    "weekdays": [1],
                },
            }
        )

    with pytest.raises(vol.Invalid):
        tasks_llm.CreateTaskTool().parameters(
            {
                "name": "Wrong weekly shape",
                "schedule": {
                    "unit": "weekly",
                    "interval": 7,
                    "day_of_week": 4,
                },
            }
        )

    assert "every Thursday at 09:00" in (
        tasks_llm.CreateTaskTool.description
    )
    assert '"weekdays":[3]' in tasks_llm.CreateTaskTool.description

    yearly = tasks_llm.CreateTaskTool().parameters(
        {
            "name": "Yearly",
            "schedule": {
                "type": "fixed",
                "unit": "yearly",
                "interval": 1,
                "day": 1,
                "month": 8,
                "time": "09:00",
            },
        }
    )
    assert yearly["schedule"]["month"] == 8
    assert '"month":8' in tasks_llm.CreateTaskTool.description

    with pytest.raises(vol.Invalid, match="time is required"):
        tasks_llm.CreateTaskTool().parameters(
            {
                "name": "Missing yearly time",
                "schedule": {
                    "type": "fixed",
                    "unit": "yearly",
                    "interval": 1,
                    "day": 1,
                    "month": 8,
                },
            }
        )


def test_details_return_only_requested_history(monkeypatch):
    """History is returned only through a targeted detail request."""
    manager = SimpleNamespace(
        task=lambda task_id: task(id=task_id, assignee_id="user-1"),
        history=lambda task_id: [
            {
                "id": "completion-1",
                "completed_at": "2026-08-01T08:00:00+00:00",
                "user_name": "Marco",
                "notes": "Done",
            }
        ],
    )
    monkeypatch.setattr(tasks_llm, "get_manager", lambda _hass: manager)

    result = asyncio.run(
        tasks_llm.TaskDetailsTool().async_call(
            hass_with_users([user()]),
            ToolInput("tasks_get_details", {"task_id": "task-1"}),
            llm_context(),
        )
    )

    assert result["task"]["assignee"]["name"] == "Marco"
    assert result["history"][0]["notes"] == "Done"


def test_assign_task_resolves_exact_person_and_rejects_ambiguity(monkeypatch):
    """Assignment never guesses between people with the same name."""
    assigned = task(assignee_id="user-1")
    manager = SimpleNamespace(
        async_update_task=AsyncMock(return_value=assigned)
    )
    monkeypatch.setattr(tasks_llm, "get_manager", lambda _hass: manager)
    context = Context(user_id="user-2")

    result = asyncio.run(
        tasks_llm.AssignTaskTool().async_call(
            hass_with_users([user()]),
            ToolInput(
                "tasks_assign", {"task_id": "task-1", "assignee": "Marco"}
            ),
            llm_context(context),
        )
    )

    manager.async_update_task.assert_awaited_once_with(
        "task-1",
        {"assignee_id": "user-1"},
        ANY,
        context=context,
    )
    assert result["task"]["assignee"]["name"] == "Marco"

    with pytest.raises(HomeAssistantError, match="ambiguous"):
        asyncio.run(
            tasks_llm.AssignTaskTool().async_call(
                hass_with_users(
                    [user("user-1", "Marco"), user("user-2", "Marco")]
                ),
                ToolInput(
                    "tasks_assign",
                    {"task_id": "task-1", "assignee": "Marco"},
                ),
                llm_context(),
            )
        )


def test_delete_task_requires_a_prepared_confirmation(monkeypatch):
    """Deletion needs a separate preparation call by the same HA user."""
    manager = SimpleNamespace(
        task=lambda task_id: task(id=task_id, name="Abfall rausstellen"),
        async_delete_task=AsyncMock(),
    )
    monkeypatch.setattr(tasks_llm, "get_manager", lambda _hass: manager)
    hass = hass_with_users([user()])
    hass.data = {}
    context = Context(user_id="user-1")
    tool = tasks_llm.DeleteTaskTool()

    prepared = asyncio.run(
        tool.async_call(
            hass,
            ToolInput(
                "tasks_delete", {"task_id": "task-1", "confirmed": False}
            ),
            llm_context(context),
        )
    )

    assert prepared == {
        "confirmation_required": True,
        "task": {"id": "task-1", "name": "Abfall rausstellen"},
        "question": (
            'Do you really want to permanently delete the Task '
            '"Abfall rausstellen"?'
        ),
    }
    manager.async_delete_task.assert_not_awaited()

    deleted = asyncio.run(
        tool.async_call(
            hass,
            ToolInput(
                "tasks_delete", {"task_id": "task-1", "confirmed": True}
            ),
            llm_context(context),
        )
    )

    manager.async_delete_task.assert_awaited_once_with(
        "task-1", context=context
    )
    assert deleted == {
        "deleted": True,
        "task": {"id": "task-1", "name": "Abfall rausstellen"},
    }


def test_delete_task_rejects_confirmation_without_preparation(monkeypatch):
    """An LLM cannot skip directly to destructive confirmation."""
    manager = SimpleNamespace(
        task=lambda task_id: task(id=task_id),
        async_delete_task=AsyncMock(),
    )
    monkeypatch.setattr(tasks_llm, "get_manager", lambda _hass: manager)
    hass = hass_with_users([user()])
    hass.data = {}

    with pytest.raises(HomeAssistantError, match="not prepared"):
        asyncio.run(
            tasks_llm.DeleteTaskTool().async_call(
                hass,
                ToolInput(
                    "tasks_delete",
                    {"task_id": "task-1", "confirmed": True},
                ),
                llm_context(Context(user_id="user-1")),
            )
        )
    manager.async_delete_task.assert_not_awaited()
