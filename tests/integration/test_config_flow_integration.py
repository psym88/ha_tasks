"""Config-flow integration tests through Home Assistant's flow manager."""

from homeassistant import config_entries
from homeassistant.data_entry_flow import FlowResultType
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.tasks.const import DOMAIN


async def test_user_flow_creates_the_single_tasks_entry(hass) -> None:
    """The UI flow creates one empty local config entry."""
    result = await hass.config_entries.flow.async_init(
        DOMAIN,
        context={"source": config_entries.SOURCE_USER},
    )

    assert result["type"] is FlowResultType.FORM
    assert result["step_id"] == "user"

    result = await hass.config_entries.flow.async_configure(
        result["flow_id"],
        {},
    )

    assert result["type"] is FlowResultType.CREATE_ENTRY
    assert result["title"] == "Tasks"
    assert result["data"] == {}


async def test_user_flow_rejects_a_second_entry(hass) -> None:
    """The real flow manager enforces the integration's unique ID."""
    MockConfigEntry(
        domain=DOMAIN,
        title="Tasks",
        unique_id=DOMAIN,
        data={},
    ).add_to_hass(hass)

    result = await hass.config_entries.flow.async_init(
        DOMAIN,
        context={"source": config_entries.SOURCE_USER},
    )

    assert result["type"] is FlowResultType.ABORT
    assert result["reason"] == "already_configured"
