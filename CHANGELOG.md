# Changelog — Studio Empire

All notable changes to this project will be documented in this file.

This changelog is optimized for:
- a non-developer owner
- AI-driven development (Codex)
- strict MVP scoping

---

## [Unreleased]
### Added
- What: Added the MVP scaffold files for the single-page shell, UI placeholders, and system stubs.
- Why: Establish the required file structure and runnable shell before implementing gameplay.
- Files touched: index.html, styles.css, src/main.js, src/state.js, src/save.js, src/utils/dom.js, src/utils/format.js, src/utils/rng.js, src/systems/economy.js, src/systems/performers.js, src/systems/booking.js, src/systems/social.js, src/systems/progression.js, src/systems/story.js, src/ui/components.js, src/ui/router.js, src/ui/render.js, src/ui/events.js, CHANGELOG.md.
- What: Added the required assets folder structure for MVP scaffolding.
- Why: Ensure the repo layout matches the MVP file structure requirements before implementation.
- Files touched: assets/images/ui/.gitkeep, assets/images/backgrounds/.gitkeep, assets/images/placeholders/.gitkeep, CHANGELOG.md.
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
- What: Clarified Tier 1 unlocks as a single purchase and aligned location data notes with config.
- Why: Remove ambiguity about how Tier 1 location unlocking works in MVP.
- Files touched: docs/DATA_LOCATIONS.md, config.toml, CHANGELOG.md.
- What: Aligned MVP UI copy entries with the UI blueprint and removed non-MVP labels.
- Why: Ensure Codex uses only MVP-approved button text and actions.
- Files touched: docs/DATA_UI_COPY.md, CHANGELOG.md.
- What: Standardized save versioning authority on `gameState.version` across Act 2/Act 3 docs.
- Why: Prevent conflicting migration guidance in future phases.
- Files touched: docs/VISION/ACT3_STATE_EXTENSIONS.md, CHANGELOG.md.
- What: Updated README structure notes to reflect existing MVP file layout.
- Why: Keep onboarding documentation accurate for non-developers.
- Files touched: README.md, CHANGELOG.md.
- What: Trimmed src/config.js to MVP-only values to mirror the updated config.toml.
- Why: Keep runtime configuration aligned with MVP scope until Act 2/3 unlocks.
- Files touched: src/config.js, CHANGELOG.md.
- What: Reset config.toml to MVP-only values and set config_version to 1.
- Why: Keep configuration aligned with the agreed MVP-first scope before Act 2/3 unlocks.
- Files touched: config.toml, CHANGELOG.md.
- What: Finalized Act 2/Act 3 scopes, systems, state extensions, UI blueprints, and endgame loop specifics.
- Why: Provide complete, non-ambiguous full-game planning for Codex implementation.
- Files touched: docs/VISION/ACT2_SCOPE.md, docs/VISION/ACT2_SYSTEMS.md, docs/VISION/ACT2_STATE_EXTENSIONS.md, docs/VISION/ACT2_UI_BLUEPRINT.md, docs/VISION/ACT3_SCOPE.md, docs/VISION/ACT3_SYSTEMS.md, docs/VISION/ACT3_STATE_EXTENSIONS.md, docs/VISION/ACT3_UI_BLUEPRINT.md, docs/VISION/ACT3_ENDGAME_LOOPS.md, docs/VISION/VISION_OVERVIEW.md, docs/MASTER_IMPLEMENTATION_PLAN.md, CHANGELOG.md.
- What: Replaced Act 2/Act 3 placeholder catalogs and UI copy with concrete data, schedules, and labels.
- Why: Ensure full-game data tables and copy are ready without guesswork.
- Files touched: docs/DATA_PERFORMERS.md, docs/DATA_THEMES.md, docs/DATA_LOCATIONS.md, docs/DATA_STORY_EVENTS.md, docs/DATA_UI_COPY.md, CHANGELOG.md.
- What: Added Act 3 balancing config guidance and extended configuration sources to include Act 2/Act 3 tunables.
- Why: Make future implementation config-driven and aligned with finalized Vision specs.
- Files touched: docs/VISION/ACT3_BALANCING_CONFIG.md, docs/README.md, config.toml, src/config.js, CHANGELOG.md.
- What: Aligned repo layout references to `/src` and `/styles.css` across docs and the agent rules.
- Why: Match the confirmed Option B file structure and prevent future path confusion.
- Files touched: AGENTS.md, docs/MASTER_IMPLEMENTATION_PLAN.md, docs/MVP/MVP_FILE_STRUCTURE.md, docs/MVP/MVP_TECH_GUARDRAILS.md, docs/README.md, README.md, docs/VISION/ACT2_BALANCING_CONFIG.md, docs/VISION/ACT2_SCOPE.md, docs/VISION/ACT2_SYSTEMS.md, docs/VISION/ACT2_UI_BLUEPRINT.md, docs/VISION/ACT3_SCOPE.md, docs/VISION/ACT3_SYSTEMS.md, docs/VISION/ACT3_UI_BLUEPRINT.md, docs/MVP/MVP_UI_BLUEPRINT.md, CHANGELOG.md.
- What: Corrected MVP build order and state references and removed out-of-scope UI copy entries.
- Why: Keep MVP guidance consistent with the authoritative state model and UI blueprint.
- Files touched: docs/MVP/MVP_BUILD_ORDER.md, docs/MVP/MVP_STATE_MODEL.md, docs/DATA_UI_COPY.md, CHANGELOG.md.
- What: Updated build config paths and relocated the runtime config to the /src directory.
- Why: Ensure config and file layout match the agreed Option B structure.
- Files touched: config.toml, src/config.js, CHANGELOG.md.
- What: Declared config.toml as the single source of truth for MVP numeric values and added a balancing note for intentional placeholders.
- Why: Remove ambiguity about where tuning values live while keeping data tables in sync.
- Files touched: docs/MVP/MVP_FORMULAS.md, docs/MVP/MVP_TEST_SCENARIOS.md, CHANGELOG.md.
- What: Added performer, location, and theme catalog values to config.toml to match MVP data tables.
- Why: Centralize all MVP numeric values in the config source of truth.
- Files touched: config.toml, CHANGELOG.md.
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
- What: Trimmed src/config.js to MVP-only values to mirror the updated config.toml.
- Why: Keep runtime configuration aligned with MVP scope until Act 2/3 unlocks.
- Files touched: src/config.js, CHANGELOG.md.
- What: Reset config.toml to MVP-only values and set config_version to 1.
- Why: Keep configuration aligned with the agreed MVP-first scope before Act 2/3 unlocks.
- Files touched: config.toml, CHANGELOG.md.
- What: Added mandatory changelog discipline rules to the agent contract.
- Why: Enforce required changelog updates for every file change.
- Files touched: AGENTS.md, CHANGELOG.md.

---

## [0.1.1] - 2026-01-19
### Added
- What: Added the MVP scaffold files for the single-page shell, UI placeholders, and system stubs.
- Why: Establish the required file structure and runnable shell before implementing gameplay.
- Files touched: index.html, styles.css, src/main.js, src/state.js, src/save.js, src/utils/dom.js, src/utils/format.js, src/utils/rng.js, src/systems/economy.js, src/systems/performers.js, src/systems/booking.js, src/systems/social.js, src/systems/progression.js, src/systems/story.js, src/ui/components.js, src/ui/router.js, src/ui/render.js, src/ui/events.js, CHANGELOG.md.
- What: Added the required assets folder structure for MVP scaffolding.
- Why: Ensure the repo layout matches the MVP file structure requirements before implementation.
- Files touched: assets/images/ui/.gitkeep, assets/images/backgrounds/.gitkeep, assets/images/placeholders/.gitkeep, CHANGELOG.md.
- `CHANGELOG.md` created to track progress in a consistent, non-developer-friendly format.

### Changed
- What: Trimmed src/config.js to MVP-only values to mirror the updated config.toml.
- Why: Keep runtime configuration aligned with MVP scope until Act 2/3 unlocks.
- Files touched: src/config.js, CHANGELOG.md.
- What: Reset config.toml to MVP-only values and set config_version to 1.
- Why: Keep configuration aligned with the agreed MVP-first scope before Act 2/3 unlocks.
- Files touched: config.toml, CHANGELOG.md.
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
- What: Added the MVP scaffold files for the single-page shell, UI placeholders, and system stubs.
- Why: Establish the required file structure and runnable shell before implementing gameplay.
- Files touched: index.html, styles.css, src/main.js, src/state.js, src/save.js, src/utils/dom.js, src/utils/format.js, src/utils/rng.js, src/systems/economy.js, src/systems/performers.js, src/systems/booking.js, src/systems/social.js, src/systems/progression.js, src/systems/story.js, src/ui/components.js, src/ui/router.js, src/ui/render.js, src/ui/events.js, CHANGELOG.md.
- What: Added the required assets folder structure for MVP scaffolding.
- Why: Ensure the repo layout matches the MVP file structure requirements before implementation.
- Files touched: assets/images/ui/.gitkeep, assets/images/backgrounds/.gitkeep, assets/images/placeholders/.gitkeep, CHANGELOG.md.
- Repository documentation structure established.
- `docs/CURRENT_SCOPE.md` created (authoritative current scope).
- `docs/README.md` created (documentation routing/index).
- `AGENTS.md` created (AI build rules + constraints).
- `config.toml` created (config-driven values; no magic numbers).
- `CHANGELOG.md` created (this file).

### Changed
- What: Trimmed src/config.js to MVP-only values to mirror the updated config.toml.
- Why: Keep runtime configuration aligned with MVP scope until Act 2/3 unlocks.
- Files touched: src/config.js, CHANGELOG.md.
- What: Reset config.toml to MVP-only values and set config_version to 1.
- Why: Keep configuration aligned with the agreed MVP-first scope before Act 2/3 unlocks.
- Files touched: config.toml, CHANGELOG.md.
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
