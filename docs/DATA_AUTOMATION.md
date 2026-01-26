# Data — Automation Rules (Current)

This catalog mirrors the automation settings used by `src/systems/automation.js`.

## Automation Defaults (config-driven)

| key | value | meaning |
| --- | --- | --- |
| enabledDefault | false | Default toggle for automation on new saves. |
| autoBookDefault | false | Default toggle for auto‑booking. |
| autoPostDefault | false | Default toggle for auto‑posting. |
| maxActionsPerDay | 1 | Maximum automation actions per day. |
| minCashReserve | 0 | Minimum cash buffer required to auto‑book. |
| actionPriority | ["autoBook", "autoPost"] | Action order when both toggles are enabled. |
| autoPostPlatformPriority | ["Instagram", "X"] | Platform order for auto‑posting promo content. |

## Behavior Notes
- Automation runs **only** when the player clicks **Advance Day**.
- Auto‑book selects the first available performer/location/theme/content type that passes validation.
- Auto‑post selects the first eligible promo and posts it to the first available platform in the priority list.

## Config Mapping
Values map to:
- `CONFIG.automation.*`
