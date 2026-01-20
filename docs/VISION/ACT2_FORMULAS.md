# Act 2 Gameplay Formulas (Additive to MVP)

This document defines **exact Act 2 calculations** to avoid guesswork. Act 2 formulas are **additive** and must not alter MVP behavior unless explicitly stated.

**Source of Truth**
- Numeric values come from `config.toml` via `CONFIG.*`.
- MVP formulas remain authoritative for base results; Act 2 formulas modify or extend them.

---

## 1) Contract Day Countdown (Act 2)

**Plain English**
- At the **start of each new day**, active contracts tick down by 1 day.
- If the counter reaches 0, the performer becomes **inactive/unavailable** until renewed.

**Code-ready expression**
```js
const nextDaysRemaining = Math.max(0, contract.contractDaysRemaining - 1);
const nextStatus = nextDaysRemaining === 0 ? "expired" : "active";
```

**Config values used**
- `CONFIG.performerManagement.contractRules.coreLengthDays`
- `CONFIG.performerManagement.contractRules.freelanceLengthDays`
- `CONFIG.performerManagement.contractRules.coreRenewalCost`
- `CONFIG.performerManagement.contractRules.freelanceRenewalCost`

**Renewal rule (deterministic)**
```js
const renewalCost = performer.type === "core"
  ? CONFIG.performerManagement.contractRules.coreRenewalCost
  : CONFIG.performerManagement.contractRules.freelanceRenewalCost;

const renewedDays = performer.type === "core"
  ? CONFIG.performerManagement.contractRules.coreLengthDays
  : CONFIG.performerManagement.contractRules.freelanceLengthDays;
```

---

## 2) Consecutive Booking & Rest Rule (Act 2)

**Plain English**
- Each time a performer completes a booking, `consecutiveBookings += 1`.
- If `consecutiveBookings >= maxConsecutiveBookings`, the performer is forced to rest for `restDaysAfterMax` days.
- Rest days tick down at day start; performer is unavailable while `restDaysRemaining > 0`.

**Code-ready expression**
```js
const nextConsecutive = availability.consecutiveBookings + 1;
const maxConsecutive = CONFIG.performerManagement.availabilityRules.maxConsecutiveBookings;

let nextRestDays = availability.restDaysRemaining;
let nextConsecutiveBookings = nextConsecutive;

if (nextConsecutive >= maxConsecutive) {
  nextRestDays = CONFIG.performerManagement.availabilityRules.restDaysAfterMax;
  nextConsecutiveBookings = 0;
}
```

**Availability check**
```js
const isAvailable = availability.restDaysRemaining === 0;
```

**Config values used**
- `CONFIG.performerManagement.availabilityRules.maxConsecutiveBookings`
- `CONFIG.performerManagement.availabilityRules.restDaysAfterMax`

---

## 3) Loyalty Changes (Act 2)

**Plain English**
- After a booking, the performer gains loyalty.
- At day start, if the performer has **no content entry** within the last 7 days, loyalty decays.
- Warning/leave thresholds are deterministic and checked after any loyalty change.

**Code-ready expression**
```js
const loyaltyAfterBooking = performer.loyalty +
  CONFIG.performerManagement.retentionRules.loyaltyGainPerBooking;
```

```js
const hadRecentContent = content.entries.some(entry =>
  entry.performerId === performer.id &&
  entry.dayCreated >= (gameState.player.day - 6)
);

const loyaltyAfterIdleDecay = hadRecentContent
  ? performer.loyalty
  : performer.loyalty - CONFIG.performerManagement.retentionRules.loyaltyDecayPerWeekIdle;
```

**Threshold checks**
```js
const warned = performer.loyalty <=
  CONFIG.performerManagement.retentionRules.loyaltyWarningThreshold;

const left = performer.loyalty <=
  CONFIG.performerManagement.retentionRules.loyaltyLeaveThreshold;
```

**Config values used**
- `CONFIG.performerManagement.retentionRules.loyaltyGainPerBooking`
- `CONFIG.performerManagement.retentionRules.loyaltyDecayPerWeekIdle`
- `CONFIG.performerManagement.retentionRules.loyaltyWarningThreshold`
- `CONFIG.performerManagement.retentionRules.loyaltyLeaveThreshold`

---

## 4) Equipment Multipliers (Act 2)

**Plain English**
- Apply equipment multipliers **after** base MVP results are calculated.
- Equipment effects are deterministic and additive per level.

**Code-ready expression**
```js
const lightingMult = 1 +
  (equipment.lightingLevel * CONFIG.equipment.upgrades.lighting.followersMultPerLevel) +
  (equipment.setDressingLevel * CONFIG.equipment.upgrades.set_dressing.followersMultPerLevel);

const revenueMult = 1 +
  (equipment.cameraLevel * CONFIG.equipment.upgrades.camera.revenueMultPerLevel) +
  (equipment.setDressingLevel * CONFIG.equipment.upgrades.set_dressing.revenueMultPerLevel);

const followersAfterEquipment = Math.round(baseFollowers * lightingMult);
const revenueAfterEquipment = Math.round(baseRevenue * revenueMult);
```

**Config values used**
- `CONFIG.equipment.upgrades.lighting.followersMultPerLevel`
- `CONFIG.equipment.upgrades.camera.revenueMultPerLevel`
- `CONFIG.equipment.upgrades.set_dressing.followersMultPerLevel`
- `CONFIG.equipment.upgrades.set_dressing.revenueMultPerLevel`

---

## 5) Social Strategy Modifiers (Act 2)

**Plain English**
- Strategy modifies platform reach and subscriber conversion.
- Apply strategy multipliers after base platform multipliers.

**Code-ready expression**
```js
const strategy = CONFIG.social.strategy.strategies[activeStrategyId];

const platformMult = platform === "Instagram"
  ? CONFIG.social_platforms.instagram_reach_multiplier * strategy.instagramReachMult
  : CONFIG.social_platforms.x_reach_multiplier * strategy.xReachMult;

const followersGained = Math.round(
  CONFIG.economy.promo_followers_gain * platformMult
);

const subscribersGained = Math.floor(
  followersGained * CONFIG.economy.subscriber_conversion_rate * strategy.subscriberConversionMult
);
```

**Config values used**
- `CONFIG.social_platforms.instagram_reach_multiplier`
- `CONFIG.social_platforms.x_reach_multiplier`
- `CONFIG.social.strategy.strategies.*`
- `CONFIG.economy.promo_followers_gain`
- `CONFIG.economy.subscriber_conversion_rate`

---

## 6) Advanced Analytics Rollups (Act 2)

**Plain English**
- Rollups use `windowDays` from config (7 and 30 by default).
- Include both content results and social posts within the window.

**Code-ready expression**
```js
const windowStart = gameState.player.day - (windowDays - 1);

const contentInWindow = gameState.content.entries.filter(entry =>
  entry.dayCreated >= windowStart
);

const postsInWindow = gameState.social.posts.filter(post =>
  post.dayPosted >= windowStart
);

const revenue = contentInWindow.reduce((sum, entry) => sum + entry.results.revenue, 0);
const followers = contentInWindow.reduce((sum, entry) => sum + entry.results.followersGained, 0) +
  postsInWindow.reduce((sum, post) => sum + post.followersGained, 0);

const subscribers = contentInWindow.reduce((sum, entry) => sum + entry.results.subscribersGained, 0) +
  postsInWindow.reduce((sum, post) => sum + post.subscribersGained, 0);

const promoCount = contentInWindow.filter(entry => entry.contentType === "Promo").length;
const premiumCount = contentInWindow.filter(entry => entry.contentType === "Premium").length;
```

**Config values used**
- `CONFIG.analytics.rollupWindowsDays`
- `CONFIG.analytics.snapshotFrequencyDays`

---

## 7) Location Tier Unlocks (Act 2)

**Plain English**
- Tier unlocks require both enough cash and reputation threshold.

**Code-ready expression**
```js
const tier = CONFIG.locations.tiers.tiers[tierId];
const canUnlock =
  gameState.player.cash >= tier.unlockCost &&
  gameState.player.reputation >= tier.requiredReputation;
```

**Config values used**
- `CONFIG.locations.tiers.tiers.*`

---

## 8) Milestone Evaluation (Act 2)

**Plain English**
- Each milestone is complete if the tracked metric meets or exceeds the threshold.
- Supported types: `followers`, `subscribers`, `reputation`, `lifetimeRevenue`.

**Code-ready expression**
```js
const metricValueByType = {
  followers: gameState.player.followers,
  subscribers: gameState.player.subscribers,
  reputation: gameState.player.reputation,
  lifetimeRevenue: gameState.player.lifetimeRevenue || 0
};

const isComplete = metricValueByType[milestone.type] >= milestone.threshold;
```

**Config values used**
- `CONFIG.milestones.milestones.*`

---

## 9) Act 2 Story Triggers (Act 2)

**Plain English**
- Events trigger on day start when `player.day >= triggerDay` and the event has not been shown.

**Code-ready expression**
```js
const isEligible =
  gameState.player.day >= event.triggerDay &&
  !gameState.story.act2.eventsShown.includes(event.id);
```

**Config values used**
- `CONFIG.story.act2.eventOrder`
- `CONFIG.story.act2.events.*`
