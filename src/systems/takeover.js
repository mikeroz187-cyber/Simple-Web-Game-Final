function getTakeoverConfig() {
  if (CONFIG.takeover && typeof CONFIG.takeover === "object") {
    return CONFIG.takeover;
  }
  return { enabled: false };
}

function isTakeoverUnlocked(gameState) {
  const config = getTakeoverConfig();
  if (!config.enabled) {
    return false;
  }
  const unlockDay = Number.isFinite(config.unlockDay) ? config.unlockDay : null;
  const currentDay = gameState && gameState.player && Number.isFinite(gameState.player.day)
    ? gameState.player.day
    : null;
  if (unlockDay === null || currentDay === null) {
    return false;
  }
  return currentDay >= unlockDay;
}

function getTakeoverRosterCapOverride(gameState) {
  if (!isTakeoverUnlocked(gameState)) {
    return null;
  }
  const config = getTakeoverConfig();
  const rosterCapAfterUnlock = Number.isFinite(config.rosterCapAfterUnlock)
    ? config.rosterCapAfterUnlock
    : 40;
  return rosterCapAfterUnlock;
}
