# Act 2 Systems (Gameplay Logic)

## 1) Systems Philosophy (Still MVP-Style)
- Systems mutate `gameState` in controlled ways.
- Systems contain logic; UI does rendering + event wiring.
- Systems must not touch DOM or `localStorage`.
- Functions return result objects for UI messaging.
- Config-driven values only.

## 2) Act 2 System Inventory (Map)

System | File | Reads | Writes | Depends On (MVP) | New in Act 2?
--- | --- | --- | --- | --- | ---
Economy adjustments (Act 2 sinks/outputs) | `/js/systems/economy.js` | `player`, `content`, `equipment` | `player.cash`, `player.lifetimeRevenue` (if used) | MVP economy + content results | No (extended)
Performer management (contracts/availability/retention) | `/js/systems/performers.js` | `roster`, `performerManagement` | `roster.performers[*]`, `performerManagement` | MVP roster + fatigue/loyalty | No (extended)
Booking + theme expansion | `/js/systems/booking.js` | `roster`, `unlocks`, `equipment`, `config` | `content.entries`, `content.lastContentId`, `player.cash`, `player.day` | MVP booking flow | No (extended)
Social strategy | `/js/systems/social.js` | `social`, `content`, `player` | `social.posts`, `social.strategy`, `player.followers`, `player.subscribers` | MVP social posting | No (extended)
Progression + location tiers + milestones | `/js/systems/progression.js` | `player`, `unlocks`, `milestones` | `unlocks.locationTiers`, `player.reputation`, `milestones` | MVP progression + Tier 1 unlock | No (extended)
Story (Act 2 arcs) | `/js/systems/story.js` | `story`, `player` | `story.act2` | MVP Act 1 story system | No (extended)
Advanced analytics aggregation | `/js/systems/analytics.js` (new) | `content`, `social`, `player` | `analyticsHistory` | MVP analytics outputs + content history | Yes
Shop purchases (equipment + location tiers) | `/js/systems/shop.js` (new) | `player`, `unlocks`, `equipment` | `player.cash`, `unlocks.locationTiers`, `equipment` | MVP shop flow | Yes

Notes:
- New files (`analytics.js`, `shop.js`) are added because Act 2 scope explicitly introduces advanced analytics and equipment/expanded shop purchases. These should remain small and focused, or be folded into existing systems if the MVP structure is finalized differently.
- If MVP retains a single shop system under `progression.js`, then `/js/systems/shop.js` should be omitted and its API merged into `progression.js`.

## 3) Required Result Object Shape (Standardized)
All system actions return the same shape:

```
{
  ok: boolean,
  code: string,            // stable result code (for UI copy)
  message: string,         // human readable
  delta: object,           // optional summary of changes (money, stats)
  events: array,           // optional event payloads for UI (toasts/log)
}
```

Hard rules:
- No throwing exceptions for expected outcomes (like insufficient funds).
- Always return `{ ok: false, ... }` for blocked actions.

## 4) System APIs (Per File)

### /js/systems/economy.js
- Purpose
  - Apply Act 2 economic effects (costs, payouts, maintenance) without breaking MVP rules.
- Public functions (names + parameters + returns)
  - applyContentRevenue(gameState, contentId) -> Result
  - applyRecurringCosts(gameState, context) -> Result
- State touched (explicit keys)
  - Reads: `content.entries`, `equipment` (if it modifies output), `player`.
  - Writes: `player.cash`, `player.lifetimeRevenue` (if used in MVP).
- Config dependencies (explicit CONFIG paths)
  - `CONFIG.economy.*` (TBD: Act 2 modifiers and cost entries).
  - `CONFIG.equipment.*` (TBD: if equipment affects revenue).
- Edge cases / failure modes
  - Content not found → `{ ok:false, code:"content_not_found" }`.
  - Negative or NaN revenue → clamp or reject with `{ ok:false, code:"invalid_revenue" }`.
- Acceptance criteria
  - Economic adjustments are additive to MVP calculations.
  - No MVP values are overwritten; only Act 2 additions apply when enabled.

### /js/systems/performers.js
- Purpose
  - Extend performer management with Act 2 retention/availability (details TBD).
- Public functions (names + parameters + returns)
  - updatePerformerAvailability(gameState, performerId, context) -> Result
  - applyRetentionCheck(gameState, performerId, context) -> Result
- State touched (explicit keys)
  - Reads: `roster.performers`, `performerManagement`.
  - Writes: `roster.performers[*]`, `performerManagement`.
- Config dependencies (explicit CONFIG paths)
  - `CONFIG.performers.*` (existing MVP fields).
  - `CONFIG.performerManagement.*` (TBD: contract/retention rules).
- Edge cases / failure modes
  - Performer not found → `{ ok:false, code:"performer_not_found" }`.
  - Availability rule conflict → `{ ok:false, code:"performer_unavailable" }`.
- Acceptance criteria
  - Availability checks integrate with booking without blocking MVP-only flows.
  - Retention logic is additive and does not remove MVP performers without explicit scope approval.

### /js/systems/booking.js
- Purpose
  - Expand booking to support new themes and location tiers while maintaining MVP loop.
- Public functions (names + parameters + returns)
  - validateBooking(gameState, bookingPayload) -> Result
  - confirmBooking(gameState, bookingPayload) -> Result
  - applyThemeModifiers(gameState, contentEntry) -> Result
- State touched (explicit keys)
  - Reads: `roster.performers`, `unlocks.locationTiers`, `equipment`, `player`.
  - Writes: `content.entries`, `content.lastContentId`, `player.cash`, `player.day`.
- Config dependencies (explicit CONFIG paths)
  - `CONFIG.locations.*` (TBD tiers and costs).
  - `CONFIG.themes.*` (TBD theme catalog + modifiers).
  - `CONFIG.booking.*` (TBD booking rules).
- Edge cases / failure modes
  - Location locked → `{ ok:false, code:"location_locked" }`.
  - Theme unknown → `{ ok:false, code:"invalid_theme" }`.
  - Performer unavailable (Act 2) → `{ ok:false, code:"performer_unavailable" }`.
- Acceptance criteria
  - MVP bookings still succeed with MVP locations/themes.
  - Act 2 options appear only when unlocked.

### /js/systems/social.js
- Purpose
  - Add platform emphasis/strategy while keeping MVP posting flow intact.
- Public functions (names + parameters + returns)
  - setSocialStrategy(gameState, strategyPayload) -> Result
  - postPromoContent(gameState, contentId, platform) -> Result
- State touched (explicit keys)
  - Reads: `social.strategy`, `content.entries`, `player`.
  - Writes: `social.posts`, `social.strategy`, `player.followers`, `player.subscribers`.
- Config dependencies (explicit CONFIG paths)
  - `CONFIG.social_platforms.*` (MVP platforms).
  - `CONFIG.social.strategy.*` (TBD platform emphasis modifiers).
- Edge cases / failure modes
  - Non-promo content selected → `{ ok:false, code:"promo_required" }`.
  - Strategy payload invalid → `{ ok:false, code:"invalid_strategy" }`.
- Acceptance criteria
  - Strategy changes only modify results when Act 2 is enabled.
  - MVP posting remains deterministic and valid without strategy selections.

### /js/systems/progression.js
- Purpose
  - Manage location tier unlocks, reputation gates, and milestones.
- Public functions (names + parameters + returns)
  - unlockLocationTier(gameState, tierId) -> Result
  - checkMilestones(gameState, context) -> Result
- State touched (explicit keys)
  - Reads: `player.reputation`, `unlocks.locationTiers`, `milestones`.
  - Writes: `unlocks.locationTiers`, `player.reputation` (if affected), `milestones`.
- Config dependencies (explicit CONFIG paths)
  - `CONFIG.locations.tiers.*` (TBD tier definitions).
  - `CONFIG.milestones.*` (TBD milestone list + thresholds).
- Edge cases / failure modes
  - Tier already unlocked → `{ ok:false, code:"tier_already_unlocked" }`.
  - Reputation too low → `{ ok:false, code:"insufficient_reputation" }`.
- Acceptance criteria
  - MVP Tier 1 unlock migrates into tier structure cleanly.
  - Milestones update without changing MVP screens or flow.

### /js/systems/story.js
- Purpose
  - Add Act 2 story beats after Act 1 while preserving Act 1 pacing.
- Public functions (names + parameters + returns)
  - checkAct2StoryEvents(gameState, context) -> Result
  - applyStoryEvent(gameState, eventId) -> Result
- State touched (explicit keys)
  - Reads: `story`, `player.day`.
  - Writes: `story.act2`.
- Config dependencies (explicit CONFIG paths)
  - `CONFIG.story.act2.*` (TBD event schedule + triggers).
- Edge cases / failure modes
  - Event already completed → `{ ok:false, code:"event_already_completed" }`.
  - Event not eligible → `{ ok:false, code:"event_not_eligible" }`.
- Acceptance criteria
  - Act 2 events do not trigger before Act 1 debt arc ends.
  - Story events return safe UI messages and do not mutate unrelated state.

### /js/systems/analytics.js (new)
- Purpose
  - Aggregate advanced analytics from content/social history.
- Public functions (names + parameters + returns)
  - recordAnalyticsSnapshot(gameState, context) -> Result
  - getAnalyticsSummary(gameState, windowConfig) -> Result
- State touched (explicit keys)
  - Reads: `content.entries`, `social.posts`, `player`.
  - Writes: `analyticsHistory`.
- Config dependencies (explicit CONFIG paths)
  - `CONFIG.analytics.*` (TBD rollup windows and metrics).
- Edge cases / failure modes
  - No content history → `{ ok:false, code:"no_content_history" }`.
  - Invalid window config → `{ ok:false, code:"invalid_window" }`.
- Acceptance criteria
  - Aggregates derive from existing content history (no new data required).
  - MVP analytics values remain unchanged; Act 2 summary is additive only.

### /js/systems/shop.js (new)
- Purpose
  - Handle equipment upgrades and expanded location tier purchases.
- Public functions (names + parameters + returns)
  - purchaseEquipmentUpgrade(gameState, upgradeId) -> Result
  - purchaseLocationTier(gameState, tierId) -> Result
- State touched (explicit keys)
  - Reads: `player.cash`, `unlocks.locationTiers`, `equipment`.
  - Writes: `player.cash`, `unlocks.locationTiers`, `equipment`.
- Config dependencies (explicit CONFIG paths)
  - `CONFIG.equipment.upgrades.*` (TBD upgrade definitions, costs, effects).
  - `CONFIG.locations.tiers.*` (TBD tier costs and requirements).
- Edge cases / failure modes
  - Insufficient funds → `{ ok:false, code:"insufficient_funds" }`.
  - Upgrade not found → `{ ok:false, code:"upgrade_not_found" }`.
- Acceptance criteria
  - Purchases are additive and do not remove MVP Tier 1 unlock behavior.
  - Equipment upgrades persist in v2 saves and survive export/import.

## 5) Tick / Turn / Time Model (Act 2)
- MVP model remains: day advances after each completed shoot loop.
- Act 2 additions: TBD (requires validation from source repo).
  - If any cooldowns or recovery timers are introduced, they must be config-driven and must not add passive/AFK time.

## 6) Upgrade / Modifier Rules (If Applicable)
TBD — optional Act 2 extension (only if equipment upgrades are confirmed in source scope).
- Storage: `equipment` branch in `gameState` with upgrade levels mapped by ID.
- Influence: apply modifiers through `economy.js` and/or `booking.js` using config-defined multipliers.
- Stacking: define additive vs multiplicative rules per upgrade in config (TBD).
- All values must be config-driven; no hard-coded multipliers.

## 7) Event System Rules (If Applicable)
TBD — Act 2 story events only if defined in scope.
- Selection: scheduled by day thresholds and flags in `story.act2` (TBD).
- Cooldowns: config-driven; no random events unless explicitly allowed.
- History: stored in `story.act2` flags or event log (TBD).

## 8) Guardrails (No Scope Drift Into Act 3)
Explicitly forbid:
- Prestige loops.
- Endgame rebirth.
- Infinite scaling mechanics.
- Rival studios or competition systems.
- Any Act 3-only systems from Vision docs.

## 9) Testability Checklist (Manual Testing)
Per system, quick manual checks:
- Economy
  - Action succeeds (revenue applied after content result).
  - Action fails safely (invalid content ID returns a blocked Result).
- Performers
  - Action succeeds (availability updates in roster).
  - Action fails safely (unavailable performer blocked).
- Booking
  - Action succeeds (booking with new theme and unlocked tier).
  - Action fails safely (locked tier blocked).
- Social
  - Action succeeds (post with selected strategy updates followers/subscribers).
  - Action fails safely (non-promo post blocked).
- Progression
  - Action succeeds (tier unlock or milestone completion).
  - Action fails safely (insufficient reputation or already unlocked).
- Story
  - Action succeeds (Act 2 event triggers after Act 1 ends).
  - Action fails safely (event already completed).
- Analytics
  - Action succeeds (snapshot recorded from existing history).
  - Action fails safely (no history returns blocked Result).
- Shop
  - Action succeeds (equipment upgrade purchase).
  - Action fails safely (insufficient funds).
- Save/Load
  - Saves persist with new Act 2 keys.
  - Export/import round-trip preserves Act 2 data.
- UI
  - UI updates correctly after each action result.

This doc defines the system APIs for Act 2. UI and config docs must be updated to match these APIs. Implementation must not add new mechanics beyond what Act 2 scope allows.
