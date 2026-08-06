#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p .artifacts/runtime

cleanup() {
  docker compose -f compose.test.yaml logs --no-color runtime > .artifacts/runtime/home-assistant.log 2>&1 || true
  docker compose -f compose.test.yaml down --volumes --remove-orphans || true
}
trap cleanup EXIT

docker compose -f compose.test.yaml down --volumes --remove-orphans
docker compose -f compose.test.yaml up --detach runtime
docker compose -f compose.test.yaml run --rm e2e
docker compose -f compose.test.yaml run --rm compare-screenshots
docker compose -f compose.test.yaml restart runtime
docker compose -f compose.test.yaml run --rm verify-runtime

docker compose -f compose.test.yaml logs --no-color runtime > .artifacts/runtime/home-assistant.log
if grep -E "ERROR|Traceback" .artifacts/runtime/home-assistant.log; then
  echo "Relevant Home Assistant runtime errors detected" >&2
  exit 1
fi
