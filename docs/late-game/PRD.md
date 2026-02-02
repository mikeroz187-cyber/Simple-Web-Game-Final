# Industry Takeover — Product Requirements Document

## Overview

Industry Takeover is the Act 3+ endgame system for Studio Empire. It transforms the late game from passive empire maintenance into active industry conquest, where the player systematically dismantles rival studios by acquiring their performers and defeating their bosses.

**Unlock Trigger:** Day 181 (start of Act 3)

**Core Fantasy:** You've built an empire. Now you're going to own the entire industry.

---

## Problem Statement

After completing Acts 1-2, players experience progression axis death:

| Axis | Problem |
|------|---------|
| Money | Nothing expensive left to buy |
| Performers | Star Power caps, loyalty maxes out |
| Reputation | Unlocks everything, then irrelevant |
| Story | Finite beats, ends permanently |
| Competition | Abstract and invisible |

Industry Takeover solves all five by making conquest the core late-game loop.

---

## Success Metrics

1. Players continue engaging for 15+ weeks after Day 181
2. Money remains a constraint throughout endgame
3. Reputation becomes an actively managed resource
4. Each acquisition feels like a meaningful story beat
5. Final victory (all 5 studios defeated) feels earned

---

## Core Mechanics

### The 5 Rival Studios

| Studio | Boss | Specialty | Difficulty |
|--------|------|-----------|------------|
| Neon Cherry | Yuki Tanaka | Cosplay/Kawaii | ★★☆☆☆ |
| Honey Trap Productions | Carmen Reyes | Latina/Curves | ★★★☆☆ |
| Midnight Media | Sasha Volkov | Alt/Edge | ★★★☆☆ |
| Velvet Lens | Dominique Vance | Luxury/Glamour | ★★★★☆ |
| Black Lace Studios | Victoria Kross | BDSM/Fetish | ★★★★★ |

**Note:** Midnight Media and Velvet Lens retrofit the existing Act 3 rivals (Night Slate Media → Midnight Media, Luxe Pixel Studios → Velvet Lens). The other three are new additions.

Each studio has:
- 1 Boss (the owner—ultimate target)
- 5 Performers (stepping stones to the boss)
- A Strength Rating (determines defense against your actions)
- A Brand Identity (visual/thematic distinction)

### Performer Acquisition

Every performer has a **Weakness Type** that determines how you turn them:

| Type | Description | Rep Cost |
|------|-------------|----------|
| Ambition | She wants stardom. You offer it—after a "private audition." | 0 |
| Neglect | Her boss ignores her. You give her attention. | 0 |
| Debt | She owes money. You pay it off. Now she owes you. | -5 |
| Pride | She thinks she's the best. You challenge her to prove it. | -10 |
| Secret | She's hiding something. You found it. Blackmail. | -20 |

### Performer Tiers (Reputation Gating)

| Tier | Rep Required | Position |
|------|--------------|----------|
| 1 | 30 | Outer circle—low loyalty to boss |
| 2 | 50 | Established—harder to turn |
| 3 | 75 | Inner circle—boss's favorites |
| Boss | 100 | The queen herself |

### Acquisition Stages

Each performer acquisition has 4 stages:

| Stage | Name | Duration | Cost | Content |
|-------|------|----------|------|---------|
| 1 | Intel | 2 days | $5,000 | Learn weakness, unlock profile |
| 2 | Approach | 2 days | $10,000 | Make contact, establish dynamic |
| 3 | Turn | 2 days | $25,000 | Exploit weakness (main NSFW content) |
| 4 | Debut | 2 days | $5,000 | First shoot at your studio |

**Total per Tier 1 performer:** 8 days, $45,000
**Tier 2 multiplier:** 1.5x cost ($67,500)
**Tier 3 multiplier:** 2x cost ($90,000)

### Boss Confrontation

When 3+ performers have been acquired from a studio, the Boss becomes vulnerable.

**Boss Confrontation Cost:** $150,000 + 100 reputation required
**Duration:** 10 days (5 stages × 2 days each)
**Current art cap:** Boss stage slideshows are capped at 5 images (placeholder).

Boss confrontation stages:
1. The Summons (she contacts you)
2. The Negotiation (she offers a deal—you reject)
3. The Power Play (she threatens—you're stronger)
4. The Fall (she realizes she's lost)
5. The Terms (she submits)

**Defeating a Boss grants:**
- All remaining performers auto-acquired (debut shoots still trigger)
- Studio brand trophy (permanent bonus)
- Boss joins your "collection" (gallery entry)
- +25 reputation (capped at 100)

---

## Reputation System (Reworked)

### Reputation as Gate
- Tier 1 targets require 30+ rep
- Tier 2 targets require 50+ rep
- Tier 3 targets require 75+ rep
- Bosses require 100 rep (global cap)

### Reputation as Cost
| Action | Rep Change |
|--------|------------|
| Ambition acquisition | 0 |
| Neglect acquisition | 0 |
| Debt acquisition | -5 |
| Pride acquisition | -10 |
| Secret acquisition (blackmail) | -20 |
| Failed acquisition attempt | -15 |
| Sabotage action | -25 |
| Successful debut shoot | +3 |
| Defeating a boss | +25 |
| Defending against poach | +5 |
| Passive recovery | +1/week |

### Reputation as Shield
| Your Rep | Attack Impact |
|----------|---------------|
| 100+ | Minimal damage, poach attempts auto-fail |
| 75-99 | Reduced impact, poach attempts cost $ to counter |
| 50-74 | Normal impact |
| 25-49 | Vulnerable, poach attempts may succeed |
| Below 25 | Crisis—performers may leave unprompted |

---

## Rival Retaliation (Occasional Pressure)

Rivals fight back approximately every 7-14 days:

### Poaching Attempts
A rival targets one of your performers (prioritizing low loyalty).
- Player sees warning with counter-offer cost
- Pay to keep them, or lose them
- Lost performers return to their original studio (or become "free agents")

### Reputation Strikes
Rival spreads rumors about your methods.
- Reputation damage based on your current rep (shield mechanic)

### Temporary Alliances
Two rivals share intel.
- Their performers become harder to approach for 14 days

---

## Performer Integration

Acquired performers become full roster members:
- Bookable for regular shoots
- Standard loyalty mechanics apply
- Standard fatigue mechanics apply
- Star Power with usual progression
- Cost multipliers based on star level (no separate salary)

**Re-acquisition rule:** If you lose a performer to poaching, you can re-acquire them. However, re-acquisition does NOT trigger new image content—they rejoin with their existing gallery entries intact.

---

## Victory Condition

**Win State:** All 5 rival studios defeated (all bosses conquered)

**Victory Sequence:**
1. Final boss defeat triggers victory modal
2. Victory screen with empire summary
3. Transition to free play mode (continue indefinitely)

**Post-Victory Free Play:**
- All 30 acquired performers available
- No new rivals spawn
- Player can continue regular shoots/content
- Gallery complete

---

## Content Requirements

### Per Performer (25 total)
| Asset | Count |
|-------|-------|
| Portrait | 1 |
| Approach images | 2 |
| Turn sequence | 8 |
| Debut shoot | 5 |
| **Subtotal** | 16 |

### Per Boss (5 total)
| Asset | Count |
|-------|-------|
| Portrait | 1 |
| Confrontation sequence | 5 (current cap, placeholder) |
| **Subtotal** | 6 |

### Totals
- Performers: 25 × 16 = **400 images**
- Bosses: 5 × 6 = **30 images**
- **Grand Total: 430 images**

---

## Out of Scope

- Randomly generated rivals (all 5 studios are static/authored)
- Permadeath for performers (losing is setback, not permanent)
- New currencies (uses existing money + reputation)
- Prestige/reset mechanics
- Multiplayer/competitive features
- Real-time elements

---

## Dependencies

- Act 3 unlock (Day 181)
- Existing reputation system (extended, not replaced)
- Existing performer/roster system (extended)
- Existing gallery system (extended)
- Existing Conquests modal pattern (reused for acquisition flow)

---

## Risks & Mitigations

| Risk | Mitigation |
|------|------------|
| 455 images is a lot | Release in waves (2 studios → 2 more → final) |
| Economy imbalance | All costs config-driven, tunable post-launch |
| Rep death spiral | Floor at 10 rep, passive recovery always active |
| Feels grindy | Narrative variety via 5 weakness types, distinct boss personalities |
| Complexity creep | Modal-based flow reuses Conquests pattern |
