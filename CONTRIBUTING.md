# Maintainer development workflow

This guide is for maintainers and collaborators with write access. It describes
the usual path from a local change to a Tasks release. Detailed implementation
and release rules are maintained in `AGENTS.md`.

## Branches

- `dev` contains ongoing development and pre-releases.
- `main` contains the currently promoted latest release.
- Both branches may differ during development.

Feature and fix work starts on `dev`, never directly on `main`.

## Local development

1. Switch to `dev` and update it from `origin/dev`.
2. Start the `ha-tasks-dev` Home Assistant container.
3. Verify that the container mounts this checkout's
   `custom_components/tasks` directory.
4. Describe the requested change to the AI agent.
5. Review the completed change and its test results.
6. Test the affected behavior in the running Home Assistant container.

After integration changes, restart the container and confirm that Home
Assistant and the Tasks integration load successfully.

## Automated tests

The complete local test suite uses Docker so it runs against the declared
minimum Home Assistant version without requiring a local Python or Node.js
toolchain:

```bash
scripts/test-all.sh
```

The checks can also be run separately:

```bash
scripts/test-backend.sh
scripts/test-frontend.sh
scripts/test-runtime.sh
```

`test-backend.sh` runs Ruff, the unit and Home Assistant fixture tests,
branch coverage, and JUnit reporting in the pinned Home Assistant image.
`test-frontend.sh` type-checks, builds, and tests the production frontend in
a Node.js container. `test-runtime.sh` starts a clean Home Assistant instance,
completes onboarding, loads Tasks through its config flow, exercises the
production panel and card, compares all documentation screenshots, restarts
Home Assistant, and verifies persisted tasks, the due sensor, WebSocket access,
frontend resources, and runtime logs. Visual differences fail the test and are
written to `.artifacts/runtime/screenshot-diffs/` for review.

Reports, Home Assistant logs, and generated runtime screenshots are written to
`.artifacts/`. Set `HA_VERSION` to validate another supported Home Assistant
image, for example:

```bash
HA_VERSION=stable scripts/test-backend.sh
HA_VERSION=stable scripts/test-runtime.sh
```

## Interactive user test environment

The runtime and E2E tests use the same persistent Home Assistant container on
host port `8122`. Starting it resets the test data, provisions the account
`alex` with password `alex`, runs the complete runtime validation, and leaves
the container running:

```bash
scripts/user-test-environment.sh start
```

Open `http://localhost:8122` and sign in with username `alex` and password
`alex`. The Tasks integration and deterministic test data are already prepared.
The environment uses the persistent named volume `ha-tasks-user-test-config`.

Inspect or stop the environment with:

```bash
scripts/user-test-environment.sh status
scripts/user-test-environment.sh logs
scripts/user-test-environment.sh stop
```

Stopping retains the named volume. Reset removes only the user-test container,
network, and `ha-tasks-user-test-config` volume:

```bash
scripts/user-test-environment.sh reset
```

Automatic runtime tests reset this same local test container before seeding it.

## Commit and push

Ask the AI agent to create and publish the reviewed change:

```text
commit push
```

The agent creates an English Conventional Commit and pushes it to `dev`.
GitHub Actions then runs the complete test suites and Hassfest validation.

If a check fails, correct the issue on `dev`, test it again, and push a new
commit.

## Pre-release

When `dev` is ready:

```text
Create a new pre-release.
```

The release process:

1. Chooses the next CalVer and updates only `manifest.json`.
2. Runs the complete backend and frontend tests.
3. Validates the integration in the Home Assistant container.
4. Pushes the tested version to `dev`.
5. Waits for Tests and Hassfest in GitHub Actions.
6. Runs the documentation screenshot workflow and accepts only relevant image
   changes.
7. Creates the immutable version tag and the matching GitHub pre-release.
8. Waits for the Release asset workflow and verifies that `ha_tasks.zip` is
   attached before considering the pre-release complete.

Test the pre-release in a representative Home Assistant installation. Problems
are fixed in a new pre-release; published tags are never moved.

## Latest release

Promote a tested pre-release by naming its version:

```text
Promote YYYYMMDD.REVISION to latest.
```

The tested pre-release is used as the basis for a new version on `dev`. After
the complete tests pass, `dev` is merged into `main` with a normal merge commit.
A new immutable version tag and matching latest GitHub release are created from
that merge commit with consolidated release notes. The preceding pre-release,
its tag, and its release remain unchanged.

At publication, `main`, the new tag, and the latest release must point to the
same tested merge commit. Wait for the Release asset workflow and verify that
`ha_tasks.zip` is attached before considering the latest release complete.
Then fast-forward `dev` to `main` before continuing development.
