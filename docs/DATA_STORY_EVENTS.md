# Data — Story Events (Full Game)

This document defines **all story events** across MVP and Vision (Acts 1–3). Each event includes a consistent schema for implementation and testing. Vision content is explicitly marked as **NOT IN MVP**.

---

## MVP Events (Act 1 — Days 1–90)

> These events are **in scope for MVP** and should fire within the Day 1–90 loop.

### Intro Event

- **id:** `act1_intro_day1`
- **act:** 1
- **triggerDay:** 1
- **triggerCondition:** `onDayStart`
- **title:** Loan Due, Day 90
- **message:** You start with a $5,000 cash loan, but the debt is $10,000 due by Day 90. This is the only debt in the MVP and it must be cleared before the end of Day 90. Keep cash flow tight and prioritize steady revenue early.

### Debt Reminders

- **id:** `act1_debt_reminder_day30`
- **act:** 1
- **triggerDay:** 30
- **triggerCondition:** `onDayStart`
- **title:** Debt Check — Day 30
- **message:** Thirty days in, the $10,000 debt clock is already ticking. You still have 60 days to close the gap. Keep shoots consistent and avoid unnecessary costs.

- **id:** `act1_debt_reminder_day60`
- **act:** 1
- **triggerDay:** 60
- **triggerCondition:** `onDayStart`
- **title:** Debt Check — Day 60
- **message:** Day 60 puts you in the final stretch. The $10,000 debt is due in 30 days, and cash on hand will decide the outcome. Audit your plan and keep revenue predictable.

- **id:** `act1_debt_reminder_day80`
- **act:** 1
- **triggerDay:** 80
- **triggerCondition:** `onDayStart`
- **title:** Debt Check — Day 80
- **message:** Ten days left before the Day 90 deadline. If the debt is not covered by then, the game ends. Focus on high-confidence shoots and minimize risk.

### Endgame Events

- **id:** `act1_end_win_day90`
- **act:** 1
- **triggerDay:** 90
- **triggerCondition:** `onDayEndDebtPaid`
- **title:** Debt Cleared
- **message:** You paid the $10,000 debt on time. The studio is stable, and the loan is behind you. You now have a real foundation for long-term growth.

- **id:** `act1_end_loss_day90`
- **act:** 1
- **triggerDay:** 90
- **triggerCondition:** `onDayEndDebtUnpaid`
- **title:** Defaulted on the Debt
- **message:** The $10,000 debt was not paid by Day 90. The lender shuts the studio down, and the run ends here. Use what you learned to plan a tighter start next time.

---

## NOT IN MVP — Act 2 Only (Vision Definitions)

> These events are **NOT IN MVP** and are introduced during Act 2 (Days 91–180).

- **id:** `act2_expansion_plan_day95`
- **act:** 2
- **triggerDay:** 95
- **triggerCondition:** `onDayStart`
- **title:** Expansion Plan Drafted
- **message:** With the debt cleared, you formalize a growth plan focused on steady revenue and brand consistency. New hires and upgrades are now on the table.

- **id:** `act2_staffing_push_day120`
- **act:** 2
- **triggerDay:** 120
- **triggerCondition:** `onDayStart`
- **title:** Staffing Push
- **message:** Demand is rising, and capacity is tight. You greenlight a staffing push to stabilize booking consistency.

- **id:** `act2_studio_upgrade_day145`
- **act:** 2
- **triggerDay:** 145
- **triggerCondition:** `onDayStart`
- **title:** Studio Upgrade Decision
- **message:** Production quality is plateauing. You decide to invest in equipment upgrades to keep premium output competitive.

- **id:** `act2_partnership_offer_day170`
- **act:** 2
- **triggerDay:** 170
- **triggerCondition:** `onDayStart`
- **title:** Partnership Offer
- **message:** A platform partner offers cross-promotion in exchange for consistent premium releases. You accept and lock in a long-term collaboration.

---

## NOT IN MVP — Act 3 Only (Vision Definitions)

> These events are **NOT IN MVP** and are introduced during Act 3 (Days 181–270).

- **id:** `act3_brand_legacy_day200`
- **act:** 3
- **triggerDay:** 200
- **triggerCondition:** `onDayStart`
- **title:** Brand Legacy Review
- **message:** Your studio is now a recognizable brand. You commit to a legacy plan that prioritizes long-term reputation and stability.

- **id:** `act3_market_shift_day225`
- **act:** 3
- **triggerDay:** 225
- **triggerCondition:** `onDayStart`
- **title:** Market Shift
- **message:** Audience preferences pivot toward premium experiences. You adjust strategy to defend revenue and protect retention.

- **id:** `act3_mentorship_day245`
- **act:** 3
- **triggerDay:** 245
- **triggerCondition:** `onDayStart`
- **title:** Mentorship and Succession
- **message:** You begin mentoring a successor team to preserve studio standards while scaling output.

- **id:** `act3_exit_strategy_day270`
- **act:** 3
- **triggerDay:** 270
- **triggerCondition:** `onDayStart`
- **title:** Exit Strategy
- **message:** You formalize a long-term exit strategy focused on stability and legacy recognition.
