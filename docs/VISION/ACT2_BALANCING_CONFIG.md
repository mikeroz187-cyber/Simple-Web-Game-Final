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
  - Act 2 performer contracts/retention/availability tuning (details remain TBD).
- Used by
  - `/src/systems/performers.js` (`updatePerformerAvailability`, `applyRetentionCheck`)
  - `/src/systems/booking.js` (availability validation)
- Values

| key | type | meaning | default placeholder |
| --- | --- | --- | --- |
| availabilityRules | object | Placeholder map for availability/booking eligibility rules (TBD). | `{}` |
| retentionRules | object | Placeholder map for retention/leave thresholds (TBD). | `{}` |
| contractRules | object | Placeholder map for contract durations/terms (TBD). | `{}` |

### CONFIG.analytics
- Purpose
  - Act 2 advanced analytics rollups and summary windows (TBD).
- Used by
  - `/src/systems/analytics.js` (`recordAnalyticsSnapshot`, `getAnalyticsSummary`)
- Values

| key | type | meaning | default placeholder |
| --- | --- | --- | --- |
| rollupWindowsDays | array | Time windows (in days) for rollup summaries (TBD). | `[]` |
| metricKeys | array | Metric identifiers included in advanced summaries (TBD). | `[]` |
| snapshotFrequencyDays | number | How often to capture analytics snapshots (TBD). | `0` |

### CONFIG.locations.tiers
- Purpose
  - Additional location tiers with costs/benefits and unlock requirements.
- Used by
  - `/src/systems/progression.js` (tier unlock checks)
  - `/src/systems/booking.js` (tier availability)
  - `/src/systems/shop.js` (tier purchases)
- Values

| key | type | meaning | default placeholder |
| --- | --- | --- | --- |
| tierOrder | array | Ordered list of tier IDs (TBD). | `[]` |
| tiers | object | Map of tier definitions (costs, requirements, effects) keyed by tier ID (TBD). | `{}` |
| defaultTierId | string | Tier ID used when no other tiers are unlocked (TBD). | `"TBD_DEFAULT"` |

### CONFIG.equipment
- Purpose
  - Equipment upgrades that affect output quality (details TBD).
- Used by
  - `/src/systems/shop.js` (purchase upgrades)
  - `/src/systems/economy.js` and/or `/src/systems/booking.js` (apply modifiers)
- Values

| key | type | meaning | default placeholder |
| --- | --- | --- | --- |
| upgradeOrder | array | Ordered list of equipment upgrade IDs (TBD). | `[]` |
| upgrades | object | Map of equipment upgrade definitions (costs, effects, caps) keyed by upgrade ID (TBD). | `{}` |

### CONFIG.themes.act2
- Purpose
  - Additional Act 2 content themes and modifiers (TBD).
- Used by
  - `/src/systems/booking.js` (theme selection)
  - `/src/systems/booking.js` or `/src/systems/content.js` (theme modifiers)
- Values

| key | type | meaning | default placeholder |
| --- | --- | --- | --- |
| themeIds | array | Theme IDs introduced in Act 2 (TBD). | `[]` |
| themes | object | Theme definitions keyed by theme ID (TBD). | `{}` |
| modifiers | object | Optional theme modifier map keyed by theme ID (TBD). | `{}` |

### CONFIG.story.act2
- Purpose
  - Act 2 story events and triggers (TBD).
- Used by
  - `/src/systems/story.js` (`checkAct2StoryEvents`, `applyStoryEvent`)
- Values

| key | type | meaning | default placeholder |
| --- | --- | --- | --- |
| startDay | number | First eligible day for Act 2 story events (TBD). | `0` |
| eventOrder | array | Ordered list of Act 2 story event IDs (TBD). | `[]` |
| events | object | Map of story event definitions keyed by event ID (TBD). | `{}` |

### CONFIG.social.strategy
- Purpose
  - Platform emphasis and audience composition tuning (TBD).
- Used by
  - `/src/systems/social.js` (`setSocialStrategy`, `postPromoContent`)
- Values

| key | type | meaning | default placeholder |
| --- | --- | --- | --- |
| defaultStrategyId | string | Strategy ID used when none is selected (TBD). | `"TBD_DEFAULT"` |
| strategies | object | Map of strategy definitions (platform weights, modifiers) keyed by strategy ID (TBD). | `{}` |

### CONFIG.milestones
- Purpose
  - Studio milestones and threshold rules (TBD).
- Used by
  - `/src/systems/progression.js` or `/src/systems/milestones.js` (`checkMilestones`)
- Values

| key | type | meaning | default placeholder |
| --- | --- | --- | --- |
| milestoneOrder | array | Ordered list of milestone IDs (TBD). | `[]` |
| milestones | object | Map of milestone definitions keyed by milestone ID (TBD). | `{}` |

### CONFIG.performers.act2Roster
- Purpose
  - Expanded roster depth (new performers + role definitions) for Act 2 (TBD).
- Used by
  - `/src/systems/performers.js` (roster management)
  - `/src/systems/booking.js` (selection list)
- Values

| key | type | meaning | default placeholder |
| --- | --- | --- | --- |
| performerIds | array | IDs of new performers introduced in Act 2 (TBD). | `[]` |
| performers | object | Map of performer definitions keyed by performer ID (TBD). | `{}` |
| roleIds | array | Role IDs used for Act 2 performer differentiation (TBD). | `[]` |
| roles | object | Map of role definitions keyed by role ID (TBD). | `{}` |

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
- Location tiers must have explicit max tier limits defined in `CONFIG.locations.tiers` (TBD placeholders in `tiers`).
- Equipment upgrades must define per-upgrade caps or max levels in `CONFIG.equipment.upgrades` (TBD placeholders in `upgrades`).
- Social strategy modifiers must be bounded by values defined in `CONFIG.social.strategy.strategies` (TBD).
- Retention/availability rules must include safe minima and maxima in `CONFIG.performerManagement.*` (TBD).
- If a guardrail is not yet fully defined, it remains a `TBD` placeholder and must be filled before implementation.

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
