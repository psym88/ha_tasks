"""Config-entry lifecycle tests using a real HomeAssistant object."""

import importlib
from unittest.mock import AsyncMock, Mock, patch

from custom_components.tasks.manager import TaskManager

tasks_integration = importlib.import_module("custom_components.tasks")


async def test_setup_and_unload_entry_manage_runtime_resources(
    hass,
    tasks_entry,
) -> None:
    """Setup owns runtime state and unload removes the visible panel."""
    unsubscribe_nfc = Mock()
    stop_engine = Mock()

    with (
        patch.object(
            tasks_integration.TasksStore,
            "async_load",
            AsyncMock(),
        ),
        patch.object(
            tasks_integration.TaskEngine,
            "async_start",
            AsyncMock(),
        ),
        patch.object(
            tasks_integration.TaskEngine,
            "stop",
            stop_engine,
        ),
        patch.object(
            tasks_integration.nfc_completion,
            "async_setup_listener",
            return_value=unsubscribe_nfc,
        ),
        patch.object(
            hass.config_entries,
            "async_forward_entry_setups",
            AsyncMock(),
        ) as forward_setups,
        patch.object(
            tasks_integration,
            "_frontend_urls",
            AsyncMock(
                return_value=(
                    "/tasks_frontend/test",
                    "/tasks_frontend/test/panel.js",
                    "/tasks_frontend/test/card.js",
                )
            ),
        ),
        patch.object(
            tasks_integration,
            "_async_register_dashboard_resource",
            AsyncMock(),
        ) as register_resource,
        patch.object(
            tasks_integration.panel_custom,
            "async_register_panel",
            AsyncMock(),
        ) as register_panel,
    ):
        assert await tasks_integration.async_setup_entry(hass, tasks_entry)

    assert isinstance(tasks_entry.runtime_data, TaskManager)
    forward_setups.assert_awaited_once()
    register_resource.assert_awaited_once_with(
        hass,
        "/tasks_frontend/test/card.js",
    )
    register_panel.assert_awaited_once()

    with (
        patch.object(
            hass.config_entries,
            "async_unload_platforms",
            AsyncMock(return_value=True),
        ) as unload_platforms,
        patch.object(
            tasks_integration.frontend,
            "async_remove_panel",
        ) as remove_panel,
    ):
        assert await tasks_integration.async_unload_entry(hass, tasks_entry)

    unload_platforms.assert_awaited_once()
    remove_panel.assert_called_once_with(hass, "tasks")


async def test_failed_platform_unload_keeps_the_panel(hass, tasks_entry) -> None:
    """A failed platform unload does not expose a partially removed UI."""
    with (
        patch.object(
            hass.config_entries,
            "async_unload_platforms",
            AsyncMock(return_value=False),
        ),
        patch.object(
            tasks_integration.frontend,
            "async_remove_panel",
        ) as remove_panel,
    ):
        assert not await tasks_integration.async_unload_entry(hass, tasks_entry)

    remove_panel.assert_not_called()
