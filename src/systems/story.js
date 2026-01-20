function checkStoryEvents(gameState) {
  if (!gameState || !gameState.player || !gameState.story) {
    return { ok: false, code: "invalid_state", message: "Missing game state data." };
  }

  const act1Config = CONFIG.story.act1;
  const currentDay = gameState.player.day;

  if (!gameState.story.introShown && currentDay >= act1Config.intro.triggerDay) {
    return { ok: true, eventId: act1Config.intro.id, type: "intro" };
  }

  const reminder = act1Config.debtReminders.find(function (entry) {
    const alreadyShown = gameState.story.debtReminderDaysShown.includes(entry.triggerDay);
    return currentDay >= entry.triggerDay && !alreadyShown;
  });

  if (reminder) {
    return {
      ok: true,
      eventId: reminder.id,
      type: "debt_reminder",
      triggerDay: reminder.triggerDay
    };
  }

  return { ok: false, code: "no_event", message: "No story event triggered." };
}
