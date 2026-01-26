> **Status:** Vision reference only. This document is not authoritative for the current build.
> Current behavior lives in `docs/CORE_GAMEPLAY_LOOP.md` and `docs/GAMESTATE_DATA_MODEL.md`.

> Note: Current runtime config lives in `src/config.js`; `config.toml` is legacy.

# Act 3 State Extensions (v3)

## 1) State Evolution Rules (Carry Forward)
- MVP keys cannot be renamed or deleted.
- Act 2 keys cannot be renamed or deleted.
- New Act 3 keys must be additive and optional.
- Safe defaults required.
- All state must serialize cleanly to JSON.

## 2) Versioning Contract (v1 → v2 → v3)
- `gameState.version` is the single source of truth for save versioning.
- Accepted versions: 1, 2, 3.
- `save.js` required functions:
  - `detectVersion(saveObj)`
  - `migrateV1ToV2(saveObj)`
  - `migrateV2ToV3(saveObj)`
  - `validateV3(saveObj)`

## 3) Baseline References
- MVP schema: `/docs/MVP/MVP_STATE_MODEL.md`
- Act 2 additions: `/docs/VISION/ACT2_STATE_EXTENSIONS.md`

## 4) Act 3 Extensions — Additive Schema (v3)
List ONLY the new keys introduced by Act 3.

### New Top-Level Keys (v3)
- metaProgression: object — endgame/meta progression bucket — default: `{ legacyScore: 0 }`
- rivals: object — rival studio metadata/standings — default: `{ studios: [], lastCheckDay: 0 }`
- market: object — market shift flags/modifiers — default: `{ activeShiftId: null, shiftHistory: [] }`
- automation: object — optional automation settings — default: `{ enabled: false, autoBookEnabled: false, autoPostEnabled: false, minCashReserve: 1000, maxActionsPerDay: 1 }`
- legacyMilestones: array — legacy milestone tracking list — default: `[]`
- reputation: object — Act 3 reputation branch tracking — default: `{ branchId: null, branchProgress: 0 }`

### New Nested Keys Under Existing Branches (v3)
- story.act3: object — Act 3 story/event flags — default: `{ eventsShown: [], lastEventId: null }`
- content.variance: object — content performance variance settings/logs — default: `{ enabled: true, seed: null, rollLog: [] }`

Notes:
- `reputation` is a new top-level bucket for branch identity (e.g., `branchId`, `branchProgress`) without altering `player.reputation`.
- Prestige/reset mechanics are not supported; `metaProgression` stores legacy score only.

## 5) Derived Values Are Not Stored (Hard Rule)
- No cached totals/multipliers stored unless necessary.
- Prefer recompute in systems from config + state.

## 5.1) Act 3 Record Shapes (Concrete)

### rivals.studios entry
```json
{
  "id": "rival_night_slate",
  "name": "Night Slate Media",
  "reputationScore": 55,
  "weeklyGrowthRate": 1.03
}
```

### market.shiftHistory entry
```json
{
  "shiftId": "shift_premium_boom",
  "dayApplied": 225
}
```

### legacyMilestones entry
```json
{
  "id": "legacy_revenue_250k",
  "completed": false,
  "completedAt": null
}
```

## 6) Migration Plan: v2 → v3 (Deterministic)
Algorithm:
1) clone v2 safely
2) set version = 3
3) add new Act 3 keys with defaults if missing
4) do not overwrite existing values
5) validate v3
6) return migrated object

Pseudocode (short):
```
function migrateV2ToV3(v2):
  v3 = deepClone(v2)
  v3.version = 3
  if v3.metaProgression is missing: v3.metaProgression = {}
  if v3.rivals is missing: v3.rivals = {}
  if v3.market is missing: v3.market = {}
  if v3.automation is missing: v3.automation = {}
  if v3.legacyMilestones is missing: v3.legacyMilestones = []
  if v3.reputation is missing: v3.reputation = {}
  if v3.story.act3 is missing: v3.story.act3 = {}
  if v3.content.variance is missing: v3.content.variance = {}
  validateV3(v3)
  return v3
```

## 7) Validation Rules (v3)
Checklist:
- MVP branches exist.
- Act 2 branches exist.
- Act 3 branches exist or default.
- numbers are finite.
- arrays are arrays.
- objects not null.

## 8) Save Corruption Safety
Rules:
- Import failures never overwrite current save.
- Keep last known good in localStorage.
- Provide safe user-facing error messaging.

## 9) State Change Ownership (Boundaries)
Reinforce module boundaries:
- state.js defines defaults.
- systems mutate.
- save.js persists/migrates.
- UI only triggers and renders.

## 10) State Diff Summary
- Added in v3: metaProgression, rivals, market, automation, legacyMilestones, reputation, story.act3, content.variance.
- Unchanged: MVP + Act 2.
- Removed: none.

This doc defines Act 3’s additive state only. Any endgame logic must be implemented in systems with config-driven values and safe migrations.
