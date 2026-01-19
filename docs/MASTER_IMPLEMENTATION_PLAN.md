# Master Implementation Plan (MVP → Act 2 → Act 3)

## 0) How to Use This Plan (Operator Instructions)
- Follow this plan in order. **Do not skip steps.**
- Implement the **smallest runnable slice** first and keep the game playable after every step.
- Prefer stability and correctness over features or polish.
- If any step fails, **fix it before moving on**.
- Do **not** implement Act 2/Act 3 work inside MVP tasks.
- If scope is unclear, stop and confirm with the project owner before proceeding.
- For detailed MVP phase execution, follow **docs/MVP/MVP_BUILD_ORDER.md** as the step-by-step guide. This Master Plan provides the high-level sequence across all acts.

## 1) Global Non-Negotiables (Applies to All Acts)
- Desktop-only, single-page app.
- Vanilla HTML/CSS/JS only.
- **No ES modules / no import/export.**
- No frameworks or build tools.
- Runs locally from `index.html` (file://).
- One authoritative `gameState` object.
- Config-driven values only (no magic numbers).
- Save via `localStorage`.
- Export/import JSON save files.
- Strict file ownership boundaries per MVP file structure.

## 2) Repo Structure Lock (Must Exist Before Any Code)
Authoritative source: `/docs/MVP/MVP_FILE_STRUCTURE.md`.
Repo layout is locked to `/src` for scripts and `/styles.css` for styles (no `/js` or `/styles.css`).

**Required folders/files (must exist before implementation begins):**
```
/
  index.html
  AGENTS.md
  config.toml
  CHANGELOG.md
  /docs
  styles.css
  /src
    main.js
    config.js
    state.js
    save.js
    /utils
      dom.js
      format.js
      rng.js
    /systems
      economy.js
      performers.js
      booking.js
      social.js
      progression.js
      story.js
    /ui
      router.js
      render.js
      events.js
      components.js
  /assets
    /images
      /ui
      /backgrounds
      /placeholders
    /audio (optional)
```

If any required file is missing, **create it as an empty placeholder** before proceeding to logic work.

## 3) MVP Build Plan (Ship This First)
MVP is Act 1 only. Follow the authoritative MVP scope and build order docs. Do not introduce Act 2/3 features.

### MVP Phase 1 — Static Shell + Bootstrap
**Goal:** App loads locally and shows basic MVP screen skeleton with navigation.

**Files touched:**
- `index.html`
- `styles.css`
- `src/main.js`
- `src/config.js`
- `src/state.js`
- `src/ui/router.js`
- `src/ui/render.js`
- `src/ui/events.js`

**Steps:**
1. Build screen containers for MVP screens only: Hub, Booking, Content, Analytics, Social, Gallery, Roster, Shop.
2. Add a top nav in Hub with buttons to all screens.
3. Implement basic show/hide screen routing.
4. Render placeholder text in each screen (no gameplay yet).

**Done when…**
- Opening `index.html` shows the Hub screen.
- Clicking nav buttons switches screens with no console errors.

**Do not do…**
- No gameplay logic or state mutations beyond basic placeholders.
- No Act 2/3 UI panels.

---

### MVP Phase 2 — State + Save Layer
**Goal:** Create `gameState` factory and safe persistence.

**Files touched:**
- `src/state.js`
- `src/save.js`
- `src/main.js`

**Steps:**
1. Implement `newGameState()` exactly per `/docs/MVP/MVP_STATE_MODEL.md`.
2. Add `saveGame()`, `loadGame()`, `exportSaveToFile()`, `importSaveFromFile()`.
3. Validate imports against the MVP state model; reject unknown top-level keys.
4. Wire save/load/export/import to Hub buttons.

**Done when…**
- Save/load works via `localStorage`.
- Export/import round-trip preserves full state.

**Do not do…**
- No new fields outside the MVP state model.
- No Act 2/3 versioning yet.

---

### MVP Phase 3 — Core MVP Screens (UI Only)
**Goal:** Render all MVP screens per `/docs/MVP/MVP_UI_BLUEPRINT.md` with correct layout and placeholders.

**Files touched:**
- `index.html`
- `src/ui/render.js`
- `src/ui/events.js`

**Steps:**
1. Implement render functions for Hub, Booking, Content, Analytics, Social, Gallery, Roster, Shop.
2. Ensure each screen reads from `gameState` (no direct DOM state).
3. Add Back to Hub buttons on all non-Hub screens.

**Done when…**
- Navigation works and each screen renders without errors.
- Empty states display per UI blueprint.

**Do not do…**
- No gameplay mutations; UI only.
- No additional screens beyond MVP list.

---

### MVP Phase 4 — Core MVP Systems (Gameplay)
**Goal:** Implement the MVP loop and systems exactly as scoped.

**Files touched:**
- `src/systems/booking.js`
- `src/systems/economy.js`
- `src/systems/performers.js`
- `src/systems/social.js`
- `src/systems/progression.js`
- `src/systems/story.js`
- `src/ui/events.js`
- `src/ui/render.js`

**Steps:**
1. Booking system: select performer, location, theme, content type; confirm booking.
2. Content creation: add content entry, set `content.lastContentId`.
3. Analytics: compute results per config and attach to content entry.
4. Economy: apply costs, revenue, follower/subscriber changes.
5. Roster: fatigue changes + availability rules.
6. Social: posting Promo content to Instagram/X only.
7. Progression: Tier 1 location unlock only.
8. Story: Act 1 intro + debt reminders on Days 30/60/80 (per config).

**Done when…**
- Booking → Content → Analytics → Book Next loop works repeatedly.
- All actions mutate only `gameState` via systems and save afterwards.

**Do not do…**
- No Act 2/3 systems, no new content types beyond Promo/Premium.
- No additional platforms beyond Instagram/X.

---

### MVP Phase 5 — Balancing Pass + Guardrails Audit
**Goal:** Eliminate magic numbers and verify scope compliance.

**Files touched:**
- `src/config.js`
- Any systems using tunables

**Steps:**
1. Move all tunables into `CONFIG` (mirror of `config.toml`).
2. Verify all calculations use `CONFIG` values.
3. Confirm save/export/import stability after changes.

**Done when…**
- No magic numbers remain in systems.
- Config-driven values are consistent and readable.

**Do not do…**
- No scope expansion; only tuning and cleanup.

---

### MVP Phase 6 — MVP “Release Checklist”
**Goal:** Validate MVP is shippable.

**Checklist:**
- Playable start-to-loop (multiple bookings).
- No console errors.
- Save persists in `localStorage`.
- Export/import works.
- Reset (if present) works safely.
- Runs from `file://`.
- Day 90 end condition triggers correctly.
- Docs match the implementation.

## 4) Act 2 Build Plan (Additive Only)
**Act 2 begins only after the MVP release checklist passes.**

### Act 2 Phase 1 — Save Versioning + Migration (v1 → v2)
**Goal:** Introduce v2 save schema with safe migration.

**Files touched:**
- `src/save.js`
- `src/state.js`

**Steps:**
1. Add `detectVersion(saveObj)`, `migrateV1ToV2(saveObj)`, `validateV2(saveObj)`.
2. Add v2 defaults per `/docs/VISION/ACT2_STATE_EXTENSIONS.md`.
3. Ensure v1 saves migrate deterministically.

**Done when…**
- v1 saves load and migrate to v2 with defaults.

**Do not do…**
- No Act 3 migrations or fields.

---

### Act 2 Phase 2 — State Extensions (v2)
**Goal:** Add Act 2 state keys only as defined.

**Files touched:**
- `src/state.js`

**Steps:**
1. Add new Act 2 keys with defaults: performerManagement, analyticsHistory, equipment, milestones, unlocks.locationTiers, story.act2, social.strategy, roster.performerRoles.
2. Ensure no MVP keys are changed or removed.

**Done when…**
- v2 schema matches `/docs/VISION/ACT2_STATE_EXTENSIONS.md`.

**Do not do…**
- No Act 3 fields or behaviors.

---

### Act 2 Phase 3 — Systems Expansion
**Goal:** Implement Act 2 systems per `/docs/VISION/ACT2_SYSTEMS.md`.

**Files touched:**
- `src/systems/*.js` (expand existing)
- `src/systems/analytics.js` (new, if required)
- `src/systems/shop.js` (new, if required)

**Steps:**
1. Extend existing systems (economy, performers, booking, social, progression, story).
2. Add analytics aggregation and expanded shop only if required.
3. Return standardized Result objects for all actions.

**Done when…**
- Act 2 actions work without breaking MVP behavior.

**Do not do…**
- No Act 3 mechanics or systems.

---

### Act 2 Phase 4 — UI Expansion
**Goal:** Implement Act 2 UI additions per `/docs/VISION/ACT2_UI_BLUEPRINT.md`.

**Files touched:**
- `src/ui/render.js`
- `src/ui/events.js`
- `src/ui/components.js`

**Steps:**
1. Add Act 2 panels to Hub, Booking, Analytics, Roster, Social, Shop.
2. Wire event handlers to Act 2 system calls.
3. Ensure all panels are optional and safe if data is empty.

**Done when…**
- All Act 2 UI panels render and update without errors.

**Do not do…**
- No new screens beyond MVP list.

---

### Act 2 Phase 5 — Act 2 Verification Checklist
**Checklist:**
- MVP loop still works.
- v1 saves migrate safely to v2.
- Act 2 features function and are config-driven.
- Export/import works for v2 saves.

## 5) Act 3 Build Plan (Additive Only)
**Act 3 begins only after Act 2 verification passes.**

### Act 3 Phase 1 — Save Migration (v2 → v3)
**Goal:** Introduce v3 schema with safe migration.

**Files touched:**
- `src/save.js`
- `src/state.js`

**Steps:**
1. Add `migrateV2ToV3(saveObj)` and `validateV3(saveObj)`.
2. Add v3 defaults per `/docs/VISION/ACT3_STATE_EXTENSIONS.md`.
3. Ensure v2 saves migrate deterministically.

**Done when…**
- v2 saves load and migrate to v3 without errors.

**Do not do…**
- No new mechanics beyond Act 3 scope.

---

### Act 3 Phase 2 — State Extensions (v3)
**Goal:** Add Act 3 state keys only as defined.

**Files touched:**
- `src/state.js`

**Steps:**
1. Add Act 3 keys: metaProgression, rivals, market, automation, schedule, legacyMilestones, reputation, story.act3, content.variance.
2. Keep MVP + Act 2 keys intact.

**Done when…**
- v3 schema matches `/docs/VISION/ACT3_STATE_EXTENSIONS.md`.

**Do not do…**
- No schema deletions or renames.

---

### Act 3 Phase 3 — Systems Expansion (Late Game)
**Goal:** Implement Act 3 systems per `/docs/VISION/ACT3_SYSTEMS.md`.

**Files touched:**
- `src/systems/*.js` (extend existing)
- `src/systems/competition.js` (new, if required)
- `src/systems/automation.js` (new, if required)
- `src/systems/content.js` (new, if required)
- `src/systems/milestones.js` (new, if required)

**Steps:**
1. Implement rivalry/market pressure (if configured).
2. Add Act 3 story events and legacy milestones.
3. Add automation and scheduling only if explicitly configured.
4. Ensure all actions return Result objects and remain deterministic.

**Done when…**
- Act 3 systems work without breaking MVP or Act 2 loops.

**Do not do…**
- No prestige/reset unless explicitly confirmed in scope.

---

### Act 3 Phase 4 — UI Expansion (Late Game + Endgame)
**Goal:** Implement Act 3 UI panels per `/docs/VISION/ACT3_UI_BLUEPRINT.md`.

**Files touched:**
- `src/ui/render.js`
- `src/ui/events.js`
- `src/ui/components.js`

**Steps:**
1. Add Act 3 panels to Hub, Booking, Content, Analytics, Roster (and Social only if scope expands it).
2. Wire event handlers to Act 3 system calls.
3. Keep all new panels optional when data is empty.

**Done when…**
- Act 3 panels render and respond with no console errors.

**Do not do…**
- No new screens unless explicitly documented.

---

### Act 3 Phase 5 — Endgame Loop Implementation
**Goal:** Implement Act 3 endgame loop per `/docs/VISION/ACT3_ENDGAME_LOOPS.md`.

**Files touched:**
- `src/systems/*.js` (as needed)
- `src/ui/render.js`

**Steps:**
1. Implement milestone progression and reward claims using `CONFIG.milestones` and `CONFIG.legacyMilestones`.
2. Ensure rivalry/market/event effects integrate cleanly with analytics.
3. Add anti-runaway scaling controls via config (market shift caps 0.85–1.15 and variance caps ±15%).

**Done when…**
- Endgame loop is playable and matches scope without new currencies.

**Do not do…**
- No infinite scaling or unscoped meta systems.

---

### Act 3 Phase 6 — Act 3 Final Checklist
**Checklist:**
- Endgame loop playable.
- All migrations work (v1 → v2 → v3).
- Export/import works for v3 saves.
- MVP + Act 2 still playable.
- No framework patterns or modules.
- Runs locally from `index.html`.

## 6) Quality Gates (Stop Conditions)
**Stop and fix before continuing:**

| Condition | Meaning | Required Fix Before Continuing |
| --- | --- | --- |
| Console errors | App is unstable | Fix JS errors and re-test current phase |
| Save corruption | Save/load fails or loses data | Fix save layer and validate migration |
| Broken navigation | Screens don’t show/hide correctly | Fix routing and re-verify screen map |
| Missing config keys | System uses undefined tunables | Add CONFIG entries and wire correctly |
| State mismatch vs docs | `gameState` differs from state model | Align schema and update docs if approved |

## 7) Debugging Rules (For Non-Developer Operator)
- **Hard refresh:** Close and reopen `index.html` (file://) after edits.
- **Clear localStorage safely:**
  1. Use Export Save to back up.
  2. Open DevTools → Application → Local Storage → delete `studio_empire_save`.
  3. Reload the page.
- **Import safe flow:** If import fails, your current save remains unchanged; check the error message.
- **Confirm migration:** On the Hub, verify the save version in the export JSON (`version` or `meta.saveVersion` depending on act). If it increased after import/load, migration ran.

## 8) What Not To Build (Explicitly Out of Scope)
- Any backend/online features.
- Any auth/login or payment systems.
- Mobile/responsive UI.
- Any frameworks or build tools.
- Multi-page app conversion.
- Unscoped features not listed in MVP/Act 2/Act 3 docs.

## 9) Final “AI Implementation Contract”
- If it’s not documented, it is **not implemented**.
- MVP remains strict and ships first.
- Act 2 and Act 3 are additive only.
- Config-driven, single-state, local-first.
