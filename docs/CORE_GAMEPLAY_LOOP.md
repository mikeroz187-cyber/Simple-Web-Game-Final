# Core Gameplay Loop (Current)

This document describes the **current implemented loop** and rules as they exist in the codebase. It is the single source of truth for day-to-day gameplay behavior.

## Current Game Rules (Source of Truth)
- **Day flow is manual.** The player advances the day by clicking **Advance Day** on the Hub.
- **Day 90 debt gate:** Day 90 still triggers the win/loss story check, but booking is not blocked after debt is cleared.
- **Debt target:** Act 1 starts with **$25,000** due by Day 90; clearing it is the Act 1 gate that unlocks post-debt systems.
- **Debt payoff controls:** The Hub includes config-driven quick-pay buttons plus Pay Max to reduce debt in chunks before Day 90.
- **Daily shoots cap:** Booking uses `CONFIG.game.shoots_per_day`, but is clamped by `CONFIG.game.hard_shoots_per_day_cap` (hard cap 10). Studio upgrade bonuses do not raise the hard cap.
- **Per‑performer daily cap:** Each contracted performer is limited to 1 shoot per day via `CONFIG.performers.max_daily_bookings_cap`, tracked as consecutive bookings and reset on day advance.
- **Agency Sample Pack:** Optional booking mode available once per day (flat fee + location cost, five-image bundle output).
- **Contracts & availability:** Contracts count down daily; expired contracts must be renewed to book. Fatigue builds per shoot and recovers daily; hitting max fatigue forces rest days.
- **Promo vs Premium:**
  - **Promo** content generates results only when posted on Social.
  - **Premium** content immediately adds OnlyFans subscribers and increases MRR.
- **Pacing guideline:** Early days (≈1–30) favor Promo-heavy output (roughly 2 Promo / 1 Premium) to build footprint; mid/late days should gradually lean Premium-heavy as scaling kicks in.
- **OnlyFans cashflow:** OF subscribers generate daily cash payouts on day advance (config-driven). MRR is informational and corresponds to this cashflow.
- **Scaling overhead:** Daily overhead scales by OF subscribers and is deducted on day advance. After debt is cleared, a one-time **Hire Manager** upgrade reduces overhead by 15% (config-driven). In Act 2, the **Studio Lease Upgrade** adds +$100/day overhead if purchased.
- **Studio upgrade offer UI:** Purchase buttons disable when unaffordable and display "Not enough cash" helper text.
- **Day 120 Staffing Push:** Reach 7 performers with **ACTIVE contracts** by the end of Day 120 (checked when Day 121 begins). Renewals count. Success grants **Halo Staffing** (+1 Star to every roster performer, max 10). Failure triggers a **Staffing Crisis** with daily overhead and per‑shoot booking penalties until the roster has 7 ACTIVE contracts again.
- **Roster caps:** Contracted performers are capped at 5 by default; the Studio Lease Upgrade raises the cap to 7.
- **Reputation:** Increases from milestone rewards (followers, OF subs, MRR thresholds). It gates Tier 2 location unlocks, recruitment candidates, and studio identity selection.
- **Automation (optional):** If enabled, auto-book or auto-post can run once per day when you click **Advance Day**.
- **Competition & variance:** After Day 181, competition standings and market shifts can modify Promo/Premium outputs, and Premium content may roll variance.

### Day 170 — Social Collab Week (Talent Scout)
- **Trigger:** Day 170 (repeats every 14 days if failed or declined via `nextOfferDay`).
- **Requirement:** Post **5 unique** promo contents per day for **7 consecutive days**.
- **Unique rule:** Cross‑posting the same promo to multiple platforms counts as **one** unique promo.
- **Rewards (Option A):** +8 Reputation and **+3% permanent promo social reach** (applies to followers + social subs only, not OF).
- **Failure/Decline:** No penalty; the offer returns in 14 days.

## Daily Flow
1. **Book a shoot** in Booking (Core Performer or Agency Sample Pack).
2. **Review Content** (five-image slideshow preview, metadata).
3. **Review Analytics** (today totals, latest shoot results, rollups, snapshots).
4. **Post Promo** on Social (Instagram and/or X) to convert Promo content into followers/subscribers.
5. **Advance Day** to reset daily availability and apply daily OF payout plus overhead.

## Daily Pacing Rules
- **Performer caps:** Daily booking caps are per performer (1/day) and tracked as consecutive bookings.
- **Agency Pack limit:** One Agency Sample Pack per day, tracked via `agencyPackUsedToday`.
- **Fatigue & rest:** Fatigue increases per shoot, recovers daily; performers at max fatigue receive a rest-day requirement.
- **Contracts:** Core contracts last 90 days; freelance/Act 2 contracts last 30 days and must be renewed when expired.

## Recruitment Loop
- Recruitment appears at the top of the Roster screen.
- One candidate is shown per day (config-driven) if reputation thresholds are met.
- **Meet** opens a 10‑slide slideshow; **Hire** deducts the hire cost and adds the performer to the roster; **Decline** removes the offer.
- Roster size is capped for **contracted** (non‑freelance) performers: 5 base, 7 after the Studio Lease Upgrade.

## Slideshows
- **Recruit Meet:** 10-image slideshow.
- **Shoot Preview (Content screen):** 5-image slideshow for the latest shoot.
- **Gallery:** A shared slideshow viewer for any saved shoot photos.
