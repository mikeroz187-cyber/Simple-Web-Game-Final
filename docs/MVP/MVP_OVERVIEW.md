# MVP Overview — Studio Empire

## 1) MVP Summary (Plain English)
The player runs a small adult content studio for Act 1 (Days 1–90), booking shoots, reviewing results, and adjusting strategy to grow followers, subscribers, and cash. Each cycle creates immediate feedback as Promo content builds followers while Premium content generates revenue, all under the pressure of a $10,000 debt due by Day 90. Progress is measured by day count, cash, follower/subscriber growth, and debt remaining as the player repeats the booking → content → analytics loop. It is fun because the player makes clear tradeoffs between growth and revenue while watching metrics move each day. The MVP does not include Acts 2–3, rival studios, extra content types, mobile support, or online systems.

---

## 2) The MVP “Golden Rule”
Ship the smallest, stable loop that lets the player book a shoot, see results, and make the next decision with clear feedback. Favor clarity over complexity and stability over extra features. No scope creep: if it is not in CURRENT_SCOPE, it does not go in the MVP.

---

## 3) MVP Core Loop (The Only Loop That Matters)
1. Book a shoot (performer, location, theme, content type, and platform for Promo posts).
2. Complete the shoot and generate content with results.
3. View content summary.
4. Review analytics (followers, subscribers, revenue, feedback).
5. Adjust strategy (next booking and/or platform choice).
6. Advance the day and repeat until Day 90.

---

## 4) Day Advancement Rules
- **Exact trigger:** The day advances immediately after the player confirms a booking (the shoot is locked in). The day does **not** advance from viewing content, browsing the gallery, or viewing analytics.
- **One shoot per day:** Each confirmed booking equals one day. Multiple shoots in a single day are not allowed in the MVP.
- **Day boundary effects:** Fatigue recovery occurs at the start of each new day before any actions. Other day-start effects (like debt reminders) trigger at day start if defined.
- **What blocks day advancement:** The player must complete the full loop state to reach the booking confirmation. Day advancement is blocked until a valid booking is confirmed (affordability and availability checks must pass).
- **No complex time system:** There are no partial days, hours, or time slots in the MVP.

---

## 5) Player Controls (What the player can actually do)
- Book Shoot — choose performer, location, theme, content type — Booking screen.
- Confirm Shoot — commit the booking and advance the loop — Booking screen.
- View Analytics — move from content result to metrics — Content screen.
- Post Promo Content — choose Instagram or X to affect reach — Social screen.
- Browse Content — view past content entries — Gallery screen.
- Buy Tier 1 Location Unlock — unlock the next location tier if affordable — Shop screen.
- Save Now — manual save to localStorage — Hub screen.
- Load Save — load from localStorage — Hub screen.
- Export Save — download JSON save file — Hub screen.
- Import Save — load JSON save file — Hub screen.
- Navigate Screens — move between Hub, Booking, Content, Analytics, Social, Gallery, Roster, Shop — Hub or screen nav buttons.

---

## 6) MVP Resources & Stats
- Cash — available money for costs and debt — increases from Premium revenue — decreases from shoot location costs and debt payments — player cares because cash gates actions and debt payoff.
- Debt Remaining — amount owed toward the $10,000 deadline — decreases when paid from cash — increases only at start as the $10,000 total obligation — player cares because paying it off by Day 90 is the win condition.
- Day — current in-game day (1–90) — increases after each completed loop — cannot decrease — player cares because Day 90 is the deadline.
- Followers — audience size from Promo content — increases via Promo results and platform reach — may stagnate if no Promo — player cares because followers convert to subscribers at a fixed rate.
- Subscribers — paying audience base — increases via conversion from followers and Premium performance — decreases only if explicitly modeled (not required in MVP) — player cares because subscribers drive Premium revenue.
- Reputation — studio reputation — increases through successful content and progress — decreases only if explicitly modeled (not required in MVP) — player cares because it gates unlocks like Tier 1 location.
- Performer Star Power — individual performer appeal — increases through use or success (as defined in config) — decreases only if explicitly modeled (not required in MVP) — player cares because it affects results.
- Performer Fatigue — individual exhaustion — increases after shoots — decreases over time with rest — player cares because high fatigue affects performance.
- Performer Loyalty — commitment of core performers — changes based on usage (as defined in config) — player cares because it affects roster stability (displayed and tracked in MVP).

---

## 7) MVP Screens (UI Map)
- Hub — central navigation and status — displays day, cash, debt remaining, followers/subscribers, reputation, next action — buttons for Booking, Analytics, Social, Gallery, Roster, Shop, Save, Load, Export, Import.
- Booking — plan a shoot — displays performers, locations, themes, content type, shoot cost — buttons for Confirm Shoot, Back to Hub.
- Content — view the generated content result — displays content placeholder and shoot summary — buttons for View Analytics, Back to Hub.
- Analytics — review outcomes — displays revenue gained, followers gained, subscribers gained, feedback summary — buttons for Book Next Shoot, Back to Hub.
- Roster — review performers — displays core and freelance performers with star power, fatigue, loyalty — button for Back to Hub.
- Social — post Promo content — displays Instagram and X with recent posts — buttons for Post to Instagram, Post to X, Back to Hub.
- Gallery — browse content history — displays list/grid of content entries — button for Back to Hub.
- Shop — unlock Tier 1 location — displays unlock option and cost — buttons for Buy Unlock, Back to Hub.

---

## 8) MVP Save System Requirements
- Autosave to localStorage at safe intervals (e.g., after completing a loop or key actions).
- Manual Save Now button on the Hub that writes the full gameState to localStorage.
- Export save downloads the full gameState as a JSON file.
- Import save loads a JSON file and replaces the current gameState after validation.
- Persist all MVP data: day, debt remaining, cash, followers/subscribers, reputation, roster stats, content history, unlocks, and any tracked analytics totals.
- Do not persist transient UI state like current tab selection or scroll position.

---

## 9) MVP Non-Goals (Explicit Exclusions)
- ❌ Not in MVP: Acts 2 & 3 — Act 1 only, Days 1–90.
- ❌ Not in MVP: Rival studios/competition — no AI competitors or leaderboards.
- ❌ Not in MVP: POV special scenes — only Promo and Premium content types.
- ❌ Not in MVP: Mobile/responsive UI — desktop-only layout.
- ❌ Not in MVP: Online systems — no backend, accounts, or payments.
- ❌ Not in MVP: Extra platforms or mechanics — no Reddit, paid promotions, viral mechanics, or custom requests.
- ❌ Not in MVP: Additional progression systems — no awards, moral alignment, duo shoots, or contract negotiations.
- ❌ Not in MVP: Higher-tier locations or equipment tiers — only Tier 0–1 locations.
- ❌ Not in MVP: Background music or complex animations — keep scope minimal.

---

## 10) MVP Definition of Done (Ship Checklist)
- [ ] New game starts at Day 1 with $5,000 cash and $10,000 debt due by Day 90.
- [ ] Core loop (book → content → analytics → next decision) works at least twice in a row.
- [ ] Promo content increases followers and affects reach via platform choice.
- [ ] Premium content generates revenue and affects subscriber metrics.
- [ ] Performers show star power, fatigue, and loyalty, with fatigue changing over time.
- [ ] Booking requires performer, location, theme, and content type selection.
- [ ] Day advances only after a completed loop.
- [ ] Debt reminders appear during Act 1 and Day 90 end condition triggers.
- [ ] Tier 1 location unlock can be purchased and is reflected in UI.
- [ ] Content history persists in-session and is visible in the Gallery.
- [ ] Hub shows day, cash, debt remaining, followers, subscribers, and reputation.
- [ ] Navigation across Hub, Booking, Content, Analytics, Social, Gallery, Roster, and Shop never breaks.
- [ ] Autosave updates localStorage without errors.
- [ ] Manual Save Now writes to localStorage and Load restores state.
- [ ] Export to JSON and Import from JSON round-trip the full gameState.
- [ ] No console errors during normal play.
- [ ] 30+ minutes of play does not corrupt gameState or saves.

---

## 11) MVP Implementation Principles (How to build safely)
- One authoritative `gameState` object drives all gameplay.
- UI renders deterministically from `gameState` with no hidden DOM state.
- All tuning values are config-driven (no magic numbers).
- Keep functions simple and predictable; prefer pure functions where possible.
- Save/load serializes the full `gameState` with a versioned format and migration hooks.
- Avoid scope creep: implement only what CURRENT_SCOPE and MVP docs define.
