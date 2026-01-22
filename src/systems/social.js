const SOCIAL_STRATEGY_CATALOG = [
  {
    id: "balanced",
    label: "Balanced",
    description: "Keep reach steady across platforms while maintaining conversion stability.",
    primaryEffect: "No modifiers to platform reach or subscriber conversion.",
    instagramReachMult: 1.0,
    xReachMult: 1.0,
    subscriberConversionMult: 1.0
  },
  {
    id: "growth_focus",
    label: "Growth Focus",
    description: "Push for follower growth, even if conversion efficiency dips.",
    primaryEffect: "Instagram reach x1.2, X reach x0.9, subscriber conversion x0.9.",
    instagramReachMult: 1.2,
    xReachMult: 0.9,
    subscriberConversionMult: 0.9
  },
  {
    id: "revenue_focus",
    label: "Revenue Focus",
    description: "Prioritize higher-value audiences over raw reach.",
    primaryEffect: "Instagram reach x0.9, X reach x1.2, subscriber conversion x1.1.",
    instagramReachMult: 0.9,
    xReachMult: 1.2,
    subscriberConversionMult: 1.1
  }
];

function getSocialStrategies() {
  return SOCIAL_STRATEGY_CATALOG.slice();
}

function getSocialStrategyById(strategyId) {
  if (!strategyId) {
    return null;
  }
  return SOCIAL_STRATEGY_CATALOG.find(function (strategy) {
    return strategy.id === strategyId;
  }) || null;
}

function getActiveSocialStrategyId(gameState) {
  if (!gameState || !gameState.social) {
    return null;
  }
  if (typeof gameState.social.activeSocialStrategyId === "string" && gameState.social.activeSocialStrategyId.length > 0) {
    return gameState.social.activeSocialStrategyId;
  }
  if (gameState.social.strategy && typeof gameState.social.strategy.activeStrategyId === "string") {
    return gameState.social.strategy.activeStrategyId;
  }
  if (CONFIG.social && CONFIG.social.strategy && typeof CONFIG.social.strategy.defaultStrategyId === "string") {
    return CONFIG.social.strategy.defaultStrategyId;
  }
  return null;
}

function getActiveSocialStrategy(gameState) {
  const activeId = getActiveSocialStrategyId(gameState);
  return getSocialStrategyById(activeId);
}

function getManualSocialStrategyConfig() {
  return getManualStrategyConfig();
}

function getManualSocialStrategyState(gameState) {
  if (!gameState || !gameState.social) {
    return null;
  }
  return gameState.social.manualStrategy || null;
}

function getManualStrategyChannels() {
  const config = getManualSocialStrategyConfig();
  return config && Array.isArray(config.channels) ? config.channels : [];
}

function getManualStrategyChannelLabel(channelId) {
  const config = getManualSocialStrategyConfig();
  if (config && config.channelLabels && config.channelLabels[channelId]) {
    return config.channelLabels[channelId];
  }
  return channelId;
}

function getManualStrategyAllocationTotal(allocations) {
  const channels = getManualStrategyChannels();
  return channels.reduce(function (sum, channel) {
    const value = allocations && Number.isFinite(allocations[channel]) ? allocations[channel] : 0;
    return sum + value;
  }, 0);
}

function getManualStrategyEffectiveSpend(spend, diminishingReturnsK) {
  if (!Number.isFinite(spend) || spend <= 0) {
    return 0;
  }
  const k = Number.isFinite(diminishingReturnsK) ? diminishingReturnsK : 0;
  if (k <= 0) {
    return spend;
  }
  return spend * (1 / (1 + k * spend));
}

function getManualStrategyMaxSpend(gameState) {
  const config = getManualSocialStrategyConfig();
  if (!config) {
    return 0;
  }
  if (config.maxSpend === "playerCash" && gameState && gameState.player) {
    return gameState.player.cash;
  }
  if (Number.isFinite(config.maxSpend)) {
    return config.maxSpend;
  }
  return gameState && gameState.player ? gameState.player.cash : 0;
}

function calculateManualSocialStrategyImpact(gameState, budget, allocations) {
  const config = getManualSocialStrategyConfig();
  if (!config) {
    return { followersGained: 0, subscribersGained: 0 };
  }
  const minSpend = Number.isFinite(config.minSpend) ? config.minSpend : 0;
  const safeBudget = Number.isFinite(budget) ? Math.max(minSpend, Math.round(budget)) : minSpend;
  const channels = getManualStrategyChannels();
  const baseFollowers = channels.reduce(function (sum, channel) {
    const pct = allocations && Number.isFinite(allocations[channel]) ? allocations[channel] : 0;
    const spend = safeBudget * (pct / 100);
    const effectiveSpend = getManualStrategyEffectiveSpend(spend, config.diminishingReturnsK);
    const rate = config.followersPerDollar && Number.isFinite(config.followersPerDollar[channel])
      ? config.followersPerDollar[channel]
      : 0;
    return sum + (effectiveSpend * rate);
  }, 0);
  const followersGained = applyEquipmentFollowersMultiplier(Math.round(baseFollowers), gameState);
  const subsPerFollower = Number.isFinite(config.subsPerFollower) ? config.subsPerFollower : 0;
  const subscribersGained = Math.max(0, Math.floor(followersGained * subsPerFollower));
  return {
    followersGained: followersGained,
    subscribersGained: subscribersGained
  };
}

function getManualSocialStrategyPreview(gameState) {
  const manualStrategy = getManualSocialStrategyState(gameState);
  const allocations = manualStrategy ? manualStrategy.allocations : null;
  const totalPct = getManualStrategyAllocationTotal(allocations);
  const budget = manualStrategy ? manualStrategy.dailyBudget : 0;
  const impact = calculateManualSocialStrategyImpact(gameState, budget, allocations);
  return {
    totalPct: totalPct,
    budget: budget,
    followersGained: impact.followersGained,
    subscribersGained: impact.subscribersGained
  };
}

function getManualSocialStrategyIssues(gameState) {
  const config = getManualSocialStrategyConfig();
  const manualStrategy = getManualSocialStrategyState(gameState);
  const issues = [];
  if (!config || !manualStrategy || !gameState || !gameState.player) {
    issues.push("Manual strategy unavailable.");
    return issues;
  }
  const totalPct = getManualStrategyAllocationTotal(manualStrategy.allocations);
  if (totalPct !== 100) {
    issues.push("Allocation must total 100%.");
  }
  const minSpend = Number.isFinite(config.minSpend) ? config.minSpend : 0;
  if (!Number.isFinite(manualStrategy.dailyBudget) || manualStrategy.dailyBudget < minSpend) {
    issues.push("Budget is below the minimum.");
  }
  const maxSpend = getManualStrategyMaxSpend(gameState);
  if (manualStrategy.dailyBudget > maxSpend) {
    issues.push("Not enough cash for this budget.");
  }
  return issues;
}

function applyManualSocialStrategy(gameState) {
  if (!gameState || !gameState.player) {
    return { ok: false, message: "No game state available." };
  }
  ensureSocialManualStrategyState(gameState);
  const config = getManualSocialStrategyConfig();
  if (!config) {
    return { ok: false, message: "Manual strategy not available." };
  }
  const manualStrategy = getManualSocialStrategyState(gameState);
  const totalPct = getManualStrategyAllocationTotal(manualStrategy.allocations);
  if (totalPct !== 100) {
    return { ok: false, message: "Allocation must total 100%." };
  }
  const minSpend = Number.isFinite(config.minSpend) ? config.minSpend : 0;
  const budget = Number.isFinite(manualStrategy.dailyBudget)
    ? Math.max(minSpend, Math.round(manualStrategy.dailyBudget))
    : minSpend;
  if (manualStrategy.lastAppliedDay === gameState.player.day) {
    return { ok: false, message: "Manual strategy already applied today." };
  }
  const maxSpend = getManualStrategyMaxSpend(gameState);
  if (budget > maxSpend) {
    return { ok: false, message: "Not enough cash for this budget." };
  }

  const impact = calculateManualSocialStrategyImpact(gameState, budget, manualStrategy.allocations);
  gameState.player.cash = Math.max(0, gameState.player.cash - budget);
  gameState.player.followers = Math.max(0, gameState.player.followers + impact.followersGained);
  gameState.player.subscribers = Math.max(0, gameState.player.subscribers + impact.subscribersGained);
  manualStrategy.dailyBudget = budget;
  manualStrategy.lastAppliedDay = gameState.player.day;

  ensureStoryLogState(gameState);
  const dayLabel = Number.isFinite(gameState.player.day) ? "Day " + gameState.player.day : "Today";
  const spendLines = getManualStrategyChannels().map(function (channel) {
    const pct = Number.isFinite(manualStrategy.allocations[channel]) ? manualStrategy.allocations[channel] : 0;
    const spend = Math.round(budget * (pct / 100));
    return getManualStrategyChannelLabel(channel) + " " + formatCurrency(spend);
  });
  const logEntry = {
    id: "manual_strategy_day_" + gameState.player.day,
    dayNumber: gameState.player.day,
    title: "Manual Social Strategy",
    body: dayLabel + " — Spent " + formatCurrency(budget) + " (" + spendLines.join(", ") + "). +" +
      impact.followersGained + " followers, +" + impact.subscribersGained + " subscribers.",
    timestamp: new Date().toISOString()
  };
  if (!gameState.storyLog.some(function (entry) {
    return entry.id === logEntry.id;
  })) {
    gameState.storyLog.push(logEntry);
  }

  const milestoneEvents = checkMilestones(gameState);

  return {
    ok: true,
    message: "Manual strategy applied. +" + impact.followersGained + " followers, +" +
      impact.subscribersGained + " subscribers.",
    milestoneEvents: milestoneEvents
  };
}

function setSocialStrategy(gameState, strategyId) {
  if (!gameState || !gameState.social) {
    return { ok: false, message: "No social data available." };
  }
  const strategy = getSocialStrategyById(strategyId);
  if (!strategy) {
    return { ok: false, message: "Invalid social strategy." };
  }
  gameState.social.activeSocialStrategyId = strategy.id;
  return { ok: true, strategy: strategy, message: "Social strategy set to " + strategy.label + "." };
}

function postPromoContent(gameState, platform, contentId) {
  if (!gameState || !platform || !contentId) {
    return { ok: false, message: "Select a Promo content entry first." };
  }

  if (CONFIG.social_platforms.platforms.indexOf(platform) === -1) {
    return { ok: false, message: "Invalid platform selection." };
  }

  if (!gameState.social || !Array.isArray(gameState.social.posts)) {
    gameState.social = { posts: [] };
  }

  const entry = gameState.content.entries.find(function (item) {
    return item.id === contentId;
  });

  if (!entry || entry.contentType !== "Promo") {
    return { ok: false, message: "Promo content required for posting." };
  }

  const alreadyPosted = gameState.social.posts.some(function (post) {
    return post.contentId === entry.id && post.platform === platform;
  });

  if (alreadyPosted) {
    return { ok: false, message: "Already posted to " + platform + "." };
  }

  const platformMultiplier = platform === "Instagram"
    ? CONFIG.social_platforms.instagram_reach_multiplier
    : CONFIG.social_platforms.x_reach_multiplier;

  const activeStrategy = getActiveSocialStrategy(gameState);
  const strategyReachMult = activeStrategy
    ? (platform === "Instagram" ? activeStrategy.instagramReachMult : activeStrategy.xReachMult)
    : 1;
  const baseFollowers = Math.round(
    CONFIG.economy.promo_followers_gain * platformMultiplier * strategyReachMult
  );
  const followersGained = applyEquipmentFollowersMultiplier(baseFollowers, gameState);
  const baseSubscribers = calculateSubscribersGained(followersGained);
  const subscribersGained = activeStrategy
    ? Math.max(0, Math.round(baseSubscribers * activeStrategy.subscriberConversionMult))
    : baseSubscribers;

  const postId = "post_" + (gameState.social.posts.length + 1);
  const post = {
    id: postId,
    dayPosted: gameState.player.day,
    platform: platform,
    contentId: entry.id,
    followersGained: followersGained,
    subscribersGained: subscribersGained
  };

  gameState.social.posts.push(post);
  gameState.player.followers = Math.max(0, gameState.player.followers + followersGained);
  gameState.player.subscribers = Math.max(0, gameState.player.subscribers + subscribersGained);

  const milestoneEvents = checkMilestones(gameState);

  return {
    ok: true,
    message: "Posted to " + platform + ". +" + followersGained + " followers.",
    milestoneEvents: milestoneEvents
  };
}
