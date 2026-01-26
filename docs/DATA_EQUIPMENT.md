# Data — Equipment Upgrades (Current)

This catalog defines the equipment upgrades used in the Shop screen. Values mirror `src/config.js`.

## Equipment Upgrades

| id | maxLevel | levelCosts | followersMultPerLevel | ofSubsMultPerLevel | notes |
| --- | --- | --- | --- | --- | --- |
| lighting | 3 | [600, 900, 1200] | 0.05 | 0.00 | Boosts Promo follower output. |
| camera | 3 | [800, 1200, 1600] | 0.00 | 0.05 | Boosts Premium OF subscriber output. |
| set_dressing | 3 | [500, 800, 1100] | 0.03 | 0.03 | Small boosts to both outputs. |

## Behavior Notes
- Equipment bonuses apply to Promo followers (lighting, set dressing) and Premium OF subs (camera, set dressing).
- Upgrades cap at `maxLevel` and are purchased sequentially.

## Config Mapping
Values map to:
- `CONFIG.equipment.upgradeOrder`
- `CONFIG.equipment.upgrades.*`
