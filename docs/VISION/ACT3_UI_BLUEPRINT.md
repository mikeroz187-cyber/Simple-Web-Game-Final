# Act 3 UI Blueprint (Late Game + Endgame)

## 1) UI Principles (Carry Forward)
- one active screen at a time
- render is state -> DOM
- events call systems then re-render
- no inline JS handlers
- no mobile/responsive

## 2) Act 3 UI Change Summary
- New screens introduced: None by default (Act 3 embeds panels in existing screens).
- Existing screens expanded: Hub, Booking, Content, Analytics, Roster (Social remains Act 2 only), Shop (no Act 3 changes unless scope later adds items).
- New global UI elements: None (optional summary cards on Hub only).

## 3) Screen Map (MVP + Act2 + Act3)

| Screen ID | Screen Name | Act | Purpose | Primary Actions |
| --- | --- | --- | --- | --- |
| screen-hub | Hub | MVP + Act2 + Act3 | Status overview + navigation + save/load + late-game summaries | Navigate to MVP screens; Act 3 panels are read-only or trigger Act 3 systems |
| screen-booking | Booking | MVP + Act2 + Act3 | Plan and confirm a shoot + advanced scheduling (Act 3) | Confirm Shoot (MVP); Queue Booking (Act 3) |
| screen-content | Content | MVP + Act3 | Show latest content summary + variance notes | View Analytics; Back to Hub |
| screen-analytics | Analytics | MVP + Act2 + Act3 | Show latest results + advanced summaries + Act 3 impact notes | Book Next Shoot; Back to Hub |
| screen-roster | Roster | MVP + Act2 + Act3 | View performer stats + branch effects summary | Back to Hub |
| screen-social | Social | MVP + Act2 | Post promo content + strategy | Post to Instagram/X; Apply Strategy |
| screen-gallery | Gallery | MVP | Browse content history | Back to Hub |
| screen-shop | Shop | MVP + Act2 | Unlock tiers + purchase equipment | Buy Tier/Upgrade; Back to Hub |

## 4) Detailed Screen Specs (Act 3 Additions Only)

### Screen: Hub (screen-hub)
#### Purpose
Surface Act 3 late-game status at a glance without changing MVP navigation.

#### Layout (Desktop)
- left column: Act 3 status summaries
- right column: Act 3 story/events + competition status
- header row: “Hub” title
- footer row: unchanged MVP navigation + save controls

#### Panels / Sections
- **Panel Name:** Rival Studios & Market Status
  - Reads from gameState: `rivals`, `market`
  - Displays: rival standings summary (rank + score), active market shifts
  - Actions (buttons/controls):
    - Label: “Evaluate Rivals”
    - Enabled/disabled rules: enabled only if rivals config exists
    - On click: calls `competition.evaluateRivalStandings(gameState, context)`
    - Result handling: toast/message from result.message
  - Empty/edge states: “No rival data configured.”

- **Panel Name:** Act 3 Story & Events
  - Reads from gameState: `story.act3`
  - Displays: current Act 3 story status (last event title + day, next event day)
  - Actions (buttons/controls):
    - Label: “Resolve Event”
    - Enabled/disabled rules: enabled only when a pending event is present
    - On click: calls `story.applyAct3StoryEvent(gameState, eventId)`
    - Result handling: toast/message from result.message
  - Empty/edge states: “No Act 3 events available.”

- **Panel Name:** Reputation Branch (Studio Identity)
  - Reads from gameState: `reputation`
  - Displays: selected branch name, branch progress percent
  - Actions (buttons/controls):
    - Label: “Select Branch”
    - Enabled/disabled rules: enabled only if no branch selected and eligibility met
    - On click: calls `progression.selectReputationBranch(gameState, branchId)`
    - Result handling: toast/message from result.message
  - Empty/edge states: “No branch selected.”

- **Panel Name:** Legacy Milestones
  - Reads from gameState: `legacyMilestones`
  - Displays: milestone list with status and completion date
  - Actions (buttons/controls):
    - Label: “Claim Reward” (per milestone)
    - Enabled/disabled rules: enabled only if milestone eligible
    - On click: calls `progression.claimLegacyMilestone(gameState, milestoneId)`
    - Result handling: toast/message from result.message
  - Empty/edge states: “No legacy milestones configured.”

- **Panel Name:** Automation Status (Optional)
  - Reads from gameState: `automation`
  - Displays: automation enabled/disabled summary, min cash reserve, max actions/day
  - Actions (buttons/controls):
    - Label: “Configure Automation”
    - Enabled/disabled rules: enabled only if automation feature is enabled in config
    - On click: calls `automation.setAutomationRules(gameState, automationPayload)`
    - Result handling: toast/message from result.message
  - Empty/edge states: “Automation disabled.”

- **Panel Name:** Schedule Summary (Advanced Scheduling)
  - Reads from gameState: `schedule`
  - Displays: queued bookings count and next scheduled slot
  - Actions (buttons/controls):
    - Label: “Resolve Schedule”
    - Enabled/disabled rules: enabled only if schedule queue has entries
    - On click: calls `booking.resolveScheduledBookings(gameState, context)`
    - Result handling: toast/message from result.message
  - Empty/edge states: “No scheduled bookings.”

#### Notes
- Out of scope items: new navigation screens, prestige/reset controls, or live competition data.

---

### Screen: Booking (screen-booking)
#### Purpose
Add advanced scheduling controls while keeping MVP booking intact.

#### Layout (Desktop)
- left column: performer + availability selection (MVP/Act 2)
- right column: location + theme + scheduling panel
- header row: “Booking” title
- footer row: Confirm Shoot; Back to Hub; Queue Booking (Act 3, if enabled)

#### Panels / Sections
- **Panel Name:** Advanced Scheduling
  - Reads from gameState: `schedule`
  - Displays: queue slots, current queue length, schedule rules (max 3, resolve 1/day)
  - Actions (buttons/controls):
    - Label: “Queue Booking”
    - Enabled/disabled rules: enabled only if scheduling enabled and queue not full
    - On click: calls `booking.queueBooking(gameState, bookingPayload)`
    - Result handling: toast/message from result.message
  - Empty/edge states: “Scheduling not enabled.”

#### Notes
- Out of scope items: passive time advancement, background timers, or multi-performer shoots.

---

### Screen: Content (screen-content)
#### Purpose
Show variance impact on the latest content result (Act 3 variance system).

#### Layout (Desktop)
- left column: content summary (MVP)
- right column: variance notes
- header row: “Content” title
- footer row: View Analytics; Back to Hub

#### Panels / Sections
- **Panel Name:** Variance Notes
  - Reads from gameState: `content.variance`, `content.entries`
  - Displays: variance roll applied, multiplier, and seed roll ID
  - Actions (buttons/controls):
    - None (read-only)
  - Empty/edge states: “Variance not enabled.”

#### Notes
- Out of scope items: new content types or random loot/bonus systems.

---

### Screen: Analytics (screen-analytics)
#### Purpose
Add Act 3 summaries for variance and competitive/event impacts.

#### Layout (Desktop)
- left column: MVP + Act 2 analytics
- right column: Act 3 impact summaries
- header row: “Analytics” title
- footer row: Book Next Shoot; Back to Hub

#### Panels / Sections
- **Panel Name:** Variance Summary
  - Reads from gameState: `content.variance`, `analyticsHistory`
  - Displays: variance rollups and bounds summary (±15% cap)
  - Actions (buttons/controls):
    - None (read-only)
  - Empty/edge states: “No variance data.”

- **Panel Name:** Rival / Market Impact Notes
  - Reads from gameState: `rivals`, `market`
  - Displays: active rival pressure and market modifiers
  - Actions (buttons/controls):
    - None (read-only)
  - Empty/edge states: “No rival or market impacts.”

- **Panel Name:** Act 3 Events Impact
  - Reads from gameState: `story.act3` (or `events.act3` if used)
  - Displays: last event impact summary (modifier + affected metric)
  - Actions (buttons/controls):
    - None (read-only)
  - Empty/edge states: “No Act 3 events.”

#### Notes
- Out of scope items: charts, time-series dashboards, or new analytics tabs.

---

### Screen: Roster (screen-roster)
#### Purpose
Surface reputation branch effects on roster (read-only summary).

#### Layout (Desktop)
- left column: performer list (MVP + Act 2)
- right column: branch effects summary
- header row: “Roster” title
- footer row: Back to Hub

#### Panels / Sections
- **Panel Name:** Reputation Branch Effects
  - Reads from gameState: `reputation`, `roster.performers`
  - Displays: branch effects summary and any roster impacts
  - Actions (buttons/controls):
    - None (read-only)
  - Empty/edge states: “No branch selected.”

#### Notes
- Out of scope items: talent poaching, contract negotiation, or new roster actions.

---

### Screen: Social (screen-social) — Act 3 (If Applicable)
#### Purpose
No confirmed Act 3 additions; keep Act 2 behavior unchanged unless scope expands.

#### Layout (Desktop)
- unchanged from Act 2

#### Panels / Sections
- **Panel Name:** Legacy Score Summary
  - Reads from gameState: `metaProgression.legacyScore`
  - Displays: total legacy score and progress toward next legacy milestone
  - Actions (buttons/controls): None (read-only)
  - Empty/edge states: “Legacy score not started.”

#### Notes
- Out of scope items: new platforms, paid promotion systems, or automation-driven posting unless confirmed.

---

## 5) Milestones / Endgame Goals UI (If Applicable)
Act 3 includes **Legacy / Recognition Milestones**:
- **Where it appears:** Hub → “Legacy Milestones” panel (optional summary in Analytics).
- **How progress is shown:** milestone list with status (locked/in-progress/complete) and completion date when earned.
- **Claims/rewards:** “Claim Reward” action per milestone → `progression.claimLegacyMilestone(gameState, milestoneId)`; success messages from result.message.

## 6) Meta Progression / Prestige UI (If Applicable)
No additional Act 3 mechanics beyond those listed above.

## 7) UI Components Needed (Act 3)
Potential additions to `/src/ui/components.js` (minimal):
- `MilestoneCard(name, status, action)` — legacy milestone display.
- `ProgressBar(label, value, max)` — simple div-based progress bar.
- `StatusList(items)` — compact list for rivals/market/event summaries.
- `ActionRow(buttons)` — standard action row for Act 3 panels.

## 8) Event Wiring (Act 3)
Rules for `/src/ui/events.js`:
- use `data-action` for all actions
- include `data-id` for branch, milestone, event IDs
- map each action to one system call
- on success: save + re-render

Example action mappings (pseudocode):
- `data-action="select-branch" data-id="branch-id"` → `progression.selectReputationBranch(gameState, branchId)`
- `data-action="claim-legacy" data-id="milestone-id"` → `progression.claimLegacyMilestone(gameState, milestoneId)`
- `data-action="evaluate-rivals"` → `competition.evaluateRivalStandings(gameState, context)`
- `data-action="queue-booking"` → `booking.queueBooking(gameState, bookingPayload)`
- `data-action="apply-act3-event" data-id="event-id"` → `story.applyAct3StoryEvent(gameState, eventId)`

## 9) Act 3 UI Acceptance Criteria
- [ ] Act 3 panels render correctly.
- [ ] MVP + Act 2 screens still work.
- [ ] no framework/router complexity introduced.
- [ ] all buttons call systems only.
- [ ] save/export/import safe.
- [ ] migration v2 -> v3 works.

This doc defines Act 3 UI changes only. Do not implement features not explicitly in ACT3_SCOPE.
