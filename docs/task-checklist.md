# Studio Empire — Task Checklist

**Last Updated:** March 2, 2026 (docs reconciliation pass)

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
- [x] Star Power progression (per-performer shoots → Star Power).
- [x] Promo gains apply only on posting (no double-counting).
- [x] Promo OF conversion uses fractional carry.
- [x] Promo list hides fully posted entries; Recent Posts capped at 5.
- [x] Agency Sample Pack booking mode (promo-strong, premium-weak).
- [x] Booking locations reduced to 3 tiers (Bedroom/Shower/Office) with unlock gating.
- [x] Themes locked to 4 MVP themes.

---

## Act 1+ Content Expansion — Implemented
- [x] Reputation gains via milestone rewards (followers, OF subs, MRR).
- [x] Recruitment panel with rep-gated candidates and meet slideshow.
- [x] Per-performer daily caps (max 3) + agency pack once per day.
- [x] Shared slideshow viewer for recruit meets and shoot photos.
- [x] Booking result slideshow (5 images) for Promo/Premium shoots.

---

## Debug / Dev Tools — Implemented
- [x] Debug panel gated by `?debug=1` (set day, set stats).
- [x] Manual milestone check runner.

---

## Notes (Removed / Archived)
- Two-performer booking, combo effects, and scheduling queue remain **removed**.
