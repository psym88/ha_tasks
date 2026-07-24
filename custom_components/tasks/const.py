"""Constants for Tasks."""

DOMAIN = "tasks"
PLATFORMS = ["calendar", "sensor", "todo"]
STORAGE_KEY = DOMAIN
STORAGE_VERSION = 1
EVENT_TASKS = f"{DOMAIN}_event"
PANEL_URL = "/tasks"
PANEL_TITLE = "Tasks"
PANEL_VERSION = "20260724.3"
FRONTEND_URL = f"/{DOMAIN}_frontend"
TRANSLATIONS_URL = f"/{DOMAIN}_translations"
PANEL_JS_URL = f"{FRONTEND_URL}/panel.js?v={PANEL_VERSION}"
CARD_JS_URL = f"{FRONTEND_URL}/dashboard-card.js?v={PANEL_VERSION}"
DOWNLOAD_URL = f"/api/{DOMAIN}/download"
ARCHIVE_URL = f"/api/{DOMAIN}/archive"
