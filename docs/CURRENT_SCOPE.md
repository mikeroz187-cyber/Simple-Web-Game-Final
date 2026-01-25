# CURRENT SCOPE (Authoritative)

**Last Updated:** January 25, 2026

## Current Phase
- **Act 3 (Days 181-270) — Complete**: Act 3 foundations, story arc, progression systems, optional automation expansion, and legacy milestones are delivered. Current work is polish/bugfix only.

## Completed (Confirmed)
- **Act 1 (MVP) complete**: core loop, all screens, save/load with slots + autosave, export/import, day advancement, economy basics, content types, starter roster, tiers/themes, social posting, story events, win/loss conditions.
- **Act 2 complete**: expanded performer management, advanced analytics rollups, location tier 2, equipment upgrades, Act 2 themes, story events, expanded roster depth, social strategies (manual + daily budget), milestones, automation tier 1, Story Log, portrait/thumbnail placeholders, gallery output cards, save v2 schema.
- **Post-MVP Fixes/QoL complete**: promo posting fixes, analytics clarity, freelancer rerolls, metrics split, booking UI/validation fixes, promo platform posting rules, daily cap behavior, promo conversion tuning, booking role restrictions removed.
- **Booking scope update**: booking is single-performer only; Slot B and combo effects were cut for scope reduction.
- **Act 3 complete**: Save v3 schema + migration; A3.1 Rival Studios; A3.2 High-Impact Events; A3.3 Reputation Branches; A3.4 Act 3 Story Arc; A3.5 Optional Automation (expanded); A3.6 Content Performance Variance; A3.8 Legacy Milestones.
- **Debug tooling**: dev-only Set Day panel gated by `?debug=1`, dev-only stat setters, and the “Run Checks Now” milestone helper.

## Completed / Previous Phases (Archived Scope)
- The prior **Act 2 Phase 1 / Option A slice** scope items are fully delivered and no longer active.
- Ongoing work is restricted to Act 3 items listed in `docs/task-checklist.md`.

## Next Steps (Act 3 — Start Here)
1. **Act 3 scope complete** — move into polish/bugfix-only mode.

## Act 1 Time Control (Locked)
- **Manual Advance Day is intentional and player-facing**: the UI “Advance Day” action is an MVP feature and is in scope.
- **Primary time progression for Act 1**: time advances only when the player triggers Advance Day after the required shoots; this is the canonical pacing/testing mechanism for Act 1.
- **No automation yet**: automated/background day progression is explicitly out of scope until a later Act.

## Authority Order (Documentation to Follow)
Repo layout is authoritative here to prevent drift across MVP docs.
When building or reviewing features, **follow these documents in order**:
1. **docs/CURRENT_SCOPE.md** (this file – latest scope definition)
2. **docs/SCOPE_MVP.md** (historical MVP feature list and plan)
3. **docs/MVP/MVP_TECH_GUARDRAILS.md** (historical MVP guardrails)
4. **docs/MVP/MVP_FILE_STRUCTURE.md** (historical MVP file map)
5. **docs/MVP/MVP_BUILD_ORDER.md** (historical MVP build order)
6. **docs/MVP/MVP_UI_BLUEPRINT.md** (historical MVP UI blueprint)
7. **docs/MVP/MVP_STATE_MODEL.md** (historical MVP state model)

*(If any discrepancy arises, the CURRENT_SCOPE.md has the final say.)*

## How to Use This File
- **Scope changes post-MVP**: When new features are approved after MVP, update *only* this `CURRENT_SCOPE.md` to expand scope. This file “unlocks” new features for development.
- **Do not retroactively edit older Vision docs** for scope changes. The vision docs remain as historical reference designs, even if the scope evolves. Always refer back here for the official current scope.
- **Implementation status**: Progress tracking lives outside this file (use a separate progress/status document if needed).
