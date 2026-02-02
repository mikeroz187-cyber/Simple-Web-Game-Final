function getRecruitmentConfig() {
  if (CONFIG.recruitment && typeof CONFIG.recruitment === "object") {
    return CONFIG.recruitment;
  }
  return { candidates: [], maxRosterSize: 0, dailyCandidateLimit: 1 };
}

function getRecruitmentMaxRosterSize(gameState) {
  const config = getRecruitmentConfig();
  const leaseConfig = CONFIG.leaseUpgrade && typeof CONFIG.leaseUpgrade === "object"
    ? CONFIG.leaseUpgrade
    : null;
  const baseCap = leaseConfig && Number.isFinite(leaseConfig.rosterCapBase)
    ? leaseConfig.rosterCapBase
    : (Number.isFinite(config.maxRosterSize) ? config.maxRosterSize : 0);
  if (!leaseConfig || leaseConfig.enabled !== true) {
    return baseCap;
  }
  const leasePurchased = Boolean(
    (gameState && gameState.player && gameState.player.upgrades && gameState.player.upgrades.lease)
      ? gameState.player.upgrades.lease.purchased
      : false
  );
  const upgradedCap = leaseConfig && Number.isFinite(leaseConfig.rosterCapAfterUpgrade)
    ? leaseConfig.rosterCapAfterUpgrade
    : baseCap;
  return leasePurchased ? upgradedCap : baseCap;
}

function getContractedRosterCount(gameState) {
  if (!gameState || !gameState.roster || !Array.isArray(gameState.roster.performers)) {
    return 0;
  }
  return gameState.roster.performers.filter(function (performer) {
    return performer && performer.type === "core";
  }).length;
}

function isPerformerInRoster(gameState, performerId) {
  if (!gameState || !gameState.roster || !Array.isArray(gameState.roster.performers)) {
    return false;
  }
  return gameState.roster.performers.some(function (performer) {
    return performer && performer.id === performerId;
  });
}

function getRecruitmentCandidateById(performerId) {
  const config = getRecruitmentConfig();
  const candidates = Array.isArray(config.candidates) ? config.candidates : [];
  return candidates.find(function (candidate) {
    return candidate && candidate.performerId === performerId;
  }) || null;
}

function isRecruitCandidateEligible(gameState, candidate) {
  if (!gameState || !gameState.player || !candidate) {
    return false;
  }
  const currentRep = Number.isFinite(gameState.player.reputation) ? gameState.player.reputation : 0;
  const currentDay = Number.isFinite(gameState.player.day) ? gameState.player.day : 0;
  const repRequired = Number.isFinite(candidate.repRequired) ? candidate.repRequired : 0;
  const forceUnlockDay = Number.isFinite(candidate.forceUnlockDay) ? candidate.forceUnlockDay : null;
  return currentRep >= repRequired || (forceUnlockDay !== null && currentDay >= forceUnlockDay);
}

function getAvailableRecruitCandidates(gameState) {
  const config = getRecruitmentConfig();
  const candidates = Array.isArray(config.candidates) ? config.candidates.slice() : [];
  if (!gameState || !gameState.player) {
    return [];
  }
  ensureRecruitmentState(gameState);
  const declined = new Set(gameState.recruitment.declinedIds || []);
  const hired = new Set(gameState.recruitment.hiredIds || []);
  return candidates.filter(function (candidate) {
    if (!candidate || typeof candidate.performerId !== "string") {
      return false;
    }
    if (declined.has(candidate.performerId) || hired.has(candidate.performerId)) {
      return false;
    }
    if (isPerformerInRoster(gameState, candidate.performerId)) {
      return false;
    }
    return isRecruitCandidateEligible(gameState, candidate);
  }).sort(function (a, b) {
    const repA = Number.isFinite(a.repRequired) ? a.repRequired : 0;
    const repB = Number.isFinite(b.repRequired) ? b.repRequired : 0;
    return repA - repB;
  });
}

function getActiveRecruitCandidate(gameState) {
  const config = getRecruitmentConfig();
  const dailyLimit = Number.isFinite(config.dailyCandidateLimit) ? config.dailyCandidateLimit : 1;
  const available = getAvailableRecruitCandidates(gameState);
  if (dailyLimit <= 0 || available.length === 0) {
    return null;
  }
  return available[0];
}

function getNewRecruitEligibilityEvents(gameState) {
  if (!gameState || !gameState.player) {
    return [];
  }
  ensureRecruitmentState(gameState);
  const rosterSize = getContractedRosterCount(gameState);
  const maxRosterSize = getRecruitmentMaxRosterSize(gameState);
  if (maxRosterSize > 0 && rosterSize >= maxRosterSize) {
    return [];
  }
  const config = getRecruitmentConfig();
  const candidates = Array.isArray(config.candidates) ? config.candidates : [];
  const declined = new Set(gameState.recruitment.declinedIds || []);
  const hired = new Set(gameState.recruitment.hiredIds || []);
  const notified = new Set(gameState.recruitment.notifiedIds || []);
  const events = [];

  candidates.forEach(function (candidate) {
    if (!candidate || typeof candidate.performerId !== "string") {
      return;
    }
    if (declined.has(candidate.performerId) || hired.has(candidate.performerId)) {
      return;
    }
    if (isPerformerInRoster(gameState, candidate.performerId)) {
      return;
    }
    if (!isRecruitCandidateEligible(gameState, candidate)) {
      return;
    }
    if (notified.has(candidate.performerId)) {
      return;
    }
    gameState.recruitment.notifiedIds.push(candidate.performerId);
    notified.add(candidate.performerId);
    events.push({
      id: candidate.storyId || "recruit_available_" + candidate.performerId,
      day: gameState.player.day
    });
  });

  return events;
}

function buildRecruitRosterEntry(performerId) {
  const performer = CONFIG.performers.catalog[performerId];
  if (!performer) {
    return null;
  }
  return {
    id: performer.id,
    name: performer.name,
    type: performer.type,
    starPower: performer.starPower,
    starPowerShoots: 0,
    portraitPath: getPerformerPortraitPath(performer),
    fatigue: 0,
    loyalty: CONFIG.performers.starting_loyalty
  };
}

function hireRecruitCandidate(gameState, performerId) {
  if (!gameState || !gameState.player) {
    return { ok: false, message: "Game state missing." };
  }
  ensureRecruitmentState(gameState);
  const candidate = getRecruitmentCandidateById(performerId);
  if (!candidate) {
    return { ok: false, message: "Recruit not found." };
  }
  const repRequired = Number.isFinite(candidate.repRequired) ? candidate.repRequired : 0;
  if (!isRecruitCandidateEligible(gameState, candidate)) {
    return { ok: false, message: "Need Reputation ≥ " + repRequired + " to recruit this talent." };
  }
  if (isPerformerInRoster(gameState, performerId)) {
    return { ok: false, message: "Recruit already on your roster." };
  }
  const rosterSize = getContractedRosterCount(gameState);
  const maxRosterSize = getRecruitmentMaxRosterSize(gameState);
  if (maxRosterSize > 0 && rosterSize >= maxRosterSize) {
    return { ok: false, message: "Roster full (" + rosterSize + "/" + maxRosterSize + "). Upgrade your lease to expand." };
  }
  const hireCost = Number.isFinite(candidate.hireCost) ? candidate.hireCost : 0;
  if (gameState.player.cash < hireCost) {
    return { ok: false, message: "Not enough cash to hire this performer." };
  }
  const entry = buildRecruitRosterEntry(performerId);
  if (!entry) {
    return { ok: false, message: "Recruit data missing." };
  }

  gameState.player.cash = Math.max(0, gameState.player.cash - hireCost);
  gameState.roster.performers.push(entry);
  if (!Array.isArray(gameState.recruitment.hiredIds)) {
    gameState.recruitment.hiredIds = [];
  }
  if (gameState.recruitment.hiredIds.indexOf(performerId) === -1) {
    gameState.recruitment.hiredIds.push(performerId);
  }
  ensurePerformerManagementForId(gameState, entry);
  return { ok: true, message: "You signed " + entry.name + ". Your stable grows." };
}

function declineRecruitCandidate(gameState, performerId) {
  if (!gameState) {
    return { ok: false, message: "Game state missing." };
  }
  ensureRecruitmentState(gameState);
  const candidate = getRecruitmentCandidateById(performerId);
  if (!candidate) {
    return { ok: false, message: "Recruit not found." };
  }
  if (!Array.isArray(gameState.recruitment.declinedIds)) {
    gameState.recruitment.declinedIds = [];
  }
  if (gameState.recruitment.declinedIds.indexOf(performerId) === -1) {
    gameState.recruitment.declinedIds.push(performerId);
  }
  return { ok: true, message: "You passed. She won’t wait forever." };
}
