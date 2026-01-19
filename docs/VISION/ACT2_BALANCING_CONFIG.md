# Act 2 Balancing & Config (v2)

## 1) Config Philosophy (Still MVP Rules)
- All tunables live in `CONFIG` (single object).
- No magic numbers in systems or UI.
- Config structure must be stable and readable.
- Config values must be grouped by system.

## 2) Config Versioning
- `CONFIG.meta.configVersion` is the single source of truth for config versioning.
- MVP baseline = v1.
- Act 2 additions = v2.
- No breaking renames/removals from v1; Act 2 only adds new keys/subkeys.

## 3) New Config Categories (Act 2)

### CONFIG.performerManagement
- Purpose
  - Act 2 performer contracts, retention checks, and availability rules.
- Used by
  - `/src/systems/performers.js` (`updatePerformerAvailability`, `applyRetentionCheck`)
  - `/src/systems/booking.js` (availability validation)
- Values

| key | type | meaning | default value |
| --- | --- | --- | --- |
| availabilityRules | object | Booking eligibility rules (max consecutive bookings + forced rest). | `{ maxConsecutiveBookings: 2, restDaysAfterMax: 1 }` |
| retentionRules | object | Loyalty thresholds and cadence. | `{ loyaltyWarningThreshold: 40, loyaltyLeaveThreshold: 25, loyaltyGainPerBooking: 1, loyaltyDecayPerWeekIdle: 2 }` |
| contractRules | object | Contract lengths and renewal costs. | `{ coreLengthDays: 90, freelanceLengthDays: 30, coreRenewalCost: 500, freelanceRenewalCost: 250 }` |

### CONFIG.analytics
- Purpose
  - Act 2 advanced analytics rollups and summary windows.
- Used by
  - `/src/systems/analytics.js` (`recordAnalyticsSnapshot`, `getAnalyticsSummary`)
- Values

| key | type | meaning | default value |
| --- | --- | --- | --- |
| rollupWindowsDays | array | Time windows (in days) for rollup summaries. | `[7, 30]` |
| metricKeys | array | Metric identifiers included in advanced summaries. | `["revenue", "followers", "subscribers", "promoCount", "premiumCount"]` |
| snapshotFrequencyDays | number | How often to capture analytics snapshots. | `7` |

### CONFIG.locations.tiers
- Purpose
  - Additional location tiers with costs/benefits and unlock requirements.
- Used by
  - `/src/systems/progression.js` (tier unlock checks)
  - `/src/systems/booking.js` (tier availability)
  - `/src/systems/shop.js` (tier purchases)
- Values

| key | type | meaning | default value |
| --- | --- | --- | --- |
| tierOrder | array | Ordered list of tier IDs. | `["tier0", "tier1", "tier2"]` |
| tiers | object | Map of tier definitions (costs, requirements, effects) keyed by tier ID. | `{ "tier0": { "unlockCost": 0, "requiredReputation": 0 }, "tier1": { "unlockCost": 2000, "requiredReputation": 10 }, "tier2": { "unlockCost": 4000, "requiredReputation": 20 } }` |
| defaultTierId | string | Tier ID used when no other tiers are unlocked. | `"tier0"` |

### CONFIG.equipment
- Purpose
  - Equipment upgrades that affect output quality (deterministic multipliers).
- Used by
  - `/src/systems/shop.js` (purchase upgrades)
  - `/src/systems/economy.js` and/or `/src/systems/booking.js` (apply modifiers)
- Values

| key | type | meaning | default value |
| --- | --- | --- | --- |
| upgradeOrder | array | Ordered list of equipment upgrade IDs. | `["lighting", "camera", "set_dressing"]` |
| upgrades | object | Map of equipment upgrade definitions (costs, effects, caps) keyed by upgrade ID. | `{ "lighting": { "maxLevel": 3, "levelCosts": [600, 900, 1200], "followersMultPerLevel": 0.05, "revenueMultPerLevel": 0.00 }, "camera": { "maxLevel": 3, "levelCosts": [800, 1200, 1600], "followersMultPerLevel": 0.00, "revenueMultPerLevel": 0.05 }, "set_dressing": { "maxLevel": 3, "levelCosts": [500, 800, 1100], "followersMultPerLevel": 0.03, "revenueMultPerLevel": 0.03 } }` |

### CONFIG.themes.act2
- Purpose
  - Additional Act 2 content themes and modifiers (defined in DATA_THEMES.md).
- Used by
  - `/src/systems/booking.js` (theme selection)
  - `/src/systems/booking.js` or `/src/systems/content.js` (theme modifiers)
- Values

| key | type | meaning | default value |
| --- | --- | --- | --- |
| themeIds | array | Theme IDs introduced in Act 2. | `["theme_luxury_retreat", "theme_editorial", "theme_downtown_chic", "theme_sunlit_getaway", "theme_afterhours"]` |
| themes | object | Theme definitions keyed by theme ID. | `See docs/DATA_THEMES.md` |
| modifiers | object | Theme modifier map keyed by theme ID. | `Use followersMult/revenueMult in DATA_THEMES.md` |

### CONFIG.story.act2
- Purpose
  - Act 2 story events and triggers (defined in DATA_STORY_EVENTS.md).
- Used by
  - `/src/systems/story.js` (`checkAct2StoryEvents`, `applyStoryEvent`)
- Values

| key | type | meaning | default value |
| --- | --- | --- | --- |
| startDay | number | First eligible day for Act 2 story events. | `91` |
| eventOrder | array | Ordered list of Act 2 story event IDs. | `["act2_expansion_plan_day95", "act2_staffing_push_day120", "act2_studio_upgrade_day145", "act2_partnership_offer_day170"]` |
| events | object | Map of story event definitions keyed by event ID. | `See docs/DATA_STORY_EVENTS.md` |

### CONFIG.social.strategy
- Purpose
  - Platform emphasis and audience composition tuning (Balanced/Growth/Revenue strategies).
- Used by
  - `/src/systems/social.js` (`setSocialStrategy`, `postPromoContent`)
- Values

| key | type | meaning | default value |
| --- | --- | --- | --- |
| defaultStrategyId | string | Strategy ID used when none is selected. | `"balanced"` |
| strategies | object | Map of strategy definitions (platform weights, modifiers) keyed by strategy ID. | `{ "balanced": { "instagramReachMult": 1.0, "xReachMult": 1.0, "subscriberConversionMult": 1.0 }, "growth_focus": { "instagramReachMult": 1.2, "xReachMult": 0.9, "subscriberConversionMult": 0.9 }, "revenue_focus": { "instagramReachMult": 0.9, "xReachMult": 1.2, "subscriberConversionMult": 1.1 } }` |

### CONFIG.milestones
- Purpose
  - Studio milestones and threshold rules (defined below).
- Used by
  - `/src/systems/progression.js` or `/src/systems/milestones.js` (`checkMilestones`)
- Values

| key | type | meaning | default value |
| --- | --- | --- | --- |
| milestoneOrder | array | Ordered list of milestone IDs. | `["ms_followers_1000", "ms_subscribers_250", "ms_revenue_50000", "ms_reputation_25", "ms_reputation_50"]` |
| milestones | object | Map of milestone definitions keyed by milestone ID. | `{ "ms_followers_1000": { "label": "First 1,000 Followers", "type": "followers", "threshold": 1000 }, "ms_subscribers_250": { "label": "First 250 Subscribers", "type": "subscribers", "threshold": 250 }, "ms_revenue_50000": { "label": "$50k Lifetime Revenue", "type": "lifetimeRevenue", "threshold": 50000 }, "ms_reputation_25": { "label": "Reputation 25", "type": "reputation", "threshold": 25 }, "ms_reputation_50": { "label": "Reputation 50", "type": "reputation", "threshold": 50 } }` |

### CONFIG.performers.act2Roster
- Purpose
  - Expanded roster depth (new performers + role definitions) for Act 2.
- Used by
  - `/src/systems/performers.js` (roster management)
  - `/src/systems/booking.js` (selection list)
- Values

| key | type | meaning | default value |
| --- | --- | --- | --- |
| performerIds | array | IDs of new performers introduced in Act 2. | `["act2_aria_vale", "act2_jonah_kade", "act2_sky_moreno", "act2_pax_hollow"]` |
| performers | object | Map of performer definitions keyed by performer ID. | `See docs/DATA_PERFORMERS.md` |
| roleIds | array | Role IDs used for Act 2 performer differentiation. | `["lead", "specialist", "support"]` |
| roles | object | Map of role definitions keyed by role ID. | `{ "lead": { "label": "Lead", "followersMult": 1.05, "revenueMult": 1.05 }, "specialist": { "label": "Specialist", "followersMult": 1.10, "revenueMult": 1.00 }, "support": { "label": "Support", "followersMult": 0.95, "revenueMult": 1.00 } }` |

## 4) Required Config Keys (Minimum Implementation Set)
Minimum keys needed for Act 2 systems to compile/run:
- `CONFIG.meta.configVersion`
- `CONFIG.performerManagement.availabilityRules`
- `CONFIG.performerManagement.retentionRules`
- `CONFIG.performerManagement.contractRules`
- `CONFIG.analytics.rollupWindowsDays`
- `CONFIG.analytics.metricKeys`
- `CONFIG.analytics.snapshotFrequencyDays`
- `CONFIG.locations.tiers.tierOrder`
- `CONFIG.locations.tiers.tiers`
- `CONFIG.locations.tiers.defaultTierId`
- `CONFIG.equipment.upgradeOrder`
- `CONFIG.equipment.upgrades`
- `CONFIG.themes.act2.themeIds`
- `CONFIG.themes.act2.themes`
- `CONFIG.themes.act2.modifiers`
- `CONFIG.story.act2.startDay`
- `CONFIG.story.act2.eventOrder`
- `CONFIG.story.act2.events`
- `CONFIG.social.strategy.defaultStrategyId`
- `CONFIG.social.strategy.strategies`
- `CONFIG.milestones.milestoneOrder`
- `CONFIG.milestones.milestones`
- `CONFIG.performers.act2Roster.performerIds`
- `CONFIG.performers.act2Roster.performers`
- `CONFIG.performers.act2Roster.roleIds`
- `CONFIG.performers.act2Roster.roles`

## 5) How Systems Consume Config (Hard Rules)
- Systems must reference `CONFIG` paths directly.
- Do not copy values into local constants except for readability.
- Never hardcode multipliers, costs, thresholds, or caps.
- Any new numeric behavior must be controlled by `CONFIG`.

## 6) Balance Guardrails (Prevent Runaway Scaling)
- Location tiers must have explicit max tier limits defined in `CONFIG.locations.tiers`.
- Equipment upgrades must define per-upgrade caps or max levels in `CONFIG.equipment.upgrades`.
- Social strategy modifiers must be bounded by values defined in `CONFIG.social.strategy.strategies`.
- Retention/availability rules must include safe minima and maxima in `CONFIG.performerManagement.*`.

## 7) Testing / Tuning Workflow
- Adjust values in `CONFIG` only.
- Reload `index.html` (no build step).
- Run a quick loop: book → result → analytics → day advance.
- Export save before risky changes.
- Keep a known-good preset (copy of `CONFIG` values) to restore baseline behavior.

## 8) Acceptance Criteria
- [ ] All Act 2 tunables are in `CONFIG`.
- [ ] No magic numbers introduced in new systems.
- [ ] `CONFIG` remains human-editable and grouped by system.
- [ ] Game runs locally with default placeholders.

This doc defines all Act 2 balancing knobs. Any Act 2 implementation must be possible by editing CONFIG only, without touching system logic.
