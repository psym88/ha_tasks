# Repository Instructions

- Write GitHub release notes in English. GitHub Releases are the only changelog; do not add a repository changelog.
- Keep versions aligned in `manifest.json`, `const.py`, and `frontend/panel.js`.
- Keep `README.md` user-focused; update it only for installation or usage changes. Document only stable contracts and component boundaries in `ARCHITECTURE.md`, never styling tweaks or release history.
- Add focused tests for recurrence changes and important regressions.
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
- Format every GitHub release title as `YYYYMMDD.REVISION - YYYY-MM-DD`, for example `20260724.12 - 2026-07-24`.
- When promoting a pre-release to latest, reuse its existing version and tag. Update only the ISO date in the release title if the promotion occurs on a later UTC date.
- Do not add tag suffixes such as `-pre`, `-beta`, or `-rc`. Pre-release state is represented only by GitHub's **pre-release** flag.
- CalVer does not encode compatibility. Mark breaking changes explicitly in the release notes.
- Keep the version identical in `manifest.json`, `const.py`, and `frontend/panel.js`.
- Create every tag from the tested `dev` commit that contains the same version.
- Never move, overwrite, delete, or reuse a published tag. If a published pre-release is defective, fix the problem and publish a new version.

## Release-note convention

Follow the Keep a Changelog convention in GitHub Release notes. Use only its six English change-type headings, in this exact order, and omit empty sections:

1. `### Added`
2. `### Changed`
3. `### Deprecated`
4. `### Removed`
5. `### Fixed`
6. `### Security`

Use `Fixed`, never `Fixes`, `Bugfixes`, or `Fixed Changes`. Use `Changed`, never `Changes`, `Improvements`, `Updates`, or `Miscellaneous`.
Write concise user-facing bullet points in the past tense. Do not paste commit subjects, merge commits, issue noise, test-only work, or implementation details unless they materially affect users.

Map changes consistently:

- `feat:` → `Added`
- `fix:` → `Fixed`
- user-visible `refactor:` or `perf:` → `Changed`
- deprecations → `Deprecated`
- removals → `Removed`
- security corrections → `Security`
- any commit marked with `!` → `Changed`, with the bullet beginning `**Breaking:**`

## Pre-release workflow

1. Update `dev` from `origin/dev`.
2. Choose the next version and update all version files.
3. Run the complete backend and frontend test suites.
4. Commit and push the tested `dev` state.
5. Create the immutable `YYYYMMDD.REVISION` tag on that exact commit.
6. Create a GitHub release titled `YYYYMMDD.REVISION - YYYY-MM-DD`, mark it as **pre-release**, and ensure it is not **latest**.
7. Describe only the changes since the immediately preceding published tag. Use the standard release-note headings.

## Latest-release workflow

Create a latest release only when explicitly requested.

1. Select the tested pre-release to promote. Do not create a replacement tag.
2. Integrate that exact tagged commit into `main`; `main`, the selected tag, and the release target must resolve to the same commit.
3. Reuse the selected tag and its existing GitHub release. Update the title with the promotion date, clear the **pre-release** flag, and explicitly mark it as **latest**.
4. Replace its incremental notes with one consolidated set of release notes covering every pre-release after the previous latest release, including the promoted pre-release.
5. If no previous latest release exists, consolidate all pre-release notes in the repository.
6. Preserve the standard heading order, combine related bullets, and remove duplicates. The latest notes must describe the complete user-visible delta since the previous latest release, not merely the final pre-release.
7. Verify that earlier pre-releases remain marked as pre-releases and that no tag was moved or recreated.
