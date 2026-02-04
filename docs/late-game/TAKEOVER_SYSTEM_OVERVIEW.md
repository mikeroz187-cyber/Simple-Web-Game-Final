# Industry Takeover — System Overview (Implemented)

## What It Is
Industry Takeover is the late-game conquest layer that unlocks on **Day 181**. When it unlocks, the legacy Competition loop is **replaced/hidden**, and the Industry Map becomes the new pressure system.

This overview summarizes the **implemented** system and points to deeper docs in `docs/late-game/`.

---

## Unlock + Entry
- **Unlock:** `CONFIG.takeover.unlockDay` (Day 181).
- **Competition:** Hidden/inert after unlock; Industry Map becomes the active rival loop.
- **Access:** Industry Map navigation appears after unlock.

---

## Performer Acquisition Loop (4 Stages)
Each rival performer is acquired through a 4-stage loop. Each stage takes `CONFIG.takeover.daysPerStage` (2 days) and must be **manually resolved** by the player when ready.

Stages (all costs and reputation impacts are config-driven):
1) **Intel** — `CONFIG.takeover.costs.intel`
2) **Approach** — `CONFIG.takeover.costs.approach`
3) **Turn** — `CONFIG.takeover.costs.turn` + weakness-based rep change (see `CONFIG.takeover.repChanges`)
4) **Debut** — `CONFIG.takeover.costs.debut` + rep reward (`CONFIG.takeover.repChanges.successfulDebut`, clamped)

**Tier cost multipliers:** `CONFIG.takeover.tierMultipliers` (tier1/2/3).  
**Rep gating:** `CONFIG.takeover.repRequirements` (tier1/2/3/boss).

---

## Reputation Rules (Global)
- **Global cap:** 100.
- **Takeover negatives:** Rep cannot drop below `CONFIG.takeover.repDefense.crisis` (floor is 10).
- **Boss defeat rep reward:** `CONFIG.takeover.repChanges.bossDefeated`, clamped to the 100 cap.

---

## Boss Confrontation Loop
Bosses become **vulnerable** when a studio has at least `CONFIG.takeover.performersToVulnerableBoss` performers acquired (3).

Boss confrontation details:
- **Stages:** `CONFIG.takeover.bossConfrontationStages` (5 total).
- **Timing:** Each stage takes `CONFIG.takeover.daysPerStage` (2 days).
- **Manual resolve:** Stages are advanced manually when ready.
- **Cost:** `CONFIG.takeover.costs.bossConfrontation`.

**Defeat rewards (implemented):**
- Auto-acquire remaining performers in the studio
- Trophy unlock + boss collection entry
- Rep reward with cap applied
- Studio theme bonus applied

---

## Retaliation (Poach Attempts)
Rival retaliation runs after unlock on a cadence of `CONFIG.takeover.retaliation.minDaysBetweenEvents`–`maxDaysBetweenEvents` (7–14 days).

On a poach attempt:
- **Defend cost:** `CONFIG.takeover.retaliation.poachDefenseCost`
- **Lose outcome:** Performer is removed, rep penalty `CONFIG.takeover.retaliation.poachRepPenaltyOnLoss` (respects the floor)
- **Cooldown:** Lost performers are marked **lost** and can be re-acquired after `CONFIG.takeover.retaliation.lostCooldownDays`
- **Poach back:** After cooldown, use **Poach back** to instantly re-acquire at
  `CONFIG.takeover.retaliation.poachBaseCost + (starPower * CONFIG.takeover.retaliation.poachCostPerStarPower)`
- **Rules:** Poach back ignores reputation gates and skips the 4-stage acquisition loop

---

## Victory + Free Play
- **Victory condition:** Defeat **all 5** rival bosses.
- **Result:** Victory modal + Empire screen, then free play continues indefinitely.

## UI Notes
- UI: Added compact status badges across takeover cards and boss/roster rows.
- UI: Added lightweight progress bars for studio acquisition and Empire trophies.

---

## Art/Asset Conventions
All takeover image paths and placeholder fallbacks are documented in:
**`docs/IMAGE_REGISTRY.md`** (see the Takeover section).
