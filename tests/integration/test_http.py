"""HTTP boundary tests through Home Assistant's test server."""

from homeassistant.setup import async_setup_component

from custom_components.tasks import attachment_api
from custom_components.tasks.const import ARCHIVE_URL, UPLOAD_URL


async def test_attachment_endpoints_require_authentication(
    hass,
    hass_client_no_auth,
) -> None:
    """Anonymous clients cannot access owned Tasks file endpoints."""
    assert await async_setup_component(hass, "http", {})
    attachment_api.async_register_views(hass)
    client = await hass_client_no_auth()

    upload = await client.post(UPLOAD_URL)
    archive = await client.get(ARCHIVE_URL)

    assert upload.status == 401
    assert archive.status == 401
