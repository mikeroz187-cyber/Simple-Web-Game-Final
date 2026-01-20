function isPerformerAvailable(performer) {
  if (!performer) {
    return false;
  }
  return performer.fatigue < CONFIG.performers.max_fatigue;
}

function applyShootFatigue(performer) {
  if (!performer) {
    return;
  }
  performer.fatigue = Math.min(
    CONFIG.performers.max_fatigue,
    performer.fatigue + CONFIG.performers.fatigue_per_shoot
  );
}

function recoverPerformerFatigue(performer) {
  if (!performer) {
    return;
  }
  performer.fatigue = Math.max(
    0,
    performer.fatigue - CONFIG.performers.fatigue_recovery_per_day
  );
}

function recoverAllPerformers(gameState) {
  if (!gameState || !gameState.roster) {
    return;
  }
  gameState.roster.performers.forEach(function (performer) {
    recoverPerformerFatigue(performer);
  });
}

function updatePerformerStats(gameState, performerId) {
  if (!gameState || !performerId) {
    return { ok: false, message: "Missing performer selection." };
  }
  const performer = gameState.roster.performers.find(function (entry) {
    return entry.id === performerId;
  });

  if (!performer) {
    return { ok: false, message: "Performer not found." };
  }

  applyShootFatigue(performer);
  return { ok: true };
}
