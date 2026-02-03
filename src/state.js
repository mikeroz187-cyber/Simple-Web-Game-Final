function getContentVarianceConfig() {
  if (CONFIG.content && CONFIG.content.variance && typeof CONFIG.content.variance === "object") {
    return CONFIG.content.variance;
  }
  return {};
}

function getContentVarianceEnabledDefault() {
  const config = getContentVarianceConfig();
  if (typeof config.enabled === "boolean") {
    return config.enabled;
  }
  return true;
}

function createContentVarianceSeed() {
  return Math.floor(Math.random() * 4294967296) >>> 0;
}

function buildDefaultContentVarianceState() {
  return {
    enabled: getContentVarianceEnabledDefault(),
    seed: createContentVarianceSeed(),
    rollLog: []
  };
}

function buildDefaultRivalStudiosState() {
  const config = CONFIG.market && CONFIG.market.competition && typeof CONFIG.market.competition === "object"
    ? CONFIG.market.competition
    : {};
  const rivals = Array.isArray(config.rivals) ? config.rivals : [];
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

function buildDefaultReputationState() {
  return {
    branchId: null,
    branchProgress: 0
  };
}

function buildDefaultAutomationState() {
  const automationConfig = CONFIG.automation || {};
  return {
    enabled: Boolean(automationConfig.enabledDefault),
    autoBookEnabled: Boolean(automationConfig.autoBookDefault),
    autoPostEnabled: Boolean(automationConfig.autoPostDefault),
    lastAutomationDay: null,
    actionsTakenToday: 0
  };
}

function buildDefaultRecruitmentState() {
  return {
    declinedIds: [],
    hiredIds: [],
    notifiedIds: []
  };
}

function buildDefaultStatsState() {
  return {
    totalShopSpend: 0,
    totalUpgradesPurchased: 0
  };
}

function buildDefaultPlayerUpgradesState() {
  return {
    managerHired: false,
    lease: {
      purchased: false,
      offerStartedDay: null,
      offerDeadlineDay: null,
      missed: false,
      missPenaltyApplied: false
    },
    studioUpgrade: {
      offerStartedDay: null,
      offerExpiresDay: null,
      offerSeen: false,
      decision: "none",
      purchased: false,
      financed: false,
      financePlan: {
        active: false,
        termDays: 0,
        daysRemaining: 0,
        dailyPayment: 0,
        totalFinancedAmount: 0,
        downPayment: 0
      },
      penaltyUntilDay: null
    }
  };
}

function buildDefaultConquestsState() {
  const config = CONFIG.conquests || {};
  const charactersConfig = config.characters && typeof config.characters === "object"
    ? config.characters
    : {};
  const characters = {};
  Object.keys(charactersConfig).forEach(function (characterId) {
    characters[characterId] = { stageUnlocked: 0 };
  });
  return {
    enabled: Boolean(config.enabled),
    characters: characters,
    inbox: [],
    unlockedPacks: []
  };
}

function getDefaultTakeoverState() {
  const takeoverConfig = CONFIG.takeover && typeof CONFIG.takeover === "object" ? CONFIG.takeover : {};
  const studioIds = Array.isArray(takeoverConfig.studioOrder) && takeoverConfig.studioOrder.length
    ? takeoverConfig.studioOrder.slice()
    : ["neon_cherry", "honey_trap", "midnight_media"];
  const studios = {};
  studioIds.forEach(function (studioId) {
    studios[studioId] = { status: "active", defeatedDay: null, bossConfrontation: null };
  });
  return {
    unlocked: false,
    unlockedDay: null,
    victory: {
      achieved: false,
      achievedDay: null,
      modalShown: false
    },
    studios: studios,
    activePerformerId: null,
    performers: {},
    bossConfrontations: {},
    gallery: {
      bosses: {},
      trophies: {},
      notes: []
    },
    retaliation: {
      nextPoachDay: null,
      pending: null,
      lastResolvedDay: null,
      totalAttempts: 0,
      totalLosses: 0,
      totalDefenses: 0
    },
    stats: {
      totalSpent: 0,
      performersAcquired: 0,
      performersLost: 0,
      performersReacquired: 0,
      studiosDefeated: 0,
      bossesDefeated: 0,
      poachAttemptsDefended: 0,
      poachAttemptsLost: 0
    }
  };
}

function newGameState() {
  const now = new Date().toISOString();
  const rosterIds = CONFIG.performers.core_ids.slice();
  const performerManagement = { contracts: {}, availability: {}, retentionFlags: {} };

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
  });

  return {
    version: CONFIG.save.save_schema_version,
    createdAt: now,
    updatedAt: now,
    player: {
      day: CONFIG.game.starting_day,
      cash: CONFIG.game.starting_cash,
      debtRemaining: CONFIG.game.loan_total_due,
      debtInitialPrincipal: CONFIG.game.loan_total_due,
      debtDueDay: CONFIG.game.debt_due_day,
      shootsToday: 0,
      agencyPackUsedToday: false,
      upgrades: buildDefaultPlayerUpgradesState(),
      socialFollowers: 0,
      socialSubscribers: 0,
      onlyFansSubscribers: 0,
      onlyFansSubCarry: 0,
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
            starPowerShoots: 0,
            portraitPath: getPerformerPortraitPath(performer),
            fatigue: 0,
            loyalty: CONFIG.performers.starting_loyalty,
            lastBookedDay: null,
            lastLoyaltyDecayDay: null
          };
        }),
    },
    content: {
      lastContentId: null,
      entries: [],
      variance: buildDefaultContentVarianceState()
    },
    rivals: {
      studios: buildDefaultRivalStudiosState(),
      lastCheckDay: 0
    },
    market: {
      activeShiftId: null,
      shiftHistory: [],
      saturation: {
        active: false,
        activatedDay: null
      }
    },
    reputation: buildDefaultReputationState(),
    shootOutputs: [],
    social: {
      posts: [],
      activeSocialStrategyId: CONFIG.social.strategy.defaultStrategyId,
      manualStrategy: buildDefaultManualStrategyState(),
      collab: buildDefaultSocialCollabWeekState()
    },
    unlocks: {
      locationTier1Unlocked: false,
      locationTiers: { tier0: true, tier1: false, tier2: false },
      appliedUnlockIds: []
    },
    story: {
      introShown: false,
      debtReminderDaysShown: [],
      act2: { eventsShown: [], lastEventId: null },
      act3: { eventsShown: [], lastEventId: null }
    },
    flags: {
      act2StaffingPushWarned: false,
      act2StaffingPushCompleted: false,
      act2StaffingCrisisActive: false
    },
    storyLog: [],
    afterHours: {
      completed: {},
      cooldowns: {},
      recruitedBy: {},
      unlockedPacks: []
    },
    performerManagement: performerManagement,
    analyticsHistory: [],
    equipment: { lightingLevel: 0, cameraLevel: 0, setDressingLevel: 0 },
    stats: buildDefaultStatsState(),
    milestones: [],
    legacyMilestones: [],
    automation: buildDefaultAutomationState(),
    recruitment: buildDefaultRecruitmentState(),
    conquests: buildDefaultConquestsState(),
    takeover: getDefaultTakeoverState()
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

function buildDefaultSocialCollabWeekState() {
  const config = CONFIG.socialCollabWeek && typeof CONFIG.socialCollabWeek === "object"
    ? CONFIG.socialCollabWeek
    : {};
  return {
    status: "idle",
    nextOfferDay: Number.isFinite(config.initialOfferDay) ? config.initialOfferDay : null,
    lastOfferDay: null,
    partnerIndex: 0,
    attempt: {
      partnerName: null,
      startDay: null,
      endDay: null,
      daysCompleted: 0,
      lastEvaluatedDay: null
    },
    permanentPromoReachBonusPct: 0
  };
}

function ensurePlayerUpgradesState(gameState) {
  if (!gameState || !gameState.player) {
    return;
  }
  if (!gameState.player.upgrades || typeof gameState.player.upgrades !== "object" || Array.isArray(gameState.player.upgrades)) {
    gameState.player.upgrades = buildDefaultPlayerUpgradesState();
    return;
  }
  if (typeof gameState.player.upgrades.managerHired !== "boolean") {
    gameState.player.upgrades.managerHired = false;
  }
  if (!gameState.player.upgrades.lease || typeof gameState.player.upgrades.lease !== "object") {
    gameState.player.upgrades.lease = buildDefaultPlayerUpgradesState().lease;
    return;
  }
  const lease = gameState.player.upgrades.lease;
  if (typeof lease.purchased !== "boolean") {
    lease.purchased = false;
  }
  if (!Number.isFinite(lease.offerStartedDay)) {
    lease.offerStartedDay = null;
  }
  if (!Number.isFinite(lease.offerDeadlineDay)) {
    lease.offerDeadlineDay = null;
  }
  if (typeof lease.missed !== "boolean") {
    lease.missed = false;
  }
  if (typeof lease.missPenaltyApplied !== "boolean") {
    lease.missPenaltyApplied = false;
  }
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

function ensureFlagsState(gameState) {
  if (!gameState) {
    return;
  }
  if (!gameState.flags || typeof gameState.flags !== "object" || Array.isArray(gameState.flags)) {
    gameState.flags = {};
  }
  if (typeof gameState.flags.act2StaffingPushWarned !== "boolean") {
    gameState.flags.act2StaffingPushWarned = false;
  }
  if (typeof gameState.flags.act2StaffingPushCompleted !== "boolean") {
    gameState.flags.act2StaffingPushCompleted = false;
  }
  if (typeof gameState.flags.act2StaffingCrisisActive !== "boolean") {
    gameState.flags.act2StaffingCrisisActive = false;
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

function ensureSocialCollabWeekState(gameState) {
  if (!gameState || !gameState.social) {
    return;
  }
  const defaults = buildDefaultSocialCollabWeekState();
  if (!gameState.social.collab || typeof gameState.social.collab !== "object") {
    gameState.social.collab = defaults;
    return;
  }
  const collab = gameState.social.collab;
  const validStatuses = ["idle", "offered", "active", "completed"];
  if (validStatuses.indexOf(collab.status) === -1) {
    collab.status = defaults.status;
  }
  if (collab.nextOfferDay !== null && !Number.isFinite(collab.nextOfferDay)) {
    collab.nextOfferDay = defaults.nextOfferDay;
  }
  if (collab.lastOfferDay !== null && !Number.isFinite(collab.lastOfferDay)) {
    collab.lastOfferDay = null;
  }
  if (!Number.isFinite(collab.partnerIndex) || collab.partnerIndex < 0) {
    collab.partnerIndex = defaults.partnerIndex;
  }
  if (!collab.attempt || typeof collab.attempt !== "object") {
    collab.attempt = defaults.attempt;
  } else {
    const attempt = collab.attempt;
    if (attempt.partnerName !== null && typeof attempt.partnerName !== "string") {
      attempt.partnerName = null;
    }
    if (attempt.startDay !== null && !Number.isFinite(attempt.startDay)) {
      attempt.startDay = null;
    }
    if (attempt.endDay !== null && !Number.isFinite(attempt.endDay)) {
      attempt.endDay = null;
    }
    if (!Number.isFinite(attempt.daysCompleted) || attempt.daysCompleted < 0) {
      attempt.daysCompleted = defaults.attempt.daysCompleted;
    } else {
      attempt.daysCompleted = Math.floor(attempt.daysCompleted);
    }
    if (attempt.lastEvaluatedDay !== null && !Number.isFinite(attempt.lastEvaluatedDay)) {
      attempt.lastEvaluatedDay = null;
    }
  }
  if (!Number.isFinite(collab.permanentPromoReachBonusPct) || collab.permanentPromoReachBonusPct < 0) {
    collab.permanentPromoReachBonusPct = defaults.permanentPromoReachBonusPct;
  } else {
    collab.permanentPromoReachBonusPct = Math.round(collab.permanentPromoReachBonusPct);
  }
}

function ensureAutomationState(gameState) {
  if (!gameState) {
    return;
  }

  const defaults = buildDefaultAutomationState();
  if (!gameState.automation || typeof gameState.automation !== "object") {
    gameState.automation = defaults;
    return;
  }

  if (typeof gameState.automation.enabled !== "boolean") {
    gameState.automation.enabled = defaults.enabled;
  }

  if (typeof gameState.automation.autoBookEnabled !== "boolean") {
    gameState.automation.autoBookEnabled = defaults.autoBookEnabled;
  }

  if (typeof gameState.automation.autoPostEnabled !== "boolean") {
    gameState.automation.autoPostEnabled = defaults.autoPostEnabled;
  }

  if (gameState.automation.lastAutomationDay !== null &&
    !Number.isFinite(gameState.automation.lastAutomationDay)) {
    gameState.automation.lastAutomationDay = null;
  }

  if (!Number.isFinite(gameState.automation.actionsTakenToday) || gameState.automation.actionsTakenToday < 0) {
    gameState.automation.actionsTakenToday = defaults.actionsTakenToday;
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

  if (!Array.isArray(gameState.unlocks.appliedUnlockIds)) {
    gameState.unlocks.appliedUnlockIds = [];
  }
}

function ensureReputationState(gameState) {
  if (!gameState) {
    return;
  }
  if (!gameState.reputation || typeof gameState.reputation !== "object") {
    gameState.reputation = buildDefaultReputationState();
    return;
  }
  if (typeof gameState.reputation.branchId !== "string" && gameState.reputation.branchId !== null) {
    gameState.reputation.branchId = null;
  }
  if (!Number.isFinite(gameState.reputation.branchProgress)) {
    gameState.reputation.branchProgress = 0;
  }
}

function ensureRecruitmentState(gameState) {
  if (!gameState) {
    return;
  }
  if (!gameState.recruitment || typeof gameState.recruitment !== "object") {
    gameState.recruitment = buildDefaultRecruitmentState();
    return;
  }
  if (!Array.isArray(gameState.recruitment.declinedIds)) {
    gameState.recruitment.declinedIds = [];
  }
  if (!Array.isArray(gameState.recruitment.hiredIds)) {
    gameState.recruitment.hiredIds = [];
  }
  if (!Array.isArray(gameState.recruitment.notifiedIds)) {
    gameState.recruitment.notifiedIds = [];
  }
}

function ensureStatsState(gameState) {
  if (!gameState) {
    return;
  }
  if (!gameState.stats || typeof gameState.stats !== "object") {
    gameState.stats = buildDefaultStatsState();
    return;
  }
  if (!Number.isFinite(gameState.stats.totalShopSpend) || gameState.stats.totalShopSpend < 0) {
    gameState.stats.totalShopSpend = 0;
  }
  if (!Number.isFinite(gameState.stats.totalUpgradesPurchased) || gameState.stats.totalUpgradesPurchased < 0) {
    gameState.stats.totalUpgradesPurchased = 0;
  }
}

function ensureTakeoverState(gameState) {
  if (!gameState) {
    return;
  }
  const defaults = getDefaultTakeoverState();
  const takeoverConfig = CONFIG.takeover && typeof CONFIG.takeover === "object" ? CONFIG.takeover : {};
  const performerConfig = takeoverConfig.performers && typeof takeoverConfig.performers === "object"
    ? takeoverConfig.performers
    : {};
  if (!gameState.takeover || typeof gameState.takeover !== "object" || Array.isArray(gameState.takeover)) {
    gameState.takeover = defaults;
    return;
  }
  const takeover = gameState.takeover;
  if (typeof takeover.unlocked !== "boolean") {
    takeover.unlocked = defaults.unlocked;
  }
  if (!Number.isFinite(takeover.unlockedDay)) {
    takeover.unlockedDay = null;
  }
  if (!takeover.victory || typeof takeover.victory !== "object" || Array.isArray(takeover.victory)) {
    const legacyAchieved = typeof takeover.victoryAchieved === "boolean"
      ? takeover.victoryAchieved
      : defaults.victory.achieved;
    const legacyDay = Number.isFinite(takeover.victoryDay)
      ? takeover.victoryDay
      : null;
    takeover.victory = {
      achieved: legacyAchieved,
      achievedDay: legacyDay,
      modalShown: false
    };
  }
  if (typeof takeover.victory.achieved !== "boolean") {
    takeover.victory.achieved = defaults.victory.achieved;
  }
  if (!Number.isFinite(takeover.victory.achievedDay)) {
    takeover.victory.achievedDay = null;
  }
  if (typeof takeover.victory.modalShown !== "boolean") {
    takeover.victory.modalShown = false;
  }
  if (!takeover.studios || typeof takeover.studios !== "object" || Array.isArray(takeover.studios)) {
    takeover.studios = defaults.studios;
  }
  if (takeover.activePerformerId !== null && typeof takeover.activePerformerId !== "string") {
    takeover.activePerformerId = null;
  }
  const studioDefaults = defaults.studios;
  Object.keys(studioDefaults).forEach(function (studioId) {
    const studio = takeover.studios[studioId];
    if (!studio || typeof studio !== "object") {
      takeover.studios[studioId] = {
        status: studioDefaults[studioId].status,
        defeatedDay: studioDefaults[studioId].defeatedDay,
        bossConfrontation: studioDefaults[studioId].bossConfrontation
      };
      return;
    }
    if (typeof studio.status !== "string") {
      studio.status = studioDefaults[studioId].status;
    }
    if (!Number.isFinite(studio.defeatedDay)) {
      studio.defeatedDay = studioDefaults[studioId].defeatedDay;
    }
    if (studio.bossConfrontation !== null && typeof studio.bossConfrontation !== "object") {
      studio.bossConfrontation = studioDefaults[studioId].bossConfrontation;
    }
    if (studio.bossConfrontation && typeof studio.bossConfrontation === "object") {
      if (typeof studio.bossConfrontation.status !== "string") {
        studio.bossConfrontation.status = "in_progress";
      }
      if (!Number.isFinite(studio.bossConfrontation.stageIndex)) {
        studio.bossConfrontation.stageIndex = 0;
      }
      if (typeof studio.bossConfrontation.stageKey !== "string") {
        studio.bossConfrontation.stageKey = null;
      }
      if (!Number.isFinite(studio.bossConfrontation.stageStartDay)) {
        studio.bossConfrontation.stageStartDay = null;
      }
      if (!Number.isFinite(studio.bossConfrontation.stageCompleteDay)) {
        studio.bossConfrontation.stageCompleteDay = null;
      }
      if (typeof studio.bossConfrontation.stageReady !== "boolean") {
        studio.bossConfrontation.stageReady = false;
      }
    }
  });
  if (!takeover.performers || typeof takeover.performers !== "object" || Array.isArray(takeover.performers)) {
    takeover.performers = {};
  }
  Object.keys(performerConfig).forEach(function (performerId) {
    const performer = performerConfig[performerId] || {};
    const resolvedTier = typeof performer.tier === "string"
      ? performer.tier
      : (Number.isFinite(performer.tier) ? (performer.tier >= 3 ? "tier3" : performer.tier >= 2 ? "tier2" : "tier1") : "tier1");
    const resolvedWeakness = typeof performer.weaknessType === "string"
      ? performer.weaknessType
      : (typeof performer.weakness === "string" ? performer.weakness : "ambition");
    if (!takeover.performers[performerId] || typeof takeover.performers[performerId] !== "object") {
      takeover.performers[performerId] = {
        id: performerId,
        studioId: performer.studioId || null,
        status: "locked",
        tier: resolvedTier,
        weaknessType: resolvedWeakness,
        currentStage: null,
        stageStartDay: null,
        stageCompleteDay: null,
        stageReady: false,
        attemptCount: 0,
        nextAvailableDay: 0,
        lastOutcome: null,
        lockReason: null
      };
      return;
    }
    const performerState = takeover.performers[performerId];
    if (typeof performerState.id !== "string") {
      performerState.id = performerId;
    }
    if (typeof performerState.studioId !== "string") {
      performerState.studioId = performer.studioId || null;
    }
    if (typeof performerState.status !== "string") {
      performerState.status = "locked";
    }
    if (typeof performerState.tier !== "string") {
      performerState.tier = resolvedTier;
    }
    if (typeof performerState.weaknessType !== "string") {
      performerState.weaknessType = resolvedWeakness;
    }
    if (performerState.currentStage !== null && typeof performerState.currentStage !== "string") {
      performerState.currentStage = null;
    }
    if (!Number.isFinite(performerState.stageStartDay)) {
      performerState.stageStartDay = null;
    }
    if (!Number.isFinite(performerState.stageCompleteDay)) {
      performerState.stageCompleteDay = null;
    }
    if (typeof performerState.stageReady !== "boolean") {
      performerState.stageReady = false;
    }
    if (!Number.isFinite(performerState.attemptCount) || performerState.attemptCount < 0) {
      performerState.attemptCount = 0;
    }
    if (!Number.isFinite(performerState.nextAvailableDay) || performerState.nextAvailableDay < 0) {
      performerState.nextAvailableDay = 0;
    }
    if (performerState.lastOutcome !== null && typeof performerState.lastOutcome !== "string") {
      performerState.lastOutcome = null;
    }
    if (performerState.lockReason !== null && typeof performerState.lockReason !== "string") {
      performerState.lockReason = null;
    }
  });
  if (!takeover.bossConfrontations || typeof takeover.bossConfrontations !== "object" || Array.isArray(takeover.bossConfrontations)) {
    takeover.bossConfrontations = {};
  }
  if (!takeover.gallery || typeof takeover.gallery !== "object" || Array.isArray(takeover.gallery)) {
    takeover.gallery = { bosses: {}, trophies: {}, notes: [] };
  }
  if (!takeover.gallery.bosses || typeof takeover.gallery.bosses !== "object" || Array.isArray(takeover.gallery.bosses)) {
    const legacyBosses = Array.isArray(takeover.gallery.bosses) ? takeover.gallery.bosses : [];
    const bossMap = {};
    legacyBosses.forEach(function (bossId) {
      if (typeof bossId === "string") {
        bossMap[bossId] = { defeatedDay: null, studioId: null };
      }
    });
    takeover.gallery.bosses = bossMap;
  }
  if (!takeover.gallery.trophies || typeof takeover.gallery.trophies !== "object" || Array.isArray(takeover.gallery.trophies)) {
    takeover.gallery.trophies = {};
  }
  if (!Array.isArray(takeover.gallery.notes)) {
    takeover.gallery.notes = [];
  }
  if (!takeover.retaliation || typeof takeover.retaliation !== "object" || Array.isArray(takeover.retaliation)) {
    takeover.retaliation = {
      nextPoachDay: null,
      pending: null,
      lastResolvedDay: null,
      totalAttempts: 0,
      totalLosses: 0,
      totalDefenses: 0
    };
  }
  if (!Number.isFinite(takeover.retaliation.nextPoachDay)) {
    takeover.retaliation.nextPoachDay = null;
  }
  if (takeover.retaliation.pending !== null && typeof takeover.retaliation.pending !== "object") {
    takeover.retaliation.pending = null;
  }
  if (!Number.isFinite(takeover.retaliation.lastResolvedDay)) {
    takeover.retaliation.lastResolvedDay = null;
  }
  if (!Number.isFinite(takeover.retaliation.totalAttempts) || takeover.retaliation.totalAttempts < 0) {
    takeover.retaliation.totalAttempts = 0;
  }
  if (!Number.isFinite(takeover.retaliation.totalLosses) || takeover.retaliation.totalLosses < 0) {
    takeover.retaliation.totalLosses = 0;
  }
  if (!Number.isFinite(takeover.retaliation.totalDefenses) || takeover.retaliation.totalDefenses < 0) {
    takeover.retaliation.totalDefenses = 0;
  }
  const unlockDay = Number.isFinite(takeoverConfig.unlockDay) ? takeoverConfig.unlockDay : null;
  const currentDay = gameState.player && Number.isFinite(gameState.player.day) ? gameState.player.day : null;
  const minDelay = Number.isFinite(takeoverConfig.retaliation && takeoverConfig.retaliation.minDaysBetweenEvents)
    ? takeoverConfig.retaliation.minDaysBetweenEvents
    : 7;
  const maxDelay = Number.isFinite(takeoverConfig.retaliation && takeoverConfig.retaliation.maxDaysBetweenEvents)
    ? takeoverConfig.retaliation.maxDaysBetweenEvents
    : 14;
  if (takeover.retaliation.nextPoachDay === null && currentDay !== null && unlockDay !== null && currentDay >= unlockDay) {
    const roll = typeof randomIntInclusive === "function" ? randomIntInclusive(minDelay, maxDelay) : minDelay;
    takeover.retaliation.nextPoachDay = currentDay + roll;
  }
  if (!takeover.stats || typeof takeover.stats !== "object" || Array.isArray(takeover.stats)) {
    takeover.stats = defaults.stats;
    return;
  }
  const stats = takeover.stats;
  Object.keys(defaults.stats).forEach(function (key) {
    if (!Number.isFinite(stats[key]) || stats[key] < 0) {
      stats[key] = defaults.stats[key];
    }
  });
}
