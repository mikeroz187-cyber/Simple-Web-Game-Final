# Act 3 Balancing & Config (v3)

## 1) Config Philosophy (Carry Forward)
- All tunables live in `CONFIG`.
- No magic numbers in systems or UI.
- Config structure must be stable and readable.
- Act 3 only adds new keys/subkeys (no breaking changes).

## 2) Config Versioning
- `CONFIG.meta.configVersion` increments to `3` for Act 3.
- Act 3 config extends Act 2 config without renames/removals.

## 3) New Config Categories (Act 3)

### CONFIG.rivals
- Purpose
  - Define rival studios and standings evaluation cadence.
- Values

| key | type | meaning | default value |
| --- | --- | --- | --- |
| studios | array | Rival definitions with base score + weekly growth | `[{ id: "rival_night_slate", name: "Night Slate Media", baseScore: 55, weeklyGrowthRate: 1.03 }, { id: "rival_rose_quartz", name: "Rose Quartz Studio", baseScore: 48, weeklyGrowthRate: 1.02 }]` |
| evaluationCadenceDays | number | Days between standings checks | `7` |

### CONFIG.market
- Purpose
  - Define market shifts that temporarily modify outcomes.
- Values

| key | type | meaning | default value |
| --- | --- | --- | --- |
| shiftSchedule | array | Ordered list of shift IDs with trigger days | `[{ id: "shift_premium_boom", day: 225 }, { id: "shift_promo_fatigue", day: 245 }]` |
| shifts | object | Shift definitions with multipliers | `{ "shift_premium_boom": { "revenueMult": 1.15, "followersMult": 0.95 }, "shift_promo_fatigue": { "revenueMult": 0.95, "followersMult": 0.85 } }` |
| multiplierFloor | number | Minimum allowed multiplier | `0.85` |
| multiplierCeiling | number | Maximum allowed multiplier | `1.15` |

### CONFIG.reputation.branches
- Purpose
  - Define reputation branches and modifiers.
- Values

| key | type | meaning | default value |
| --- | --- | --- | --- |
| branches | array | Branch definitions | `[{ id: "prestige", label: "Prestige", requiredReputation: 60, revenueMult: 1.10, followersMult: 0.95 }, { id: "volume", label: "Volume", requiredReputation: 60, revenueMult: 0.95, followersMult: 1.10 }, { id: "boutique", label: "Boutique", requiredReputation: 60, revenueMult: 1.05, followersMult: 1.05 }]` |

### CONFIG.legacyMilestones
- Purpose
  - Define Act 3 legacy milestones and reward payouts.
- Values

| key | type | meaning | default value |
| --- | --- | --- | --- |
| milestoneOrder | array | Ordered list of legacy milestone IDs | `["legacy_revenue_250k", "legacy_subscribers_1500", "legacy_reputation_80", "legacy_story_complete"]` |
| milestones | object | Milestone definitions | `{ "legacy_revenue_250k": { "label": "$250k Lifetime Revenue", "type": "lifetimeRevenue", "threshold": 250000, "rewardCash": 5000 }, "legacy_subscribers_1500": { "label": "1,500 Subscribers", "type": "subscribers", "threshold": 1500, "rewardCash": 4000 }, "legacy_reputation_80": { "label": "Reputation 80", "type": "reputation", "threshold": 80, "rewardCash": 6000 }, "legacy_story_complete": { "label": "Complete Act 3 Story", "type": "storyComplete", "threshold": 1, "rewardCash": 8000 } }` |

### CONFIG.automation
- Purpose
  - Define automation safety rules.
- Values

| key | type | meaning | default value |
| --- | --- | --- | --- |
| enabled | boolean | Global automation toggle | `false` |
| maxActionsPerDay | number | Max automated actions per day | `1` |
| minCashReserve | number | Minimum cash to keep before auto-booking | `1000` |

### CONFIG.schedule
- Purpose
  - Define scheduling queue limits and behavior.
- Values

| key | type | meaning | default value |
| --- | --- | --- | --- |
| enabled | boolean | Enable advanced scheduling | `false` |
| maxQueueSize | number | Maximum queued bookings | `3` |
| resolvePerDay | number | Number of queued bookings resolved per day | `1` |

### CONFIG.content.variance
- Purpose
  - Define bounded variance rules for content results.
- Values

| key | type | meaning | default value |
| --- | --- | --- | --- |
| enabled | boolean | Enable variance | `true` |
| maxVariancePct | number | Maximum variance magnitude | `0.15` |
| seedPolicy | string | RNG seed policy | `"stored"` |

### CONFIG.story.act3
- Purpose
  - Define Act 3 story schedule.
- Values

| key | type | meaning | default value |
| --- | --- | --- | --- |
| startDay | number | First eligible day for Act 3 story | `181` |
| eventOrder | array | Ordered list of Act 3 story event IDs | `["act3_brand_legacy_day200", "act3_market_shift_day225", "act3_mentorship_day245", "act3_exit_strategy_day270"]` |
| events | object | Map of Act 3 event definitions | `See docs/DATA_STORY_EVENTS.md` |

## 4) Required Config Keys (Minimum Implementation Set)
- `CONFIG.meta.configVersion`
- `CONFIG.rivals.studios`
- `CONFIG.rivals.evaluationCadenceDays`
- `CONFIG.market.shiftSchedule`
- `CONFIG.market.shifts`
- `CONFIG.market.multiplierFloor`
- `CONFIG.market.multiplierCeiling`
- `CONFIG.reputation.branches.branches`
- `CONFIG.legacyMilestones.milestoneOrder`
- `CONFIG.legacyMilestones.milestones`
- `CONFIG.automation.enabled`
- `CONFIG.automation.maxActionsPerDay`
- `CONFIG.automation.minCashReserve`
- `CONFIG.schedule.enabled`
- `CONFIG.schedule.maxQueueSize`
- `CONFIG.schedule.resolvePerDay`
- `CONFIG.content.variance.enabled`
- `CONFIG.content.variance.maxVariancePct`
- `CONFIG.content.variance.seedPolicy`
- `CONFIG.story.act3.startDay`
- `CONFIG.story.act3.eventOrder`
- `CONFIG.story.act3.events`

## 5) Guardrails
- No new currencies.
- All multipliers must honor `multiplierFloor`/`multiplierCeiling` and `maxVariancePct`.
- Automation must always respect booking validation rules.

## 6) Acceptance Criteria
- [ ] All Act 3 tunables are in `CONFIG`.
- [ ] No magic numbers introduced in new systems.
- [ ] Config remains human-editable and grouped by system.
- [ ] Game runs locally with default values.
