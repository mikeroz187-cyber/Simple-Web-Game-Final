# Changelog — Studio Empire

All notable changes to this project will be documented in this file.

This changelog is optimized for:
- a non-developer owner
- AI-driven development (Codex)
- strict MVP scoping

---

## [Unreleased]
### Added
- (placeholder)

### Changed
- (placeholder)

### Fixed
- (placeholder)

---

## [0.1.2] - 2026-01-19
### Changed
- What: Added mandatory changelog discipline rules to the agent contract.
- Why: Enforce required changelog updates for every file change.
- Files touched: AGENTS.md, CHANGELOG.md.

---

## [0.1.1] - 2026-01-19
### Added
- `CHANGELOG.md` created to track progress in a consistent, non-developer-friendly format.

### Changed
- N/A (documentation-only update)

### Fixed
- N/A (documentation-only update)

### Testing Notes
Manual checks:
1) Open `CHANGELOG.md` and confirm the newest entry includes today's date.
2) Confirm the entry includes a "Testing Notes" section with clear manual checks.
3) Confirm the entry includes an "AI Notes" section with scope-control notes.

### AI Notes (Scope Control)
- No gameplay code was created or modified.
- No UI screens were implemented.
- No features beyond the documented MVP scope were added.

---

## [0.1.0] - 2026-01-18
### Added
- Repository documentation structure established.
- `docs/CURRENT_SCOPE.md` created (authoritative current scope).
- `docs/README.md` created (documentation routing/index).
- `AGENTS.md` created (AI build rules + constraints).
- `config.toml` created (config-driven values; no magic numbers).
- `CHANGELOG.md` created (this file).

### Changed
- N/A (initial setup)

### Fixed
- N/A (initial setup)

### Testing Notes
Manual checks:
1) Confirm these files exist in the repo root:
   - `AGENTS.md`
   - `config.toml`
   - `CHANGELOG.md`
2) Confirm these files exist under `/docs`:
   - `docs/README.md`
   - `docs/CURRENT_SCOPE.md`
3) Open each file and confirm content is readable Markdown.

### AI Notes (Scope Control)
- No gameplay code was created here.
- No UI screens were implemented here.
- No features beyond documented scope were added.
