function advanceDay(gameState) {
  gameState.player.shootsToday = 0;
  gameState.player.agencyPackUsedToday = false;
  gameState.player.day += 1;
  recoverAllPerformers(gameState);
  advancePerformerManagementDay(gameState);
  const subs = Number.isFinite(gameState.player.onlyFansSubscribers)
    ? gameState.player.onlyFansSubscribers
    : 0;
  const dailyPayout = typeof getDailyOfPayout === "function" ? getDailyOfPayout(gameState) : 0;
  if (dailyPayout > 0) {
    gameState.player.cash = Math.max(0, gameState.player.cash + dailyPayout);
  }
  const overheadResult = typeof getDailyOverhead === "function"
    ? getDailyOverhead(gameState)
    : { amount: 0, label: null };
  const overheadAmount = Number.isFinite(overheadResult.amount) ? overheadResult.amount : 0;
  if (overheadAmount > 0) {
    gameState.player.cash = Math.max(0, gameState.player.cash - overheadAmount);
  }
  recordAnalyticsSnapshot(gameState);
  maybeApplyWeeklyCompetitionCheck(gameState, gameState.player.day);
  const unlockResult = typeof applyScheduledUnlocks === "function"
    ? applyScheduledUnlocks(gameState)
    : { events: [] };
  const storyResult = checkStoryEvents(gameState);
  const recruitResult = typeof getNewRecruitNotificationEvents === "function"
    ? getNewRecruitNotificationEvents(gameState)
    : [];
  const unlockEvents = unlockResult && Array.isArray(unlockResult.events) ? unlockResult.events : [];
  const storyEvents = storyResult && Array.isArray(storyResult.events) ? storyResult.events : [];
  const recruitEvents = Array.isArray(recruitResult) ? recruitResult : [];
  return {
    storyEvents: unlockEvents.concat(recruitEvents).concat(storyEvents),
    cashflow: {
      subs: subs,
      payout: dailyPayout,
      overheadAmount: overheadAmount,
      overheadLabel: overheadResult.label || null
    }
  };
}

function getBookingComboConfig() {
  if (CONFIG.booking && CONFIG.booking.combo && typeof CONFIG.booking.combo === "object") {
    return CONFIG.booking.combo;
  }
  return { enabled: false };
}

function getContentVarianceConfig() {
  if (CONFIG.content && CONFIG.content.variance && typeof CONFIG.content.variance === "object") {
    return CONFIG.content.variance;
  }
  return { enabled: false };
}

function getAgencyPackConfig() {
  if (CONFIG.agencyPacks && typeof CONFIG.agencyPacks === "object") {
    return CONFIG.agencyPacks;
  }
  return { enabled: false };
}

function getShootPhotoConfig() {
  if (CONFIG.shootPhotos && typeof CONFIG.shootPhotos === "object") {
    return CONFIG.shootPhotos;
  }
  return { count: 0, placeholderPath: CONFIG.SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH };
}

function buildShootPhotoPaths() {
  const config = getShootPhotoConfig();
  const count = Number.isFinite(config.count) ? Math.max(0, Math.floor(config.count)) : 0;
  const placeholderPath = config.placeholderPath || CONFIG.SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH;
  return Array.from({ length: count }, function () {
    return placeholderPath;
  });
}

function isAgencyPackSelection(selection) {
  if (!selection) {
    return false;
  }
  return selection.bookingMode === "agency_pack";
}

function getAgencyPackStarPower() {
  const coreIds = Array.isArray(CONFIG.performers.core_ids) ? CONFIG.performers.core_ids : [];
  const starPowers = coreIds.map(function (performerId) {
    const performer = CONFIG.performers.catalog[performerId];
    return performer ? performer.starPower : null;
  }).filter(function (value) {
    return Number.isFinite(value);
  });
  if (!starPowers.length) {
    return Number.isFinite(CONFIG.performers.default_star_power) ? CONFIG.performers.default_star_power : 1;
  }
  const total = starPowers.reduce(function (sum, value) {
    return sum + value;
  }, 0);
  return Math.max(1, Math.round(total / starPowers.length));
}

function buildAgencyPackPerformer() {
  return {
    id: "agency_pack",
    name: "Agency Sample Pack",
    type: "agency_pack",
    starPower: getAgencyPackStarPower(),
    fatigue: 0,
    loyalty: 0
  };
}

function getReputationOfSubsMultiplier(gameState) {
  if (typeof getSelectedReputationBranch !== "function") {
    return 1;
  }
  const branch = getSelectedReputationBranch(gameState);
  if (!branch) {
    return 1;
  }
  return Number.isFinite(branch.ofSubsMult) ? branch.ofSubsMult : 1;
}

function getMarketSaturationConfig() {
  if (CONFIG.market && CONFIG.market.saturation && typeof CONFIG.market.saturation === "object") {
    return CONFIG.market.saturation;
  }
  return null;
}

function getSocialFootprintConfig() {
  if (CONFIG.market && CONFIG.market.socialFootprintBonus && typeof CONFIG.market.socialFootprintBonus === "object") {
    return CONFIG.market.socialFootprintBonus;
  }
  return { enabled: false };
}

function getSocialFootprintMult(gameState, config) {
  const safeConfig = config && typeof config === "object" ? config : {};
  const label = typeof safeConfig.label === "string" ? safeConfig.label : "Social bonus";
  if (!safeConfig.enabled) {
    return { mult: 1, label: label, detail: "" };
  }
  if (!gameState || !gameState.player) {
    return { mult: 1, label: label, detail: "" };
  }
  const source = typeof safeConfig.source === "string" ? safeConfig.source : "socialFollowers";
  const followers = source === "socialSubscribers"
    ? Number.isFinite(gameState.player.socialSubscribers) ? gameState.player.socialSubscribers : 0
    : Number.isFinite(gameState.player.socialFollowers) ? gameState.player.socialFollowers : 0;
  const minFollowers = Number.isFinite(safeConfig.minFollowersToStart) ? safeConfig.minFollowersToStart : 0;
  const perFollowers = Number.isFinite(safeConfig.perFollowers) ? safeConfig.perFollowers : 0;
  const bonusPerUnit = Number.isFinite(safeConfig.bonusPerUnit) ? safeConfig.bonusPerUnit : 0;
  const maxBonusMult = Number.isFinite(safeConfig.maxBonusMult) ? safeConfig.maxBonusMult : 1;
  if (perFollowers <= 0 || bonusPerUnit <= 0 || maxBonusMult <= 1) {
    return { mult: 1, label: label, detail: "" };
  }
  const eligibleFollowers = followers - minFollowers;
  if (eligibleFollowers < perFollowers) {
    return { mult: 1, label: label, detail: "" };
  }
  const units = Math.floor(eligibleFollowers / perFollowers);
  let mult = 1 + units * bonusPerUnit;
  mult = Math.min(mult, maxBonusMult);
  if (mult <= 1) {
    return { mult: 1, label: label, detail: "" };
  }
  const bonusPct = Math.round((mult - 1) * 100);
  const capPct = Math.round((maxBonusMult - 1) * 100);
  const sourceLabel = source === "socialSubscribers" ? "Social subs" : "Followers";
  const detail = sourceLabel + " " + followers + " \u2192 +" + bonusPct + "% (cap " + capPct + "%)";
  return { mult: mult, label: label, detail: detail };
}

function getMarketSaturationTier(config, currentSubs) {
  if (!config || !Array.isArray(config.tiers)) {
    return null;
  }
  const subs = Number.isFinite(currentSubs) ? currentSubs : 0;
  for (let index = 0; index < config.tiers.length; index += 1) {
    const tier = config.tiers[index];
    if (!tier || typeof tier !== "object") {
      continue;
    }
    const min = Number.isFinite(tier.min) ? tier.min : 0;
    const hasMax = Number.isFinite(tier.max);
    if (subs >= min && (!hasMax || subs <= tier.max)) {
      return tier;
    }
  }
  return null;
}

function canApplyContentVariance(gameState) {
  if (!gameState || !gameState.player || !gameState.content || !gameState.content.variance) {
    return false;
  }
  const config = getContentVarianceConfig();
  const startDay = Number.isFinite(config.startDay) ? config.startDay : Infinity;
  return Boolean(config.enabled) &&
    Boolean(gameState.content.variance.enabled) &&
    gameState.player.day >= startDay;
}

function rollContentVariance(gameState) {
  const varianceState = gameState.content.variance;
  const seed = Number.isFinite(varianceState.seed) ? varianceState.seed : 1;
  const next = getNextSeededFloat(seed);
  varianceState.seed = next.seed;
  return next.value;
}

function appendContentVarianceLog(gameState, logEntry) {
  if (!gameState || !gameState.content || !gameState.content.variance) {
    return;
  }
  const varianceState = gameState.content.variance;
  if (!Array.isArray(varianceState.rollLog)) {
    varianceState.rollLog = [];
  }
  varianceState.rollLog.push(logEntry);
  const config = getContentVarianceConfig();
  const maxEntries = Number.isFinite(config.maxRollLogEntries) ? config.maxRollLogEntries : 100;
  if (varianceState.rollLog.length > maxEntries) {
    varianceState.rollLog = varianceState.rollLog.slice(-maxEntries);
  }
}

function getEntryPerformerIds(entry) {
  if (!entry) {
    return [];
  }
  if (Array.isArray(entry.performerIds) && entry.performerIds.length) {
    return entry.performerIds.filter(Boolean);
  }
  if (entry.performerId) {
    return [entry.performerId];
  }
  return [];
}

function getEntryPhotoPaths(entry) {
  if (!entry || !Array.isArray(entry.photoPaths) || entry.photoPaths.length === 0) {
    return buildShootPhotoPaths();
  }
  return entry.photoPaths.slice();
}

function getBookingPerformerSelection(gameState, selection) {
  if (!gameState || !gameState.roster || !Array.isArray(gameState.roster.performers)) {
    return { ok: false, message: "Roster data missing." };
  }
  const performerIdA = selection.performerIdA || selection.performerId;
  if (!performerIdA) {
    return { ok: false, message: "Select a performer." };
  }
  const performerA = gameState.roster.performers.find(function (entry) {
    return entry.id === performerIdA;
  });
  if (!performerA) {
    return { ok: false, message: "Select a performer." };
  }
  const performerStatusA = isPerformerBookable(gameState, performerA);
  if (!performerStatusA.ok) {
    return { ok: false, message: performerStatusA.reason || "Performer is unavailable." };
  }
  return {
    ok: true,
    performerA: performerA,
    performerB: null,
    performerIds: [performerA.id]
  };
}

function getAutoBookingSelection(gameState) {
  if (!gameState || !gameState.roster || !Array.isArray(gameState.roster.performers)) {
    return { ok: false, reason: "Roster data missing" };
  }

  const performer = gameState.roster.performers.find(function (entry) {
    const status = isPerformerBookable(gameState, entry);
    return status.ok;
  });
  if (!performer) {
    return { ok: false, reason: "No performers available" };
  }

  const locationIds = CONFIG.locations.tier0_ids
    .concat(CONFIG.locations.tier1_ids)
    .concat(CONFIG.locations.tier2_ids || []);
  const location = locationIds.map(function (locationId) {
    return CONFIG.locations.catalog[locationId];
  }).find(function (entry) {
    if (!entry) {
      return false;
    }
    if (entry.tier === 1 && !isLocationTierUnlocked(gameState, "tier1")) {
      return false;
    }
    if (entry.tier === 2 && !isLocationTierUnlocked(gameState, "tier2")) {
      return false;
    }
    if (entry.tier === 2) {
      const repRequirement = Number.isFinite(CONFIG.locations.tier2ReputationRequirement)
        ? CONFIG.locations.tier2ReputationRequirement
        : 0;
      if (gameState.player.reputation < repRequirement) {
        return false;
      }
    }
    return true;
  });
  if (!location) {
    return { ok: false, reason: "No available locations" };
  }

  const themeId = CONFIG.themes.mvp.theme_ids[0];
  const theme = themeId ? CONFIG.themes.mvp.themes[themeId] : null;
  if (!theme) {
    return { ok: false, reason: "No themes available" };
  }

  const contentType = CONFIG.content_types.available[0];
  if (!contentType) {
    return { ok: false, reason: "No content types available" };
  }

  return {
    ok: true,
    selection: {
      performerIdA: performer.id,
      locationId: location.id,
      themeId: theme.id,
      contentType: contentType
    }
  };
}

function getThemeById(themeId) {
  if (!themeId) {
    return null;
  }
  if (CONFIG.themes.mvp && CONFIG.themes.mvp.themes && CONFIG.themes.mvp.themes[themeId]) {
    return CONFIG.themes.mvp.themes[themeId];
  }
  if (CONFIG.themes.act2 && CONFIG.themes.act2.themes && CONFIG.themes.act2.themes[themeId]) {
    return CONFIG.themes.act2.themes[themeId];
  }
  return null;
}

function tryAutoBookOne(gameState) {
  if (!gameState || !gameState.player) {
    return { success: false, reason: "Game state missing" };
  }

  if (gameState.player.day >= gameState.player.debtDueDay) {
    return { success: false, reason: "Day limit reached" };
  }

  const selectionResult = getAutoBookingSelection(gameState);
  if (!selectionResult.ok) {
    return { success: false, reason: selectionResult.reason };
  }

  const location = CONFIG.locations.catalog[selectionResult.selection.locationId];
  const shootCostResult = calculateShootCost(location);
  if (!shootCostResult.ok) {
    return { success: false, reason: "Unable to calculate shoot cost" };
  }
  const adjustedCost = applyContentTypeCostMultiplier(
    shootCostResult.value,
    selectionResult.selection.contentType
  );
  const finalShootCost = adjustedCost.finalCost;
  if (gameState.player.cash < finalShootCost) {
    return { success: false, reason: "Not enough cash" };
  }
  const automationConfig = CONFIG.automation || {};
  const minReserve = Number.isFinite(automationConfig.minCashReserve) ? automationConfig.minCashReserve : 0;
  if (minReserve > 0 && gameState.player.cash - finalShootCost < minReserve) {
    return {
      success: false,
      reason: "Cash reserve would drop below " + formatCurrency(minReserve)
    };
  }

  const result = confirmBooking(gameState, selectionResult.selection);
  if (!result.ok) {
    return { success: false, reason: result.message || "Booking failed" };
  }

  return { success: true, result: result };
}

function confirmBooking(gameState, selection) {
  if (!gameState || !selection) {
    return { ok: false, message: "Select all fields before confirming." };
  }

  if (gameState.player.day >= gameState.player.debtDueDay) {
    return { ok: false, message: "Day limit reached. No more shoots allowed." };
  }

  const currentShoots = Number.isFinite(gameState.player.shootsToday) ? gameState.player.shootsToday : 0;

  const agencyConfig = getAgencyPackConfig();
  const isAgencyPack = isAgencyPackSelection(selection) && agencyConfig.enabled;
  const agencyDailyLimit = Number.isFinite(agencyConfig.dailyLimit) ? agencyConfig.dailyLimit : 1;
  if (isAgencyPack && agencyDailyLimit > 0 && gameState.player.agencyPackUsedToday) {
    return { ok: false, message: "Agency Sample Pack already used today." };
  }
  let performerSelection = null;
  let performer = null;
  if (isAgencyPack) {
    performer = buildAgencyPackPerformer();
    performerSelection = {
      ok: true,
      performerA: null,
      performerB: null,
      performerIds: []
    };
  } else {
    performerSelection = getBookingPerformerSelection(gameState, selection);
    if (!performerSelection.ok) {
      return { ok: false, message: performerSelection.message || "Select valid performers." };
    }
    performer = performerSelection.performerA;
  }

  const location = CONFIG.locations.catalog[selection.locationId];
  if (!location) {
    return { ok: false, message: "Select a location." };
  }
  if (location.tier === 1 && !isLocationTierUnlocked(gameState, "tier1")) {
    return { ok: false, message: "Tier 1 locations are locked." };
  }
  if (location.tier === 2 && !isLocationTierUnlocked(gameState, "tier2")) {
    return { ok: false, message: "Tier 2 locations are locked." };
  }
  if (location.tier === 2) {
    const repRequirement = Number.isFinite(CONFIG.locations.tier2ReputationRequirement)
      ? CONFIG.locations.tier2ReputationRequirement
      : 0;
    if (gameState.player.reputation < repRequirement) {
      return { ok: false, message: "Need Reputation ≥ " + repRequirement + " to use Tier 2 locations." };
    }
  }

  const theme = getThemeById(selection.themeId);
  if (!theme) {
    return { ok: false, message: "Select a theme." };
  }

  if (CONFIG.content_types.available.indexOf(selection.contentType) === -1) {
    return { ok: false, message: "Select a content type." };
  }
  const shootCostResult = isAgencyPack
    ? calculateAgencyPackCost(location)
    : calculateShootCost(location);
  if (!shootCostResult.ok) {
    return { ok: false, message: "Unable to calculate shoot cost." };
  }

  const comboConfig = getBookingComboConfig();
  const hasCombo = !isAgencyPack && comboConfig.enabled && performerSelection.performerIds.length === 2;
  const costMultiplier = Number.isFinite(comboConfig.costMultiplier) ? comboConfig.costMultiplier : 1;
  const baseShootCost = hasCombo
    ? Math.floor(shootCostResult.value * costMultiplier)
    : shootCostResult.value;
  const adjustedCost = applyContentTypeCostMultiplier(baseShootCost, selection.contentType);
  const shootCost = adjustedCost.finalCost;
  if (gameState.player.cash < shootCost) {
    return { ok: false, message: "Not enough cash for this shoot." };
  }

  let socialFollowersGained = 0;
  let socialSubscribersGained = 0;
  let onlyFansSubscribersGained = 0;
  let baseOfSubs = 0;
  let adjustedOfSubs = 0;
  let varianceApplied = false;
  let variancePct = 0;
  let varianceRoll = null;
  let socialFootprintMult = null;
  let socialFootprintDetail = null;
  let saturationMult = null;
  let saturationTierLabel = null;
  if (selection.contentType === "Premium") {
    const premiumResult = calculatePremiumOfSubs(performer, theme);
    baseOfSubs = premiumResult.ok ? premiumResult.value : 0;
    adjustedOfSubs = applyEquipmentOfSubsMultiplier(baseOfSubs, gameState);
    if (canApplyContentVariance(gameState)) {
      const varianceConfig = getContentVarianceConfig();
      const maxVariance = Number.isFinite(varianceConfig.maxVariancePct) ? varianceConfig.maxVariancePct : 0;
      varianceRoll = rollContentVariance(gameState);
      variancePct = (varianceRoll * 2 * maxVariance) - maxVariance;
      adjustedOfSubs = Math.round(adjustedOfSubs * (1 + variancePct));
      varianceApplied = true;
    }
    const competitionMultipliers = getCompetitionMultipliers(gameState, gameState.player.day);
    adjustedOfSubs = Math.round(adjustedOfSubs * competitionMultipliers.premiumOfSubsMult);
    const reputationOfSubsMult = getReputationOfSubsMultiplier(gameState);
    adjustedOfSubs = Math.round(adjustedOfSubs * reputationOfSubsMult);
    const premiumConfig = CONFIG.conversion && CONFIG.conversion.premium ? CONFIG.conversion.premium : {};
    const premiumMultiplier = Number.isFinite(premiumConfig.ofSubsMultiplier)
      ? premiumConfig.ofSubsMultiplier
      : 1;
    adjustedOfSubs = Math.round(adjustedOfSubs * premiumMultiplier);
    onlyFansSubscribersGained = Math.max(0, Math.floor(adjustedOfSubs));
    if (isAgencyPack) {
      const premiumOfSubsMult = Number.isFinite(agencyConfig.premiumOfSubsMult)
        ? agencyConfig.premiumOfSubsMult
        : 1;
      const premiumSubsMult = Number.isFinite(agencyConfig.premiumSubsMult)
        ? agencyConfig.premiumSubsMult
        : 1;
      adjustedOfSubs = Math.round(adjustedOfSubs * premiumOfSubsMult);
      onlyFansSubscribersGained = Math.max(0, Math.floor(adjustedOfSubs * premiumSubsMult));
    }
    const socialFootprintConfig = getSocialFootprintConfig();
    const socialFootprintResult = getSocialFootprintMult(gameState, socialFootprintConfig);
    if (socialFootprintResult.mult > 1) {
      onlyFansSubscribersGained = Math.max(
        0,
        Math.floor(onlyFansSubscribersGained * socialFootprintResult.mult)
      );
      socialFootprintMult = socialFootprintResult.mult;
      socialFootprintDetail = socialFootprintResult.detail;
    }
  }

  if (selection.contentType === "Premium") {
    const saturationConfig = getMarketSaturationConfig();
    const saturationState = gameState.market && gameState.market.saturation ? gameState.market.saturation : null;
    const saturationActive = saturationConfig && saturationConfig.enabledAfterDebt === true &&
      saturationState && saturationState.active === true;
    if (saturationActive) {
      const currentSubs = Number.isFinite(gameState.player.onlyFansSubscribers)
        ? gameState.player.onlyFansSubscribers
        : 0;
      const tier = getMarketSaturationTier(saturationConfig, currentSubs);
      const fallbackMult = Number.isFinite(saturationConfig.defaultMult)
        ? saturationConfig.defaultMult
        : 1;
      const tierMult = tier && Number.isFinite(tier.mult) ? tier.mult : fallbackMult;
      onlyFansSubscribersGained = Math.max(0, Math.floor(onlyFansSubscribersGained * tierMult));
      saturationMult = tierMult;
      saturationTierLabel = tier && typeof tier.label === "string" ? tier.label : "Saturation tier";
    }
  }

  let feedbackSummary = selection.contentType === "Promo"
    ? "Promo shot complete. Post it to generate reach."
    : "Premium release boosted OF subscribers.";

  const contentId = "content_" + (gameState.content.entries.length + 1);
  const entry = {
    id: contentId,
    dayCreated: gameState.player.day,
    performerId: isAgencyPack ? null : performer.id,
    performerIds: isAgencyPack ? [] : performerSelection.performerIds,
    locationId: location.id,
    themeId: theme.id,
    contentType: selection.contentType,
    source: isAgencyPack ? "agency_pack" : "core",
    shootCost: shootCost,
    photoPaths: buildShootPhotoPaths(),
    results: {
      baseShootCost: baseShootCost,
      costMult: adjustedCost.mult,
      socialFollowersGained: socialFollowersGained,
      socialSubscribersGained: socialSubscribersGained,
      onlyFansSubscribersGained: onlyFansSubscribersGained,
      feedbackSummary: feedbackSummary
    }
  };

  if (selection.contentType === "Premium") {
    entry.results.variancePct = variancePct;
  }
  if (selection.contentType === "Premium" && Number.isFinite(socialFootprintMult)) {
    entry.results.socialFootprintMult = socialFootprintMult;
    entry.results.socialFootprintDetail = socialFootprintDetail;
  }
  if (selection.contentType === "Premium" && Number.isFinite(saturationMult)) {
    entry.results.saturationMult = saturationMult;
    entry.results.saturationTierLabel = saturationTierLabel;
  }

  if (isAgencyPack) {
    const bundleCount = Number.isFinite(agencyConfig.bundleCount) ? agencyConfig.bundleCount : 0;
    entry.bundleCount = bundleCount;
    entry.bundleThumbs = Array.from({ length: bundleCount }, function () {
      return CONFIG.SHOOT_OUTPUT_PLACEHOLDER_THUMB_PATH;
    });
  }

  if (varianceApplied) {
    appendContentVarianceLog(gameState, {
      day: gameState.player.day,
      contentId: entry.id,
      contentType: "Premium",
      roll: varianceRoll,
      variancePct: variancePct,
      baseOfSubs: baseOfSubs,
      adjustedOfSubs: adjustedOfSubs
    });
  }

  gameState.player.cash = Math.max(0, gameState.player.cash - shootCost);
  gameState.player.socialFollowers = Math.max(0, gameState.player.socialFollowers + socialFollowersGained);
  gameState.player.socialSubscribers = Math.max(0, gameState.player.socialSubscribers + socialSubscribersGained);
  gameState.player.onlyFansSubscribers = Math.max(0, gameState.player.onlyFansSubscribers + onlyFansSubscribersGained);
  if (isAgencyPack && agencyDailyLimit > 0) {
    gameState.player.agencyPackUsedToday = true;
  }

  gameState.content.entries.push(entry);
  gameState.content.lastContentId = entry.id;
  appendShootOutputRecord(gameState, entry);

  const fatigueMultiplier = hasCombo && Number.isFinite(comboConfig.fatigueMultiplierEach)
    ? comboConfig.fatigueMultiplierEach
    : 1;
  const starPowerMessages = [];
  if (!isAgencyPack) {
    performerSelection.performerIds.forEach(function (performerId) {
      const updateResult = updatePerformerStats(gameState, performerId, fatigueMultiplier);
      if (updateResult && updateResult.performer) {
        updatePerformerAvailabilityAfterBooking(gameState, updateResult.performer);
        if (updateResult.starPowerResult && updateResult.starPowerResult.leveledUp) {
          starPowerMessages.push(
            updateResult.performer.name + " leveled up: Star Power " + updateResult.starPowerResult.newStarPower + "."
          );
        }
      }
    });
  }
  const nextShoots = currentShoots + 1;
  gameState.player.shootsToday = nextShoots;

  const legacyEvents = checkLegacyMilestones(gameState);
  const milestoneEvents = checkMilestones(gameState).concat(legacyEvents);

  const storyEvents = [];

  const mrrDelta = getMRRDeltaForSubs(onlyFansSubscribersGained);
  let varianceMessage = "";
  if (selection.contentType === "Premium" && varianceApplied) {
    const variancePercent = Math.round(variancePct * 100);
    const varianceLabel = (variancePercent >= 0 ? "+" : "") + variancePercent + "%";
    varianceMessage = " OF subs variance: " + varianceLabel + ".";
  }
  const starPowerMessage = starPowerMessages.length ? (" " + starPowerMessages.join(" ")) : "";
  const resultMessage = selection.contentType === "Promo"
    ? "Promo shot complete. Post it to generate reach." + starPowerMessage
    : "Premium release complete. +" + onlyFansSubscribersGained + " OF subs (MRR +" + formatCurrency(mrrDelta) + "/mo)." +
      varianceMessage + starPowerMessage;

  return {
    ok: true,
    contentId: entry.id,
    message: resultMessage,
    storyEvents: storyEvents,
    milestoneEvents: milestoneEvents
  };
}

function createShootOutputRecord(entry) {
  if (!entry || !entry.results) {
    return null;
  }
  const tier = entry.contentType === "Premium" ? "premium" : "standard";
  const performerIds = getEntryPerformerIds(entry);
  const source = entry.source || "core";
  const normalizedPerformerIds = source === "agency_pack"
    ? []
    : (performerIds.length ? performerIds : (entry.performerId ? [entry.performerId] : []));
  return {
    id: "shoot_output_" + entry.id,
    day: entry.dayCreated,
    performerIds: normalizedPerformerIds,
    themeId: entry.themeId || null,
    tier: tier,
    source: source,
    socialFollowersGained: Number.isFinite(entry.results.socialFollowersGained) ? entry.results.socialFollowersGained : 0,
    socialSubscribersGained: Number.isFinite(entry.results.socialSubscribersGained) ? entry.results.socialSubscribersGained : 0,
    onlyFansSubscribersGained: Number.isFinite(entry.results.onlyFansSubscribersGained) ? entry.results.onlyFansSubscribersGained : 0,
    thumbnailPath: CONFIG.SHOOT_OUTPUT_PLACEHOLDER_THUMB_PATH
  };
}

function appendShootOutputRecord(gameState, entry) {
  ensureShootOutputsState(gameState);
  const record = createShootOutputRecord(entry);
  if (!record) {
    return;
  }

  const exists = gameState.shootOutputs.some(function (output) {
    return output.id === record.id;
  });
  if (exists) {
    return;
  }

  gameState.shootOutputs.push(record);

  const maxHistory = Number.isFinite(CONFIG.SHOOT_OUTPUTS_MAX_HISTORY)
    ? CONFIG.SHOOT_OUTPUTS_MAX_HISTORY
    : 50;
  if (gameState.shootOutputs.length > maxHistory) {
    gameState.shootOutputs = gameState.shootOutputs.slice(-maxHistory);
  }
}
