> **Status:** Vision reference only. This document is not authoritative for the current build.
> Current behavior lives in `docs/CORE_GAMEPLAY_LOOP.md` and `docs/GAMESTATE_DATA_MODEL.md`.

> Note: Current runtime config lives in `src/config.js`; `config.toml` is legacy.

# Act 3 Scope (Late Game + Endgame)

## 1) Act 3 Goal Statement
Act 3 delivers late-game depth by extending Act 2 with endgame-scale decisions that emphasize mastery, scale, and legacy outcomes. Late-game depth means the player manages macro-level studio stewardship, long-term optimization of talent, brand identity, and MRR streams, and adapts to high-impact events without changing the MVP core loop. Act 3 provides longer arcs and endgame objectives through additive systems only, with no new app architecture or technical stack changes. The intended payoff versus Act 2 is sustained mastery: larger strategic choices, higher stakes, and legacy milestones that reflect the studio’s long-term identity. The game remains a single-page, local-only, config-driven web app with a single authoritative `gameState`.

**Act 3 timeline:** Days 181–270. Day 180 ends Act 2; Day 181 begins Act 3.

## 2) Hard Boundary: What Act 3 Is Not
- No changes to MVP scope, rules, or screens beyond additive Act 3 extensions.
- No Act 2 rewrites or removals; Act 2 remains intact and required as a dependency.
- No online features, accounts, payments, backend, or database.
- No frameworks, build tools, or routing migrations; still vanilla HTML/CSS/JS.
- No multiplayer, live events, or marketplace systems.
- No prestige/reset mechanics (explicitly excluded for Act 3).
- Nothing outside `docs/SCOPE_VISION.md` is permitted in Act 3.

## 3) Act 3 Feature List (Additive Only)

### A3.1 — Rival Studios / Competitive Pressure
- Summary (1–2 sentences)
  - Add two rival studios with deterministic weekly standings checks and market shift modifiers that impact premium OF subs and follower growth.
- Player Value (why it matters late-game)
  - Creates high-stakes decisions and forces the player to adapt strategy to remain competitive.
- Dependencies (MVP + Act 2 prerequisites)
  - MVP economy, reputation, and progression; Act 2 expanded analytics and progression signals.
- New State Needed (high level keys; no deep schema yet)
  - `rivals` with `studios` array and `lastCheckDay`, `market` with `activeShiftId`.
- New/Updated Systems (which /src/systems/* it affects)
  - `systems/competition.js` (new) for rival standings and market shifts.
- UI Surfaces (which screens/panels)
  - Hub (rival status summary), Analytics (impact notes).
- Config Additions (new tunables required)
  - Rival definitions, weekly check cadence, and market shift schedule with multipliers.
- Save/Load Considerations (versioning/migration notes)
  - Add v3 defaults for rivals/market state; migration must not alter existing progression.
- Acceptance Criteria (specific + testable)
  - Rival status data renders without breaking MVP or Act 2 UI.
  - Competitive modifiers apply only when configured and enabled.
  - v2 saves migrate with deterministic default rival/market state.
- Out of Scope Notes (what this feature explicitly does not include)
  - No online leaderboards, real-time competition, or PvP elements.

### A3.2 — Structured High-Impact Events (Act 3)
- Summary (1–2 sentences)
  - Add deterministic Act 3 events on Days 200/225/245/270 with fixed outcomes and messaging.
- Player Value (why it matters late-game)
  - Introduces spikes of risk/reward and strategic pacing decisions.
- Dependencies (MVP + Act 2 prerequisites)
  - MVP story/event framework and day progression; Act 2 story expansions.
- New State Needed (high level keys; no deep schema yet)
  - `story.act3` with `eventsShown` array and `lastEventId`.
- New/Updated Systems (which /src/systems/* it affects)
  - `systems/story.js` (extended) for Act 3 events (no separate events.js).
- UI Surfaces (which screens/panels)
  - Hub or a dedicated event panel within existing screens (no new screens by default).
- Config Additions (new tunables required)
  - Event schedule, trigger conditions (`onDayStart`), and outcome modifiers.
- Save/Load Considerations (versioning/migration notes)
  - Add event flags with safe defaults during v3 migration.
- Acceptance Criteria (specific + testable)
  - Act 3 events only trigger after Act 2 progression conditions are met.
  - Event outcomes are deterministic based on config and state.
  - v2 saves load with no retroactive event triggers.
- Out of Scope Notes (what this feature explicitly does not include)
  - No live events, server-driven events, or randomized loot systems.

### A3.3 — Reputation Branches (Studio Identity Paths)
- Summary (1–2 sentences)
  - Add three reputation branches (Prestige, Volume, Boutique) with fixed modifiers and unlock requirements.
- Player Value (why it matters late-game)
  - Enables long-term identity choices and strategic differentiation.
- Dependencies (MVP + Act 2 prerequisites)
  - MVP reputation stat and unlock gating; Act 2 progression and milestone systems.
- New State Needed (high level keys; no deep schema yet)
  - `reputation` object with `branchId` and `branchProgress`.
- New/Updated Systems (which /src/systems/* it affects)
  - `systems/progression.js` (extended) for branch selection/progression.
- UI Surfaces (which screens/panels)
  - Hub (identity summary), Roster or Analytics (branch effects summary).
- Config Additions (new tunables required)
  - Branch requirements (reputation thresholds) and modifier tables.
- Save/Load Considerations (versioning/migration notes)
  - Initialize branch fields with neutral defaults in v3 migration.
- Acceptance Criteria (specific + testable)
  - Branch selection persists across saves and is visible in UI.
  - Branch modifiers apply only when configured.
  - MVP reputation behavior remains unchanged when no branch is selected.
- Out of Scope Notes (what this feature explicitly does not include)
  - No morality system or narrative alignment beyond defined branches.

### A3.4 — Act 3 Story Arc (Post-Act 2)
- Summary (1–2 sentences)
  - Add Act 3 narrative beats on Days 200/225/245/270 with deterministic outcomes.
- Player Value (why it matters late-game)
  - Provides narrative closure and long-term goals beyond Act 2.
- Dependencies (MVP + Act 2 prerequisites)
  - MVP Act 1 story system and Act 2 story extensions.
- New State Needed (high level keys; no deep schema yet)
  - `story.act3` with `eventsShown` array and `lastEventId`.
- New/Updated Systems (which /src/systems/* it affects)
  - `systems/story.js` (extended).
- UI Surfaces (which screens/panels)
  - Hub or existing story panel (no new screens by default).
- Config Additions (new tunables required)
  - Act 3 story event schedule and trigger conditions.
- Save/Load Considerations (versioning/migration notes)
  - v3 migration adds Act 3 story flags with safe defaults.
- Acceptance Criteria (specific + testable)
  - Act 3 story events never trigger before Act 2 completion conditions are met.
  - Story flags persist across save/load and export/import.
- Out of Scope Notes (what this feature explicitly does not include)
  - No Act 2 rewrites or retroactive edits to Act 1 events.

### A3.5 — Optional Automation (Late-Game QoL)
- Summary (1–2 sentences)
  - Add opt-in automation for booking and social posting, capped to one automated action per day.
- Player Value (why it matters late-game)
  - Reduces micromanagement while preserving strategic control.
- Dependencies (MVP + Act 2 prerequisites)
  - MVP booking loop and action flow; Act 2 expanded systems for context.
- New State Needed (high level keys; no deep schema yet)
  - `automation` with `enabled`, `autoBookEnabled`, `autoPostEnabled`, and `safetyCaps`.
- New/Updated Systems (which /src/systems/* it affects)
  - `systems/automation.js` (new) plus light hooks in booking/economy systems.
- UI Surfaces (which screens/panels)
  - Hub or Booking screen (automation toggles/summary).
- Config Additions (new tunables required)
  - Automation rules and safety caps (max actions/day, min cash reserve).
- Save/Load Considerations (versioning/migration notes)
  - v3 migration initializes automation settings to disabled.
- Acceptance Criteria (specific + testable)
  - Automation can be enabled/disabled without altering the core loop or breaking saves.
  - Automated actions follow config-defined limits and never bypass validation rules.
- Out of Scope Notes (what this feature explicitly does not include)
  - No idle/AFK progression or background timers.

### A3.6 — Content Performance Variance
- Summary (1–2 sentences)
  - Add bounded ±15% variance applied to Promo followers or Premium OF subs, using deterministic seed rolls.
- Player Value (why it matters late-game)
  - Adds strategic risk management and reinforces long-term planning.
- Dependencies (MVP + Act 2 prerequisites)
  - MVP content result generation and analytics; Act 2 advanced analytics.
- New State Needed (high level keys; no deep schema yet)
  - `content.variance` with `seed`, `rollLog`, and `enabled`.
- New/Updated Systems (which /src/systems/* it affects)
  - `systems/content.js` and/or `systems/analytics.js` (extended).
- UI Surfaces (which screens/panels)
  - Analytics (variance notes/rollups), Content (result summary).
- Config Additions (new tunables required)
  - Variance ranges and caps per content type plus seed policy.
- Save/Load Considerations (versioning/migration notes)
  - v3 migration adds variance settings/flags with defaults.
- Acceptance Criteria (specific + testable)
  - Variance is applied only when configured and remains within defined bounds.
  - Existing content history remains valid after migration.
- Out of Scope Notes (what this feature explicitly does not include)
  - No loot-box mechanics or gambling-style rewards.

### A3.8 — Legacy / Recognition Milestones
- Summary (1–2 sentences)
  - Add legacy milestones tied to high-end thresholds (MRR, reputation, subscribers, and story completion).
- Player Value (why it matters late-game)
  - Creates long-term goals and a sense of prestige for sustained play.
- Dependencies (MVP + Act 2 prerequisites)
  - MVP progression metrics; Act 2 milestone tracking (if implemented).
- New State Needed (high level keys; no deep schema yet)
  - `legacyMilestones` array with completion flags and timestamps.
- New/Updated Systems (which /src/systems/* it affects)
  - `systems/milestones.js` (new) or `systems/progression.js` (extended).
- UI Surfaces (which screens/panels)
  - Hub (legacy milestone panel), Analytics (optional summary).
- Config Additions (new tunables required)
  - Legacy milestone definitions, thresholds, and reward text (no new currencies).
- Save/Load Considerations (versioning/migration notes)
  - v3 migration initializes legacy milestones with safe defaults.
- Acceptance Criteria (specific + testable)
  - Legacy milestones track and persist without altering Act 2 milestones.
  - UI displays milestone status with clear completion states.
- Out of Scope Notes (what this feature explicitly does not include)
  - No prestige reset or rebirth mechanics unless explicitly confirmed by scope.

## 4) Endgame Loop Definition (Act 3 Only)
Act 3’s endgame loop is the repeated cycle of planning high-stakes bookings and strategy, responding to competitive pressure and structured events, then reviewing analytics to refine long-term identity and legacy goals. Persistent meta progression is limited to configured legacy milestones and reputation branches, while run-level progression remains the standard day-by-day booking loop. The player “wins” Act 3 by completing all configured legacy milestones and Act 3 story beats, as defined by config. Prestige/reset mechanics are not part of Act 3.

## 5) Act 3 Screen Additions / UI Changes (High Level)
- New Screens (if any)
  - None by default; Act 3 additions must be embedded in existing screens unless scope explicitly adds a new screen.
- Updated Screens
  - Hub: rivalry/market status, legacy milestones, Act 3 story status.
  - Analytics: variance summaries and event impacts.
  - Roster: reputation branch effects and high-value talent indicators.
- UI Rules (Act 3)
  - No routing frameworks or sub-apps.
  - All additions must fit into existing screen containers.
  - Avoid new UI complexity unless explicitly documented in scope.

## De-scoped Note
- Advanced scheduling (booking queue) was intentionally cut from Act 3 scope.

## 6) Act 3 Economy & Scaling Strategy (High Level)
- All scaling and soft caps must be config-driven with conservative defaults.
- Any new high-tier sinks or costs introduced by Act 3 systems must be explicitly defined in config, with no new currencies.
- Progression gates (if any) must use existing metrics (cash, reputation, milestones) and be fully config-driven.
- Diminishing returns are limited to variance caps and market shift multipliers.

## 7) Act 3 Data/Config Requirements
- Rival studios / market shift definitions (see ACT3_SYSTEMS.md).
- Structured event schedules, triggers, and outcomes (see DATA_STORY_EVENTS.md).
- Reputation branches definitions, requirements, and modifiers (see ACT3_SYSTEMS.md).
- Act 3 story arc event list and triggers (Days 200/225/245/270).
- Automation rules, limits, and safety caps (max 1 action/day; min cash reserve).
- Content performance variance ranges and caps (±15%).
- Legacy milestone definitions and thresholds (see ACT3_SYSTEMS.md).

## 8) Act 3 Completion Checklist (Definition of Done)
- [ ] All A3 features listed above are implemented.
- [ ] No MVP regressions.
- [ ] No Act 2 regressions.
- [ ] Save migration works v2 → v3 with deterministic defaults.
- [ ] Export/import works safely for v3 saves.
- [ ] All new tuning values are config-driven (no magic numbers).
- [ ] UI remains usable, single-page, and desktop-only.

## 9) Compatibility Rules (Act 2 Save Files)
- Act 2 saves must load and migrate forward to Act 3 (v2 → v3).
- Migration must be deterministic, safe, and repeatable.
- Failed migration never corrupts existing saves; preserve the original data.
- Version key increments to v3, with documented migration steps.

## 10) Risk Register (Act 3 Only)
| Risk | Why It Matters | Mitigation |
| --- | --- | --- |
| Complexity explosion | Endgame systems can overwhelm players and dev scope. | Keep additions additive, minimal, and tied to config-driven toggles. |
| Endgame loops breaking pacing | Late-game may become repetitive or too punishing. | Use conservative config defaults and require testable pacing gates. |
| Meta progression making early game irrelevant | Legacy/perk systems can trivialize early play. | Cap modifiers and isolate legacy benefits to late-game contexts. |
| Save bloat | New state fields could inflate saves and slow load. | Keep state minimal and store summaries instead of raw logs. |
| UI overload | Too many panels reduce clarity. | Consolidate panels and reuse existing screens only. |
| Rival pressure feels unfair | Competition systems can feel arbitrary. | Require deterministic, config-driven modifiers and clear UI feedback. |
| Event fatigue | Too many events disrupt core loop. | Gate events with cooldowns and configurable schedules. |
| Automation removes player agency | Over-automation can invalidate decisions. | Keep automation opt-in and bounded; always allow manual override. |
| Variance undermines strategy | Excess randomness can feel punitive. | Use bounded variance and surface ranges in analytics. |
| Migration fragility | v2 → v3 migration errors can corrupt saves. | Implement safe defaults and validate before overwriting saves. |

Act 3 is complete only when the checklist passes and MVP + Act 2 remain intact and playable.
