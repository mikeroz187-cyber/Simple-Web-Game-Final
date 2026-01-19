# AGENTS.md — Studio Empire AI Build Rules

## Role
You are an AI software engineer working on **Studio Empire**, a desktop-only, single-page, vanilla web game.

Your goal is to **ship the MVP exactly as defined**, with clean structure and safe iteration.

You must assume:
- The project owner is NOT a developer.
- The owner depends on your accuracy and discipline.
- You must not guess intent.

---

## Source of Truth (Strict)
When deciding what to build or change, follow this authority order:

1) `docs/CURRENT_SCOPE.md`  ✅ highest authority  
2) `docs/SCOPE_MVP.md`  
3) Everything inside `docs/MVP/`  
4) Everything inside `docs/VISION/` (read-only inspiration)

If anything conflicts, `docs/CURRENT_SCOPE.md` wins.

---

## Hard Technical Constraints (Non-Negotiable)
- Desktop-only web app (no mobile/responsive work)
- Single-page app
- Vanilla HTML/CSS/JS ONLY
- No frameworks (React/Vue/etc.)
- No build tools (no bundlers, no npm, no node)
- No backend
- No database
- No authentication/login
- No payments inside the game
- One authoritative `gameState` object
- Save via `localStorage`
- Export/import JSON save files
- Config-driven values (no magic numbers)

Everything must run by opening `index.html` locally.

---

## Implementation Discipline Rules
### 1) Do not overbuild
If a feature is not explicitly listed in MVP docs, do NOT add it.

### 2) Never invent systems
Do not create new currencies, progression systems, or UI screens unless documented.

### 3) No silent refactors
If you want to refactor, you must:
- explain the reason
- keep it minimal
- avoid breaking saves

### 4) Prefer simple, boring solutions
Prioritize readability and stability over cleverness.

### 5) Keep game state explicit
All gameplay must be driven by `gameState`.
No hidden state inside DOM or random globals.

---

## Required Code Architecture
### Required folders/files (minimum)
Project must contain:

/docs/                   (documentation)
/src/                    (JS source)
/src/game/               (game logic modules)
/src/ui/                 (UI rendering + interaction)
/src/systems/            (save/load, time, economy, etc.)
/src/config/             (config-driven constants)
/assets/                 (images, fonts if needed)

/index.html              (single entry)
/styles.css              (main stylesheet)
/src/main.js             (bootstraps game)
/src/state.js            (gameState model + init)

You may add files if needed, but keep structure clean.

---

## The gameState rules
- There must be ONE `gameState` object that is the authoritative truth.
- UI reads from it.
- Game actions mutate it through functions.
- Save/load serializes it cleanly.

No duplicate state models.

---

## Save/Load Requirements
Must support:
- Auto-save to localStorage (safe frequency)
- Manual "Save Now" button (if MVP requires)
- Export save to JSON file
- Import save from JSON file
- Versioned save format with migration hooks (lightweight)

Never break old saves without a migration path.

---

## UI Rules
- Desktop-first layout
- No responsive/mobile tuning
- Use consistent panels, spacing, and readable typography
- Navigation must be obvious
- Avoid clutter

---

## Documentation Rules (For You)
Whenever you build a major feature, ensure the docs remain true.
If docs are missing something, STOP and ask a question.

---

## Asking Questions Policy
If you encounter ambiguity:
- STOP
- Ask one clear question
- Offer 1–2 possible interpretations
Do NOT guess.

---

## Definition of Done
A change is "done" only when:
- It matches MVP scope
- It runs locally via `index.html`
- It produces no console errors
- It does not break save/load
- It is understandable to a non-developer

--- 
End of contract.
