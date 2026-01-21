# CURRENT SCOPE (Authoritative)

## Current Phase
- **Act 2 Phase 1 — Save Version v2 (New Games Only)** – Post-MVP work is focused on a v2 save schema and reset-on-incompatible-save behavior.
- **Act 2 Option A (Slice 1) — Equipment Upgrades + Multipliers** – Add Shop equipment upgrade purchases and apply equipment multipliers to follower/subscriber and revenue gains, as explicitly listed below.
- **Act 2 Option A (Slice 2) — Location Tiers (Tier 1 Unlock + Premium Gate)** – Add Shop unlock for Location Tier 1 and gate Premium shoots until Tier 1 is unlocked.

## Completed (Confirmed)
- Advance Day button complete.
- Act 1 Content Pack 01 + 02 story events complete (if present).

## In Scope Now (Act 2 Phase 1 — Save v2, New Games Only)
- **Bump save version to v2** using `gameState.meta.version`.
- **Add v2 defaults** per the Act 2 state extensions document(s) referenced in the plan (additive-only fields).
- **Reset on incompatible save:** If a loaded or imported save is not v2, the game resets to a fresh v2 save and clearly notifies the player (no silent failures).
- **Export/import behavior stays consistent** with the “new games only” decision: exports represent v2 saves; imports of non-v2 saves trigger reset + message.

## In Scope Now (Act 2 Option A — Equipment Upgrades + Multipliers)
- **Shop equipment upgrades** for lighting, camera, and set dressing using `CONFIG.equipment.*` costs/levels, stored in `gameState.equipment.*`.
- **Upgrade purchase UI** in the Shop screen (levels, costs, upgrade button states).
- **Equipment multipliers** applied after base deltas for followers/subscribers and revenue using config-driven multipliers.

## In Scope Now (Act 2 Option A — Location Tiers Slice 2)
- **Location Tier 1 unlock** as a single Shop purchase using config-driven cost and name.
- **Shop UI section** listing Location Tiers (Tier 0 default unlocked, Tier 1 purchasable).
- **Premium shoot gate**: Premium bookings require Location Tier 1 unlocked (clear message if blocked).
- **Unlock persistence**: `gameState.unlocks.locationTiers.tier1` is authoritative; keep `locationTier1Unlocked` in sync for backward compatibility.

## Explicitly Out of Scope (Act 2 Phase 1)
- **Any migration helpers** (no detectVersion, migrateV1ToV2, or similar migration utilities).
- **Act 2 mechanics expansion** beyond the v2 schema defaults + reset behavior and the explicitly listed equipment upgrades and location tier slice.
- **New UI screens/panels** or navigation changes.
- **Refactors or new systems** unrelated to the v2 schema bump and reset behavior.
- **Mobile/responsive work**, online features, frameworks, build tooling, or backend services.

## Definition of Done (Act 2 Phase 1)
- [ ] `gameState.meta.version` is set to v2 for new saves.
- [ ] v2 defaults match the Act 2 extensions docs referenced in the Master Implementation Plan.
- [ ] Loading or importing a non-v2 save resets to a new v2 save and displays a clear player message.
- [ ] Export/import continues to work for v2 saves without silent failures.
- [ ] Equipment upgrades are implemented only as defined in scope (Shop purchases + multipliers).
- [ ] Location Tier 1 unlock is purchasable in Shop and Premium shoots are gated until unlocked.
- [ ] No new systems, screens, or refactors were introduced beyond the listed scope.
- [ ] CHANGELOG.md updated to record the doc change.

## Authority Order (Documentation to Follow)
Repo layout is authoritative here to prevent drift across MVP docs.
When building or reviewing features, **follow these documents in order**:
1. **docs/CURRENT_SCOPE.md** (this file – latest scope definition)
2. **docs/SCOPE_MVP.md** (historical MVP feature list and plan)
3. **docs/MVP/MVP_TECH_GUARDRAILS.md** (historical MVP guardrails)
4. **docs/MVP/MVP_FILE_STRUCTURE.md** (historical MVP file map)
5. **docs/MVP/MVP_BUILD_ORDER.md** (historical MVP build order)
6. **docs/MVP/MVP_UI_BLUEPRINT.md** (historical MVP UI blueprint)
7. **docs/MVP/MVP_STATE_MODEL.md** (historical MVP state model)

*(If any discrepancy arises, the CURRENT_SCOPE.md has the final say.)*

## How to Use This File
- **Scope changes post-MVP**: When new features are approved after MVP, update *only* this `CURRENT_SCOPE.md` to expand scope. This file “unlocks” new features for development.
- **Do not retroactively edit older Vision docs** for scope changes. The vision docs remain as historical reference designs, even if the scope evolves. Always refer back here for the official current scope.
- **Implementation status**: Progress tracking lives outside this file (use a separate progress/status document if needed).
