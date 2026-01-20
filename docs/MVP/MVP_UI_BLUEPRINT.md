STATUS: Historical (MVP reference). MVP is complete and frozen. For current scope, see CURRENT_SCOPE.md.

# MVP UI Blueprint (Screens, Layouts, and Actions)

## 1) Purpose
This document is the authoritative MVP UI blueprint. It exists to prevent UI guessing: **if a screen, component, or action is not listed here, it must not be built.** The UI must match the MVP scope documents exactly.

## 2) UI Global Rules (MVP)
- Single-page app: screens are containers shown/hidden.
- No responsive/mobile layout work.
- No animations required for MVP.
- UI reads from `gameState`; actions mutate state via functions (no DOM-based state).
- All numeric outputs use config-driven formatting rules **if defined**.
- Every screen must have a title, primary actions, and a **Back to Hub** link/button (allowed by MVP docs).

## 3) Navigation Model
**Allowed MVP screens (no others):** Hub, Booking, Content, Analytics, Social, Gallery, Roster, Shop.

**Navigation behavior:**
- Hub is the central navigation screen with buttons to all other screens.
- Each non-Hub screen includes a **Back to Hub** action.
- No navigation to screens outside the MVP list is allowed.
- Default starting screen: **Hub**.

**Illegal navigation rule:** Attempting to navigate to a non-MVP screen is invalid and must be blocked.

**Screen table (authoritative):**

| Screen ID | Display Name | Purpose | Entry Conditions | Exit Links |
| --- | --- | --- | --- | --- |
| screen-hub | Hub | Central status + navigation + save/load controls | Always allowed | Booking, Analytics, Social, Gallery, Roster, Shop |
| screen-booking | Booking | Plan and confirm a shoot | Always allowed | Back to Hub, Confirm Shoot (go to Content) |
| screen-content | Content | Show last created content summary | Requires `content.lastContentId` | View Analytics, Back to Hub |
| screen-analytics | Analytics | Show results from the latest content | Requires `content.lastContentId` | Book Next Shoot (go to Booking), Back to Hub |
| screen-roster | Roster | View performer stats | Always allowed | Back to Hub |
| screen-social | Social | Post Promo content to Instagram or X | Requires at least one Promo content entry | Back to Hub |
| screen-gallery | Gallery | Browse content history | Always allowed | Back to Hub |
| screen-shop | Shop | Buy Tier 1 location unlock | Always allowed | Back to Hub |

## 4) Screen Blueprints (The Core of This Doc)

### Screen: Hub (screen-hub)
**Goal:** Provide the at-a-glance status and navigation for the MVP loop.

**Reads from `gameState`:**
- `player.day`
- `player.cash`
- `player.debtRemaining`
- `player.debtDueDay`
- `player.shootsToday`
- `player.followers`
- `player.subscribers`
- `player.reputation`

**Primary actions (buttons):**
- Booking → `navigateTo('screen-booking')`
- Analytics → `navigateTo('screen-analytics')`
- Social → `navigateTo('screen-social')`
- Gallery → `navigateTo('screen-gallery')`
- Roster → `navigateTo('screen-roster')`
- Shop → `navigateTo('screen-shop')`
- Pay Debt → `payDebt()`
- Save Now → `saveToLocalStorage()`
- Load Save → `loadFromLocalStorage()`
- Export Save → `exportSaveFile()`
- Import Save → `importSaveFile()`

**Layout (top-to-bottom):**
1. Title: “Hub”.
2. Status summary panel: Day, Shoots Today, Cash, Debt Remaining (with Debt Due Day), Followers, Subscribers, Reputation.
3. Debt action row: Pay Debt button (disabled until cash >= debt remaining).
4. Navigation buttons: Booking, Analytics, Social, Gallery, Roster, Shop.
5. Save slot selector (dropdown).
6. Save controls: Save Now, Load Save, Export Save, Import Save.

**Empty state rules:**
- Not applicable (Hub always shows status; values can be zero).

**Validation rules:**
- Disable Analytics/Social/Content-related navigation if there is no `content.lastContentId` or no Promo content (as applicable).

**Success feedback:**
- Save/Load/Export/Import actions show a short confirmation message (e.g., “Save complete.”).

**Error handling (MVP):**
- If save/load/export/import fails validation, show a short error message without technical details.

**Out of scope on this screen:**
- No advanced settings, no reset button.

---

### Screen: Booking (screen-booking)
**Goal:** Select shoot inputs and confirm a booking.

**Reads from `gameState`:**
- `roster.performers`
- `unlocks.locationTier1Unlocked`
- `player.cash`

**Primary actions (buttons):**
- Confirm Shoot → `confirmBooking()`
- Back to Hub → `navigateTo('screen-hub')`

**Layout (top-to-bottom):**
1. Title: “Booking”.
2. Performer selection list (core + freelance performers from `roster.performers`).
3. Location selection list (from config; Tier 1 options enabled only if `unlocks.locationTier1Unlocked`).
4. Theme selection list (from config; themes are defined in `config.toml` and mirrored in `docs/DATA_THEMES.md`).
5. Content type selection: Promo or Premium (from config).
6. Shoot cost display (config-driven, based on selected location).
7. Primary action row: Confirm Shoot, Back to Hub.

**Empty state rules:**
- If no performers exist (should not happen), show “No performers available.” and disable Confirm Shoot.

**Validation rules:**
- Confirm Shoot disabled until performer, location, theme, and content type are all selected.
- Confirm Shoot disabled if `player.cash` is less than the computed shoot cost.

**Success feedback:**
- After Confirm Shoot, navigate to Content screen showing the generated content summary.

**Error handling (MVP):**
- If booking fails validation, show a short message (e.g., “Select all fields and ensure enough cash.”).

**Out of scope on this screen:**
- No multi-performer shoots, no equipment upgrades, no contracts, no paid promotions.

---

### Screen: Content (screen-content)
**Goal:** Show the latest content result and the shoot summary.

**Reads from `gameState`:**
- `content.lastContentId`
- `content.entries` (resolve the latest entry)

**Primary actions (buttons):**
- View Analytics → `navigateTo('screen-analytics')`
- Back to Hub → `navigateTo('screen-hub')`

**Layout (top-to-bottom):**
1. Title: “Content”.
2. Content placeholder (image or asset placeholder only; no new assets required in MVP).
3. Shoot summary: performer, location, theme, content type, day created, shoot cost.
4. Primary action row: View Analytics, Back to Hub.

**Empty state rules:**
- If no content exists, show “No content yet. Book a shoot first.” and disable View Analytics.

**Validation rules:**
- View Analytics disabled if `content.lastContentId` is null.

**Success feedback:**
- None beyond navigation to Analytics.

**Error handling (MVP):**
- If `content.lastContentId` is missing or invalid, show a short error message.

**Out of scope on this screen:**
- No content editing, no deletion, no sharing, no multi-image galleries.

---

### Screen: Analytics (screen-analytics)
**Goal:** Review the latest results and decide the next move.

**Reads from `gameState`:**
- `content.lastContentId`
- `content.entries` (latest entry results)

**Primary actions (buttons):**
- Book Next Shoot → `navigateTo('screen-booking')`
- Back to Hub → `navigateTo('screen-hub')`

**Layout (top-to-bottom):**
1. Title: “Analytics”.
2. Latest results panel: revenue gained, followers gained, subscribers gained, feedback summary.
3. Primary action row: Book Next Shoot, Back to Hub.

**Empty state rules:**
- If no content exists, show “No analytics yet. Book a shoot first.” and disable Book Next Shoot.

**Validation rules:**
- Book Next Shoot always allowed; Analytics requires `content.lastContentId` to display results.

**Success feedback:**
- None beyond navigation.

**Error handling (MVP):**
- If latest content results are missing, show a short error message.

**Out of scope on this screen:**
- No charts, no long-term trend dashboards, no filtering.

---

### Screen: Roster (screen-roster)
**Goal:** View performer stats and availability.

**Reads from `gameState`:**
- `roster.performers`

**Primary actions (buttons):**
- Back to Hub → `navigateTo('screen-hub')`

**Layout (top-to-bottom):**
1. Title: “Roster”.
2. Performer list (core and freelance sections).
3. Each performer card shows name, type, starPower, fatigue, loyalty.
4. Primary action row: Back to Hub.

**Empty state rules:**
- If no performers exist (should not happen), show “No performers available.”

**Validation rules:**
- None.

**Success feedback:**
- None (read-only view).

**Error handling (MVP):**
- If performer data is missing, show a short error message.

**Out of scope on this screen:**
- No hiring/firing UI beyond existing roster, no detailed profiles, no scheduling.

---

### Screen: Social (screen-social)
**Goal:** Post Promo content to Instagram or X for reach impact.

**Reads from `gameState`:**
- `social.posts`
- `content.entries` (Promo content only)
- `player.day`

**Primary actions (buttons):**
- Post to Instagram → `postPromoContent('Instagram')`
- Post to X → `postPromoContent('X')`
- Back to Hub → `navigateTo('screen-hub')`

**Layout (top-to-bottom):**
1. Title: “Social”.
2. Recent posts list (platform, day posted, followers gained, subscribers gained).
3. Promo content selection (latest Promo content or list of Promo entries).
4. Primary action row: Post to Instagram, Post to X, Back to Hub.

**Empty state rules:**
- If no Promo content exists, show “No Promo content available to post.” and disable Post buttons.

**Validation rules:**
- Post buttons disabled unless a Promo content entry is selected.

**Success feedback:**
- Short message (e.g., “Posted to Instagram. +X followers.”).

**Error handling (MVP):**
- If posting fails validation, show a short error message.

**Out of scope on this screen:**
- No additional platforms, no paid promotions, no scheduling, no viral mechanics.

---

### Screen: Gallery (screen-gallery)
**Goal:** Browse previously created content entries.

**Reads from `gameState`:**
- `content.entries`

**Primary actions (buttons):**
- Back to Hub → `navigateTo('screen-hub')`

**Layout (top-to-bottom):**
1. Title: “Gallery”.
2. Content list/grid (each entry shows day, performer, location, theme, content type).
3. Entry action: Open entry details (inline detail panel within the Gallery screen).
4. Primary action row: Back to Hub.

**Empty state rules:**
- If no content exists, show “No content yet. Book a shoot first.”

**Validation rules:**
- Opening entry details requires a valid content entry ID.

**Success feedback:**
- None (read-only details).

**Error handling (MVP):**
- If a referenced entry is missing, show a short error message.

**Out of scope on this screen:**
- No deletion, no editing, no sorting/filters beyond a basic list.

---

### Screen: Shop (screen-shop)
**Goal:** Purchase the Tier 1 location unlock.

**Reads from `gameState`:**
- `unlocks.locationTier1Unlocked`
- `player.cash`

**Primary actions (buttons):**
- Buy Unlock → `purchaseTier1Location()`
- Back to Hub → `navigateTo('screen-hub')`

**Layout (top-to-bottom):**
1. Title: “Shop”.
2. Tier 1 location unlock card: cost (from config), status (locked/unlocked).
3. Primary action row: Buy Unlock, Back to Hub.

**Empty state rules:**
- If already unlocked, show “Tier 1 location unlocked.” and disable Buy Unlock.

**Validation rules:**
- Buy Unlock disabled if already unlocked or `player.cash` is less than unlock cost.

**Success feedback:**
- Short message (e.g., “Tier 1 location unlocked.”).

**Error handling (MVP):**
- If purchase fails validation, show a short error message.

**Out of scope on this screen:**
- No additional shop items, no equipment tiers, no cosmetics.

---

## 5) Shared UI Components (MVP-only)

### Component: Screen Title Bar
- **Where used:** All screens.
- **What it shows:** Screen title.
- **Actions:** None.

### Component: Back to Hub Button
- **Where used:** All non-Hub screens.
- **What it shows:** “Back to Hub”.
- **Actions:** `navigateTo('screen-hub')`.

### Component: Primary Action Button Style
- **Where used:** All screens with primary actions.
- **What it shows:** Clear label, consistent size.
- **Actions:** Calls the screen’s primary action function.

### Component: Status Summary Panel
- **Where used:** Hub.
- **What it shows:** Day, Shoots Today, Cash, Debt Remaining (with Debt Due Day), Followers, Subscribers, Reputation.
- **Actions:** None.

### Component: List/Card Item
- **Where used:** Booking (performers/locations/themes), Roster (performers), Gallery (content entries), Social (posts).
- **What it shows:** Minimal fields needed for that screen.
- **Actions:** Selection or detail view where applicable.

## 6) Actions List (Authoritative UI → System Calls)

| Action Name | Trigger UI | Calls Function | Writes `gameState` | Notes |
| --- | --- | --- | --- | --- |
| NAVIGATE_SCREEN | Hub or Back buttons | `navigateTo(screenId)` | No | Only to allowed MVP screens. |
| CONFIRM_BOOKING | Booking → Confirm Shoot | `confirmBooking()` | Yes | Creates content entry, charges cost, advances day after loop. |
| VIEW_ANALYTICS | Content → View Analytics | `navigateTo('screen-analytics')` | No | Requires latest content. |
| BOOK_NEXT_SHOOT | Analytics → Book Next Shoot | `navigateTo('screen-booking')` | No | Starts next loop. |
| POST_PROMO_INSTAGRAM | Social → Post to Instagram | `postPromoContent('Instagram')` | Yes | Requires Promo content entry. |
| POST_PROMO_X | Social → Post to X | `postPromoContent('X')` | Yes | Requires Promo content entry. |
| BUY_TIER1_LOCATION | Shop → Buy Unlock | `purchaseTier1Location()` | Yes | Requires enough cash; writes unlock state. |
| PAY_DEBT | Hub → Pay Debt | `payDebt()` | Yes | Clears remaining debt when cash >= debt. |
| SELECT_SAVE_SLOT | Hub → Save Slot dropdown | `setSaveSlot(slotId)` | No | Sets the slot used by Save/Load actions. |
| SAVE_NOW | Hub → Save Now | `saveToLocalStorage()` | Yes | Writes full `gameState` to the selected slot. |
| LOAD_SAVE | Hub → Load Save | `loadFromLocalStorage()` | Yes | Replaces `gameState` from the selected slot after validation. |
| EXPORT_SAVE | Hub → Export Save | `exportSaveFile()` | No | Exports full `gameState` as JSON. |
| IMPORT_SAVE | Hub → Import Save | `importSaveFile()` | Yes | Replaces `gameState` after validation. |
| VIEW_GALLERY_ENTRY | Gallery → Open entry | `selectGalleryEntry(entryId)` | No | In-screen detail view only. |

## 7) UI Copy & Messaging Rules (Minimal)
- Use clear, blunt labels.
- Avoid lore walls.
- Use short notifications for results (e.g., “Shoot booked. +$X revenue.”).
- No profanity required (unless explicitly required in scope).

## 8) MVP Visual Style Guidelines (Simple + Consistent)
- Desktop-only, single-page layout.
- Use a simple two-column layout where helpful (left controls / right preview).
- Basic readable fonts and spacing (from config where defined).
- Buttons and lists should be consistent across screens.
- No complex CSS frameworks.

## 9) UI Verification Checklist (Owner + Codex)
- [ ] Can I reach every MVP screen from the Hub?
- [ ] Does every action change the correct numbers in `gameState`?
- [ ] Does Save/Load/Export/Import work from the UI?
- [ ] Does the UI match the allowed screens list exactly?

## FINAL CHECK
- The screens list matches the MVP scope docs exactly.
- No speculative screens or actions are included.
- Location IDs and theme IDs are defined in CONFIG within /src/config.js
