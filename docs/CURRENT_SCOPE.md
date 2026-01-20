# CURRENT SCOPE (Authoritative)

## Current Phase
- **MVP** – Act 1 only (Days 1–90). (This phase defines the planned scope for the MVP.)

## In Scope Now (MVP)
- **Core loop**: Book a shoot → View content → Analyze metrics → Adjust strategy → Repeat. (Planned/required for MVP.)
- **Day pacing**: A day advances only after completing 5 shoots. (Approved MVP adjustment.)
- **Act 1 “The Debt” storyline**: The player starts with a $5,000 loan and must repay $10,000 by Day 90. Basic story events for Act 1 (introduction, debt reminders) are planned/required for MVP.
- **Debt payoff action**: A dedicated Pay Debt button allows clearing the full remaining debt once enough cash is available. (Approved MVP adjustment.)
- **Content types**: **Promo (SFW)** and **Premium (NSFW)** content shoots are planned/required for MVP. (Promo increases followers; Premium generates revenue from subscribers.)
- **Single-page app**: Desktop web only, using vanilla HTML/CSS/JS with no page reloads. (No mobile support in MVP; planned/required.)
- **Central game state**: All game data is managed in one authoritative `gameState` object in memory. (Planned/required for MVP.)
- **Save/Load**: Local saving via `localStorage` (multiple slots), plus export/import of JSON save files, is planned/required for MVP.

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
- **Implementation status**: Progress tracking lives outside this file (use a separate progress/status document if needed).
