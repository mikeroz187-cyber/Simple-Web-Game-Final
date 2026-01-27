# Data — Market Shifts (Current)

This catalog defines market shift timing and multipliers used by the competition system.

## Market Shift Schedule

| id | name | startDay | endDay |
| --- | --- | --- | --- |
| shift_promo_cooldown | Promo Cooldown | 190 | 205 |
| shift_premium_bump | Premium Bump | 220 | 235 |

## Market Shift Effects

| id | promoFollowerMult | premiumOfSubsMult |
| --- | --- | --- |
| shift_promo_cooldown | 0.95 | 1.00 |
| shift_premium_bump | 1.00 | 1.08 |

## Behavior Notes
- Multipliers are clamped in code to the 0.85–1.15 range.
- Effects apply only while the active shift window is in range.

## Config Mapping
Values map to:
- `CONFIG.market.competition.marketShifts.*`
