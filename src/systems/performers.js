function isPerformerAvailable(performer) {
  if (!performer) {
    return false;
  }
  return performer.fatigue < CONFIG.performers.max_fatigue;
}

function getPerformerDailyBookingCap(performer) {
  const config = CONFIG.performers || {};
  const capLimit = Number.isFinite(config.max_daily_bookings_cap) ? config.max_daily_bookings_cap : 3;
  const defaultCap = Number.isFinite(config.default_max_bookings_per_day) ? config.default_max_bookings_per_day : 1;
  let baseCap = defaultCap;
  if (performer && Number.isFinite(performer.maxBookingsPerDay)) {
    baseCap = performer.maxBookingsPerDay;
  } else if (performer && performer.id) {
    const catalogEntry = config.catalog ? config.catalog[performer.id] : null;
    if (catalogEntry && Number.isFinite(catalogEntry.maxBookingsPerDay)) {
      baseCap = catalogEntry.maxBookingsPerDay;
    }
  }
  const normalizedBase = Math.max(1, Math.floor(baseCap));
  if (Number.isFinite(capLimit) && capLimit > 0) {
    return Math.min(capLimit, normalizedBase);
  }
  return normalizedBase;
}

function getPerformerManagementConfig() {
  if (CONFIG.performerManagement && typeof CONFIG.performerManagement === "object") {
    return CONFIG.performerManagement;
  }
  return {};
}

function getContractDaysByType(performerType) {
  const config = getPerformerManagementConfig();
  const daysByType = config.contractDaysByType || {};
  if (performerType && Number.isFinite(daysByType[performerType])) {
    return daysByType[performerType];
  }
  return 0;
}

function getRenewalCostByType(performerType) {
  const config = getPerformerManagementConfig();
  const costByType = config.renewalCostByType || {};
  if (performerType && Number.isFinite(costByType[performerType])) {
    return costByType[performerType];
  }
  return 0;
}

function ensurePerformerManagementForId(gameState, performer) {
  if (!gameState) {
    return;
  }
  if (!gameState.performerManagement || typeof gameState.performerManagement !== "object") {
    gameState.performerManagement = { contracts: {}, availability: {}, retentionFlags: {} };
  }
  const management = gameState.performerManagement;
  if (!management.contracts || typeof management.contracts !== "object") {
    management.contracts = {};
  }
  if (!management.availability || typeof management.availability !== "object") {
    management.availability = {};
  }
  if (!management.retentionFlags || typeof management.retentionFlags !== "object") {
    management.retentionFlags = {};
  }

  const performerId = typeof performer === "string" ? performer : performer && performer.id;
  if (!performerId) {
    return;
  }
  let performerData = performer;
  if (typeof performer === "string" && gameState.roster && Array.isArray(gameState.roster.performers)) {
    performerData = gameState.roster.performers.find(function (entry) {
      return entry.id === performer;
    }) || null;
  }
  const performerType = performerData && performerData.type ? performerData.type : "core";
  const contractDays = getContractDaysByType(performerType);

  if (!management.contracts[performerId] || typeof management.contracts[performerId] !== "object") {
    management.contracts[performerId] = {
      daysRemaining: contractDays,
      status: contractDays > 0 ? "active" : "expired"
    };
  } else {
    const contract = management.contracts[performerId];
    if (!Number.isFinite(contract.daysRemaining)) {
      contract.daysRemaining = contractDays;
    }
    if (!contract.status) {
      contract.status = contract.daysRemaining > 0 ? "active" : "expired";
    }
  }

  if (!management.availability[performerId] || typeof management.availability[performerId] !== "object") {
    management.availability[performerId] = { restDaysRemaining: 0, consecutiveBookings: 0 };
  } else {
    const availability = management.availability[performerId];
    if (!Number.isFinite(availability.restDaysRemaining)) {
      availability.restDaysRemaining = 0;
    }
    if (!Number.isFinite(availability.consecutiveBookings)) {
      availability.consecutiveBookings = 0;
    }
  }

  if (!management.retentionFlags[performerId] || typeof management.retentionFlags[performerId] !== "object") {
    management.retentionFlags[performerId] = { warned: false, left: false };
  } else {
    const flags = management.retentionFlags[performerId];
    if (typeof flags.warned !== "boolean") {
      flags.warned = false;
    }
    if (typeof flags.left !== "boolean") {
      flags.left = false;
    }
  }
}

function getContractState(gameState, performerId) {
  if (!gameState || !performerId) {
    return null;
  }
  ensurePerformerManagementForId(gameState, performerId);
  return gameState.performerManagement.contracts[performerId] || null;
}

function getAvailabilityState(gameState, performerId) {
  if (!gameState || !performerId) {
    return null;
  }
  ensurePerformerManagementForId(gameState, performerId);
  return gameState.performerManagement.availability[performerId] || null;
}

function isPerformerBookable(gameState, performer) {
  if (!gameState || !performer) {
    return { ok: false, reason: "Performer not found." };
  }
  ensurePerformerManagementForId(gameState, performer);
  const contract = getContractState(gameState, performer.id);
  const daysRemaining = contract && Number.isFinite(contract.daysRemaining) ? contract.daysRemaining : 0;
  if (daysRemaining <= 0 || (contract && contract.status === "expired")) {
    return { ok: false, reason: "Contract expired — renew in Roster." };
  }

  const availability = getAvailabilityState(gameState, performer.id);
  const restDaysRemaining = availability && Number.isFinite(availability.restDaysRemaining)
    ? availability.restDaysRemaining
    : 0;
  if (restDaysRemaining > 0) {
    return { ok: false, reason: "Performer must rest (" + restDaysRemaining + " day(s) remaining)." };
  }

  const consecutiveBookings = availability && Number.isFinite(availability.consecutiveBookings)
    ? availability.consecutiveBookings
    : 0;
  const dailyCap = getPerformerDailyBookingCap(performer);
  if (dailyCap > 0 && consecutiveBookings >= dailyCap) {
    return { ok: false, reason: "Daily shoot cap reached." };
  }

  if (!isPerformerAvailable(performer)) {
    return { ok: false, reason: "Performer is unavailable due to fatigue." };
  }

  return { ok: true, reason: "" };
}

function updatePerformerAvailabilityAfterBooking(gameState, performer) {
  if (!gameState || !performer) {
    return;
  }
  ensurePerformerManagementForId(gameState, performer);
  const availability = getAvailabilityState(gameState, performer.id);
  if (!availability) {
    return;
  }
  const currentStreak = Number.isFinite(availability.consecutiveBookings) ? availability.consecutiveBookings : 0;
  availability.consecutiveBookings = currentStreak + 1;
  const maxFatigue = CONFIG.performers.max_fatigue;
  if (Number.isFinite(maxFatigue) && performer.fatigue >= maxFatigue) {
    const restDays = Number.isFinite(CONFIG.performerManagement.restDaysOnMaxFatigue)
      ? CONFIG.performerManagement.restDaysOnMaxFatigue
      : 0;
    availability.restDaysRemaining = Math.max(availability.restDaysRemaining, restDays);
  }
}

function advancePerformerManagementDay(gameState) {
  if (!gameState || !gameState.roster || !Array.isArray(gameState.roster.performers)) {
    return;
  }
  gameState.roster.performers.forEach(function (performer) {
    ensurePerformerManagementForId(gameState, performer);
    const contract = getContractState(gameState, performer.id);
    if (contract && Number.isFinite(contract.daysRemaining)) {
      contract.daysRemaining = Math.max(0, contract.daysRemaining - 1);
      if (contract.daysRemaining === 0) {
        contract.status = "expired";
      }
    }
    const availability = getAvailabilityState(gameState, performer.id);
    if (availability) {
      availability.restDaysRemaining = Math.max(0, availability.restDaysRemaining - 1);
      availability.consecutiveBookings = 0;
    }
  });
}

function renewPerformerContract(gameState, performerId) {
  if (!gameState || !performerId) {
    return { ok: false, message: "Missing performer selection." };
  }
  const performer = gameState.roster && Array.isArray(gameState.roster.performers)
    ? gameState.roster.performers.find(function (entry) {
      return entry.id === performerId;
    })
    : null;
  if (!performer) {
    return { ok: false, message: "Performer not found." };
  }
  ensurePerformerManagementForId(gameState, performer);
  const contract = getContractState(gameState, performerId);
  const cost = getRenewalCostByType(performer.type);
  if (!Number.isFinite(cost)) {
    return { ok: false, message: "Renewal unavailable." };
  }
  if (gameState.player.cash < cost) {
    return { ok: false, message: "Not enough cash to renew this contract." };
  }
  const daysRemaining = getContractDaysByType(performer.type);
  if (daysRemaining <= 0) {
    return { ok: false, message: "No contract term configured." };
  }
  gameState.player.cash = Math.max(0, gameState.player.cash - cost);
  contract.daysRemaining = daysRemaining;
  contract.status = "active";
  return { ok: true, message: "Contract renewed for " + daysRemaining + " days." };
}

function applyShootFatigue(performer, multiplier) {
  if (!performer) {
    return;
  }
  const fatiguePerShoot = Number.isFinite(CONFIG.performers.fatigue_per_shoot)
    ? CONFIG.performers.fatigue_per_shoot
    : 0;
  const appliedMultiplier = Number.isFinite(multiplier) ? multiplier : 1;
  const fatigueGain = Math.round(fatiguePerShoot * appliedMultiplier);
  performer.fatigue = Math.min(
    CONFIG.performers.max_fatigue,
    performer.fatigue + fatigueGain
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

function getStarPowerProgressionConfig() {
  if (CONFIG.performers && CONFIG.performers.starPowerProgression && typeof CONFIG.performers.starPowerProgression === "object") {
    return CONFIG.performers.starPowerProgression;
  }
  return { enabled: false };
}

function applyStarPowerProgression(performer) {
  if (!performer) {
    return { leveledUp: false };
  }
  const config = getStarPowerProgressionConfig();
  if (!config.enabled) {
    return { leveledUp: false };
  }
  const shootsPerIncrease = Number.isFinite(config.shootsPerIncrease) ? config.shootsPerIncrease : 0;
  if (shootsPerIncrease <= 0) {
    return { leveledUp: false };
  }
  if (!Number.isFinite(performer.starPowerShoots) || performer.starPowerShoots < 0) {
    performer.starPowerShoots = 0;
  }
  performer.starPowerShoots += 1;
  if (performer.starPowerShoots < shootsPerIncrease) {
    return { leveledUp: false };
  }
  const maxStarPower = Number.isFinite(config.maxStarPower) ? config.maxStarPower : null;
  const currentStarPower = Number.isFinite(performer.starPower)
    ? performer.starPower
    : (Number.isFinite(CONFIG.performers.default_star_power) ? CONFIG.performers.default_star_power : 1);
  let leveledUp = false;
  let nextStarPower = currentStarPower;
  if (!Number.isFinite(maxStarPower) || currentStarPower < maxStarPower) {
    nextStarPower = currentStarPower + 1;
    performer.starPower = nextStarPower;
    leveledUp = true;
  }
  performer.starPowerShoots = Math.max(0, performer.starPowerShoots - shootsPerIncrease);
  return { leveledUp: leveledUp, newStarPower: nextStarPower };
}

function updatePerformerStats(gameState, performerId, fatigueMultiplier) {
  if (!gameState || !performerId) {
    return { ok: false, message: "Missing performer selection." };
  }
  const performer = gameState.roster.performers.find(function (entry) {
    return entry.id === performerId;
  });

  if (!performer) {
    return { ok: false, message: "Performer not found." };
  }

  applyShootFatigue(performer, fatigueMultiplier);
  const starPowerResult = applyStarPowerProgression(performer);
  return { ok: true, starPowerResult: starPowerResult, performer: performer };
}
