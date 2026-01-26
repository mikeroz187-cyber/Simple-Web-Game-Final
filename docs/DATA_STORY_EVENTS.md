# Data — Story Events (Current)

This document lists story events implemented in `src/config.js` and triggered via `checkStoryEvents()`.

## Trigger Behavior
- Story events trigger **when a day starts** (after clicking **Advance Day**).
- Act 1 end events trigger when `player.day === player.debtDueDay`.
- Story events are logged to the Story Log and are shown in modal cards when triggered.

## Act 1 — Intro + Packs + Debt Reminders (Days 1–90)

### Intro
| id | day | title |
| --- | --- | --- |
| act1_intro_day1 | 1 | Loan Due, Day 90 |

### Act 1 Pack 01
| id | day | title |
| --- | --- | --- |
| act1_pack01_client_referral_day15 | 15 | Client Referral Pipeline |
| act1_pack01_premium_editing_day25 | 25 | Premium Editing Standards |
| act1_pack01_vendor_discount_day45 | 45 | Vendor Discount Window |
| act1_pack01_repeat_commissions_day70 | 70 | Repeat Commissions Roll In |
| act1_pack01_final_stretch_day85 | 85 | Final Stretch Focus |

### Act 1 Pack 02
| id | day | title |
| --- | --- | --- |
| act1_pack02_sponsor_ping_day22 | 22 | Sponsor Ping, No String Attached |
| act1_pack02_backroom_buzz_day29 | 29 | Backroom Buzz |
| act1_pack02_rumor_polish_day37 | 37 | Rumor, Polished |
| act1_pack02_midnight_metrics_day46 | 46 | Midnight Metrics |
| act1_pack02_press_quote_day55 | 55 | Press Quote, Carefully Spicy |
| act1_pack02_fanmail_stack_day72 | 72 | Fanmail Stack |
| act1_pack02_late_act1_fever_day83 | 83 | Late Act 1 Fever |

### Act 1 Pack 03
| id | day | title |
| --- | --- | --- |
| act1_pack03_debt_spiral_day18 | 18 | The Clock Starts Talking Back |
| act1_pack03_power_trip_day36 | 36 | You’re Not ‘Trying’ Anymore |
| act1_pack03_debt_pressure_day63 | 63 | Friendly Reminder (Not Friendly) |
| act1_pack03_empire_swagger_day84 | 84 | Empire Mode: Enabled |

### Debt Reminders
| id | day | title |
| --- | --- | --- |
| act1_debt_reminder_day30 | 30 | Debt Check — Day 30 |
| act1_debt_reminder_day60 | 60 | Debt Check — Day 60 |
| act1_debt_reminder_day80 | 80 | Debt Check — Day 80 |

### Act 1 End Events
| id | day | title |
| --- | --- | --- |
| act1_end_win_day90 | 90 | Debt Cleared |
| act1_end_loss_day90 | 90 | Defaulted on the Debt |

## Act 2 — Story Schedule (Days 95–170)

| id | day | title |
| --- | --- | --- |
| act2_expansion_plan_day95 | 95 | Expansion Plan Drafted |
| act2_staffing_push_day120 | 120 | Staffing Push |
| act2_studio_upgrade_day145 | 145 | Studio Upgrade Decision |
| act2_partnership_offer_day170 | 170 | Partnership Offer |

## Act 3 — Story Schedule + Effects (Days 200–270)

| id | day | title | effects |
| --- | --- | --- | --- |
| act3_brand_legacy_day200 | 200 | Brand Legacy Review | +2 reputation, +200 social followers |
| act3_market_shift_day225 | 225 | Market Shift | +$1500 cash |
| act3_mentorship_day245 | 245 | Mentorship and Succession | -1 fatigue (all performers) |
| act3_exit_strategy_day270 | 270 | Exit Strategy | +$3000 cash, +1 reputation |

## Config Mapping
Values map to:
- `CONFIG.story.act1.*`
- `CONFIG.story.act2.schedule`
- `CONFIG.story.act3.schedule`
- `CONFIG.story.act3.effects`
