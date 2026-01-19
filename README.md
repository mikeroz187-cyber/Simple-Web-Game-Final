# Studio Empire – Web Game

Studio Empire is an adult content production management simulator. It runs entirely in the browser using vanilla HTML, CSS, and JavaScript (no frameworks needed). Larger features like rival studios and later story acts are part of the long-term vision and are not yet implemented.

## MVP Status (Current Scope)
- The current build is an **MVP** focusing on Act 1 (Days 1–90) only.
- MVP features include the core loop of booking shoots → viewing content → analyzing metrics, basic performer management, and a debt repayment narrative. Advanced systems (rivals, expanded story, complex negotiations) are **not** in this MVP.

## Repository Structure
- **config.toml** – central game configuration (starting cash, debt, tuning parameters).
- **.codex/config.toml** – Codex AI configuration settings for this project.
- **AGENTS.md** – guidelines for AI contributors (Codex/ChatGPT) on how to work within project scope.
- **docs/** – contains all design documentation (both MVP-specific and future vision docs). `docs/README.md` contains an index of all docs.
- **src/** (to be created) – will contain the game’s source code (HTML, CSS, JS files) as outlined in the technical docs (e.g. `docs/22-file-and-folder-map.md` and `docs/13-tech-stack.md`).

## Getting Started
1. **Read the docs:** Start with `docs/README.md` for an index of all documentation and to understand project scope.
2. **Review AGENTS.md:** Especially if using AI assistance, to follow coding and design guidelines.
3. **Use config.toml:** All game balance parameters (cash, conversion rates, fatigue, etc.) are defined in `config.toml` – avoid hard-coding values.
4. **Run the game:** Open `index.html` in a web browser (or use a simple static server) to load the game. No build process is required.

## Documentation
- The documentation in `docs/` is the **source of truth** for design. For MVP implementation details, see the MVP docs (`docs/15-mvp-scope.md` and related files listed in docs/README). Long-term design ideas live in `docs/VISION/` (Act 2/Act 3 planning documents listed in `docs/README.md`).
- If a feature is in the Vision docs but **not** mentioned in the MVP docs, it is out of scope for the MVP.

## Contributing
- Currently, development is AI-driven using ChatGPT/Codex. Human contributors should read the docs and possibly discuss via issues before coding.
- Please see `AGENTS.md` for guidelines on coding style, commit messages, and scope limitations. All contributions (AI or human) should adhere to the design and scope defined in documentation.
