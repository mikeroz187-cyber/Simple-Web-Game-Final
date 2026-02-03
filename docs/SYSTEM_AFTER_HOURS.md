# After Hours System

This document specifies the After Hours encounter system — a power-fantasy mechanic where performers approach the player with transactional offers after the workday ends.

**Status:** Spec complete, pending implementation
See `docs/SAVE_LOAD_AND_PERSISTENCE_RULES.md` for the canonical save/load rules.

---

## Overview

When the player clicks "Advance Day," there is a chance that a performer "knocks" on their door with a request. The player can answer or ignore. If they answer, the performer makes an offer tied to a **one-time cash payment** (pay immediately on acceptance). The player can accept the offer, counter-offer for additional gameplay benefits, or dismiss.

---

## Core Flow

```
[Advance Day clicked]
        │
        ▼
┌─────────────────────┐
│ Knock Check         │
│ (is anyone eligible │
│  to knock tonight?) │
└─────────────────────┘
        │
    YES │ NO
        │  └──► Day advances normally
        ▼
┌─────────────────────┐
│ Knock Modal         │
│ "A knock at your    │
│  door..."           │
│                     │
│ [Answer] [Ignore]   │
└─────────────────────┘
        │
   Answer │ Ignore
        │    └──► Day advances, performer may knock again later
        ▼
┌─────────────────────┐
│ The Ask             │
│ Performer explains  │
│ what they want      │
│                     │
│ [Engage] [Dismiss]  │
└─────────────────────┘
        │
   Engage │ Dismiss
        │    └──► Day advances, no state change
        ▼
┌─────────────────────┐
│ The Offer           │
│ What they're        │
│ offering in return  │
│                     │
│ [Accept (Pay now)]  │
│ [Counter-Offer]     │
│ [Dismiss]           │
└─────────────────────┘
        │
   Accept │ Counter │ Dismiss
        │     │        └──► Loyalty penalty + cooldown → Day advances
        │     ▼
        │  ┌─────────────────────┐
        │  │ Counter-Offer       │
        │  │ Player sets terms   │
        │  │                     │
        │  │ ○ Star Rating +1    │
        │  │ ○ Recruit Help      │
        │  └─────────────────────┘
        │          │
        │          ▼
        │  ┌─────────────────────┐
        │  │ Response            │
        │  │ Accept or Refuse    │
        │  │ (based on rep)      │
        │  └─────────────────────┘
        │          │
        │    Accept │ Refuse
        │          │    └──► Day advances, cooldown applied
        ▼          ▼
┌─────────────────────────────────┐
│ Encounter Sequence              │
│                                 │
│ Beat 1: The Lock (text)         │
│ Beat 2: The Build (text)        │
│ Beat 3: Slideshow (10 images)   │
│ Beat 4: Aftermath (outcomes)    │
└─────────────────────────────────┘
        │
        ▼
   Day advances
```

---

## One-time Payment & Decline Consequences

- **Accept:** player pays the one-time fee immediately (cash is reduced right away).
- **Dismiss/Ignore (pre-completion):** performer loyalty decreases and a longer cooldown is applied before they can knock again.

---

## Knock Eligibility

A performer is eligible to knock if ALL of the following are true:

1. **Performer is in roster** (core or hired recruit)
2. **Not on cooldown** (`afterHours.cooldowns[performerId]` < current day OR not set)
3. **Has not completed their encounter** (`afterHours.completed[performerId]` !== true)
4. **Random chance passes** (configurable, e.g., 30% per eligible performer per day)

Only ONE performer can knock per night. If multiple are eligible, pick one randomly.

---

## Reputation Gate for Counter-Offers

Counter-offers require sufficient reputation to succeed:

| Counter-Offer Type | Required Reputation |
|--------------------|---------------------|
| Star Rating +1     | 50                  |
| Recruit Help       | 100                 |

If player's reputation is below the threshold, the performer **refuses** with a message like:

> "You're not important enough to make demands like that. Come back when you've made a name for yourself."

On refusal:
- No encounter happens
- Performer goes on cooldown (e.g., 7 days)
- Day advances

---

## Counter-Offer: Recruit Help

When a performer agrees to "help recruit," they unlock a specific recruit in the recruitment pool. The mapping is defined in config:

| Performer ID | Unlocks Recruit ID |
|--------------|-------------------|
| core_lena_watts | recruit_aria_lux |
| core_milo_park | recruit_celeste_noir |
| core_tess_rowan | recruit_dahlia_slate |

(Additional mappings can be added for hired recruits who then help recruit others.)

This sets a flag: `afterHours.recruitedBy[recruitId] = performerId`

The recruitment system should check this flag to make the recruit available.

---

## Encounter Sequence (Beats)

### Beat 1: The Lock
- Short text, high tension
- Door locks, point of no return
- Dark background, centered text
- Single [Continue] button

### Beat 2: The Build
- Longer second-person prose
- Sensory details, anticipation
- No image yet
- Single [Continue] button

### Beat 3: Slideshow
- 10 images displayed one at a time
- Player clicks to advance
- Progress dots shown (● ○ ○ ○ ○ ○ ○ ○ ○ ○)
- Background: `assets/images/afterdark/system/office_night_bg.png`
- "THE DEAL" text shown at bottom throughout
- Images from: `assets/images/afterdark/encounters/[performer_folder]/[Name]_01.png` through `_10.png`

### Beat 4: Aftermath
- Brief closing text
- Outcomes displayed:
  - ✓ [What they got]
  - ✓ 10 images unlocked in Gallery
  - ✓ [Counter-offer bonus if applicable]
- Single [End Night] button

---

## State Model

Add to `gameState`:

```javascript
afterHours: {
  // Tracks which performers have completed their one-time encounter
  completed: {
    "core_lena_watts": true,
    "recruit_aria_lux": true
  },
  
  // Cooldowns: day number when performer can knock again
  cooldowns: {
    "core_milo_park": 15  // Can knock again on day 15+
  },
  
  // Tracks which recruits were unlocked via counter-offer
  recruitedBy: {
    "recruit_aria_lux": "core_lena_watts"
  },
  
  // Gallery unlocks (for slideshow viewing)
  unlockedPacks: [
    {
      packId: "afterhours_core_lena_watts",
      performerId: "core_lena_watts",
      title: "After Hours: Kendra Lynn",
      imagePaths: ["assets/images/afterdark/encounters/kendra_lynn/Kendra_Lynn_01.png", ...],
      unlockedDay: 12
    }
  ]
}
```

---

## Config Structure

Add to `config.toml`:

```toml
[afterHours]
enabled = true
knockChancePerEligible = 0.30  # 30% chance per eligible performer
cooldownDays = 7               # Days before performer can knock again after refusal
defaultOneTimeFee = 4000
declineLoyaltyPenalty = 10
declineCooldownDays = 10
starBonusReputationRequired = 50
recruitHelpReputationRequired = 100

[afterHours.oneTimeFeesByPerformerId]
core_lena_watts = 5600
core_milo_park = 4800
core_tess_rowan = 3000

[afterHours.recruitMapping]
# Performer ID → Recruit ID they can help unlock
core_lena_watts = "recruit_aria_lux"
core_milo_park = "recruit_celeste_noir"
core_tess_rowan = "recruit_dahlia_slate"

[afterHours.imagePaths]
systemBackground = "assets/images/afterdark/system/office_night_bg.png"
encountersBase = "assets/images/afterdark/encounters/"
```

---

## Content Data

Each performer needs encounter content defined. This can live in config or a separate data file:

```javascript
// Example structure for one performer
{
  performerId: "core_lena_watts",
  performerName: "Kendra Lynn",
  
  // What she wants
  askTitle: "A Private Word",
  askText: "Kendra lingers after the shoot wraps. She glances at the door, then back at you.\n\n\"I've been thinking about my rate. I know what I'm worth. And I know how things work around here.\"\n\nShe steps closer.\n\n\"So let's talk.\"",
  askWant: "Featured scenes (+$50/scene)",
  
  // Her offer
  offerText: "\"One time. Right here. Right now. Then we're even, and I get what I want.\"\n\nShe holds your gaze, waiting.",
  
  // Beat 1: The Lock
  lockText: "\"Deal.\"\n\nKendra holds your gaze for a moment.\n\nThen she turns and locks the door.\n\n*click*",
  
  // Beat 2: The Build
  buildText: "She dims the lights. Not off. Just low enough that the office feels smaller. More private.\n\nYou watch her slip her jacket from her shoulders. It falls to the floor. She doesn't pick it up.\n\n\"You just sit there,\" she says.\n\n\"Let me do this.\"\n\nShe walks toward your desk.",
  
  // Beat 4: Aftermath
  aftermathText: "She gathers her things without looking at you.\n\nAt the door, she pauses.\n\n\"We're even now.\"\n\nShe leaves. The office is quiet.\n\nYou finish your drink.",
  
  // The deal text shown during slideshow
  dealText: "THE DEAL: She gets featured scenes. You get this.",
  
  // Outcome: what she gets
  outcomeLabel: "Kendra's scenes now pay +$50"
}
```

---

## File Structure

```
src/
  systems/
    afterhours.js          # Core system logic
  ui/
    afterhours-render.js   # Modal rendering
    
docs/
  SYSTEM_AFTER_HOURS.md    # This file
  DATA_AFTER_HOURS.md      # Content data for all performers
  
assets/
  images/
    afterdark/
      system/
        office_night_bg.png
      encounters/
        kendra_lynn/
          Kendra_Lynn_01.png ... Kendra_Lynn_10.png
        abella_banks/
          Abella_Banks_01.png ... Abella_Banks_10.png
        (etc for all 10 performers)
```

---

## Integration Points

### 1. Advance Day (src/ui/events.js)

Before advancing the day, check for knock eligibility. If eligible, show knock modal instead of advancing immediately.

### 2. Recruitment System (src/systems/recruitment.js)

Check `afterHours.recruitedBy` when determining recruit availability.

### 3. Gallery System

Add After Hours packs to gallery view alongside Conquest packs.

### 4. Save/Load (src/save.js)

Add `afterHours` to validated state keys.

---

## UI Styling

After Hours uses a distinct visual style:

- **Background:** Dark, warm tones (#1a1412)
- **Text:** Cream/warm white
- **Accents:** Amber/gold highlights
- **Modal:** Glass-dark panel with subtle glow
- **Slideshow:** Full-width image, progress dots below

CSS class: `.after-hours-modal`

---

## Implementation Order

1. **Phase 1:** State model + config (no UI)
2. **Phase 2:** Knock check + basic modal flow
3. **Phase 3:** Encounter sequence (text beats + slideshow)
4. **Phase 4:** Counter-offer logic + reputation gating
5. **Phase 5:** Gallery integration
6. **Phase 6:** Content data for all 10 performers

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| Scope creep | Each phase is independently testable |
| Complex modal state | Reuse existing modal patterns from Conquests |
| Image loading | Use same placeholder fallback as other systems |

---

## Success Criteria

- [ ] Knock modal appears after clicking Advance Day (when eligible)
- [ ] Accept flow completes with slideshow of 10 images
- [ ] Counter-offer flow applies star bonus or unlocks recruit
- [ ] Reputation gate blocks counter-offers correctly
- [ ] Completed encounters appear in Gallery
- [ ] State persists across save/load
