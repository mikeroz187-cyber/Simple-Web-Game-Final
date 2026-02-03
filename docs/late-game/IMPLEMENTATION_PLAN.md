# Industry Takeover — Implementation Plan

## Overview

This document provides a phased, step-by-step implementation plan for the Industry Takeover system. Each phase is independently testable and builds on previous phases.

**Total Estimated Phases:** 8  
**Estimated Implementation Time:** 4-6 weeks (depending on pace)

---

## Decisions Locked

- Takeover replaces Competition starting Day 181 (Phase to come).
- Roster cap becomes 40 at Day 181 unlock (recruitment cap override).
- Reputation cap is 100 (global).
- Crisis floor is 10 by default (takeover-specific logic later).
- Full Act 3 takeover lineup ships with 5 studios.

---

## Phase 0: Preparation & Documentation Sync

### Objective
Prepare the codebase and documentation for Industry Takeover implementation.

### Tasks

#### 0.1 Update CURRENT_SCOPE.md
Add Industry Takeover to current scope document.

**File:** `docs/CURRENT_SCOPE.md`

Add to "Currently Working On":
```markdown
- Industry Takeover System — Phase 0 preparation
```

#### 0.2 Confirm Late-Game Docs Source of Truth
Ensure takeover documentation lives in `docs/late-game` and update any references that still point elsewhere.

#### 0.3 Retrofit Existing Rivals Documentation
Update existing rival references to use new studio names.

**Files to update:**
- `docs/DATA_RIVALS.md` — Note that Night Slate → Midnight Media, Luxe Pixel → Velvet Vault
- `src/config.js` — Add migration comments

### Definition of Done
- [ ] All documentation files in place
- [ ] CURRENT_SCOPE.md updated
- [ ] No code changes yet

---

## Phase 1: State Model & Config Foundation

### Objective
Add the takeover state model and config without any UI or gameplay.

### Tasks

#### 1.1 Add Takeover Config
**File:** `src/config.js`

Add complete `CONFIG.takeover` object including:
- System settings (unlockDay, daysPerStage, costs, etc.)
- Studios definitions (all 5)
- Bosses definitions (all 5)
- Performers definitions (all 25)
- Helper functions

Reference: `DATA_STRUCTURE.md` Section 1

#### 1.2 Add Takeover State
**File:** `src/state.js`

Add `takeover` to default gameState with:
- System status fields
- Studio tracking objects
- Performer tracking objects
- Gallery tracking
- Retaliation tracking
- Statistics

Reference: `DATA_STRUCTURE.md` Section 2

#### 1.3 Update Save Validation
**File:** `src/save.js`

- Add `takeover` to required state keys
- Ensure migration calls `ensureTakeoverState` without bumping schema
- Add validation for takeover state structure

#### 1.4 Add Takeover System File (Stub)
**Create:** `src/systems/takeover.js`

Create with stub functions:
```javascript
// Stub - to be implemented in later phases
function checkTakeoverUnlock() {}
function getStudioStatus(studioId) {}
function getPerformerStatus(performerId) {}
function canStartAcquisition(performerId) {}
function startAcquisition(performerId) {}
function advanceAcquisition(performerId) {}
function completeAcquisition(performerId) {}
// ... etc
```

### Definition of Done
- [ ] Config loads without errors
- [ ] New game creates valid takeover state
- [ ] Existing saves load and gain takeover defaults (no schema bump)
- [ ] Save/load roundtrip preserves takeover state
- [ ] No UI changes visible yet

---

## Phase 2: Industry Map Entry + Unlock UX — ✅ Completed

### Objective
Add the player-facing entry point for Industry Takeover with a visible Industry Map screen shell and a Day 181 unlock modal CTA.

### Tasks (Completed)
- [x] Add the Industry Map nav item (hidden until takeover unlock at Day 181).
- [x] Render the Industry Map screen shell with the full studio lineup.
- [x] Add the Day 181 story event and decision modal with “Open Industry Map” CTA.
- [x] Keep navigation/state safe for save/load and non-unlocked states.

### Definition of Done
- [x] Industry nav hidden before Day 181
- [x] Industry nav appears on/after Day 181
- [x] Industry Map screen renders the 5 takeover studios
- [x] Day 181 unlock modal routes to Industry Map
- [x] State persists across save/load

---

## Phase 3: Studio Detail Screen — ✅ Completed

### Objective
Deliver the Studio Detail screen reachable from the Industry Map, showing boss intel and the performer roster with status pills.

### Tasks (Completed)
- [x] Enable “View Studio” navigation from Industry Map cards.
- [x] Add the Studio Detail screen shell (locked/unselected states included).
- [x] Render boss card with portrait fallback and rep requirement copy.
- [x] Render performer roster list for all takeover studios with status pills.
- [x] Include disabled CTAs for boss confrontation and acquisition actions (Phase 4 will implement mechanics).

### Definition of Done
- [x] Industry Map “View Studio” routes to Studio Detail.
- [x] Studio Detail shows header, boss card, and performer roster for takeover studios.
- [x] Status pills render safely with sensible defaults.
- [x] Buttons are visible but disabled (Phase 4 will activate).

---

## Phase 4: Acquisition Stages (Intel/Approach/Turn/Debut) — ✅ Completed

### Objective
Implement the acquisition stage flow (intel → approach → turn → debut) and enable Studio Detail CTAs.

### Tasks (Completed)
- [x] Add acquisition stage state per performer with stage readiness and cooldown tracking (save-safe).
- [x] Enable Begin Acquisition CTA with rep/cash gating and stage cost copy.
- [x] Surface stage progress and Resolve Stage CTA in the Studio Detail roster.
- [x] Apply tier-scaled costs, weakness-based rep penalties on Turn start, and debut rep rewards (+3, capped at 100).
- [x] Support abort outcomes with -15 rep penalty (takeover floor 10) and 7-day cooldown.
- [x] Add stage slideshows capped at max 5 images via convention-based paths with safe fallbacks.
- [x] Add acquired performers to the normal roster with standard contract + loyalty fields.

### Definition of Done
- [x] Performers advance through intel/approach/turn/debut stages without errors.
- [x] Studio Detail CTAs are enabled when requirements are met.
- [x] Boss confrontation remains locked until Phase 5.

---

## Phase 5: Boss Confrontation — ✅ Completed

### Shipped (Phase 5)
- [x] Boss becomes vulnerable at 3+ acquired performers from a studio.
- [x] 5-stage / 10-day boss confrontation flow with resolve-stage modals (manual advance).
- [x] Defeat rewards: auto-acquire remaining performers, trophy tracking, boss collection entry, and +25 reputation (clamped at 100).
- [x] Studio defeat bonus applies +10% theme multiplier for matching Act 3 categories.

---

## Phase 6: Competition Swap + Retaliation Events — ✅ Completed

### Shipped (Phase 6)
- [x] Competition is hidden/inert after Day 181 takeover unlock (Industry Takeover replaces it).
- [x] Retaliation poach attempt system added with scheduling and eligible target logic.
- [x] Poach decision modal (pay to defend or lose performer) with roster removal + rep floor enforcement.

---

## Phase 7: Full Act 3 Expansion + Victory/Endgame — ✅ Completed

### Objective
Expand the takeover roster to 5 studios and deliver the victory/endgame flow.

### Shipped (Phase 7)
- [x] Added Velvet Vault and Saint Sin with bosses and performers (5 studios total).
- [x] Updated Industry Map/Studio Detail to render all takeover studios.
- [x] Added victory detection + one-time “INDUSTRY OWNED” modal.
- [x] Unlocked the Empire endgame screen with trophy grid and summary.

---

## Phase 8: Gallery Integration

### Objective
Integrate takeover content into the gallery.

### Tasks

#### 8.1 Add Takeover Tab to Gallery
**File:** `src/ui/render.js` (gallery section)

Add "TAKEOVER" tab alongside "SHOOTS" and "CONQUESTS".

#### 8.2 Implement Takeover Gallery View
**Create:** `src/ui/takeover-gallery.js`

- List acquired performers with thumbnails
- List defeated bosses with thumbnails
- Locked entries show silhouette
- Click to view full slideshow

#### 8.3 Implement Victory Check
**File:** `src/systems/takeover.js`

```javascript
function checkVictoryCondition() {
  const allDefeated = Object.values(gameState.takeover.studios)
    .every(s => s.status === 'defeated');
  
  if (allDefeated && !gameState.takeover.victoryAchieved) {
    gameState.takeover.victoryAchieved = true;
    gameState.takeover.victoryDay = gameState.player.day;
    triggerVictorySequence();
  }
}
```

#### 8.4 Create Victory Modal
**File:** `src/ui/acquisition-modal.js` (extend)

Victory sequence:
- Full-screen victory artwork
- Empire summary stats
- "Continue to Free Play" button

#### 8.5 Update Industry Map for Victory State
**File:** `src/ui/industry-render.js`

- Show "VICTORY" badge when all studios defeated
- All studio cards show "ACQUIRED"

### Definition of Done
- [ ] Gallery shows Takeover tab
- [ ] Can browse acquired performers in gallery
- [ ] Can browse defeated bosses in gallery
- [ ] Locked content shows appropriately
- [ ] Victory triggers when all 5 bosses defeated
- [ ] Victory modal shows with stats
- [ ] Free play continues after victory
- [ ] Industry Map reflects victory state

---

## Phase 9: Content Population (Parallel)

### Objective
Add all narrative content and placeholder images.

**This phase can run in parallel with Phases 5-8.**

### Tasks

#### 9.1 Write All Performer Content
**File:** `src/config.js` (CONFIG.takeover.content.performers)

For each of 25 performers:
- Intel text
- Approach scenes (2)
- Turn scenes (8)
- Debut scenes (5)

#### 9.2 Write All Boss Content
**File:** `src/config.js` (CONFIG.takeover.content.bosses)

For each of 5 bosses:
- Summons scene
- Negotiation scene
- Power play scene
- Fall scene
- Terms scenes

#### 9.3 Create Placeholder Images
**Directory:** `assets/images/takeover/`

Create placeholder SVGs or temp images for all 455 image slots.

#### 9.4 Final Art Production (Ongoing)
Replace placeholders with final Stable Diffusion artwork as produced.

### Definition of Done
- [ ] All narrative text in place
- [ ] All image paths defined
- [ ] Placeholder images load correctly
- [ ] No broken image references

---

## Testing Checklist

### After Each Phase

- [ ] No console errors
- [ ] New game works
- [ ] Existing saves load and migrate
- [ ] Save/load roundtrip preserves all state
- [ ] UI renders correctly
- [ ] Navigation works

### Full System Test (After Phase 8)

- [ ] Complete acquisition of 1 performer (all 4 stages)
- [ ] Complete acquisition of 3 performers in one studio
- [ ] Complete boss confrontation
- [ ] Handle poach attempt (both defend and lose)
- [ ] Re-acquire lost performer
- [ ] View all gallery entries
- [ ] Complete all 5 studios
- [ ] Victory sequence triggers
- [ ] Free play continues after victory

---

## File Summary

### New Files

| File | Phase |
|------|-------|
| `docs/late-game/*.md` | 0 |
| `src/systems/takeover.js` | 1 |
| `src/ui/industry-render.js` | 2 |
| `src/ui/studio-detail-render.js` | 4 |
| `src/ui/acquisition-modal.js` | 5 |
| `src/ui/retaliation-modal.js` | 7 |
| `src/ui/takeover-gallery.js` | 8 |

### Modified Files

| File | Phases |
|------|--------|
| `docs/CURRENT_SCOPE.md` | 0 |
| `src/config.js` | 1, 9 |
| `src/state.js` | 1 |
| `src/save.js` | 1 |
| `src/ui/router.js` | 2, 4 |
| `src/ui/render.js` | 2, 3, 8 |
| `src/systems/progression.js` | 2, 5, 7 |
| `styles.css` | 3, 4, 5 |

---

## Risk Mitigation

| Risk | Mitigation |
|------|------------|
| Phase scope creep | Each phase has hard DoD; no additions without doc update |
| Integration issues | Test save/load after every phase |
| Content bottleneck | Phase 9 runs parallel; use placeholders |
| Performance with 455 images | Lazy load images; test with placeholders first |
| Complex modal state | Reuse Conquests patterns; don't reinvent |

---

## Notes for Codex

1. **One phase at a time.** Do not combine phases.
2. **Test after every change.** No silent failures.
3. **Follow existing patterns.** Look at Conquests for modal flow reference.
4. **Ask if unclear.** Do not invent features.
5. **Update CURRENT_SCOPE.md** after completing each phase.
