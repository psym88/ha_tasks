#!/usr/bin/env bash
set -euo pipefail

cd "$(dirname "$0")/.."

volume=ha-tasks-forgejo-workspace
action="${1:-prepare}"

case "$action" in
  prepare)
    docker volume create "$volume" >/dev/null
    docker run --rm --volume "$volume:/workspace" alpine:3.22 \
      sh -c 'find /workspace -mindepth 1 -maxdepth 1 -exec rm -rf -- {} +'
    tar \
      --exclude=.git \
      --exclude=.artifacts \
      --exclude=node_modules \
      --exclude=.pytest_cache \
      -cf - . \
      | docker run --rm --interactive --volume "$volume:/workspace" alpine:3.22 \
        tar -xf - -C /workspace
    ;;
  export-artifacts)
    export_dir=.artifacts/forgejo-container
    rm -rf "$export_dir"
    mkdir -p "$export_dir"
    docker run --rm --volume "$volume:/workspace:ro" alpine:3.22 \
      sh -c 'if [ -d /workspace/.artifacts ]; then tar -C /workspace/.artifacts -cf - .; fi' \
      | tar -xf - -C "$export_dir"
    ;;
  *)
    echo "Usage: $0 {prepare|export-artifacts}" >&2
    exit 2
    ;;
esac
