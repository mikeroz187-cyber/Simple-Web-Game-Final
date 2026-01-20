function checkStoryEvents(gameState) {
  if (!gameState || !gameState.story || !gameState.player) {
    return { ok: false, events: [] };
  }

  const events = [];
  const currentDay = gameState.player.day;

  if (!gameState.story.introShown && currentDay === CONFIG.story.act1.act1_intro_day) {
    gameState.story.introShown = true;
    events.push({ id: CONFIG.story.act1.intro.id, day: currentDay });
  }

  CONFIG.story.act1.act1_debt_reminder_days.forEach(function (day) {
    if (day === currentDay && gameState.story.debtReminderDaysShown.indexOf(day) === -1) {
      gameState.story.debtReminderDaysShown.push(day);
      const reminder = CONFIG.story.act1.debtReminders.find(function (entry) {
        return entry.triggerDay === day;
      });
      events.push({ id: reminder ? reminder.id : "debt_reminder_" + day, day: day });
    }
  });

  if (currentDay === gameState.player.debtDueDay) {
    const endEvent = gameState.player.debtRemaining <= 0
      ? CONFIG.story.act1.endEvents.win
      : CONFIG.story.act1.endEvents.loss;
    events.push({ id: endEvent.id, day: currentDay });
  }

  return { ok: true, events: events };
}

const STORY_EVENT_COPY = {
  act1_intro_day1: {
    title: "Loan Due, Day 90",
    message: "You start with a $5,000 cash loan, but the debt is $10,000 due by Day 90. This is the only debt in the MVP and it must be cleared before the end of Day 90. Keep cash flow tight and prioritize steady revenue early."
  },
  act1_pack01_client_referral_day15: {
    title: "Client Referral Pipeline",
    message: "A satisfied client passes your name along. The booking inbox feels lighter, and your schedule steadies."
  },
  act1_pack01_premium_editing_day25: {
    title: "Premium Editing Standards",
    message: "You tighten post-production standards. The studio’s output feels more deliberate and confident."
  },
  act1_pack01_vendor_discount_day45: {
    title: "Vendor Discount Window",
    message: "A reliable vendor offers a short discount window. You plan the next shoots with less friction."
  },
  act1_pack01_repeat_commissions_day70: {
    title: "Repeat Commissions Roll In",
    message: "Repeat clients begin to return on schedule. The studio’s rhythm starts to feel dependable."
  },
  act1_pack01_final_stretch_day85: {
    title: "Final Stretch Focus",
    message: "With the deadline near, you lock in on steady work. Consistency becomes the only priority."
  },
  act1_debt_reminder_day30: {
    title: "Debt Check — Day 30",
    message: "Thirty days in, the $10,000 debt clock is already ticking. You still have 60 days to close the gap. Keep shoots consistent and avoid unnecessary costs."
  },
  act1_debt_reminder_day60: {
    title: "Debt Check — Day 60",
    message: "Day 60 puts you in the final stretch. The $10,000 debt is due in 30 days, and cash on hand will decide the outcome. Audit your plan and keep revenue predictable."
  },
  act1_debt_reminder_day80: {
    title: "Debt Check — Day 80",
    message: "Ten days left before the Day 90 deadline. If the debt is not covered by then, the game ends. Focus on high-confidence shoots and minimize risk."
  },
  act1_end_win_day90: {
    title: "Debt Cleared",
    message: "You paid the $10,000 debt on time. The studio is stable, and the loan is behind you. You now have a real foundation for long-term growth."
  },
  act1_end_loss_day90: {
    title: "Defaulted on the Debt",
    message: "The $10,000 debt was not paid by Day 90. The lender shuts the studio down, and the run ends here. Use what you learned to plan a tighter start next time."
  }
};

function getStoryEventCopy(eventId) {
  if (!eventId || !STORY_EVENT_COPY[eventId]) {
    return { title: "Story Update", message: "A story event occurred." };
  }
  return STORY_EVENT_COPY[eventId];
}
