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
    ENGLISH_TRANSLATIONS_URL,
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


async def _frontend_urls(
    hass: HomeAssistant,
) -> tuple[str, str, str]:
    """Return frontend URLs derived from the manifest version."""
    version = (await async_get_integration(hass, DOMAIN)).version
    if version is None:
        raise RuntimeError("Tasks manifest version is required")
    base_url = f"{FRONTEND_URL}/{version}"
    return (
        base_url,
        f"{base_url}/panel.js",
        f"{base_url}/card.js",
    )


async def _async_register_dashboard_resource(
    hass: HomeAssistant, card_js_url: str
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
    resource_data = {"res_type": "module", "url": card_js_url}
    if not matches:
        await resources.async_create_item(resource_data)
        return

    current, *duplicates = matches
    if (
        current["url"] != card_js_url
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
    english_translations = translations_dir / "en.json"
    frontend_url, _, _ = await _frontend_urls(hass)
    await hass.http.async_register_static_paths(
        [
            StaticPathConfig(frontend_url, str(frontend_dir), False),
            StaticPathConfig(
                ENGLISH_TRANSLATIONS_URL,
                str(english_translations),
                False,
            ),
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
    _, panel_js_url, card_js_url = await _frontend_urls(hass)
    await _async_register_dashboard_resource(hass, card_js_url)
    await panel_custom.async_register_panel(
        hass,
        webcomponent_name="tasks-panel",
        frontend_url_path=PANEL_URL.removeprefix("/"),
        module_url=panel_js_url,
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
