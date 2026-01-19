# MVP File Structure (Studio Empire)

## Non-Negotiables (MVP)
- Desktop-only
- Single-page app
- Vanilla HTML/CSS/JS only
- No frameworks, no build tools, no backend/db/auth/payments
- One authoritative `gameState` object
- Save via localStorage
- Export/Import JSON save files
- Config-driven values (no magic numbers)
- Must run by opening index.html locally

## Repo Layout (MVP) — Exact Tree
Codex must create and maintain the following layout exactly. OPTIONAL entries are explicitly labeled.
Repo layout is authoritative here: JS lives in `/js`, and CSS lives in `/css/style.css`.

```
/
  index.html
  AGENTS.md
  config.toml
  CHANGELOG.md
  /docs
    README.md
    CURRENT_SCOPE.md
    SCOPE_MVP.md
    SCOPE_VISION.md
    /MVP
      MVP_OVERVIEW.md
      MVP_BUILD_ORDER.md
      MVP_STATE_MODEL.md
      MVP_UI_BLUEPRINT.md
      MVP_TECH_GUARDRAILS.md
      MVP_FILE_STRUCTURE.md
    /VISION
      (empty or placeholder; do not add Act 2/3 docs yet)
  /css
    style.css
  /js
    main.js
    config.js
    state.js
    save.js
    /utils
      dom.js
      format.js
      rng.js
    /systems
      economy.js
      performers.js
      booking.js
      social.js
      progression.js
      story.js
    /ui
      router.js
      render.js
      events.js
      components.js
  /assets
    /images
      /ui
      /backgrounds
      /placeholders
    /audio
      (optional; may be empty)
```

## File Ownership Map (What Each File Owns)

| File | Owns | Must NOT Own |
| --- | --- | --- |
| `index.html` | Static DOM shell, screen containers, top nav container, modal root container, links to CSS + scripts (correct order) | Gameplay logic, state mutations, inline JS (except zero/minimal bootstrapping) |
| `css/style.css` | Global theme variables, layout, screen visibility helpers, button/card/modal styles | Framework-like utility explosion, mobile/responsive breakpoints |
| `js/config.js` | Single `CONFIG` object with **all tunables** (starting cash, costs, thresholds, timers, multipliers) | Dynamic runtime state, DOM work |
| `js/state.js` | `gameState` schema + `newGameState()` factory + default values | DOM, rendering, save I/O, random gameplay calculations |
| `js/save.js` | Save/load/reset/export/import helpers | Rendering, business logic, direct DOM manipulation beyond file input handling |
| `js/main.js` | App bootstrap (init), wiring modules, starting screen, initial render | Heavy gameplay rules, hard-coded config values |
| `js/ui/router.js` | Show/hide screens, enforce “exactly one active screen” | Gameplay rules, state calculations |
| `js/ui/render.js` | Render functions per screen using `gameState` as input | Deep business logic; state mutations should go through systems |
| `js/ui/events.js` | Event listeners that call systems + then re-render | State schema definitions or config definitions |
| `js/ui/components.js` | Tiny DOM builder helpers for repeated UI pieces (cards, rows, toasts) | App routing, save logic, config |
| `js/systems/*.js` | “Pure-ish” gameplay logic (mutates `gameState` in controlled ways), returns result objects | DOM access, direct `localStorage`, direct screen navigation |
| `js/utils/*.js` | Small pure helpers (query selectors, formatting money, seeded RNG) | App state ownership, business rules |

**Hard rule:** No magic numbers outside `CONFIG`.

## Script Load Order (No Build Tools)
**Rules:**
- Use plain `<script src="..."></script>` (NOT `type="module"`).
- Use `defer` on all scripts.
- No bundlers, no imports, no requires.
- Everything runs from `file://`.

**Recommended script tag order (index.html):**
```
1) js/config.js
2) js/state.js
3) js/save.js
4) js/utils/dom.js
5) js/utils/format.js
6) js/utils/rng.js
7) js/systems/economy.js
8) js/systems/performers.js
9) js/systems/booking.js
10) js/systems/social.js
11) js/systems/progression.js
12) js/systems/story.js
13) js/ui/components.js
14) js/ui/router.js
15) js/ui/render.js
16) js/ui/events.js
17) js/main.js
```

## The One-State Rule
- There is exactly one `window.gameState`.
- No duplicate state containers.
- Systems mutate `gameState` only through documented functions.
- UI reads from `gameState` and triggers actions; UI is not the source of truth.

## Save / Export / Import Contract
**Required functions (names must match across files):**
- `saveGame()`
- `loadGame()`
- `resetSave()`
- `exportSaveToFile()`
- `importSaveFromFile(file)`

**Rules:**
- `localStorage` key name must be constant (e.g., `"studio_empire_save"`).
- Import validates schema version and required keys.
- Failed import never corrupts current state.

## Config-Driven Values (No Magic Numbers)
Checklist:
- All costs, thresholds, payouts, cooldowns, caps live in `CONFIG`.
- Systems never hardcode numbers except 0/1 for booleans or array indexes.
- UI labels read from `CONFIG` when applicable.

## Naming Conventions
- Filenames: lowercase, hyphenless, `.js`.
- Functions: `camelCase`.
- Constants: `SCREAMING_SNAKE_CASE` only for truly constant strings/keys.
- Screen IDs: `"screen-hub"`, `"screen-roster"`, etc.
- DOM hooks: `data-action` attributes recommended (no brittle selector soup).

## MVP Scope Guardrails (Anti-Scope-Creep)
OUT OF SCOPE for MVP:
- Mobile/responsive UI.
- Accounts/login.
- Backend/database/APIs.
- Payments.
- Multi-page routing.
- Complex animation frameworks.
- Any Vision-only systems (Acts 2–3, rivals, POV scenes, extra platforms, advanced upgrades).

## Forbidden Patterns (Codex Must Not Do These)
- ES modules / `import`/`export`.
- Frameworks or framework-like patterns.
- Multiple state objects.
- Saving in random places.
- Duplicating config values across files.
- Giant render functions that also compute economy/business logic.

## Minimal “How to Add a New Feature” Workflow (MVP)
1) Update docs if needed (scope + state model first).
2) Add `CONFIG` entries first.
3) Update systems to mutate `gameState`.
4) Update render to display state.
5) Wire event in `js/ui/events.js`.
6) Call `saveGame()` after meaningful actions.
7) Re-render current screen.

**Final note:**
“This structure is authoritative for MVP. If a change is needed, update docs first. Do not improvise.”
