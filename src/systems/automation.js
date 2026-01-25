function getAutomationConfig() {
  return CONFIG.automation && typeof CONFIG.automation === "object" ? CONFIG.automation : {};
}

function normalizeAutomationMessage(message) {
  if (!message) {
    return "Unknown issue";
  }
  const trimmed = String(message).trim();
  if (!trimmed) {
    return "Unknown issue";
  }
  return trimmed.endsWith(".") ? trimmed.slice(0, -1) : trimmed;
}

function resetAutomationCountersIfNeeded(gameState, currentDay) {
  if (!gameState || !gameState.automation) {
    return;
  }
  if (gameState.automation.lastAutomationDay !== currentDay) {
    gameState.automation.lastAutomationDay = currentDay;
    gameState.automation.actionsTakenToday = 0;
  }
}

function getAutomationMaxActions(config) {
  return Number.isFinite(config.maxActionsPerDay) ? config.maxActionsPerDay : 1;
}

function getAutomationActionPriority(config) {
  return Array.isArray(config.actionPriority) ? config.actionPriority : [];
}

function hasPlatformPosted(gameState, contentId, platform) {
  if (!gameState || !gameState.social || !Array.isArray(gameState.social.posts)) {
    return false;
  }
  return gameState.social.posts.some(function (post) {
    return post && post.contentId === contentId && post.platform === platform;
  });
}

function findAutoPostCandidate(gameState, platformPriority) {
  if (!gameState || !gameState.content || !Array.isArray(gameState.content.entries)) {
    return null;
  }
  const platforms = Array.isArray(platformPriority) ? platformPriority : [];
  for (let i = 0; i < gameState.content.entries.length; i += 1) {
    const entry = gameState.content.entries[i];
    if (!entry || entry.contentType !== "Promo") {
      continue;
    }
    for (let j = 0; j < platforms.length; j += 1) {
      const platform = platforms[j];
      if (platform && !hasPlatformPosted(gameState, entry.id, platform)) {
        return { entry: entry, platform: platform };
      }
    }
  }
  return null;
}

function attemptAutoBook(gameState) {
  if (!gameState.automation.autoBookEnabled) {
    return { attempted: false };
  }
  const result = tryAutoBookOne(gameState);
  if (result.success) {
    return {
      attempted: true,
      success: true,
      message: "Automation booked 1 shoot."
    };
  }
  return {
    attempted: true,
    success: false,
    message: "Automation couldn’t book a shoot: " + normalizeAutomationMessage(result.reason) + "."
  };
}

function attemptAutoPost(gameState, config) {
  if (!gameState.automation.autoPostEnabled) {
    return { attempted: false };
  }
  const platformPriority = Array.isArray(config.autoPostPlatformPriority)
    ? config.autoPostPlatformPriority
    : ["Instagram", "X"];
  const candidate = findAutoPostCandidate(gameState, platformPriority);
  if (!candidate) {
    return {
      attempted: true,
      success: false,
      message: "Automation couldn’t post a promo: no eligible promo to post."
    };
  }
  const result = postPromoContent(gameState, candidate.platform, candidate.entry.id);
  if (result.ok) {
    return {
      attempted: true,
      success: true,
      message: "Automation posted a Promo to " + candidate.platform + "."
    };
  }
  return {
    attempted: true,
    success: false,
    message: "Automation couldn’t post a promo: " + normalizeAutomationMessage(result.message) + "."
  };
}

function runAutomationOnDayAdvance(gameState) {
  const summary = { cards: [], results: [] };
  if (!gameState || !gameState.automation) {
    return summary;
  }
  if (!gameState.automation.enabled) {
    return summary;
  }
  const currentDay = gameState.player && Number.isFinite(gameState.player.day) ? gameState.player.day : null;
  if (!Number.isFinite(currentDay)) {
    return summary;
  }

  const config = getAutomationConfig();
  resetAutomationCountersIfNeeded(gameState, currentDay);
  const maxActions = getAutomationMaxActions(config);
  if (gameState.automation.actionsTakenToday >= maxActions) {
    return summary;
  }

  const priority = getAutomationActionPriority(config);
  for (let i = 0; i < priority.length; i += 1) {
    if (gameState.automation.actionsTakenToday >= maxActions) {
      break;
    }
    const action = priority[i];
    let result = { attempted: false };
    if (action === "autoBook") {
      result = attemptAutoBook(gameState);
    } else if (action === "autoPost") {
      result = attemptAutoPost(gameState, config);
    }
    if (!result.attempted) {
      continue;
    }
    summary.results.push(result);
    summary.cards.push({ title: "Automation", message: result.message });
    if (result.success) {
      gameState.automation.actionsTakenToday += 1;
      break;
    }
  }

  return summary;
}
