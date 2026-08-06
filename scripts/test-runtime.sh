#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
rm -rf .artifacts/runtime
mkdir -p .artifacts/runtime

compose=(docker compose -f compose.test.yaml)
export HA_TASKS_CAPTURE_SCREENSHOTS="${HA_TASKS_COMPARE_SCREENSHOTS:-1}"

cleanup() {
  "${compose[@]}" logs --no-color runtime > .artifacts/runtime/home-assistant.log 2>&1 || true
}
trap cleanup EXIT

"${compose[@]}" down --volumes --remove-orphans
"${compose[@]}" up --detach runtime
"${compose[@]}" run --rm e2e
if [[ "$HA_TASKS_CAPTURE_SCREENSHOTS" == "1" ]]; then
  "${compose[@]}" run --rm compare-screenshots
fi
"${compose[@]}" restart runtime
"${compose[@]}" run --rm verify-runtime

"${compose[@]}" logs --no-color runtime > .artifacts/runtime/home-assistant.log
if grep -E "ERROR|Traceback" .artifacts/runtime/home-assistant.log; then
  echo "Relevant Home Assistant runtime errors detected" >&2
  exit 1
fi
