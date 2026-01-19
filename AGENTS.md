# AGENTS.md — AI Contributor Guidelines

Instructions for AI agents (Codex, Claude) working on Studio Empire.

## Before Writing Code

Read these docs in order:
1. `docs/mvp/CURRENT-SCOPE.md` — Single source of truth
2. `docs/mvp/BUILD-ORDER.md` — Implementation steps
3. `docs/mvp/TECHNICAL-GUARDRAILS.md` — Tech stack rules

## Critical Rules

### MVP vs Vision

- `/docs/mvp/` = Implement NOW
- `/docs/vision/` = Future reference ONLY

Never implement features from vision docs unless they also appear in MVP docs.

### Technical Constraints

- Vanilla HTML/CSS/JS only — no frameworks
- Desktop-only — no mobile layouts
- No authentication or accounts
- No backend, database, or APIs
- Single gameState object
- Saves via localStorage plus JSON export/import

### Document Authority

When docs conflict:
1. CURRENT-SCOPE.md wins over everything
2. BUILD-ORDER.md wins for implementation sequence
3. TECHNICAL-GUARDRAILS.md wins for tech decisions
4. GAME-CONFIG.md wins for balance values
5. STATE-AND-FLOW.md wins for data structures
6. UI-BLUEPRINT.md wins for screen layouts

### When In Doubt

- Implement the simpler version
- Ask for clarification before adding complexity
- Check CURRENT-SCOPE.md before building any feature

## Changelog Policy

Update CHANGELOG.md for every feature or fix under the Unreleased section.
