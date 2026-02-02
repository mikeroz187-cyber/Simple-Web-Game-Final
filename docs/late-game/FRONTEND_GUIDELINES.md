# Industry Takeover — Frontend Guidelines

## Overview

This document defines UI/UX patterns, screen layouts, component specifications, and interaction models for the Industry Takeover system.

**Design Philosophy:** Extend existing patterns. The takeover system should feel like a natural extension of the game, not a bolted-on module.

---

## 1. Navigation Integration

### Main Nav Addition

Add "Industry" to the main navigation bar (visible only after Day 181):

```
[Hub] [Booking] [Content] [Social] [Analytics] [Gallery] [Industry]
```

### Nav State
- **Before Day 181:** "Industry" nav item hidden
- **Day 181+:** "Industry" nav item visible
- **Active state:** Highlighted when on Industry Map or Studio Detail screens

---

## 2. New Screens

### 2.1 Industry Map Screen

**Purpose:** Overview of all rival studios and player empire status

**Layout Grid:**
```
+----------------------------------------------------------------+
| HEADER                                                          |
| Industry Map                                    [Back to Hub]   |
+----------------------------------------------------------------+
|                                                                 |
|  +------------------+              +------------------+          |
|  | STUDIO CARD      |              | YOUR EMPIRE      |          |
|  | Neon Cherry      |              | [Studio Name]    |          |
|  +------------------+              +------------------+          |
|                                                                 |
|  +------------------+              +------------------+          |
|  | STUDIO CARD      |              | STUDIO CARD      |          |
|  | Honey Trap       |              | Velvet Lens      |          |
|  +------------------+              +------------------+          |
|                                                                 |
|  +------------------+              +------------------+          |
|  | STUDIO CARD      |              | STUDIO CARD      |          |
|  | Midnight Media   |              | Black Lace       |          |
|  +------------------+              +------------------+          |
|                                                                 |
+----------------------------------------------------------------+
| FOOTER STATUS BAR                                               |
| Performers: 12/25 | Studios: 2/5 | Reputation: 87               |
+----------------------------------------------------------------+
```

### Studio Card Component

**States:**
1. **Active** (not yet defeated)
2. **Vulnerable** (3+ performers taken, boss available)
3. **Defeated** (fully acquired)

**Active State:**
```
+---------------------------+
| [Studio Logo/Image]       |
| NEON CHERRY               |
| ★★☆☆☆                    |
+---------------------------+
| Boss: Yuki Tanaka         |
| Performers: 5 remaining   |
| Your progress: 0 acquired |
+---------------------------+
| [VIEW STUDIO]             |
+---------------------------+
```

**Vulnerable State:**
```
+---------------------------+
| [Studio Logo/Image]       |
| NEON CHERRY               |
| ⚠️ VULNERABLE              |
+---------------------------+
| Boss: Yuki Tanaka         |
| Performers: 2 remaining   |
| Your progress: 3 acquired |
+---------------------------+
| [CONFRONT BOSS]           |
+---------------------------+
```

**Defeated State:**
```
+---------------------------+
| [Trophy Badge Overlay]    |
| NEON CHERRY               |
| ✓ ACQUIRED                |
+---------------------------+
| Former Boss: Yuki Tanaka  |
| All 5 performers yours    |
| Studio bonus active       |
+---------------------------+
| [VIEW IN GALLERY]         |
+---------------------------+
```

### Your Empire Card

```
+---------------------------+
| [Your Studio Logo]        |
| YOUR EMPIRE               |
| [Studio Name]             |
+---------------------------+
| Total Performers: 18      |
| (3 core + 15 acquired)    |
| Total MRR: $847,000       |
+---------------------------+
| [VIEW ROSTER]             |
+---------------------------+
```

---

### 2.2 Studio Detail Screen

**Purpose:** View rival studio roster, begin acquisitions

**Layout:**
```
+----------------------------------------------------------------+
| HEADER                                                          |
| [Studio Name]                              [Back to Industry]   |
| "Studio tagline goes here"                                      |
+----------------------------------------------------------------+
| BOSS SECTION                                                    |
+----------------------------------------------------------------+
| +------------+  DOMINIQUE VANCE                                 |
| | [Portrait] |  Status: LOCKED (need 3 performers)              |
| |            |  Rep Required: 100 | Your Rep: 87               |
| +------------+  [LOCKED]                                        |
+----------------------------------------------------------------+
| ROSTER                                                          |
+----------------------------------------------------------------+
| +--------+ Bianca Morel           ★★★☆☆  Tier 1               |
| |[Portrait| Status: AVAILABLE                                   |
| +--------+ Weakness: Hidden until Intel                         |
|            [BEGIN ACQUISITION]                                  |
+----------------------------------------------------------------+
| +--------+ Chanel DuBois          ★★★☆☆  Tier 1               |
| |[Portrait| Status: IN PROGRESS (Stage 2, 1 day left)          |
| +--------+ Weakness: Neglect                                    |
|            [VIEW PROGRESS]                                      |
+----------------------------------------------------------------+
| +--------+ Natasha Kaine          ★★★★☆  Tier 2               |
| |[Portrait| Status: LOCKED                                      |
| +--------+ Rep Required: 50 | Your Rep: 47                      |
|            [LOCKED]                                             |
+----------------------------------------------------------------+
```

### Performer Row Component

**States:**

1. **Locked** (insufficient reputation)
```
+--------+ Name                    ★★★★☆  Tier 2
|[Portrait| Status: LOCKED
| (dimmed)| Rep Required: 50 | Your Rep: 47
+--------+ [LOCKED] (disabled button)
```

2. **Available** (ready to acquire)
```
+--------+ Name                    ★★★☆☆  Tier 1
|[Portrait| Status: AVAILABLE
|        | Weakness: ??? (reveal with Intel)
+--------+ [BEGIN ACQUISITION] (primary button)
```

3. **In Progress** (acquisition underway)
```
+--------+ Name                    ★★★☆☆  Tier 1
|[Portrait| Status: IN PROGRESS
|        | Stage 2: Approach | 1 day remaining
+--------+ [VIEW PROGRESS] (secondary button)
```

4. **Acquired** (now on your roster)
```
+--------+ Name                    ★★★☆☆  Tier 1
|[Portrait| Status: ✓ ACQUIRED
| ✓ badge| Now on your roster
+--------+ [VIEW IN GALLERY] (tertiary button)
```

5. **Lost** (was yours, got poached)
```
+--------+ Name                    ★★★☆☆  Tier 1
|[Portrait| Status: LOST
| ⚠️ badge| Poached by [Rival]
+--------+ [RE-ACQUIRE] (warning button)
```

---

## 3. Modal Patterns

### 3.1 Acquisition Modal (Reuse Conquests Pattern)

The acquisition flow uses the same modal structure as existing Conquests:
- Full-screen overlay
- Dark background with content card
- Progress indicators
- Image display area
- Narrative text area
- Action buttons

**Modal Structure:**
```
+----------------------------------------------------------------+
| MODAL OVERLAY (semi-transparent dark)                           |
|                                                                 |
|   +------------------------------------------------------+     |
|   | MODAL CARD                                            |     |
|   +------------------------------------------------------+     |
|   | HEADER: Stage Title                          [X]     |     |
|   +------------------------------------------------------+     |
|   |                                                      |     |
|   | IMAGE AREA                                           |     |
|   | [Full-width image display]                           |     |
|   |                                                      |     |
|   +------------------------------------------------------+     |
|   | NARRATIVE TEXT                                       |     |
|   | Story/dialogue content goes here.                    |     |
|   +------------------------------------------------------+     |
|   | PROGRESS DOTS (for slideshows)                       |     |
|   | [● ● ● ○ ○ ○ ○ ○]                                    |     |
|   +------------------------------------------------------+     |
|   | ACTION AREA                                          |     |
|   | [Primary Action]              [Secondary Action]     |     |
|   +------------------------------------------------------+     |
|                                                                 |
+----------------------------------------------------------------+
```

### 3.2 Confirmation Modals

For cost confirmations:
```
+------------------------------------------+
| BEGIN INTEL: Bianca Morel                |
+------------------------------------------+
| Cost: $5,000                             |
| Duration: 2 days                         |
|                                          |
| Dig into her background. Find the angle. |
|                                          |
+------------------------------------------+
| [CANCEL]              [PAY $5,000]       |
+------------------------------------------+
```

### 3.3 Event Notification Modals

For rival retaliation events:
```
+------------------------------------------+
| ⚠️ POACHING ATTEMPT                       |
+------------------------------------------+
| [Event description]                      |
|                                          |
| [Option A]                   [Option B]  |
+------------------------------------------+
```

---

## 4. Slideshow Component

Reuse existing slideshow pattern from Conquests/Gallery with these specs:

### Image Display
- Full-width within modal
- Aspect ratio: 16:9 or 4:3 (flexible)
- Fallback: Placeholder SVG if image fails to load

### Progress Indicators
- Dots for total images in sequence
- Filled dot = viewed
- Empty dot = not yet viewed
- Current dot = highlighted

### Navigation
- Click anywhere on image OR [NEXT] button to advance
- No back button (forward-only during acquisition)
- Back button available in Gallery view mode

### Text Display
- Below image
- Max 3-4 lines
- Scrollable if longer

---

## 5. Component Specifications

### 5.1 Reputation Display

Show reputation prominently on Industry screens:

**Compact (nav bar):**
```
Rep: 87
```

**Expanded (with context):**
```
Reputation: 87
├─ Tier 1 targets: ✓ Unlocked (30+)
├─ Tier 2 targets: ✓ Unlocked (50+)
├─ Tier 3 targets: ✓ Unlocked (75+)
└─ Bosses: LOCKED (need 100)
```

### 5.2 Cost Display

Always show player's current cash alongside costs:

```
Cost: $25,000
Your cash: $847,000
[PAY $25,000]
```

If insufficient:
```
Cost: $25,000
Your cash: $12,000
[INSUFFICIENT FUNDS] (disabled)
```

### 5.3 Timer Display

For in-progress acquisitions:

```
Stage 2: Approach
Days remaining: 1
[Advance Day to continue]
```

### 5.4 Star Power Display

Consistent with existing performer displays:
```
★★★☆☆ (3/5)
★★★★★ (5/5)
```

### 5.5 Tier Badges

```
[Tier 1] — Green badge
[Tier 2] — Yellow badge  
[Tier 3] — Red badge
[Boss]   — Purple badge
```

---

## 6. State Indicators

### Acquisition Progress States

| State | Visual | Interaction |
|-------|--------|-------------|
| Not Started | Default appearance | [BEGIN ACQUISITION] |
| Stage 1: Intel | "Intel in progress" | [VIEW PROGRESS] |
| Stage 1 Complete | "Intel complete" | [PROCEED TO APPROACH] |
| Stage 2: Approach | "Approach in progress" | [VIEW PROGRESS] |
| Stage 2 Complete | "Approach complete" | [PROCEED TO TURN] |
| Stage 3: Turn | "Turn in progress" | [VIEW PROGRESS] |
| Stage 3 Complete | "Turn complete" | [PROCEED TO DEBUT] |
| Stage 4: Debut | "Debut in progress" | [VIEW PROGRESS] |
| Complete | ✓ ACQUIRED | [VIEW IN GALLERY] |

### Studio Progress States

| State | Visual | Boss Interaction |
|-------|--------|------------------|
| 0 performers taken | "5 remaining" | LOCKED |
| 1-2 performers taken | "3-4 remaining" | LOCKED |
| 3+ performers taken | "VULNERABLE" badge | [CONFRONT BOSS] |
| Boss confrontation in progress | "Confrontation underway" | [VIEW PROGRESS] |
| Defeated | "✓ ACQUIRED" | [VIEW IN GALLERY] |

---

## 7. Animation & Transitions

### Screen Transitions
- Fade transition between Industry Map ↔ Studio Detail
- Slide-up for modal appearance
- Fade for modal dismissal

### Progress Updates
- Number counters animate when values change
- Progress bars fill smoothly
- Badges pop-in with subtle scale animation

### Slideshow Transitions
- Crossfade between images (300ms)
- Text fades in after image settles

---

## 8. Responsive Considerations

**Desktop-only design (per project constraints):**
- Minimum width: 1024px
- Optimal width: 1280px-1920px
- No mobile breakpoints required

---

## 9. Accessibility

- All interactive elements keyboard-navigable
- Focus states clearly visible
- Image alt text for all portraits/images
- Color not sole indicator of state (use icons/text too)

---

## 10. Error States

### Network/Load Errors
```
+------------------------------------------+
| Unable to load studio data               |
| [RETRY]                                  |
+------------------------------------------+
```

### Invalid State
```
+------------------------------------------+
| This acquisition is no longer valid      |
| (Performer may have been poached)        |
| [RETURN TO STUDIO]                       |
+------------------------------------------+
```

### Insufficient Resources
```
+------------------------------------------+
| Cannot proceed                           |
| Required: $25,000 | You have: $12,000    |
| [CLOSE]                                  |
+------------------------------------------+
```

---

## 11. Gallery Integration

### New Tab in Gallery
```
[SHOOTS] [CONQUESTS] [TAKEOVER]
```

### Takeover Gallery Structure
```
PERFORMERS (acquired)
├── [Studio Name] Section
│   ├── Performer 1 (16 images)
│   ├── Performer 2 (16 images)
│   └── ...
└── [Next Studio] Section
    └── ...

BOSSES (defeated)
├── Boss 1 (11 images)
├── Boss 2 (11 images)
└── ...
```

### Locked Content Display
- Locked performers: Silhouette portrait, name visible, "[LOCKED]" label
- Locked bosses: Silhouette portrait, name visible, "[LOCKED]" label

---

## 12. CSS Class Naming

Follow existing project conventions:

```css
/* Screens */
.industry-map-screen { }
.studio-detail-screen { }

/* Components */
.studio-card { }
.studio-card--active { }
.studio-card--vulnerable { }
.studio-card--defeated { }

.performer-row { }
.performer-row--locked { }
.performer-row--available { }
.performer-row--in-progress { }
.performer-row--acquired { }
.performer-row--lost { }

/* Modals */
.acquisition-modal { }
.acquisition-modal__header { }
.acquisition-modal__image { }
.acquisition-modal__text { }
.acquisition-modal__progress { }
.acquisition-modal__actions { }

/* Elements */
.tier-badge { }
.tier-badge--1 { }
.tier-badge--2 { }
.tier-badge--3 { }
.tier-badge--boss { }

.star-display { }
.rep-display { }
.cost-display { }
```

---

## 13. File Structure (UI)

```
src/
  ui/
    industry-render.js      # Industry Map screen
    studio-detail-render.js # Studio Detail screen
    acquisition-modal.js    # Acquisition flow modals
    takeover-gallery.js     # Gallery integration for Takeover

styles.css                  # Add Industry Takeover styles
```
