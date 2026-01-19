# Act 3 Scope (Late Game + Endgame)

## 1) Act 3 Goal Statement
Act 3 delivers late-game depth by extending Act 2 with endgame-scale decisions that emphasize mastery, scale, and legacy outcomes. Late-game depth means the player manages macro-level studio stewardship, long-term optimization of talent, brand identity, and revenue streams, and adapts to high-impact events without changing the MVP core loop. Act 3 provides longer arcs and endgame objectives through additive systems only, with no new app architecture or technical stack changes. The intended payoff versus Act 2 is sustained mastery: larger strategic choices, higher stakes, and legacy milestones that reflect the studio’s long-term identity. The game remains a single-page, local-only, config-driven web app with a single authoritative `gameState`.

## 2) Hard Boundary: What Act 3 Is Not
- No changes to MVP scope, rules, or screens beyond additive Act 3 extensions.
- No Act 2 rewrites or removals; Act 2 remains intact and required as a dependency.
- No online features, accounts, payments, backend, or database.
- No frameworks, build tools, or routing migrations; still vanilla HTML/CSS/JS.
- No multiplayer, live events, or marketplace systems.
- No prestige/reset mechanics unless explicitly confirmed in `docs/SCOPE_VISION.md` (otherwise TBD).
- Nothing outside `docs/SCOPE_VISION.md` is permitted in Act 3.

## 3) Act 3 Feature List (Additive Only)

### A3.1 — Rival Studios / Competitive Pressure
- Summary (1–2 sentences)
  - Add competitive pressure and market positioning challenges via rival studios or market shifts (details TBD). This system introduces external pressure without changing the MVP loop.
- Player Value (why it matters late-game)
  - Creates high-stakes decisions and forces the player to adapt strategy to remain competitive.
- Dependencies (MVP + Act 2 prerequisites)
  - MVP economy, reputation, and progression; Act 2 expanded analytics and progression signals.
- New State Needed (high level keys; no deep schema yet)
  - `rivals` (TBD metadata, standings), `market` (TBD shift flags or modifiers).
- New/Updated Systems (which /src/systems/* it affects)
  - `systems/competition.js` (new, TBD) or `systems/progression.js` (extended).
- UI Surfaces (which screens/panels)
  - Hub (rival status summary), Analytics (impact notes) — exact panels TBD.
- Config Additions (new tunables required)
  - Rival definitions, market shift triggers, impact modifiers (TBD config categories).
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
  - Add high-impact events that test preparedness and flexibility (details TBD). Events are scheduled or triggered via config, not random unless explicitly approved.
- Player Value (why it matters late-game)
  - Introduces spikes of risk/reward and strategic pacing decisions.
- Dependencies (MVP + Act 2 prerequisites)
  - MVP story/event framework and day progression; Act 2 story expansions.
- New State Needed (high level keys; no deep schema yet)
  - `events.act3` or `story.act3` (TBD event flags/log).
- New/Updated Systems (which /src/systems/* it affects)
  - `systems/story.js` (extended) or `systems/events.js` (new, TBD).
- UI Surfaces (which screens/panels)
  - Hub or a dedicated event panel within existing screens (no new screens by default).
- Config Additions (new tunables required)
  - Event schedule, triggers, outcomes (TBD config categories).
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
  - Add distinct reputation paths that represent studio identity specializations (details TBD). Branches provide late-game specialization without changing the core loop.
- Player Value (why it matters late-game)
  - Enables long-term identity choices and strategic differentiation.
- Dependencies (MVP + Act 2 prerequisites)
  - MVP reputation stat and unlock gating; Act 2 progression and milestone systems.
- New State Needed (high level keys; no deep schema yet)
  - `reputation.branchId`, `reputation.branchProgress` (TBD structure).
- New/Updated Systems (which /src/systems/* it affects)
  - `systems/progression.js` (extended) for branch selection/progression.
- UI Surfaces (which screens/panels)
  - Hub (identity summary), Roster or Analytics (branch effects summary) — exact panels TBD.
- Config Additions (new tunables required)
  - Branch definitions, requirements, and modifiers (TBD config categories).
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
  - Add Act 3 narrative beats after Act 2 concludes (details TBD). Story content remains additive and uses the existing story system.
- Player Value (why it matters late-game)
  - Provides narrative closure and long-term goals beyond Act 2.
- Dependencies (MVP + Act 2 prerequisites)
  - MVP Act 1 story system and Act 2 story extensions.
- New State Needed (high level keys; no deep schema yet)
  - `story.act3` (TBD flags/sequence).
- New/Updated Systems (which /src/systems/* it affects)
  - `systems/story.js` (extended).
- UI Surfaces (which screens/panels)
  - Hub or existing story panel (no new screens by default).
- Config Additions (new tunables required)
  - Act 3 story event schedule and triggers (TBD config categories).
- Save/Load Considerations (versioning/migration notes)
  - v3 migration adds Act 3 story flags with safe defaults.
- Acceptance Criteria (specific + testable)
  - Act 3 story events never trigger before Act 2 completion conditions are met.
  - Story flags persist across save/load and export/import.
- Out of Scope Notes (what this feature explicitly does not include)
  - No Act 2 rewrites or retroactive edits to Act 1 events.

### A3.5 — Optional Automation (Late-Game QoL)
- Summary (1–2 sentences)
  - Add optional automation tools that reduce repetitive actions late-game (details TBD). Automation must be opt-in and transparent.
- Player Value (why it matters late-game)
  - Reduces micromanagement while preserving strategic control.
- Dependencies (MVP + Act 2 prerequisites)
  - MVP booking loop and action flow; Act 2 expanded systems for context.
- New State Needed (high level keys; no deep schema yet)
  - `automation` (TBD flags, rules, and enabled actions).
- New/Updated Systems (which /src/systems/* it affects)
  - `systems/automation.js` (new, TBD) or updates to existing booking/economy systems.
- UI Surfaces (which screens/panels)
  - Hub or Booking screen (automation toggles/summary, TBD).
- Config Additions (new tunables required)
  - Automation rules, limits, and safety caps (TBD config categories).
- Save/Load Considerations (versioning/migration notes)
  - v3 migration initializes automation settings to disabled.
- Acceptance Criteria (specific + testable)
  - Automation can be enabled/disabled without altering the core loop or breaking saves.
  - Automated actions follow config-defined limits and never bypass validation rules.
- Out of Scope Notes (what this feature explicitly does not include)
  - No idle/AFK progression or background timers.

### A3.6 — Content Performance Variance
- Summary (1–2 sentences)
  - Add greater variance to content outcomes to increase risk/reward (details TBD). Variance must be config-driven and bounded.
- Player Value (why it matters late-game)
  - Adds strategic risk management and reinforces long-term planning.
- Dependencies (MVP + Act 2 prerequisites)
  - MVP content result generation and analytics; Act 2 advanced analytics.
- New State Needed (high level keys; no deep schema yet)
  - `content.variance` (TBD settings/logs) or `analyticsHistory` extensions.
- New/Updated Systems (which /src/systems/* it affects)
  - `systems/content.js` and/or `systems/analytics.js` (extended).
- UI Surfaces (which screens/panels)
  - Analytics (variance notes/rollups), Content (result summary).
- Config Additions (new tunables required)
  - Variance ranges, caps, and rules per content type (TBD config categories).
- Save/Load Considerations (versioning/migration notes)
  - v3 migration adds variance settings/flags with defaults.
- Acceptance Criteria (specific + testable)
  - Variance is applied only when configured and remains within defined bounds.
  - Existing content history remains valid after migration.
- Out of Scope Notes (what this feature explicitly does not include)
  - No loot-box mechanics or gambling-style rewards.

### A3.7 — Advanced Scheduling
- Summary (1–2 sentences)
  - Add scheduling depth to balance multiple shoots or parallel planning (details TBD). Scheduling remains within the single-page UI and existing loop.
- Player Value (why it matters late-game)
  - Enables long-horizon planning and improved resource utilization.
- Dependencies (MVP + Act 2 prerequisites)
  - MVP booking flow and day progression; Act 2 expanded roster availability.
- New State Needed (high level keys; no deep schema yet)
  - `schedule` or `bookingQueue` (TBD queue/plan fields).
- New/Updated Systems (which /src/systems/* it affects)
  - `systems/booking.js` (extended) and possibly `systems/time.js` (if present).
- UI Surfaces (which screens/panels)
  - Booking screen (schedule panel), Hub (schedule summary).
- Config Additions (new tunables required)
  - Scheduling limits, queue size, and timing rules (TBD config categories).
- Save/Load Considerations (versioning/migration notes)
  - v3 migration initializes schedule state as empty.
- Acceptance Criteria (specific + testable)
  - Scheduling options are available only when enabled by config.
  - The day progression rules remain deterministic and do not introduce passive time.
- Out of Scope Notes (what this feature explicitly does not include)
  - No real-time timers or background scheduling.

### A3.8 — Legacy / Recognition Milestones
- Summary (1–2 sentences)
  - Add legacy recognition milestones that reflect long-term studio achievements (details TBD). These milestones provide endgame objectives without changing the core loop.
- Player Value (why it matters late-game)
  - Creates long-term goals and a sense of prestige for sustained play.
- Dependencies (MVP + Act 2 prerequisites)
  - MVP progression metrics; Act 2 milestone tracking (if implemented).
- New State Needed (high level keys; no deep schema yet)
  - `legacyMilestones` (TBD milestone list and completion flags).
- New/Updated Systems (which /src/systems/* it affects)
  - `systems/milestones.js` or `systems/progression.js` (extended, TBD).
- UI Surfaces (which screens/panels)
  - Hub (legacy milestone panel), Analytics (optional summary).
- Config Additions (new tunables required)
  - Legacy milestone definitions and thresholds (TBD config categories).
- Save/Load Considerations (versioning/migration notes)
  - v3 migration initializes legacy milestones with safe defaults.
- Acceptance Criteria (specific + testable)
  - Legacy milestones track and persist without altering Act 2 milestones.
  - UI displays milestone status with clear completion states.
- Out of Scope Notes (what this feature explicitly does not include)
  - No prestige reset or rebirth mechanics unless explicitly confirmed by scope.

## 4) Endgame Loop Definition (Act 3 Only)
Act 3’s endgame loop is the repeated cycle of planning high-stakes bookings and strategy, responding to competitive pressure and structured events, then reviewing analytics to refine long-term identity and legacy goals. Persistent meta progression is limited to configured legacy milestones and reputation branches (if implemented), while run-level progression remains the standard day-by-day booking loop. The player “wins” Act 3 by completing all configured legacy milestones and Act 3 story beats, as defined by config. If prestige/reset mechanics are not explicitly confirmed by the Vision scope, they remain **TBD (optional)** and are not implemented.

## 5) Act 3 Screen Additions / UI Changes (High Level)
- New Screens (if any)
  - None by default; Act 3 additions must be embedded in existing screens unless scope explicitly adds a new screen.
- Updated Screens
  - Hub: rivalry/market status, legacy milestones, Act 3 story status (TBD panels).
  - Booking: advanced scheduling panel (TBD), availability/queue indicators.
  - Analytics: variance summaries and event impacts (TBD panels).
  - Roster: reputation branch effects or high-value talent indicators (TBD).
- UI Rules (Act 3)
  - No routing frameworks or sub-apps.
  - All additions must fit into existing screen containers.
  - Avoid new UI complexity unless explicitly documented in scope.

## 6) Act 3 Economy & Scaling Strategy (High Level)
- All scaling and soft caps must be config-driven placeholders with conservative defaults.
- Any new high-tier sinks or costs introduced by Act 3 systems must be explicitly defined in config (TBD), with no new currencies.
- Progression gates (if any) must use existing metrics (cash, reputation, milestones) and be fully config-driven.
- If diminishing returns are used, they must be bounded and documented in config; otherwise leave as TBD.

## 7) Act 3 Data/Config Requirements
- Rival studios / market shift definitions (TBD).
- Structured event schedules, triggers, and outcomes (TBD).
- Reputation branches definitions, requirements, and modifiers (TBD).
- Act 3 story arc event list and triggers (TBD).
- Automation rules, limits, and safety caps (TBD).
- Content performance variance ranges and caps (TBD).
- Advanced scheduling limits and rules (TBD).
- Legacy milestone definitions and thresholds (TBD).

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
