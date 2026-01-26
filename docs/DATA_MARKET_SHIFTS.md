# Data — Market Shifts (Act 3)

This catalog defines Act 3 market shifts and timing. Values mirror `config.toml` and are read-only until Act 3 is in scope.

---

## Act 3 Market Shift Schedule

| id | day |
| --- | --- |
| shift_premium_boom | 225 |
| shift_promo_fatigue | 245 |

## Act 3 Market Shift Effects

| id | ofSubsMult | followersMult |
| --- | --- | --- |
| shift_premium_boom | 1.15 | 0.95 |
| shift_promo_fatigue | 0.95 | 0.85 |

---

## Config Mapping
Values map to:
- `CONFIG.market.shiftSchedule[]`
- `CONFIG.market.shifts.*`
- `CONFIG.market.multiplierFloor`
- `CONFIG.market.multiplierCeiling`
