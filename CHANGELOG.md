# Changelog — Studio Empire

All notable changes to this project will be documented in this file.

This changelog is optimized for:
- a non-developer owner
- AI-driven development (Codex)
- strict MVP scoping

---

## [Unreleased]
### Added
- What: Added a full story events catalog covering Act 1 MVP beats and Act 2/3 placeholders.
- Why: Define narrative triggers and text consistently across MVP and Vision planning.
- Files touched: docs/DATA_STORY_EVENTS.md, CHANGELOG.md.
- What: Added MVP performer catalog documentation with core and freelance roster entries.
- Why: Define the starting performer lineup for consistent MVP setup.
- Files touched: docs/DATA_PERFORMERS.md, CHANGELOG.md.
- What: Added a new theme catalog doc covering MVP and Vision placeholders with config mapping.
- Why: Define theme IDs, descriptions, and modifiers for booking/content planning without new systems.
- Files touched: docs/DATA_THEMES.md, CHANGELOG.md.
- What: Added a full location catalog document covering MVP and Vision tiers.
- Why: Provide a config-ready reference for all planned location data.
- Files touched: docs/DATA_LOCATIONS.md, CHANGELOG.md.
- What: Added an MVP formulas document defining the exact calculations for core gameplay results.
- Why: Prevent formula guessing by codifying the MVP math in one place.
- Files touched: docs/MVP/MVP_FORMULAS.md, CHANGELOG.md.
- What: Added a UI copy reference covering screen titles, labels, and messages.
- Why: Keep MVP copy consistent across the game UI.
- Files touched: docs/DATA_UI_COPY.md, CHANGELOG.md.

### Changed
- What: Added fatigue tuning values to the config for shoot cost and recovery math.
- Why: Keep fatigue calculations fully config-driven and explicit for MVP.
- Files touched: config.toml, CHANGELOG.md.
- What: Clarified MVP day advancement rules and referenced them in the build order.
- Why: Remove ambiguity around when days advance and how fatigue recovery aligns with day boundaries.
- Files touched: docs/MVP/MVP_OVERVIEW.md, docs/MVP/MVP_BUILD_ORDER.md, CHANGELOG.md.

### Fixed
- N/A (no changes this run)

---

## [0.1.2] - 2026-01-19
### Changed
- What: Added mandatory changelog discipline rules to the agent contract.
- Why: Enforce required changelog updates for every file change.
- Files touched: AGENTS.md, CHANGELOG.md.

---

## [0.1.1] - 2026-01-19
### Added
- `CHANGELOG.md` created to track progress in a consistent, non-developer-friendly format.

### Changed
- N/A (documentation-only update)

### Fixed
- N/A (documentation-only update)

### Testing Notes
Manual checks:
1) Open `CHANGELOG.md` and confirm the newest entry includes today's date.
2) Confirm the entry includes a "Testing Notes" section with clear manual checks.
3) Confirm the entry includes an "AI Notes" section with scope-control notes.

### AI Notes (Scope Control)
- No gameplay code was created or modified.
- No UI screens were implemented.
- No features beyond the documented MVP scope were added.

---

## [0.1.0] - 2026-01-18
### Added
- Repository documentation structure established.
- `docs/CURRENT_SCOPE.md` created (authoritative current scope).
- `docs/README.md` created (documentation routing/index).
- `AGENTS.md` created (AI build rules + constraints).
- `config.toml` created (config-driven values; no magic numbers).
- `CHANGELOG.md` created (this file).

### Changed
- N/A (initial setup)

### Fixed
- N/A (initial setup)

### Testing Notes
Manual checks:
1) Confirm these files exist in the repo root:
   - `AGENTS.md`
   - `config.toml`
   - `CHANGELOG.md`
2) Confirm these files exist under `/docs`:
   - `docs/README.md`
   - `docs/CURRENT_SCOPE.md`
3) Open each file and confirm content is readable Markdown.

### AI Notes (Scope Control)
- No gameplay code was created here.
- No UI screens were implemented here.
- No features beyond documented scope were added.
