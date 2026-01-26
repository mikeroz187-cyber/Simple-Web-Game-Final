# Data — Reputation Branches (Current)

This catalog defines Studio Identity branches and their modifiers. Values mirror `src/config.js`.

## Studio Identity Branches

| id | label | requiredReputation | ofSubsMult | followersMult | blurb |
| --- | --- | --- | --- | --- | --- |
| prestige | Prestige | 60 | 1.10 | 0.95 | High-end brand. More OF subs per premium, slightly less reach. |
| volume | Volume | 60 | 0.95 | 1.10 | Chase reach. More followers, slightly less premium OF subs. |
| boutique | Boutique | 60 | 1.05 | 1.05 | Balanced refinement. Slight boost to both. |

## Behavior Notes
- Branch selection unlocks at **Day 181** (`CONFIG.reputation.selectionStartDay`).
- Once selected, the branch is **locked** for the run.
- Modifiers apply to Promo follower gain and Premium OF subs.

## Config Mapping
Values map to:
- `CONFIG.reputation.branches`
- `CONFIG.reputation.selectionStartDay`
