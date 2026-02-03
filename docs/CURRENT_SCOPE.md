# Current Focus (Not a Constraint)

This document is a **status snapshot only**. It **does not restrict** features or future work; it simply summarizes what is implemented and what the team is focusing on right now.
See `docs/SAVE_LOAD_AND_PERSISTENCE_RULES.md` for the canonical save/load rules.

**Last Updated:** February 03, 2026

**Act 3 Takeover Status:** Shipped / ready (v1.0, February 03, 2026)

## Recently Completed
- Bundle 8: Studio acquisition reputation thresholds set to 75/78/80/83/85 with UI + system enforcement.
- Bundle 7: Poached performers now become trophies (non-bookable), visible in Roster + Conquests with selfie cards.
- Bundle 6: Enforced a single active Industry Takeover acquisition journey and disabled other targets until resolved.
- Bundle 5: Renamed the Save button to Options and added New Game (confirm + reset current slot only) in the Options menu.
- Bundle 4: Added Social "Post All" (Insta + X) with unique promo counting and disabled state when either network is unavailable.
- Bundle 3: Studio Identity Hub Choose button + modal picker at Day 181, selection locks for the run.
- Bundle 2: Studio upgrade offer CTAs now disable when unaffordable and show "Not enough cash" helper text.
- Bundle 1 booking caps: 1 shoot/day per performer, hard cap 10/day total, MVP-only themes, Office renamed to Professional, Act 3 themes removed.
- Act 3 takeover UX sanity sweep for Industry Map, Studio Detail, and Empire navigation/clarity.
- Industry Takeover UI micro-polish for Act 3 screens (badges, progress bars, compact grids).
- Release Checklist complete.
- Industry Takeover system fully implemented (all 5 studios) and docs audit completed.
- Industry Takeover Phase 7: Added Velvet Vault + Saint Sin studios, expanded Industry Map to 5 studios, and shipped victory/Empire endgame flow.
- Industry Takeover Phase 6: Competition swap after Day 181 plus retaliation poach attempts with pay/lose resolution.
- Industry Takeover Phase 5: Boss confrontation flow (5 stages/10 days), studio defeat rewards, boss/trophy tracking, and Act 3 theme bonuses (+10% on matching themes).
- Industry Takeover Phase 4: 4-stage acquisition loop (intel/approach/turn/debut), stage-ready resolve UX, tier-scaled costs, weakness rep penalties, debut rewards, and roster integration.
- Industry Takeover Phase 3: Studio Detail screen with boss card, performer roster, and View Studio navigation from the Industry Map (actions disabled).
- Industry Takeover Phase 2: Industry Map nav entry, screen shell, and Day 181 unlock CTA.
- Industry Takeover polish & balance pass: copy refresh, UI readability tuning, config cost adjustments, and image registry documentation.
- Act 2 Social Collab Week (Day 170 offer, 7-day unique promo streak, 14-day retry cadence, +3% permanent promo reach reward).
- Hub UI fixes: correct debt days-left countdown, show daily overhead with OF payouts, and stabilize the Shop cashflow snapshot panel.
- Booking update: raised Star Power cap to 10 and clarified booking summary with audience pull vs Star Power premium itemization.
- Booking fixes: removed the Day 90 debt checkpoint hard-block, enforced the CONFIG.game.shoots_per_day daily cap, and itemized Star Power booking premiums in summaries and cost breakdowns.
- Content screen UX polish (removed location thumbnail, corrected Promo/Premium CTAs, added jump-to-Social posting).
- Social recent posts now open shoot photo slideshows and return correctly on close; analytics secondary cards align cleanly.
- Analytics Hustle Dashboard refresh: daily snapshot cap, heat check cards with sparklines, cashflow bars, debt progress, and memo insights.
- Toast notifications now render above the mascot via body-level container placement.
- Performer/recruit/persona display names updated to the locked sexy list.
- Loyalty/Diva Fee economy impact and boosted Star Power multiplier for clear cost/reward feedback.
- Conquests story & pacing pass: tokenized scene copy, punchier progression text, and retuned thresholds for earlier Stage 1–3 pacing.
- Conquests polish: fixed Assistant stage portrait assets, added minDay/debt-clear gates, and refreshed reward pack copy.
- Recruitment and Conquests copy refresh: richer recruit pitches/meet captions plus Act 1 dialogue punch-up for key Conquest characters.
- Gallery update: Added Shoots/Conquests toggle with unlocked Conquest packs viewable from the Gallery.
- Conquests expansion: Assistant, Talent Scout, and Saleswoman characters added with 4-stage reward packs and trigger thresholds.
- Conquests mascot portraits standardized to stage-specific filenames with fallback handling for missing images.
- Hub pay-down-debt quick buttons (Pay Max + presets) to let debt-based Conquests progress naturally.
- Debt payoff now jumps Bank Manager to stage 4 when cleared in one payment, Conquests stages unlock even if earlier messages are unread, debt reminders stop after payoff, and Pay Max uses an in-game modal.
- Bank Manager Conquest character with debt payoff stages and reward packs.
- Conquests MVP system: Producer message flow, reward packs, and slideshow viewing.
- Conquests UI polish: stage-specific portrait overrides with fallback and visible slideshow back button.
- Ambient Art Phase 1.6: Fixed mascot positioning (dedicated space, bottom-anchored, content clearance).
- Ambient Art Phase 1.5: Wired real mascot/background images to config and render system.
- Recruitment flow with rep-gated candidates, meet slideshow, and hire/decline outcomes.
- Agency Sample Pack booking mode with daily limit and five-image bundle output.
- Manual social strategy (budget + channel allocation) and social strategy selection.
- Hub/Analytics UI clarity line for estimated days to afford debt based on daily net cashflow.
- After Hours offers now use one-time cash payments with affordability gating plus decline loyalty penalties/cooldowns.
- Post-debt Hire Manager upgrade that reduces daily overhead (one-time purchase).
- Competition system, market shifts, and Studio Identity (reputation branches).
- Act 2 and Act 3 story events, Story Log screen, and legacy milestones.
- Premium variance rolls, equipment upgrades, Tier 2 locations, and analytics rollups.
- Post-debt Market Saturation tiers for Premium OF subs with Act 2 activation messaging.
- Daily OF cash payouts on day advance plus tiered overhead scaling.
- Balance Pass v1 retuning debt to $25,000 and overhead tiers for post-payout economy pacing.
- Balance Pass v2 tuning Promo reach up and Premium base OF subs down for early marketing-heavy pacing.
- Premium UI Redesign (all 6 phases) — transformed the entire game UI to a "Neon Noir VIP" dark glass aesthetic with animations.
- Premium UI redesign complete — all phases finished
- Story feed cleanup: removed Act 1 flavor pings and Act 2 schedule copy so only gameplay-impacting events appear.

## Currently Working On
- Ambient Character Art System — layout refinement complete, testing positioning
- After Hours System Phase 1-2 — knock detection and basic modal flow

## Next 3–7 Candidate Tasks
- Release checklist / doc audit.
- Ambient Art Phase 2: Reactive mascot pose logic based on game state
- Ambient Art Phase 3: Generate test artwork for mascot positions
- Ambient Art Phase 4: Replace placeholders with final artwork
- Add real artwork for performer portraits, location thumbnails, and slideshow images.
- Tune economy values in `src/config.js` (MRR pacing, costs, conversions).
- Expand theme catalog once art + balance targets are defined.
- Surface Agency Sample Pack flavor text more explicitly in Booking UI copy.
- Add QA notes for save migration edge cases and debug workflows.
- Review automation balance (auto-book vs auto-post priority) for late-game pacing.
