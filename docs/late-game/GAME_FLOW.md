# Industry Takeover — Game Flow

## Overview

This document describes the player-facing flow of the Industry Takeover system, from unlock through victory.

---

## 1. System Unlock (Day 181)

### Trigger
- Player advances to Day 181 (Act 3 begins)
- One-time story event fires

### Unlock Event
```
TITLE: "Industry Takeover"

TEXT:
Your Talent Scout drops a folder on your desk. Five rival studios. Loose contracts. Desperate talent.

This isn’t competition anymore. It’s acquisition. Own them and the industry bends.

What changes now:
• Industry Map unlocked
• New themes + studio bonuses
• Rival retaliation begins

[Open Industry Map]
```

### Post-Unlock
- Industry Map screen becomes accessible from main navigation
- Existing rivals (Night Slate Media, Luxe Pixel Studios) retrofit to new identities
- All 5 studios visible with basic info

---

## 2. Industry Map Screen

### Layout
```
+--------------------------------------------------+
| INDUSTRY MAP                         [Back to Hub]|
+--------------------------------------------------+
|                                                  |
|   [NEON CHERRY]        [YOUR EMPIRE]             |
|   Yuki Tanaka          Studio Name               |
|   5 performers         X performers              |
|   ★★☆☆☆               $XXX,XXX MRR              |
|                                                  |
|   [HONEY TRAP]         [VELVET VAULT]             |
|   Carmen Reyes         Dominique Vance           |
|   5 performers         5 performers              |
|   ★★★☆☆               ★★★★☆                     |
|                                                  |
|   [MIDNIGHT MEDIA]     [BLACK LACE]              |
|   Sasha Volkov         Victoria Kross            |
|   5 performers         5 performers              |
|   ★★★☆☆               ★★★★★                     |
|                                                  |
+--------------------------------------------------+
| EMPIRE STATS: X/25 performers | X/5 studios      |
+--------------------------------------------------+
```

### Interactions
- Click any rival studio → Opens Studio Detail screen
- Click "Your Empire" → Shows acquired performers roster
- Defeated studios show as "ACQUIRED" with trophy badge
- Studios with 3+ performers poached show "VULNERABLE" indicator on boss

---

## 2.1 Retaliation Beat (Poach Attempt)

When takeover is active, rivals retaliate every 7–14 days (if they still exist and you have takeover-acquired talent).

**Modal:**
```
TITLE: "Poach Attempt"

TEXT:
“A rival studio slid into her DMs with money and an exit plan.
They’re not trying to win. They’re trying to take what’s yours.”

Target: <PerformerName>
Defense Cost: $20,000

[PAY $20,000 — KEEP HER]   [LET HER GO]
```

**Outcomes:**
- **Pay to keep her:** No loss, no reputation hit.
- **Let her go:** Performer removed from roster, takeover performer state marked **lost** with a 14-day cooldown, and **-10 reputation** (takeover floor 10).

---

## 3. Studio Detail Screen

### Layout
```
+--------------------------------------------------+
| VELVET VAULT                        [Back to Map] |
| "Luxury isn't a look. It's a standard."          |
+--------------------------------------------------+
| BOSS: Dominique Vance                            |
| [Portrait]                                       |
| Status: LOCKED (need 3+ performers first)        |
| Reputation Required: 100                         |
+--------------------------------------------------+
| ROSTER                                           |
+--------------------------------------------------+
| [Portrait] Bianca Morel        ★★★☆☆  Tier 1   |
|            Status: AVAILABLE                     |
|            [BEGIN ACQUISITION]                   |
+--------------------------------------------------+
| [Portrait] Chanel DuBois       ★★★☆☆  Tier 1   |
|            Status: AVAILABLE                     |
|            [BEGIN ACQUISITION]                   |
+--------------------------------------------------+
| [Portrait] Natasha Kaine       ★★★★☆  Tier 2   |
|            Status: LOCKED (50 rep required)      |
|            Your rep: 45                          |
+--------------------------------------------------+
| [Portrait] Serena Lake         ★★★★☆  Tier 3   |
|            Status: LOCKED (75 rep required)      |
+--------------------------------------------------+
| [Portrait] Isabelle Fontaine   ★★★★★  Tier 3   |
|            Status: LOCKED (75 rep required)      |
+--------------------------------------------------+
```

### Performer Status States
- **AVAILABLE** — Meets rep requirement, can begin acquisition
- **LOCKED** — Below rep requirement (shows requirement + current rep)
- **IN PROGRESS** — Currently being acquired (shows stage + days remaining)
- **ACQUIRED** — Now on your roster (shows "View in Gallery")
- **LOST** — Was yours, got poached (shows "Re-acquire" option)

### Boss Status States
- **LOCKED** — Need 3+ performers first
- **VULNERABLE** — 3+ performers acquired, can begin confrontation
- **IN PROGRESS** — Confrontation underway
- **DEFEATED** — Studio acquired

---

## 4. Acquisition Flow (Performer)

### Entry Point
Player clicks [BEGIN ACQUISITION] on available performer

### Stage 1: Intel

**Modal appears:**
```
+------------------------------------------+
| INTEL: Bianca Morel                      |
+------------------------------------------+
| Cost: $4,000                             |
| Duration: 2 days                         |
|                                          |
| Dig into her background. Find the angle. |
|                                          |
| [PAY $4,000 — BEGIN INTEL]    [CANCEL]   |
+------------------------------------------+
```

**On confirm:**
- Deduct $4,000
- Set acquisition state to Stage 1
- Set completion day (current day + 2)

**On stage complete (day advance):**
```
+------------------------------------------+
| INTEL COMPLETE: Bianca Morel             |
+------------------------------------------+
| [Portrait Image]                         |
|                                          |
| WEAKNESS IDENTIFIED: Ambition            |
|                                          |
| "She wants to BE Dominique. Literally.   |
| Would do anything to climb."             |
|                                          |
| Star Power: ★★★☆☆                        |
| Current Loyalty: Low                     |
| Risk Level: Minimal                      |
|                                          |
| [PROCEED TO APPROACH]           [ABORT]  |
+------------------------------------------+
```

**Abort cost:** -15 reputation (failed attempt becomes known)

### Stage 2: Approach

**Modal:**
```
+------------------------------------------+
| APPROACH: Bianca Morel                   |
+------------------------------------------+
| Cost: $9,000                             |
| Duration: 2 days                         |
| Rep Cost: None (Ambition type)           |
|                                          |
| Make contact. Let her know you're        |
| interested. See how she responds.        |
|                                          |
| [PAY $9,000 — MAKE CONTACT]   [ABORT]   |
+------------------------------------------+
```

**On stage complete:**
```
+------------------------------------------+
| APPROACH COMPLETE: Bianca Morel          |
+------------------------------------------+
| [Approach Image 1]              [1/2]    |
|                                          |
| SCENE TEXT:                              |
| You arrange a "chance" meeting at an     |
| industry event. She's eager to talk.     |
| Too eager.                               |
|                                          |
| "Dominique doesn't see my potential,"    |
| she says, three drinks in. "But you do,  |
| don't you?"                              |
|                                          |
| You smile. She has no idea.              |
|                                          |
| [NEXT]                                   |
+------------------------------------------+
```

Player clicks through 2 approach images with narrative text.

**Final approach screen:**
```
+------------------------------------------+
| SHE'S INTERESTED                         |
+------------------------------------------+
| [Approach Image 2]                       |
|                                          |
| Bianca is ready to hear your offer.      |
| But she won't come cheap—and she won't   |
| come without proof you're worth it.      |
|                                          |
| [PROCEED TO THE TURN]           [ABORT]  |
+------------------------------------------+
```

### Stage 3: The Turn

**Modal:**
```
+------------------------------------------+
| THE TURN: Bianca Morel                   |
+------------------------------------------+
| Cost: $22,000                            |
| Duration: 2 days                         |
| Rep Cost: None (Ambition type)           |
|                                          |
| Time to close the deal. She wants the    |
| spotlight. Show her what that costs.     |
|                                          |
| [PAY $22,000 — BEGIN]          [ABORT]   |
+------------------------------------------+
```

**On stage complete:**

5-image slideshow with narrative progression (placeholder content, capped at 5 for now):

```
-------------------------------------------+
| THE TURN: Bianca Morel           [3/5]   |
+------------------------------------------+
| [Turn Image 3 - Full Width]              |
|                                          |
|                                          |
|                                          |
+------------------------------------------+
| "You want to be a star? Stars audition.  |
| Privately."                              |
|                                          |
| She hesitates. Then she doesn't.         |
+------------------------------------------+
| [● ● ● ○ ○]                    [NEXT]   |
+------------------------------------------+
```

Player clicks through all 5 images. Final screen:

```
+------------------------------------------+
| THE TURN: COMPLETE                       |
+------------------------------------------+
| [Turn Image 5]                           |
|                                          |
| She's yours now.                         |
|                                          |
| Bianca Morel has agreed to leave         |
| Velvet Vault and join your studio.        |
|                                          |
| [PROCEED TO DEBUT]                       |
+------------------------------------------+
```

### Stage 4: Debut

**Modal:**
```
+------------------------------------------+
| DEBUT SHOOT: Bianca Morel                |
+------------------------------------------+
| Cost: $6,000 (production costs)          |
| Duration: 2 days                         |
|                                          |
| Her first official shoot under your      |
| banner. Make it count.                   |
|                                          |
| [PAY $6,000 — SHOOT DEBUT]     [CANCEL]  |
+------------------------------------------+
```

**On stage complete:**

5-image slideshow:

```
+------------------------------------------+
| DEBUT: Bianca Morel              [1/5]   |
+------------------------------------------+
| [Debut Image 1 - Full Width]             |
|                                          |
+------------------------------------------+
| First day at the new studio.             |
| She's nervous. Professional. Hungry.     |
|                                          |
| This is what she wanted.                 |
+------------------------------------------+
| [● ○ ○ ○ ○]                    [NEXT]   |
+------------------------------------------+
```

**Completion screen:**
```
+------------------------------------------+
| ACQUISITION COMPLETE                     |
+------------------------------------------+
| [Debut Image 5]                          |
|                                          |
| BIANCA MOREL has joined your roster.     |
|                                          |
| ✓ Available for booking                  |
| ✓ 16 images added to Gallery             |
| ✓ Velvet Vault weakened                   |
|                                          |
| Performers remaining: 4                  |
| Boss status: LOCKED (need 2 more)        |
|                                          |
| [RETURN TO STUDIO]      [VIEW GALLERY]   |
+------------------------------------------+
```

---

## 5. Boss Confrontation Flow

### Trigger
Player clicks [BEGIN CONFRONTATION] on vulnerable boss (3+ performers acquired)

### Pre-Confrontation
```
+------------------------------------------+
| CONFRONT: Dominique Vance                |
+------------------------------------------+
| [Boss Portrait]                          |
|                                          |
| You've taken three of her best.          |
| Velvet Vault is wounded.                  |
| Dominique wants to talk.                 |
|                                          |
| Cost: $140,000                           |
| Duration: 10 days                        |
| Reputation Required: 100 (You have: 100) |
|                                          |
| This ends one of two ways:               |
| She submits. Or you walk away.           |
|                                          |
| [PAY $140,000 — ACCEPT MEETING] [DECLINE]|
+------------------------------------------+
```

### Confrontation Stages (5 stages × 2 images each)

**Stage 1: The Summons**
```
She summons you to neutral ground.
Calm voice. Tight smile. She thinks it’s a conversation.
```

**Stage 2: The Negotiation**
```
"A merger," she offers. "Equal partners."
You don't blink. She hears the no anyway.
```

**Stage 3: The Power Play**
```
Threats next. Lawyers. Old favors. Emergency calls.
None of it lands. You’re already bigger.
```

**Stage 4: The Fall**
```
It hits her mid-sentence.
She isn't negotiating anymore.
She's falling.
```

**Stage 5: The Terms**
```
[5-image sequence - placeholder cap for boss stages]
You lay down the terms.
She signs.
The studio is yours.
```

### Victory Screen
```
+------------------------------------------+
| VELVET VAULT — ACQUIRED                   |
+------------------------------------------+
| [Trophy Image]                           |
|                                          |
| Dominique Vance has submitted.           |
| Velvet Vault is yours.                    |
|                                          |
| ✓ 2 remaining performers auto-acquired   |
| ✓ Boss collection entry unlocked         |
| ✓ Studio brand bonus: +10% luxury content|
| ✓ +25 Reputation (capped at 100)         |
|                                          |
| STUDIOS REMAINING: 2/5                   |
|                                          |
| [RETURN TO MAP]            [VIEW GALLERY]|
+------------------------------------------+
```

### Victory Modal + Empire Screen

When the final studio boss is defeated (all 5 studios marked defeated), trigger a one-time victory modal:

- **Title:** INDUSTRY OWNED  
- **Body:**  
  - "Five studios. Twenty-five contracts. One signature."  
  - "You didn’t beat the market — you bought it."  
- **Rewards list:**  
  - ✓ All studios defeated  
  - ✓ Empire screen unlocked  
  - ✓ Free play continues  
- **Primary CTA:** Open Empire  
- **Secondary CTA:** Later  

After acknowledging the modal, unlock the Empire screen:

- **Title:** Empire  
- **Subtitle:** “Five studios. Yours.”  
- **Summary:** studios defeated, performers acquired (25), bosses defeated, takeover attempts  
- **Trophy grid:** one tile per studio showing trophy art and unlocked/locked status  
- **CTA:** Back to Hub (free play continues)

---

## 6. Rival Retaliation Events

### Poaching Attempt (Every 7-14 days)

**Event fires on day advance:**
```
+------------------------------------------+
| ⚠️ POACHING ATTEMPT                       |
+------------------------------------------+
| Sasha Volkov is making moves on          |
| KENDRA LYNN.                             |
|                                          |
| Kendra's loyalty: 45 (vulnerable)        |
| Your reputation: 72 (normal defense)     |
|                                          |
| Counter-offer cost: $20,000              |
|                                          |
| [PAY $20,000 — KEEP HER]   [LET HER GO]  |
+------------------------------------------+
```

**If player pays:** Kendra stays (no reputation change)
**If player declines:** Kendra leaves, -10 reputation, she becomes "LOST" on her original studio

---

## 7. Re-Acquisition Flow

When a performer is lost to poaching, they appear as "LOST" on their original studio (or free agent pool).

### Re-acquisition Rules
- Same 4-stage flow as original acquisition
- Same costs apply
- **NO NEW IMAGES** — skips slideshow content
- Abbreviated text: "She remembers you. This won't take long."
- Still takes 8 days total

### Re-acquisition Modal
```
+------------------------------------------+
| RE-ACQUIRE: Kendra Lynn                  |
+------------------------------------------+
| She left. Now she's back on the market.  |
| Time to remind her where she belongs.    |
|                                          |
| Cost: $41,000 (full acquisition)         |
| Duration: 8 days                         |
|                                          |
| Note: No new content—she's already       |
| in your gallery.                         |
|                                          |
| [BEGIN RE-ACQUISITION]          [CANCEL] |
+------------------------------------------+
```

---

## 8. Victory Sequence

### Trigger
Final boss defeated (all 5 studios acquired)

### Victory Modal
```
+------------------------------------------+
| INDUSTRY OWNED                           |
+------------------------------------------+
| [Victory Artwork]                        |
|                                          |
| Five studios. Twenty-five contracts.     |
| One signature.                           |
|                                          |
| ✓ All studios defeated                   |
| ✓ Empire screen unlocked                 |
| ✓ Free play continues                    |
|                                          |
| [OPEN EMPIRE]               [LATER]      |
+------------------------------------------+
```

### Post-Victory State
- All 25 performers in roster
- All 5 boss gallery entries unlocked
- No new rivals spawn
- Regular gameplay continues indefinitely
- "VICTORY" badge on Industry Map

---

## 9. Gallery Integration

### New Gallery Section: "Conquests → Takeover"

Existing gallery structure:
- Shoots (regular content)
- Conquests (existing system)

New addition:
- **Takeover** (acquired performers + bosses)

### Takeover Gallery Layout
```
+------------------------------------------+
| GALLERY: TAKEOVER                        |
+------------------------------------------+
| PERFORMERS (12/25 acquired)              |
+------------------------------------------+
| [Thumb] Bianca Morel — VIEW              |
| [Thumb] Mika Sato — VIEW                 |
| [Thumb] Pepper Chu — VIEW                |
| [Locked] Kira Kimura                     |
| [Locked] ...                             |
+------------------------------------------+
| BOSSES (2/5 defeated)                    |
+------------------------------------------+
| [Thumb] Yuki Tanaka — VIEW               |
| [Thumb] Carmen Reyes — VIEW              |
| [Locked] Sasha Volkov                    |
| [Locked] Dominique Vance                 |
| [Locked] Victoria Kross                  |
+------------------------------------------+
```

### Individual Performer Gallery View
Shows all 16 images in slideshow format:
- 1 portrait
- 2 approach
- 8 turn
- 5 debut

### Individual Boss Gallery View
Shows all 6 images (current cap):
- 1 portrait
- 5 confrontation sequence
