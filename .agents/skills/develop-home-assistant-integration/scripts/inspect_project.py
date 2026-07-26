#!/usr/bin/env python3
"""Inspect a custom-integration project and optional HA container without writes."""

from __future__ import annotations

import argparse
import json
from pathlib import Path
import shutil
import subprocess
from typing import Any


def run(command: list[str], timeout: int = 10) -> dict[str, Any]:
    """Run a read-only command and return structured output."""
    try:
        result = subprocess.run(
            command,
            capture_output=True,
            check=False,
            text=True,
            timeout=timeout,
        )
    except (OSError, subprocess.TimeoutExpired) as err:
        return {"ok": False, "error": str(err)}

    output: dict[str, Any] = {
        "ok": result.returncode == 0,
        "returncode": result.returncode,
    }
    if result.stdout.strip():
        output["stdout"] = result.stdout.strip()
    if result.stderr.strip():
        output["stderr"] = result.stderr.strip()
    return output


def find_project_root(start: Path) -> Path:
    """Find the nearest parent containing custom_components."""
    current = start.resolve()
    for candidate in (current, *current.parents):
        if (candidate / "custom_components").is_dir():
            return candidate
    raise SystemExit(f"No custom_components directory found above {start}")


def read_json(path: Path) -> Any:
    """Read JSON and expose parse errors without aborting all inspection."""
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except (OSError, json.JSONDecodeError) as err:
        return {"_error": str(err)}


def inspect_container(name: str, integration_paths: list[Path]) -> dict[str, Any]:
    """Read image, state, mounts, and installed Home Assistant version."""
    if shutil.which("docker") is None:
        return {"available": False, "error": "docker executable not found"}

    raw_inspect = run(["docker", "inspect", name])
    if not raw_inspect["ok"]:
        return {"available": True, "inspect": raw_inspect}

    try:
        details = json.loads(raw_inspect.get("stdout", "[]"))[0]
    except (json.JSONDecodeError, IndexError, TypeError) as err:
        return {"available": True, "error": f"invalid docker inspect output: {err}"}

    mounts = [
        {
            "source": mount.get("Source"),
            "destination": mount.get("Destination"),
            "mode": mount.get("Mode"),
            "rw": mount.get("RW"),
        }
        for mount in details.get("Mounts", [])
    ]
    resolved_sources = {
        str(Path(mount["source"]).resolve()).casefold()
        for mount in mounts
        if mount.get("source")
    }
    expected = [str(path.resolve()) for path in integration_paths]

    version = run(
        [
            "docker",
            "exec",
            name,
            "python",
            "-c",
            "from importlib.metadata import version; print(version('homeassistant'))",
        ]
    )

    return {
        "available": True,
        "name": name,
        "image": details.get("Config", {}).get("Image"),
        "state": details.get("State", {}).get("Status"),
        "health": details.get("State", {}).get("Health", {}).get("Status"),
        "home_assistant_version": version,
        "mounts": mounts,
        "expected_integration_paths": expected,
        "workspace_integration_mounted": any(
            path.casefold() in resolved_sources for path in expected
        ),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--root", type=Path, default=Path.cwd())
    parser.add_argument("--container", default="ha-tasks-dev")
    parser.add_argument("--no-docker", action="store_true")
    args = parser.parse_args()

    root = find_project_root(args.root)
    manifests = sorted(root.glob("custom_components/*/manifest.json"))
    integrations = []
    integration_paths = []
    for manifest_path in manifests:
        integration_paths.append(manifest_path.parent)
        integrations.append(
            {
                "path": str(manifest_path.parent),
                "manifest": read_json(manifest_path),
            }
        )

    result: dict[str, Any] = {
        "project_root": str(root),
        "integrations": integrations,
        "hacs": read_json(root / "hacs.json")
        if (root / "hacs.json").is_file()
        else None,
    }
    if not args.no_docker:
        result["container"] = inspect_container(args.container, integration_paths)

    print(json.dumps(result, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
