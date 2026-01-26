# Act 2 Scope (Post-MVP Expansion)

## 1) Act 2 Goal Statement
Act 2 delivers mid-game depth by expanding studio operations without changing the MVP core loop. Mid-game depth means the player faces more competing priorities (talent management, growth vs. stability, and longer-horizon planning) while still making the same clear book → results → analytics decisions. The loop remains simple and readable, but outcomes become more strategic through additive systems and clearer tradeoffs. Complexity increases through new systems that layer on top of MVP data and screens, not through new core loops or technical changes. MVP remains locked, and Act 2 only extends it where explicitly allowed by the Vision scope.

**Act 2 timeline:** Days 91–180. Day 90 ends Act 1; Day 91 begins Act 2.

## 2) Hard Boundary: What Act 2 Is Not
- No changes to MVP scope, screens, or rules beyond additive Act 2 extensions.
- No Act 3 systems, endgame loops, prestige, or rival studios.
- No online features, accounts, payments, backend, or database.
- No framework or build-tool migration; still vanilla HTML/CSS/JS.
- No features outside `docs/SCOPE_VISION.md` (anything else is out of scope).

## 3) Act 2 Feature List (Additive Only)

### A2.1 — Expanded Performer Management
- Summary (1–2 sentences)
  - Add contract lengths, retention checks, and availability rules that make roster planning a mid-game priority.
- Player Value (why it matters)
  - Creates meaningful tradeoffs in talent usage and long-term stability.
- MVP Dependencies (what must already exist)
  - MVP roster, fatigue/loyalty tracking, booking flow, save/load.
- New State Needed (high level keys; no deep schema yet)
  - `performerManagement` with `contracts`, `availability`, and `retentionFlags`.
- New/Updated Systems (which /src/systems/* it affects)
  - `systems/roster.js` (expanded), `systems/booking.js` (availability checks).
- UI Surfaces (which screens/panels)
  - Roster screen (new panels), Booking screen (availability indicators).
- Config Additions (what new tunables are required)
  - Contract lengths (core/freelance), renewal cost, loyalty thresholds, and max consecutive booking rules.
- Save/Load Considerations (versioning/migration notes)
  - Save schema v2 adds performer-management fields with safe defaults.
- Acceptance Criteria (specific + testable)
  - Each performer shows contract days remaining and availability status.
  - Booking prevents selection when fatigue is maxed or when max-consecutive usage is violated.
  - When a contract expires, the performer becomes inactive until renewal.
  - Save/load migration preserves existing roster data and initializes new fields.
- Out of Scope Notes (what this feature explicitly does not include)
  - No new performer currencies or negotiation minigames.

### A2.2 — Advanced Analytics
- Summary (1–2 sentences)
- Add 7-day and 30-day rollups for MRR, followers, and subscribers plus promo/premium split summaries.
- Player Value (why it matters)
  - Rewards informed choices and clarifies the impact of decisions over time.
- MVP Dependencies (what must already exist)
  - MVP analytics outputs, content history, and content results data.
- New State Needed (high level keys; no deep schema yet)
  - `analyticsHistory` entries captured every 7 days.
- New/Updated Systems (which /src/systems/* it affects)
  - `systems/analytics.js` (expanded aggregation and summaries).
- UI Surfaces (which screens/panels)
  - Analytics screen (new panels/sections).
- Config Additions (what new tunables are required)
  - Rollup windows: `[7, 30]`, snapshot frequency: `7`, and metric keys list.
- Save/Load Considerations (versioning/migration notes)
  - Migration initializes analytics aggregates from existing content history where possible.
- Acceptance Criteria (specific + testable)
  - Analytics screen displays 7-day and 30-day rollups.
  - Aggregates update after each completed loop and snapshot every 7 days.
  - Save/load retains analytics history without errors.
- Out of Scope Notes (what this feature explicitly does not include)
  - No charts or trend dashboards unless explicitly defined later.

### A2.3 — Additional Location Tiers
- Summary (1–2 sentences)
  - Add Tier 2 locations with higher costs and reputation-gated unlocks.
- Player Value (why it matters)
  - Provides new progression goals and strategic spend decisions.
- MVP Dependencies (what must already exist)
  - MVP location unlock flow, reputation gating, booking selection.
- New State Needed (high level keys; no deep schema yet)
  - `unlocks.locationTiers` with tier IDs and unlocked flags.
- New/Updated Systems (which /src/systems/* it affects)
  - `systems/progression.js`, `systems/booking.js` (location availability), `systems/shop.js`.
- UI Surfaces (which screens/panels)
  - Shop screen (new unlock cards), Booking screen (expanded location list).
- Config Additions (what new tunables are required)
  - Tier 2 locations, unlock costs, and reputation requirements.
- Save/Load Considerations (versioning/migration notes)
  - Migrate MVP’s tier-1 flag into the new tier structure safely.
- Acceptance Criteria (specific + testable)
  - Tier 2 locations appear only after meeting reputation thresholds and paying unlock cost.
  - Booking uses the correct tier list based on unlocks.
  - Save migration preserves the MVP tier-1 unlock state.
- Out of Scope Notes (what this feature explicitly does not include)
  - No equipment upgrades or non-location shop items.

### A2.4 — Equipment Upgrades
- Summary (1–2 sentences)
  - Add Lighting, Camera, and Set Dressing upgrades (3 levels each) that apply deterministic multipliers.
- Player Value (why it matters)
  - Introduces longer-term investment choices with visible benefits.
- MVP Dependencies (what must already exist)
  - MVP economy, shop purchase flow, content output calculation.
- New State Needed (high level keys; no deep schema yet)
  - `equipment` with upgrade levels per category.
- New/Updated Systems (which /src/systems/* it affects)
  - `systems/shop.js`, `systems/booking.js` or `systems/content.js` (apply equipment effects).
- UI Surfaces (which screens/panels)
  - Shop screen (equipment upgrade cards), Analytics screen (output notes).
- Config Additions (what new tunables are required)
- Upgrade cost tables and per-level OF subs/follower multipliers.
- Save/Load Considerations (versioning/migration notes)
  - Initialize equipment state with baseline values on migration.
- Acceptance Criteria (specific + testable)
  - Equipment upgrades can be purchased and persist across saves.
  - Content results reflect equipment modifiers where defined.
- Out of Scope Notes (what this feature explicitly does not include)
  - No cosmetic-only items or shop currencies.

### A2.5 — Additional Content Themes
- Summary (1–2 sentences)
  - Add five Act 2 themes (Luxury Retreat, Editorial, Downtown Chic, Sunlit Getaway, After Hours).
- Player Value (why it matters)
  - Adds variety and more strategic choices in bookings.
- MVP Dependencies (what must already exist)
  - MVP booking flow and content history.
- New State Needed (high level keys; no deep schema yet)
  - No new state required beyond config-driven theme catalogs (unless future validation requires it).
- New/Updated Systems (which /src/systems/* it affects)
  - `systems/booking.js`, `systems/content.js` (theme selection/impact).
- UI Surfaces (which screens/panels)
  - Booking screen (expanded theme list).
- Config Additions (what new tunables are required)
  - Theme definitions and modifiers for the Act 2 theme pack.
- Save/Load Considerations (versioning/migration notes)
  - Content history continues to store theme IDs; migration may add new theme catalog without altering existing entries.
- Acceptance Criteria (specific + testable)
  - New themes appear in booking and can be selected.
  - Existing saved content entries remain valid and display correctly.
- Out of Scope Notes (what this feature explicitly does not include)
  - No new content types beyond Promo/Premium.

### A2.6 — Long-Term Story Arcs (Act 2)
- Summary (1–2 sentences)
  - Add Act 2 narrative beats on Days 95, 120, 145, and 170.
- Player Value (why it matters)
  - Provides narrative context and goals beyond the initial debt arc.
- MVP Dependencies (what must already exist)
  - MVP Act 1 story system and day progression.
- New State Needed (high level keys; no deep schema yet)
  - `story.act2` with `eventsShown` array and `lastEventId`.
- New/Updated Systems (which /src/systems/* it affects)
  - `systems/story.js` (new Act 2 event logic).
- UI Surfaces (which screens/panels)
  - Hub or dedicated story panel within existing screens (no new screen required unless later validated).
- Config Additions (what new tunables are required)
  - Story event schedule and trigger conditions (`onDayStart`).
- Save/Load Considerations (versioning/migration notes)
  - Migrate story state with new act-2 flags defaulting to false.
- Acceptance Criteria (specific + testable)
  - Act 2 story events trigger based on day progression after Act 1 ends.
  - Story events do not alter MVP Act 1 flow.
- Out of Scope Notes (what this feature explicitly does not include)
  - No Act 3 story beats or endgame conditions.

### A2.7 — Expanded Roster Depth
- Summary (1–2 sentences)
  - Add four Act 2 performers and assign roles (Lead, Specialist, Support) with clear UI labels.
- Player Value (why it matters)
  - Increases planning depth and roster variety.
- MVP Dependencies (what must already exist)
  - MVP roster system, booking selection, and performer stats.
- New State Needed (high level keys; no deep schema yet)
  - `roster.performers` expands; `roster.performerRoles` maps performer IDs to roles.
- New/Updated Systems (which /src/systems/* it affects)
  - `systems/roster.js`, `systems/booking.js` (selection lists).
- UI Surfaces (which screens/panels)
  - Roster screen (expanded list), Booking screen (more performers).
- Config Additions (what new tunables are required)
  - Performer definitions, role categories, and role modifier values.
- Save/Load Considerations (versioning/migration notes)
  - Migration preserves existing performers and appends new ones with defaults.
- Acceptance Criteria (specific + testable)
  - New performers appear in roster and booking selection without breaking existing saves.
- Out of Scope Notes (what this feature explicitly does not include)
  - No performer trading or poaching systems.

### A2.8 — Deeper Social Strategy
- Summary (1–2 sentences)
  - Add three social strategies (Balanced, Growth Focus, Revenue Focus) that modify platform reach and subscriber conversion.
- Player Value (why it matters)
  - Encourages strategic platform use and planning for audience outcomes.
- MVP Dependencies (what must already exist)
  - MVP social platforms (Instagram/X) and promo posting.
- New State Needed (high level keys; no deep schema yet)
  - `social.strategy` with `activeStrategyId`.
- New/Updated Systems (which /src/systems/* it affects)
  - `systems/social.js` (expanded platform effects).
- UI Surfaces (which screens/panels)
  - Social screen (strategy controls/summary).
- Config Additions (what new tunables are required)
  - Strategy definitions with platform multipliers and conversion modifiers.
- Save/Load Considerations (versioning/migration notes)
  - Migration initializes social strategy fields with defaults.
- Acceptance Criteria (specific + testable)
  - Social screen exposes platform emphasis choices.
  - Posting results reflect selected strategy.
- Out of Scope Notes (what this feature explicitly does not include)
  - No additional platforms beyond Instagram and X unless explicitly added later.

### A2.9 — Studio Milestones
- Summary (1–2 sentences)
- Add milestones tied to MRR, followers, subscribers, and reputation thresholds.
- Player Value (why it matters)
  - Provides clear long-term goals and feedback for progress.
- MVP Dependencies (what must already exist)
  - MVP progression signals (reputation, unlocks).
- New State Needed (high level keys; no deep schema yet)
  - `milestones` array with completion flags and timestamps.
- New/Updated Systems (which /src/systems/* it affects)
  - `systems/progression.js` or `systems/milestones.js` (new tracking system).
- UI Surfaces (which screens/panels)
  - Hub screen (milestone summary), optional panel in Roster or Analytics.
- Config Additions (what new tunables are required)
  - Milestone definitions, thresholds, and reward text (no new currencies).
- Save/Load Considerations (versioning/migration notes)
  - Migration initializes milestone list and completion flags.
- Acceptance Criteria (specific + testable)
  - Milestones unlock/complete when conditions are met.
  - Milestones persist across saves and are visible on the Hub.
- Out of Scope Notes (what this feature explicitly does not include)
  - No rewards beyond clarity/visibility unless explicitly defined later.

## 4) Act 2 Screen Additions / UI Changes (High Level)
- New Screens (if any)
  - None required by current Vision scope.
- Updated Screens
  - Hub: milestone summary panel and Act 2 status messaging.
  - Booking: expanded performer/theme/location options and availability indicators.
  - Analytics: additional summary panels (advanced analytics).
  - Roster: expanded performer management panels.
  - Social: platform emphasis/strategy controls.
  - Shop: additional location tiers and equipment upgrades.
- UI Rules (act 2)
  - No routing frameworks or sub-apps.
  - All additions must fit into existing single-page screen containers.
  - No new screens unless explicitly documented and validated in scope.

## 5) Act 2 Economy & Progression Changes (High Level)
- New money sinks: equipment upgrades and additional location tiers (config-driven costs).
- New unlock gates: reputation and milestone-based gating for higher tiers (config-driven thresholds).
- New risk/reward mechanics: platform emphasis tradeoffs and performer retention pressures (config-driven effects).
- What stays stable from MVP economy: Promo vs Premium split, core booking loop, debt mechanics remain as implemented for Act 1.

## 6) Act 2 Data/Config Requirements
- Expanded performer management tuning (contracts/retention/availability) — fixed in `ACT2_BALANCING_CONFIG.md`.
- Advanced analytics rollups and time windows — 7/30-day windows with 7-day snapshots.
- Location tier definitions, costs, and unlock requirements — Tier 2 locations with reputation gates.
- Equipment upgrade definitions, costs, effects, caps — Lighting/Camera/Set upgrades, max level 3.
- Content theme catalog expansions — five Act 2 themes defined in `DATA_THEMES.md`.
- Act 2 story event triggers and schedules — days 95/120/145/170 (on day start).
- Social strategy modifiers and audience composition tuning — Balanced, Growth Focus, Revenue Focus strategies.
- Milestone definitions and threshold rules — MRR/followers/subscribers/reputation thresholds in config.

## 7) Act 2 Completion Checklist (Definition of Done)
- [ ] All A2 features listed above are implemented.
- [ ] No regressions or modifications to MVP scope or systems outside additive extensions.
- [ ] Save migration works from v1 → v2 with deterministic defaults.
- [ ] Export/import works for v2 saves.
- [ ] UI remains single-page, desktop-only, and performant.
- [ ] No magic numbers; all new tuning values are config-driven.
- [ ] Code boundaries preserved per MVP file structure rules.

## 8) Compatibility Rules (MVP Save Files)
- MVP saves must still load in Act 2.
- Migration must be deterministic and repeatable.
- If migration fails, preserve the current save and show a safe error.
- Save version key increments (v1 → v2) with documented migration steps.

## 9) Risk Register (Act 2 Only)
| Risk | Why It Matters | Mitigation |
| --- | --- | --- |
| Scope creep into Act 3 systems | Breaks MVP/Act 2 boundaries and increases risk. | Enforce this scope doc and block unlisted features. |
| UI complexity explosion | Reduces clarity and makes the app harder to navigate. | Keep additions to existing screens; avoid new screens unless validated. |
| Too many config knobs | Increases tuning overhead and errors. | Group config categories and keep defaults conservative. |
| Save breaking changes | Player progress loss is unacceptable. | Require v2 migration with defaults and validation. |
| Performance issues from heavier renders | Impacts usability on desktop-only target. | Keep render logic simple and avoid large DOM rebuilds. |
| Ambiguous performer systems | Confusing or inconsistent gameplay. | Use the fixed contract/retention rules from this doc and `ACT2_BALANCING_CONFIG.md`. |
| Economy imbalance from new sinks | Can stall progression or trivialize difficulty. | Gate changes behind config and test with conservative values. |
| Story/event logic conflicts | Can interrupt the core loop or Act 1 flow. | Keep Act 2 story after Act 1 and separate flags. |
| Social strategy overcomplication | Makes core loop opaque. | Keep social choices limited and explain outcomes clearly. |
| Migration uncertainty for analytics history | Can cause inconsistent results after upgrade. | Derive aggregates from existing content history during migration. |

Act 2 is complete only when the checklist passes and no Act 3 systems exist in the codebase.
