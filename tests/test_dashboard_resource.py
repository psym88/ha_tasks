"""Tests for automatic Lovelace dashboard-card registration."""

import asyncio
import json
from pathlib import Path
from types import SimpleNamespace
from unittest.mock import AsyncMock, Mock

from homeassistant.components.lovelace.const import (
    LOVELACE_DATA,
    MODE_STORAGE,
)

from custom_components.tasks import _async_register_dashboard_resource


VERSION = json.loads(
    Path("custom_components/tasks/manifest.json").read_text(encoding="utf-8")
)["version"]
CARD_URL = f"/tasks_frontend/{VERSION}/card.js"
RESOURCE_DATA = {"res_type": "module", "url": CARD_URL}


def _hass(resource_mode: str, resources: SimpleNamespace) -> SimpleNamespace:
    return SimpleNamespace(
        data={
            LOVELACE_DATA: SimpleNamespace(
                resource_mode=resource_mode,
                resources=resources,
            )
        }
    )


def _resources(items: list[dict]) -> SimpleNamespace:
    return SimpleNamespace(
        async_get_info=AsyncMock(return_value={"resources": len(items)}),
        async_items=Mock(return_value=items),
        async_create_item=AsyncMock(),
        async_update_item=AsyncMock(),
        async_delete_item=AsyncMock(),
    )


def test_dashboard_card_is_created_as_module_resource() -> None:
    """A missing Tasks card is added through the Lovelace resource collection."""
    resources = _resources([])

    asyncio.run(
        _async_register_dashboard_resource(
            _hass(MODE_STORAGE, resources), CARD_URL
        )
    )

    resources.async_get_info.assert_awaited_once_with()
    resources.async_create_item.assert_awaited_once_with(RESOURCE_DATA)
    resources.async_update_item.assert_not_awaited()
    resources.async_delete_item.assert_not_awaited()


def test_dashboard_card_resource_is_updated_and_deduplicated() -> None:
    """Old Tasks resources are updated without touching unrelated resources."""
    resources = _resources(
        [
            {
                "id": "unrelated",
                "type": "module",
                "url": "/local/example.js",
            },
            {
                "id": "old",
                "type": "js",
                "url": "/tasks_frontend/20260728.1/card.js",
            },
            {
                "id": "duplicate",
                "type": "module",
                "url": "/tasks_frontend/20260728.3/card.js?v=stale",
            },
        ]
    )

    asyncio.run(
        _async_register_dashboard_resource(
            _hass(MODE_STORAGE, resources), CARD_URL
        )
    )

    resources.async_create_item.assert_not_awaited()
    resources.async_update_item.assert_awaited_once_with(
        "old", RESOURCE_DATA
    )
    resources.async_delete_item.assert_awaited_once_with("duplicate")


def test_dashboard_card_does_not_modify_yaml_resources() -> None:
    """YAML resource configuration remains entirely user-owned."""
    resources = _resources([])

    asyncio.run(
        _async_register_dashboard_resource(
            _hass("yaml", resources), CARD_URL
        )
    )

    resources.async_get_info.assert_not_awaited()
    resources.async_create_item.assert_not_awaited()
    resources.async_update_item.assert_not_awaited()
    resources.async_delete_item.assert_not_awaited()
