# CURRENT SCOPE (Authoritative)

## Current Phase
- **Post-MVP (Act 1+)** – MVP is complete and frozen. Current work is **content expansion only** using existing systems (opportunities, unlocks, events, images). No new systems or refactors.

## In Scope Now (Post-MVP / Act 1+)
- **Additive content only**: New opportunities, unlocks, events, and optional images that use existing schemas and systems.
- **Act 1+ tuning via data**: New or expanded catalogs/copy that plug into the current data-driven structures without changing logic.
- **No new systems**: All gameplay remains driven by the existing MVP loop and `gameState` structure.

## Explicitly Out of Scope (Post-MVP / Act 1+)
- **New systems or mechanics** – No new currencies, progression systems, screens, or refactors.
- **State model changes** – No schema changes beyond what existing MVP saves already support.
- **Acts 2 & 3 systems** – Later story arcs/mechanics (beyond Day 90) remain out of scope.
- **Mobile/Responsive support** – Desktop-only layout remains.
- **Online features** – No backend server, database, user account system, or payment processing in-game.
- **Any framework or build tooling** – The project does not use frameworks (React, etc.) or bundlers; it’s purely static files.

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
