# UI Layout & Interaction Model (Current)

This document captures **post-MVP** UI additions approved in `docs/CURRENT_SCOPE.md`.

## Roster Screen — Recruitment Panel
- **Location:** Roster screen, displayed above the Contracted Talent list.
- **Content:**
  - Current Reputation.
  - Roster size (contracted performers only) vs max roster size.
  - If roster is full → show "Roster full." helper text.
  - If no candidate is eligible yet → show "Gain reputation to attract new talent."
  - Otherwise show **one** candidate card:
    - Portrait, name, Star Power, daily cap, hire cost, reputation requirement.
    - Actions: **Meet** (opens meet slideshow), **Decline** (removes offer).

## Meet Recruit — Slideshow Screen
- **Screen:** Dedicated slideshow screen shared with shoot photos.
- **Content:**
  - Candidate name and short pitch text.
  - Ten-slide non-explicit "private audition" slideshow.
  - **Next** button advances slides.
  - Final slide reveals **Hire** (shows cost) and **Decline** buttons.

## Gallery — Shoot Photos
- **Entry Details:** Includes a **View Shoot Photos** button.
- **Behavior:** Opens the shared slideshow screen to display 5 shoot photos, one at a time.
- **Controls:** Prev / Next / Close.

## Shared Slideshow Behavior
- The slideshow is a shared UI component used for both recruit meets and shoot photo viewing.
- Navigation returns to the originating screen (Roster or Gallery).
