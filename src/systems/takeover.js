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
    return "Fall";
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
      const added = addTakeoverPerformerToRoster(gameState, performerEntry);
      if (typeof buildTakeoverStoryLogEntry === "function" && typeof addStoryLogEntry === "function") {
        const logEntry = buildTakeoverStoryLogEntry(
          gameState,
          performerEntry.name || "Performer",
          "Auto-acquired: " + (performerEntry.name || "Performer") + " (studio defeat)",
          "auto_acquired_day" + gameState.player.day
        );
        if (logEntry) {
          addStoryLogEntry(gameState, logEntry);
        }
      }
      if (!added) {
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
}
