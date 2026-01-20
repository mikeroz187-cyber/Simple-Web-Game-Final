function getSaveStorageKey() {
  return CONFIG.save.localstorage_key;
}

function buildResult(ok, code, message, data, details) {
  const result = { ok: ok, code: code, message: message };
  if (data !== undefined) {
    result.data = data;
  }
  if (details && details.length) {
    result.details = details;
  }
  return result;
}

function isObject(value) {
  return value && typeof value === "object" && !Array.isArray(value);
}

function isNonEmptyString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function isFiniteNumber(value) {
  return typeof value === "number" && Number.isFinite(value);
}

function isInteger(value) {
  return Number.isInteger(value);
}

function isIsoString(value) {
  if (!isNonEmptyString(value)) {
    return false;
  }
  const time = Date.parse(value);
  if (Number.isNaN(time)) {
    return false;
  }
  return new Date(time).toISOString() === value;
}

function hasOnlyKeys(target, allowedKeys) {
  return Object.keys(target).every(function (key) {
    return allowedKeys.indexOf(key) >= 0;
  });
}

function touchUpdatedAt(gameState) {
  gameState.updatedAt = new Date().toISOString();
}

function migrateSaveData(gameState) {
  if (!isObject(gameState) || !isObject(gameState.story)) {
    return gameState;
  }

  if (isObject(gameState.story.act1)) {
    const eventsShown = Array.isArray(gameState.story.act1.eventsShown) ? gameState.story.act1.eventsShown : [];
    const introId = CONFIG.story.act1 && CONFIG.story.act1.intro ? CONFIG.story.act1.intro.id : null;
    const debtReminders = CONFIG.story.act1 && Array.isArray(CONFIG.story.act1.debtReminders)
      ? CONFIG.story.act1.debtReminders
      : [];

    const debtReminderDaysShown = debtReminders.reduce(function (days, reminder) {
      if (reminder && reminder.id && eventsShown.indexOf(reminder.id) >= 0) {
        days.push(reminder.triggerDay);
      }
      return days;
    }, []);

    gameState.story = {
      introShown: introId ? eventsShown.indexOf(introId) >= 0 : false,
      debtReminderDaysShown: debtReminderDaysShown
    };
  }

  return gameState;
}

function validateGameState(gameState) {
  const errors = [];

  if (!isObject(gameState)) {
    return buildResult(false, "invalid_state", "Save data must be an object.", null, ["State is not an object."]);
  }

  const requiredTopKeys = ["version", "createdAt", "updatedAt", "player", "roster", "content", "social", "unlocks", "story"];
  const optionalTopKeys = ["rng"];
  const allowedTopKeys = requiredTopKeys.concat(optionalTopKeys);

  requiredTopKeys.forEach(function (key) {
    if (!(key in gameState)) {
      errors.push("Missing required key: " + key + ".");
    }
  });

  if (!hasOnlyKeys(gameState, allowedTopKeys)) {
    const invalidKeys = Object.keys(gameState).filter(function (key) {
      return allowedTopKeys.indexOf(key) === -1;
    });
    errors.push("Unknown top-level keys: " + invalidKeys.join(", ") + ".");
  }

  if (!isFiniteNumber(gameState.version) || gameState.version !== CONFIG.save.save_schema_version) {
    errors.push("Save version is missing or unsupported.");
  }

  if (!isIsoString(gameState.createdAt)) {
    errors.push("createdAt must be an ISO 8601 string.");
  }

  if (!isIsoString(gameState.updatedAt)) {
    errors.push("updatedAt must be an ISO 8601 string.");
  }

  if (isIsoString(gameState.createdAt) && isIsoString(gameState.updatedAt)) {
    const createdTime = Date.parse(gameState.createdAt);
    const updatedTime = Date.parse(gameState.updatedAt);
    if (updatedTime < createdTime) {
      errors.push("updatedAt must be later than or equal to createdAt.");
    }
  }

  if (!isObject(gameState.player)) {
    errors.push("player must be an object.");
  } else {
    const allowedPlayerKeys = [
      "day",
      "cash",
      "debtRemaining",
      "debtDueDay",
      "followers",
      "subscribers",
      "reputation",
      "lifetimeRevenue"
    ];
    const requiredPlayerKeys = ["day", "cash", "debtRemaining", "debtDueDay", "followers", "subscribers", "reputation"];

    if (!hasOnlyKeys(gameState.player, allowedPlayerKeys)) {
      errors.push("player contains unknown keys.");
    }

    requiredPlayerKeys.forEach(function (key) {
      if (!(key in gameState.player)) {
        errors.push("player is missing required key: " + key + ".");
      }
    });

    if (!isInteger(gameState.player.day) || gameState.player.day < 1) {
      errors.push("player.day must be an integer >= 1.");
    }

    if (!isInteger(gameState.player.debtDueDay) || gameState.player.debtDueDay !== CONFIG.game.debt_due_day) {
      errors.push("player.debtDueDay must match the configured debt due day.");
    }

    if (isInteger(gameState.player.day) && isInteger(gameState.player.debtDueDay)) {
      if (gameState.player.day > gameState.player.debtDueDay) {
        errors.push("player.day must be <= player.debtDueDay.");
      }
    }

    if (!isFiniteNumber(gameState.player.cash) || gameState.player.cash < 0) {
      errors.push("player.cash must be a finite number >= 0.");
    }

    if (!isFiniteNumber(gameState.player.debtRemaining) || gameState.player.debtRemaining < 0) {
      errors.push("player.debtRemaining must be a finite number >= 0.");
    }

    if (!isInteger(gameState.player.followers) || gameState.player.followers < 0) {
      errors.push("player.followers must be an integer >= 0.");
    }

    if (!isInteger(gameState.player.subscribers) || gameState.player.subscribers < 0) {
      errors.push("player.subscribers must be an integer >= 0.");
    }

    if (!isInteger(gameState.player.reputation) || gameState.player.reputation < 0) {
      errors.push("player.reputation must be an integer >= 0.");
    }

    if ("lifetimeRevenue" in gameState.player) {
      if (!isFiniteNumber(gameState.player.lifetimeRevenue) || gameState.player.lifetimeRevenue < 0) {
        errors.push("player.lifetimeRevenue must be a finite number >= 0.");
      }
    }
  }

  const roster = gameState.roster;
  if (!isObject(roster) || !Array.isArray(roster.performers)) {
    errors.push("roster.performers must be an array.");
  } else {
    if (!hasOnlyKeys(roster, ["performers"])) {
      errors.push("roster contains unknown keys.");
    }

    const performerIds = new Set();
    roster.performers.forEach(function (performer, index) {
      if (!isObject(performer)) {
        errors.push("Performer at index " + index + " must be an object.");
        return;
      }

      const allowedPerformerKeys = ["id", "name", "type", "starPower", "fatigue", "loyalty"];
      if (!hasOnlyKeys(performer, allowedPerformerKeys)) {
        errors.push("Performer at index " + index + " has unknown keys.");
      }

      if (!isNonEmptyString(performer.id)) {
        errors.push("Performer at index " + index + " has an invalid id.");
      } else if (performerIds.has(performer.id)) {
        errors.push("Duplicate performer id: " + performer.id + ".");
      } else {
        performerIds.add(performer.id);
      }

      if (!isNonEmptyString(performer.name)) {
        errors.push("Performer " + performer.id + " must have a name.");
      }

      if (["core", "freelance"].indexOf(performer.type) === -1) {
        errors.push("Performer " + performer.id + " has an invalid type.");
      }

      if (!isFiniteNumber(performer.starPower) || performer.starPower < 0) {
        errors.push("Performer " + performer.id + " has invalid starPower.");
      }

      if (!isFiniteNumber(performer.fatigue) || performer.fatigue < 0 || performer.fatigue > CONFIG.performers.max_fatigue) {
        errors.push("Performer " + performer.id + " has invalid fatigue.");
      }

      if (!isFiniteNumber(performer.loyalty)) {
        errors.push("Performer " + performer.id + " has invalid loyalty.");
      }
    });
  }

  const content = gameState.content;
  const entries = content && Array.isArray(content.entries) ? content.entries : null;
  if (!isObject(content) || !Array.isArray(content.entries)) {
    errors.push("content.entries must be an array.");
  } else {
    if (!hasOnlyKeys(content, ["entries", "lastContentId"])) {
      errors.push("content contains unknown keys.");
    }

    const entryIds = new Set();
    const performerIds = new Set();
    if (gameState.roster && Array.isArray(gameState.roster.performers)) {
      gameState.roster.performers.forEach(function (performer) {
        if (performer && performer.id) {
          performerIds.add(performer.id);
        }
      });
    }

    entries.forEach(function (entry, index) {
      if (!isObject(entry)) {
        errors.push("Content entry at index " + index + " must be an object.");
        return;
      }

      const allowedEntryKeys = [
        "id",
        "dayCreated",
        "performerId",
        "locationId",
        "themeId",
        "contentType",
        "shootCost",
        "results"
      ];

      if (!hasOnlyKeys(entry, allowedEntryKeys)) {
        errors.push("Content entry " + entry.id + " has unknown keys.");
      }

      if (!isNonEmptyString(entry.id)) {
        errors.push("Content entry at index " + index + " has an invalid id.");
      } else if (entryIds.has(entry.id)) {
        errors.push("Duplicate content entry id: " + entry.id + ".");
      } else {
        entryIds.add(entry.id);
      }

      if (!isInteger(entry.dayCreated) || entry.dayCreated < 1) {
        errors.push("Content entry " + entry.id + " has invalid dayCreated.");
      }

      if (!isNonEmptyString(entry.performerId) || !performerIds.has(entry.performerId)) {
        errors.push("Content entry " + entry.id + " has invalid performerId.");
      }

      if (!isNonEmptyString(entry.locationId) || !(entry.locationId in CONFIG.locations.catalog)) {
        errors.push("Content entry " + entry.id + " has invalid locationId.");
      }

      const themeCatalog = CONFIG.themes && CONFIG.themes.mvp ? CONFIG.themes.mvp.themes : {};
      if (!isNonEmptyString(entry.themeId) || !(entry.themeId in themeCatalog)) {
        errors.push("Content entry " + entry.id + " has invalid themeId.");
      }

      if (CONFIG.content_types.available.indexOf(entry.contentType) === -1) {
        errors.push("Content entry " + entry.id + " has invalid contentType.");
      }

      if (!isFiniteNumber(entry.shootCost) || entry.shootCost < 0) {
        errors.push("Content entry " + entry.id + " has invalid shootCost.");
      }

      if (!isObject(entry.results)) {
        errors.push("Content entry " + entry.id + " is missing results.");
      } else {
        const allowedResultsKeys = ["revenue", "followersGained", "subscribersGained", "feedbackSummary"];
        if (!hasOnlyKeys(entry.results, allowedResultsKeys)) {
          errors.push("Content entry " + entry.id + " results has unknown keys.");
        }
        if (!isFiniteNumber(entry.results.revenue) || entry.results.revenue < 0) {
          errors.push("Content entry " + entry.id + " results.revenue must be >= 0.");
        }
        if (!isInteger(entry.results.followersGained) || entry.results.followersGained < 0) {
          errors.push("Content entry " + entry.id + " results.followersGained must be >= 0.");
        }
        if (!isInteger(entry.results.subscribersGained) || entry.results.subscribersGained < 0) {
          errors.push("Content entry " + entry.id + " results.subscribersGained must be >= 0.");
        }
        if (!isNonEmptyString(entry.results.feedbackSummary)) {
          errors.push("Content entry " + entry.id + " results.feedbackSummary must be non-empty.");
        }
      }
    });

    if (content.lastContentId !== null && !isNonEmptyString(content.lastContentId)) {
      errors.push("content.lastContentId must be null or a string.");
    }

    if (content.lastContentId !== null && isNonEmptyString(content.lastContentId)) {
      if (!entryIds.has(content.lastContentId)) {
        errors.push("content.lastContentId must reference an existing entry.");
      }
    }
  }

  const social = gameState.social;
  if (!isObject(social) || !Array.isArray(social.posts)) {
    errors.push("social.posts must be an array.");
  } else {
    if (!hasOnlyKeys(social, ["posts"])) {
      errors.push("social contains unknown keys.");
    }

    const postIds = new Set();
    const contentEntries = entries || [];
    const entryMap = {};
    contentEntries.forEach(function (entry) {
      if (entry && entry.id) {
        entryMap[entry.id] = entry;
      }
    });

    social.posts.forEach(function (post, index) {
      if (!isObject(post)) {
        errors.push("Social post at index " + index + " must be an object.");
        return;
      }

      const allowedPostKeys = ["id", "dayPosted", "platform", "contentId", "followersGained", "subscribersGained"];
      if (!hasOnlyKeys(post, allowedPostKeys)) {
        errors.push("Social post " + post.id + " has unknown keys.");
      }

      if (!isNonEmptyString(post.id)) {
        errors.push("Social post at index " + index + " has invalid id.");
      } else if (postIds.has(post.id)) {
        errors.push("Duplicate social post id: " + post.id + ".");
      } else {
        postIds.add(post.id);
      }

      if (!isInteger(post.dayPosted) || post.dayPosted < 1) {
        errors.push("Social post " + post.id + " has invalid dayPosted.");
      }

      if (CONFIG.social_platforms.platforms.indexOf(post.platform) === -1) {
        errors.push("Social post " + post.id + " has invalid platform.");
      }

      if (!isNonEmptyString(post.contentId) || !entryMap[post.contentId]) {
        errors.push("Social post " + post.id + " references missing content.");
      } else if (entryMap[post.contentId].contentType !== "Promo") {
        errors.push("Social post " + post.id + " must reference Promo content.");
      }

      if (!isInteger(post.followersGained) || post.followersGained < 0) {
        errors.push("Social post " + post.id + " has invalid followersGained.");
      }

      if (!isInteger(post.subscribersGained) || post.subscribersGained < 0) {
        errors.push("Social post " + post.id + " has invalid subscribersGained.");
      }
    });
  }

  const unlocks = gameState.unlocks;
  if (!isObject(unlocks) || typeof unlocks.locationTier1Unlocked !== "boolean") {
    errors.push("unlocks.locationTier1Unlocked must be a boolean.");
  } else if (!hasOnlyKeys(unlocks, ["locationTier1Unlocked"])) {
    errors.push("unlocks contains unknown keys.");
  }

  const story = gameState.story;
  if (!isObject(story)) {
    errors.push("story must be an object.");
  } else {
    if (!hasOnlyKeys(story, ["introShown", "debtReminderDaysShown"])) {
      errors.push("story contains unknown keys.");
    }

    if (typeof story.introShown !== "boolean") {
      errors.push("story.introShown must be a boolean.");
    }

    if (!Array.isArray(story.debtReminderDaysShown)) {
      errors.push("story.debtReminderDaysShown must be an array.");
    } else {
      const seenDays = new Set();
      story.debtReminderDaysShown.forEach(function (day) {
        if (!isInteger(day)) {
          errors.push("story.debtReminderDaysShown must contain integers.");
        } else if (day >= gameState.player.debtDueDay) {
          errors.push("story.debtReminderDaysShown days must be before debt due day.");
        } else if (seenDays.has(day)) {
          errors.push("story.debtReminderDaysShown contains duplicates.");
        } else {
          seenDays.add(day);
        }
      });
    }
  }

  if ("rng" in gameState) {
    if (!isObject(gameState.rng)) {
      errors.push("rng must be an object when present.");
    } else {
      if (!hasOnlyKeys(gameState.rng, ["seed", "rollLog"])) {
        errors.push("rng contains unknown keys.");
      }

      if (!(typeof gameState.rng.seed === "string" || typeof gameState.rng.seed === "number")) {
        errors.push("rng.seed must be a string or number.");
      }

      if (!Array.isArray(gameState.rng.rollLog)) {
        errors.push("rng.rollLog must be an array.");
      } else {
        const rollIds = new Set();
        gameState.rng.rollLog.forEach(function (roll, index) {
          if (!isObject(roll)) {
            errors.push("rng.rollLog entry at index " + index + " must be an object.");
            return;
          }
          if (!hasOnlyKeys(roll, ["id", "context", "result"])) {
            errors.push("rng.rollLog entry has unknown keys.");
          }
          if (!isNonEmptyString(roll.id)) {
            errors.push("rng.rollLog entry id must be a non-empty string.");
          } else if (rollIds.has(roll.id)) {
            errors.push("rng.rollLog contains duplicate id: " + roll.id + ".");
          } else {
            rollIds.add(roll.id);
          }
          if (!isNonEmptyString(roll.context)) {
            errors.push("rng.rollLog entry context must be a non-empty string.");
          }
          if (!isFiniteNumber(roll.result)) {
            errors.push("rng.rollLog entry result must be a finite number.");
          }
        });
      }
    }
  }

  if (errors.length) {
    return buildResult(false, "invalid_state", "Save data failed validation.", null, errors);
  }

  return buildResult(true, "ok", "Save data is valid.");
}

function saveGame() {
  if (!window.gameState) {
    return buildResult(false, "missing_state", "No game state is available to save.");
  }

  touchUpdatedAt(window.gameState);
  const validation = validateGameState(window.gameState);
  if (!validation.ok) {
    return validation;
  }

  const storageKey = getSaveStorageKey();
  try {
    localStorage.setItem(storageKey, JSON.stringify(window.gameState));
  } catch (error) {
    return buildResult(false, "storage_error", "Failed to write save data to local storage.");
  }

  return buildResult(true, "saved", "Game saved to local storage.", window.gameState);
}

function normalizeStoryState(rawStory, player) {
  const safeStory = {
    introShown: false,
    debtReminderDaysShown: []
  };
  const debtDueDay = player && Number.isFinite(player.debtDueDay)
    ? player.debtDueDay
    : CONFIG.game.debt_due_day;

  if (rawStory && typeof rawStory.introShown === "boolean") {
    safeStory.introShown = rawStory.introShown;
  }

  if (rawStory && Array.isArray(rawStory.debtReminderDaysShown)) {
    const seenDays = new Set();
    rawStory.debtReminderDaysShown.forEach(function (day) {
      if (Number.isInteger(day) && day < debtDueDay && !seenDays.has(day)) {
        seenDays.add(day);
      }
    });
    safeStory.debtReminderDaysShown = Array.from(seenDays);
  }

  return safeStory;
}

function loadGame() {
  const storageKey = getSaveStorageKey();
  const rawSave = localStorage.getItem(storageKey);
  if (!rawSave) {
    return buildResult(false, "missing_save", "No save data found in local storage.");
  }

  let parsed;
  try {
    parsed = JSON.parse(rawSave);
  } catch (error) {
    return buildResult(false, "invalid_json", "Save data could not be parsed.");
  }

  const migrated = migrateSaveData(parsed);
  const validation = validateGameState(migrated);
  if (!validation.ok) {
    return validation;
  }

  window.gameState = migrated;
  return buildResult(true, "loaded", "Game loaded from local storage.", migrated);
}

function resetSave() {
  const storageKey = getSaveStorageKey();
  localStorage.removeItem(storageKey);
  return buildResult(true, "reset", "Save data cleared from local storage.");
}

function exportSaveToFile() {
  const saveResult = saveGame();
  if (!saveResult.ok) {
    return saveResult;
  }

  const payload = JSON.stringify(saveResult.data, null, 2);
  const blob = new Blob([payload], { type: "application/json" });
  const link = document.createElement("a");
  const timestamp = saveResult.data.updatedAt.replace(/[:.]/g, "-");
  const filename = CONFIG.save.export_file_prefix + "-" + timestamp + "." + CONFIG.save.export_file_extension;

  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);

  return buildResult(true, "exported", "Save exported to file.", filename);
}

function importSaveFromFile() {
  return new Promise(function (resolve) {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json,application/json";

    input.addEventListener("change", function () {
      const file = input.files && input.files[0] ? input.files[0] : null;
      if (!file) {
        resolve(buildResult(false, "no_file", "No file selected for import."));
        return;
      }

      const reader = new FileReader();
      reader.onload = function (event) {
        let parsed;
        try {
          parsed = JSON.parse(event.target.result);
        } catch (error) {
          resolve(buildResult(false, "invalid_json", "Import file could not be parsed."));
          return;
        }

        const migrated = migrateSaveData(parsed);
        const validation = validateGameState(migrated);
        if (!validation.ok) {
          resolve(validation);
          return;
        }

        try {
          localStorage.setItem(getSaveStorageKey(), JSON.stringify(migrated));
        } catch (error) {
          resolve(buildResult(false, "storage_error", "Imported save could not be written to local storage."));
          return;
        }

        window.gameState = migrated;
        resolve(buildResult(true, "imported", "Save imported successfully.", migrated));
      };

      reader.onerror = function () {
        resolve(buildResult(false, "read_error", "Import file could not be read."));
      };

      reader.readAsText(file);
    });

    input.click();
  });
}
