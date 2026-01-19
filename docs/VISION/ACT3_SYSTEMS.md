# Act 3 Systems (Late Game + Endgame)

## 1) Systems Philosophy (Still MVP Rules)
- Systems mutate `gameState` only.
- UI never contains business logic.
- Systems never touch DOM or `localStorage`.
- Every action returns a Result object.
- Config-driven tuning only (no magic numbers).

## 2) Result Object Contract (Carry Forward)
Standard result shape (Act 2 + Act 3):

```
{
  ok: boolean,
  code: string,
  message: string,
  delta: object,
  events: array
}
```

Additions:
- Act 3 may include `metaDelta` if meta progression exists (optional).

## 3) Act 3 System Inventory (Map)

System | File | Reads | Writes | Depends On | New or Expanded?
--- | --- | --- | --- | --- | ---
Rival studios / competitive pressure | `/src/systems/competition.js` (new) | `rivals`, `market`, `player.reputation` | `rivals`, `market` | `CONFIG.rivals.*`, `CONFIG.market.*` | New
Structured high-impact events (Act 3) | `/src/systems/story.js` (extended) | `story.act3`, `player.day` | `story.act3` | `CONFIG.story.act3.*` | Expanded
Reputation branches (studio identity paths) | `/src/systems/progression.js` (extended) | `reputation`, `player.reputation`, `legacyMilestones` | `reputation`, `legacyMilestones` | `CONFIG.reputation.branches.*`, `CONFIG.legacyMilestones.*` | Expanded
Act 3 story arc progression | `/src/systems/story.js` (extended) | `story.act3`, `player.day` | `story.act3` | `CONFIG.story.act3.*` | Expanded
Optional automation (late-game QoL) | `/src/systems/automation.js` (new) | `automation`, `schedule`, `player`, `roster` | `automation`, `schedule` | `CONFIG.automation.*` | New
Content performance variance | `/src/systems/content.js` (new) + `/src/systems/analytics.js` (extended) | `content.entries`, `content.variance`, `analyticsHistory` | `content.entries`, `content.variance`, `analyticsHistory` | `CONFIG.content.variance.*`, `CONFIG.analytics.*` | New/Expanded
Advanced scheduling | `/src/systems/booking.js` (extended) | `schedule`, `roster`, `player` | `schedule`, `player.day` | `CONFIG.schedule.*` | Expanded
Legacy / recognition milestones | `/src/systems/milestones.js` (new) | `legacyMilestones`, `player`, `milestones` | `legacyMilestones` | `CONFIG.legacyMilestones.*` | New

Notes:
- Only systems listed in Act 3 scope are included.
- Prefer extending existing systems unless scope explicitly requires a new file.

## 4) System APIs (Per File)

### /src/systems/competition.js (Act 3 additions)
- Purpose (Act 3)
  - Track rival studio pressure and market shifts that affect late-game strategy without changing the core loop.
- New or expanded public functions (names + params + returns)
  - evaluateRivalStandings(gameState, context) -> Result
  - applyMarketShift(gameState, shiftId) -> Result
- State touched (explicit v3 paths)
  - Reads: `rivals`, `market`, `player.reputation`, `player.cash` (if impacts are economic).
  - Writes: `rivals`, `market`.
- Config dependencies (explicit CONFIG paths)
  - `CONFIG.rivals.*`
  - `CONFIG.market.*`
- Edge cases / failure modes
  - Unknown rival or shift ID → `{ ok:false, code:"rival_or_shift_not_found" }`.
  - Shift already applied → `{ ok:false, code:"shift_already_applied" }`.
- Acceptance criteria
  - Rival/market updates are deterministic and config-driven.
  - No UI or MVP systems break when rivals/market are absent.

### /src/systems/story.js (Act 3 additions)
- Purpose (Act 3)
  - Add Act 3 story events and structured high-impact events using existing story/event framework.
- New or expanded public functions (names + params + returns)
  - checkAct3StoryEvents(gameState, context) -> Result
  - applyAct3StoryEvent(gameState, eventId) -> Result
- State touched (explicit v3 paths)
  - Reads: `story.act3`, `player.day`, `milestones` (if gating is used).
  - Writes: `story.act3`.
- Config dependencies (explicit CONFIG paths)
  - `CONFIG.story.act3.*`
- Edge cases / failure modes
  - Event already completed → `{ ok:false, code:"event_already_completed" }`.
  - Event not eligible → `{ ok:false, code:"event_not_eligible" }`.
- Acceptance criteria
  - Act 3 events never trigger before Act 2 completion conditions.
  - Deterministic outcomes based on config + state only.

### /src/systems/progression.js (Act 3 additions)
- Purpose (Act 3)
  - Manage reputation branches and legacy milestones without altering MVP reputation rules.
- New or expanded public functions (names + params + returns)
  - selectReputationBranch(gameState, branchId) -> Result
  - advanceReputationBranch(gameState, branchId, context) -> Result
  - evaluateLegacyMilestones(gameState, context) -> Result
  - claimLegacyMilestone(gameState, milestoneId) -> Result
- State touched (explicit v3 paths)
  - Reads: `reputation`, `player.reputation`, `legacyMilestones`, `milestones`.
  - Writes: `reputation`, `legacyMilestones`.
- Config dependencies (explicit CONFIG paths)
  - `CONFIG.reputation.branches.*`
  - `CONFIG.legacyMilestones.*`
  - `CONFIG.milestones.*` (if used for gating).
- Edge cases / failure modes
  - Branch not found → `{ ok:false, code:"branch_not_found" }`.
  - Branch already selected → `{ ok:false, code:"branch_already_selected" }`.
  - Milestone not eligible → `{ ok:false, code:"milestone_not_eligible" }`.
- Acceptance criteria
  - MVP reputation remains intact when no branch is selected.
  - Legacy milestones are additive and do not replace Act 2 milestones.

### /src/systems/automation.js (Act 3 additions)
- Purpose (Act 3)
  - Provide opt-in automation for repetitive late-game actions without idle/AFK progression.
- New or expanded public functions (names + params + returns)
  - setAutomationRules(gameState, automationPayload) -> Result
  - runAutomationStep(gameState, context) -> Result
- State touched (explicit v3 paths)
  - Reads: `automation`, `schedule`, `player`, `roster`.
  - Writes: `automation`, `schedule`.
- Config dependencies (explicit CONFIG paths)
  - `CONFIG.automation.*`
- Edge cases / failure modes
  - Invalid automation payload → `{ ok:false, code:"invalid_automation" }`.
  - Automation disabled → `{ ok:false, code:"automation_disabled" }`.
- Acceptance criteria
  - Automation never bypasses booking validation rules.
  - Automation is disabled by default on migration.

### /src/systems/analytics.js (Act 3 additions, extended)
- Purpose (Act 3)
  - Summarize variance effects and late-game performance rollups using existing analytics history.
- New or expanded public functions (names + params + returns)
  - recordVarianceSnapshot(gameState, context) -> Result
  - getVarianceSummary(gameState, windowConfig) -> Result
- State touched (explicit v3 paths)
  - Reads: `content.entries`, `content.variance`, `analyticsHistory`.
  - Writes: `analyticsHistory`.
- Config dependencies (explicit CONFIG paths)
  - `CONFIG.content.variance.*`
  - `CONFIG.analytics.*`
- Edge cases / failure modes
  - Variance disabled → `{ ok:false, code:"variance_disabled" }`.
  - Invalid window config → `{ ok:false, code:"invalid_window" }`.
- Acceptance criteria
  - Variance rollups are additive to existing analytics.
  - No changes to MVP analytics output when variance is disabled.

### /src/systems/content.js (Act 3 additions)
- Purpose (Act 3)
  - Apply bounded, config-driven variance to content results.
- New or expanded public functions (names + params + returns)
  - applyContentVariance(gameState, contentId, context) -> Result
- State touched (explicit v3 paths)
  - Reads: `content.entries`, `content.variance`.
  - Writes: `content.entries`, `content.variance`.
- Config dependencies (explicit CONFIG paths)
  - `CONFIG.content.variance.*`
- Edge cases / failure modes
  - Content not found → `{ ok:false, code:"content_not_found" }`.
  - Variance config missing → `{ ok:false, code:"variance_config_missing" }`.
- Acceptance criteria
  - Variance is bounded and deterministic based on config and stored rolls.
  - Existing content history remains valid after migration.

### /src/systems/booking.js (Act 3 additions)
- Purpose (Act 3)
  - Add advanced scheduling and queue handling without introducing passive time.
- New or expanded public functions (names + params + returns)
  - queueBooking(gameState, bookingPayload) -> Result
  - resolveScheduledBookings(gameState, context) -> Result
- State touched (explicit v3 paths)
  - Reads: `schedule`, `roster`, `player`, `unlocks`.
  - Writes: `schedule`, `player.day`, `content.entries` (if resolution occurs).
- Config dependencies (explicit CONFIG paths)
  - `CONFIG.schedule.*`
  - `CONFIG.booking.*`
- Edge cases / failure modes
  - Queue full → `{ ok:false, code:"schedule_full" }`.
  - Booking invalid → `{ ok:false, code:"invalid_booking" }`.
- Acceptance criteria
  - Scheduling is optional and only active when enabled in config.
  - Day progression remains deterministic and player-driven.

### /src/systems/milestones.js (Act 3 additions)
- Purpose (Act 3)
  - Track legacy milestone definitions if not already housed in progression.js.
- New or expanded public functions (names + params + returns)
  - evaluateLegacyMilestones(gameState, context) -> Result
  - claimLegacyMilestone(gameState, milestoneId) -> Result
- State touched (explicit v3 paths)
  - Reads: `legacyMilestones`, `player`, `milestones`.
  - Writes: `legacyMilestones`.
- Config dependencies (explicit CONFIG paths)
  - `CONFIG.legacyMilestones.*`
- Edge cases / failure modes
  - Milestone not found → `{ ok:false, code:"milestone_not_found" }`.
  - Milestone already claimed → `{ ok:false, code:"milestone_already_claimed" }`.
- Acceptance criteria
  - Legacy milestones are additive and do not alter Act 2 milestone tracking.
  - Claiming a milestone returns a deterministic Result object.

## 5) Endgame Loop Mechanics (System-Level)
Based on Act 3 scope:
- Repeatable actions: high-stakes booking decisions, strategy adjustments, and event responses.
- Resets vs persists: no resets by default; all progression persists unless prestige/reset is explicitly confirmed.
- Milestones evaluation: legacy milestones and reputation branch progression are checked after key actions (booking completion, event resolution, or day advance) using config-defined thresholds.
- Prestige/reset: not supported in Act 3.

## 6) Scaling Controls / Soft Caps
- Market shift multipliers are capped between `0.85` and `1.15`.
- Variance multipliers are capped at ±15%.

## 7) Guardrails (No Online, No Frameworks)
Explicitly forbid:
- Networking or external calls.
- Async calls to remote services.
- Backend or database concepts.
- Module systems, bundlers, or framework dependencies.

## 8) Manual Testing Checklist (Act 3)
- Act 3 actions work and return Result objects without console errors.
- Migration v2 → v3 works with deterministic defaults.
- Export/import round-trips preserve Act 3 state.
- MVP and Act 2 loops still function without regressions.
- UI renders remain stable with Act 3 data present.

This doc defines Act 3 system APIs only. UI and config docs must match these APIs. Do not implement anything beyond ACT3_SCOPE.
