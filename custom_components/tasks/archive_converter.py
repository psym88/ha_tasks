"""Upgrade imported Tasks archive manifests to the current format."""

from collections.abc import Callable
from typing import Any

import voluptuous as vol

from .const import DOMAIN

ARCHIVE_FORMAT = 2

_FORMAT_1_SCHEMA = vol.Schema(
    {
        vol.Required("format"): vol.Equal(1),
        vol.Required("data"): dict,
    },
    extra=vol.PREVENT_EXTRA,
)


def _upgrade_1_to_2(manifest: dict[str, Any]) -> dict[str, Any]:
    legacy = _FORMAT_1_SCHEMA(manifest)
    return {
        "integration": DOMAIN,
        "format": 2,
        "data": legacy["data"],
    }


_UPGRADES: dict[int, Callable[[dict[str, Any]], dict[str, Any]]] = {
    1: _upgrade_1_to_2,
}


def upgrade_archive_manifest(manifest: Any) -> dict[str, Any]:
    """Return an archive manifest upgraded to the current format."""
    if not isinstance(manifest, dict) or type(manifest.get("format")) is not int:
        raise ValueError("invalid_archive")

    upgraded = dict(manifest)
    while upgraded["format"] < ARCHIVE_FORMAT:
        converter = _UPGRADES.get(upgraded["format"])
        if converter is None:
            raise ValueError("unsupported_archive_format")
        try:
            upgraded = converter(upgraded)
        except vol.Invalid as err:
            raise ValueError("invalid_archive") from err

    if upgraded["format"] != ARCHIVE_FORMAT:
        raise ValueError("unsupported_archive_format")
    return upgraded
