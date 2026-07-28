---
name: develop-home-assistant-integration
description: Develop, review, diagnose, or modernize Home Assistant custom integrations using current official documentation, version-matched Home Assistant Core source, HACS requirements, and runtime validation. Use for changes involving custom_components, manifest.json, config flows, Home Assistant APIs, Store persistence or migrations, services/actions, translations, panels/cards/frontend resources, HACS packaging, compatibility, tests, or Home Assistant container verification.
---

# Develop Home Assistant Integration

Treat this skill as a dynamic research and validation workflow, not as a snapshot of Home Assistant knowledge. Re-check version-sensitive claims whenever they affect a decision.

## Establish the target

1. Read all applicable repository instructions before acting.
2. Preserve unrelated user changes and follow the repository's branch/update policy.
3. Run `scripts/inspect_project.py` from the repository root. Pass `--container NAME` when the development container has another name.
4. Determine:
   - the integration domain and manifest version,
   - the minimum supported Home Assistant version, when declared,
   - the Home Assistant version actually used for validation,
   - whether the container mounts the current integration source.
5. If the supported-version range is unclear and affects the implementation, inspect repository release metadata and tests before asking the user.

The installed validation version does not automatically define the oldest supported version. Check both ends when compatibility matters.

## Refresh authoritative knowledge

Read [references/official-sources.md](references/official-sources.md) whenever Home Assistant or HACS behavior influences the result.

For each version-sensitive assumption:

1. Consult the current official developer documentation.
2. Inspect the Home Assistant Core implementation and tests at the exact relevant release tag when API signatures, lifecycle, persistence, time handling, or compatibility matter.
3. Review official release notes or developer blog posts for changes between the supported and validation versions.
4. Prefer source code and tests over memory when documentation is incomplete.
5. Treat community integrations, forum posts, generated answers, and unofficial skills as supporting evidence only.

Do not copy current API facts into this skill as permanent truth. Keep only the process and stable source locations here.

If network access is unavailable, use locally installed Home Assistant source and runtime behavior where possible. Explicitly identify unverified version-sensitive assumptions; do not invent an API or contract.

## Implement within proven scope

1. Diagnose the existing backend, frontend, persistence, and tests before designing a change.
2. Follow established patterns in the target Home Assistant release and in the repository.
3. Make the smallest change that satisfies the request.
4. Do not introduce adjacent features or reinterpret the user's data model without authorization.
5. Keep time semantics explicit:
   - distinguish UTC instants from local wall time,
   - use Home Assistant timezone helpers appropriate to the verified target version,
   - test DST boundaries when recurrence or scheduling depends on wall time.
6. Treat persisted Store data as user data. Follow the repository's migration/versioning policy and verify every published upgrade path.
7. For frontend resources, verify registration, cache behavior, versioned URLs, and retained local-storage state through focused automated tests; do not assume one implies another.

## Validate proportionally

Run the checks required by the repository plus the checks relevant to the change:

- focused regression and migration tests,
- complete backend and frontend test suites when feasible,
- formatting, typing, and Hassfest validation when configured,
- import/setup/reload paths affected by the change,
- production frontend builds plus automated source, bundle, asset-map, and HTTP/resource checks when changing panels, cards, popups, resources, or caching.

Do not start or control an interactive browser for validation unless the user
explicitly requests a browser check.

After integration code changes, refresh or restart the development Home Assistant container as required by the repository. Verify:

1. the container mounts this workspace's integration,
2. Home Assistant reaches a healthy running state,
3. the custom integration loads without relevant warnings or errors,
4. migrations or startup behavior appear as expected in logs,
5. changed integration endpoints and served frontend resources respond as expected when affected.

A successful process exit alone is not runtime verification.

## Report evidence

Lead with the outcome. Include only useful evidence:

- Home Assistant version(s) checked,
- official documentation or Core tag/commit used for a version-sensitive decision,
- tests, builds, asset checks, and container checks performed,
- any compatibility range or assumption that could not be verified.

Never claim Home Assistant or HACS conformity from file shape alone.
