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

Test the pre-release in a representative Home Assistant installation. Problems
are fixed in a new pre-release; published tags are never moved.

## Latest release

Promote a tested pre-release by naming its version:

```text
Promote YYYYMMDD.REVISION to latest.
```

The existing tagged commit is integrated into `main`. The same GitHub release
is changed from pre-release to latest and receives consolidated release notes.
No replacement version or tag is created.

At promotion, `main`, the selected tag, and the release must point to the same
tested commit. Development can then continue on `dev`.
