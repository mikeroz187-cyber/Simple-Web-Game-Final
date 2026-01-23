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

function getBookingComboConfig() {
  if (CONFIG.booking && CONFIG.booking.combo && typeof CONFIG.booking.combo === "object") {
    return CONFIG.booking.combo;
  }
  return { enabled: false };
}

function getBookingComboRoleKey(roleA, roleB) {
  if (!roleA || !roleB) {
    return null;
  }
  const normalized = [roleA, roleB].map(function (role) {
    return String(role || "").toLowerCase();
  }).sort();
  return normalized.join("+");
}

function getPerformerRoleIdForBooking(gameState, performerId) {
  if (!gameState || !gameState.roster || !performerId) {
    return "support";
  }
  const roleMap = gameState.roster.performerRoles || {};
  if (roleMap[performerId]) {
    return roleMap[performerId];
  }
  if (typeof getPerformerRoleId === "function") {
    return getPerformerRoleId(performerId);
  }
  return "support";
}

function getBookingComboMultiplier(comboConfig, roleKey, multiplierMap) {
  if (!comboConfig || !comboConfig.enabled || !roleKey) {
    return 1;
  }
  if (!multiplierMap || typeof multiplierMap !== "object") {
    return 1;
  }
  const value = multiplierMap[roleKey];
  return Number.isFinite(value) ? value : 1;
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

function getBookingPerformerSelection(gameState, selection) {
  if (!gameState || !gameState.roster || !Array.isArray(gameState.roster.performers)) {
    return { ok: false, message: "Roster data missing." };
  }
  const performerIdA = selection.performerIdA || selection.performerId;
  const performerIdB = selection.performerIdB || null;
  if (!performerIdA) {
    return { ok: false, message: "Select a performer." };
  }
  const performerA = gameState.roster.performers.find(function (entry) {
    return entry.id === performerIdA;
  });
  if (!performerA) {
    return { ok: false, message: "Select a performer." };
  }
  if (performerIdB && performerIdB === performerIdA) {
    return { ok: false, message: "Select two different performers." };
  }
  const performerStatusA = isPerformerBookable(gameState, performerA);
  if (!performerStatusA.ok) {
    return { ok: false, message: performerStatusA.reason || "Performer is unavailable." };
  }
  let performerB = null;
  if (performerIdB) {
    performerB = gameState.roster.performers.find(function (entry) {
      return entry.id === performerIdB;
    });
    if (!performerB) {
      return { ok: false, message: "Second performer not found." };
    }
    const performerStatusB = isPerformerBookable(gameState, performerB);
    if (!performerStatusB.ok) {
      return { ok: false, message: performerStatusB.reason || "Performer is unavailable." };
    }
    const roleA = getPerformerRoleIdForBooking(gameState, performerA.id);
    const roleB = getPerformerRoleIdForBooking(gameState, performerB.id);
    const leadCount = (roleA === "lead" ? 1 : 0) + (roleB === "lead" ? 1 : 0);
    if (leadCount !== 1) {
      return { ok: false, message: "Two-performer shoots require exactly one Lead." };
    }
    return {
      ok: true,
      performerA: performerA,
      performerB: performerB,
      performerIds: [performerA.id, performerB.id],
      roleKey: getBookingComboRoleKey(roleA, roleB)
    };
  }
  return {
    ok: true,
    performerA: performerA,
    performerB: null,
    performerIds: [performerA.id],
    roleKey: null
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
      performerIdB: null,
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

  const performerSelection = getBookingPerformerSelection(gameState, selection);
  if (!performerSelection.ok) {
    return { ok: false, message: performerSelection.message || "Select valid performers." };
  }
  const performer = performerSelection.performerA;
  const performerB = performerSelection.performerB;

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

  const comboConfig = getBookingComboConfig();
  const hasCombo = comboConfig.enabled && performerSelection.performerIds.length === 2;
  const costMultiplier = Number.isFinite(comboConfig.costMultiplier) ? comboConfig.costMultiplier : 1;
  const shootCost = hasCombo
    ? Math.floor(shootCostResult.value * costMultiplier)
    : shootCostResult.value;
  if (gameState.player.cash < shootCost) {
    return { ok: false, message: "Not enough cash for this shoot." };
  }

  let followersGained = 0;
  let revenue = 0;
  if (selection.contentType === "Premium") {
    const premiumResult = calculatePremiumRevenue(performer, theme);
    const baseRevenue = premiumResult.ok ? premiumResult.value : 0;
    revenue = applyEquipmentRevenueMultiplier(baseRevenue, gameState);
    if (hasCombo) {
      const revenueMultiplier = getBookingComboMultiplier(
        comboConfig,
        performerSelection.roleKey,
        comboConfig.revenueMultiplierByRoles
      );
      revenue = Math.round(revenue * revenueMultiplier);
    }
  }

  let subscribersGained = calculateSubscribersGained(followersGained);
  let feedbackSummary = selection.contentType === "Promo"
    ? "Promo shot complete. Post it to generate reach."
    : "Premium release generated revenue.";
  const hasFreelancer = performerSelection.performerIds.some(function (performerId) {
    const entry = gameState.roster.performers.find(function (rosterEntry) {
      return rosterEntry.id === performerId;
    });
    return entry && entry.type === "freelance";
  });
  if (hasFreelancer && selection.contentType === "Premium") {
    feedbackSummary += " Guest drop spiked attention, but converted fewer subs.";
  }

  const contentId = "content_" + (gameState.content.entries.length + 1);
  const entry = {
    id: contentId,
    dayCreated: gameState.player.day,
    performerId: performer.id,
    performerIds: performerSelection.performerIds,
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

  const fatigueMultiplier = hasCombo && Number.isFinite(comboConfig.fatigueMultiplierEach)
    ? comboConfig.fatigueMultiplierEach
    : 1;
  updatePerformerStats(gameState, performer.id, fatigueMultiplier);
  updatePerformerAvailabilityAfterBooking(gameState, performer);
  if (performerB) {
    updatePerformerStats(gameState, performerB.id, fatigueMultiplier);
    updatePerformerAvailabilityAfterBooking(gameState, performerB);
  }
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
  const performerIds = getEntryPerformerIds(entry);
  return {
    id: "shoot_output_" + entry.id,
    day: entry.dayCreated,
    performerIds: performerIds.length ? performerIds : [entry.performerId],
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
