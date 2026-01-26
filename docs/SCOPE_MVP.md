STATUS: Historical (MVP reference). MVP is complete and frozen. For current scope, see CURRENT_SCOPE.md.

# Studio Empire — MVP Scope

## Purpose of MVP
The MVP lets a player run a small adult content studio for the first 90 in‑game days, focused on paying off a debt. The player books shoots, reviews the resulting content and metrics, and adjusts their strategy to grow followers and OF subscribers (MRR). It is fun because each cycle shows clear, immediate feedback (followers, subscribers, cash) and the Day 90 debt deadline creates urgency. Success means paying the $10,000 debt by Day 90 while sustaining a steady loop of shoots, analysis, and strategy changes.

## MVP Player Fantasy
- Feel like a studio manager making tradeoffs between growth (Promo) and OF subs/MRR (Premium).
- Feel the pressure of a looming debt deadline while still building a reputation.
- Feel rewarded for smart content and platform choices through visible metric gains.
- Feel in control of a small roster of performers and their availability.
- Feel a sense of progress as content, followers, and cash accumulate over time.

## MVP Core Gameplay Loop
1. Book a shoot by selecting a performer, location, theme, and content type.
2. Complete the shoot and generate a piece of content.
3. View the content result.
4. Review analytics (MRR change, followers, subscribers, feedback).
5. Adjust strategy (next booking choices and/or platform posts).
6. Advance the day after 5 shoots and repeat until Day 90.

## MVP Win / Loss / End Conditions
- **Progress** is measured by day count, cash on hand, total followers/subscribers, and debt remaining.
- **Win condition:** debt of $10,000 is fully repaid by Day 90.
- **Loss condition:** Day 90 ends and the debt is not repaid.
- **End of session condition:** player chooses to stop (save/quit); there is no other forced end before Day 90.

## MVP Must-Have Features (Build These)
- [ ] **Core loop:** Player can book a shoot → view content → see analytics → adjust strategy → repeat (verify by completing at least two consecutive loops).
- [ ] **Act 1 story framing:** Intro event establishes the $5,000 loan and $10,000 debt due by Day 90; 2–3 debt reminder events appear before Day 90 (verify by advancing days).
- [ ] **Content types:** Promo (SFW) and Premium (NSFW) are selectable and behave differently (Promo increases followers; Premium grows OF subscribers and MRR) (verify via analytics changes).
- [ ] **Booking system:** Player selects performer, location, theme, and content type for each shoot (verify all inputs affect the generated content/metrics).
- [ ] **Performers (MVP size):** 3 core performers and 5 freelance performers are available; freelancers can be hired per shoot (verify roster list and selection options).
- [ ] **Performer stats:** starPower, fatigue, and loyalty are displayed; fatigue increases after shoots and recovers over time (verify stat changes across days).
- [ ] **Economy basics:** Starting cash is $5,000; each shoot has a location cost; Premium content grows OF subscribers (MRR earned daily); Promo content grows followers that convert to subscribers at a fixed rate (verify cash changes and conversion behavior).
- [ ] **Day counter:** Day advances after every 5 completed shoots; the game ends at Day 90 (verify day increments and end condition).
- [ ] **Debt payoff:** A Pay Debt button is disabled until cash is at least the remaining debt; paying clears the full debt (verify button state and debt reaches 0).
- [ ] **Social platforms (MVP):** Instagram and X are available; posting Promo content affects reach/conversion differently per platform (verify platform selection changes outcomes).
- [ ] **Progression:** One unlockable location (Tier 1) and a visible reputation stat exist (verify unlock and stat display).
- [ ] **Gallery:** Player can browse previously created content (verify content history persists in session).
- [ ] **Save/Load:** Save and load through `localStorage` with multiple slots, plus export and import of the full game state as JSON files (verify data round-trips with no loss).

## MVP Must-NOT-Have Features (Explicitly Out of Scope)
- ❌ Not in MVP: Acts 2 & 3 story content — MVP is Act 1 only (Days 1–90).
- ❌ Not in MVP: Rival studios or competition systems — no AI competitors or leaderboards.
- ❌ Not in MVP: POV special scenes — only Promo and Premium content types exist.
- ❌ Not in MVP: Mobile/responsive UI — desktop-only layout.
- ❌ Not in MVP: Online features — no backend, database, accounts, or payments.
- ❌ Not in MVP: Frameworks/build tools — no React/Vue, bundlers, or TypeScript.
- ❌ Not in MVP: Additional content types (e.g., POV), Reddit platform, paid promotions, viral mechanics, or custom subscriber requests — excluded to keep the loop focused.
- ❌ Not in MVP: Performer poaching, awards, moral alignment paths, chemistry/duo shoots, contract negotiation choices — reserved for post‑MVP.
- ❌ Not in MVP: Tier 2–3 locations or equipment upgrade tiers — only Tier 0–1 locations.
- ❌ Not in MVP: Background music or complex animations — avoid extra production scope.

## MVP Screens / UI Required
1. **Hub**
   - **Displays:** Current day, cash, debt remaining, followers/subscribers, reputation, and next required action.
   - **Actions:** Navigate to Booking, Analytics, Social, Gallery, Roster, Shop.
   - **Buttons:** Booking, Analytics, Social, Gallery, Roster, Shop, Pay Debt, Save, Load, Export, Import.
   - **Controls:** Save slot selector (dropdown) to choose which slot Save/Load uses.
2. **Booking**
   - **Displays:** Performer list, location list, theme list, content type (Promo/Premium), shoot cost.
   - **Actions:** Select performer, location, theme, content type; confirm booking.
   - **Buttons:** Confirm Shoot, Back to Hub.
3. **Content**
   - **Displays:** Resulting content (image placeholder or asset), summary of shoot choices.
   - **Actions:** Proceed to analytics.
   - **Buttons:** View Analytics, Back to Hub.
4. **Analytics**
   - **Displays:** MRR change, followers gained, subscribers gained, feedback summary.
   - **Actions:** Review results; decide next move.
   - **Buttons:** Book Next Shoot, Back to Hub.
5. **Roster**
   - **Displays:** Core and freelance performers, starPower, fatigue, loyalty.
   - **Actions:** View performer details; select freelancers for upcoming shoots.
   - **Buttons:** Back to Hub.
6. **Social**
   - **Displays:** Instagram and X, recent posts, follower/subscriber impact.
   - **Actions:** Post Promo content to a platform.
   - **Buttons:** Post to Instagram, Post to X, Back to Hub.
7. **Gallery**
   - **Displays:** List/grid of previously created content entries.
   - **Actions:** Open a content entry.
   - **Buttons:** Back to Hub.
8. **Shop**
   - **Displays:** Tier 1 location unlock and cost.
   - **Actions:** Purchase unlock if affordable.
   - **Buttons:** Buy Unlock, Back to Hub.

## MVP Data That Must Persist (Save/Load)
- Player progression: current day, debt remaining, debt due day (Day 90), reputation.
- Money/resources: current cash balance, MRR (if tracked), follower count, subscriber count.
- Roster data: core performers, freelance performers, each performer’s starPower, fatigue, and loyalty.
- Content history: all created content entries with associated metadata (performer, location, theme, content type, day created, results).
- Unlocks: Tier 1 location unlock state and any other MVP unlock flags.
- Last known analytics totals or recent results if shown in UI.
- **Should NOT persist:** transient UI state (current tab selection, scroll positions, temporary dialogs).

## MVP Technical Constraints (Non-Negotiable)
- Desktop-only web app.
- Single-page app.
- Vanilla HTML/CSS/JS ONLY.
- No frameworks.
- No build tools.
- No backend.
- No database.
- No auth / login.
- No payments.
- One authoritative `gameState` object.
- Save via `localStorage`.
- Export/import JSON save files.
- Config-driven values (no magic numbers).
- Clear file separation (src vs docs).
- Everything must run by opening `index.html` locally.

## MVP Definition of Done
- [ ] New game starts with correct Day 1 state and $5,000 cash.
- [ ] Core loop can be completed repeatedly without errors.
- [ ] Save/load works via `localStorage`.
- [ ] Export/import JSON save works without data loss.
- [ ] Debt reminders appear during Act 1 and Day 90 end condition triggers correctly.
- [ ] No console errors during normal play.
- [ ] Stable play for 30+ minutes without state corruption.
- [ ] UI navigation is consistent across all screens.

## MVP Implementation Priorities (Build Order Summary)
- **Phase 1 — Foundations:** File structure, `gameState`, config constants, basic screen routing.
- **Phase 2 — Core loop:** Booking → content result → analytics → day advance → repeat.
- **Phase 3 — Economy & progression:** Cash, debt, followers/subscribers, location unlock, reputation.
- **Phase 4 — UI polish:** Screen completeness, consistent buttons, readable layout.
- **Phase 5 — Final verification:** Save/load, export/import, error-free long session test.
