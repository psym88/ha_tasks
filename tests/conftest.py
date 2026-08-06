"""Shared Home Assistant fixtures for the Tasks test suite."""

from collections.abc import Generator
from datetime import UTC

import pytest
from homeassistant.util import dt as dt_util
from pytest_homeassistant_custom_component.common import MockConfigEntry

from custom_components.tasks.const import DOMAIN


@pytest.fixture(autouse=True)
def enable_tasks_custom_integration(
    enable_custom_integrations: None,
) -> Generator[None]:
    """Allow Home Assistant to load integrations from custom_components."""
    yield


@pytest.fixture(autouse=True)
def deterministic_default_timezone(hass) -> Generator[None]:
    """Keep legacy unit tests independent from HA fixture timezone changes."""
    dt_util.set_default_time_zone(UTC)
    yield
    dt_util.set_default_time_zone(UTC)


@pytest.fixture
def tasks_entry(hass) -> MockConfigEntry:
    """Add the single Tasks config entry to Home Assistant."""
    entry = MockConfigEntry(
        domain=DOMAIN,
        title="Tasks",
        unique_id=DOMAIN,
        data={},
    )
    entry.add_to_hass(hass)
    return entry
