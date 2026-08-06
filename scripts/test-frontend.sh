#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ "${1:-}" != "--inside-container" ]]; then
  exec docker compose -f compose.test.yaml run --rm frontend
fi

pnpm install --frozen-lockfile
pnpm typecheck:frontend
pnpm build:frontend
pnpm test:frontend
