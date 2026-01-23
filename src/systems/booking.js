function advanceDay(gameState) {
  gameState.player.shootsToday = 0;
  gameState.player.day += 1;
  recoverAllPerformers(gameState);
  advancePerformerManagementDay(gameState);
  rerollFreelancerProfilesOnNewDay(gameState);
  recordAnalyticsSnapshot(gameState);
  const storyResult = checkStoryEvents(gameState);
  return storyResult.events || [];
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
      performerId: performer.id,
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
  if (gameState.player.cash < shootCostResult.value) {
    return { success: false, reason: "Not enough cash" };
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

  const performer = gameState.roster.performers.find(function (entry) {
    return entry.id === selection.performerId;
  });
  if (!performer) {
    return { ok: false, message: "Select a performer." };
  }
  const performerStatus = isPerformerBookable(gameState, performer);
  if (!performerStatus.ok) {
    return { ok: false, message: performerStatus.reason || "Performer is unavailable." };
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
  const shootCostResult = calculateShootCost(location);
  if (!shootCostResult.ok) {
    return { ok: false, message: "Unable to calculate shoot cost." };
  }

  const shootCost = shootCostResult.value;
  if (gameState.player.cash < shootCost) {
    return { ok: false, message: "Not enough cash for this shoot." };
  }

  let followersGained = 0;
  let revenue = 0;
  const isFreelancer = performer.type === "freelance";
  if (selection.contentType === "Premium") {
    const premiumResult = calculatePremiumRevenue(performer, theme);
    const baseRevenue = premiumResult.ok ? premiumResult.value : 0;
    revenue = applyEquipmentRevenueMultiplier(baseRevenue, gameState);
  }

  let subscribersGained = calculateSubscribersGained(followersGained);
  let feedbackSummary = selection.contentType === "Promo"
    ? "Promo shot complete. Post it to generate reach."
    : "Premium release generated revenue.";
  if (isFreelancer && selection.contentType === "Premium") {
    feedbackSummary += " Guest drop spiked attention, but converted fewer subs.";
  }

  const contentId = "content_" + (gameState.content.entries.length + 1);
  const entry = {
    id: contentId,
    dayCreated: gameState.player.day,
    performerId: performer.id,
    locationId: location.id,
    themeId: theme.id,
    contentType: selection.contentType,
    shootCost: shootCost,
    results: {
      revenue: revenue,
      followersGained: followersGained,
      subscribersGained: subscribersGained,
      feedbackSummary: feedbackSummary
    }
  };

  gameState.player.cash = Math.max(0, gameState.player.cash - shootCost + revenue);
  gameState.player.followers = Math.max(0, gameState.player.followers + followersGained);
  gameState.player.subscribers = Math.max(0, gameState.player.subscribers + subscribersGained);

  gameState.content.entries.push(entry);
  gameState.content.lastContentId = entry.id;
  appendShootOutputRecord(gameState, entry);

  updatePerformerStats(gameState, performer.id);
  updatePerformerAvailabilityAfterBooking(gameState, performer);
  const shootsPerDay = CONFIG.game.shoots_per_day;
  const currentShoots = Number.isFinite(gameState.player.shootsToday) ? gameState.player.shootsToday : 0;
  const nextShoots = currentShoots + 1;
  gameState.player.shootsToday = nextShoots;

  const milestoneEvents = checkMilestones(gameState);

  let storyEvents = [];
  if (nextShoots >= shootsPerDay) {
    storyEvents = advanceDay(gameState);
  }

  const resultMessage = selection.contentType === "Promo"
    ? "Promo shot complete. Post it to generate reach."
    : "Shoot booked. +" + followersGained + " followers, +" + formatCurrency(revenue) + ".";

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
  return {
    id: "shoot_output_" + entry.id,
    day: entry.dayCreated,
    performerIds: [entry.performerId],
    themeId: entry.themeId || null,
    tier: tier,
    revenue: Number.isFinite(entry.results.revenue) ? entry.results.revenue : 0,
    followersGained: Number.isFinite(entry.results.followersGained) ? entry.results.followersGained : 0,
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
