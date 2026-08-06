#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."
mkdir -p .artifacts/runtime

compose=(docker compose -f compose.test.yaml)
if [[ "${HA_TASKS_FORGEJO_CI:-}" == "1" ]]; then
  compose+=(-f compose.forgejo.yaml)
fi

cleanup() {
  "${compose[@]}" logs --no-color runtime > .artifacts/runtime/home-assistant.log 2>&1 || true
  "${compose[@]}" down --volumes --remove-orphans || true
}
trap cleanup EXIT

"${compose[@]}" down --volumes --remove-orphans
if [[ "${HA_TASKS_FORGEJO_CI:-}" == "1" ]]; then
  docker volume create ha-tasks-tests-runtime-config >/dev/null
  docker run --rm \
    --volume ha-tasks-forgejo-workspace:/workspace:ro \
    --volume ha-tasks-tests-runtime-config:/config \
    alpine:3.22 \
    sh -ec 'cp /workspace/tests/runtime/configuration.yaml /config/configuration.yaml && mkdir -p /config/custom_components && cp -R /workspace/custom_components/tasks /config/custom_components/tasks'
fi
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
