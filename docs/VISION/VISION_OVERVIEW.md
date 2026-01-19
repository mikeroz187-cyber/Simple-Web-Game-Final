# Vision Overview (Act 2 + Act 3)

## 1) What “Vision” Means in This Repo
Vision describes **post-MVP** expansion only. It is a planning layer for Act 2 and Act 3 work that comes **after** the MVP ships. The MVP scope remains locked and authoritative; Vision docs never expand MVP on their own.

## 2) Act Breakdown (Two Acts Only)

| Act | Goal | Player Value | Technical Impact | Dependencies | MVP Impact |
| --- | --- | --- | --- | --- | --- |
| Act 2 | Mid-game depth & systems expansion | More meaningful tradeoffs across growth, stability, and brand direction | Adds new systems and state extensions on top of existing MVP modules | MVP core loop, save system, and config-driven economy | NONE |
| Act 3 | Late-game complexity, long arcs, prestige/endgame loops | Long-term mastery with high-stakes decisions and legacy goals | Adds endgame systems, advanced events, and additional state modeling | Act 2 systems + MVP core loop foundation | NONE |

## 3) Vision Non-Negotiables (Still Apply)
- Desktop-only
- Single-page app
- Vanilla HTML/CSS/JS only
- No frameworks, no backend/db/auth/payments
- One authoritative gameState object
- Save via localStorage
- Export/import JSON save files
- Config-driven values (no magic numbers)
- Runs locally from index.html

## 4) Vision Principles (How We Expand Without Breaking MVP)
- Additive systems only (no re-platforming).
- Every new system must plug into existing file ownership rules.
- Systems must remain config-driven and testable by inspection.
- UI stays screen-based; do not introduce routing frameworks.

## 5) Vision Feature Inventory (High Level)
Based strictly on `docs/SCOPE_VISION.md`:

### Theme: Expanded performer management
- Summary: Deeper talent management such as contracts, loyalty pressures, and long-term retention. (Details TBD.)
- What it touches: State (performer fields), systems (performer management), UI (roster), save (schema extension).
- Act: Act 2
- Dependencies: MVP performer roster, fatigue/loyalty systems, save/load.

### Theme: Rival studios / competitive pressure
- Summary: Competitive pressure and market positioning challenges. (Details TBD.)
- What it touches: State (rival metadata), systems (competition), UI (status/alerts), save (schema extension).
- Act: Act 3
- Dependencies: MVP economy, reputation, and progression systems.

### Theme: Advanced analytics
- Summary: Deeper insights that reward strategic planning. (Details TBD.)
- What it touches: State (analytics history), systems (analytics aggregation), UI (analytics screen), save (schema extension).
- Act: Act 2
- Dependencies: MVP analytics outputs and content history.

### Theme: Additional location tiers
- Summary: More unlockable spaces with escalating costs and benefits. (Details TBD.)
- What it touches: State (unlock tiers), systems (progression), UI (shop/booking), save (schema extension).
- Act: Act 2
- Dependencies: MVP location unlock flow and reputation gating.

### Theme: Equipment upgrades
- Summary: Optional investments that affect output quality. (Details TBD.)
- What it touches: State (equipment levels), systems (economy/output), UI (shop), save (schema extension).
- Act: Act 2
- Dependencies: MVP economy and progression systems.

### Theme: Structured events
- Summary: High-impact moments that test preparedness. (Details TBD.)
- What it touches: State (event queue), systems (story/events), UI (event modal/panel), save (schema extension).
- Act: Act 3
- Dependencies: MVP story/event framework and day progression.

### Theme: Reputation branches
- Summary: Distinct studio identities with different strengths. (Details TBD.)
- What it touches: State (reputation path), systems (progression/modifiers), UI (reputation display), save (schema extension).
- Act: Act 3
- Dependencies: MVP reputation stat and unlock gating.

### Theme: Additional content themes
- Summary: Broader planning options without new core loops. (Details TBD.)
- What it touches: State (content catalog), systems (booking/results), UI (booking selection), save (schema extension).
- Act: Act 2
- Dependencies: MVP booking flow and content history.

### Theme: Long-term story arcs
- Summary: Act 2/3 narrative beats after the debt storyline. (Details TBD.)
- What it touches: State (story flags), systems (story progression), UI (story events), save (schema extension).
- Act: Act 2 and Act 3
- Dependencies: MVP Act 1 story structure and day progression.

### Theme: Expanded roster depth
- Summary: More performers and clearer role differentiation. (Details TBD.)
- What it touches: State (roster size/roles), systems (roster management), UI (roster screen), save (schema extension).
- Act: Act 2
- Dependencies: MVP roster and booking selection.

### Theme: Deeper social strategy
- Summary: Platform emphasis and audience composition choices. (Details TBD.)
- What it touches: State (platform tuning), systems (social impact), UI (social screen), save (schema extension).
- Act: Act 2
- Dependencies: MVP social platforms (Instagram/X) and promo posting.

### Theme: Studio milestones
- Summary: Visible achievements that mark progress. (Details TBD.)
- What it touches: State (milestones), systems (progress tracking), UI (hub/summary), save (schema extension).
- Act: Act 2
- Dependencies: MVP progression signals (reputation, unlocks).

### Theme: Optional automation
- Summary: Late-game tools that reduce repetitive actions. (Details TBD.)
- What it touches: State (automation flags), systems (automation), UI (controls), save (schema extension).
- Act: Act 3
- Dependencies: MVP core loop actions and booking system.

### Theme: Content performance variance
- Summary: Greater risk/reward in output results. (Details TBD.)
- What it touches: State (result rolls), systems (content results), UI (analytics feedback), save (schema extension).
- Act: Act 3
- Dependencies: MVP content result generation and analytics.

### Theme: Advanced scheduling
- Summary: Balancing multiple shoots or parallel planning. (Details TBD.)
- What it touches: State (schedule), systems (booking/time), UI (booking), save (schema extension).
- Act: Act 3
- Dependencies: MVP booking flow and day advancement.

## 6) Required Vision Documentation Set (What Files We Will Create Next)
```
/docs/VISION/
  ACT2_SCOPE.md
  ACT2_STATE_EXTENSIONS.md
  ACT2_SYSTEMS.md
  ACT2_UI_BLUEPRINT.md
  ACT2_BALANCING_CONFIG.md

  ACT3_SCOPE.md
  ACT3_STATE_EXTENSIONS.md
  ACT3_SYSTEMS.md
  ACT3_UI_BLUEPRINT.md
  ACT3_ENDGAME_LOOPS.md
```

**ACT2_SCOPE.md**
- Act 2 goals and player-facing outcomes.
- Explicit in-scope and out-of-scope feature list for Act 2.
- Dependencies on MVP systems and constraints.

**ACT2_STATE_EXTENSIONS.md**
- Additive state fields for Act 2 with defaults.
- Save version bump notes and migration requirements.
- State ownership notes (which systems write/read each field).

**ACT2_SYSTEMS.md**
- Act 2 system list with responsibilities.
- How each system mutates `gameState`.
- Config values required for Act 2 systems.

**ACT2_UI_BLUEPRINT.md**
- Screen updates and any new panels for Act 2.
- Required UI data bindings to Act 2 state.
- Navigation changes (if any) within the single-page layout.

**ACT2_BALANCING_CONFIG.md**
- Act 2 tuning values and rationale.
- Progression curves tied to config values.
- Any new caps/thresholds and how they map to config.

**ACT3_SCOPE.md**
- Act 3 goals and player-facing outcomes.
- Explicit in-scope and out-of-scope feature list for Act 3.
- Dependencies on Act 2 systems and MVP constraints.

**ACT3_STATE_EXTENSIONS.md**
- Additive state fields for Act 3 with defaults.
- Save version bump notes and migration requirements.
- State ownership notes (which systems write/read each field).

**ACT3_SYSTEMS.md**
- Act 3 system list with responsibilities.
- How each system mutates `gameState`.
- Config values required for Act 3 systems.

**ACT3_UI_BLUEPRINT.md**
- Screen updates and any new panels for Act 3.
- Required UI data bindings to Act 3 state.
- Navigation changes (if any) within the single-page layout.

**ACT3_ENDGAME_LOOPS.md**
- Endgame loop definitions and player goals.
- Act 3 progression arcs and end conditions.
- How endgame loops integrate with existing systems.

## 7) Vision State Strategy (How gameState Evolves)
- MVP state schema stays backward compatible.
- Save versioning increases safely (v1 → v2 → v3).
- Import must migrate old saves forward.
- No destructive schema changes without migration.

## 8) Vision Build Strategy (Strict Order)
1. Act 2 documents first.
2. Act 2 systems + UI next.
3. Act 2 balancing + tuning.
4. Then Act 3 documents.
5. Then Act 3 systems + UI.
6. Endgame loops last.

## 9) Scope Safety Rails
- DO NOT mix Act 2/3 features into MVP code path.
- DO NOT add new storage mechanisms.
- DO NOT add network calls.
- DO NOT introduce modules/build tools/framework patterns.

This doc defines how we will document and implement Vision without corrupting MVP. Act 2 and Act 3 details must be written before any Vision code is implemented.
