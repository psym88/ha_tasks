"""Constants for Tasks."""

from homeassistant.helpers.device_registry import DeviceInfo

DOMAIN = "tasks"
PLATFORMS = ["sensor"]
STORAGE_KEY = DOMAIN
STORAGE_VERSION = 4
EVENT_TASKS = f"{DOMAIN}_event"
TASKS_DEVICE_INFO = DeviceInfo(
    identifiers={(DOMAIN, DOMAIN)},
    name="Tasks",
    manufacturer="Tasks",
)
PANEL_URL = "/tasks"
V2_PANEL_URL = "/tasks-v2"
PANEL_TITLE = "Tasks"
FRONTEND_URL = f"/{DOMAIN}_frontend"
TRANSLATIONS_URL = f"/{DOMAIN}_translations"
ENGLISH_TRANSLATIONS_URL = f"/{DOMAIN}_strings.json"
DOWNLOAD_URL = f"/api/{DOMAIN}/download"
ARCHIVE_URL = f"/api/{DOMAIN}/archive"
