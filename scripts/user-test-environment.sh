#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

compose=(docker compose -f compose.user-test.yaml)
action="${1:-status}"

case "$action" in
  start)
    "${compose[@]}" run --rm prepare
    "${compose[@]}" up --detach runtime
    echo "User test environment: http://127.0.0.1:8122"
    ;;
  stop)
    "${compose[@]}" stop runtime
    docker run --rm --volume "$PWD:/workspace" alpine:3.22 \
      sh -c "mkdir -p /workspace/.artifacts/user-test && chmod -R a+rwX /workspace/.artifacts"
    mkdir -p .artifacts/user-test
    "${compose[@]}" logs --no-color runtime > .artifacts/user-test/home-assistant.log 2>&1 || true
    ;;
  reset)
    "${compose[@]}" down --volumes --remove-orphans
    ;;
  logs)
    "${compose[@]}" logs --no-color runtime
    ;;
  status)
    "${compose[@]}" ps
    ;;
  *)
    echo "Usage: $0 {start|stop|reset|logs|status}" >&2
    exit 2
    ;;
esac
