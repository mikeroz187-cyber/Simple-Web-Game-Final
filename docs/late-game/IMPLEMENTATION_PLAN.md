# Industry Takeover — Implementation Plan

## Overview

This document provides a phased, step-by-step implementation plan for the Industry Takeover system. Each phase is independently testable and builds on previous phases.

**Total Estimated Phases:** 8  
**Estimated Implementation Time:** 4-6 weeks (depending on pace)

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

#### 0.2 Create Takeover Documentation Folder
Create dedicated documentation folder for takeover system.

**Create:** `docs/TAKEOVER/` directory with:
- `PRD.md`
- `GAME_FLOW.md`
- `FRONTEND_GUIDELINES.md`
- `DATA_STRUCTURE.md`
- `IMPLEMENTATION_PLAN.md` (this file)

#### 0.3 Retrofit Existing Rivals Documentation
Update existing rival references to use new studio names.

**Files to update:**
- `docs/DATA_RIVALS.md` — Note that Night Slate → Midnight Media, Luxe Pixel → Velvet Lens
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
- Add migration function v3 → v4
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
- [ ] Existing saves load and migrate to v4
- [ ] Save/load roundtrip preserves takeover state
- [ ] No UI changes visible yet

---

## Phase 2: System Unlock & Navigation

### Objective
Make takeover unlock on Day 181 and add navigation to Industry Map (empty screen).

### Tasks

#### 2.1 Implement Unlock Check
**File:** `src/systems/takeover.js`

```javascript
function checkTakeoverUnlock() {
  if (gameState.takeover.unlocked) return;
  if (gameState.player.day >= CONFIG.takeover.unlockDay) {
    gameState.takeover.unlocked = true;
    gameState.takeover.unlockedDay = gameState.player.day;
    // Trigger unlock event (Phase 3)
  }
}
```

#### 2.2 Hook Unlock Check to Day Advance
**File:** `src/systems/progression.js` or `src/main.js`

Call `checkTakeoverUnlock()` on day advance.

#### 2.3 Add Navigation Item
**File:** `src/ui/render.js` (or navigation component)

Add "Industry" nav item, visible only when `gameState.takeover.unlocked === true`.

#### 2.4 Add Router Entry
**File:** `src/ui/router.js`

Add route for "industry" screen.

#### 2.5 Create Industry Map Screen (Placeholder)
**Create:** `src/ui/industry-render.js`

Render placeholder:
```javascript
function renderIndustryMap() {
  return `
    <div class="industry-map-screen">
      <h1>Industry Map</h1>
      <p>Coming soon...</p>
      <button onclick="navigateTo('hub')">Back to Hub</button>
    </div>
  `;
}
```

### Definition of Done
- [ ] Industry nav hidden before Day 181
- [ ] Industry nav appears on/after Day 181
- [ ] Clicking Industry nav shows placeholder screen
- [ ] Navigation back to Hub works
- [ ] State persists across save/load

---

## Phase 3: Industry Map Screen

### Objective
Build the full Industry Map screen showing all studios and player empire.

### Tasks

#### 3.1 Implement Studio Status Helpers
**File:** `src/systems/takeover.js`

```javascript
function getStudioStatus(studioId) {
  const studio = gameState.takeover.studios[studioId];
  const config = CONFIG.takeover.studios[studioId];
  const acquiredCount = getAcquiredPerformerCount(studioId);
  
  return {
    ...studio,
    ...config,
    acquiredCount,
    remainingCount: config.performerIds.length - acquiredCount,
    isVulnerable: acquiredCount >= CONFIG.takeover.performersToVulnerableBoss
  };
}

function getAcquiredPerformerCount(studioId) {
  const config = CONFIG.takeover.studios[studioId];
  return config.performerIds.filter(id => 
    gameState.takeover.performers[id]?.status === 'acquired'
  ).length;
}
```

#### 3.2 Build Industry Map UI
**File:** `src/ui/industry-render.js`

Full implementation:
- Header with title and back button
- Grid of studio cards (5 rivals + 1 player empire)
- Footer status bar (performers acquired, studios defeated, reputation)
- Studio card click → navigate to studio detail

Reference: `FRONTEND_GUIDELINES.md` Section 2.1

#### 3.3 Add CSS Styles
**File:** `styles.css`

Add styles for:
- `.industry-map-screen`
- `.studio-card`, `.studio-card--active`, `.studio-card--vulnerable`, `.studio-card--defeated`
- Grid layout
- Status bar

### Definition of Done
- [ ] Industry Map shows all 5 rival studios
- [ ] Studio cards show correct status (active/vulnerable/defeated)
- [ ] Player empire card shows roster count
- [ ] Clicking studio card works (next phase)
- [ ] Responsive within desktop constraints

---

## Phase 4: Studio Detail Screen

### Objective
Build the Studio Detail screen showing boss and performer roster.

### Tasks

#### 4.1 Implement Performer Status Helpers
**File:** `src/systems/takeover.js`

```javascript
function getPerformerStatus(performerId) {
  const state = gameState.takeover.performers[performerId];
  const config = CONFIG.takeover.performers[performerId];
  const repRequired = CONFIG.takeover.repRequirements[`tier${config.tier}`];
  const playerRep = gameState.player.reputation;
  
  if (!state) {
    return {
      ...config,
      status: playerRep >= repRequired ? 'available' : 'locked',
      repRequired,
      playerRep,
      canStart: playerRep >= repRequired
    };
  }
  
  return {
    ...config,
    ...state,
    repRequired,
    playerRep
  };
}
```

#### 4.2 Create Studio Detail Screen
**Create:** `src/ui/studio-detail-render.js`

Full implementation:
- Header with studio name, tagline, back button
- Boss section (portrait, status, lock state)
- Performer roster list
- Each performer shows: portrait, name, star power, tier, status, action button

Reference: `FRONTEND_GUIDELINES.md` Section 2.2

#### 4.3 Add Router Entry
**File:** `src/ui/router.js`

Add route for "studio-detail" with studioId parameter.

#### 4.4 Add CSS Styles
**File:** `styles.css`

Add styles for:
- `.studio-detail-screen`
- `.boss-section`
- `.performer-row`, `.performer-row--locked`, `.performer-row--available`, etc.
- `.tier-badge`

### Definition of Done
- [ ] Can navigate from Industry Map to any Studio Detail
- [ ] Boss section shows correctly
- [ ] All 5 performers listed with correct status
- [ ] Tier badges display correctly
- [ ] Locked performers show rep requirement
- [ ] Available performers show "Begin Acquisition" button
- [ ] Back button returns to Industry Map

---

## Phase 5: Acquisition Flow (Core)

### Objective
Implement the 4-stage performer acquisition flow with modals.

### Tasks

#### 5.1 Implement Acquisition Logic
**File:** `src/systems/takeover.js`

```javascript
function canStartAcquisition(performerId) {
  const status = getPerformerStatus(performerId);
  if (status.status !== 'available') return { allowed: false, reason: 'Not available' };
  
  const cost = getAcquisitionCost(performerId, 1);
  if (gameState.player.cash < cost) return { allowed: false, reason: 'Insufficient funds' };
  
  return { allowed: true };
}

function startAcquisition(performerId, stage) {
  const cost = getAcquisitionCost(performerId, stage);
  gameState.player.cash -= cost;
  gameState.takeover.stats.totalSpent += cost;
  
  gameState.takeover.performers[performerId] = {
    status: 'in_progress',
    currentStage: stage,
    stageStartDay: gameState.player.day,
    stageCompleteDay: gameState.player.day + CONFIG.takeover.daysPerStage,
    acquiredDay: null,
    lostDay: null,
    lostTo: null,
    isReacquisition: false
  };
  
  save();
}

function checkAcquisitionProgress() {
  // Called on day advance
  // Check all in_progress acquisitions
  // If current day >= stageCompleteDay, mark stage as ready to advance
}

function advanceAcquisition(performerId) {
  // Move to next stage or complete
}

function completeAcquisition(performerId) {
  const performer = gameState.takeover.performers[performerId];
  performer.status = 'acquired';
  performer.acquiredDay = gameState.player.day;
  
  // Add to player roster
  addPerformerToRoster(performerId);
  
  // Add to gallery
  gameState.takeover.gallery.performers.push(performerId);
  
  // Update stats
  gameState.takeover.stats.performersAcquired++;
  
  // Check studio vulnerability
  updateStudioStatus(CONFIG.takeover.performers[performerId].studioId);
  
  save();
}
```

#### 5.2 Create Acquisition Modal
**Create:** `src/ui/acquisition-modal.js`

Modal flow implementation:
- Stage intro/confirmation modal
- Stage complete modal with slideshow
- Handle all 4 stages
- Abort option with rep penalty

Reference: `GAME_FLOW.md` Section 4

#### 5.3 Hook Acquisition Check to Day Advance
**File:** `src/systems/progression.js` or `src/main.js`

Call `checkAcquisitionProgress()` on day advance.

#### 5.4 Add Modal CSS
**File:** `styles.css`

Add styles for:
- `.acquisition-modal`
- `.acquisition-modal__header`, `__image`, `__text`, `__progress`, `__actions`
- Slideshow progress dots

### Definition of Done
- [ ] Can start acquisition from Studio Detail screen
- [ ] Stage 1 (Intel) flow works: pay → wait 2 days → see result
- [ ] Stage 2 (Approach) flow works: pay → wait → slideshow (2 images)
- [ ] Stage 3 (Turn) flow works: pay → wait → slideshow (8 images)
- [ ] Stage 4 (Debut) flow works: pay → wait → slideshow (5 images)
- [ ] Acquisition completes: performer added to roster
- [ ] Performer appears in player roster
- [ ] Gallery entry unlocked
- [ ] Studio status updates correctly
- [ ] Abort works with rep penalty
- [ ] Costs deducted correctly
- [ ] State persists across save/load

---

## Phase 6: Boss Confrontation

### Objective
Implement boss confrontation when studio is vulnerable.

### Tasks

#### 6.1 Implement Boss Confrontation Logic
**File:** `src/systems/takeover.js`

```javascript
function canStartBossConfrontation(bossId) {
  const boss = CONFIG.takeover.bosses[bossId];
  const studio = gameState.takeover.studios[boss.studioId];
  const acquired = getAcquiredPerformerCount(boss.studioId);
  
  if (acquired < CONFIG.takeover.performersToVulnerableBoss) {
    return { allowed: false, reason: 'Need 3+ performers first' };
  }
  
  if (gameState.player.reputation < CONFIG.takeover.repRequirements.boss) {
    return { allowed: false, reason: 'Insufficient reputation' };
  }
  
  if (gameState.player.cash < CONFIG.takeover.costs.bossConfrontation) {
    return { allowed: false, reason: 'Insufficient funds' };
  }
  
  return { allowed: true };
}

function startBossConfrontation(bossId) {
  // Similar to startAcquisition but for boss
}

function completeBossConfrontation(bossId) {
  const boss = CONFIG.takeover.bosses[bossId];
  const studioId = boss.studioId;
  
  // Mark boss defeated
  gameState.takeover.bossConfrontations[bossId].status = 'defeated';
  gameState.takeover.bossConfrontations[bossId].defeatedDay = gameState.player.day;
  
  // Mark studio defeated
  gameState.takeover.studios[studioId].status = 'defeated';
  gameState.takeover.studios[studioId].defeatedDay = gameState.player.day;
  
  // Auto-acquire remaining performers
  autoAcquireRemainingPerformers(studioId);
  
  // Add boss to gallery
  gameState.takeover.gallery.bosses.push(bossId);
  
  // Reputation bonus
  gameState.player.reputation += CONFIG.takeover.repChanges.bossDefeated;
  
  // Stats
  gameState.takeover.stats.bossesDefeated++;
  
  // Check victory condition
  checkVictoryCondition();
  
  save();
}
```

#### 6.2 Create Boss Confrontation Modal
**File:** `src/ui/acquisition-modal.js` (extend)

Add boss confrontation flow:
- 5 stages × 2 images each
- Final stage is longer sequence
- Victory screen for studio acquisition

#### 6.3 Update Studio Detail Screen
**File:** `src/ui/studio-detail-render.js`

- Show "CONFRONT BOSS" button when vulnerable
- Show confrontation progress when in progress

### Definition of Done
- [ ] Boss shows "VULNERABLE" when 3+ performers acquired
- [ ] Can start boss confrontation
- [ ] 5-stage flow works with 2-day intervals
- [ ] Final stage shows full image sequence
- [ ] Boss defeat triggers studio acquisition
- [ ] Remaining performers auto-acquired (with debut shoots queued)
- [ ] Gallery entries unlocked
- [ ] Rep bonus applied
- [ ] Studio shows as DEFEATED on Industry Map

---

## Phase 7: Rival Retaliation & Re-acquisition

### Objective
Implement rival counterattacks and the ability to re-acquire lost performers.

### Tasks

#### 7.1 Implement Retaliation System
**File:** `src/systems/takeover.js`

```javascript
function checkRetaliation() {
  // Called on day advance
  const lastEvent = gameState.takeover.retaliation.lastEventDay;
  const daysSince = lastEvent ? gameState.player.day - lastEvent : Infinity;
  
  if (daysSince < CONFIG.takeover.retaliation.minDaysBetweenEvents) return null;
  
  // Random check for event
  const chance = Math.min(1, (daysSince - CONFIG.takeover.retaliation.minDaysBetweenEvents) / 
    (CONFIG.takeover.retaliation.maxDaysBetweenEvents - CONFIG.takeover.retaliation.minDaysBetweenEvents));
  
  if (Math.random() > chance) return null;
  
  // Determine event type
  return generateRetaliationEvent();
}

function generateRetaliationEvent() {
  // Weighted random: poach attempt (60%), rep strike (30%), alliance (10%)
  // Return event object
}

function executePoachAttempt(performerId, rivalStudioId) {
  // Mark performer as under poach attempt
  // Return event data for modal
}

function resolvePoachAttempt(performerId, playerDefends) {
  if (playerDefends) {
    // Deduct counter-offer cost
    // Add rep bonus
    gameState.takeover.stats.poachAttemptsDefended++;
  } else {
    // Performer lost
    losePerformer(performerId, rivalStudioId);
    gameState.takeover.stats.poachAttemptsLost++;
  }
}

function losePerformer(performerId, toStudioId) {
  const performer = gameState.takeover.performers[performerId];
  performer.status = 'lost';
  performer.lostDay = gameState.player.day;
  performer.lostTo = toStudioId;
  
  // Remove from roster
  removePerformerFromRoster(performerId);
  
  gameState.takeover.stats.performersLost++;
  
  save();
}
```

#### 7.2 Implement Re-acquisition
**File:** `src/systems/takeover.js`

```javascript
function startReacquisition(performerId) {
  // Same as startAcquisition but:
  // - isReacquisition = true
  // - Skip slideshow content
  // - Abbreviated text
}
```

#### 7.3 Create Retaliation Event Modals
**Create:** `src/ui/retaliation-modal.js`

- Poach attempt modal with counter-offer option
- Rep strike notification
- Alliance warning notification

#### 7.4 Hook Retaliation to Day Advance
**File:** `src/systems/progression.js` or `src/main.js`

Check for retaliation events on day advance, show modal if triggered.

### Definition of Done
- [ ] Retaliation events trigger every 7-14 days
- [ ] Poach attempts show modal with counter-offer
- [ ] Paying counter-offer keeps performer
- [ ] Declining loses performer
- [ ] Lost performers show "LOST" status on their studio
- [ ] Can re-acquire lost performers
- [ ] Re-acquisition skips image content
- [ ] Rep strikes apply damage based on rep shield
- [ ] Alliances increase costs temporarily

---

## Phase 8: Gallery Integration & Victory

### Objective
Integrate takeover content into gallery and implement victory sequence.

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
| `docs/TAKEOVER/*.md` | 0 |
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
