#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

if [[ "${1:-}" != "--inside-container" ]]; then
  compose=(docker compose -f compose.test.yaml)
  if [[ "${HA_TASKS_FORGEJO_CI:-}" == "1" ]]; then
    compose+=(-f compose.forgejo.yaml)
  fi
  exec "${compose[@]}" run --rm backend
fi

mkdir -p .artifacts/test-results
python -m ruff check custom_components/tasks tests
if [[ -d tests/integration ]]; then
  python -m ruff format --check tests/integration tests/conftest.py
fi
python -m pytest \
  --cov=custom_components.tasks \
  --cov-report=term-missing \
  --cov-report=xml:.artifacts/test-results/coverage.xml \
  --junitxml=.artifacts/test-results/backend.xml
