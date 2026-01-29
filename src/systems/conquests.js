function getConquestsConfig() {
  if (CONFIG.conquests && typeof CONFIG.conquests === "object") {
    return CONFIG.conquests;
  }
  return { enabled: false, characters: {} };
}

function getConquestCharacterConfig(characterId) {
  const config = getConquestsConfig();
  if (!config.characters || typeof config.characters !== "object") {
    return null;
  }
  return config.characters[characterId] || null;
}

function getConquestStageConfig(characterConfig, stageIndex) {
  if (!characterConfig || !Array.isArray(characterConfig.stages)) {
    return null;
  }
  return characterConfig.stages.find(function (stage) {
    return stage && stage.stageIndex === stageIndex;
  }) || null;
}

function ensureConquestsState(gameState) {
  if (!gameState || typeof gameState !== "object") {
    return;
  }
  if (!gameState.conquests || typeof gameState.conquests !== "object" || Array.isArray(gameState.conquests)) {
    gameState.conquests = buildDefaultConquestsState();
    return;
  }
  if (typeof gameState.conquests.enabled !== "boolean") {
    gameState.conquests.enabled = Boolean(getConquestsConfig().enabled);
  }
  if (!gameState.conquests.characters || typeof gameState.conquests.characters !== "object" || Array.isArray(gameState.conquests.characters)) {
    gameState.conquests.characters = {};
  }
  const config = getConquestsConfig();
  const charactersConfig = config.characters && typeof config.characters === "object" ? config.characters : {};
  Object.keys(charactersConfig).forEach(function (characterId) {
    if (!gameState.conquests.characters[characterId]) {
      gameState.conquests.characters[characterId] = { stageUnlocked: 0 };
      return;
    }
    const stageUnlocked = gameState.conquests.characters[characterId].stageUnlocked;
    if (!Number.isFinite(stageUnlocked) || stageUnlocked < 0) {
      gameState.conquests.characters[characterId].stageUnlocked = 0;
    }
  });
  if (!Array.isArray(gameState.conquests.inbox)) {
    gameState.conquests.inbox = [];
  }
  if (!Array.isArray(gameState.conquests.unlockedPacks)) {
    gameState.conquests.unlockedPacks = [];
  }
}

function getConquestStatValue(gameState, stat) {
  if (!gameState || typeof gameState !== "object") {
    return 0;
  }
  if (stat === "reputation") {
    return Number.isFinite(gameState.player && gameState.player.reputation) ? gameState.player.reputation : 0;
  }
  if (stat === "socialFollowers" || stat === "totalFollowers") {
    return Number.isFinite(gameState.player && gameState.player.socialFollowers) ? gameState.player.socialFollowers : 0;
  }
  if (stat === "socialSubscribers") {
    return Number.isFinite(gameState.player && gameState.player.socialSubscribers) ? gameState.player.socialSubscribers : 0;
  }
  if (stat === "onlyFansSubscribers" || stat === "onlyfansSubs") {
    return Number.isFinite(gameState.player && gameState.player.onlyFansSubscribers) ? gameState.player.onlyFansSubscribers : 0;
  }
  if (stat === "netWorth") {
    if (typeof getNetWorth === "function") {
      return getNetWorth(gameState);
    }
    return 0;
  }
  if (stat === "recruitCount") {
    const hired = gameState.recruitment && Array.isArray(gameState.recruitment.hiredIds)
      ? gameState.recruitment.hiredIds
      : [];
    return hired.length;
  }
  if (stat === "milestoneCount") {
    const milestones = Array.isArray(gameState.milestones) ? gameState.milestones : [];
    return milestones.length;
  }
  if (stat === "totalShopSpend") {
    return Number.isFinite(gameState.stats && gameState.stats.totalShopSpend) ? gameState.stats.totalShopSpend : 0;
  }
  if (stat === "totalUpgradesPurchased") {
    return Number.isFinite(gameState.stats && gameState.stats.totalUpgradesPurchased)
      ? gameState.stats.totalUpgradesPurchased
      : 0;
  }
  return 0;
}

function formatSceneText(text, gameState) {
  if (typeof text !== "string") {
    return "";
  }
  const player = gameState && gameState.player ? gameState.player : {};
  const equipment = gameState && gameState.equipment ? gameState.equipment : {};
  const stats = gameState && gameState.stats ? gameState.stats : {};
  const recruitsCount = gameState && gameState.recruitment && Array.isArray(gameState.recruitment.hiredIds)
    ? gameState.recruitment.hiredIds.length
    : 0;
  const replacements = {
    "{{reputation}}": Number.isFinite(player.reputation) ? player.reputation : 0,
    "{{followers}}": Number.isFinite(player.socialFollowers) ? player.socialFollowers : 0,
    "{{ofSubs}}": Number.isFinite(player.onlyFansSubscribers) ? player.onlyFansSubscribers : 0,
    "{{cash}}": Number.isFinite(player.cash) ? player.cash : 0,
    "{{debtRemaining}}": Number.isFinite(player.debtRemaining) ? player.debtRemaining : 0,
    "{{lightingLevel}}": Number.isFinite(equipment.lightingLevel) ? equipment.lightingLevel : 0,
    "{{cameraLevel}}": Number.isFinite(equipment.cameraLevel) ? equipment.cameraLevel : 0,
    "{{setDressingLevel}}": Number.isFinite(equipment.setDressingLevel) ? equipment.setDressingLevel : 0,
    "{{recruitsCount}}": Number.isFinite(recruitsCount) ? recruitsCount : 0,
    "{{shopSpend}}": Number.isFinite(stats.totalShopSpend) ? stats.totalShopSpend : 0,
    "{{upgradesPurchased}}": Number.isFinite(stats.totalUpgradesPurchased) ? stats.totalUpgradesPurchased : 0
  };
  return Object.keys(replacements).reduce(function (result, token) {
    return result.replaceAll(token, String(replacements[token]));
  }, text);
}

function isConquestTriggerMet(gameState, trigger) {
  if (!trigger || typeof trigger !== "object") {
    return false;
  }
  if (!gameState || typeof gameState !== "object") {
    return false;
  }
  if (Number.isFinite(trigger.minDay)) {
    const currentDay = Number.isFinite(gameState.player && gameState.player.day)
      ? gameState.player.day
      : 0;
    if (currentDay < trigger.minDay) {
      return false;
    }
  }
  if (trigger.requiresDebtCleared) {
    const debtRemaining = Number.isFinite(gameState.player && gameState.player.debtRemaining)
      ? gameState.player.debtRemaining
      : 0;
    if (debtRemaining > 0) {
      return false;
    }
  }
  if (Array.isArray(trigger.anyOf)) {
    return trigger.anyOf.some(function (entry) {
      return isConquestTriggerMet(gameState, entry);
    });
  }
  if (Array.isArray(trigger.allOf)) {
    return trigger.allOf.every(function (entry) {
      return isConquestTriggerMet(gameState, entry);
    });
  }
  if (trigger.type === "equipment") {
    if (!gameState.equipment) {
      return false;
    }
    let requirements = [];
    if (Array.isArray(trigger.requirements)) {
      requirements = trigger.requirements;
    } else if (trigger.key) {
      requirements = [{ key: trigger.key, minLevel: trigger.minLevel }];
    }
    if (!requirements.length) {
      return false;
    }
    return requirements.every(function (requirement) {
      const key = requirement.key;
      const minLevel = Number.isFinite(requirement.minLevel) ? requirement.minLevel : 0;
      const currentLevel = Number.isFinite(gameState.equipment[key]) ? gameState.equipment[key] : 0;
      return currentLevel >= minLevel;
    });
  }
  if (trigger.type === "debtPaidRatio") {
    const player = gameState.player || {};
    const debtRemaining = Number.isFinite(player.debtRemaining) ? player.debtRemaining : 0;
    const initialPrincipal = Number.isFinite(player.debtInitialPrincipal)
      ? player.debtInitialPrincipal
      : debtRemaining;
    if (initialPrincipal <= 0) {
      return debtRemaining <= 0;
    }
    const paidDown = Math.max(0, initialPrincipal - debtRemaining);
    const ratio = paidDown / initialPrincipal;
    const minRatio = Number.isFinite(trigger.minRatio) ? trigger.minRatio : 0;
    return ratio >= minRatio;
  }
  if (trigger.type === "stat") {
    const statKey = typeof trigger.stat === "string" ? trigger.stat : "";
    const minValue = Number.isFinite(trigger.min) ? trigger.min : 0;
    const value = getConquestStatValue(gameState, statKey);
    return value >= minValue;
  }
  return false;
}

function buildConquestMessageId(characterId, stageIndex, day) {
  const safeDay = Number.isFinite(day) ? day : 0;
  return "conquest_" + characterId + "_stage_" + stageIndex + "_day_" + safeDay;
}

function buildConquestNotificationCard(characterConfig) {
  const name = characterConfig && characterConfig.name ? characterConfig.name : "Someone";
  return {
    title: "📩 New message",
    message: name + " wants to meet. Visit Conquests."
  };
}

function checkConquests(gameState) {
  const result = { cards: [], messages: [] };
  if (!gameState || !gameState.conquests) {
    return result;
  }
  const config = getConquestsConfig();
  if (!config.enabled || !gameState.conquests.enabled) {
    return result;
  }
  const charactersConfig = config.characters && typeof config.characters === "object" ? config.characters : {};
  Object.keys(charactersConfig).forEach(function (characterId) {
    const characterConfig = charactersConfig[characterId];
    if (!characterConfig) {
      return;
    }
    if (!gameState.conquests.characters[characterId]) {
      gameState.conquests.characters[characterId] = { stageUnlocked: 0 };
    }
    const stageUnlocked = Number.isFinite(gameState.conquests.characters[characterId].stageUnlocked)
      ? gameState.conquests.characters[characterId].stageUnlocked
      : 0;
    const nextStageIndex = stageUnlocked + 1;
    const stageConfig = getConquestStageConfig(characterConfig, nextStageIndex);
    if (!stageConfig) {
      return;
    }
    if (!isConquestTriggerMet(gameState, stageConfig.trigger)) {
      return;
    }
    const hasMessage = gameState.conquests.inbox.some(function (message) {
      return message && message.characterId === characterId && message.stageIndex === nextStageIndex;
    });
    if (hasMessage) {
      return;
    }
    const messageId = buildConquestMessageId(characterId, nextStageIndex, gameState.player ? gameState.player.day : 0);
    const message = {
      id: messageId,
      characterId: characterId,
      stageIndex: nextStageIndex,
      createdDay: gameState.player ? gameState.player.day : 0,
      status: "unread"
    };
    gameState.conquests.inbox.push(message);
    result.messages.push(message);
    result.cards.push(buildConquestNotificationCard(characterConfig));
  });
  return result;
}

function unlockConquestPack(gameState, characterId, stageConfig) {
  if (!gameState || !gameState.conquests || !stageConfig || !stageConfig.rewardPack) {
    return null;
  }
  const packConfig = stageConfig.rewardPack;
  const existing = getConquestPackById(gameState, packConfig.packId);
  if (existing) {
    return existing;
  }
  const newPack = {
    packId: packConfig.packId,
    characterId: characterId,
    stageIndex: stageConfig.stageIndex,
    title: packConfig.title,
    description: packConfig.description,
    imagePaths: Array.isArray(packConfig.imagePaths) ? packConfig.imagePaths.slice() : [],
    unlockedDay: gameState.player ? gameState.player.day : 0
  };
  gameState.conquests.unlockedPacks.push(newPack);
  return newPack;
}

function getConquestPackById(gameState, packId) {
  if (!gameState || !gameState.conquests || !Array.isArray(gameState.conquests.unlockedPacks)) {
    return null;
  }
  return gameState.conquests.unlockedPacks.find(function (pack) {
    return pack && pack.packId === packId;
  }) || null;
}

function acceptConquestMessage(gameState, messageId) {
  if (!gameState || !gameState.conquests || !Array.isArray(gameState.conquests.inbox)) {
    return { ok: false, message: "No conquest messages found." };
  }
  const message = gameState.conquests.inbox.find(function (entry) {
    return entry && entry.id === messageId;
  });
  if (!message) {
    return { ok: false, message: "Conquest message not found." };
  }
  if (message.status === "accepted") {
    return { ok: true, message: "Already accepted.", packId: null };
  }
  message.status = "accepted";
  const characterId = message.characterId;
  if (!gameState.conquests.characters[characterId]) {
    gameState.conquests.characters[characterId] = { stageUnlocked: 0 };
  }
  const currentStage = Number.isFinite(gameState.conquests.characters[characterId].stageUnlocked)
    ? gameState.conquests.characters[characterId].stageUnlocked
    : 0;
  gameState.conquests.characters[characterId].stageUnlocked = Math.max(currentStage, message.stageIndex);
  const characterConfig = getConquestCharacterConfig(characterId);
  const stageConfig = getConquestStageConfig(characterConfig, message.stageIndex);
  const unlockedPack = unlockConquestPack(gameState, characterId, stageConfig);
  return {
    ok: true,
    message: "Conquest accepted. Reward unlocked.",
    packId: unlockedPack ? unlockedPack.packId : null
  };
}

function dismissConquestMessage(gameState, messageId) {
  if (!gameState || !gameState.conquests || !Array.isArray(gameState.conquests.inbox)) {
    return { ok: false, message: "No conquest messages found." };
  }
  const message = gameState.conquests.inbox.find(function (entry) {
    return entry && entry.id === messageId;
  });
  if (!message) {
    return { ok: false, message: "Conquest message not found." };
  }
  if (message.status === "accepted") {
    return { ok: true, message: "Conquest already accepted." };
  }
  message.status = "dismissed";
  return { ok: true, message: "Message dismissed." };
}
