"""Config flow for Tasks."""

from typing import Any

from homeassistant import config_entries
from homeassistant.data_entry_flow import FlowResult

from .const import DOMAIN


class TasksConfigFlow(config_entries.ConfigFlow, domain=DOMAIN):
    """Create the single local Tasks configuration."""

    VERSION = 1

    async def async_step_user(
        self, user_input: dict[str, Any] | None = None
    ) -> FlowResult:
        """Handle setup initiated by the user."""
        await self.async_set_unique_id(DOMAIN)
        self._abort_if_unique_id_configured()
        if user_input is not None:
            return self.async_create_entry(title="Tasks", data={})
        return self.async_show_form(step_id="user")

