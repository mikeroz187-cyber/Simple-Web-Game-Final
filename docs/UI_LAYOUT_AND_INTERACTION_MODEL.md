# UI Layout & Interaction Model (Current)

This document describes the **current UI layout and interaction behavior** implemented in `src/ui/render.js` and `src/ui/events.js`.
See `docs/SAVE_LOAD_AND_PERSISTENCE_RULES.md` for the canonical save/load rules.

## Hub
- **Status panel:** Day, Days Left, Shoots Today, Cash, Debt Remaining, Social Followers/Subs, OF Subs, MRR, Reputation, Next Action.
- **Competition panel:** Shows start day before activation; after Day 181 shows standings + active market shift.
- **Studio Identity panel:** Reputation-branch selection (Day ≥ 181 and Reputation ≥ threshold), then locked display.
- **Legacy Milestones panel:** Progress list with status (Complete/In Progress).
- **Automation panel:** Toggles for Automation Enabled, Auto‑Book, Auto‑Post with daily cap note.
- **Save slot panel:** Select active slot; Save Now / Load Save use the selected slot; Autosave writes to Autosave.
- **Primary actions:** Booking, Analytics, Social, Gallery, Story Log, Roster, Shop, Pay Down Debt quick buttons on the Hub.
- **Global actions:** Options (Save Now, Load, Export, Import, New Game) and Advance Day.
- **Options menu:** Bottom-left nav button labeled **Options** opens the save/options dropdown; **New Game** lives in a Danger Zone section with confirmation.
- **Studio Bonus card:** Shows active studio bonus multipliers with a total count.
- **Debug panel (optional):** Only visible with `?debug=1`.

## Booking
- **Booking mode:**
  - **Core Performer** (select a contracted performer).
  - **Agency Sample Pack** (no performer required; once per day).
- **Layout:** Two-pane layout with a Config Bar at the top-left, a Performer Quick-Book Grid in the left pane, and the Booking summary panel on the right.
- **Selections:** Mode, Location, Theme, Content Type (from the Config Bar); performer selection is handled from the grid.
- **Performer Quick-Book Grid:** Shows all non-trophy roster performers with portraits, name, and compact star/loyalty stats.
- **Per-card status + CTA:**
  - Status text shows one primary reason: **Available**, **Already shot today**, **Contract expired**, or **Daily cap reached**.
  - **Book Shoot** is enabled only when the card status is **Available**; otherwise the button reads **Unavailable** and is disabled.
- **Shoot cost panel:** Shows computed cost (base + location; agency pack adds flat fee).
- **Confirm Shoot:** Enabled only when all requirements are satisfied.

## Content
- **Latest shoot preview:** Five‑image slideshow with Prev/Next controls.
- **Metadata:** Performer, location, theme, content type, day created, shoot cost, and sample pack thumbnails (if applicable).
- **Actions:** View Analytics / Back to Hub.

## Analytics
- **Today totals:** MRR change, Social Followers/Subs gained, OF Subs gained.
- **Latest shoot results:** Same metrics + feedback summary.
- **Market shift note:** Shown when competition is active.
- **Rollups:** 7‑day and 30‑day summary lines (config‑driven).
- **Snapshots:** Recent snapshot history (last five entries).

## Roster
- **Recruitment panel:**
  - Shows Reputation + roster size.
  - If roster full → “Roster full.”
  - If no eligible candidate → “Gain reputation to attract new talent.”
  - Otherwise shows a single candidate with **Meet** and **Decline** actions.
- **Master/detail layout:**
  - Left column is a scrollable **Talent** list with compact rows (portrait, name, status pill, star + loyalty icons).
  - Right column shows the **selected performer** detail card (large portrait, stats, contract status, and actions).
  - Selection persists in UI state and defaults to the first available talent if none is selected.
- **Detail card rules:**
  - Shows Star Power, fatigue, loyalty, Diva Fee messaging, contract summary, and availability.
  - **Renew Contract** button appears when a contract expires or is expiring soon.
- **Trophies section (left column):**
  - Appears under a **Trophies** header with a Trophy badge and “Not bookable” status line.
  - Trophy details show a “Not bookable. Added via takeover.” note and do **not** show contract actions.
  - Trophies do **not** count against roster caps and have no contract actions.

## Social
- **Social Strategies:** Choose between Balanced / Growth Focus / MRR Focus.
- **Manual Social Strategy:** Daily budget + channel allocations; apply once per day.
- **Promo Content list:** Only shows promos not fully posted (Instagram + X).
- **Posted Status:** Per‑platform status for the selected promo.
- **Actions:** Post to Instagram or X (each once per platform).
- **Collab Week offer:** Day 170 offer appears as a decision modal with the mascot image `assets/images/mascots/talentscout_introducing.png`.
- **Collab Week tracker:** While active, Social shows a tracker panel (day X/7, today Y/5 unique promos, streak progress).
- **Story Log entries:** Success/fail outcomes add Story Log entries.

## Gallery
- **Mode toggle:** Shoots (default), Conquests, or Bosses.
- **Entry list:** Shows all content entries (day, performer, location, theme, type).
- **Details panel:** Selected entry metadata + **View Shoot Photos** button.
- **Output cards:** Summary cards for recent shoot results.
- **Conquests view:** Lists unlocked Conquest packs with **View** buttons when the Conquests mode is active.
- **Bosses view:** Lists unlocked studio bosses with name, blurb, and a 10‑image placeholder slideshow.

## Industry Map / Studio Detail
- **Industry Map:** Shows the five takeover studios with status badges and progress.
- **Studio Detail:** Performer cards list each target with status, stage info, and acquisition actions.
- **Active acquisition lock:** When an acquisition journey is active, other performer cards are greyed out/disabled and show a short locked label until the journey resolves.

## Conquests
- **Inbox list:** Character name, subject line, stage badge, and status (Unread/Accepted/Dismissed).
- **Multi-character flow:** Inbox aggregates messages across conquest characters; unlocked packs show the character label.
- **Message detail:** Portrait uses the stage-specific mascot filename in `assets/images/mascots/<character>_stageX.png` with fallback to Stage 1 and the mascot placeholder, plus scene title/body, stage badge, and status.
- **Scene text tokens:** Conquest scene body copy can include template tokens (ex: `{{reputation}}`, `{{followers}}`) rendered at display time.
- **Stage triggers:** Trigger rules can include `minDay` and `requiresDebtCleared` gates before the stat/equipment checks are evaluated.
- **Actions:** Accept (unlocks reward pack), Close (dismisses message), View Reward (opens slideshow).
- **Unlocked packs list:** Shows unlocked reward packs with **View** button.
- **Trophies section:** One-time trophy cards with a single-phase “Selfies” slideshow; always available once earned.

## Slideshow (Shared Screen)
- **Recruit Meet:** 10‑slide “Private Audition” with Next button and Hire/Decline on final slide.
- **Shoot Photos:** 5‑slide photo viewer with Prev/Next/Close controls.
- **Conquest Rewards:** Photo viewer for unlocked conquest packs with Prev/Next/Close controls.

## Story Log
- **List view:** Reverse chronological list with previews.
- **Entry view:** Clicking a log entry opens a modal with full text.
