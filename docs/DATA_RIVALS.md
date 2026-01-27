# Data — Rival Studios (Current)

This catalog defines rival studios used by the competition system. Values mirror `src/config.js`.

## Rival Studios

| id | name | baseReputationScore | weeklyGrowthRate |
| --- | --- | --- | --- |
| rival_night_slate | Night Slate Media | 55 | 1.2 |
| rival_luxe_pixel | Luxe Pixel Studios | 48 | 0.9 |

## Behavior Notes
- Competition unlocks after debt by default (controlled by `CONFIG.market.competition.unlockAfterDebt`).
- If `unlockAfterDebt` is `false`, competition can start on a specific day via `CONFIG.market.competition.startDay`.
- Rival scores increase every **7 days** by `weeklyGrowthRate`.

## Config Mapping
Values map to:
- `CONFIG.market.competition.rivals`
- `CONFIG.market.competition.startDay`
- `CONFIG.market.competition.weeklyCheckCadenceDays`
