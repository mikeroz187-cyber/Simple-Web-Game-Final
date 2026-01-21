# CURRENT SCOPE (Authoritative)

## Current Phase
- **Post-MVP (Act 1+)** – MVP is complete and frozen. Current work is **content expansion only** using existing systems (opportunities, unlocks, events, images). No new systems or refactors.

## In Scope Now (Post-MVP / Act 1+)
- **Additive content only**: New opportunities, unlocks, events, and optional images that use existing schemas and systems.
- **Act 1+ tuning via data**: New or expanded catalogs/copy that plug into the current data-driven structures without changing logic.
- **No new systems**: All gameplay remains driven by the existing MVP loop and `gameState` structure.
- **UI-only addition**: A manual **Advance Day** button in the global controls area that triggers the existing day-advance flow (single click = single day), without changing mechanics or save behavior.

## Explicitly Out of Scope (Post-MVP / Act 1+)
- **New systems or mechanics** – No new currencies, progression systems, screens, or refactors.
- **State model changes** – No schema changes beyond what existing MVP saves already support.
- **Acts 2 & 3 systems** – Later story arcs/mechanics (beyond Day 90) remain out of scope.
- **Mobile/Responsive support** – Desktop-only layout remains.
- **Online features** – No backend server, database, user account system, or payment processing in-game.
- **Any framework or build tooling** – The project does not use frameworks (React, etc.) or bundlers; it’s purely static files.

## POST-MVP MILESTONE 2 — Act 1 Content Pack 02 (Story Events Only)
- **MVP baseline is frozen**; this milestone is a content-only expansion using existing systems.
- **In Scope**
  - Add new story events only (Act 1 days 1–90).
  - Events use the existing story/event system and existing day-start pipeline.
  - Content is data-only additions (new event entries), no new mechanics.
- **Out of Scope / Hard Exclusions**
  - No new systems.
  - No `gameState` schema changes.
  - No save/load changes.
  - No new UI screens.
  - No branching choices, no new triggers beyond “fire on configured day”.
  - No refactors.
- **Definition of Done (Milestone 2)**
  - [ ] New events fire on their configured days.
  - [ ] Events display in the existing Events/Messages panel.
  - [ ] If events include images, they reference existing asset patterns (no new asset pipeline).
  - [ ] Save persists after refresh (no regressions).
  - [ ] No console errors.
  - [ ] CHANGELOG.md updated to record the doc change.

## Authority Order (Documentation to Follow)
Repo layout is authoritative here to prevent drift across MVP docs.
When building or reviewing features, **follow these documents in order**:
1. **docs/CURRENT_SCOPE.md** (this file – latest scope definition)
2. **docs/SCOPE_MVP.md** (historical MVP feature list and plan)
3. **docs/MVP/MVP_TECH_GUARDRAILS.md** (historical MVP guardrails)
4. **docs/MVP/MVP_FILE_STRUCTURE.md** (historical MVP file map)
5. **docs/MVP/MVP_BUILD_ORDER.md** (historical MVP build order)
6. **docs/MVP/MVP_UI_BLUEPRINT.md** (historical MVP UI blueprint)
7. **docs/MVP/MVP_STATE_MODEL.md** (historical MVP state model)

*(If any discrepancy arises, the CURRENT_SCOPE.md has the final say.)*

## How to Use This File
- **Scope changes post-MVP**: When new features are approved after MVP, update *only* this `CURRENT_SCOPE.md` to expand scope. This file “unlocks” new features for development.
- **Do not retroactively edit older Vision docs** for scope changes. The vision docs (01–14 series) remain as historical reference designs, even if the scope evolves. Always refer back here for the official current scope.
- **Implementation status**: Progress tracking lives outside this file (use a separate progress/status document if needed).
