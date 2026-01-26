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
    label: "MRR Focus",
    description: "Prioritize higher-value audiences over raw reach.",
    primaryEffect: "Instagram reach x0.9, X reach x1.2, social sub conversion x1.1.",
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

function getReputationFollowersMultiplier(gameState) {
  if (typeof getSelectedReputationBranch !== "function") {
    return 1;
  }
  const branch = getSelectedReputationBranch(gameState);
  if (!branch) {
    return 1;
  }
  return Number.isFinite(branch.followersMult) ? branch.followersMult : 1;
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

function hasAppliedManualSocialStrategyToday(gameState) {
  if (!gameState || !gameState.player || !gameState.social || !gameState.social.manualStrategy) {
    return false;
  }
  const today = gameState.player.day;
  const lastAppliedDay = gameState.social.manualStrategy.lastAppliedDay;
  if (!Number.isFinite(today) || !Number.isFinite(lastAppliedDay) || lastAppliedDay !== today) {
    return false;
  }
  const storyLog = Array.isArray(gameState.storyLog) ? gameState.storyLog : [];
  const expectedId = "manual_strategy_day_" + today;
  return storyLog.some(function (entry) {
    return entry && entry.id === expectedId;
  });
}

function calculateManualSocialStrategyImpact(gameState, budget, allocations) {
  const config = getManualSocialStrategyConfig();
  if (!config) {
    return { socialFollowersGained: 0, socialSubscribersGained: 0 };
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
  const equipmentAdjustedFollowers = applyEquipmentFollowersMultiplier(Math.round(baseFollowers), gameState);
  const reputationMult = getReputationFollowersMultiplier(gameState);
  const socialFollowersGained = Math.round(equipmentAdjustedFollowers * reputationMult);
  const subsPerFollower = Number.isFinite(config.subsPerFollower) ? config.subsPerFollower : 0;
  const socialSubscribersGained = Math.max(0, Math.floor(socialFollowersGained * subsPerFollower));
  return {
    socialFollowersGained: socialFollowersGained,
    socialSubscribersGained: socialSubscribersGained
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
    socialFollowersGained: impact.socialFollowersGained,
    socialSubscribersGained: impact.socialSubscribersGained
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
  if (hasAppliedManualSocialStrategyToday(gameState)) {
    return { ok: false, message: "Applied — come back tomorrow to change." };
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
  const maxSpend = getManualStrategyMaxSpend(gameState);
  if (budget > maxSpend) {
    return { ok: false, message: "Not enough cash for this budget." };
  }

  const impact = calculateManualSocialStrategyImpact(gameState, budget, manualStrategy.allocations);
  const socialFollowersGained = impact.socialFollowersGained;
  const socialSubscribersGained = impact.socialSubscribersGained;
  gameState.player.cash = Math.max(0, gameState.player.cash - budget);
  gameState.player.socialFollowers = Math.max(0, gameState.player.socialFollowers + socialFollowersGained);
  gameState.player.socialSubscribers = Math.max(0, gameState.player.socialSubscribers + socialSubscribersGained);
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
      socialFollowersGained + " social followers, +" + socialSubscribersGained + " social subs.",
    timestamp: new Date().toISOString()
  };
  if (!gameState.storyLog.some(function (entry) {
    return entry.id === logEntry.id;
  })) {
    gameState.storyLog.push(logEntry);
  }

  const legacyEvents = checkLegacyMilestones(gameState);
  const milestoneEvents = checkMilestones(gameState).concat(legacyEvents);

  return {
    ok: true,
    cost: budget,
    socialFollowersGained: socialFollowersGained,
    socialSubscribersGained: socialSubscribersGained,
    message: "Applied — come back tomorrow to change.",
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
    return { ok: false, message: platform + " already posted for this Promo." };
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
  let socialFollowersGained = applyEquipmentFollowersMultiplier(baseFollowers, gameState);
  const source = entry.source || "core";
  const isAgencyPack = source === "agency_pack";
  const performerIds = getEntryPerformerIds(entry);
  const comboConfig = getBookingComboConfig();
  const hasCombo = comboConfig.enabled && performerIds.length === 2;
  if (hasCombo) {
    const roleKey = getBookingComboRoleKey(
      getPerformerRoleIdForBooking(gameState, performerIds[0]),
      getPerformerRoleIdForBooking(gameState, performerIds[1])
    );
    const promoMultiplier = getBookingComboMultiplier(
      comboConfig,
      roleKey,
      comboConfig.promoFollowersMultiplierByRoles
    );
    socialFollowersGained = Math.round(socialFollowersGained * promoMultiplier);
  }
  if (isAgencyPack) {
    const agencyConfig = CONFIG.agencyPacks && typeof CONFIG.agencyPacks === "object" ? CONFIG.agencyPacks : {};
    const promoFollowersMult = Number.isFinite(agencyConfig.promoFollowersMult)
      ? agencyConfig.promoFollowersMult
      : 1;
    socialFollowersGained = Math.round(socialFollowersGained * promoFollowersMult);
  }
  const isFreelancer = performerIds.some(function (performerId) {
    const performer = gameState.roster.performers.find(function (rosterEntry) {
      return rosterEntry.id === performerId;
    });
    return performer && performer.type === "freelance";
  });
  const freelancerConfig = CONFIG.freelancers && typeof CONFIG.freelancers === "object" ? CONFIG.freelancers : {};
  const promoBonus = Number.isFinite(freelancerConfig.promoFollowersBonusFlat)
    ? freelancerConfig.promoFollowersBonusFlat
    : 0;
  const subscriberMultiplier = Number.isFinite(freelancerConfig.freelancerSocialSubMultiplier)
    ? freelancerConfig.freelancerSocialSubMultiplier
    : 1;
  if (isFreelancer && promoBonus > 0) {
    socialFollowersGained += promoBonus;
  }
  const competitionMultipliers = getCompetitionMultipliers(gameState, gameState.player.day);
  socialFollowersGained = Math.round(socialFollowersGained * competitionMultipliers.promoFollowerMult);
  const reputationMultiplier = getReputationFollowersMultiplier(gameState);
  socialFollowersGained = Math.round(socialFollowersGained * reputationMultiplier);
  const baseSubscribers = calculateSubscribersGained(socialFollowersGained);
  let socialSubscribersGained = activeStrategy
    ? Math.max(0, Math.round(baseSubscribers * activeStrategy.subscriberConversionMult))
    : baseSubscribers;
  if (isFreelancer && subscriberMultiplier >= 0) {
    socialSubscribersGained = Math.floor(socialSubscribersGained * subscriberMultiplier);
  }
  if (!Number.isFinite(gameState.player.onlyFansSubCarry)) {
    gameState.player.onlyFansSubCarry = 0;
  }
  const conversionConfig = CONFIG.conversion && CONFIG.conversion.promo ? CONFIG.conversion.promo : {};
  const rateFollowers = Number.isFinite(conversionConfig.followersToOF) ? conversionConfig.followersToOF : 0;
  const rateSocialSubs = Number.isFinite(conversionConfig.socialSubsToOF) ? conversionConfig.socialSubsToOF : 0;
  const exact = (socialFollowersGained * rateFollowers) + (socialSubscribersGained * rateSocialSubs);
  const total = gameState.player.onlyFansSubCarry + exact;
  const gained = Math.floor(total);
  gameState.player.onlyFansSubCarry = total - gained;
  const onlyFansSubscribersGained = Math.max(0, gained);

  const postId = "post_" + (gameState.social.posts.length + 1);
  const post = {
    id: postId,
    dayPosted: gameState.player.day,
    platform: platform,
    contentId: entry.id,
    socialFollowersGained: socialFollowersGained,
    socialSubscribersGained: socialSubscribersGained,
    onlyFansSubscribersGained: onlyFansSubscribersGained
  };

  gameState.social.posts.push(post);
  gameState.player.socialFollowers = Math.max(0, gameState.player.socialFollowers + socialFollowersGained);
  gameState.player.socialSubscribers = Math.max(0, gameState.player.socialSubscribers + socialSubscribersGained);
  gameState.player.onlyFansSubscribers = Math.max(0, gameState.player.onlyFansSubscribers + onlyFansSubscribersGained);

  const legacyEvents = checkLegacyMilestones(gameState);
  const milestoneEvents = checkMilestones(gameState).concat(legacyEvents);

  return {
    ok: true,
    message: "Posted promo: +" + socialFollowersGained + " social followers, +" + socialSubscribersGained +
      " social subs, +" + onlyFansSubscribersGained + " OF subs.",
    milestoneEvents: milestoneEvents
  };
}
