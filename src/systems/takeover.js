// See docs/late-game/TAKEOVER_SYSTEM_OVERVIEW.md for the current Industry Takeover behavior.
function getTakeoverConfig() {
  if (CONFIG.takeover && typeof CONFIG.takeover === "object") {
    return CONFIG.takeover;
  }
  return { enabled: false };
}

function checkTakeoverVictory(gameState) {
  if (!gameState || !gameState.player) {
    return;
  }
  if (typeof ensureTakeoverState === "function") {
    ensureTakeoverState(gameState);
  }
  const takeover = gameState.takeover || {};
  const victory = takeover.victory || {};
  if (victory.achieved) {
    return;
  }
  const config = getTakeoverConfig();
  const studioOrder = Array.isArray(config.studioOrder) ? config.studioOrder : [];
  if (!studioOrder.length) {
    return;
  }
  const defeatedCount = studioOrder.filter(function (studioId) {
    return takeover.studios && takeover.studios[studioId] && takeover.studios[studioId].status === "defeated";
  }).length;
  if (defeatedCount === studioOrder.length) {
    victory.achieved = true;
    victory.achievedDay = gameState.player.day;
    takeover.victory = victory;
  }
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

function getActiveTakeoverPerformerId(gameState) {
  if (!gameState) {
    return null;
  }
  if (typeof ensureTakeoverState === "function") {
    ensureTakeoverState(gameState);
  }
  const takeover = gameState.takeover || {};
  return typeof takeover.activePerformerId === "string" ? takeover.activePerformerId : null;
}

function canStartTakeoverAcquisition(gameState, performerId) {
  if (!gameState) {
    return { ok: false, message: "Missing game state." };
  }
  if (typeof ensureTakeoverState === "function") {
    ensureTakeoverState(gameState);
  }
  const takeover = gameState.takeover || {};
  const activeId = typeof takeover.activePerformerId === "string" ? takeover.activePerformerId : null;
  if (activeId && performerId && activeId !== performerId) {
    return { ok: false, message: "You're already working one target. Finish it first." };
  }
  return { ok: true };
}

function setActiveTakeoverPerformerId(gameState, performerId) {
  if (!gameState) {
    return;
  }
  if (typeof ensureTakeoverState === "function") {
    ensureTakeoverState(gameState);
  }
  if (!gameState.takeover || typeof gameState.takeover !== "object") {
    return;
  }
  gameState.takeover.activePerformerId = performerId || null;
}

function clearActiveTakeoverPerformerId(gameState, performerId) {
  if (!gameState) {
    return;
  }
  if (typeof ensureTakeoverState === "function") {
    ensureTakeoverState(gameState);
  }
  if (!gameState.takeover || typeof gameState.takeover !== "object") {
    return;
  }
  const activeId = typeof gameState.takeover.activePerformerId === "string"
    ? gameState.takeover.activePerformerId
    : null;
  if (!performerId || activeId === performerId) {
    gameState.takeover.activePerformerId = null;
  }
}

function getBossConfigForStudio(studioId) {
  const config = getTakeoverConfig();
  if (!studioId || !config.studios || !config.bosses) {
    return null;
  }
  const studio = config.studios[studioId];
  if (!studio || !studio.bossId) {
    return null;
  }
  return config.bosses[studio.bossId] || null;
}

function getBossConfrontationState(gameState, studioId) {
  if (!gameState || !studioId) {
    return null;
  }
  if (typeof ensureTakeoverState === "function") {
    ensureTakeoverState(gameState);
  }
  const takeover = gameState.takeover || {};
  return takeover.studios && takeover.studios[studioId] ? takeover.studios[studioId].bossConfrontation : null;
}

function getAcquiredCountForStudio(gameState, studioId) {
  const config = getTakeoverConfig();
  if (!gameState || !studioId || !config.studios) {
    return 0;
  }
  if (typeof ensureTakeoverState === "function") {
    ensureTakeoverState(gameState);
  }
  const studioConfig = config.studios[studioId] || {};
  const performerIds = Array.isArray(studioConfig.performerIds) ? studioConfig.performerIds : [];
  const performerState = gameState.takeover && gameState.takeover.performers ? gameState.takeover.performers : {};
  return performerIds.filter(function (performerId) {
    return performerState[performerId] && performerState[performerId].status === "acquired";
  }).length;
}

function isBossVulnerable(gameState, studioId) {
  const config = getTakeoverConfig();
  if (!gameState || !studioId || !config.studios) {
    return false;
  }
  if (typeof ensureTakeoverState === "function") {
    ensureTakeoverState(gameState);
  }
  const studioState = gameState.takeover && gameState.takeover.studios ? gameState.takeover.studios[studioId] : null;
  if (!studioState || studioState.status === "defeated") {
    return false;
  }
  const required = Number.isFinite(config.performersToVulnerableBoss)
    ? config.performersToVulnerableBoss
    : 3;
  const acquiredCount = getAcquiredCountForStudio(gameState, studioId);
  return acquiredCount >= required && !studioState.bossConfrontation;
}

function canStartBossConfrontation(gameState, studioId) {
  if (!gameState || !gameState.player) {
    return false;
  }
  const config = getTakeoverConfig();
  if (!isBossVulnerable(gameState, studioId)) {
    return false;
  }
  const bossConfig = config.boss || {};
  const requiredRep = Number.isFinite(bossConfig.requiredReputation)
    ? bossConfig.requiredReputation
    : (config.repRequirements && Number.isFinite(config.repRequirements.boss) ? config.repRequirements.boss : 100);
  const cost = Number.isFinite(bossConfig.cost)
    ? bossConfig.cost
    : (config.costs && Number.isFinite(config.costs.bossConfrontation) ? config.costs.bossConfrontation : 150000);
  const currentRep = Number.isFinite(gameState.player.reputation) ? gameState.player.reputation : 0;
  const currentCash = Number.isFinite(gameState.player.cash) ? gameState.player.cash : 0;
  return currentRep >= requiredRep && currentCash >= cost;
}

function getBossStageLabel(stageKey) {
  if (stageKey === "summons") {
    return "Summons";
  }
  if (stageKey === "negotiation") {
    return "Negotiation";
  }
  if (stageKey === "power_play") {
    return "Power Play";
  }
  if (stageKey === "fall") {
    return "The Fall";
  }
  if (stageKey === "terms") {
    return "Terms";
  }
  return "Stage";
}

function getBossStageImagePaths(studioId, bossId, stageKey, maxSlides) {
  const config = getTakeoverConfig();
  const limit = Number.isFinite(maxSlides) ? Math.max(1, Math.min(5, Math.floor(maxSlides))) : 5;
  const placeholder = config.placeholderPortraitPath || CONFIG.LOCATION_PLACEHOLDER_THUMB_PATH || "";
  if (!studioId || !bossId || !stageKey) {
    return placeholder ? [placeholder] : [];
  }
  const basePath = "assets/images/takeover/" + studioId + "/" + bossId + "/boss_" + stageKey;
  return Array.from({ length: limit }, function (_, index) {
    return basePath + "_" + (index + 1) + ".png";
  });
}

function getBossStageDurationDays() {
  const config = getTakeoverConfig();
  if (config.boss && Number.isFinite(config.boss.daysPerStage)) {
    return config.boss.daysPerStage;
  }
  return Number.isFinite(config.daysPerStage) ? config.daysPerStage : 2;
}

function getBossStagesList() {
  const config = getTakeoverConfig();
  if (config.boss && Array.isArray(config.boss.stages) && config.boss.stages.length) {
    return config.boss.stages.slice();
  }
  return ["summons", "negotiation", "power_play", "fall", "terms"];
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

function getRetaliationConfig() {
  const config = getTakeoverConfig();
  if (config && config.retaliation && typeof config.retaliation === "object") {
    return config.retaliation;
  }
  return {};
}

function scheduleNextPoachDay(gameState) {
  if (!gameState || !gameState.player) {
    return;
  }
  if (typeof ensureTakeoverState === "function") {
    ensureTakeoverState(gameState);
  }
  const retaliation = gameState.takeover && gameState.takeover.retaliation ? gameState.takeover.retaliation : null;
  if (!retaliation) {
    return;
  }
  const retaliationConfig = getRetaliationConfig();
  const minDelay = Number.isFinite(retaliationConfig.minDaysBetweenEvents)
    ? retaliationConfig.minDaysBetweenEvents
    : 7;
  const maxDelay = Number.isFinite(retaliationConfig.maxDaysBetweenEvents)
    ? retaliationConfig.maxDaysBetweenEvents
    : 14;
  const roll = typeof randomIntInclusive === "function" ? randomIntInclusive(minDelay, maxDelay) : minDelay;
  retaliation.nextPoachDay = gameState.player.day + roll;
}

function getActiveRivalStudios(gameState) {
  if (!gameState || !gameState.takeover || !gameState.takeover.studios) {
    return [];
  }
  const config = getTakeoverConfig();
  const studioOrder = Array.isArray(config.studioOrder)
    ? config.studioOrder.slice()
    : Object.keys(gameState.takeover.studios);
  return studioOrder.filter(function (studioId) {
    const studio = gameState.takeover.studios[studioId];
    return studio && studio.status !== "defeated";
  });
}

function getEligiblePoachTargets(gameState) {
  if (!gameState || !gameState.takeover || !gameState.takeover.performers) {
    return [];
  }
  const performers = gameState.takeover.performers;
  const acquired = Object.keys(performers).filter(function (performerId) {
    const performer = performers[performerId];
    if (!performer || performer.status !== "acquired") {
      return false;
    }
    if (typeof isTrophyPerformer === "function" && isTrophyPerformer(gameState, performerId)) {
      return true;
    }
    if (typeof isPerformerInRoster === "function") {
      return isPerformerInRoster(gameState, performerId);
    }
    if (!gameState.roster || !Array.isArray(gameState.roster.performers)) {
      return false;
    }
    return gameState.roster.performers.some(function (entry) {
      return entry && entry.id === performerId;
    });
  });
  if (acquired.length === 0) {
    return [];
  }
  const activeStudios = getActiveRivalStudios(gameState);
  if (!activeStudios.length) {
    return acquired;
  }
  const filtered = acquired.filter(function (performerId) {
    const performer = performers[performerId];
    return performer && performer.studioId && activeStudios.indexOf(performer.studioId) >= 0;
  });
  return filtered.length ? filtered : acquired;
}

function maybeGeneratePoachAttempt(gameState) {
  if (!gameState || !gameState.player) {
    return;
  }
  if (typeof ensureTakeoverState === "function") {
    ensureTakeoverState(gameState);
  }
  if (typeof isTakeoverUnlocked === "function" && !isTakeoverUnlocked(gameState)) {
    return;
  }
  const retaliation = gameState.takeover && gameState.takeover.retaliation ? gameState.takeover.retaliation : null;
  if (!retaliation || retaliation.pending) {
    return;
  }
  if (!Number.isFinite(retaliation.nextPoachDay) || gameState.player.day < retaliation.nextPoachDay) {
    return;
  }
  const activeStudios = getActiveRivalStudios(gameState);
  if (!activeStudios.length) {
    return;
  }
  const eligibleTargets = getEligiblePoachTargets(gameState);
  if (!eligibleTargets.length) {
    return;
  }
  const retaliationConfig = getRetaliationConfig();
  const targetIndex = typeof randomIntInclusive === "function"
    ? randomIntInclusive(0, eligibleTargets.length - 1)
    : 0;
  const targetPerformerId = eligibleTargets[targetIndex];
  const targetState = gameState.takeover.performers[targetPerformerId] || {};
  const rivalPool = activeStudios.filter(function (studioId) {
    return studioId && studioId !== targetState.studioId;
  });
  const studioChoices = rivalPool.length ? rivalPool : activeStudios;
  const rivalIndex = typeof randomIntInclusive === "function"
    ? randomIntInclusive(0, studioChoices.length - 1)
    : 0;
  const rivalStudioId = studioChoices[rivalIndex];
  const defendCost = Number.isFinite(retaliationConfig.poachDefenseCost)
    ? retaliationConfig.poachDefenseCost
    : 25000;
  const repPenaltyOnLoss = Number.isFinite(retaliationConfig.poachRepPenaltyOnLoss)
    ? retaliationConfig.poachRepPenaltyOnLoss
    : -10;
  retaliation.pending = {
    type: "poach_attempt",
    createdDay: gameState.player.day,
    targetPerformerId: targetPerformerId,
    rivalStudioId: rivalStudioId,
    defendCost: defendCost,
    repPenaltyOnLoss: repPenaltyOnLoss,
    repPenaltyOnDefense: 0
  };
  retaliation.totalAttempts = Number.isFinite(retaliation.totalAttempts) ? retaliation.totalAttempts + 1 : 1;
  scheduleNextPoachDay(gameState);
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

function recomputeTakeoverAcquiredCount(gameState) {
  if (!gameState || !gameState.takeover || !gameState.takeover.performers) {
    return 0;
  }
  return Object.keys(gameState.takeover.performers).filter(function (performerId) {
    const performer = gameState.takeover.performers[performerId];
    return performer && performer.status === "acquired";
  }).length;
}

function addTakeoverPerformerToRoster(gameState, performerConfig) {
  if (!gameState || !performerConfig) {
    return false;
  }
  if (!gameState.roster || !Array.isArray(gameState.roster.performers)) {
    gameState.roster = { performers: [] };
  }
  if (typeof isPerformerInRoster === "function" && isPerformerInRoster(gameState, performerConfig.id)) {
    return false;
  }
  const rosterEntry = {
    id: performerConfig.id,
    name: performerConfig.name,
    type: "act2",
    starPower: Number.isFinite(performerConfig.starPower) ? performerConfig.starPower : CONFIG.performers.default_star_power,
    starPowerShoots: 0,
    portraitPath: performerConfig.portraitPath || (CONFIG.takeover && CONFIG.takeover.placeholderPortraitPath) || "",
    fatigue: 0,
    loyalty: CONFIG.performers.starting_loyalty
  };
  gameState.roster.performers.push(rosterEntry);
  if (typeof ensurePerformerManagementForId === "function") {
    ensurePerformerManagementForId(gameState, rosterEntry);
  }
  return true;
}

function removeTakeoverPerformerFromRoster(gameState, performerId) {
  if (!gameState || !gameState.roster || !Array.isArray(gameState.roster.performers)) {
    return false;
  }
  const index = gameState.roster.performers.findIndex(function (entry) {
    return entry && entry.id === performerId;
  });
  if (index < 0) {
    return false;
  }
  gameState.roster.performers.splice(index, 1);
  if (gameState.performerManagement && typeof gameState.performerManagement === "object") {
    const management = gameState.performerManagement;
    if (management.contracts && typeof management.contracts === "object") {
      delete management.contracts[performerId];
    }
    if (management.availability && typeof management.availability === "object") {
      delete management.availability[performerId];
    }
    if (management.retentionFlags && typeof management.retentionFlags === "object") {
      delete management.retentionFlags[performerId];
    }
  }
  return true;
}

function resolvePoachDefense(gameState) {
  if (!gameState || !gameState.player) {
    return { ok: false, message: "Missing player state." };
  }
  if (typeof ensureTakeoverState === "function") {
    ensureTakeoverState(gameState);
  }
  const retaliation = gameState.takeover && gameState.takeover.retaliation ? gameState.takeover.retaliation : null;
  const pending = retaliation && retaliation.pending ? retaliation.pending : null;
  if (!pending || pending.type !== "poach_attempt") {
    return { ok: false, message: "No poach attempt to resolve." };
  }
  const defendCost = Number.isFinite(pending.defendCost) ? pending.defendCost : 0;
  if (gameState.player.cash < defendCost) {
    return { ok: false, message: "Not enough cash to defend." };
  }
  gameState.player.cash = Math.max(0, gameState.player.cash - defendCost);
  retaliation.totalDefenses = Number.isFinite(retaliation.totalDefenses) ? retaliation.totalDefenses + 1 : 1;
  retaliation.lastResolvedDay = gameState.player.day;
  retaliation.pending = null;
  if (!Number.isFinite(retaliation.nextPoachDay)) {
    scheduleNextPoachDay(gameState);
  }
  const performerConfig = getTakeoverPerformerConfig(pending.targetPerformerId) || {};
  if (typeof buildTakeoverStoryLogEntry === "function" && typeof addStoryLogEntry === "function") {
    const performerName = performerConfig.name || "Performer";
    const logEntry = buildTakeoverStoryLogEntry(
      gameState,
      performerName,
      "Poach attempt blocked — you paid to keep " + performerName + ".",
      "poach_defended_day" + gameState.player.day
    );
    if (logEntry) {
      addStoryLogEntry(gameState, logEntry);
    }
  }
  if (gameState.takeover && gameState.takeover.stats) {
    gameState.takeover.stats.poachAttemptsDefended = Number.isFinite(gameState.takeover.stats.poachAttemptsDefended)
      ? gameState.takeover.stats.poachAttemptsDefended + 1
      : 1;
  }
  return { ok: true };
}

function resolvePoachLoss(gameState) {
  if (!gameState || !gameState.player) {
    return { ok: false, message: "Missing player state." };
  }
  if (typeof ensureTakeoverState === "function") {
    ensureTakeoverState(gameState);
  }
  const retaliation = gameState.takeover && gameState.takeover.retaliation ? gameState.takeover.retaliation : null;
  const pending = retaliation && retaliation.pending ? retaliation.pending : null;
  if (!pending || pending.type !== "poach_attempt") {
    return { ok: false, message: "No poach attempt to resolve." };
  }
  const performerId = pending.targetPerformerId;
  const repPenalty = Number.isFinite(pending.repPenaltyOnLoss) ? pending.repPenaltyOnLoss : -10;
  if (typeof applyTakeoverReputationDelta === "function") {
    applyTakeoverReputationDelta(gameState, repPenalty);
  }
  retaliation.totalLosses = Number.isFinite(retaliation.totalLosses) ? retaliation.totalLosses + 1 : 1;
  retaliation.lastResolvedDay = gameState.player.day;
  retaliation.pending = null;
  if (!Number.isFinite(retaliation.nextPoachDay)) {
    scheduleNextPoachDay(gameState);
  }
  const retaliationConfig = getRetaliationConfig();
  const cooldownDays = Number.isFinite(retaliationConfig.lostCooldownDays)
    ? retaliationConfig.lostCooldownDays
    : 14;
  const performerState = getTakeoverPerformerState(gameState, performerId);
  if (performerState) {
    performerState.status = "lost";
    performerState.currentStage = null;
    performerState.stageStartDay = null;
    performerState.stageCompleteDay = null;
    performerState.stageReady = false;
    performerState.nextAvailableDay = gameState.player.day + cooldownDays;
    performerState.lastOutcome = "poached";
    performerState.lockReason = null;
  }
  if (typeof removeTrophyPerformer === "function") {
    removeTrophyPerformer(gameState, performerId);
  }
  removeTakeoverPerformerFromRoster(gameState, performerId);
  const performerConfig = getTakeoverPerformerConfig(performerId) || {};
  if (typeof buildTakeoverStoryLogEntry === "function" && typeof addStoryLogEntry === "function") {
    const performerName = performerConfig.name || "Performer";
    const logEntry = buildTakeoverStoryLogEntry(
      gameState,
      performerName,
      "Poached — " + performerName + " walked. Rival blood is coming.",
      "poach_loss_day" + gameState.player.day
    );
    if (logEntry) {
      addStoryLogEntry(gameState, logEntry);
    }
  }
  if (gameState.takeover && gameState.takeover.stats) {
    gameState.takeover.stats.poachAttemptsLost = Number.isFinite(gameState.takeover.stats.poachAttemptsLost)
      ? gameState.takeover.stats.poachAttemptsLost + 1
      : 1;
    gameState.takeover.stats.performersLost = Number.isFinite(gameState.takeover.stats.performersLost)
      ? gameState.takeover.stats.performersLost + 1
      : 1;
  }
  return { ok: true, performerId: performerId };
}

function defeatStudioBoss(gameState, studioId) {
  if (!gameState || !gameState.player || !studioId) {
    return;
  }
  if (typeof ensureTakeoverState === "function") {
    ensureTakeoverState(gameState);
  }
  const config = getTakeoverConfig();
  const studioConfig = config.studios && config.studios[studioId] ? config.studios[studioId] : null;
  if (!studioConfig) {
    return;
  }
  const studioState = gameState.takeover.studios[studioId];
  studioState.status = "defeated";
  studioState.defeatedDay = gameState.player.day;
  if (studioState.bossConfrontation && typeof studioState.bossConfrontation === "object") {
    studioState.bossConfrontation.status = "defeated";
    studioState.bossConfrontation.stageReady = false;
  }
  const bossId = studioConfig.bossId || null;
  if (bossId) {
    if (!gameState.takeover.gallery) {
      gameState.takeover.gallery = { bosses: {}, trophies: {}, notes: [] };
    }
    if (!gameState.takeover.gallery.bosses || typeof gameState.takeover.gallery.bosses !== "object") {
      gameState.takeover.gallery.bosses = {};
    }
    gameState.takeover.gallery.bosses[bossId] = { defeatedDay: gameState.player.day, studioId: studioId };
  }
  if (!gameState.takeover.gallery) {
    gameState.takeover.gallery = { bosses: {}, trophies: {}, notes: [] };
  }
  if (!gameState.takeover.gallery.trophies || typeof gameState.takeover.gallery.trophies !== "object") {
    gameState.takeover.gallery.trophies = {};
  }
  gameState.takeover.gallery.trophies[studioId] = {
    unlockedDay: gameState.player.day,
    bonus: studioConfig.bonusOnDefeat || null
  };

  const performerConfig = config.performers && typeof config.performers === "object" ? config.performers : {};
  const performerIds = Array.isArray(studioConfig.performerIds) ? studioConfig.performerIds : [];
  performerIds.forEach(function (performerId) {
    const performerState = gameState.takeover.performers[performerId];
    if (!performerState || performerState.status === "acquired") {
      return;
    }
    performerState.status = "acquired";
    performerState.currentStage = null;
    performerState.stageStartDay = null;
    performerState.stageCompleteDay = null;
    performerState.stageReady = false;
    performerState.lastOutcome = "auto_acquired";
    performerState.lockReason = null;
    const performerEntry = performerConfig[performerId];
    if (performerEntry) {
      const added = typeof addTrophyPerformer === "function"
        ? addTrophyPerformer(gameState, performerEntry.id)
        : { ok: true };
      if (typeof buildTakeoverStoryLogEntry === "function" && typeof addStoryLogEntry === "function") {
        const logEntry = buildTakeoverStoryLogEntry(
          gameState,
          performerEntry.name || "Performer",
          "Auto-acquired: " + (performerEntry.name || "Performer") + " (trophy secured)",
          "auto_acquired_day" + gameState.player.day
        );
        if (logEntry) {
          addStoryLogEntry(gameState, logEntry);
        }
      }
      if (added && added.ok === false) {
        return;
      }
    }
  });

  const repReward = config.boss && Number.isFinite(config.boss.repRewardOnDefeat)
    ? config.boss.repRewardOnDefeat
    : (config.repChanges && Number.isFinite(config.repChanges.bossDefeated) ? config.repChanges.bossDefeated : 25);
  if (typeof applyTakeoverReputationDelta === "function") {
    applyTakeoverReputationDelta(gameState, repReward);
  }
  if (gameState.takeover && gameState.takeover.stats) {
    gameState.takeover.stats.studiosDefeated = Number.isFinite(gameState.takeover.stats.studiosDefeated)
      ? gameState.takeover.stats.studiosDefeated + 1
      : 1;
    gameState.takeover.stats.bossesDefeated = Number.isFinite(gameState.takeover.stats.bossesDefeated)
      ? gameState.takeover.stats.bossesDefeated + 1
      : 1;
    gameState.takeover.stats.performersAcquired = recomputeTakeoverAcquiredCount(gameState);
  }
  checkTakeoverVictory(gameState);
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
  const studios = takeover.studios || {};
  Object.keys(studios).forEach(function (studioId) {
    const studio = studios[studioId];
    if (!studio || studio.status === "defeated") {
      return;
    }
    const confrontation = studio.bossConfrontation;
    if (!confrontation || confrontation.status !== "in_progress") {
      return;
    }
    if (Number.isFinite(confrontation.stageCompleteDay) && gameState.player.day >= confrontation.stageCompleteDay) {
      confrontation.stageReady = true;
    }
  });
  recomputeTakeoverAvailability(gameState);
  checkTakeoverVictory(gameState);
  maybeGeneratePoachAttempt(gameState);
}
