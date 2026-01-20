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
