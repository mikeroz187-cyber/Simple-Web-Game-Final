// After Hours System - Phase 1-2

function ensureAfterHoursState(gameState) {
  if (!gameState.afterHours || typeof gameState.afterHours !== "object") {
    gameState.afterHours = {
      completed: {},
      cooldowns: {},
      recruitedBy: {},
      unlockedPacks: []
    };
  }
  if (!gameState.afterHours.completed) gameState.afterHours.completed = {};
  if (!gameState.afterHours.cooldowns) gameState.afterHours.cooldowns = {};
  if (!gameState.afterHours.recruitedBy) gameState.afterHours.recruitedBy = {};
  if (!gameState.afterHours.unlockedPacks) gameState.afterHours.unlockedPacks = [];
}

function isAfterHoursEnabled() {
  return CONFIG.afterHours && CONFIG.afterHours.enabled === true;
}

function getAfterHoursEligiblePerformers(gameState) {
  if (!isAfterHoursEnabled()) return [];
  ensureAfterHoursState(gameState);

  var currentDay = gameState.player.day;
  var roster = gameState.roster && Array.isArray(gameState.roster.performers)
    ? gameState.roster.performers
    : [];

  var eligible = [];

  roster.forEach(function (performer) {
    var id = performer.id;

    if (gameState.afterHours.completed[id] === true) return;

    var cooldownDay = gameState.afterHours.cooldowns[id];
    if (Number.isFinite(cooldownDay) && currentDay < cooldownDay) return;

    eligible.push(performer);
  });

  return eligible;
}

function rollForKnock(gameState) {
  if (!isAfterHoursEnabled()) return null;

  var eligible = getAfterHoursEligiblePerformers(gameState);
  if (eligible.length === 0) return null;

  var chance = CONFIG.afterHours.knockChancePerEligible || 0.3;

  var knockers = eligible.filter(function () {
    return Math.random() < chance;
  });

  if (knockers.length === 0) return null;

  var index = Math.floor(Math.random() * knockers.length);
  return knockers[index];
}

function getPerformerFolderName(performer) {
  var name = performer.name || performer.id;
  return name.toLowerCase().replace(/\s+/g, "_");
}

function getAfterHoursImagePaths(performer) {
  var basePath = CONFIG.afterHours.imagePaths.encountersBase;
  var folder = getPerformerFolderName(performer);
  var displayName = performer.name || "Unknown";
  var filePrefix = displayName.replace(/\s+/g, "_");

  var paths = [];
  for (var i = 1; i <= 10; i++) {
    var num = i < 10 ? "0" + i : "" + i;
    paths.push(basePath + folder + "/" + filePrefix + "_" + num + ".png");
  }
  return paths;
}

function canAcceptCounterOffer(gameState, counterType) {
  var rep = gameState.player.reputation || 0;

  if (counterType === "star") {
    return rep >= (CONFIG.afterHours.starBonusReputationRequired || 50);
  }
  if (counterType === "recruit") {
    return rep >= (CONFIG.afterHours.recruitHelpReputationRequired || 100);
  }
  return false;
}

function getRecruitUnlockForPerformer(performerId) {
  var mapping = CONFIG.afterHours.recruitMapping || {};
  return mapping[performerId] || null;
}

function applyAfterHoursOutcome(gameState, performerId, counterType) {
  ensureAfterHoursState(gameState);

  var performer = gameState.roster.performers.find(function (p) {
    return p.id === performerId;
  });

  if (!performer) return { ok: false, message: "Performer not found." };

  gameState.afterHours.completed[performerId] = true;

  var bonusApplied = null;
  if (counterType === "star") {
    performer.starPower = Math.min(6, (performer.starPower || 1) + 1);
    bonusApplied = "Star Rating +1";
  } else if (counterType === "recruit") {
    var recruitId = getRecruitUnlockForPerformer(performerId);
    if (recruitId) {
      gameState.afterHours.recruitedBy[recruitId] = performerId;
      bonusApplied = "Unlocked recruit: " + recruitId;
    }
  }

  var imagePaths = getAfterHoursImagePaths(performer);
  gameState.afterHours.unlockedPacks.push({
    packId: "afterhours_" + performerId,
    performerId: performerId,
    title: "After Hours: " + performer.name,
    imagePaths: imagePaths,
    unlockedDay: gameState.player.day
  });

  return {
    ok: true,
    bonusApplied: bonusApplied,
    imagePaths: imagePaths
  };
}

function applyAfterHoursCooldown(gameState, performerId) {
  ensureAfterHoursState(gameState);
  var cooldownDays = CONFIG.afterHours.cooldownDays || 7;
  gameState.afterHours.cooldowns[performerId] = gameState.player.day + cooldownDays;
}

function getAfterHoursRefusalMessage() {
  return "\"You're not important enough to make demands like that. Come back when you've made a name for yourself.\"";
}
