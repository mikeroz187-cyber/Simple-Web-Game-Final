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
