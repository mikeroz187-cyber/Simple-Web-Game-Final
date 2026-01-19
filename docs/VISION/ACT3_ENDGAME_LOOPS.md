# Act 3 Endgame Loops

## 1) What “Endgame” Means in Studio Empire
Endgame in Act 3 is **not** infinite numbers or endless scaling. It is a structured set of late-game goals and a repeatable loop that remains readable in the existing UI. The loop focuses on mastery through configured milestones, competitive pressure, and high-impact events while keeping the MVP core loop intact and understandable. Endgame must remain manageable within the single-page, desktop-only interface, using additive panels rather than new screens.

## 2) Core Endgame Loop (High-Level)
The Act 3 endgame loop is a repeatable cycle that builds on the MVP booking loop and Act 2 systems, without altering them. Based on Act 3 scope, the loop is:
1) Review late-game status (rivals/market, Act 3 story/events, reputation branch, legacy milestones).
2) Identify the next configured legacy milestone or Act 3 story objective.
3) Plan high-stakes bookings or queued schedules (if advanced scheduling is enabled) to target that objective.
4) Respond to any Act 3 event or rival/market shift using the configured system actions.
5) Complete the booking loop (shoot → content → analytics) and capture variance or impact summaries if configured.
6) Evaluate milestone/branch progress and claim eligible rewards.
7) Repeat with the next milestone tier or story beat.

If any step depends on a system that is not yet confirmed, it must remain **TBD (requires validation from source repo)**.

## 3) Milestones / Goals Model
Act 3 goals are represented by **tiered, config-driven milestones** that do not replace Act 2 milestones.
- **Primary milestone types (config-driven):** legacy milestones and reputation branch progress (if enabled).
- **Objective categories:** TBD (requires validation from source repo). Use a generic model until categories are confirmed.
- **Progress evaluation rules:** evaluate after key actions (booking completion, event resolution, or day advance), with thresholds defined in config. If exact thresholds are unknown, they remain **TBD**.

**Generic milestone record shape (placeholder):**
```
{
  id: "milestone-id",
  name: "Milestone Name",
  tier: 1,
  status: "locked" | "in_progress" | "complete" | "claimed",
  requirements: [/* config-defined thresholds, TBD */],
  rewards: [/* config-defined rewards, TBD */]
}
```

## 4) Reward Model (What You Get for Completing Milestones)
Rewards are **config-driven** and limited to what Act 3 scope allows. Allowed reward types:
- **Unlock next milestone tiers** (tier gating via config).
- **One-time bonus payouts** (if configured by Act 3 economy tuning; exact amounts TBD).
- **Permanent modifiers** only if explicitly confirmed by config and scope (TBD).
- **Cosmetic/log flavor** (optional, non-mechanical).

No new currencies, monetization, or narrative systems are introduced beyond what Act 3 scope permits.

## 5) Persistence vs Reset (Only If Confirmed)
No reset/prestige mechanics are implemented in Act 3 unless explicitly confirmed.

## 6) Risk, Consequence, and Constraints (Late-Game Pressure)
Act 3 difficulty comes from **config-driven constraints**:
- **Resource constraints:** cash, reputation, and milestone gating (TBD exact thresholds).
- **Opportunity cost:** choosing between rival/market responses and milestone progress.
- **Failure states:** soft failure preferred (e.g., delayed milestones, reduced impact), with recovery through standard booking loop.
- **Recovery:** return to the core loop to rebuild metrics; no hard resets unless explicitly confirmed.

All constraints must be adjustable through config and surfaced in the UI with clear feedback.

## 7) Anti-Runaway Scaling Controls
Act 3 must avoid runaway growth using config-driven controls consistent with scope:
- **Soft caps or diminishing returns:** TBD (only if confirmed in config).
- **Tier gating:** legacy milestone tiers and reputation branches gate progression.
- **Escalating costs:** allowed only if defined by Act 3 economy config (TBD).

If scaling controls are not explicitly confirmed in the Act 3 scope or config, mark them as **TBD** and do not implement.

## 8) UI Surfacing Requirements
Endgame loop status must be visible without new screens:
- **Milestone tracker panel:** Hub → “Legacy Milestones” panel with status and claim actions.
- **Progress summary card:** Hub → status summaries for rivals/market, story/events, and reputation branch.
- **Claim reward actions:** Hub → per milestone “Claim Reward” when eligible.
- **Warning states:** Hub and Analytics show any rival/market shifts or event impacts.

All UI additions must fit existing screen containers and remain desktop-only.

## 9) Save & Migration Requirements
- Endgame progress must serialize in the v3 state additions (`legacyMilestones`, `reputation`, `rivals`, `market`, `story.act3`, `content.variance`, `automation`, `schedule`, `metaProgression`).
- Migrations must preserve milestone states and add safe defaults for new keys.
- Export/import must remain safe and deterministic.
- Failed import must not corrupt the existing save.

## 10) Act 3 Endgame “Definition of Done”
- [ ] Endgame loop is playable start-to-finish using configured Act 3 systems.
- [ ] Milestones track correctly and are visible in the Hub panel.
- [ ] Rewards apply correctly and only when eligible.
- [ ] No MVP or Act 2 regressions.
- [ ] No infinite/unstable growth.
- [ ] All tuning values live in CONFIG.
- [ ] Save/export/import is safe and migration v2 → v3 preserves progress.

This doc defines Act 3’s endgame loop behavior. Implementation must not invent additional loops or meta systems beyond ACT3_SCOPE.
