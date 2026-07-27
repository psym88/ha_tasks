"""Dashboard card API and registration guardrail tests."""

import ast
import re
from pathlib import Path


ROOT = Path(__file__).parents[1]


def _decorators(function_name: str) -> set[str]:
    tree = ast.parse((ROOT / "custom_components/tasks/task_api.py").read_text(encoding="utf-8"))
    function = next(node for node in tree.body if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)) and node.name == function_name)
    return {ast.unparse(decorator) for decorator in function.decorator_list}


def test_dashboard_task_commands_allow_authenticated_users():
    for function_name in (
        "ws_subscribe",
        "ws_list",
        "ws_task_update",
        "ws_task_save",
        "ws_task_bulk",
        "ws_task_delete",
        "ws_task_preview_next_due",
        "ws_task_complete",
        "ws_history_list",
        "ws_attachment_urls",
    ):
        assert "websocket_api.require_admin" not in _decorators(function_name)


def test_attachments_and_archives_use_owned_streaming_endpoints():
    http_source=(ROOT / "custom_components/tasks/attachment_api.py").read_text(encoding="utf-8")
    websocket_source=(ROOT / "custom_components/tasks/task_api.py").read_text(encoding="utf-8")
    assert "class UploadView" in http_source
    assert 'UPLOAD_URL = f"/api/{DOMAIN}/upload"' in (
        ROOT / "custom_components/tasks/const.py"
    ).read_text(encoding="utf-8")
    assert "MAX_UPLOAD_SIZE" not in http_source
    assert "raise_if_invalid_filename" in http_source
    assert "record.user_id != user_id" in http_source
    assert "request._client_max_size = 0" in http_source
    assert "upload.read_chunk(ONE_MEGABYTE)" in http_source
    assert "async_consume_uploads" in websocket_source
    assert "process_uploaded_file" not in websocket_source
    assert "FileSelector" not in websocket_source
    assert '"tasks/archive/import"' not in websocket_source
    assert 'result["signed_files"]' not in websocket_source
    assert '"tasks/attachment/urls"' in websocket_source
    for removed in (
        '"tasks/task/create"',
        '"tasks/history/delete"',
        '"tasks/attachment/create"',
        '"tasks/attachment/delete"',
    ):
        assert removed not in websocket_source


def test_only_sidepanel_requires_admin():
    component = ROOT / "custom_components/tasks"
    sources = "\n".join(path.read_text(encoding="utf-8") for path in component.rglob("*.py"))
    assert "websocket_api.require_admin" not in sources
    assert sources.count("require_admin=True") == 1


def test_dashboard_module_is_registered_and_removed_with_config_entry():
    source=(ROOT / "custom_components/tasks/__init__.py").read_text(encoding="utf-8")
    assert "frontend.add_extra_js_url(hass, card_js_url)" in source
    assert "frontend.remove_extra_js_url(hass, card_js_url)" in source


def test_v2_assets_replace_the_legacy_panel_and_card_registrations():
    source = (ROOT / "custom_components/tasks/__init__.py").read_text(
        encoding="utf-8"
    )
    assert 'webcomponent_name="tasks-panel"' in source
    assert 'f"{base_url}/v2/{v2_panel_asset}"' in source
    assert 'f"{base_url}/v2/{v2_card_asset}"' in source
    assert 'f"{base_url}/panel.js"' not in source
    assert 'f"{base_url}/dashboard-card.js"' not in source
    assert "await hass.async_add_executor_job(" in source
    assert "_v2_assets" in source
    assert "V2_PANEL_URL" not in source


def test_nfc_listener_lifecycle_is_bound_to_config_entry():
    source=(ROOT / "custom_components/tasks/__init__.py").read_text(encoding="utf-8")
    assert "entry.async_on_unload(nfc_completion.async_setup_listener(hass, manager))" in source


def test_native_tag_integration_is_loaded_as_a_dependency():
    import json

    manifest = json.loads((ROOT / "custom_components/tasks/manifest.json").read_text(encoding="utf-8"))
    assert "tag" in manifest["dependencies"]
    assert "file_upload" not in manifest["dependencies"]


def test_frontend_and_consolidated_translations_are_registered_as_static_paths():
    source=(ROOT / "custom_components/tasks/__init__.py").read_text(encoding="utf-8")
    assert "StaticPathConfig(frontend_url, str(frontend_dir), False)" in source
    assert 'base_url = f"{FRONTEND_URL}/{version}"' in source
    assert re.search(
        r"StaticPathConfig\(\s*ENGLISH_TRANSLATIONS_URL,\s*"
        r"str\(english_translations\),\s*False",
        source,
    )
    assert re.search(
        r"StaticPathConfig\(\s*TRANSLATIONS_URL,\s*"
        r"str\(translations_dir\),\s*False",
        source,
    )
    component=ROOT / "custom_components/tasks"
    assert set(component.rglob("de.json")) == {
        component / "translations/de.json",
        component / "frontend_translations/de.json",
    }
    assert set(component.rglob("en.json")) == {
        component / "translations/en.json",
        component / "frontend_translations/en.json",
    }
