# Studio Empire — Task Checklist

**Last Updated:** January 25, 2026 (A3.7 de-scoped; Act 3 complete)

---

## Act 1 (MVP) — Days 1-90

- [x] Core gameplay loop (Book → Content → Analytics → Repeat)
- [x] All MVP screens (Hub, Booking, Content, Analytics, Roster, Social, Gallery, Shop)
- [x] Save/Load system with multiple slots
- [x] Autosave functionality
- [x] Export/Import JSON saves
- [x] Day advancement (5 shoots per day)
- [x] Economy basics (cash, debt, followers, subscribers)
- [x] Content types (Promo and Premium)
- [x] Performer roster (3 core + 5 freelance)
- [x] Performer stats (starPower, fatigue, loyalty)
- [x] Locations Tier 0 (Bedroom starter location)
- [x] Locations Tier 1 unlock
- [x] MVP themes (4 locked themes: Lingerie, Office, Uniform, Interracial)
- [x] Social posting (Instagram and X)
- [x] Act 1 story events (intro + debt reminders)
- [x] Win/Loss conditions (Day 90 debt check)

**Note:** Two-performer booking (Slot B) + combo effects were CUT for scope reduction (single-performer only).

---

## Act 2 — Days 91-180

### Completed
- [x] A2.1 — Expanded Performer Management (contracts, retention, availability rules)
- [x] A2.2 — Advanced Analytics (7/30 day rollups, snapshots)
- [x] A2.3 — Location Tier 2 (reputation-gated unlock)
- [x] A2.4 — Equipment Upgrades (Lighting, Camera, Set Dressing)
- [x] A2.6 — Act 2 Story Events (Days 95/120/145/170)
- [x] A2.7 — Expanded Roster Depth (4 new performers)
- [x] A2.8 — Social Strategy Selection (Balanced, Growth Focus, MRR Focus)
- [x] A2.9 — Studio Milestones (5 milestone triggers)
- [x] Freelancer Differentiation: daily persona reroll + One-Off Buzz + Roster Freelancer Pool
- [x] Manual Social Strategy (daily budget allocation)
- [x] Automation Tier 1 (Auto-Book toggle)
- [x] Story Log screen
- [x] Performer portrait placeholders
- [x] Location thumbnail placeholders
- [x] Shoot output cards in Gallery
- [x] Save v2 schema

### De-scoped / Cut
- Two-performer booking (Slot B) + immediate combo effects — CUT for scope reduction (single-performer only).
- CUT: Additional Content Themes (Act 2 theme pack) — replaced by locked 4-theme set.

---

## Fixes / QoL (Post-MVP)

- [x] Promo gains apply only on posting (no double count).
- [x] Analytics: Today (Day X) Totals panel + clarify Latest Shoot Results.
- [x] Freelancers reroll personas each day; removed manual rotation UI.
- [x] v3 Metrics Split + MRR-only (Social Followers/Social Subs/OF Subs; Premium stronger)
- [x] CUT: Booking performer preview cards for two-performer selection (removed with single-performer scope).
- [x] CUT: Booking confirm with 2 performers when combo is disabled (two-performer booking removed).
- [x] Social: Promo content can be posted to both Instagram and X (once per platform).
- [x] Social: Promo list hides fully-posted promos; Recent Posts capped at 5.
- [x] Booking: daily cap blocks >5 shoots; day no longer auto-advances; player must use Advance Day.
- [x] Social: Promo OF conversion tuned to ~1 per 20 posts + fractional carry implemented.
- [x] CUT: Booking any two performers regardless of roles (two-performer booking removed).
- [x] CUT: Reduced booking locations to 3 (Bedroom Tier 0, Shower Tier 1, Office Tier 2).
- [x] Debug: Dev-only Set Day panel (?debug=1) for iOS testing.
  - Fix: debug Set Day persists correctly.
- [x] Fix: Debug Set Day works on GH Pages.
- [x] Fix: Save validation allowlist includes all actual top-level keys (prevents resets on reload / GH Pages).
- [x] Fix: Save validation day range uses CONFIG.game.max_day (supports Act 2/3 testing).
- [x] Debug: Dev-only stat setters (cash/rep/followers/subs) for milestone testing.
- [x] Fix: Legacy milestones now mark Complete and pay reward cash once (status + rewards).
- [x] Fix: milestone completion now flips status to Complete and pays rewards (added debug “Run Checks Now”).
- [x] Replace Freelancers with Agency Sample Packs (bundle posting; 5-image sets; promo-strong / premium-weak)
- [x] Remove performer roles (Lead/Support/Specialist) and role-based bonuses; UI shows performer names only.
- [x] Star Power progression + OF subs/MRR refactor (promo impact, premium outputs, daily MRR cash).

---

## Act 3 — Days 181-270

### Complete (8/8 complete)
- [x] Save v3 schema + migration (v2 → v3)
- [x] A3.1 — Rival Studios / Competitive Pressure
  - [x] Auto-enable competition at Day 181.
- [x] A3.2 — Structured High-Impact Events
- [x] A3.3 — Reputation Branches (Prestige, Volume, Boutique)
- [x] A3.4 — Act 3 Story Arc (Days 200/225/245/270)
- [x] A3.5 — Optional Automation (expanded)
- [x] A3.6 — Content Performance Variance (±15%)
- [x] A3.8 — Legacy Milestones

**Note:** Two-performer booking (Slot B) + combo effects were CUT for scope reduction (single-performer only).

### De-scoped / Cut
- A3.7 — Advanced Scheduling (booking queue) — CUT (not needed).

---

## Summary

| Phase | Complete | Remaining |
|-------|----------|-----------|
| Act 1 | 16/16 | 0 |
| Act 2 | 16/16 | 0 |
| Fixes/QoL | 22/22 | 0 |
| Act 3 | 8/8 | 0 |
| **Total** | **62/62** | **0** |

---

## Reference Documents

- Feature specs: `docs/VISION/ACT2_SCOPE.md`, `docs/VISION/ACT3_SCOPE.md`
- System APIs: `docs/VISION/ACT2_SYSTEMS.md`, `docs/VISION/ACT3_SYSTEMS.md`
- State schemas: `docs/VISION/ACT2_STATE_EXTENSIONS.md`, `docs/VISION/ACT3_STATE_EXTENSIONS.md`
- Endgame design: `docs/VISION/ACT3_ENDGAME_LOOPS.md`
