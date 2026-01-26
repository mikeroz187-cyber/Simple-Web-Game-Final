STATUS: Historical (MVP reference). MVP is complete and frozen. For current scope, see CURRENT_SCOPE.md.

# MVP Build Order (Codex Execution Plan)

## 1) Purpose
This document exists to **prevent scope creep** and enforce a strict, sequential MVP build order. Follow each phase in order, **verify it works**, and only then proceed. If a requirement is not explicitly listed in the MVP scope sources, it is **out of scope** and must not be built.

## 2) Global MVP Rules (Non-Negotiables)
- Desktop-only web app (no mobile/responsive work).
- Single-page app.
- Vanilla HTML/CSS/JS only.
- No frameworks (React/Vue/etc.).
- No build tools (no bundlers, no npm, no node).
- No backend.
- No database.
- No authentication/login.
- No payments.
- One authoritative `gameState` object.
- Save via `localStorage`.
- Export/import JSON save files.
- Config-driven values (no magic numbers).
- Must run by opening `index.html` locally (no server required).

## 3) Authority & Scope Lock
**Authoritative sources (highest to lowest):**
1) `docs/CURRENT_SCOPE.md` (wins all conflicts)
2) `docs/SCOPE_MVP.md`
3) `docs/MVP/MVP_OVERVIEW.md`
4) `AGENTS.md`
5) Any other existing MVP docs

**Scope lock:** If a feature is not explicitly in the MVP scope sources above, it is **out of scope**. Do not guess. Do not invent systems.

## 4) Definition of Done (for any step)
A step is “done” only when:
- Works in browser with placeholder assets.
- Writes/reads from `gameState`.
- Uses config-driven values (no magic numbers).
- Doesn’t break previous steps.
- Save/load still works (after Step 2 exists).

## 4.5) Implemented MVP Notes (Historical)
- **DONE:** Manual Advance Day is a player-facing UI action and the canonical Act 1 time control.
  - **Prerequisite for:** story events, milestones, and any future automation systems (post-MVP).

## 5) Build Phases (THE ACTUAL SEQUENCE)

### Phase 0 — Preflight (Read + Plan)
**Goal:** Prevent mistakes before code changes.

**Read required docs:**
- `docs/CURRENT_SCOPE.md`
- `docs/SCOPE_MVP.md`
- `docs/MVP/MVP_OVERVIEW.md`
- `AGENTS.md`

**Confirm:** “MVP = Act 1 only (Days 1–90)” and the core loop exactly as defined.

**Verification (inside this doc):**
- Codex lists the MVP loop and the out-of-scope list in 5 bullets.
  - MVP loop: Book → Content → Analytics → Strategy → Repeat.
  - Out of scope: Acts 2–3, rivals/competition, POV scenes, mobile/responsive UI, online systems.

**Exit criteria:** Ready to scaffold without guessing.

**Regression checklist:**
- No files changed yet.
- Plan matches scope docs exactly.

---

### Phase 1 — Repo + File Skeleton (No Gameplay Yet)
**Goal:** Create minimal runnable SPA shell.

**Files created/edited (minimum):**
- `index.html`
- `styles.css`
- `src/main.js`
- `src/state.js`
- `src/ui/router.js`
- `src/ui/render.js`
- `src/save.js`
- `src/config.js`
- Placeholder `assets/` folders (only if required by existing docs)

**Implementation checklist:**
- Add screen containers for MVP screens only (use IDs from MVP scope docs).
- Add basic top nav + screen show/hide behavior.
- Add minimal render loop stub (renders placeholder text).

**Verification steps:**
- Opening `index.html` shows the Hub screen.
- Clicking nav changes screens without errors.

**Exit criteria:** “Screens exist, navigation works, nothing is implemented yet.”

**Regression checklist:**
- App loads with no console errors.
- Navigation works.
- No gameplay logic yet.

---

### Phase 2 — gameState Contract + New Game
**Goal:** Lock the state model early so everything plugs into it.

**Files touched:**
- `src/state.js`
- `src/main.js`

**Implementation checklist:**
- Implement `newGameState()` factory.
- Add only MVP fields required (no Act 2/3, no rival system).

**Verification steps:**
- New game state produces stable defaults and re-renders correctly.

**Exit criteria:** `gameState` exists, is authoritative, and drives rendering.

**Regression checklist:**
- App loads with no console errors.
- Navigation works.
- gameState is the single source of truth.

---

### Phase 3 — Persistence Foundation (localStorage + Export/Import)
**Goal:** Ensure progress can’t be lost during dev.

**Files touched:**
- `src/save.js` + small UI hooks

**Implementation checklist:**
- `saveGame()` and `loadGame()` for localStorage.
- `exportSave()` downloads JSON.
- `importSave()` validates then loads JSON.

**Verification steps:**
- Refresh preserves state.
- Export from one session and import into a fresh session restores state.

**Exit criteria:** Save system is real and safe.

**Regression checklist:**
- Save/load works.
- Export/import works.
- App still runs by opening `index.html` locally.

---

### Phase 4 — Config-Driven Values (No Magic Numbers)
**Goal:** Centralize tunables.

**Files touched:**
- `src/config.js` (+ reference `config.toml` as the source-of-truth table)

**Implementation checklist:**
- All tunables referenced via `CONFIG`.
- Add explicit note: when running via `file://`, runtime config must be JS (no fetch).

**Verification steps:**
- Searching code shows tunables are pulled from `CONFIG`, not hard-coded.

**Exit criteria:** CONFIG is used everywhere going forward.

**Regression checklist:**
- App loads with no console errors.
- No magic numbers in gameplay logic.

---

### Phase 5 — Booking UI (Selections Only)
**Goal:** Build the booking screen UI first, without results.

**Files touched:**
- `index.html`
- `src/ui/render.js`
- `src/systems/booking.js` (if `systems/` folder exists)

**Implementation checklist:**
- Performer/location/theme/content-type selectors populate from config data.
- Validate affordability + availability in UI (simple).

**Verification steps:**
- You can select options and the UI reflects them.

**Exit criteria:** Booking is selectable but does not yet generate content.

**Regression checklist:**
- Navigation works.
- gameState is still authoritative.
- Save/load still works.

---

### Phase 6 — Core Loop v1 (Book → Generate Content Record → View Content)
**Goal:** Create the smallest playable loop.

**Files touched:**
- Booking system + gallery/content viewer stubs

**Implementation checklist:**
- “Book Shoot” creates a content entry record in `gameState.content.entries`.
- Deduct cost, advance day per the Day Advancement Rules in `docs/MVP/MVP_OVERVIEW.md`, apply basic fatigue increment.
- Content Viewer shows placeholder image + summary text.

**Verification steps:**
- Do 3 shoots in a row and see 3 items saved in library.
- Reload restores them.

**Exit criteria:** Loop works end-to-end with placeholder assets.

**Regression checklist:**
- Save/load works.
- Export/import works.
- Navigation works.

---

### Phase 7 — Analytics v1 (MRR Change + Followers + Subscribers)
**Goal:** Show results + reinforce loop.

**Implementation checklist:**
- Analytics screen reads last content result.
- Applies simple deterministic formulas (from `CONFIG`) for:
  - MRR change
  - Follower gain
  - Subscriber gain (if MVP requires it)

**Verification steps:**
- Booking changes outcomes (not random unless docs allow).

**Exit criteria:** Player sees “what happened” clearly after each shoot.

**Regression checklist:**
- Core loop still works.
- No console errors.

---

### Phase 8 — Hub (Stats + Debt Countdown)
**Goal:** Make the game feel like a management sim.

**Implementation checklist:**
- Hub shows money, day, debt remaining, days left, followers/subscribers/reputation.
- Add Act 1 fail/win check stub (lose at Day 90 if debt unpaid).

**Verification steps:**
- After each loop, Hub stats update correctly.

**Exit criteria:** Hub is reliable and reflects state.

**Regression checklist:**
- Save/load still works.
- Navigation still works.

---

### Phase 9 — Gallery (Browse All Content)
**Goal:** Let player review history.

**Implementation checklist:**
- Gallery lists `gameState.content.entries`.
- Click item → open viewer.

**Verification steps:**
- Items persist after reload and open correctly.

**Exit criteria:** Browsing history works.

**Regression checklist:**
- Save/load works.
- Export/import works.

---

### Phase 10 — Social Posting (MVP Platforms Only)
**Goal:** Promo loop amplification.

**Implementation checklist:**
- Post promo content to allowed MVP platforms only (per scope docs).
- Posting updates followers via `CONFIG`.
- Store per-item posted flags by appending `gameState.social.posts` records (`contentId`, `platformId`, `postedAtDay`), then derive “has this content been posted to platform X?” at render time (no content mutation).

**Verification steps:**
- Posting affects follower totals and persists.

**Exit criteria:** Social system is minimal but real.

**Regression checklist:**
- Save/load works.
- No new platforms added.

---

### Phase 11 — Performer Roster (Fatigue + Availability)
**Goal:** Integrate performer management.

**Implementation checklist:**
- Roster screen lists performers with stats.
- Fatigue increases on shoots, recovers via clear rule.
- Exhausted performers become unavailable for booking.

**Verification steps:**
- You can “burn out” a performer and see booking lock them out.

**Exit criteria:** Performers impact gameplay decisions.

**Regression checklist:**
- Core loop still works.
- Save/load still works.

---

### Phase 12 — Upgrade Shop (1 simple upgrade only)
**Goal:** One upgrade mechanic to prove progression.

**Implementation checklist:**
- Implement one upgrade type only (as allowed by MVP scope):
  - Unlock one location **OR** one equipment tier **OR** one cost reducer.
- Purchases stored in `gameState`.

**Verification steps:**
- Buying upgrade changes booking options and persists.

**Exit criteria:** One upgrade works without expanding scope.

**Regression checklist:**
- Save/load works.
- No new upgrade systems added.

---

### Phase 13 — Act 1 Debt Events (Minimal Narrative Hooks)
**Goal:** Make the 90-day debt pressure real.

**Implementation checklist:**
- Simple day-triggered messages/reminders.
- End-state check at Day 90.

**Verification steps:**
- Trigger events on correct days.

**Exit criteria:** Act 1 loop completes with clear stakes.

**Regression checklist:**
- No console errors.
- Core loop still works.

---

### Phase 14 — MVP Polish + Guardrails Pass
**Goal:** Stabilize.

**Implementation checklist:**
- Add basic error handling (safe rendering).
- Ensure all screens usable with keyboard/mouse.
- Remove dead code and out-of-scope hooks.

**Verification steps:**
- Full regression pass below succeeds.

**Exit criteria:** MVP is shippable as local `index.html`.

**Regression checklist:**
- All regression items pass.

---

## 6) Regression Checklist (Run After EVERY Phase)
- App loads with no console errors.
- Navigation works.
- `gameState` is the single source of truth.
- Save/load works.
- Export/import works.
- Booking loop works.
- Gallery opens items.
- No new screens/features added outside MVP.

## 7) “Stop and Ask” Conditions (Owner Approval Required)
- Any new screen not listed in MVP docs.
- Any new system not in scope.
- Any new config parameter not already defined.
- Any refactor touching many files.

## 8) Explicit NOT-YET List (Hard Block)
**From `docs/CURRENT_SCOPE.md`:**
- Acts 2 & 3 (beyond Day 90).
- Rival studios or competition systems.
- POV special scenes.
- Mobile/responsive support.
- Online features (backend, database, accounts, payments).
- Any framework or build tooling.

**From `docs/SCOPE_MVP.md`:**
- Acts 2 & 3 story content.
- Rival studios/competition systems.
- POV special scenes (only Promo and Premium exist).
- Mobile/responsive UI.
- Online systems (backend, accounts, payments).
- Frameworks/build tools (React/Vue, bundlers, TypeScript).
- Additional content types (e.g., POV), Reddit platform, paid promotions, viral mechanics, custom subscriber requests.
- Performer poaching, awards, moral alignment paths, chemistry/duo shoots, contract negotiations.
- Tier 2–3 locations or equipment upgrade tiers (only Tier 0–1 locations).
- Background music or complex animations.
