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

function migrateGameState(candidate) {
  if (!candidate || typeof candidate !== "object") {
    return { ok: false, message: "Save data missing." };
  }

  const currentVersion = CONFIG.save.save_schema_version;
  const candidateVersion = candidate.version;

  if (!Number.isFinite(candidateVersion) || candidateVersion !== currentVersion) {
    return {
      ok: true,
      gameState: newGameState(),
      didReset: true,
      message: "Incompatible save detected. Starting a new game (v2)."
    };
  }

  // Version 2 -> 2 no-op migration. Keep explicit for future schema updates.
  if (candidate.player && !Number.isFinite(candidate.player.shootsToday)) {
    candidate.player.shootsToday = 0;
  }
  if (!candidate.social || typeof candidate.social !== "object") {
    candidate.social = { posts: [] };
  }
  if (!Array.isArray(candidate.social.posts)) {
    candidate.social.posts = [];
  }
  if (!Array.isArray(candidate.milestones)) {
    candidate.milestones = [];
  }
  return { ok: true, gameState: candidate, didReset: false };
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
    "social",
    "unlocks",
    "story",
    "rng",
    "performerManagement",
    "analyticsHistory",
    "equipment",
    "milestones"
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

  const requiredNumbers = ["day", "cash", "debtRemaining", "debtDueDay", "shootsToday", "followers", "subscribers", "reputation"];
  for (let index = 0; index < requiredNumbers.length; index += 1) {
    const key = requiredNumbers[index];
    if (!Number.isFinite(player[key]) || player[key] < 0) {
      return { ok: false, message: "Player stats invalid." };
    }
  }

  if (player.day < 1 || player.day > player.debtDueDay) {
    return { ok: false, message: "Player day out of range." };
  }

  if (player.shootsToday > CONFIG.game.shoots_per_day) {
    return { ok: false, message: "Player shoots per day out of range." };
  }

  const roster = candidate.roster;
  if (!roster || !Array.isArray(roster.performers)) {
    return { ok: false, message: "Roster data invalid." };
  }
  if (roster.performerRoles !== undefined && (typeof roster.performerRoles !== "object" || roster.performerRoles === null || Array.isArray(roster.performerRoles))) {
    return { ok: false, message: "Roster roles invalid." };
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
    if (!Number.isFinite(performer.starPower) || !Number.isFinite(performer.fatigue) || !Number.isFinite(performer.loyalty)) {
      return { ok: false, message: "Performer stats invalid." };
    }
    if (performer.fatigue < 0 || performer.fatigue > CONFIG.performers.max_fatigue) {
      return { ok: false, message: "Performer fatigue invalid." };
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
    if (performerIds.indexOf(entry.performerId) === -1) {
      return { ok: false, message: "Content performer invalid." };
    }
    if (!CONFIG.locations.catalog[entry.locationId]) {
      return { ok: false, message: "Content location invalid." };
    }
    if (!CONFIG.themes.mvp.themes[entry.themeId]) {
      return { ok: false, message: "Content theme invalid." };
    }
    if (CONFIG.content_types.available.indexOf(entry.contentType) === -1) {
      return { ok: false, message: "Content type invalid." };
    }
    if (!Number.isFinite(entry.shootCost) || entry.shootCost < 0) {
      return { ok: false, message: "Content cost invalid." };
    }
    if (!entry.results || !Number.isFinite(entry.results.revenue) || !Number.isFinite(entry.results.followersGained) || !Number.isFinite(entry.results.subscribersGained)) {
      return { ok: false, message: "Content results invalid." };
    }
    if (entry.results.revenue < 0 || entry.results.followersGained < 0 || entry.results.subscribersGained < 0) {
      return { ok: false, message: "Content results invalid." };
    }
    if (typeof entry.results.feedbackSummary !== "string" || entry.results.feedbackSummary.length === 0) {
      return { ok: false, message: "Content feedback invalid." };
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
    if (!Number.isFinite(post.followersGained) || !Number.isFinite(post.subscribersGained)) {
      return { ok: false, message: "Social impact invalid." };
    }
    if (post.followersGained < 0 || post.subscribersGained < 0) {
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

  return { ok: true };
}
