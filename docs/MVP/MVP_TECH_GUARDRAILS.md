**Status:** Historical MVP reference. This document is not authoritative for the current build.
Current behavior lives in `docs/CORE_GAMEPLAY_LOOP.md` and `docs/GAMESTATE_DATA_MODEL.md`.
Legacy references to CURRENT_SCOPE are historical; CURRENT_SCOPE is now a non‑binding focus snapshot.
Note: The current build uses `src/config.js`; `config.toml` is a legacy reference.

# MVP Technical Guardrails (Implementation Constitution)

## 1) Purpose
This document defines how Codex structured MVP code to keep the game stable, shippable, and aligned with the historical MVP scope. Any mention of `docs/CURRENT_SCOPE.md` here reflects the **original** MVP workflow and is not authoritative for the current build.

## 2) Non-Negotiable Engineering Constraints (Checklist)
- [ ] Desktop-only web app (no mobile/responsive work)
- [ ] Single-page app
- [ ] Vanilla HTML/CSS/JS only
- [ ] No frameworks (React/Vue/etc.)
- [ ] No build tools (no bundlers, no npm, no node)
- [ ] No backend
- [ ] No database
- [ ] No authentication/login
- [ ] No payments inside the game
- [ ] One authoritative `gameState` object
- [ ] Save via `localStorage`
- [ ] Export/import JSON save files
- [ ] Config-driven values (no magic numbers)
- [ ] Must run by opening `index.html` locally

## 3) Allowed Technology (MVP Only)
**Allowed:**
- Plain HTML/CSS/JS
- Browser APIs only (e.g., `localStorage`, `FileReader`, file download via `Blob`)

**Forbidden:**
- React/Vue/Angular (or any framework)
- npm, bundlers, build steps, or TypeScript
- Node servers
- External CDNs required to run the game
  - Optional fonts are allowed only if the app still runs fully offline; otherwise, forbid.

## 4) File & Module Boundaries (Hard Rules)
Keep files small and responsibilities clear. Respect the MVP file map and build order. No new directories or architecture layers unless the MVP docs require them.

**Required ownership rules (examples aligned to this repo’s structure):**
- `index.html`: layout containers and script tags only (minimal inline content)
- `styles.css`: main stylesheet, readable and minimal, no frameworks
- `src/config.js`: runtime config mirror of `config.toml` values
- `src/state.js`: `newGameState()` and state helpers only
- `src/save.js`: save/load/export/import only
- `src/ui/router.js`: screen switching only
- `src/ui/render.js`: render functions only (read-only from state)
- `src/systems/*.js`: game logic systems (booking, roster, economy, etc.) — **only if MVP requires them**

**Hard rule:** No circular dependencies.

## 5) The Only Way State Changes (Critical)
Choose **controlled mutation** for MVP simplicity.

**Strict pattern:**
- `render()` never mutates state.
- UI events call an **actions** function.
- Actions call systems that **mutate `gameState` only inside named functions**.
- No direct DOM-driven state.

**Forbidden examples:**
- Mutating `gameState` inside render functions
- Setting global variables that duplicate state
- Storing computed totals in both state and UI

## 6) Rendering Rules (No Framework, No Mess)
- Single entry point: `renderApp(gameState)`
- Per-screen render functions (Hub, Booking, Content, Analytics, Social, Gallery, Roster, Shop)
- Rendering strategy: simple `innerHTML` for screen containers (MVP-friendly)
- Keep DOM IDs stable
- Avoid rebuilding expensive nodes if not needed, but keep MVP simple

**UI update trigger rule:**
After every action: **`saveGame()` then `renderApp()`**.

## 7) Event Handling Rules
- Event listeners are attached **once** on boot or via **event delegation**
- No duplicate listeners on repeated renders
- Use `data-*` attributes for list items/IDs
- All handlers call actions with a payload (never mutate state directly)

## 8) Persistence Rules (localStorage + Export/Import)
- Save key name must match `config.toml` → `save.localstorage_key` (`studio_empire_save`).
- Save after every valid state mutation.
- Import must validate against `docs/MVP/MVP_STATE_MODEL.md`.
- Export must download the full `gameState` JSON object.
- `localStorage` failures must be handled gracefully (show message, keep app alive).
- Import errors must never overwrite the current save.

## 9) Config-Driven Values (No Magic Numbers)
- `CONFIG` is the runtime JS object.
- `config.toml` is the human-edited source of truth.
- JS mirrors TOML values manually (no build step).

**Rule:** No hard-coded costs/rewards/timers in systems.

**Tunable checklist (must live in config):**
- Costs
- Payouts
- Timers / cooldowns
- Caps / limits
- Multipliers
- Thresholds
- Unlock requirements

## 10) Determinism + Randomness Policy
- Deterministic outcomes are preferred.
- If MVP includes randomness: store seed and roll results in state so reload is consistent.
- Never call `Math.random()` inside rendering.

## 11) Data Validation + Defensive Programming (MVP Safe)
- Validate user inputs (dropdowns, numbers)
- Clamp values (no negatives where impossible)
- Never allow `NaN`
- Always handle empty arrays gracefully

## 12) Error Handling (Minimal but Real)
- Fail soft: show a short UI message and keep the app alive
- Log errors to console for debugging
- Import errors must never overwrite the current save

## 13) Performance & Simplicity Rules
- Favor readability over cleverness
- Avoid premature optimization
- Avoid giant files (> ~300–400 lines) when possible
- Prefer small, pure helper functions

## 14) Code Style Conventions
- `const` by default; `let` only when needed
- Function names use verb-noun (e.g., `bookShoot`, `postPromo`)
- IDs are strings
- **No ES modules for MVP.** Use non-module `<script>` tags for **file://** compatibility.
- Use a single global namespace (e.g., `window.App = {}`) to avoid globals sprawl.

## 15) Testing & Verification Checklist (Manual)
- Open `index.html` locally with no server
- Navigate all screens
- Create at least 1 content item
- Save persists after refresh
- Export/import works
- Reset works (if MVP includes Reset)
- No console errors

## 16) “Stop and Ask” Triggers
Codex must stop and ask the owner before:
- Adding new screens
- Adding new state fields not in `docs/MVP/MVP_STATE_MODEL.md`
- Adding new config keys not mirrored from `config.toml`
- Refactoring file boundaries
- Introducing randomness

## 17) Out-of-Scope Technical Temptations (Explicitly Forbidden)
- Routing libraries
- Templating libraries
- Complex component systems
- Fancy state management frameworks
- Animation systems
- Cloud saves
- Analytics tracking
- Multiplayer, accounts, payments
