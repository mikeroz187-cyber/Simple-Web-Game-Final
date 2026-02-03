# Studio Empire — Task Checklist

**Last Updated:** February 03, 2026 (Industry Takeover Phase 7 victory + Empire screen)
See `docs/SAVE_LOAD_AND_PERSISTENCE_RULES.md` for the canonical save/load rules.

---

## UI Premium Redesign — COMPLETE ✓
- [x] Phase 1: Foundation (colors, typography, atmosphere, glassmorphism)
- [x] Phase 2: Layout infrastructure (header bar, nav rail, viewport)
- [x] Phase 3: Hub screen redesign (hero metrics, live feed, card strip)
- [x] Phase 4: Component library (buttons, cards, forms, progress bars)
- [x] Phase 5: Screen polish (Booking, Gallery, Roster, Analytics, Shop, Social, Story Log)
- [x] Phase 6: Micro-interactions (animations, transitions, toasts)

---

## Act 1 (Core Loop) — Implemented
- [x] Core gameplay loop (Book → Content → Analytics → Social → Repeat).
- [x] Core screens (Hub, Booking, Content, Analytics, Roster, Social, Gallery, Shop, Story Log, Slideshow).
- [x] Save/Load system with multiple slots + autosave.
- [x] Export/Import JSON saves.
- [x] Manual Advance Day (daily shoots cap enforced; no debt-day booking lock).
- [x] Economy basics (cash, debt, Social Followers/Subs, OF Subs, MRR).
- [x] Content types (Promo and Premium).
- [x] Performer stats (Star Power, fatigue, loyalty).
- [x] Locations Tier 0 (Bedroom starter location).
- [x] Locations Tier 1 unlock via Shop.
- [x] Social posting (Instagram + X, one post per platform per promo).
- [x] Act 1 story events (intro + debt reminders + Day 90 win/loss events).
- [x] Win/Loss conditions (Day 90 debt check).

---

## Act 2 (Days 91–180) — Implemented
- [x] Performer management (contracts, renewals, availability rules).
- [x] Analytics rollups (7/30-day summaries) and snapshots.
- [x] Tier 2 location unlock (cash + reputation requirement).
- [x] Equipment upgrades (Lighting, Camera, Set Dressing).
- [x] Act 2 story events (Days 95/120/145/170).
- [x] Act 2 Event (Day 170): Social Collab Week (7-day streak, 5 unique promo/day, reschedules on fail/decline, permanent social reach bonus).
- [x] Expanded roster depth (Act 2 freelance performers added to the roster catalog).
- [x] Social strategy selection (Balanced, Growth Focus, MRR Focus).
- [x] Manual social strategy (daily budget + channel allocation, once per day).
- [x] Story Log screen (persistent event history).
- [x] Placeholder portraits, thumbnails, and shoot output cards in Gallery.
- [x] Competition unlocks after debt (Act 2), gated in Act 1, one-time unlock message shown.
- [x] Post-debt upgrade: Hire Manager (one-time purchase) reduces daily overhead (config-driven).
- [x] Act 2 lease upgrade commitment (Day 95 window), roster cap increase (5→7), and late-price fallback if missed.

---

## Act 3 (Days 181–270) — Implemented
- [x] Competition system (auto-enables Day 181, weekly rival updates).
- [x] Market shifts (config-driven Promo/Premium multipliers).
- [x] Studio Identity (reputation branch selection with modifiers).
- [x] Studio Identity: modal picker works at Day 181; selection locks; Hub reflects choice.
- [x] Act 3 story events (Days 200/225/245/270 + effects).
- [x] Content variance (Premium OF subs variance from Day 181).
- [x] Legacy milestones with cash rewards.
- [x] Automation expansion (Auto-Book + Auto-Post, daily action cap).

---

## Industry Takeover — In Progress
- [x] Phase 1: Foundation (config + gameState + save/migration + docs)
- [x] Phase 2: Industry Nav + Industry Map screen shell
- [x] Phase 3: Studio Detail screen + performer list
- [x] Phase 4: Acquisition stages (intel/approach/turn/debut)
- [x] Phase 5: Boss confrontations (5-stage)
- [x] Phase 6: Disable/replace Competition at Day 181 + Retaliation events
- [x] Phase 7: Add remaining 2 studios + victory condition/endgame
- [x] Act 3 UX sanity sweep (Industry Map, Studio Detail, Empire)

## Release Checklist / Doc Audit — COMPLETE ✓
- [x] Release Checklist / Doc Audit (docs)
- [x] Release Checklist / Doc Audit (code comments)

---

## Post-MVP Fixes / QoL — Implemented
- [x] Metrics split (Social Followers/Subs + OnlyFans Subs).
- [x] MRR derived from OF subs with daily cash income.
- [x] Net Worth stat (Cash + MRR valuationMultiple) displayed in Hub/Analytics and stored in snapshots.
- [x] Hub shows “Est. days to afford debt” based on (daily OF payout − daily overhead).
- [x] Hub: Pay Down Debt quick buttons (enables Bank Manager progression).
- [x] Star Power progression (per-performer shoots → Star Power).
- [x] Star Power cap increased to 10.
- [x] Content-type shoot cost multipliers (Premium costs more) applied in booking + UI shows final cost.
- [x] Promo gains apply only on posting (no double-counting).
- [x] Promo OF conversion uses fractional carry.
- [x] Promo list hides fully posted entries; Recent Posts capped at 5.
- [x] FIX Recent Posts titles fall back when Promo entries lack saved titles.
- [x] Agency Sample Pack booking mode (promo-strong, premium-weak).
- [x] Booking locations reduced to 3 tiers (Bedroom/Shower/Office) with unlock gating.
- [x] Themes locked to 4 MVP themes.
- [x] Booking caps: 1 shoot/day per performer; hard cap 10/day total; themes locked to MVP; Office->Professional; act3 themes removed.
- [x] Themes have meaningful tradeoffs (followersMult vs ofSubsMult) + Booking UI shows effects.
- [x] Post-debt Market Saturation tiers (Premium OF subs only) + activation story popup.
- [x] Social footprint bonus boosts Premium gains (capped, config-driven, visible in Analytics).
- [x] Promo posts show OF Pipeline progress (carry) + clear post results messaging.
- [x] Day-based unlock cadence (config schedule) + one-time unlock messages + persists.
- [x] Shower/Tier 1 locations are no longer auto-unlocked by day schedule; Tier 1 unlock is purchase-only.
- [x] Daily OF payout adds cash on day advance (subs-based, config-driven).
- [x] Scalable daily overhead deducts cash on day advance (tiered by subs, config-driven).
- [x] Balance Pass v1: increased debt to 25,000 and retuned overhead tiers for post-payout economy.
- [x] Balance Pass v2: Promo reach +15% and Premium base subs -10% to support early marketing-heavy pacing.
- [x] Performer unlock toasts are rep-aware and direct player to Roster → Recruitment.
- [x] Recruitable performers unlock purely by Reputation thresholds; one-time “new recruit” toast fires only when eligible.
- [x] Freelancer systems fully removed (UI/state/rotation); Agency Sample Packs are the only non-core booking variation.
- [x] Competition Hub panel messaging matches debt-gated unlock (no misleading start day).
- [x] Competition config is single-source (CONFIG.market.competition); legacy CONFIG.competition removed.
- [x] Tier 1 unlock cost has a single source of truth (CONFIG.locations.tier1UnlockCost); legacy duplicate removed.
- [x] Orphan/missing story events cleaned up: no dead STORY_EVENT_COPY keys; no config references to missing story IDs.
- [x] Scheduled unlocks enforce equipment/location only (unsupported types ignored; no story events).
- [x] Save/load prunes legacy scheduled unlock IDs; removes freelancer remnants when Agency Packs enabled.
- [x] Save-load no longer re-injects freelance performers into roster.
- [x] Legacy UI copy cleaned (no freelancer/day-based performer unlock/competition start day confusion).
- [x] Config/story integrity sweep completed (no orphan story IDs, no missing referenced copy).
- [x] FIX Booking preview placeholder scales to fill the slideshow frame; info panel scrolls internally to avoid page scroll.
- [x] FIX Content screen slideshow sizing for booked shoots.
- [x] Implement Diva Fee Loyalty + boosted star + UI messaging.
- [x] Low loyalty triggers Diva Fee (shoot + renewal) and UI explains it in Roster + Booking.
- [x] Roster: expired contracts show Renew CTA (card + sidebar).
- [x] Star Power >6 adds booking cost premium and displays on Booking summary card.
- [x] Booking UI clarifies audience multiplier vs cost premium.
- [x] Bundle 2: Studio upgrade CTAs disable when unaffordable and show "Not enough cash" helper text.
- [x] Bundle 4: Social Post All (Insta + X), unique count = 1, disabled if either network unavailable.
- [x] Bundle 5: Save button renamed to Options; Options modal includes New Game (confirm, wipes current slot only).
- [x] Bundle 6: Industry Map enforces one active acquisition journey; other targets disabled until resolved.
- [x] Bundle 7: Poached performers become trophies (non-bookable), appear in Roster + Conquests selfie cards.
- [x] Bundle 8: Studio acquisition reputation thresholds set to 75/78/80/83/85 and enforced in UI + system.
- [x] Bundle 9: Studio bonus visibility in Hub/Booking; studio acquisition unlocks bosses in Gallery with 10-image placeholders and messaging.
- [x] Bundle 10: Roster redesigned with master/detail layout, selectable list, detail card, and trophy handling.

---

## UI / Cosmetic / QoL — Implemented
- [x] UI Polish Pass v1 (Neon VIP Lounge + Bebas Neue + Hub dashboard + event feed cards).
- [x] Recruit meet modal: Hire/Decline available immediately and slideshow media stays within the modal.
- [x] Performer/recruit/persona display names updated to locked sexy list.
- [x] Booking: Replace performer list with dropdown + performer portrait card.
- [x] UI Micro-Polish (Act 3 screens).

## Bugfix / UI polish — COMPLETE ✓
- [x] Content screen removes location thumbnail from the info panel (Bugfix A).
- [x] Content screen CTA buttons switch correctly for Premium vs Promo entries (Bugfix B).
- [x] Promo CTA jumps to Social with the chosen content pre-selected (Bugfix C).
- [x] Social recent posts open shoot photo slideshows and return to Social on close (Bugfix D).
- [x] Toast notifications render above the mascot and outside stacked screen containers (Bugfix E).
- [x] Analytics secondary row uses aligned grid styling for top-aligned cards (Bugfix F).
- [x] Bug #12 Analytics: Hustle Dashboard (heat check + cashflow bars + debt progress + memo insights + daily capped history).
- [x] Bug #5 Analytics card alignment.
- [x] FIX After Hours accept is a one-time cash payment with gating + dismiss penalties/cooldown.
  - [x] Cash decreases immediately on Accept (header updates instantly).
  - [x] Offer/ask text explicitly communicates paying her cash.
- [x] FIX Bug #9: Bank Manager debt payoff triggers stage 4 only when paid in one go.
  - [x] Debt paid in one go forces Bank Manager Stage 4; Conquests stages no longer blocked by unaccepted messages.
- [x] FIX Bug #10: Stop debt reminders after debt is fully paid.
- [x] FIX Bug #11: First debt story message matches $25,000 debt.
- [x] FIX Bug #13: Pay Max uses in-game modal instead of browser prompt.
- [x] FIX Bug #14: Star Power 7+ adds a booking premium and is itemized at confirm.
- [x] FIX Bug #15: Daily shoot cap only blocks booking more shoots (no global gating).
- [x] FIX Bug #13: Hub debt days-left uses debt due day minus current day (clears when debt is paid).
- [x] FIX Bug #16: Hub shows daily overhead alongside OF payouts.
- [x] FIX Bug #9: Shop always shows Daily Cashflow panel with context about payouts/overhead.
- [x] Booking: remove Day>=debtDueDay hard-block (Day 90 no longer blocks shoots).
- [x] Booking: enforce CONFIG.game.shoots_per_day cap (blocks only when shootsToday >= cap).
- [x] Booking: Star Power > threshold adds cost premium and displays in booking summary.
- [x] Bug #1: Removed non-impact story events (Act 1 pack pings + Act 2 schedule) so Events feed only shows gameplay-relevant events.

---

## Ambient Character Art System — In Progress
- [x] Phase 1: CSS infrastructure (layers, positioning, animations)
- [x] Phase 1.5: Real artwork paths wired into config
- [x] Phase 1.6: Layout fix — mascots get dedicated space, backgrounds subtle
- [x] Phase 1.7: Fix mascot lifecycle — persistent container, survives navigation
- [ ] Phase 2: Reactive mascot logic (pose selection based on game state)
- [ ] Phase 3: Final artwork polish and optimization

---

## Act 1+ Content Expansion — Implemented
- [x] Reputation gains via milestone rewards (followers, OF subs, MRR).
- [x] Recruitment panel with rep-gated candidates and meet slideshow.
- [x] Recruitment: pitchTitle + pitchBullets + meetCaptions shown on recruit card + meet slideshow.
- [x] Per-performer daily caps (max 3) + agency pack once per day.
- [x] Shared slideshow viewer for recruit meets and shoot photos.
- [x] Booking result slideshow (5 images) for Promo/Premium shoots.
- [x] Late-game unlock cadence extended using only remaining meaningful unlocks (limited by available content; no duplicates; no story-only unlocks).

---

## Conquests System — MVP
- [x] Conquests config with character stages, triggers, and reward packs.
- [x] Conquests gameState (inbox, unlocked packs) with save schema update.
- [x] Conquests screen with inbox list, message detail, accept/dismiss flow.
- [x] Reward packs viewable via the shared slideshow viewer.
- [x] Gallery: Conquests tab lists unlocked conquest packs + view in slideshow.
- [x] Conquest notifications fire on day advance and equipment upgrades.
- [x] Stage-specific portraits + slideshow back button visibility fix.
- [x] Bank Manager Conquest character added (4 stages, debt payoff triggers, packs).
- [x] Conquests: add Assistant, Talent Scout, Saleswoman + standardize mascot stage portrait paths.
- [x] Conquests Phase 2: Copy pass + pacing tuning + tokenized scene text.
- [x] Conquests polish: assistant portrait fix + minDay/debt gates + reward pack copy pass.
- [x] Conquests: Act 1 dialogue punch-up for Producer/Assistant/TalentScout/Saleswoman/BankManager.

---

## Debug / Dev Tools — Implemented
- [x] Debug panel gated by `?debug=1` (set day, set stats).
- [x] Manual milestone check runner.

---

## Polish / Balance — Final Pass (Complete ✓)
- [x] Polish & Balance pass (takeover pacing, copy, placeholder registry, UI spacing).
- [x] Tune costs and cadence for takeover pacing.
- [x] Full copy pass on takeover modals and Empire screen.
- [x] Placeholder image registry pass (ensure swap-ready paths).
- [x] Small UI spacing polish (no redesign).

---

## Notes (Removed / Archived)
- Two-performer booking, combo effects, and scheduling queue remain **removed**.
