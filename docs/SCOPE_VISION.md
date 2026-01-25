# Studio Empire — Vision Scope (Act 2 + Act 3)

## Why This Document Exists
This document describes the longer-term direction of Studio Empire beyond the MVP.
It helps guide future development without contaminating MVP scope.

This document does NOT authorize building features unless approved in `docs/CURRENT_SCOPE.md`.

---

## North Star Vision (1 paragraph)
Studio Empire’s ultimate form is a strategic studio‑management experience where the player grows from a scrappy, debt‑burdened founder into a trusted industry power. The player balances creative choices, talent management, platform strategy, and financial risk, making tradeoffs that shape reputation and long‑term stability. At full maturity, the game feels like a steady cadence of meaningful decisions, clear feedback, and earned growth—where smart planning and adaptive strategy define success.

---

## Design Pillars (Non-Negotiable Feel)
- Management and tradeoffs at every step.
- Progression that feels earned, not gifted.
- Clear, readable feedback loops after each action.
- Low‑friction, session‑friendly play.
- Consistent, desktop‑first UI with obvious navigation.
- Measured risk‑reward choices that invite planning.
- Tone that balances grounded business stakes with light, satirical edge.

---

## Act Breakdown

### Act 1 (MVP) — Foundation
- Run a small studio under a tight 90‑day debt deadline.
- Book shoots, review results, and iterate on strategy.
- Choose between Promo growth and Premium revenue.
- Build early reputation and unlock a limited location upgrade.
- Manage a small roster of performers with basic stats.

### Act 2 — Expansion
**New gameplay depth**
- Wider studio operations with more competing priorities.
- Longer‑horizon planning beyond the initial debt arc.
- Greater emphasis on balancing growth, stability, and brand identity.

**New systems**
- Expanded performer management (availability, contracts, or retention pressures).
- Additional locations or upgrade tiers aligned with progression.
- More granular analytics that reward informed choices.

**New decisions**
- Tradeoffs between scaling quickly and maintaining quality.
- Platform strategy choices that shape audience composition.
- Investment choices that carry longer‑term consequences.

**New risks/failure**
- Operational bottlenecks that punish reckless expansion.
- Reputation volatility if decisions conflict with brand direction.
- Financial strain from over‑commitment or poor planning.

**New content unlocks**
- Additional themes or variants that deepen planning options.
- More meaningful unlock paths tied to reputation milestones.

### Act 3 — Endgame / Mastery
**Endgame gameplay depth**
- Macro‑level studio stewardship with multi‑track objectives.
- Long‑term optimization of talent, brand, and revenue streams.
- Strategic pacing to avoid burnout or overreach.

**Advanced systems**
- Competitive pressure from rival studios or market shifts.
- Deeper progression layers that reward specialization.
- High‑impact events that test preparedness and flexibility.

**Strategic decisions**
- Defining a long‑term studio identity and sticking to it.
- When to prioritize stability versus aggressive growth.
- How to manage high‑value talent and flagship releases.

**High-stakes risks**
- Reputation damage from misaligned choices.
- Financial shocks that require contingency planning.
- Talent instability if growth outpaces support systems.

**Prestige / legacy**
- Recognition milestones that reflect studio legacy.
- Endgame goals focused on mastery rather than survival.
- Optional legacy benchmarks that encourage replayability.

---

## Long-Term Feature Wishlist (Not MVP)
- ⭐ Expanded performer management — contracts, loyalty pressures, and long‑term retention.
- ⭐ Rival studios — competitive pressure and market positioning challenges.
- ⭐ Advanced analytics — deeper insights that reward strategic planning.
- ⭐ More location tiers — unlockable spaces with escalating costs and benefits.
- ⭐ Equipment upgrades — optional investments that affect output quality.
- ⭐ Structured events — high‑impact moments that test preparedness.
- ⭐ Reputation branches — distinct studio identities with different strengths.
- ⭐ Additional content themes — broader planning options without new core loops.
- ⭐ Long‑term story arcs — Act 2/3 narrative beats after the debt storyline.
- ⭐ Expanded roster depth — more performers and clearer role differentiation.
- ⭐ Deeper social strategy — platform emphasis and audience composition choices.
- ⭐ Studio milestones — visible achievements that mark progress.
- ⭐ Optional automation — late‑game tools that reduce repetitive actions.
- ⭐ Content performance variance — greater risk/reward in output results.

---

## What Makes The Vision Achievable (Practical Constraints)
- Keep systems modular and data‑driven to allow safe expansion later.
- Version save schemas early and maintain lightweight migrations.
- Centralize config values to avoid hardcoded assumptions.
- Avoid hard‑wiring UI flows that block future screens or modes.
- Prefer predictable, readable logic over premature complexity.
- Keep all game logic tied to the single `gameState` source of truth.

---

## Vision Success Metrics (What "Great" Looks Like)
- Players make meaningful choices every session.
- Sessions feel complete and satisfying in 10–20 minutes.
- Multiple viable strategies exist without a single dominant path.
- Economy feels balanced with visible cause‑and‑effect.
- Progress milestones arrive at a steady, motivating pace.
- Players can set goals and reach them through planning.
- Replayability emerges from different strategic priorities.
- The UI remains readable and low‑friction even as systems grow.

---

## Vision is Not a License to Build
- If a feature is not in `docs/CURRENT_SCOPE.md` or MVP docs, it is out of scope.
- Vision content must be treated as read‑only inspiration until promoted into scope.
