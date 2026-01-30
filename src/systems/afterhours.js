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

  var minDay = CONFIG.afterHours.minDayForKnock || 10;
  if (gameState.player.day < minDay) return null;

  var eligible = getAfterHoursEligiblePerformers(gameState);
  if (eligible.length === 0) return null;

  var chance = CONFIG.afterHours.knockChancePerEligible || 0.12;

  if (Math.random() >= chance) return null;

  var index = Math.floor(Math.random() * eligible.length);
  return eligible[index];
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

function getAfterHoursOneTimeFee(performerId) {
  var fees = CONFIG.afterHours.oneTimeFeesByPerformerId || {};
  var defaultFee = CONFIG.afterHours.defaultOneTimeFee;
  if (Number.isFinite(fees[performerId])) {
    return fees[performerId];
  }
  if (Number.isFinite(defaultFee)) {
    return defaultFee;
  }
  return 0;
}

function canAffordAfterHours(gameState, fee) {
  if (!gameState || !gameState.player) {
    return false;
  }
  var cash = Number.isFinite(gameState.player.cash) ? gameState.player.cash : 0;
  var safeFee = Number.isFinite(fee) ? fee : 0;
  return cash >= safeFee;
}

function applyAfterHoursPayment(gameState, performerId) {
  if (!gameState || !gameState.player) {
    return { ok: false, feePaid: 0 };
  }
  var fee = getAfterHoursOneTimeFee(performerId);
  if (!Number.isFinite(fee) || fee < 0) {
    fee = 0;
  }
  if (!canAffordAfterHours(gameState, fee)) {
    return { ok: false, feePaid: 0 };
  }
  var cash = Number.isFinite(gameState.player.cash) ? gameState.player.cash : 0;
  gameState.player.cash = Math.max(0, cash - fee);
  return { ok: true, feePaid: fee };
}

function applyAfterHoursDeclinePenalty(gameState, performerId) {
  ensureAfterHoursState(gameState);

  var performer = gameState.roster.performers.find(function (p) {
    return p.id === performerId;
  });
  if (!performer) {
    return { ok: false, loyaltyDelta: 0, cooldownUntilDay: null };
  }

  var penalty = Number.isFinite(CONFIG.afterHours.declineLoyaltyPenalty)
    ? CONFIG.afterHours.declineLoyaltyPenalty
    : 0;

  if (!Number.isFinite(performer.loyalty)) {
    performer.loyalty = CONFIG.performers.starting_loyalty;
  }

  var nextLoyalty = performer.loyalty - penalty;
  if (typeof clampLoyalty === "function") {
    performer.loyalty = clampLoyalty(nextLoyalty);
  } else {
    performer.loyalty = Math.min(100, Math.max(0, nextLoyalty));
  }

  var cooldownDays = Number.isFinite(CONFIG.afterHours.declineCooldownDays)
    ? CONFIG.afterHours.declineCooldownDays
    : 0;
  var currentDay = Number.isFinite(gameState.player.day) ? gameState.player.day : 0;
  var cooldownUntilDay = currentDay + cooldownDays;
  gameState.afterHours.cooldowns[performerId] = cooldownUntilDay;

  return { ok: true, loyaltyDelta: -penalty, cooldownUntilDay: cooldownUntilDay };
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
