# Core Gameplay Loop (Current)

This document describes the **current** (post-MVP) gameplay loop as approved in `docs/CURRENT_SCOPE.md`.

## Daily Flow
1. **Book shoots** from the Booking screen using a core performer or the Agency Sample Pack.
2. **Review results** in Content and Analytics.
3. **Post Promo** on Social if available.
4. **Advance Day** manually when ready to reset daily availability.

## Daily Pacing Rules
- **No global shoots/day cap.** Daily pacing is governed by **per-performer booking caps**.
- **Performer daily cap:** Each contracted performer has a configurable daily booking cap (default 1/day, max 3/day). High-stamina recruits can reach 2–3/day.
- **Agency Sample Pack:** Can be used **at most once per day**.

## Reputation Progression (Milestones Only)
- Reputation increases **only** from milestone rewards tied to:
  - Social Followers
  - OF Subscribers
  - MRR
- Reputation-type milestones remain as achievements (no reward required).

## Recruitment Loop
- Recruitment appears on the Roster screen and is gated by Reputation thresholds.
- The player can **Meet** a candidate via a non-explicit slideshow, then **Hire** or **Decline**.
- Roster size is capped (config-driven).
