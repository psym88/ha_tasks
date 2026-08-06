#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ "${1:-}" != "--inside-container" ]]; then
  compose=(docker compose -f compose.test.yaml)
  if [[ "${HA_TASKS_FORGEJO_CI:-}" == "1" ]]; then
    compose+=(-f compose.forgejo.yaml)
  fi
  exec "${compose[@]}" run --rm frontend
fi

pnpm install --frozen-lockfile
pnpm typecheck:frontend
pnpm build:frontend
pnpm test:frontend
