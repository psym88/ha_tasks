# Repository Instructions

- Write GitHub release notes in English. GitHub Releases are the only changelog; do not add a repository changelog.
- Keep the release version only in `manifest.json`; runtime frontend URLs must derive from it.
- Keep `README.md` user-focused; update it only for installation or usage changes. Document only stable contracts and component boundaries in `ARCHITECTURE.md`, never styling tweaks or release history.
- Add focused tests for recurrence and problem-sensor trigger changes, and for important regressions.
- Put Python tests in `tests/` using Pytest's `test_*.py` convention and frontend tests in `tests/frontend/` as `*.test.mjs`; GitHub Actions discovers them automatically.
- Generate documentation screenshots only through the `Documentation screenshots` workflow. It validates the documented mobile dashboard card and desktop task viewer and editor states in English, in light and dark mode, against the latest stable Home Assistant release. Review and merge its documentation PR only when the visual diff is relevant.
- Use `.agents/skills/develop-home-assistant-integration` for Home Assistant integration work. Re-check version-sensitive behavior against current official documentation, version-matched Home Assistant Core source, and the development container instead of relying on static knowledge.
- Treat persisted Home Assistant store data as user data: every incompatible store-schema change must increment `STORAGE_VERSION`, provide a sequential converter from the immediately preceding version, and add or update versioned migration fixtures and tests. Never remove a published migration path.
- After integration code changes, ensure the `ha-tasks-dev` container mounts this workspace's `custom_components/tasks`, restart it, and verify that Home Assistant and the Tasks integration load successfully.
- Work on `dev` and update it from `origin/dev` before editing. Do not commit feature or fix work directly to `main`.

## Commit convention

Use an English Conventional Commit subject with one of these prefixes:

- `feat:` for a new user-facing capability
- `fix:` for a user-facing bug fix
- `refactor:` for an internal restructuring without intended behavior changes
- `perf:` for a performance improvement
- `docs:` for documentation-only changes
- `test:` for test-only changes
- `build:` for dependencies, packaging, or build tooling
- `ci:` for automation and CI changes
- `chore:` for maintenance that fits no category above
- `revert:` for reverting an earlier commit

Use `!` before the colon for a breaking change, for example `feat!: rename the integration domain`.
Keep the subject imperative, concise, and without a trailing period.

## Version and tag convention

- Use Calendar Versioning in the exact form `YYYYMMDD.REVISION`, for example `20260724.12`.
- `YYYYMMDD` is the UTC publication date without separators. `REVISION` is the release sequence for that date.
- Start each UTC day at revision `1` and increment it for every additional published release on the same date. Never use revision `0`, leading zeroes, or a previously published revision.
- The Git tag must exactly equal the version, without a `v` prefix or any other suffix.
- The GitHub release title must exactly equal the version and tag, for example `20260724.12`. GitHub already displays the publication date separately.
- A latest release is a new publication with the next unused version, tag, and title. Keep preceding pre-releases unchanged.
- Do not add tag suffixes such as `-pre`, `-beta`, or `-rc`. Pre-release state is represented only by GitHub's **pre-release** flag.
- CalVer does not encode compatibility. Mark breaking changes explicitly in the release notes.
- Keep the release version only in `manifest.json`; do not duplicate it in Python or JavaScript.
- Create pre-release tags from the tested `dev` commit that contains the same version. Create latest-release tags from the protected `main` merge commit that contains the same version.
- Never move, overwrite, delete, or reuse a published tag. If a published pre-release is defective, fix the problem and publish a new version.

## Release-note convention

Follow the Keep a Changelog convention in GitHub Release notes. Use only its six English change-type headings, in this exact order, and omit empty sections:

1. `### Added`
2. `### Changed`
3. `### Deprecated`
4. `### Removed`
5. `### Fixed`
6. `### Security`

When a release contains a breaking change, place `### Changed` before every other section so the breaking information appears first. Put all breaking bullets at the top of that section, begin each one with `**Breaking:**`, and state any required user action explicitly and completely.

Use `Fixed`, never `Fixes`, `Bugfixes`, or `Fixed Changes`. Use `Changed`, never `Changes`, `Improvements`, `Updates`, or `Miscellaneous`.
Write concise user-facing bullet points in the past tense. Do not paste commit subjects, merge commits, issue noise, test-only work, or implementation details unless they materially affect users.

Map changes consistently:

- `feat:` → `Added`
- `fix:` → `Fixed`
- user-visible `refactor:` or `perf:` → `Changed`
- deprecations → `Deprecated`
- removals → `Removed`
- security corrections → `Security`
- any commit marked with `!` → `Changed`, with the bullet beginning `**Breaking:**`; place it before all non-breaking release-note content

## Pre-release workflow

1. Update `dev` from `origin/dev`.
2. Choose the next version and update `manifest.json`.
3. Run the complete backend and frontend test suites.
4. Commit and push the tested `dev` state.
5. Run the `Documentation screenshots` workflow on that `dev` commit. If it detects relevant visual changes, review and merge its generated documentation PR, rerun the complete tests on the resulting commit, and repeat the screenshot workflow until it reports no relevant changes.
6. Create the immutable `YYYYMMDD.REVISION` tag on that exact commit.
7. Create a GitHub release titled exactly `YYYYMMDD.REVISION`, mark it as **pre-release**, and ensure it is not **latest**.
8. Describe only the changes since the immediately preceding published tag. Use the standard release-note headings.

## Latest-release workflow

Create a latest release only when explicitly requested.

1. Select the tested pre-release that will be the basis for the stable release. Keep that pre-release, its tag, and its release unchanged.
2. Update `dev` from `origin/dev`, choose the next unused version, and update `manifest.json`.
3. Run the complete backend and frontend test suites, commit the version change, and push `dev`.
4. Open a pull request from `dev` to the protected `main` branch. Wait for the required `Backend`, `Frontend`, and `Validate integration` checks to pass.
5. Merge the pull request with a normal merge commit. Do not squash or rebase it, so `dev` remains an ancestor of `main`.
6. Create the new immutable `YYYYMMDD.REVISION` tag on the resulting `main` merge commit. `main`, the new tag, and the release target must resolve to that same commit.
7. Create a new GitHub release with the same title as the new tag, mark it as **latest**, and do not mark it as a pre-release.
8. Write one consolidated set of release notes covering every pre-release after the previous latest release through the new latest release. If no previous latest release exists, consolidate all pre-release notes in the repository.
9. Preserve the standard heading order, combine related bullets, and remove duplicates. The latest notes must describe the complete user-visible delta since the previous latest release.
10. Fast-forward `dev` to the new `main` merge commit and push it, so both branches start the next development cycle from the same commit.
11. Verify that earlier pre-releases remain marked as pre-releases and that no tag was moved, overwritten, deleted, or reused.
