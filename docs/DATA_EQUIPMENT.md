# Data — Equipment Upgrades (Act 2)

This catalog defines Act 2 equipment upgrades. Values mirror `config.toml` and are read-only until Act 2 is in scope.

---

## Act 2 Equipment (Lighting, Camera, Set Dressing)

| id | maxLevel | levelCosts | followersMultPerLevel | ofSubsMultPerLevel | notes |
| --- | --- | --- | --- | --- | --- |
| lighting | 3 | [600, 900, 1200] | 0.05 | 0.00 | Boosts Promo follower output. |
| camera | 3 | [800, 1200, 1600] | 0.00 | 0.05 | Boosts Premium OF subscriber output. |
| set_dressing | 3 | [500, 800, 1100] | 0.03 | 0.03 | Small boosts to both outputs. |

---

## Config Mapping
Values map to:
- `CONFIG.equipment.upgradeOrder`
- `CONFIG.equipment.upgrades.*`
