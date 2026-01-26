# Data — Rival Studios (Current)

This catalog defines rival studios used by the competition system. Values mirror `src/config.js`.

## Rival Studios

| id | name | baseReputationScore | weeklyGrowthRate |
| --- | --- | --- | --- |
| rival_night_slate | Night Slate Media | 55 | 1.2 |
| rival_luxe_pixel | Luxe Pixel Studios | 48 | 0.9 |

## Behavior Notes
- Competition auto‑enables on **Day 181** (unless `CONFIG.competition.enabled` is manually set to `true`).
- Rival scores increase every **7 days** by `weeklyGrowthRate`.

## Config Mapping
Values map to:
- `CONFIG.competition.rivals`
- `CONFIG.competition.startDay`
- `CONFIG.competition.weeklyCheckCadenceDays`
