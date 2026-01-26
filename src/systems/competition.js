function getCompetitionConfig() {
  if (CONFIG.competition && typeof CONFIG.competition === "object") {
    return CONFIG.competition;
  }
  return {};
}

function getCompetitionStartDay(config) {
  if (config && Number.isFinite(config.startDay)) {
    return config.startDay;
  }
  return Infinity;
}

function isCompetitionEnabled(config, day) {
  if (config && config.enabled === true) {
    return true;
  }
  const startDay = getCompetitionStartDay(config);
  if (!Number.isFinite(day)) {
    return false;
  }
  return day >= startDay;
}

function getCompetitionCadenceDays(config) {
  if (config && Number.isFinite(config.weeklyCheckCadenceDays)) {
    return config.weeklyCheckCadenceDays;
  }
  return 7;
}

function getCompetitionRivalsConfig(config) {
  return Array.isArray(config.rivals) ? config.rivals : [];
}

function buildDefaultRivalStudios(config) {
  const rivals = getCompetitionRivalsConfig(config);
  return rivals.map(function (rival) {
    const baseScore = Number.isFinite(rival.baseReputationScore) ? rival.baseReputationScore : 0;
    const weeklyGrowthRate = Number.isFinite(rival.weeklyGrowthRate) ? rival.weeklyGrowthRate : 0;
    return {
      id: rival.id,
      name: rival.name,
      reputationScore: baseScore,
      weeklyGrowthRate: weeklyGrowthRate
    };
  }).filter(function (rival) {
    return rival && typeof rival.id === "string";
  });
}

function initCompetitionStateIfMissing(gameState) {
  if (!gameState) {
    return;
  }
  const config = getCompetitionConfig();
  if (!gameState.rivals || typeof gameState.rivals !== "object") {
    gameState.rivals = { studios: [], lastCheckDay: 0 };
  }
  if (!Array.isArray(gameState.rivals.studios)) {
    gameState.rivals.studios = [];
  }
  if (!Number.isFinite(gameState.rivals.lastCheckDay)) {
    gameState.rivals.lastCheckDay = 0;
  }
  if (gameState.rivals.studios.length === 0) {
    gameState.rivals.studios = buildDefaultRivalStudios(config);
  }

  if (!gameState.market || typeof gameState.market !== "object") {
    gameState.market = { activeShiftId: null, shiftHistory: [], saturation: { active: false, activatedDay: null } };
  }
  if (typeof gameState.market.activeShiftId !== "string" && gameState.market.activeShiftId !== null) {
    gameState.market.activeShiftId = null;
  }
  if (!Array.isArray(gameState.market.shiftHistory)) {
    gameState.market.shiftHistory = [];
  }
  if (!gameState.market.saturation || typeof gameState.market.saturation !== "object") {
    gameState.market.saturation = { active: false, activatedDay: null };
  }
  if (typeof gameState.market.saturation.active !== "boolean") {
    gameState.market.saturation.active = false;
  }
  if (!Number.isFinite(gameState.market.saturation.activatedDay)) {
    gameState.market.saturation.activatedDay = null;
  }
}

function getMarketShiftsCatalog(config) {
  if (config && config.marketShifts && typeof config.marketShifts === "object") {
    return config.marketShifts;
  }
  return {};
}

function normalizeMarketShift(shiftId, shift) {
  if (!shiftId || !shift) {
    return null;
  }
  return {
    shiftId: shiftId,
    name: shift.name || "Market Shift",
    startDay: shift.startDay,
    endDay: shift.endDay,
    multipliers: shift.multipliers || {}
  };
}

function getShiftForDay(catalog, day) {
  if (!Number.isFinite(day)) {
    return null;
  }
  const shiftIds = Object.keys(catalog);
  for (let index = 0; index < shiftIds.length; index += 1) {
    const shiftId = shiftIds[index];
    const shift = catalog[shiftId];
    if (!shift || !Number.isFinite(shift.startDay) || !Number.isFinite(shift.endDay)) {
      continue;
    }
    if (day >= shift.startDay && day <= shift.endDay) {
      return normalizeMarketShift(shiftId, shift);
    }
  }
  return null;
}

function getActiveMarketShift(gameState, day) {
  const config = getCompetitionConfig();
  if (!isCompetitionEnabled(config, day)) {
    return null;
  }
  const catalog = getMarketShiftsCatalog(config);
  if (!gameState || !gameState.market) {
    return getShiftForDay(catalog, day);
  }
  const activeId = gameState.market.activeShiftId;
  if (activeId && catalog[activeId]) {
    const shift = catalog[activeId];
    if (Number.isFinite(shift.startDay) && Number.isFinite(shift.endDay) && day >= shift.startDay && day <= shift.endDay) {
      return normalizeMarketShift(activeId, shift);
    }
  }
  return getShiftForDay(catalog, day);
}

function clampMultiplier(value) {
  const min = 0.85;
  const max = 1.15;
  if (!Number.isFinite(value)) {
    return 1;
  }
  return Math.min(max, Math.max(min, value));
}

function getCompetitionMultipliers(gameState, day) {
  const config = getCompetitionConfig();
  if (!isCompetitionEnabled(config, day)) {
    return { promoFollowerMult: 1, premiumOfSubsMult: 1 };
  }
  const shift = getActiveMarketShift(gameState, day);
  if (!shift || !shift.multipliers) {
    return { promoFollowerMult: 1, premiumOfSubsMult: 1 };
  }
  const promoFollowerMult = clampMultiplier(shift.multipliers.promoFollowerMult);
  const premiumOfSubsMult = clampMultiplier(shift.multipliers.premiumOfSubsMult);
  return { promoFollowerMult: promoFollowerMult, premiumOfSubsMult: premiumOfSubsMult };
}

function getCompetitionStandings(gameState) {
  if (!gameState || !gameState.player) {
    return null;
  }
  const rivals = gameState.rivals && Array.isArray(gameState.rivals.studios)
    ? gameState.rivals.studios
    : [];
  const entries = [{
    id: "player",
    name: "Your Studio",
    score: Number.isFinite(gameState.player.reputation) ? gameState.player.reputation : 0
  }].concat(rivals.map(function (rival) {
    return {
      id: rival.id,
      name: rival.name || "Rival Studio",
      score: Number.isFinite(rival.reputationScore) ? rival.reputationScore : 0
    };
  }));
  entries.sort(function (a, b) {
    return b.score - a.score;
  });
  const playerIndex = entries.findIndex(function (entry) {
    return entry.id === "player";
  });
  return {
    rank: playerIndex >= 0 ? playerIndex + 1 : entries.length,
    total: entries.length,
    entries: entries
  };
}

function addCompetitionStoryLogEntry(gameState, day, rank, total) {
  if (!gameState) {
    return;
  }
  ensureStoryLogState(gameState);
  const entryId = "competition_weekly_day_" + day;
  const exists = gameState.storyLog.some(function (entry) {
    return entry && entry.id === entryId;
  });
  if (exists) {
    return;
  }
  const title = "Competition Update";
  const rankLabel = Number.isFinite(rank) && Number.isFinite(total)
    ? "Rank " + rank + " / " + total
    : "Standings updated";
  const body = "Weekly standings check: " + rankLabel + ".";
  gameState.storyLog.push({
    id: entryId,
    dayNumber: day,
    title: title,
    body: body,
    timestamp: new Date().toISOString()
  });
}

function maybeApplyWeeklyCompetitionCheck(gameState, currentDay) {
  const config = getCompetitionConfig();
  if (!isCompetitionEnabled(config, currentDay)) {
    return { ok: false, checked: false };
  }
  if (!gameState || !Number.isFinite(currentDay)) {
    return { ok: false, checked: false };
  }
  initCompetitionStateIfMissing(gameState);
  const cadence = getCompetitionCadenceDays(config);
  const lastCheck = Number.isFinite(gameState.rivals.lastCheckDay) ? gameState.rivals.lastCheckDay : 0;
  if ((currentDay - lastCheck) < cadence) {
    return { ok: true, checked: false };
  }

  gameState.rivals.lastCheckDay = currentDay;
  gameState.rivals.studios = gameState.rivals.studios.map(function (rival) {
    const currentScore = Number.isFinite(rival.reputationScore) ? rival.reputationScore : 0;
    const growthRate = Number.isFinite(rival.weeklyGrowthRate) ? rival.weeklyGrowthRate : 0;
    const nextScore = Math.round((currentScore + growthRate) * 100) / 100;
    return {
      id: rival.id,
      name: rival.name,
      reputationScore: nextScore,
      weeklyGrowthRate: growthRate
    };
  });

  const standings = getCompetitionStandings(gameState);
  if (config.storyLogEnabled && standings) {
    addCompetitionStoryLogEntry(gameState, currentDay, standings.rank, standings.total);
  }

  const shift = getShiftForDay(getMarketShiftsCatalog(config), currentDay);
  if (shift) {
    gameState.market.activeShiftId = shift.shiftId;
    const alreadyLogged = gameState.market.shiftHistory.some(function (entry) {
      return entry && entry.shiftId === shift.shiftId;
    });
    if (!alreadyLogged) {
      gameState.market.shiftHistory.push({
        shiftId: shift.shiftId,
        dayApplied: currentDay
      });
    }
  } else {
    gameState.market.activeShiftId = null;
  }

  return { ok: true, checked: true };
}
