# UI Layout & Interaction Model (Current)

This document describes the **current UI layout and interaction behavior** implemented in `src/ui/render.js` and `src/ui/events.js`.

## Hub
- **Status panel:** Day, Days Left, Shoots Today, Cash, Debt Remaining, Social Followers/Subs, OF Subs, MRR, Reputation, Next Action.
- **Competition panel:** Shows start day before activation; after Day 181 shows standings + active market shift.
- **Studio Identity panel:** Reputation-branch selection (Day ≥ 181 and Reputation ≥ threshold), then locked display.
- **Legacy Milestones panel:** Progress list with status (Complete/In Progress).
- **Automation panel:** Toggles for Automation Enabled, Auto‑Book, Auto‑Post with daily cap note.
- **Save slot panel:** Select active slot; Save Now / Load Save use the selected slot; Autosave writes to Autosave.
- **Primary actions:** Booking, Analytics, Social, Gallery, Story Log, Roster, Shop, Pay Debt.
- **Global actions:** Save Now, Load Save, Export Save, Import Save, Advance Day.
- **Debug panel (optional):** Only visible with `?debug=1`.

## Booking
- **Booking mode:**
  - **Core Performer** (select a contracted performer).
  - **Agency Sample Pack** (no performer required; once per day).
- **Selections:** Performer (core only), Location, Theme, Content Type.
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
- **Contracted Talent panel:**
  - Shows non‑freelance performers only.
  - Displays Star Power, fatigue, loyalty, contract status, and daily availability.
  - **Renew Contract** button appears when a contract expires.

## Social
- **Social Strategies:** Choose between Balanced / Growth Focus / MRR Focus.
- **Manual Social Strategy:** Daily budget + channel allocations; apply once per day.
- **Promo Content list:** Only shows promos not fully posted (Instagram + X).
- **Posted Status:** Per‑platform status for the selected promo.
- **Actions:** Post to Instagram or X (each once per platform).

## Gallery
- **Entry list:** Shows all content entries (day, performer, location, theme, type).
- **Details panel:** Selected entry metadata + **View Shoot Photos** button.
- **Output cards:** Summary cards for recent shoot results.

## Slideshow (Shared Screen)
- **Recruit Meet:** 10‑slide “Private Audition” with Next button and Hire/Decline on final slide.
- **Shoot Photos:** 5‑slide photo viewer with Prev/Next/Close controls.

## Story Log
- **List view:** Reverse chronological list with previews.
- **Entry view:** Clicking a log entry opens a modal with full text.
