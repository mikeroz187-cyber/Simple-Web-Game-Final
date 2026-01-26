> **Status:** Vision reference only. This document is not authoritative for the current build.
> Current behavior lives in `docs/CORE_GAMEPLAY_LOOP.md` and `docs/GAMESTATE_DATA_MODEL.md`.

> Note: Current runtime config lives in `src/config.js`; `config.toml` is legacy.

# Act 3 Gameplay Formulas (Additive to MVP + Act 2)

This document defines **exact Act 3 calculations** to avoid guessing. Act 3 formulas are **additive** and must not alter MVP or Act 2 behavior unless explicitly stated.

**Source of Truth**
- Numeric values come from `config.toml` via `CONFIG.*`.
- Act 3 formulas layer on top of MVP + Act 2 results.

---

## 1) Rival Standings Evaluation (Act 3)

**Plain English**
- Rival score grows deterministically based on elapsed evaluation windows.
- No randomness or external input.

**Code-ready expression**
```js
const cadence = CONFIG.rivals.evaluationCadenceDays;
const windowsElapsed = Math.floor(
  (gameState.player.day - gameState.rivals.lastCheckDay) / cadence
);

const nextScore = rival.baseScore * Math.pow(rival.weeklyGrowthRate, windowsElapsed);
```

**Config values used**
- `CONFIG.rivals.evaluationCadenceDays`
- `CONFIG.rivals.studios[].baseScore`
- `CONFIG.rivals.studios[].weeklyGrowthRate`

---

## 2) Market Shift Activation & Multipliers (Act 3)

**Plain English**
- Market shifts activate on their scheduled day and remain active until replaced.
- Multipliers are clamped by `multiplierFloor` and `multiplierCeiling`.

**Code-ready expression**
```js
const shift = CONFIG.market.shifts[shiftId];
const ofSubsMult = Math.min(
  CONFIG.market.multiplierCeiling,
  Math.max(CONFIG.market.multiplierFloor, shift.ofSubsMult)
);

const followersMult = Math.min(
  CONFIG.market.multiplierCeiling,
  Math.max(CONFIG.market.multiplierFloor, shift.followersMult)
);
```

**Config values used**
- `CONFIG.market.shiftSchedule`
- `CONFIG.market.shifts.*`
- `CONFIG.market.multiplierFloor`
- `CONFIG.market.multiplierCeiling`

---

## 3) Reputation Branch Modifiers (Act 3)

**Plain English**
- Once a branch is selected, apply its modifiers to Promo followers and Premium OF subs.
- Branch selection requires the configured reputation threshold.

**Code-ready expression**
```js
const branch = CONFIG.reputation.branches.branches.find(b => b.id === branchId);
const canSelect = gameState.player.reputation >= branch.requiredReputation;

const followersAfterBranch = Math.round(baseFollowers * branch.followersMult);
const ofSubsAfterBranch = Math.round(baseOfSubs * branch.ofSubsMult);
```

**Config values used**
- `CONFIG.reputation.branches.branches[]`

---

## 4) Automation Safety Rules (Act 3)

**Plain English**
- Automation never runs if disabled.
- Automation cannot reduce cash below `minCashReserve`.
- Automation performs at most `maxActionsPerDay` actions.

**Code-ready expression**
```js
const canAutomate = CONFIG.automation.enabled && gameState.automation.enabled;
const withinActionLimit = actionsTaken < CONFIG.automation.maxActionsPerDay;
const hasCashBuffer = gameState.player.cash >= CONFIG.automation.minCashReserve;
```

**Deterministic action ordering**
1) Post Promo content (latest Promo content not yet posted), if any.
2) Stop if no valid action remains.

**Config values used**
- `CONFIG.automation.enabled`
- `CONFIG.automation.maxActionsPerDay`
- `CONFIG.automation.minCashReserve`

---

## 5) Content Performance Variance (Act 3)

**Plain English**
- Apply a bounded variance roll to Promo followers or Premium OF subs.
- Variance is deterministic: use stored seed and log the roll in `content.variance.rollLog`.

**Code-ready expression**
```js
const maxVariance = CONFIG.content.variance.maxVariancePct;
const roll = rng.nextFloat(); // deterministic from stored seed
const variance = (roll * 2 * maxVariance) - maxVariance; // [-max, +max]

const varianceMult = 1 + variance;
const adjustedFollowers = Math.round(baseFollowers * varianceMult);
const adjustedOfSubs = Math.round(baseOfSubs * varianceMult);
```

**Config values used**
- `CONFIG.content.variance.enabled`
- `CONFIG.content.variance.maxVariancePct`
- `CONFIG.content.variance.seedPolicy`

---

## 6) Legacy Milestone Evaluation (Act 3)

**Plain English**
- Legacy milestones complete when their tracked metric meets the configured threshold.
- Supported types: `followers`, `subscribers`, `reputation`, `mrr`, `storyComplete`.

**Code-ready expression**
```js
const metricValueByType = {
  followers: gameState.player.followers,
  subscribers: gameState.player.subscribers,
  reputation: gameState.player.reputation,
  mrr: getMRR(gameState),
  storyComplete: gameState.story.act3.eventsShown.length > 0 ? 1 : 0
};

const isComplete = metricValueByType[milestone.type] >= milestone.threshold;
```

**Config values used**
- `CONFIG.legacyMilestones.milestones.*`

---

## 7) Act 3 Story Triggers (Act 3)

**Plain English**
- Events trigger on day start when `player.day >= triggerDay` and the event has not been shown.

**Code-ready expression**
```js
const isEligible =
  gameState.player.day >= event.triggerDay &&
  !gameState.story.act3.eventsShown.includes(event.id);
```

**Config values used**
- `CONFIG.story.act3.eventOrder`
- `CONFIG.story.act3.events.*`
