# Act 2 State Extensions (v2)

## 1) Rules of State Evolution
- MVP keys cannot be renamed or deleted.
- New keys must be additive and optional at first.
- All new keys must have safe defaults.
- All state changes must be representable in export/import JSON.
- Schema version must increase (v1 → v2).

## 2) Versioning Contract
- `gameState.version` is the single version source of truth (equivalent to `gameState.meta.saveVersion`).
- Accepted versions: v1 (MVP), v2 (Act 2).
- `save.js` must implement:
  - `detectVersion(saveObj)`
  - `migrateV1ToV2(saveObj)`
  - `validateV2(saveObj)`

## 3) MVP Baseline Snapshot (Reference Only)
- `/docs/MVP/MVP_STATE_MODEL.md` is authoritative for the full MVP schema.
- This document only lists Act 2 additive keys and defaults.

## 4) Act 2 Extensions — Additive Schema

### New Top-Level Keys (v2)
- performerManagement: object — contracts/retention/availability tracking — default: `{ contracts: {}, availability: {}, retentionFlags: {} }`
- analyticsHistory: array — historical analytics snapshots — default: `[]`
- equipment: object — equipment upgrade state — default: `{ lightingLevel: 0, cameraLevel: 0, setDressingLevel: 0 }`
- milestones: array — studio milestone tracking list — default: `[]`

### New Nested Keys Under Existing Branches (v2)
- unlocks.locationTiers: object — expanded location tier unlock states — default: `{ tier0: true, tier1: false, tier2: false }`
- story.act2: object — Act 2 story flags/event tracking — default: `{ eventsShown: [], lastEventId: null }`
- social.strategy: object — platform emphasis settings — default: `{ activeStrategyId: "balanced" }`
- roster.performerRoles: object — performer role definitions/assignments — default: `{}` (keyed by performerId)

## 5) Derived Values Are Not Stored
- Never store computed/derived values if they can be calculated at render-time or system-call-time.
- Examples: totals, per-tick income, computed multipliers. These belong in systems, not state.

## 5.1) Act 2 Record Shapes (Concrete)

### performerManagement.contracts[performerId]
```json
{
  "contractDaysRemaining": 90,
  "contractLengthDays": 90,
  "renewalCost": 500,
  "status": "active"
}
```

### performerManagement.availability[performerId]
```json
{
  "consecutiveBookings": 0,
  "restDaysRemaining": 0
}
```

### performerManagement.retentionFlags[performerId]
```json
{
  "warned": false,
  "left": false
}
```

### analyticsHistory entry
```json
{
  "day": 98,
  "windowDays": 7,
  "mrrDelta": 4200,
  "followers": 1200,
  "subscribers": 80,
  "promoCount": 4,
  "premiumCount": 3
}
```

### milestone record
```json
{
  "id": "ms_followers_1000",
  "completed": true,
  "completedAt": "2025-01-01T00:00:00.000Z"
}
```

## 6) Migration Plan: v1 → v2 (Deterministic)
Algorithm:
1) clone v1 object safely
2) ensure meta exists (if using `meta.saveVersion`); otherwise ensure `gameState.version` exists
3) set saveVersion = 2 (or set `gameState.version = 2` if using the MVP key)
4) add new keys with defaults only if missing
5) never overwrite existing user values
6) validate result
7) return migrated object

Pseudocode (short):
```
function migrateV1ToV2(v1):
  v2 = deepClone(v1)
  ensureMetaIfUsed(v2)
  v2.version = 2
  if v2.meta exists: v2.meta.saveVersion = 2
  if v2.performerManagement is missing: v2.performerManagement = {}
  if v2.analyticsHistory is missing: v2.analyticsHistory = []
  if v2.equipment is missing: v2.equipment = {}
  if v2.milestones is missing: v2.milestones = []
  if v2.unlocks.locationTiers is missing: v2.unlocks.locationTiers = {}
  if v2.story.act2 is missing: v2.story.act2 = {}
  if v2.social.strategy is missing: v2.social.strategy = {}
  if v2.roster.performerRoles is missing: v2.roster.performerRoles = {}
  validateV2(v2)
  return v2
```

## 7) Validation Rules (v2)
- Required MVP branches exist.
- New v2 branches exist (or get defaulted).
- Numeric fields must be finite numbers.
- Arrays must be arrays.
- Protect against null/undefined objects.

## 8) Save Corruption Safety
- If import validation fails → do not overwrite current gameState.
- Show a safe user-facing message (no crash).
- Keep last known good save in localStorage untouched.

## 9) State Change Ownership
- state.js owns schema defaults.
- systems/*.js mutate state.
- save.js persists state.
- ui reads state and triggers actions only.

## 10) Act 2 State “Diff” Summary
- Added: performerManagement, analyticsHistory, equipment, milestones, unlocks.locationTiers, story.act2, social.strategy, roster.performerRoles.
- Unchanged: MVP branches.
- Removed: none.

This doc defines Act 2’s additive state only. Any system changes must be implemented via systems modules and config-driven values. MVP saves must continue to load via migration.
