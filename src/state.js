function getPerformerRoleId(performerId) {
  if (!performerId) {
    return "support";
  }
  const roleMap = CONFIG.performers.role_by_id || {};
  return roleMap[performerId] || "support";
}

function getFreelancerProfilesConfig() {
  if (CONFIG.freelancers && typeof CONFIG.freelancers === "object") {
    return CONFIG.freelancers;
  }
  return {};
}

function getFreelancerProfileIds() {
  const config = getFreelancerProfilesConfig();
  const profiles = Array.isArray(config.profiles) ? config.profiles : [];
  return profiles.map(function (profile) {
    return profile.id;
  }).filter(function (profileId) {
    return typeof profileId === "string" && profileId.length > 0;
  });
}

function getRandomFreelancerProfileId(avoidId) {
  const config = getFreelancerProfilesConfig();
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

function newGameState() {
  const now = new Date().toISOString();
  const rosterIds = CONFIG.performers.core_ids
    .concat(CONFIG.performers.freelance_ids)
    .concat(CONFIG.performers.act2_ids || []);
  const performerManagement = { contracts: {}, availability: {}, retentionFlags: {} };
  const freelancerProfiles = {};

  rosterIds.forEach(function (performerId) {
    const performer = CONFIG.performers.catalog[performerId];
    if (!performer) {
      return;
    }
    const contractDays = getContractDaysByType(performer.type);
    performerManagement.contracts[performerId] = {
      daysRemaining: contractDays,
      status: contractDays > 0 ? "active" : "expired"
    };
    performerManagement.availability[performerId] = { restDaysRemaining: 0, consecutiveBookings: 0 };
    performerManagement.retentionFlags[performerId] = { warned: false, left: false };
    if (performer.type === "freelance") {
      const profileId = getRandomFreelancerProfileId();
      if (profileId) {
        freelancerProfiles[performerId] = profileId;
      }
    }
  });

  return {
    version: CONFIG.save.save_schema_version,
    createdAt: now,
    updatedAt: now,
    player: {
      day: CONFIG.game.starting_day,
      cash: CONFIG.game.starting_cash,
      debtRemaining: CONFIG.game.loan_total_due,
      debtDueDay: CONFIG.game.debt_due_day,
      shootsToday: 0,
      followers: 0,
      subscribers: 0,
      reputation: CONFIG.progression.starting_reputation
    },
    roster: {
      performers: rosterIds.map(function (id) {
          const performer = CONFIG.performers.catalog[id];
          return {
            id: performer.id,
            name: performer.name,
            type: performer.type,
            starPower: performer.starPower,
            portraitPath: getPerformerPortraitPath(performer),
            fatigue: 0,
            loyalty: CONFIG.performers.starting_loyalty
          };
        }),
      performerRoles: rosterIds.reduce(function (roles, performerId) {
        roles[performerId] = getPerformerRoleId(performerId);
        return roles;
      }, {}),
      freelancerProfiles: freelancerProfiles
    },
    content: {
      lastContentId: null,
      entries: []
    },
    shootOutputs: [],
    social: {
      posts: [],
      activeSocialStrategyId: CONFIG.social.strategy.defaultStrategyId,
      manualStrategy: buildDefaultManualStrategyState()
    },
    unlocks: {
      locationTier1Unlocked: false,
      locationTiers: { tier0: true, tier1: false, tier2: false }
    },
    story: {
      introShown: false,
      debtReminderDaysShown: [],
      act2: { eventsShown: [], lastEventId: null }
    },
    storyLog: [],
    performerManagement: performerManagement,
    analyticsHistory: [],
    equipment: { lightingLevel: 0, cameraLevel: 0, setDressingLevel: 0 },
    milestones: [],
    automation: {
      autoBookEnabled: CONFIG.AUTOMATION_AUTO_BOOK_ENABLED_DEFAULT
    }
  };
}

function getManualStrategyConfig() {
  if (CONFIG.social && CONFIG.social.manualStrategy) {
    return CONFIG.social.manualStrategy;
  }
  return null;
}

function getDefaultManualStrategyAllocations() {
  const config = getManualStrategyConfig();
  const channels = config && Array.isArray(config.channels) ? config.channels : [];
  const count = channels.length || 1;
  const base = Math.floor(100 / count);
  const remainder = 100 - base * count;
  const allocations = {};
  channels.forEach(function (channel, index) {
    allocations[channel] = base + (index === 0 ? remainder : 0);
  });
  return allocations;
}

function normalizeManualStrategyAllocations(allocations) {
  const config = getManualStrategyConfig();
  const channels = config && Array.isArray(config.channels) ? config.channels : [];
  if (!allocations || typeof allocations !== "object") {
    return getDefaultManualStrategyAllocations();
  }
  const total = channels.reduce(function (sum, channel) {
    const value = Number.isFinite(allocations[channel]) ? allocations[channel] : 0;
    return sum + value;
  }, 0);
  if (total <= 0) {
    return getDefaultManualStrategyAllocations();
  }
  const normalized = {};
  let runningTotal = 0;
  channels.forEach(function (channel, index) {
    if (index === channels.length - 1) {
      normalized[channel] = Math.max(0, 100 - runningTotal);
      return;
    }
    const raw = Number.isFinite(allocations[channel]) ? allocations[channel] : 0;
    const portion = Math.max(0, Math.floor((raw / total) * 100));
    normalized[channel] = portion;
    runningTotal += portion;
  });
  return normalized;
}

function buildDefaultManualStrategyState() {
  const config = getManualStrategyConfig();
  const defaultBudget = config && Number.isFinite(config.defaultDailyBudget)
    ? config.defaultDailyBudget
    : 0;
  return {
    dailyBudget: defaultBudget,
    allocations: getDefaultManualStrategyAllocations(),
    lastAppliedDay: null
  };
}

function ensureShootOutputsState(gameState) {
  if (!gameState) {
    return;
  }

  if (!Array.isArray(gameState.shootOutputs)) {
    gameState.shootOutputs = [];
  }
}

function ensureStoryLogState(gameState) {
  if (!gameState) {
    return;
  }

  if (!Array.isArray(gameState.storyLog)) {
    gameState.storyLog = [];
  }
}

function ensureSocialManualStrategyState(gameState) {
  if (!gameState || !gameState.social) {
    return;
  }
  const config = getManualStrategyConfig();
  if (!config) {
    return;
  }
  if (!gameState.social.manualStrategy || typeof gameState.social.manualStrategy !== "object") {
    gameState.social.manualStrategy = buildDefaultManualStrategyState();
    return;
  }
  const manualStrategy = gameState.social.manualStrategy;
  if (!Number.isFinite(manualStrategy.dailyBudget)) {
    manualStrategy.dailyBudget = Number.isFinite(config.defaultDailyBudget) ? config.defaultDailyBudget : 0;
  }
  if (!manualStrategy.allocations || typeof manualStrategy.allocations !== "object") {
    manualStrategy.allocations = getDefaultManualStrategyAllocations();
  } else {
    const normalized = normalizeManualStrategyAllocations(manualStrategy.allocations);
    manualStrategy.allocations = normalized;
  }
  if (!Number.isFinite(manualStrategy.lastAppliedDay)) {
    manualStrategy.lastAppliedDay = null;
  }
  if (Number.isFinite(manualStrategy.lastAppliedDay)) {
    const logEntries = Array.isArray(gameState.storyLog) ? gameState.storyLog : [];
    const expectedId = "manual_strategy_day_" + manualStrategy.lastAppliedDay;
    const hasLogEntry = logEntries.some(function (entry) {
      return entry && entry.id === expectedId;
    });
    if (!hasLogEntry) {
      manualStrategy.lastAppliedDay = null;
    }
  }
}

function ensureAutomationState(gameState) {
  if (!gameState) {
    return;
  }

  if (!gameState.automation || typeof gameState.automation !== "object") {
    gameState.automation = {
      autoBookEnabled: CONFIG.AUTOMATION_AUTO_BOOK_ENABLED_DEFAULT
    };
    return;
  }

  if (typeof gameState.automation.autoBookEnabled !== "boolean") {
    gameState.automation.autoBookEnabled = CONFIG.AUTOMATION_AUTO_BOOK_ENABLED_DEFAULT;
  }
}

function ensureUnlocksState(gameState) {
  if (!gameState) {
    return;
  }

  if (!gameState.unlocks || typeof gameState.unlocks !== "object") {
    gameState.unlocks = {};
  }

  if (!gameState.unlocks.locationTiers || typeof gameState.unlocks.locationTiers !== "object") {
    gameState.unlocks.locationTiers = { tier0: true, tier1: false, tier2: false };
  }

  if (typeof gameState.unlocks.locationTiers.tier0 !== "boolean") {
    gameState.unlocks.locationTiers.tier0 = true;
  }

  if (typeof gameState.unlocks.locationTiers.tier1 !== "boolean") {
    gameState.unlocks.locationTiers.tier1 = false;
  }

  if (typeof gameState.unlocks.locationTiers.tier2 !== "boolean") {
    gameState.unlocks.locationTiers.tier2 = false;
  }

  if (typeof gameState.unlocks.locationTier1Unlocked !== "boolean") {
    gameState.unlocks.locationTier1Unlocked = false;
  }

  if (gameState.unlocks.locationTier1Unlocked) {
    gameState.unlocks.locationTiers.tier1 = true;
  }
}
