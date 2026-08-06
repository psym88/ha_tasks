#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p .artifacts/runtime

compose=(docker compose -f compose.test.yaml)

cleanup() {
  "${compose[@]}" logs --no-color runtime > .artifacts/runtime/home-assistant.log 2>&1 || true
  "${compose[@]}" down --volumes --remove-orphans || true
}
trap cleanup EXIT

"${compose[@]}" down --volumes --remove-orphans
"${compose[@]}" up --detach runtime
"${compose[@]}" run --rm e2e
"${compose[@]}" run --rm compare-screenshots
"${compose[@]}" restart runtime
"${compose[@]}" run --rm verify-runtime

"${compose[@]}" logs --no-color runtime > .artifacts/runtime/home-assistant.log
if grep -E "ERROR|Traceback" .artifacts/runtime/home-assistant.log; then
  echo "Relevant Home Assistant runtime errors detected" >&2
  exit 1
fi
