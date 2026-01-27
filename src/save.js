function resolveSaveSlotId(slotId) {
  const slots = Array.isArray(CONFIG.save.slots) ? CONFIG.save.slots : [];
  const validIds = slots.map(function (slot) {
    return slot.id;
  });
  if (slotId && validIds.indexOf(slotId) !== -1) {
    return slotId;
  }
  return CONFIG.save.default_slot_id;
}

function getSaveSlotKey(slotId) {
  const resolvedSlotId = resolveSaveSlotId(slotId);
  if (resolvedSlotId === CONFIG.save.default_slot_id) {
    return CONFIG.save.localstorage_key;
  }
  return CONFIG.save.localstorage_key + "_" + resolvedSlotId;
}

function saveGame(gameState, slotId) {
  if (!gameState) {
    return { ok: false, message: "No game state to save." };
  }
  const now = new Date().toISOString();
  gameState.updatedAt = now;
  try {
    const payload = JSON.stringify(gameState);
    localStorage.setItem(getSaveSlotKey(slotId), payload);
    return { ok: true, message: "Save complete." };
  } catch (error) {
    console.error("Save failed:", error);
    return { ok: false, message: "Save failed." };
  }
}

function loadGame(slotId) {
  try {
    const saved = localStorage.getItem(getSaveSlotKey(slotId));
    if (!saved) {
      return { ok: false, message: "No saved game found." };
    }
    const parsed = JSON.parse(saved);
    const migration = migrateGameState(parsed);
    if (!migration.ok) {
      return { ok: false, message: migration.message || "Save migration failed." };
    }
    const validation = validateGameState(migration.gameState);
    if (!validation.ok) {
      return { ok: false, message: validation.message || "Save data invalid." };
    }
    if (migration.didReset) {
      const saveResult = saveGame(migration.gameState, slotId);
      if (!saveResult.ok) {
        return { ok: false, message: saveResult.message || "Save failed." };
      }
      return { ok: true, gameState: migration.gameState, message: migration.message };
    }
    return { ok: true, gameState: migration.gameState, message: "Save loaded." };
  } catch (error) {
    console.error("Load failed:", error);
    return { ok: false, message: "Load failed." };
  }
}

function resetSave(slotId) {
  try {
    localStorage.removeItem(getSaveSlotKey(slotId));
    return { ok: true, message: "Save cleared." };
  } catch (error) {
    console.error("Reset failed:", error);
    return { ok: false, message: "Reset failed." };
  }
}

function exportSaveToFile(gameState) {
  if (!gameState) {
    return { ok: false, message: "No game state to export." };
  }
  const filename = CONFIG.save.export_file_prefix + "-" + new Date().toISOString() + "." + CONFIG.save.export_file_extension;
  const data = JSON.stringify(gameState, null, 2);
  const blob = new Blob([data], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  return { ok: true, message: "Export complete." };
}

function importSaveFromFile() {
  return new Promise(function (resolve) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "application/json,.json";
    input.addEventListener("change", function () {
      const file = input.files && input.files[0];
      if (!file) {
        resolve({ ok: false, message: "No file selected." });
        return;
      }
      const reader = new FileReader();
      reader.onload = function () {
        try {
          const parsed = JSON.parse(reader.result);
          const migration = migrateGameState(parsed);
          if (!migration.ok) {
            resolve({ ok: false, message: migration.message || "Import migration failed." });
            return;
          }
          const validation = validateGameState(migration.gameState);
          if (!validation.ok) {
            resolve({ ok: false, message: validation.message || "Import data invalid." });
            return;
          }
          if (migration.didReset) {
            resolve({ ok: true, gameState: migration.gameState, message: migration.message });
            return;
          }
          resolve({ ok: true, gameState: migration.gameState, message: "Import complete." });
        } catch (error) {
          console.error("Import failed:", error);
          resolve({ ok: false, message: "Import failed." });
        }
      };
      reader.onerror = function () {
        resolve({ ok: false, message: "Import failed." });
      };
      reader.readAsText(file);
    });
    input.click();
  });
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
  const profileIds = getFreelancerProfileIds();
  if (profileIds.length === 0) {
    return null;
  }
  let candidates = profileIds;
  if (avoidId) {
    const filtered = profileIds.filter(function (profileId) {
      return profileId !== avoidId;
    });
    candidates = filtered.length ? filtered : profileIds;
  }
  const index = Math.floor(Math.random() * candidates.length);
  return candidates[index] || profileIds[0];
}

function buildRosterPerformer(performerId) {
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

function ensureRosterCompleteness(candidate) {
  if (!candidate || !candidate.roster || !Array.isArray(candidate.roster.performers)) {
    return;
  }
  const roster = candidate.roster;
  const rosterIds = roster.performers.map(function (entry) {
    return entry.id;
  });
  const catalogIds = CONFIG.performers.core_ids;
  const missingIds = catalogIds.filter(function (performerId) {
    return rosterIds.indexOf(performerId) === -1;
  });
  missingIds.forEach(function (performerId) {
    const entry = buildRosterPerformer(performerId);
    if (entry) {
      roster.performers.push(entry);
      rosterIds.push(entry.id);
    }
  });
}

function pruneFreelanceRosterEntries(candidate) {
  if (!candidate || !candidate.roster || !Array.isArray(candidate.roster.performers)) {
    return;
  }
  const removedIds = new Set();
  candidate.roster.performers = candidate.roster.performers.filter(function (entry) {
    if (!entry || entry.type !== "freelance") {
      return true;
    }
    if (entry.id) {
      removedIds.add(entry.id);
    }
    return false;
  });
  if (removedIds.size === 0) {
    return;
  }
  const profiles = candidate.roster.freelancerProfiles;
  if (profiles && typeof profiles === "object" && !Array.isArray(profiles)) {
    Object.keys(profiles).forEach(function (performerId) {
      if (removedIds.has(performerId)) {
        delete profiles[performerId];
      }
    });
  }
  const management = candidate.performerManagement;
  if (!management || typeof management !== "object") {
    return;
  }
  ["contracts", "availability", "retentionFlags"].forEach(function (key) {
    const bucket = management[key];
    if (!bucket || typeof bucket !== "object") {
      return;
    }
    removedIds.forEach(function (performerId) {
      if (bucket[performerId] !== undefined) {
        delete bucket[performerId];
      }
    });
  });
}

function ensureFreelancerProfilesState(candidate) {
  if (!candidate || !candidate.roster || !Array.isArray(candidate.roster.performers)) {
    return;
  }
  if (!candidate.roster.freelancerProfiles || typeof candidate.roster.freelancerProfiles !== "object" || Array.isArray(candidate.roster.freelancerProfiles)) {
    candidate.roster.freelancerProfiles = {};
  }
  const profileIds = getFreelancerProfileIds();
  if (profileIds.length === 0) {
    return;
  }
  const assignments = candidate.roster.freelancerProfiles;
  candidate.roster.performers.forEach(function (performer) {
    if (!performer || performer.type !== "freelance") {
      return;
    }
    const current = assignments[performer.id];
    if (profileIds.indexOf(current) === -1) {
      const profileId = getRandomFreelancerProfileId();
      if (profileId) {
        assignments[performer.id] = profileId;
      }
    }
  });
}

function ensurePerformerManagementState(candidate) {
  if (!candidate) {
    return;
  }
  if (!candidate.performerManagement || typeof candidate.performerManagement !== "object") {
    candidate.performerManagement = { contracts: {}, availability: {}, retentionFlags: {} };
  }
  const management = candidate.performerManagement;
  if (!management.contracts || typeof management.contracts !== "object") {
    management.contracts = {};
  }
  if (!management.availability || typeof management.availability !== "object") {
    management.availability = {};
  }
  if (!management.retentionFlags || typeof management.retentionFlags !== "object") {
    management.retentionFlags = {};
  }
  if (candidate.roster && Array.isArray(candidate.roster.performers)) {
    candidate.roster.performers.forEach(function (performer) {
      ensurePerformerManagementForId(candidate, performer);
    });
  }
}

function ensurePerformerStarPowerProgress(candidate) {
  if (!candidate || !candidate.roster || !Array.isArray(candidate.roster.performers)) {
    return;
  }
  candidate.roster.performers.forEach(function (performer) {
    if (!performer) {
      return;
    }
    if (!Number.isFinite(performer.starPowerShoots) || performer.starPowerShoots < 0) {
      performer.starPowerShoots = 0;
    }
  });
}

function ensureContentVarianceState(candidate) {
  if (!candidate) {
    return;
  }
  if (!candidate.content || typeof candidate.content !== "object") {
    candidate.content = { lastContentId: null, entries: [] };
  }
  if (!candidate.content.variance || typeof candidate.content.variance !== "object") {
    candidate.content.variance = buildDefaultContentVarianceState();
  }

  const variance = candidate.content.variance;
  const config = (CONFIG.content && CONFIG.content.variance && typeof CONFIG.content.variance === "object")
    ? CONFIG.content.variance
    : {};

  if (typeof variance.enabled !== "boolean") {
    variance.enabled = typeof config.enabled === "boolean" ? config.enabled : true;
  }
  if (!Number.isFinite(variance.seed)) {
    variance.seed = buildDefaultContentVarianceState().seed;
  } else {
    variance.seed = variance.seed >>> 0;
  }
  if (!Array.isArray(variance.rollLog)) {
    variance.rollLog = [];
  }

  const maxEntries = Number.isFinite(config.maxRollLogEntries) ? config.maxRollLogEntries : 100;
  if (variance.rollLog.length > maxEntries) {
    variance.rollLog = variance.rollLog.slice(-maxEntries);
  }
}

function getShootPhotoConfigForSave() {
  if (CONFIG.shootPhotos && typeof CONFIG.shootPhotos === "object") {
    return CONFIG.shootPhotos;
  }
  return { count: 0, placeholderPath: CONFIG.SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH };
}

function buildShootPhotoPathsForSave() {
  const config = getShootPhotoConfigForSave();
  const count = Number.isFinite(config.count) ? Math.max(0, Math.floor(config.count)) : 0;
  const placeholderPath = config.placeholderPath || CONFIG.SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH;
  return Array.from({ length: count }, function () {
    return placeholderPath;
  });
}

function ensureContentEntryPhotoPaths(candidate) {
  if (!candidate || !candidate.content || !Array.isArray(candidate.content.entries)) {
    return;
  }
  const defaults = buildShootPhotoPathsForSave();
  candidate.content.entries.forEach(function (entry) {
    if (!entry) {
      return;
    }
    if (!Array.isArray(entry.photoPaths) || entry.photoPaths.length === 0) {
      entry.photoPaths = defaults.slice();
      return;
    }
    const sanitized = entry.photoPaths.filter(function (path) {
      return typeof path === "string" && path.trim().length > 0;
    });
    if (sanitized.length === 0) {
      entry.photoPaths = defaults.slice();
      return;
    }
    while (sanitized.length < defaults.length) {
      sanitized.push(defaults[sanitized.length] || defaults[0]);
    }
    entry.photoPaths = sanitized;
  });
}

function getCompetitionConfigForSave() {
  if (CONFIG.competition && typeof CONFIG.competition === "object") {
    return CONFIG.competition;
  }
  return {};
}

function buildDefaultRivalStudiosForSave() {
  const config = getCompetitionConfigForSave();
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

function ensureCompetitionState(candidate) {
  if (!candidate) {
    return;
  }
  if (!candidate.rivals || typeof candidate.rivals !== "object") {
    candidate.rivals = { studios: [], lastCheckDay: 0 };
  }
  if (!Array.isArray(candidate.rivals.studios)) {
    candidate.rivals.studios = [];
  }
  if (!Number.isFinite(candidate.rivals.lastCheckDay)) {
    candidate.rivals.lastCheckDay = 0;
  }
  if (candidate.rivals.studios.length === 0) {
    candidate.rivals.studios = buildDefaultRivalStudiosForSave();
  }

  if (!candidate.market || typeof candidate.market !== "object") {
    candidate.market = { activeShiftId: null, shiftHistory: [], saturation: { active: false, activatedDay: null } };
  }
  if (typeof candidate.market.activeShiftId !== "string" && candidate.market.activeShiftId !== null) {
    candidate.market.activeShiftId = null;
  }
  if (!Array.isArray(candidate.market.shiftHistory)) {
    candidate.market.shiftHistory = [];
  }
  if (!candidate.market.saturation || typeof candidate.market.saturation !== "object") {
    candidate.market.saturation = { active: false, activatedDay: null };
  }
  if (typeof candidate.market.saturation.active !== "boolean") {
    candidate.market.saturation.active = false;
  }
  if (!Number.isFinite(candidate.market.saturation.activatedDay)) {
    candidate.market.saturation.activatedDay = null;
  }
  const saturationConfig = CONFIG.market && CONFIG.market.saturation ? CONFIG.market.saturation : null;
  if (saturationConfig && saturationConfig.enabledAfterDebt === true) {
    const debtPaid = candidate.player && Number.isFinite(candidate.player.debtRemaining)
      ? candidate.player.debtRemaining <= 0
      : false;
    if (debtPaid && !candidate.market.saturation.active) {
      candidate.market.saturation.active = true;
      candidate.market.saturation.activatedDay = Number.isFinite(candidate.player.day)
        ? candidate.player.day
        : candidate.market.saturation.activatedDay;
    }
  }
}

function ensureReputationState(candidate) {
  if (!candidate) {
    return;
  }
  if (!candidate.reputation || typeof candidate.reputation !== "object") {
    candidate.reputation = buildDefaultReputationState();
    return;
  }
  if (typeof candidate.reputation.branchId !== "string" && candidate.reputation.branchId !== null) {
    candidate.reputation.branchId = null;
  }
  if (!Number.isFinite(candidate.reputation.branchProgress)) {
    candidate.reputation.branchProgress = 0;
  }
}

function ensureLegacyMilestonesState(candidate) {
  if (!candidate) {
    return;
  }
  if (!Array.isArray(candidate.legacyMilestones)) {
    candidate.legacyMilestones = [];
  }
}

function ensurePlayerUpgradesState(candidate) {
  if (!candidate || !candidate.player) {
    return;
  }
  if (!candidate.player.upgrades || typeof candidate.player.upgrades !== "object" || Array.isArray(candidate.player.upgrades)) {
    candidate.player.upgrades = { managerHired: false };
    return;
  }
  if (typeof candidate.player.upgrades.managerHired !== "boolean") {
    candidate.player.upgrades.managerHired = false;
  }
}

function migrateGameState(candidate) {
  if (!candidate || typeof candidate !== "object") {
    return { ok: false, message: "Save data missing." };
  }

  const currentVersion = CONFIG.save.save_schema_version;
  const candidateVersion = candidate.version;

  if (!Number.isFinite(candidateVersion)) {
    return {
      ok: true,
      gameState: newGameState(),
      didReset: true,
      message: "Major update: resetting save for v4 schema."
    };
  }

  if (candidateVersion !== currentVersion) {
    if (candidateVersion === 3 && currentVersion === 4) {
      candidate.version = currentVersion;
    } else {
      return {
        ok: true,
        gameState: newGameState(),
        didReset: true,
        message: "Major update: resetting save for v4 schema."
      };
    }
  }

  // Version 4 migration: ensure new performer star power progression fields.
  if (candidate.player && !Number.isFinite(candidate.player.shootsToday)) {
    candidate.player.shootsToday = 0;
  }
  if (!candidate.player || typeof candidate.player.agencyPackUsedToday !== "boolean") {
    if (!candidate.player) {
      candidate.player = newGameState().player;
    }
    candidate.player.agencyPackUsedToday = false;
  }
  if (!candidate.social || typeof candidate.social !== "object") {
    candidate.social = { posts: [] };
  }
  if (!Array.isArray(candidate.social.posts)) {
    candidate.social.posts = [];
  }
  if (!candidate.social.manualStrategy || typeof candidate.social.manualStrategy !== "object") {
    candidate.social.manualStrategy = buildDefaultManualStrategyState();
  } else {
    const manualStrategy = candidate.social.manualStrategy;
    if (!Number.isFinite(manualStrategy.dailyBudget) ||
      !manualStrategy.allocations ||
      typeof manualStrategy.allocations !== "object" ||
      Array.isArray(manualStrategy.allocations) ||
      (manualStrategy.lastAppliedDay !== null && !Number.isFinite(manualStrategy.lastAppliedDay))
    ) {
      candidate.social.manualStrategy = buildDefaultManualStrategyState();
    }
  }
  if (!Array.isArray(candidate.milestones)) {
    candidate.milestones = [];
  }
  if (!candidate.story || typeof candidate.story !== "object") {
    candidate.story = {};
  }
  if (typeof candidate.story.introShown !== "boolean") {
    candidate.story.introShown = false;
  }
  if (!Array.isArray(candidate.story.debtReminderDaysShown)) {
    candidate.story.debtReminderDaysShown = [];
  }
  if (!candidate.story.act2 || typeof candidate.story.act2 !== "object" || Array.isArray(candidate.story.act2)) {
    candidate.story.act2 = { eventsShown: [], lastEventId: null };
  }
  if (!Array.isArray(candidate.story.act2.eventsShown)) {
    candidate.story.act2.eventsShown = [];
  }
  if (typeof candidate.story.act2.lastEventId !== "string" && candidate.story.act2.lastEventId !== null) {
    candidate.story.act2.lastEventId = null;
  }
  if (!candidate.story.act3 || typeof candidate.story.act3 !== "object" || Array.isArray(candidate.story.act3)) {
    candidate.story.act3 = { eventsShown: [], lastEventId: null };
  }
  if (!Array.isArray(candidate.story.act3.eventsShown)) {
    candidate.story.act3.eventsShown = [];
  }
  if (typeof candidate.story.act3.lastEventId !== "string" && candidate.story.act3.lastEventId !== null) {
    candidate.story.act3.lastEventId = null;
  }
  if (!Array.isArray(candidate.storyLog)) {
    candidate.storyLog = [];
  }
  pruneFreelanceRosterEntries(candidate);
  ensureRosterCompleteness(candidate);
  ensurePerformerStarPowerProgress(candidate);
  ensureFreelancerProfilesState(candidate);
  ensurePerformerManagementState(candidate);
  ensureContentVarianceState(candidate);
  ensureContentEntryPhotoPaths(candidate);
  ensureCompetitionState(candidate);
  ensureReputationState(candidate);
  ensureRecruitmentState(candidate);
  ensureLegacyMilestonesState(candidate);
  ensurePlayerUpgradesState(candidate);
  return { ok: true, gameState: candidate, didReset: false };
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

function validateGameState(candidate) {
  if (!candidate || typeof candidate !== "object") {
    return { ok: false, message: "Save data missing." };
  }

  const allowedTopLevel = [
    "version",
    "createdAt",
    "updatedAt",
    "player",
    "roster",
    "content",
    "shootOutputs",
    "social",
    "unlocks",
    "story",
    "storyLog",
    "rng",
    "performerManagement",
    "analyticsHistory",
    "equipment",
    "milestones",
    "legacyMilestones",
    "automation",
    "rivals",
    "market",
    "reputation",
    "recruitment"
  ];
  const keys = Object.keys(candidate);
  const hasUnknown = keys.some(function (key) {
    return allowedTopLevel.indexOf(key) === -1;
  });
  if (hasUnknown) {
    return { ok: false, message: "Save data has unsupported fields." };
  }

  if (candidate.version !== CONFIG.save.save_schema_version) {
    return { ok: false, message: "Save version not supported." };
  }

  if (typeof candidate.createdAt !== "string" || typeof candidate.updatedAt !== "string") {
    return { ok: false, message: "Save timestamps invalid." };
  }

  const player = candidate.player;
  if (!player || typeof player !== "object") {
    return { ok: false, message: "Player data missing." };
  }

  const requiredNumbers = [
    "day",
    "cash",
    "debtRemaining",
    "debtDueDay",
    "shootsToday",
    "socialFollowers",
    "socialSubscribers",
    "onlyFansSubscribers",
    "reputation"
  ];
  for (let index = 0; index < requiredNumbers.length; index += 1) {
    const key = requiredNumbers[index];
    if (!Number.isFinite(player[key]) || player[key] < 0) {
      return { ok: false, message: "Player stats invalid." };
    }
  }

  if (player.day < 1 || player.day > CONFIG.game.max_day) {
    return { ok: false, message: "Player day out of range." };
  }

  if (typeof player.agencyPackUsedToday !== "boolean") {
    return { ok: false, message: "Player agency pack usage invalid." };
  }

  if (!player.upgrades || typeof player.upgrades !== "object" || Array.isArray(player.upgrades)) {
    player.upgrades = { managerHired: false };
  }
  if (typeof player.upgrades.managerHired !== "boolean") {
    player.upgrades.managerHired = false;
  }

  const roster = candidate.roster;
  if (!roster || !Array.isArray(roster.performers)) {
    return { ok: false, message: "Roster data invalid." };
  }
  if (roster.freelancerProfiles !== undefined && (typeof roster.freelancerProfiles !== "object" || roster.freelancerProfiles === null || Array.isArray(roster.freelancerProfiles))) {
    return { ok: false, message: "Roster freelancer profiles invalid." };
  }

  const performerIds = roster.performers.map(function (entry) {
    return entry.id;
  });
  const uniquePerformerIds = new Set(performerIds);
  if (uniquePerformerIds.size !== performerIds.length) {
    return { ok: false, message: "Performer IDs must be unique." };
  }

  for (let index = 0; index < roster.performers.length; index += 1) {
    const performer = roster.performers[index];
    if (!performer || typeof performer.id !== "string") {
      return { ok: false, message: "Performer entry invalid." };
    }
    if (CONFIG.performers.catalog[performer.id] === undefined) {
      return { ok: false, message: "Unknown performer detected." };
    }
    if (["core", "freelance"].indexOf(performer.type) === -1) {
      return { ok: false, message: "Performer type invalid." };
    }
    if (!Number.isFinite(performer.starPower) ||
      !Number.isFinite(performer.starPowerShoots) ||
      !Number.isFinite(performer.fatigue) ||
      !Number.isFinite(performer.loyalty)
    ) {
      return { ok: false, message: "Performer stats invalid." };
    }
    if (performer.fatigue < 0 || performer.fatigue > CONFIG.performers.max_fatigue) {
      return { ok: false, message: "Performer fatigue invalid." };
    }
    if (performer.starPowerShoots < 0) {
      return { ok: false, message: "Performer star power progress invalid." };
    }
  }
  if (roster.freelancerProfiles) {
    const profileIds = getFreelancerProfileIds();
    const profileKeys = Object.keys(roster.freelancerProfiles);
    for (let index = 0; index < profileKeys.length; index += 1) {
      const performerId = profileKeys[index];
      const profileId = roster.freelancerProfiles[performerId];
      if (profileIds.length && profileIds.indexOf(profileId) === -1) {
        return { ok: false, message: "Freelancer profile invalid." };
      }
    }
  }

  const content = candidate.content;
  if (!content || !Array.isArray(content.entries)) {
    return { ok: false, message: "Content data invalid." };
  }

  const contentIds = content.entries.map(function (entry) {
    return entry.id;
  });
  const uniqueContentIds = new Set(contentIds);
  if (uniqueContentIds.size !== contentIds.length) {
    return { ok: false, message: "Content IDs must be unique." };
  }

  if (content.lastContentId !== null && contentIds.indexOf(content.lastContentId) === -1) {
    return { ok: false, message: "Last content reference invalid." };
  }

  for (let index = 0; index < content.entries.length; index += 1) {
    const entry = content.entries[index];
    if (!entry || typeof entry.id !== "string") {
      return { ok: false, message: "Content entry invalid." };
    }
    if (!Number.isFinite(entry.dayCreated)) {
      return { ok: false, message: "Content day invalid." };
    }
    const source = entry.source || "core";
    if (["core", "agency_pack"].indexOf(source) === -1) {
      return { ok: false, message: "Content source invalid." };
    }
    if (source !== "agency_pack" && performerIds.indexOf(entry.performerId) === -1) {
      return { ok: false, message: "Content performer invalid." };
    }
    if (typeof entry.locationId !== "string" || entry.locationId.length === 0) {
      return { ok: false, message: "Content location invalid." };
    }
    if (entry.themeId !== null && typeof entry.themeId !== "string") {
      return { ok: false, message: "Content theme invalid." };
    }
    if (CONFIG.content_types.available.indexOf(entry.contentType) === -1) {
      return { ok: false, message: "Content type invalid." };
    }
    if (!Number.isFinite(entry.shootCost) || entry.shootCost < 0) {
      return { ok: false, message: "Content cost invalid." };
    }
    if (!entry.results ||
      !Number.isFinite(entry.results.socialFollowersGained) ||
      !Number.isFinite(entry.results.socialSubscribersGained) ||
      !Number.isFinite(entry.results.onlyFansSubscribersGained)
    ) {
      return { ok: false, message: "Content results invalid." };
    }
    if (entry.results.socialFollowersGained < 0 ||
      entry.results.socialSubscribersGained < 0 ||
      entry.results.onlyFansSubscribersGained < 0
    ) {
      return { ok: false, message: "Content results invalid." };
    }
    if (typeof entry.results.feedbackSummary !== "string" || entry.results.feedbackSummary.length === 0) {
      return { ok: false, message: "Content feedback invalid." };
    }
    if (!Array.isArray(entry.photoPaths) || entry.photoPaths.length === 0) {
      return { ok: false, message: "Content photos invalid." };
    }
    const hasInvalidPhoto = entry.photoPaths.some(function (path) {
      return typeof path !== "string" || path.length === 0;
    });
    if (hasInvalidPhoto) {
      return { ok: false, message: "Content photos invalid." };
    }
  }

  let social = candidate.social;
  if (!social || typeof social !== "object") {
    social = { posts: [] };
    candidate.social = social;
  }
  if (!Array.isArray(social.posts)) {
    social.posts = [];
  }
  if (social.strategy !== undefined && (typeof social.strategy !== "object" || social.strategy === null || Array.isArray(social.strategy))) {
    return { ok: false, message: "Social strategy invalid." };
  }
  if (social.manualStrategy !== undefined) {
    if (typeof social.manualStrategy !== "object" || social.manualStrategy === null || Array.isArray(social.manualStrategy)) {
      return { ok: false, message: "Manual social strategy invalid." };
    }
    if (!Number.isFinite(social.manualStrategy.dailyBudget)) {
      return { ok: false, message: "Manual social budget invalid." };
    }
    if (!social.manualStrategy.allocations || typeof social.manualStrategy.allocations !== "object" || Array.isArray(social.manualStrategy.allocations)) {
      return { ok: false, message: "Manual social allocations invalid." };
    }
    if (social.manualStrategy.lastAppliedDay !== null && !Number.isFinite(social.manualStrategy.lastAppliedDay)) {
      return { ok: false, message: "Manual social strategy day invalid." };
    }
  }

  for (let index = 0; index < social.posts.length; index += 1) {
    const post = social.posts[index];
    if (!post || typeof post.id !== "string") {
      return { ok: false, message: "Social post invalid." };
    }
    if (!Number.isFinite(post.dayPosted)) {
      return { ok: false, message: "Social day invalid." };
    }
    if (CONFIG.social_platforms.platforms.indexOf(post.platform) === -1) {
      return { ok: false, message: "Social platform invalid." };
    }
    if (contentIds.indexOf(post.contentId) === -1) {
      return { ok: false, message: "Social content invalid." };
    }
    const contentEntry = content.entries.find(function (entry) {
      return entry.id === post.contentId;
    });
    if (!contentEntry || contentEntry.contentType !== "Promo") {
      return { ok: false, message: "Social content invalid." };
    }
    if (!Number.isFinite(post.socialFollowersGained) ||
      !Number.isFinite(post.socialSubscribersGained) ||
      !Number.isFinite(post.onlyFansSubscribersGained)
    ) {
      return { ok: false, message: "Social impact invalid." };
    }
    if (post.socialFollowersGained < 0 ||
      post.socialSubscribersGained < 0 ||
      post.onlyFansSubscribersGained < 0
    ) {
      return { ok: false, message: "Social impact invalid." };
    }
  }

  if (!candidate.unlocks || typeof candidate.unlocks.locationTier1Unlocked !== "boolean") {
    return { ok: false, message: "Unlock data invalid." };
  }
  const locationTiers = candidate.unlocks.locationTiers;
  if (!locationTiers || typeof locationTiers !== "object" || Array.isArray(locationTiers)) {
    return { ok: false, message: "Unlock tier data invalid." };
  }
  const requiredTierFlags = ["tier0", "tier1"];
  for (let index = 0; index < requiredTierFlags.length; index += 1) {
    const key = requiredTierFlags[index];
    if (typeof locationTiers[key] !== "boolean") {
      return { ok: false, message: "Unlock tier data invalid." };
    }
  }
  if (locationTiers.tier2 !== undefined && typeof locationTiers.tier2 !== "boolean") {
    return { ok: false, message: "Unlock tier data invalid." };
  }

  if (!candidate.story || typeof candidate.story.introShown !== "boolean" || !Array.isArray(candidate.story.debtReminderDaysShown)) {
    return { ok: false, message: "Story data invalid." };
  }
  if (candidate.story.act2 !== undefined && (typeof candidate.story.act2 !== "object" || candidate.story.act2 === null || Array.isArray(candidate.story.act2))) {
    return { ok: false, message: "Story act 2 data invalid." };
  }
  for (let index = 0; index < candidate.story.debtReminderDaysShown.length; index += 1) {
    const day = candidate.story.debtReminderDaysShown[index];
    if (!Number.isFinite(day) || day < 1 || day >= player.debtDueDay) {
      return { ok: false, message: "Story reminder data invalid." };
    }
  }

  if (!Array.isArray(candidate.storyLog)) {
    return { ok: false, message: "Story log data invalid." };
  }
  const storyLogIds = candidate.storyLog.map(function (entry) {
    return entry.id;
  });
  const uniqueStoryLogIds = new Set(storyLogIds);
  if (uniqueStoryLogIds.size !== storyLogIds.length) {
    return { ok: false, message: "Story log IDs must be unique." };
  }
  for (let index = 0; index < candidate.storyLog.length; index += 1) {
    const entry = candidate.storyLog[index];
    if (!entry || typeof entry.id !== "string") {
      return { ok: false, message: "Story log entry invalid." };
    }
    if (!Number.isFinite(entry.dayNumber) || entry.dayNumber < 1) {
      return { ok: false, message: "Story log day invalid." };
    }
    if (typeof entry.title !== "string" || typeof entry.body !== "string") {
      return { ok: false, message: "Story log text invalid." };
    }
    if (entry.timestamp !== undefined && typeof entry.timestamp !== "string") {
      return { ok: false, message: "Story log timestamp invalid." };
    }
  }

  if (candidate.performerManagement !== undefined && (typeof candidate.performerManagement !== "object" || candidate.performerManagement === null || Array.isArray(candidate.performerManagement))) {
    return { ok: false, message: "Performer management data invalid." };
  }

  if (candidate.analyticsHistory !== undefined && !Array.isArray(candidate.analyticsHistory)) {
    return { ok: false, message: "Analytics history invalid." };
  }

  if (candidate.equipment !== undefined) {
    if (typeof candidate.equipment !== "object" || candidate.equipment === null || Array.isArray(candidate.equipment)) {
      return { ok: false, message: "Equipment data invalid." };
    }
    const equipmentLevels = ["lightingLevel", "cameraLevel", "setDressingLevel"];
    for (let index = 0; index < equipmentLevels.length; index += 1) {
      const key = equipmentLevels[index];
      if (candidate.equipment[key] !== undefined && !Number.isFinite(candidate.equipment[key])) {
        return { ok: false, message: "Equipment levels invalid." };
      }
    }
  }

  if (candidate.milestones !== undefined && !Array.isArray(candidate.milestones)) {
    return { ok: false, message: "Milestones data invalid." };
  }

  if (candidate.legacyMilestones !== undefined && !Array.isArray(candidate.legacyMilestones)) {
    return { ok: false, message: "Legacy milestones data invalid." };
  }

  if (candidate.recruitment !== undefined) {
    const recruitment = candidate.recruitment;
    if (typeof recruitment !== "object" || recruitment === null || Array.isArray(recruitment)) {
      return { ok: false, message: "Recruitment data invalid." };
    }
    if (!Array.isArray(recruitment.declinedIds) || !Array.isArray(recruitment.hiredIds)) {
      return { ok: false, message: "Recruitment data invalid." };
    }
    const hasBadDeclined = recruitment.declinedIds.some(function (entry) {
      return typeof entry !== "string";
    });
    const hasBadHired = recruitment.hiredIds.some(function (entry) {
      return typeof entry !== "string";
    });
    if (hasBadDeclined || hasBadHired) {
      return { ok: false, message: "Recruitment data invalid." };
    }
  }

  return { ok: true };
}
