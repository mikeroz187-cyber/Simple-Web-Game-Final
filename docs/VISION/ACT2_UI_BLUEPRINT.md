> **Status:** Vision reference only. This document is not authoritative for the current build.
> Current behavior lives in `docs/CORE_GAMEPLAY_LOOP.md` and `docs/GAMESTATE_DATA_MODEL.md`.

> Note: Current runtime config lives in `src/config.js`; `config.toml` is legacy.

# Act 2 UI Blueprint (Additive to MVP)

## 1) UI Principles (Same as MVP)
- Screen-based layout, one active screen at a time.
- Render functions are pure-ish: state -> DOM.
- Events call systems then re-render.
- No inline onclick attributes; use addEventListener delegation.
- No mobile/responsive work.

## 2) Act 2 UI Change Summary
- New screens introduced: None.
- Existing screens expanded: Hub, Booking, Analytics, Roster, Social, Shop.
- New global UI elements: None.

## 3) Screen Map (MVP + Act 2)

| Screen ID | Screen Name | MVP or Act2 | Purpose | Primary Actions |
| --- | --- | --- | --- | --- |
| screen-hub | Hub | MVP + Act2 | Status overview + navigation + save/load | Navigate to MVP screens; Act 2 messaging panels (read-only) |
| screen-booking | Booking | MVP + Act2 | Plan and confirm a shoot | Select performer/location/theme/type; Confirm Shoot |
| screen-content | Content | MVP | Show latest content summary | View Analytics; Back to Hub |
| screen-analytics | Analytics | MVP + Act2 | Show latest results + advanced summaries | Book Next Shoot; Back to Hub |
| screen-roster | Roster | MVP + Act2 | View performer stats + management info | Back to Hub (read-only management unless Act 2 controls are defined) |
| screen-social | Social | MVP + Act2 | Post promo content + set strategy emphasis | Post to Instagram/X; Set Strategy |
| screen-gallery | Gallery | MVP | Browse content history | Back to Hub |
| screen-shop | Shop | MVP + Act2 | Unlock tiers + purchase equipment | Buy Tier/Upgrade; Back to Hub |

## 4) Detailed Screen Specs (Act 2 Additions Only)

### Screen: Hub (screen-hub)
#### Purpose
Surface Act 2 progression signals and narrative messaging without changing MVP navigation.

#### Layout (Desktop)
- left column: status + milestones summary
- right column: Act 2 story/status messaging
- header row: “Hub” title
- footer row: unchanged MVP navigation + save controls

#### Panels / Sections
- **Panel Name:** Milestones Summary
  - Reads from gameState: `milestones`
  - Displays: list of milestone names/statuses (locked/in-progress/complete)
  - Actions (buttons/controls):
    - None (read-only in Act 2)
  - Empty/edge states: “No milestones yet.”

- **Panel Name:** Act 2 Story Status
  - Reads from gameState: `story.act2`, `player.day`
  - Displays: last Act 2 event title + day, plus “Next event at Day X” hint
  - Actions (buttons/controls):
    - None (events auto-fire on day start)
  - Empty/edge states: “Act 2 story not started.”

#### Notes
- Out of scope: Act 3 story, rival studios, prestige/endgame flows.

---

### Screen: Booking (screen-booking)
#### Purpose
Expose Act 2 availability and expanded catalogs while preserving MVP booking flow.

#### Layout (Desktop)
- left column: performer + availability selection
- right column: location tier + theme selection + cost summary
- header row: “Booking” title
- footer row: Confirm Shoot; Back to Hub

#### Panels / Sections
- **Panel Name:** Performer Availability
  - Reads from gameState: `roster.performers`, `performerManagement`, `roster.performerRoles`
  - Displays: availability status, contract days remaining, consecutive bookings
  - Actions (buttons/controls):
    - Performer selection (same as MVP)
    - Enabled/disabled rule: selection blocked if `restDaysRemaining > 0` or `consecutiveBookings >= maxConsecutiveBookings`
    - On click: calls `booking.validateBooking(...)` (selection validation only)
    - Result handling: inline validation message (“Performer must rest.” / “Contract expired.”)
  - Empty/edge states: “No available performers.”

- **Panel Name:** Location Tiers (Expanded)
  - Reads from gameState: `unlocks.locationTiers`
  - Displays: tiered location list with lock status (Tier 0–2) and reputation gates
  - Actions (buttons/controls):
    - Location selection (same as MVP)
    - Enabled/disabled rule: locked tiers disabled
    - On click: calls `booking.validateBooking(...)`
    - Result handling: inline “Locked” indicator
  - Empty/edge states: “No locations unlocked.” (should not happen)

- **Panel Name:** Theme Catalog (Expanded)
  - Reads from gameState: (config-driven only; no new state)
  - Displays: expanded theme list (MVP + Act 2 themes)
  - Actions (buttons/controls):
    - Theme selection (same as MVP)
    - Enabled/disabled rule: none (themes are not gated)
    - On click: calls `booking.validateBooking(...)`
    - Result handling: inline validation message
  - Empty/edge states: “No themes available.”

#### Notes
- Out of scope: multi-performer shoots, equipment selection UI beyond Shop.

---

### Screen: Analytics (screen-analytics)
#### Purpose
Add advanced summaries derived from history without changing MVP results display.

#### Layout (Desktop)
- left column: MVP latest results
- right column: advanced summaries
- header row: “Analytics” title
- footer row: Book Next Shoot; Back to Hub

#### Panels / Sections
- **Panel Name:** Advanced Analytics Summary
  - Reads from gameState: `analyticsHistory`, `content.entries`, `social.posts`, `player`
  - Displays: 7-day and 30-day rollups for MRR, followers, subscribers, promo/premium counts
  - Actions (buttons/controls):
    - None (read-only summary)
  - Empty/edge states: “No analytics history yet.”

- **Panel Name:** Equipment Impact Notes
  - Reads from gameState: `equipment` (and latest content entry via `content.entries`)
  - Displays: equipment levels and applied multipliers (lighting/camera/set dressing)
  - Actions (buttons/controls):
    - None (read-only)
  - Empty/edge states: “No equipment upgrades.”

#### Notes
- Out of scope: charts, time-series dashboards, filters.

---

### Screen: Roster (screen-roster)
#### Purpose
Show expanded performer management details without breaking MVP roster view.

#### Layout (Desktop)
- left column: performer list (MVP + expanded roles)
- right column: performer management details
- header row: “Roster” title
- footer row: Back to Hub

#### Panels / Sections
- **Panel Name:** Performer Roles & Status
  - Reads from gameState: `roster.performers`, `roster.performerRoles`
  - Displays: role labels (Lead/Specialist/Support), availability, contract days remaining
  - Actions (buttons/controls):
    - None (read-only in Act 2)
  - Empty/edge states: “No performers available.”

- **Panel Name:** Retention/Availability Overview
  - Reads from gameState: `performerManagement`
  - Displays: loyalty value, warning state, and consecutive booking count
  - Actions (buttons/controls):
    - None (read-only in Act 2)
  - Empty/edge states: “No management data.”

#### Notes
- Out of scope: hiring/firing UI, negotiation minigames, poaching.

---

### Screen: Social (screen-social)
#### Purpose
Introduce platform emphasis/strategy controls while preserving MVP posting flow.

#### Layout (Desktop)
- left column: strategy controls + summary
- right column: recent posts + promo content selection
- header row: “Social” title
- footer row: Post to Instagram; Post to X; Back to Hub

#### Panels / Sections
- **Panel Name:** Platform Strategy Controls
  - Reads from gameState: `social.strategy`
  - Displays: active strategy name, Instagram/X multipliers, conversion modifier
  - Actions (buttons/controls):
    - Label: “Apply Strategy”
    - Enabled/disabled rule: disabled if strategy selection invalid
    - On click: calls `social.setSocialStrategy(...)`
    - Result handling: toast/message from result.message
  - Empty/edge states: “No strategy selected.”

- **Panel Name:** Strategy Impact Summary
  - Reads from gameState: `social.strategy`, `social.posts`
  - Displays: last post followers/subscribers gained with strategy applied
  - Actions (buttons/controls):
    - None (read-only)
  - Empty/edge states: “No posts yet.”

#### Notes
- Out of scope: additional platforms beyond Instagram/X, paid promotions, scheduling.

---

### Screen: Shop (screen-shop)
#### Purpose
Extend the Shop with additional location tiers and equipment upgrades.

#### Layout (Desktop)
- left column: location tiers
- right column: equipment upgrades
- header row: “Shop” title
- footer row: Back to Hub

#### Panels / Sections
- **Panel Name:** Location Tier Unlocks
  - Reads from gameState: `unlocks.locationTiers`, `player.cash`
  - Displays: tier cards with cost, reputation requirement, and lock status
  - Actions (buttons/controls):
    - Label: “Unlock Tier” (per tier)
    - Enabled/disabled rule: disabled if already unlocked or cash < cost
    - On click: calls `shop.purchaseLocationTier(...)`
    - Result handling: toast/message from result.message
  - Empty/edge states: “No tiers available.”

- **Panel Name:** Equipment Upgrades
  - Reads from gameState: `equipment`, `player.cash`
  - Displays: upgrade cards with level, next cost, and multipliers
  - Actions (buttons/controls):
    - Label: “Buy Upgrade” (per upgrade)
    - Enabled/disabled rule: disabled if maxed or cash < cost
    - On click: calls `shop.purchaseEquipmentUpgrade(...)`
    - Result handling: toast/message from result.message
  - Empty/edge states: “No upgrades available.”

#### Notes
- Out of scope: non-location items, cosmetics, or currencies.

## 5) UI Components Needed (Reusable)
Potential additions/updates in `/src/ui/components.js`:
- `StatusBadge(label, status)` — for availability/locked/unlocked labels.
- `TierCard(title, cost, status, action)` — location tier unlock display.
- `UpgradeCard(title, level, cost, effect, action)` — equipment upgrades.
- `MilestoneRow(name, status)` — compact milestone list rows.
- `StrategySelector(options, selected)` — social strategy dropdown/radio group.

## 6) Event Wiring Rules (Act 2)
- Use `data-action` and `data-id` attributes.
- Central click handler routes actions.
- Each action calls exactly one system function.
- Save and re-render after successful state change.
- Never mutate `gameState` directly in UI.

Example action mappings (pseudocode):
- `data-action="set-social-strategy"` -> `social.setSocialStrategy(gameState, payload)`
- `data-action="buy-location-tier" data-id="tier-2"` -> `shop.purchaseLocationTier(gameState, "tier-2")`
- `data-action="buy-equipment-upgrade" data-id="camera-basic"` -> `shop.purchaseEquipmentUpgrade(gameState, "camera-basic")`
- `data-action="validate-booking"` -> `booking.validateBooking(gameState, payload)`

## 7) UI Copy Rules (Minimal but Consistent)
- UI text can live inline in render functions; keep labels consistent with MVP.
- Prefer using `result.message` from systems for user feedback.
- Do not create a localization system in this historical blueprint (not part of the original Act 2 plan).

## 8) Act 2 UI Acceptance Criteria
- [ ] All new/updated screens render without errors.
- [ ] No MVP screen regressions.
- [ ] All buttons call system APIs only.
- [ ] Screen switching remains stable.
- [ ] Save/export/import still works.
- [ ] No Act 3 elements present.

This doc defines only Act 2 UI changes as originally envisioned. Act 3 UI and endgame flows were not part of this historical plan.
