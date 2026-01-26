# Data — Content Variance (Current)

This catalog defines Premium content variance settings. Values mirror `src/config.js`.

## Variance Settings

| key | value | meaning |
| --- | --- | --- |
| enabled | true | Enable variance modifiers. |
| maxVariancePct | 0.15 | Maximum variance magnitude (±15%). |
| seedPolicy | stored | Seed stored in save data for deterministic rolls. |
| startDay | 181 | Variance begins on Day 181. |
| maxRollLogEntries | 100 | Maximum log entries stored. |

## Behavior Notes
- Variance applies **only** to Premium content and rolls once per Premium shoot.
- Roll logs are stored in `gameState.content.variance.rollLog`.

## Config Mapping
Values map to:
- `CONFIG.content.variance.*`
