# CURRENT SCOPE (Authoritative)

## Current Phase
- **MVP** – Act 1 only (Days 1–90). (The game is currently in the MVP stage focusing solely on the first act of the story.)

## In Scope Now (MVP)
- **Core loop**: Book a shoot → View content → Analyze metrics → Adjust strategy → Repeat. (The fundamental gameplay cycle is fully implemented.)
- **Act 1 “The Debt” storyline**: The player starts with a $5,000 loan and must repay $10,000 by Day 90. Basic story events for Act 1 (introduction, debt reminders) are included.
- **Content types**: **Promo (SFW)** and **Premium (NSFW)** content shoots are available. (Promo increases followers; Premium generates revenue from subscribers.)
- **Single-page app**: Desktop web only, using vanilla HTML/CSS/JS with no page reloads. (No mobile support in MVP.)
- **Central game state**: All game data is managed in one authoritative `gameState` object in memory.
- **Save/Load**: Local saving via `localStorage` is implemented, with options to export/import game state as JSON files.

## Explicitly Out of Scope (for MVP)
- **Acts 2 & 3** – Later story arcs (beyond Day 90) are not included.
- **Rival studios or competition** – No AI competitors or rival interactions yet.
- **POV special scenes** – Private POV content scenes are omitted unless scope is expanded later.
- **Mobile/Responsive support** – The UI is not optimized for mobile devices in MVP.
- **Online features** – No backend server, database, user account system, or payment processing in-game.
- **Any framework or build tooling** – The project does not use frameworks (React, etc.) or bundlers; it’s purely static files.

## Authority Order (Documentation to Follow)
Repo layout is authoritative here to prevent drift across MVP docs.
When building or reviewing features, **follow these documents in order**:
1. **docs/CURRENT_SCOPE.md** (this file – latest scope definition)
2. **docs/SCOPE_MVP.md** (MVP feature list and plan)
3. **docs/MVP/MVP_TECH_GUARDRAILS.md**
4. **docs/MVP/MVP_FILE_STRUCTURE.md**
5. **docs/MVP/MVP_BUILD_ORDER.md**
6. **docs/MVP/MVP_UI_BLUEPRINT.md**
7. **docs/MVP/MVP_STATE_MODEL.md**

*(If any discrepancy arises, the CURRENT_SCOPE.md has the final say.)*

## How to Use This File
- **Scope changes post-MVP**: When new features are approved after MVP, update *only* this `CURRENT_SCOPE.md` to expand scope. This file “unlocks” new features for development.
- **Do not retroactively edit older Vision docs** for scope changes. The vision docs (01–14 series) remain as historical reference designs, even if the scope evolves. Always refer back here for the official current scope.
