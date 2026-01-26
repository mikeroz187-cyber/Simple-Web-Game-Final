# Studio Empire – Web Game

Studio Empire is a desktop‑only, single‑page studio management game built with vanilla HTML/CSS/JS. It runs locally by opening `index.html`—no build tools or backend required.

## Current Status
- The **core loop and Acts 1–3 systems are implemented**, including recruitment, automation, competition/market shifts, studio identity, and legacy milestones.
- **Current rules of play** live in `docs/CORE_GAMEPLAY_LOOP.md` (see the *Current Game Rules* section).
- `docs/CURRENT_SCOPE.md` is a **status snapshot only**—it does not restrict future work.

## Repository Structure
- **src/** – JavaScript source code.
- **src/config.js** – Authoritative game configuration (balance, catalogs, tuning).
- **docs/** – Documentation; see `docs/README.md` for the index.
- **index.html** – Single‑page entry point.
- **styles.css** – Main stylesheet.
- **config.toml** – Legacy reference (not used by the runtime).

## Getting Started
1. Read `docs/CORE_GAMEPLAY_LOOP.md` for current rules and flow.
2. Open `index.html` in a browser to play.
3. Edit values in `src/config.js` to adjust balance or catalogs.

## Documentation Notes
- **Current behavior:** `docs/CORE_GAMEPLAY_LOOP.md`, `docs/GAMESTATE_DATA_MODEL.md`, and the `docs/DATA_*.md` catalogs.
- **Historical references:** `docs/MVP/` and `docs/VISION/` are archival planning documents and do not reflect the current build.
