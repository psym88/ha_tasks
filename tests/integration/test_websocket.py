"""WebSocket tests through Home Assistant's real WebSocket API."""

from homeassistant.setup import async_setup_component

from custom_components.tasks import TasksData, task_api


class SnapshotManager:
    """Minimal manager implementing the public read contract."""

    revision = 7

    def snapshot(self) -> dict:
        return {"tasks": [], "history": {}, "attachments": []}

    def subscribe(self, listener):
        return lambda: None


async def test_list_uses_real_websocket_registration(
    hass,
    hass_ws_client,
    tasks_entry,
) -> None:
    """Authenticated clients can call the registered Tasks command."""
    assert await async_setup_component(hass, "websocket_api", {})
    task_api.async_register(hass)
    tasks_entry.runtime_data = TasksData(SnapshotManager())

    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "tasks/list"})
    response = await client.receive_json()

    assert response["success"]
    assert response["result"]["tasks"] == []
    assert response["result"]["history"] == {}
    assert "now" in response["result"]
    assert response["result"]["users"]


async def test_list_reports_not_loaded_through_websocket(
    hass,
    hass_ws_client,
) -> None:
    """The public API returns its stable error when no entry is loaded."""
    assert await async_setup_component(hass, "websocket_api", {})
    task_api.async_register(hass)

    client = await hass_ws_client(hass)
    await client.send_json_auto_id({"type": "tasks/list"})
    response = await client.receive_json()

    assert not response["success"]
    assert response["error"]["code"] == "not_loaded"
