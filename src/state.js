function newGameState() {
  const now = new Date().toISOString();

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
      performers: CONFIG.performers.core_ids
        .concat(CONFIG.performers.freelance_ids)
        .map(function (id) {
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
      performerRoles: {}
    },
    content: {
      lastContentId: null,
      entries: []
    },
    shootOutputs: [],
    social: {
      posts: [],
      activeSocialStrategyId: CONFIG.social.strategy.defaultStrategyId
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
    performerManagement: { contracts: {}, availability: {}, retentionFlags: {} },
    analyticsHistory: [],
    equipment: { lightingLevel: 0, cameraLevel: 0, setDressingLevel: 0 },
    milestones: [],
    automation: {
      autoBookEnabled: CONFIG.AUTOMATION_AUTO_BOOK_ENABLED_DEFAULT
    }
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
