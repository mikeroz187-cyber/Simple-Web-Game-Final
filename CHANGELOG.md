# Changelog — Studio Empire

All notable changes to this project will be documented in this file.

This changelog is optimized for:
- a non-developer owner
- AI-driven development (Codex)
- strict MVP scoping

---

## [Unreleased]
### Added
- What: Added js/config.js with a global CONFIG that mirrors config.toml and includes MVP data catalogs.
- Why: Provide a single config source for gameplay formulas and data lookup in the vanilla JS runtime.
- Files touched: js/config.js, CHANGELOG.md.
- What: Added MVP test scenarios document with manual verification cases for core gameplay loops.
- Why: Provide clear, config-driven checks for validating MVP behavior without guessing.
- Files touched: docs/MVP/MVP_TEST_SCENARIOS.md, CHANGELOG.md.
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
- What: Rephrased CURRENT_SCOPE language to reflect planned MVP scope and removed implementation claims.
- Why: Keep scope documentation neutral about implementation status and point progress elsewhere.
- What: Updated MVP file structure docs to list current Vision files as read-only inspiration.
- Why: Keep MVP documentation aligned with the actual Vision directory contents and scope status.
- Files touched: docs/MVP/MVP_FILE_STRUCTURE.md, CHANGELOG.md.
- What: Aligned repo layout references to the /js + /css/style.css structure.
- Why: Resolve documentation and config conflicts about the authoritative project layout.
- Files touched: AGENTS.md, config.toml, docs/MASTER_IMPLEMENTATION_PLAN.md, docs/MVP/MVP_FILE_STRUCTURE.md, CHANGELOG.md.
- What: Noted that repo layout authority lives in CURRENT_SCOPE.
- Why: Prevent future drift across MVP documents.
- Files touched: docs/CURRENT_SCOPE.md, CHANGELOG.md.
- What: Clarified that MVP build order details live in the MVP build order document and the master plan is high-level.
- Why: Make the build order document hierarchy explicit for MVP execution guidance.
- Files touched: docs/MASTER_IMPLEMENTATION_PLAN.md, CHANGELOG.md.
- What: Updated documentation index to reference the Act 2/Act 3 Vision files now present in docs/VISION.
- Why: Keep the docs index aligned with the actual Vision planning source of truth.
- Files touched: docs/README.md, CHANGELOG.md.
- What: Adjusted the root README to point to the Vision docs in docs/VISION instead of the legacy numbered list.
- Why: Ensure contributors can find the correct full-game planning documents.
- Files touched: README.md, CHANGELOG.md.
- What: Added Act 1 story trigger days to config.toml and mirrored them in js/config.js.
- Why: Keep story event timing fully config-driven and consistent across sources.
- Files touched: config.toml, js/config.js, CHANGELOG.md.
- What: Added fatigue tuning values to the config for shoot cost and recovery math.
- Why: Keep fatigue calculations fully config-driven and explicit for MVP.
- Files touched: config.toml, CHANGELOG.md.
- What: Resolved MVP TODO placeholders with config.js references for location and theme IDs.
- Why: Point documentation to the now-existing config source of truth.
- Files touched: docs/MVP/MVP_STATE_MODEL.md, docs/MVP/MVP_UI_BLUEPRINT.md, CHANGELOG.md.
- What: Clarified MVP day advancement rules and referenced them in the build order.
- Why: Remove ambiguity around when days advance and how fatigue recovery aligns with day boundaries.
- Files touched: docs/MVP/MVP_OVERVIEW.md, docs/MVP/MVP_BUILD_ORDER.md, CHANGELOG.md.
- What: Updated documentation references to the current MVP and Vision doc sets.
- Why: Align scope guidance with the actual files present in docs/SCOPE_MVP.md and docs/MVP/.
- Files touched: docs/CURRENT_SCOPE.md, docs/README.md, README.md, CHANGELOG.md.

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
