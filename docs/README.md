# Project Documentation

This folder contains all planning and design documentation for **Studio Empire**, including the frozen MVP reference docs, post-MVP scope guidance, and the long-term design vision.

## Documentation Authority
- **Current scope is governed by `CURRENT_SCOPE.md`.** MVP is complete and frozen; MVP docs are historical references for the baseline implementation.
- Primary MVP docs (historical reference):
  - **CURRENT_SCOPE.md** – Single source of truth for current scope/features.
  - **SCOPE_MVP.md** – Frozen MVP feature set and boundaries (historical reference).
  - **MVP/MVP_TECH_GUARDRAILS.md** – Technical rules and limitations for the MVP baseline.
  - **MVP/MVP_FILE_STRUCTURE.md** – Expected project structure and file organization for the MVP baseline.
  - **MVP/MVP_BUILD_ORDER.md** – Original MVP implementation order (historical).
  - **MVP/MVP_UI_BLUEPRINT.md** – UI components and layout guidelines for the MVP interface.
  - **MVP/MVP_STATE_MODEL.md** – Authoritative definition of game state and flow for the MVP baseline.
- If something is described in older vision docs but not in `CURRENT_SCOPE.md`, treat it as **out of scope** for now.

## Documentation Index

**MVP / Implementation Docs (Historical Reference):**
- **CURRENT_SCOPE.md** – **(Current)** Authoritative current scope document (what features are in/out for the current phase).
- **SCOPE_MVP.md** – **(MVP, Historical)** Detailed MVP scope and early access plan, listing features included in MVP and which are deferred.
- **MVP/MVP_TECH_GUARDRAILS.md** – **(MVP, Historical)** Technical rules and restrictions for coding the MVP (tech stack, data rules, UI rules, etc).
- **MVP/MVP_FILE_STRUCTURE.md** – **(MVP, Historical)** Expected file/folder structure for the MVP source code.
- **MVP/MVP_BUILD_ORDER.md** – **(MVP, Historical)** Suggested sequence of development steps/milestones to build the MVP.
- **MVP/MVP_UI_BLUEPRINT.md** – **(MVP, Historical)** Blueprint for the MVP user interface (layout patterns, common UI components, style guide).
- **MVP/MVP_STATE_MODEL.md** – **(MVP, Historical)** Definition of the MVP game state structure and game flow logic.
- **MVP/MVP_OVERVIEW.md** – **(MVP, Historical)** Narrative overview of the MVP loop and player goals.
- **MVP/MVP_FORMULAS.md** – **(MVP, Historical)** Formula reference for economics, followers, and conversions.
- **MVP/MVP_TEST_SCENARIOS.md** – **(MVP, Historical)** Manual testing scenarios for validating MVP features.

**Vision / Future Docs:**
- **VISION/VISION_OVERVIEW.md** – **(Vision)** High-level overview of long-term plans beyond the MVP.
- **VISION/ACT2_SCOPE.md** – **(Vision)** Act 2 scope and narrative expansion plan.
- **VISION/ACT2_SYSTEMS.md** – **(Vision)** Act 2 systems and mechanics beyond the MVP.
- **VISION/ACT2_STATE_EXTENSIONS.md** – **(Vision)** State model extensions for Act 2.
- **VISION/ACT2_UI_BLUEPRINT.md** – **(Vision)** UI layout concepts for Act 2.
- **VISION/ACT2_BALANCING_CONFIG.md** – **(Vision)** Balancing notes and config guidance for Act 2.
- **VISION/ACT3_SCOPE.md** – **(Vision)** Act 3 scope and narrative expansion plan.
- **VISION/ACT3_SYSTEMS.md** – **(Vision)** Act 3 systems and mechanics beyond the MVP.
- **VISION/ACT3_STATE_EXTENSIONS.md** – **(Vision)** State model extensions for Act 3.
- **VISION/ACT3_UI_BLUEPRINT.md** – **(Vision)** UI layout concepts for Act 3.
- **VISION/ACT3_ENDGAME_LOOPS.md** – **(Vision)** Endgame loop concepts for Act 3.
- **VISION/ACT3_BALANCING_CONFIG.md** – **(Vision)** Act 3 balancing notes and config guidance.

**Data Catalogs (Config Mirrors):**
- **DATA_PERFORMERS.md** – Performer roster catalog (MVP + Vision placeholders).
- **DATA_LOCATIONS.md** – Location catalog (MVP + Vision placeholders).
- **DATA_THEMES.md** – Theme catalog (MVP + Vision placeholders).
- **DATA_STORY_EVENTS.md** – Story event catalog (MVP + Vision placeholders).
- **DATA_UI_COPY.md** – UI copy reference (MVP + Act 2/3 labels).
- **DATA_EQUIPMENT.md** – Act 2 equipment catalog.
- **DATA_MILESTONES.md** – Act 2 milestone catalog.
- **DATA_SOCIAL_STRATEGIES.md** – Act 2 social strategy catalog.
- **DATA_RIVALS.md** – Act 3 rival studio catalog.
- **DATA_MARKET_SHIFTS.md** – Act 3 market shift catalog.
- **DATA_REPUTATION_BRANCHES.md** – Act 3 reputation branch catalog.
- **DATA_AUTOMATION.md** – Act 3 automation rules catalog.
- **DATA_SCHEDULING.md** – Act 3 scheduling rules catalog.
- **DATA_VARIANCE.md** – Act 3 content variance catalog.
- **DATA_LEGACY_MILESTONES.md** – Act 3 legacy milestone catalog.

Refer to `../README.md` in the repository root for a general introduction and setup instructions.

## Implementation Layout (MVP Baseline)
- JavaScript source lives in `/src`.
- Main stylesheet is `/styles.css` in the repo root.
- This layout is authoritative per `docs/MVP/MVP_FILE_STRUCTURE.md` and must not drift.
