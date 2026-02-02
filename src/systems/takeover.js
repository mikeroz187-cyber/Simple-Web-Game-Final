function getTakeoverConfig() {
  if (CONFIG.takeover && typeof CONFIG.takeover === "object") {
    return CONFIG.takeover;
  }
  return { enabled: false };
}

function normalizeTakeoverTier(tierValue) {
  if (typeof tierValue === "string") {
    return tierValue;
  }
  if (Number.isFinite(tierValue)) {
    if (tierValue >= 3) {
      return "tier3";
    }
    if (tierValue >= 2) {
      return "tier2";
    }
    return "tier1";
  }
  return "tier1";
}

function normalizeWeaknessType(value) {
  if (typeof value !== "string") {
    return "ambition";
  }
  return value.toLowerCase();
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

function getTakeoverPerformerConfig(performerId) {
  const config = getTakeoverConfig();
  if (!config.performers || typeof config.performers !== "object") {
    return null;
  }
  return config.performers[performerId] || null;
}

function getTakeoverStudioConfig(studioId) {
  const config = getTakeoverConfig();
  if (!config.studios || typeof config.studios !== "object") {
    return null;
  }
  return config.studios[studioId] || null;
}

function getTakeoverPerformerState(gameState, performerId) {
  if (!gameState || !performerId) {
    return null;
  }
  if (typeof ensureTakeoverState === "function") {
    ensureTakeoverState(gameState);
  }
  const takeover = gameState.takeover || {};
  return takeover.performers && takeover.performers[performerId] ? takeover.performers[performerId] : null;
}

function getPerformerRepRequirement(tier) {
  const config = getTakeoverConfig();
  const repRequirements = config.repRequirements || {};
  const tierId = normalizeTakeoverTier(tier);
  if (tierId === "tier3") {
    return Number.isFinite(repRequirements.tier3) ? repRequirements.tier3 : 75;
  }
  if (tierId === "tier2") {
    return Number.isFinite(repRequirements.tier2) ? repRequirements.tier2 : 50;
  }
  return Number.isFinite(repRequirements.tier1) ? repRequirements.tier1 : 30;
}

function getStageCost(stage, tier) {
  const config = getTakeoverConfig();
  const baseCosts = config.costs || {};
  const multipliers = config.tierMultipliers || {};
  const tierId = normalizeTakeoverTier(tier);
  const base = Number.isFinite(baseCosts[stage]) ? baseCosts[stage] : 0;
  const multiplier = Number.isFinite(multipliers[tierId]) ? multipliers[tierId] : 1;
  return Math.round(base * multiplier);
}

function getStageDurationDays() {
  const config = getTakeoverConfig();
  return Number.isFinite(config.daysPerStage) ? config.daysPerStage : 2;
}

function getTakeoverStageImagePaths(performerId, stage, maxSlides) {
  const config = getTakeoverConfig();
  const performer = getTakeoverPerformerConfig(performerId);
  const stageKey = typeof stage === "string" ? stage.toLowerCase() : "intel";
  const limit = Number.isFinite(maxSlides) ? Math.max(1, Math.min(5, Math.floor(maxSlides))) : 5;
  if (!performer) {
    const placeholder = config.placeholderPortraitPath || CONFIG.LOCATION_PLACEHOLDER_THUMB_PATH || "";
    return placeholder ? [placeholder] : [];
  }
  const basePath = performer.stageImageBasePath ||
    ("assets/images/takeover/" + performer.studioId + "/" + performer.id);
  return Array.from({ length: limit }, function (_, index) {
    return basePath + "/" + stageKey + "_" + (index + 1) + ".png";
  });
}

function clampReputationGlobal(gameState) {
  if (!gameState || !gameState.player) {
    return;
  }
  if (!Number.isFinite(gameState.player.reputation)) {
    gameState.player.reputation = 0;
  }
  if (gameState.player.reputation > 100) {
    gameState.player.reputation = 100;
  }
  if (gameState.player.reputation < 0) {
    gameState.player.reputation = 0;
  }
}

function applyTakeoverReputationDelta(gameState, delta) {
  if (!gameState || !gameState.player) {
    return 0;
  }
  const config = getTakeoverConfig();
  const crisisFloor = config.repDefense && Number.isFinite(config.repDefense.crisis)
    ? config.repDefense.crisis
    : 10;
  if (!Number.isFinite(gameState.player.reputation)) {
    gameState.player.reputation = 0;
  }
  const nextValue = gameState.player.reputation + (Number.isFinite(delta) ? delta : 0);
  gameState.player.reputation = nextValue;
  clampReputationGlobal(gameState);
  if (Number.isFinite(delta) && delta < 0 && gameState.player.reputation < crisisFloor) {
    gameState.player.reputation = crisisFloor;
  }
  return gameState.player.reputation;
}

function recomputeTakeoverAvailability(gameState) {
  if (!gameState || !gameState.player) {
    return;
  }
  if (typeof ensureTakeoverState === "function") {
    ensureTakeoverState(gameState);
  }
  const config = getTakeoverConfig();
  const performerConfig = config.performers && typeof config.performers === "object" ? config.performers : {};
  const currentDay = gameState.player.day;
  const currentRep = Number.isFinite(gameState.player.reputation) ? gameState.player.reputation : 0;
  Object.keys(performerConfig).forEach(function (performerId) {
    const performerState = getTakeoverPerformerState(gameState, performerId);
    if (!performerState) {
      return;
    }
    if (performerState.status === "acquired" || performerState.status === "lost" || performerState.status === "in_progress") {
      return;
    }
    const repRequirement = getPerformerRepRequirement(performerState.tier);
    if (Number.isFinite(performerState.nextAvailableDay) && currentDay < performerState.nextAvailableDay) {
      performerState.status = "locked";
      performerState.lockReason = "cooldown";
      return;
    }
    if (currentRep < repRequirement) {
      performerState.status = "locked";
      performerState.lockReason = "rep";
      return;
    }
    performerState.status = "available";
    performerState.lockReason = null;
  });
}

function takeoverOnDayAdvanced(gameState) {
  if (!gameState || !gameState.player) {
    return;
  }
  if (typeof ensureTakeoverState === "function") {
    ensureTakeoverState(gameState);
  }
  const takeover = gameState.takeover || {};
  const performers = takeover.performers || {};
  Object.keys(performers).forEach(function (performerId) {
    const performer = performers[performerId];
    if (!performer || performer.status !== "in_progress") {
      return;
    }
    if (Number.isFinite(performer.stageCompleteDay) && gameState.player.day >= performer.stageCompleteDay) {
      performer.stageReady = true;
    }
  });
  recomputeTakeoverAvailability(gameState);
}
