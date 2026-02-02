# GameState Data Model (Current)

This document summarizes the **current** `gameState` structure as implemented in `src/state.js` and enforced by save validation.

## Top-Level Keys
- `version`, `createdAt`, `updatedAt`
- `player`
- `roster`
- `content`
- `shootOutputs`
- `social`
- `unlocks`
- `story`
- `storyLog`
- `performerManagement`
- `analyticsHistory`
- `equipment`
- `stats`
- `milestones`
- `legacyMilestones`
- `automation`
- `rivals`
- `market`
- `reputation`
- `recruitment`
- `conquests`

## Key Buckets

### `player`
- `day`, `cash`, `debtRemaining`, `debtInitialPrincipal`, `debtDueDay`
- `shootsToday`, `agencyPackUsedToday`
- `upgrades` (player upgrade flags like `managerHired`)
- `socialFollowers`, `socialSubscribers`
- `onlyFansSubscribers`, `onlyFansSubCarry`
- `reputation`
- `debtInitialPrincipal` captures the day-one debt baseline for payoff-based unlocks.

### `roster`
```json
{
  "performers": [
    {
      "id": "core_lena_watts",
      "name": "Kendra Lynn",
      "type": "core",
      "starPower": 3,
      "starPowerShoots": 0,
      "portraitPath": "assets/...",
      "fatigue": 0,
      "loyalty": 50
    }
  ],
  "freelancerProfiles": {
    "free_jade_voss": "persona_midnight_muse"
  }
}
```
- `freelancerProfiles` stores the daily persona assignment for each freelance performer.

### `content`
```json
{
  "lastContentId": "content_7",
  "entries": [
    {
      "id": "content_7",
      "dayCreated": 12,
      "performerId": "core_lena_watts",
      "performerIds": ["core_lena_watts"],
      "locationId": "bedroom",
      "themeId": "lingerie",
      "contentType": "Premium",
      "source": "core",
      "shootCost": 150,
      "photoPaths": ["data:image/svg+xml;..."],
      "results": {
        "socialFollowersGained": 0,
        "socialSubscribersGained": 0,
        "onlyFansSubscribersGained": 18,
        "feedbackSummary": "Premium release boosted OF subscribers.",
        "variancePct": 0.05
      }
    }
  ],
  "variance": {
    "enabled": true,
    "seed": 1234567890,
    "rollLog": []
  }
}
```
- Agency Pack entries may include `bundleCount` and `bundleThumbs`.

### `social`
```json
{
  "posts": [
    {
      "id": "post_3",
      "dayPosted": 8,
      "platform": "Instagram",
      "contentId": "content_4",
      "socialFollowersGained": 120,
      "socialSubscribersGained": 1,
      "onlyFansSubscribersGained": 0
    }
  ],
  "activeSocialStrategyId": "balanced",
  "manualStrategy": {
    "dailyBudget": 200,
    "allocations": { "tease": 40, "collabs": 40, "ads": 20 },
    "lastAppliedDay": 12
  }
}
```
- `collab` (status, nextOfferDay, partnerIndex, attempt fields, permanentPromoReachBonusPct).
- Stored under `gameState.social` (nested) to keep saves compatible.
- `permanentPromoReachBonusPct` affects promo post social gains only.

### `unlocks`
- `locationTier1Unlocked` (legacy boolean)
- `locationTiers` (`tier0`, `tier1`, `tier2`)

### `story` / `storyLog`
- `story` tracks which events have fired (Acts 1–3).
- `storyLog` stores persistent log entries for review in the Story Log screen.

### `performerManagement`
- `contracts` (days remaining + status)
- `availability` (rest days + consecutive bookings)
- `retentionFlags` (warned/left)

### `stats`
- `totalShopSpend` (aggregate cash spent on shop purchases, including location unlocks and equipment upgrades)
- `totalUpgradesPurchased` (count of equipment upgrades purchased)

### `automation`
- `enabled`, `autoBookEnabled`, `autoPostEnabled`
- `lastAutomationDay`, `actionsTakenToday`

### `rivals` / `market`
- `rivals.studios` + `rivals.lastCheckDay`
- `market.activeShiftId` + `market.shiftHistory`
- `market.saturation.active` + `market.saturation.activatedDay`

### `reputation`
- `branchId` (selected Studio Identity)
- `branchProgress` (reserved for future tracking)

### `recruitment`
```json
{
  "declinedIds": ["recruit_bryn_sterling"],
  "hiredIds": ["recruit_aria_lux"]
}
```

### `conquests`
```json
{
  "enabled": true,
  "characters": {
    "producer": {
      "stageUnlocked": 2
    },
    "bankManager": {
      "stageUnlocked": 1
    }
  },
  "inbox": [
    {
      "id": "conquest_producer_stage_3_day_42",
      "characterId": "producer",
      "stageIndex": 3,
      "createdDay": 42,
      "status": "unread"
    }
  ],
  "unlockedPacks": [
    {
      "packId": "producer_stage2",
      "characterId": "producer",
      "stageIndex": 2,
      "title": "Momentum Selfies",
      "description": "A confident set of four shots, dialed in for your new lens.",
      "imagePaths": ["data:image/svg+xml;..."],
      "unlockedDay": 30
    }
  ]
}
```

## Notes
- UI-only state (current screen, slideshow index, etc.) is **not** persisted.
- All fields above are serialized for save/load and export/import.
