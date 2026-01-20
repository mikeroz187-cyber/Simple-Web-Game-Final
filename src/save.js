function saveGame() {
  console.warn("saveGame() is not implemented yet.");
  return { ok: false, code: "not_implemented", message: "Save not implemented." };
}

function normalizeStoryState(rawStory, player) {
  const safeStory = {
    introShown: false,
    debtReminderDaysShown: []
  };
  const debtDueDay = player && Number.isFinite(player.debtDueDay)
    ? player.debtDueDay
    : CONFIG.game.debt_due_day;

  if (rawStory && typeof rawStory.introShown === "boolean") {
    safeStory.introShown = rawStory.introShown;
  }

  if (rawStory && Array.isArray(rawStory.debtReminderDaysShown)) {
    const seenDays = new Set();
    rawStory.debtReminderDaysShown.forEach(function (day) {
      if (Number.isInteger(day) && day < debtDueDay && !seenDays.has(day)) {
        seenDays.add(day);
      }
    });
    safeStory.debtReminderDaysShown = Array.from(seenDays);
  }

  return safeStory;
}

function loadGame() {
  console.warn("loadGame() is not implemented yet.");
  return { ok: false, code: "not_implemented", message: "Load not implemented." };
}

function resetSave() {
  console.warn("resetSave() is not implemented yet.");
  return { ok: false, code: "not_implemented", message: "Reset not implemented." };
}

function exportSaveToFile() {
  console.warn("exportSaveToFile() is not implemented yet.");
  return { ok: false, code: "not_implemented", message: "Export not implemented." };
}

function importSaveFromFile() {
  console.warn("importSaveFromFile() is not implemented yet.");
  return { ok: false, code: "not_implemented", message: "Import not implemented." };
}
