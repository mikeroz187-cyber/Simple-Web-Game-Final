# Studio Empire — Task Checklist

**Last Updated:** January 27, 2026 (premium UI redesign Phase 1)

---

## UI Premium Redesign — In Progress
- [x] Phase 1: Foundation (colors, typography, atmosphere, glassmorphism)
- [x] Phase 2: Layout infrastructure (header bar, nav rail, viewport)
- [ ] Phase 3: Hub screen redesign (hero metrics, live feed, card strip)
- [ ] Phase 4: Component library (buttons, stat cards, selection cards)
- [ ] Phase 5: Screen polish (Booking, Gallery, Roster, Analytics, Shop)
- [ ] Phase 6: Micro-interactions (number animations, transitions, toasts)

---

## Act 1 (Core Loop) — Implemented
- [x] Core gameplay loop (Book → Content → Analytics → Social → Repeat).
- [x] Core screens (Hub, Booking, Content, Analytics, Roster, Social, Gallery, Shop, Story Log, Slideshow).
- [x] Save/Load system with multiple slots + autosave.
- [x] Export/Import JSON saves.
- [x] Manual Advance Day (no global shoots/day cap; booking blocked at Day ≥ debt due day).
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
- [x] Expanded roster depth (Act 2 freelance performers added to the roster catalog).
- [x] Social strategy selection (Balanced, Growth Focus, MRR Focus).
- [x] Manual social strategy (daily budget + channel allocation, once per day).
- [x] Story Log screen (persistent event history).
- [x] Placeholder portraits, thumbnails, and shoot output cards in Gallery.
- [x] Competition unlocks after debt (Act 2), gated in Act 1, one-time unlock message shown.
- [x] Post-debt upgrade: Hire Manager (one-time purchase) reduces daily overhead (config-driven).

---

## Act 3 (Days 181–270) — Implemented
- [x] Competition system (auto-enables Day 181, weekly rival updates).
- [x] Market shifts (config-driven Promo/Premium multipliers).
- [x] Studio Identity (reputation branch selection with modifiers).
- [x] Act 3 story events (Days 200/225/245/270 + effects).
- [x] Content variance (Premium OF subs variance from Day 181).
- [x] Legacy milestones with cash rewards.
- [x] Automation expansion (Auto-Book + Auto-Post, daily action cap).

---

## Post-MVP Fixes / QoL — Implemented
- [x] Metrics split (Social Followers/Subs + OnlyFans Subs).
- [x] MRR derived from OF subs with daily cash income.
- [x] Net Worth stat (Cash + MRR valuationMultiple) displayed in Hub/Analytics and stored in snapshots.
- [x] Hub shows “Est. days to afford debt” based on (daily OF payout − daily overhead).
- [x] Star Power progression (per-performer shoots → Star Power).
- [x] Content-type shoot cost multipliers (Premium costs more) applied in booking + UI shows final cost.
- [x] Promo gains apply only on posting (no double-counting).
- [x] Promo OF conversion uses fractional carry.
- [x] Promo list hides fully posted entries; Recent Posts capped at 5.
- [x] Agency Sample Pack booking mode (promo-strong, premium-weak).
- [x] Booking locations reduced to 3 tiers (Bedroom/Shower/Office) with unlock gating.
- [x] Themes locked to 4 MVP themes.
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

---

## UI / Cosmetic / QoL — Implemented
- [x] UI Polish Pass v1 (Neon VIP Lounge + Bebas Neue + Hub dashboard + event feed cards).

---

## Act 1+ Content Expansion — Implemented
- [x] Reputation gains via milestone rewards (followers, OF subs, MRR).
- [x] Recruitment panel with rep-gated candidates and meet slideshow.
- [x] Per-performer daily caps (max 3) + agency pack once per day.
- [x] Shared slideshow viewer for recruit meets and shoot photos.
- [x] Booking result slideshow (5 images) for Promo/Premium shoots.
- [x] Late-game unlock cadence extended using only remaining meaningful unlocks (limited by available content; no duplicates; no story-only unlocks).

---

## Debug / Dev Tools — Implemented
- [x] Debug panel gated by `?debug=1` (set day, set stats).
- [x] Manual milestone check runner.

---

## Notes (Removed / Archived)
- Two-performer booking, combo effects, and scheduling queue remain **removed**.
