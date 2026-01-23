# CURRENT SCOPE (Authoritative)

## Current Phase
- **Act 2 Phase 1 — Save Version v2 (New Games Only)** – Post-MVP work is focused on a v2 save schema and reset-on-incompatible-save behavior.
- **Act 2 Option A (Slice 1) — Equipment Upgrades + Multipliers** – Add Shop equipment upgrade purchases and apply equipment multipliers to follower/subscriber and revenue gains, as explicitly listed below.
- **Act 2 Option A (Slice 2) — Location Tiers (Tier 1 Unlock Only)** – Add Shop unlock for Location Tier 1; Tier 1 locations remain locked until purchased, but Premium shoots are not gated by this unlock.

## Completed (Confirmed)
- Advance Day button complete.
- Act 1 Content Pack 01 + 02 story events complete (if present).
- Freelancer differentiation complete: rotating personas, One-Off Buzz modifiers, Booking filter, and Roster Freelancer Pool.

## Act 1 Time Control (Locked)
- **Manual Advance Day is intentional and player-facing**: the UI “Advance Day” action is an MVP feature and is in scope.
- **Primary time progression for Act 1**: time advances only when the player triggers Advance Day after the required shoots; this is the canonical pacing/testing mechanism for Act 1.
- **No automation yet**: automated/background day progression is explicitly out of scope until a later Act.

## In Scope Now (Act 2 Phase 1 — Save v2, New Games Only)
- **Bump save version to v2** using `gameState.meta.version`.
- **Add v2 defaults** per the Act 2 state extensions document(s) referenced in the plan (additive-only fields).
- **Reset on incompatible save:** If a loaded or imported save is not v2, the game resets to a fresh v2 save and clearly notifies the player (no silent failures).
- **Export/import behavior stays consistent** with the “new games only” decision: exports represent v2 saves; imports of non-v2 saves trigger reset + message.

## In Scope Now (Act 2 Option A — Equipment Upgrades + Multipliers)
- **Shop equipment upgrades** for lighting, camera, and set dressing using `CONFIG.equipment.*` costs/levels, stored in `gameState.equipment.*`.
- **Upgrade purchase UI** in the Shop screen (levels, costs, upgrade button states).
- **Equipment multipliers** applied after base deltas for followers/subscribers and revenue using config-driven multipliers.

## In Scope Now (Act 2 Option A — Location Tiers Slice 2)
- **Location Tier 1 unlock** as a single Shop purchase using config-driven cost and name.
- **Shop UI section** listing Location Tiers (Tier 0 default unlocked, Tier 1 purchasable).
- **Location lock behavior**: Tier 1 locations remain locked until Tier 1 is purchased; Premium bookings are allowed without the Tier 1 unlock.
- **Unlock persistence**: `gameState.unlocks.locationTiers.tier1` is authoritative; keep `locationTier1Unlocked` in sync for backward compatibility.

## In Scope Now (Act 2 Option A — Location Tiers Slice 3)
- **Location Tier 2 unlock** as a single Shop purchase using config-driven cost and reputation requirement.
- **Tier 2 location access**: Tier 2 locations appear in Booking but are disabled until Tier 2 is purchased and reputation meets the requirement.
- **Tier 2 only**: no Tier 3 unlocks, no new screens or systems.

## In Scope Now (Act 2 Theme Pack A2.5)
- **Act 2 Theme Pack (A2.5) — Additional Content Themes (5 themes)**.

## In Scope Now (Act 2 A2.7 — Expanded Roster Depth)
- **Add four Act 2 performers** to the roster catalog and booking selection via config-driven IDs.
- **Assign performer roles** (Lead/Specialist/Support) using data-driven role mappings.
- **Display role labels** on Roster and Booking screens alongside existing performer stats.
- **Existing v2 saves** append the new performers and role assignments without resetting.

## In Scope Now (Act 2 A2.1 — Expanded Performer Management)
- **Performer contracts** with days remaining and expired status, config-driven by performer type.
- **Availability rules**: rest-day requirements, max-consecutive bookings per day, and fatigue-based blocking.
- **Booking validation** blocks selection/confirmation for unavailable performers with clear messaging.
- **Roster + Booking UI indicators** for contract days, rest days, and booking streaks.
- **Contract renewal** action in the Roster with cash cost and safe save persistence.
- **Save migration safety**: existing v2 saves backfill performer-management entries without resets.

## In Scope Now (Manual Social Strategy Selection — Single Active Strategy)
- **Strategy list UI** on the existing Social screen showing all strategies from the social strategy data catalog.
- **Single active selection** stored as `gameState.social.activeSocialStrategyId` with one strategy active at a time.
- **Selection feedback** via the existing UI event modal confirming activation.
- **Follower gain modifiers** applied during social posting using the selected strategy multipliers (no formula rebalance).
- **Persistence**: active strategy selection is saved and restored on refresh.
- **Manual Social Strategy (Daily Budget Allocation)**: allocate a daily social budget across Tease/Collabs/Ads and apply once per day to convert spend into followers/subscribers, with immediate feedback and persistence.

## In Scope Now (Automation Tier 1 — Auto-Book on Advance Day)
- **Automation Tier 1**: add a single toggle for **Auto-Book (1/day)** that runs only when the player clicks **Advance Day**; **no auto-run days, no scheduling UI, and no multi-tier automation**.

## In Scope Now (Act 2 Option A — Milestone Trigger Resolution)
- **Milestone trigger detection** using `CONFIG.milestones` to mark milestones as completed exactly once.
- **Reward application** from milestone data (cash/followers/subscribers/reputation/unlock flags if defined).
- **Player-facing milestone messages** emitted immediately on trigger using the existing UI event system.
- **One-time guarantee**: completed milestones persist in `gameState.milestones` and never re-trigger on refresh.

## In Scope Now (Act 1 UI Integration — Performer Portraits v1)
- **Performer portraitPath field** added to performer data using placeholder image paths or data URIs.
- **Roster + Booking thumbnails** rendered from the same portrait resolver with a safe fallback.
- **Placeholder-only visuals**: no NSFW assets, no gallery viewer, no new screens or navigation.

## In Scope Now (Act 1 UI Integration — Location Thumbnails v1)
- **Location Thumbnails v1 (placeholders only)**: add location.thumbnailPath, render in Locations UI + Booking UI, fallback placeholder.

## In Scope Now (Act 1 UI Integration — Shoot Output Cards v1)
- **Shoot output records** are created when a shoot completes and persisted in a capped history list.
- **Gallery screen cards** render placeholder thumbnails with minimal metadata (day, tier, performers, revenue/followers).
- **Placeholder-only visuals**: no gallery viewer, no new screens or navigation, no explicit assets.

## In Scope Now (Act 2 UI Enhancement — Advanced Analytics Rollups)
- **Advanced Analytics Rollups**: read-only 7/30 day rollup summaries on the existing Analytics screen (no new navigation or screens).
- **Periodic analytics snapshots** recorded at a config-driven cadence for display in the Analytics screen history list.
- **No new authoring controls or refactors**: data-only enhancement using the existing save/export/import paths.

## In Scope Now (Act 1 UI Integration — Story Log)
- **Story Log screen** added to the main navigation as a read-only history of triggered story events.
- **Event history list** shows newest-first entries with day label, title, and short preview.
- **Reuse the existing modal** to view full story event text when a log entry is selected.
- **No new story systems**: no branching, no authoring tools, no new content beyond existing packs.
- **Act 2 Story Events Pack (Days 95/120/145/170)** — triggers + Story Log entries.

## Explicitly Out of Scope (Act 2 Phase 1)
- **Any migration helpers** (no detectVersion, migrateV1ToV2, or similar migration utilities).
- **Act 2 mechanics expansion** beyond the v2 schema defaults + reset behavior and the explicitly listed equipment upgrades and location tier slice.
- **New UI screens/panels** or navigation changes beyond the approved Story Log screen.
- **Refactors or new systems** unrelated to the v2 schema bump and reset behavior.
- **Automated/background day progression** or passive time simulation.
- **Mobile/responsive work**, online features, frameworks, build tooling, or backend services.

## Definition of Done (Act 2 Phase 1)
- [ ] `gameState.meta.version` is set to v2 for new saves.
- [ ] v2 defaults match the Act 2 extensions docs referenced in the Master Implementation Plan.
- [ ] Loading or importing a non-v2 save resets to a new v2 save and displays a clear player message.
- [ ] Export/import continues to work for v2 saves without silent failures.
- [ ] Equipment upgrades are implemented only as defined in scope (Shop purchases + multipliers).
- [ ] Location Tier 1 unlock is purchasable in Shop and Tier 1 locations stay locked until purchased (Premium shoots are not gated).
- [ ] Milestones trigger once, apply data-driven rewards, and show player-facing messages via the existing event system.
- [ ] Social strategy selection is manual, single-active, affects follower gains, persists on refresh, and confirms activation via the event system.
- [ ] No new systems, screens, or refactors were introduced beyond the listed scope.
- [ ] CHANGELOG.md updated to record the doc change.
- [ ] Roster and Booking screens render performer portrait placeholders with a safe fallback.
- [ ] Story Log screen lists triggered story events newest-first and opens the existing modal for full text.
- [ ] Analytics screen shows config-driven rollups and recent snapshots without changing pacing or navigation.

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
