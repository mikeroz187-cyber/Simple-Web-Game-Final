# Studio Empire – Web Game

Studio Empire is an adult content production management simulator. It runs entirely in the browser using vanilla HTML, CSS, and JavaScript (no frameworks needed). Larger features like rival studios and later story acts are part of the long-term vision and are not yet implemented.

## Current Status (Post-MVP / Act 1+)
- The **MVP is complete and frozen** as the Act 1 baseline (Days 1–90).
- Current work is **content expansion only** (opportunities, unlocks, events, images) using existing systems. No new systems or refactors are allowed unless `docs/CURRENT_SCOPE.md` changes.
- Current scope: **Act 2 Phase 1 — Save v2 (new games only; incompatible saves reset)**.

## Repository Structure
- **config.toml** – central game configuration (starting cash, debt, tuning parameters).
- **.codex/config.toml** – Codex AI configuration settings for this project.
- **AGENTS.md** – guidelines for AI contributors (Codex/ChatGPT) on how to work within project scope.
- **docs/** – contains all design documentation (both MVP-specific and future vision docs). `docs/README.md` contains an index of all docs.
- **src/** – contains the game’s JavaScript source code as outlined in the technical docs (see `docs/MVP/MVP_FILE_STRUCTURE.md` for the historical baseline).
- **styles.css** – main stylesheet in the repo root per the historical MVP file structure.

## Getting Started
1. **Read the docs:** Start with `docs/README.md` for an index of all documentation and to understand project scope.
2. **Review AGENTS.md:** Especially if using AI assistance, to follow coding and design guidelines.
3. **Use config.toml:** All game balance parameters (cash, conversion rates, fatigue, etc.) are defined in `config.toml` – avoid hard-coding values.
4. **Run the game:** Open `index.html` in a web browser (or use a simple static server) to load the game. No build process is required.

## Documentation
- The documentation in `docs/` is the **source of truth** for design. Current scope is defined in `docs/CURRENT_SCOPE.md`. MVP docs (`docs/SCOPE_MVP.md` and files in `docs/MVP/`) are historical references for the frozen baseline. Long-term design ideas are captured in the Vision docs under `docs/VISION/`.
- If a feature is not listed in `docs/CURRENT_SCOPE.md`, it is out of scope for the current phase.

## Contributing
- Currently, development is AI-driven using ChatGPT/Codex. Human contributors should read the docs and possibly discuss via issues before coding.
- Please see `AGENTS.md` for guidelines on coding style, commit messages, and scope limitations. All contributions (AI or human) should adhere to the design and scope defined in documentation.
