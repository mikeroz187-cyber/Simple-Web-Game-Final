function isPerformerAvailable(performer) {
  if (!performer) {
    return false;
  }
  return performer.fatigue < CONFIG.performers.max_fatigue;
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
  if (Number.isFinite(daysByType.freelance)) {
    return daysByType.freelance;
  }
  return 0;
}

function getRenewalCostByType(performerType) {
  const config = getPerformerManagementConfig();
  const costByType = config.renewalCostByType || {};
  if (performerType && Number.isFinite(costByType[performerType])) {
    return costByType[performerType];
  }
  if (Number.isFinite(costByType.freelance)) {
    return costByType.freelance;
  }
  return 0;
}

function getFreelancerConfig() {
  if (CONFIG.freelancers && typeof CONFIG.freelancers === "object") {
    return CONFIG.freelancers;
  }
  return {};
}

function getFreelancerProfileIds() {
  const config = getFreelancerConfig();
  const profiles = Array.isArray(config.profiles) ? config.profiles : [];
  return profiles.map(function (profile) {
    return profile.id;
  }).filter(function (profileId) {
    return typeof profileId === "string" && profileId.length > 0;
  });
}

function getFreelancerProfileById(profileId) {
  if (!profileId) {
    return null;
  }
  const config = getFreelancerConfig();
  const profiles = Array.isArray(config.profiles) ? config.profiles : [];
  return profiles.find(function (profile) {
    return profile && profile.id === profileId;
  }) || null;
}

function getRandomFreelancerProfileId(avoidId) {
  const config = getFreelancerConfig();
  const profileIds = getFreelancerProfileIds();
  if (profileIds.length === 0) {
    return null;
  }
  const avoidSame = Boolean(config.avoidSameProfileOnRotate);
  let candidates = profileIds;
  if (avoidSame && avoidId) {
    const filtered = profileIds.filter(function (profileId) {
      return profileId !== avoidId;
    });
    candidates = filtered.length ? filtered : profileIds;
  }
  const index = Math.floor(Math.random() * candidates.length);
  return candidates[index] || profileIds[0];
}

function setFreelancerProfile(gameState, performerId, profileId) {
  if (!gameState || !gameState.roster || !performerId || !profileId) {
    return;
  }
  if (!gameState.roster.freelancerProfiles || typeof gameState.roster.freelancerProfiles !== "object") {
    gameState.roster.freelancerProfiles = {};
  }
  gameState.roster.freelancerProfiles[performerId] = profileId;
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
  const performerType = performerData && performerData.type ? performerData.type : "freelance";
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

  const maxConsecutive = Number.isFinite(CONFIG.performerManagement.maxConsecutiveBookings)
    ? CONFIG.performerManagement.maxConsecutiveBookings
    : 0;
  const consecutiveBookings = availability && Number.isFinite(availability.consecutiveBookings)
    ? availability.consecutiveBookings
    : 0;
  if (maxConsecutive > 0 && consecutiveBookings >= maxConsecutive) {
    return { ok: false, reason: "Performer hit max consecutive shoots today." };
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

function rotateFreelancerProfile(gameState, performerId) {
  if (!gameState || !performerId) {
    return { ok: false, message: "Missing freelancer selection." };
  }
  const performer = gameState.roster && Array.isArray(gameState.roster.performers)
    ? gameState.roster.performers.find(function (entry) {
      return entry.id === performerId;
    })
    : null;
  if (!performer || performer.type !== "freelance") {
    return { ok: false, message: "Freelancer not found." };
  }
  const profileIds = getFreelancerProfileIds();
  if (profileIds.length === 0) {
    return { ok: false, message: "No freelancer personas available." };
  }
  const config = getFreelancerConfig();
  const rotationCost = Number.isFinite(config.rotationCost) ? config.rotationCost : 0;
  if (rotationCost > 0 && gameState.player.cash < rotationCost) {
    return { ok: false, message: "Not enough cash to rotate this guest." };
  }
  const currentProfileId = gameState.roster && gameState.roster.freelancerProfiles
    ? gameState.roster.freelancerProfiles[performerId]
    : null;
  const nextProfileId = getRandomFreelancerProfileId(currentProfileId);
  if (!nextProfileId) {
    return { ok: false, message: "Unable to rotate guest profile." };
  }
  if (rotationCost > 0) {
    gameState.player.cash = Math.max(0, gameState.player.cash - rotationCost);
  }
  setFreelancerProfile(gameState, performerId, nextProfileId);

  ensurePerformerManagementForId(gameState, performer);
  const availability = getAvailabilityState(gameState, performerId);
  if (availability) {
    availability.consecutiveBookings = 0;
    availability.restDaysRemaining = 0;
  }
  const contract = getContractState(gameState, performerId);
  const contractDays = getContractDaysByType(performer.type);
  if (contract && Number.isFinite(contractDays)) {
    contract.daysRemaining = contractDays;
    contract.status = contractDays > 0 ? "active" : "expired";
  }

  const profile = getFreelancerProfileById(nextProfileId);
  const profileName = profile && profile.name ? profile.name : performer.name;
  return { ok: true, message: "New guest booked: " + profileName + ". Fresh face, fresh buzz." };
}

function applyShootFatigue(performer) {
  if (!performer) {
    return;
  }
  performer.fatigue = Math.min(
    CONFIG.performers.max_fatigue,
    performer.fatigue + CONFIG.performers.fatigue_per_shoot
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

function updatePerformerStats(gameState, performerId) {
  if (!gameState || !performerId) {
    return { ok: false, message: "Missing performer selection." };
  }
  const performer = gameState.roster.performers.find(function (entry) {
    return entry.id === performerId;
  });

  if (!performer) {
    return { ok: false, message: "Performer not found." };
  }

  applyShootFatigue(performer);
  return { ok: true };
}
