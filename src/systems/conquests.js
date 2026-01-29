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

function isConquestTriggerMet(gameState, trigger) {
  if (!gameState || !gameState.equipment) {
    return false;
  }
  if (!trigger || typeof trigger !== "object") {
    return false;
  }
  if (trigger.type !== "equipment") {
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
