# Act 1 Content Expansion Pack 01

## Overview
This is **Act 1 Content Expansion Pack 01**. It is strictly **additive** and introduces **no new systems**. All content below uses the existing Opportunity, Unlock, and Event structures exactly as defined.

---

## New Opportunities

> All opportunities are deterministic, use higher costs/payouts than early Act 1, and reference a completion event ID. No branching, randomness, or new mechanics are introduced.

### 1) “Private Collector Showcase”
```json
{
  "id": "opp_act1_pack01_collector_showcase",
  "name": "Private Collector Showcase",
  "description": "A curated, high-end shoot aimed at an exclusive patron list with premium expectations.",
  "cost": 1500,
  "duration": 6,
  "requirements": {
    "unlocks": [],
    "flags": []
  },
  "outcome": {
    "moneyDelta": 3600,
    "unlocks": [],
    "flags": [],
    "eventId": "event_act1_pack01_collector_showcase"
  }
}
```

### 2) “VIP Penthouse Session”
```json
{
  "id": "opp_act1_pack01_vip_penthouse",
  "name": "VIP Penthouse Session",
  "description": "A premium commission staged in a luxury suite with elevated expectations and payoff.",
  "cost": 2400,
  "duration": 8,
  "requirements": {
    "unlocks": ["unlock_act1_pack01_premium_sets"],
    "flags": []
  },
  "outcome": {
    "moneyDelta": 5600,
    "unlocks": [],
    "flags": [],
    "eventId": "event_act1_pack01_vip_penthouse"
  }
}
```

### 3) “Elite After-Hours Feature”
```json
{
  "id": "opp_act1_pack01_elite_after_hours",
  "name": "Elite After-Hours Feature",
  "description": "A late-night feature built for a high-value audience segment with polished delivery.",
  "cost": 3200,
  "duration": 10,
  "requirements": {
    "unlocks": ["unlock_act1_pack01_premium_sets"],
    "flags": []
  },
  "outcome": {
    "moneyDelta": 7400,
    "unlocks": [],
    "flags": [],
    "eventId": "event_act1_pack01_elite_after_hours"
  }
}
```

### 4) “Luxury Brand Collaboration”
```json
{
  "id": "opp_act1_pack01_luxury_collab",
  "name": "Luxury Brand Collaboration",
  "description": "A prestige collaboration with strict polish standards and a high-tier payout.",
  "cost": 4800,
  "duration": 12,
  "requirements": {
    "unlocks": ["unlock_act1_pack01_vip_distribution"],
    "flags": []
  },
  "outcome": {
    "moneyDelta": 11000,
    "unlocks": [],
    "flags": [],
    "eventId": "event_act1_pack01_luxury_collab"
  }
}
```

---

## Optional Unlocks (Max 2)

### 1) “Premium Set Access”
```json
{
  "id": "unlock_act1_pack01_premium_sets",
  "name": "Premium Set Access",
  "description": "Secures access to higher-tier sets and prepares the studio for premium commissions.",
  "cost": 2000,
  "requirements": {
    "unlocks": [],
    "flags": []
  },
  "effects": {
    "unlockOpportunities": [
      "opp_act1_pack01_vip_penthouse",
      "opp_act1_pack01_elite_after_hours"
    ],
    "modifyPayouts": {}
  }
}
```

### 2) “VIP Distribution Line”
```json
{
  "id": "unlock_act1_pack01_vip_distribution",
  "name": "VIP Distribution Line",
  "description": "Locks in a premium channel that enables top-end collaboration opportunities.",
  "cost": 3500,
  "requirements": {
    "unlocks": ["unlock_act1_pack01_premium_sets"],
    "flags": []
  },
  "effects": {
    "unlockOpportunities": [
      "opp_act1_pack01_luxury_collab"
    ],
    "modifyPayouts": {}
  }
}
```

---

## Events & Visual Rewards

> Events are descriptive only. No choices, branching, or mechanics are introduced.

### event_act1_pack01_collector_showcase
- **Title:** Private Collector Showcase
- **Text:** The curated showcase lands cleanly. A private list of patrons responds immediately, and the payout clears on delivery.
- **Optional Image:** `event_act1_pack01_collector_showcase.jpg`

### event_act1_pack01_vip_penthouse
- **Title:** VIP Penthouse Session
- **Text:** The penthouse session delivers the elevated tone promised. The client signs off without revisions, and the premium fee posts in full.
- **Optional Image:** `event_act1_pack01_vip_penthouse.jpg`

### event_act1_pack01_elite_after_hours
- **Title:** Elite After-Hours Feature
- **Text:** The after-hours feature hits every mark. The audience response is immediate, and the elite tier payout lands on schedule.
- **Optional Image:** `event_act1_pack01_elite_after_hours.jpg`

### event_act1_pack01_luxury_collab
- **Title:** Luxury Brand Collaboration
- **Text:** The luxury collaboration goes live with immaculate polish. The brand approves on first pass, and the top-tier payout clears.
- **Optional Image:** `event_act1_pack01_luxury_collab.jpg`
