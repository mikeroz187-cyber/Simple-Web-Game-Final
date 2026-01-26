# Core Gameplay Loop (Current)

This document describes the **current implemented loop** and rules as they exist in the codebase. It is the single source of truth for day-to-day gameplay behavior.

## Current Game Rules (Source of Truth)
- **Day flow is manual.** The player advances the day by clicking **Advance Day** on the Hub.
- **Day limit for booking:** New shoots cannot be booked once `player.day >= player.debtDueDay` (default Day 90).
- **No global shoots/day cap.** The game tracks `shootsToday`, but booking is limited by performer availability and contracts.
- **Per‑performer daily cap:** Each contracted performer has a daily booking cap (default 1/day, max 3/day) tracked as consecutive bookings and reset on day advance.
- **Agency Sample Pack:** Optional booking mode available once per day (flat fee + location cost, five-image bundle output).
- **Contracts & availability:** Contracts count down daily; expired contracts must be renewed to book. Fatigue builds per shoot and recovers daily; hitting max fatigue forces rest days.
- **Promo vs Premium:**
  - **Promo** content generates results only when posted on Social.
  - **Premium** content immediately adds OnlyFans subscribers and increases MRR.
- **MRR → daily cash:** Daily cash income is `floor(MRR / daysPerMonth)` and is applied on day advance.
- **Reputation:** Increases from milestone rewards (followers, OF subs, MRR thresholds). It gates Tier 2 location unlocks, recruitment candidates, and studio identity selection.
- **Automation (optional):** If enabled, auto-book or auto-post can run once per day when you click **Advance Day**.
- **Competition & variance:** After Day 181, competition standings and market shifts can modify Promo/Premium outputs, and Premium content may roll variance.

## Daily Flow
1. **Book a shoot** in Booking (Core Performer or Agency Sample Pack).
2. **Review Content** (five-image slideshow preview, metadata).
3. **Review Analytics** (today totals, latest shoot results, rollups, snapshots).
4. **Post Promo** on Social (Instagram and/or X) to convert Promo content into followers/subscribers.
5. **Advance Day** to reset daily availability and apply daily MRR cash.

## Daily Pacing Rules
- **Performer caps:** Daily booking caps are per performer (default 1/day, max 3/day). High‑stamina recruits can exceed the default.
- **Agency Pack limit:** One Agency Sample Pack per day, tracked via `agencyPackUsedToday`.
- **Fatigue & rest:** Fatigue increases per shoot, recovers daily; performers at max fatigue receive a rest-day requirement.
- **Contracts:** Core contracts last 90 days; freelance/Act 2 contracts last 30 days and must be renewed when expired.

## Recruitment Loop
- Recruitment appears at the top of the Roster screen.
- One candidate is shown per day (config-driven) if reputation thresholds are met.
- **Meet** opens a 10‑slide slideshow; **Hire** deducts the hire cost and adds the performer to the roster; **Decline** removes the offer.
- Roster size is capped for **contracted** (non‑freelance) performers.

## Slideshows
- **Recruit Meet:** 10-image slideshow.
- **Shoot Preview (Content screen):** 5-image slideshow for the latest shoot.
- **Gallery:** A shared slideshow viewer for any saved shoot photos.
