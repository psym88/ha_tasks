"""Tasks integration."""

from pathlib import Path

import homeassistant.helpers.config_validation as cv
from homeassistant.components import frontend, panel_custom
from homeassistant.components.lovelace.const import (
    LOVELACE_DATA,
    MODE_STORAGE,
)
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.loader import async_get_integration

from . import attachment_api, nfc_completion, task_api
from .const import (
    DOMAIN,
    FRONTEND_URL,
    PANEL_TITLE,
    PANEL_URL,
    PLATFORMS,
    TRANSLATIONS_URL,
)
from .manager import TaskManager
from .scheduling import TaskEngine
from .task_store import TasksStore

CONFIG_SCHEMA = cv.config_entry_only_config_schema(DOMAIN)


async def _frontend_url(hass: HomeAssistant) -> str:
    """Return the frontend URL derived from the manifest version."""
    version = (await async_get_integration(hass, DOMAIN)).version
    if version is None:
        raise RuntimeError("Tasks manifest version is required")
    return f"{FRONTEND_URL}/card.js?v={version}"


async def _async_register_dashboard_resource(
    hass: HomeAssistant, frontend_js_url: str
) -> None:
    """Register the dashboard card as a Lovelace module resource."""
    lovelace = hass.data[LOVELACE_DATA]
    if lovelace.resource_mode != MODE_STORAGE:
        return

    resources = lovelace.resources
    await resources.async_get_info()
    matches = [
        resource
        for resource in resources.async_items()
        if resource["url"].split("?", 1)[0].startswith(
            f"{FRONTEND_URL}/"
        )
        and resource["url"].split("?", 1)[0].endswith("/card.js")
    ]
    resource_data = {"res_type": "module", "url": frontend_js_url}
    if not matches:
        await resources.async_create_item(resource_data)
        return

    current, *duplicates = matches
    if (
        current["url"] != frontend_js_url
        or current.get("type") != "module"
    ):
        await resources.async_update_item(current["id"], resource_data)
    for duplicate in duplicates:
        await resources.async_delete_item(duplicate["id"])


async def async_setup(hass: HomeAssistant, config: dict) -> bool:
    task_api.async_register(hass)
    attachment_api.async_register_views(hass)
    frontend_dir = Path(__file__).parent / "frontend"
    translations_dir = Path(__file__).parent / "translations"
    await hass.http.async_register_static_paths(
        [
            StaticPathConfig(FRONTEND_URL, str(frontend_dir), False),
            StaticPathConfig(
                TRANSLATIONS_URL, str(translations_dir), False
            ),
        ]
    )
    return True


async def async_setup_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    upload_dir = Path(hass.config.path(DOMAIN, "uploads"))
    store = TasksStore(hass, upload_dir)
    await store.async_load()
    manager = TaskManager(hass, store)
    engine = TaskEngine(hass, manager)
    entry.runtime_data = manager
    await engine.async_start()
    entry.async_on_unload(engine.stop)
    entry.async_on_unload(nfc_completion.async_setup_listener(hass, manager))
    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    frontend_js_url = await _frontend_url(hass)
    await _async_register_dashboard_resource(hass, frontend_js_url)
    await panel_custom.async_register_panel(
        hass,
        webcomponent_name="tasks-panel",
        frontend_url_path=PANEL_URL.removeprefix("/"),
        module_url=frontend_js_url,
        sidebar_title=PANEL_TITLE,
        sidebar_icon="mdi:clipboard-check-outline",
        require_admin=True,
        config={},
    )
    return True


async def async_unload_entry(hass: HomeAssistant, entry: ConfigEntry) -> bool:
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        frontend.async_remove_panel(hass, PANEL_URL.removeprefix("/"))
    return unloaded
