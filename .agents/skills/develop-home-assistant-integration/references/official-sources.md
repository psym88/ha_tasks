# Official source routing

Use these as live entry points. Re-open them when needed; do not treat a prior reading or this file as an API snapshot.

## Home Assistant

- Developer documentation: <https://developers.home-assistant.io/>
- Creating an integration: <https://developers.home-assistant.io/docs/creating_component_index/>
- Integration file structure: <https://developers.home-assistant.io/docs/creating_integration_file_structure/>
- Integration Quality Scale and rule examples: <https://developers.home-assistant.io/docs/core/integration-quality-scale/>
- Development checklist: <https://developers.home-assistant.io/docs/development_checklist/>
- Developer blog and breaking-change announcements: <https://developers.home-assistant.io/blog/>
- Home Assistant Core source and tests: <https://github.com/home-assistant/core>
- Home Assistant release notes: <https://www.home-assistant.io/blog/categories/release-notes/>
- Official actions, including Hassfest: <https://github.com/home-assistant/actions>

## HACS

- HACS documentation: <https://www.hacs.xyz/docs/>
- HACS integration publishing requirements: <https://www.hacs.xyz/docs/publish/integration/>
- HACS source: <https://github.com/hacs/integration>

HACS is a separate community project. Call a requirement “HACS conformant” only after checking its current official publishing rules.

## Version resolution

Use this order:

1. Read the running validation version from the development container or installed package.
2. Read any declared minimum Home Assistant version from project metadata.
3. Resolve Core source using an immutable release tag matching the version, for example `2026.7.3`, rather than relying only on `dev`.
4. Inspect the implementation and its Core tests together.
5. For a supported range, check the oldest supported API contract and the current validation version.
6. Record the tag or commit used when it materially affects the implementation.

Use current documentation for current guidance, but do not infer that current examples work unchanged on older supported releases.

## Topic routing

- Lifecycle, config entries, services/actions, registries: developer docs plus matching Core helpers and tests.
- Store format and migrations: matching `homeassistant.helpers.storage` implementation and Core tests.
- Datetime, timezone, recurrence, DST: matching `homeassistant.util.dt` implementation and tests.
- HTTP/static resources, panels, cards, frontend caching: backend HTTP/frontend registration code, official frontend source, and a real browser check.
- Manifest and translations: current developer docs and Hassfest.
- HACS repository layout and metadata: current HACS publishing documentation.

Search narrowly within official repositories. Community examples can reveal questions to investigate, but cannot establish the contract.
