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

## NOT IN MVP — Act 2 Only (Vision Placeholder Events)

> These events are **NOT IN MVP** and exist only as placeholders for Act 2 expansion.

- **id:** `act2_expansion_plan_tbd`
- **act:** 2
- **triggerDay:** TBD
- **triggerCondition:** `TBD`
- **title:** Expansion Plan Drafted
- **message:** With the debt cleared, the studio can scale beyond survival. You outline a formal expansion plan focused on steady revenue and brand reliability. Execution details will be defined in Act 2.

- **id:** `act2_staffing_push_tbd`
- **act:** 2
- **triggerDay:** TBD
- **triggerCondition:** `TBD`
- **title:** Staffing Push
- **message:** Demand is rising, and capacity is a bottleneck. You consider structured hiring or contracting to keep bookings consistent. Staffing targets and timing will be finalized in Act 2.

- **id:** `act2_studio_upgrade_tbd`
- **act:** 2
- **triggerDay:** TBD
- **triggerCondition:** `TBD`
- **title:** Studio Upgrade Decision
- **message:** Equipment and space limitations start to affect output quality. You review upgrade options and cost trade-offs. The exact upgrade path is still to be confirmed.

- **id:** `act2_partnership_offer_tbd`
- **act:** 2
- **triggerDay:** TBD
- **triggerCondition:** `TBD`
- **title:** Partnership Offer
- **message:** A potential partner offers cross-promotion and access to new clients. The proposal could accelerate growth, but requires clear deliverables. Partner terms will be defined in Act 2.

---

## NOT IN MVP — Act 3 Only (Vision Placeholder Events)

> These events are **NOT IN MVP** and exist only as placeholders for Act 3 late-game arc.

- **id:** `act3_brand_legacy_tbd`
- **act:** 3
- **triggerDay:** TBD
- **triggerCondition:** `TBD`
- **title:** Brand Legacy Review
- **message:** The studio has a long track record and a recognizable brand. You evaluate what legacy means for the business and its long-term direction. Final outcomes will be defined in Act 3.

- **id:** `act3_market_shift_tbd`
- **act:** 3
- **triggerDay:** TBD
- **triggerCondition:** `TBD`
- **title:** Market Shift
- **message:** Industry expectations shift, changing what clients prioritize. You assess whether to adapt the studio strategy or double down on what already works. The exact market event is still TBD.

- **id:** `act3_mentorship_tbd`
- **act:** 3
- **triggerDay:** TBD
- **triggerCondition:** `TBD`
- **title:** Mentorship and Succession
- **message:** You consider how to pass on the studio’s standards and operations. Mentoring others could protect the brand beyond your direct involvement. Succession details will be defined in Act 3.

- **id:** `act3_exit_strategy_tbd`
- **act:** 3
- **triggerDay:** TBD
- **triggerCondition:** `TBD`
- **title:** Exit Strategy
- **message:** A clear exit plan becomes a strategic priority. You outline options for continuing, selling, or restructuring the studio. Final triggers and outcomes are TBD.
