function isLocationTierUnlocked(gameState, tierId) {
  if (!gameState || !gameState.unlocks) {
    return false;
  }

  if (gameState.unlocks.locationTiers && gameState.unlocks.locationTiers[tierId] === true) {
    return true;
  }

  if (tierId === "tier1" && gameState.unlocks.locationTier1Unlocked) {
    return true;
  }

  return false;
}

function unlockLocationTier(gameState, tierId) {
  if (!gameState) {
    return { ok: false, message: "Game state missing." };
  }

  if (tierId !== "tier1") {
    if (tierId !== "tier2") {
      return { ok: false, message: "Unknown location tier." };
    }
  }

  if (!gameState.unlocks.locationTiers || typeof gameState.unlocks.locationTiers !== "object") {
    gameState.unlocks.locationTiers = { tier0: true, tier1: false, tier2: false };
  }

  if (isLocationTierUnlocked(gameState, tierId)) {
    if (tierId === "tier2") {
      return { ok: false, message: "Location Tier 2 already unlocked." };
    }
    return { ok: false, message: "Location Tier 1 already unlocked." };
  }

  if (tierId === "tier2") {
    const repRequirement = Number.isFinite(CONFIG.locations.tier2ReputationRequirement)
      ? CONFIG.locations.tier2ReputationRequirement
      : 0;
    const cost = Number.isFinite(CONFIG.locations.tier2UnlockCost)
      ? CONFIG.locations.tier2UnlockCost
      : 0;
    if (gameState.player.reputation < repRequirement) {
      return { ok: false, message: "Need Reputation ≥ " + repRequirement + " to unlock Tier 2." };
    }
    if (gameState.player.cash < cost) {
      return { ok: false, message: "Not enough cash to unlock Location Tier 2." };
    }
    gameState.player.cash = Math.max(0, gameState.player.cash - cost);
    gameState.unlocks.locationTiers.tier2 = true;
    const tierName = CONFIG.locations.tier2Name || "Location Tier 2";
    return { ok: true, message: tierName + " unlocked." };
  }

  const fallbackCost = CONFIG.progression.location_tier_1_unlock_cost;
  const cost = Number.isFinite(CONFIG.locations.tier1UnlockCost)
    ? CONFIG.locations.tier1UnlockCost
    : fallbackCost;
  if (gameState.player.cash < cost) {
    return { ok: false, message: "Not enough cash to unlock Location Tier 1." };
  }

  gameState.player.cash = Math.max(0, gameState.player.cash - cost);
  gameState.unlocks.locationTiers.tier1 = true;
  gameState.unlocks.locationTier1Unlocked = true;

  const tierName = CONFIG.locations.tier1Name || "Location Tier 1";
  return { ok: true, message: tierName + " unlocked." };
}

function purchaseTier1Location(gameState) {
  return unlockLocationTier(gameState, "tier1");
}

function purchaseLocationUnlock(gameState) {
  return purchaseTier1Location(gameState);
}

function getLifetimeRevenue(gameState) {
  if (!gameState || !gameState.content || !Array.isArray(gameState.content.entries)) {
    return 0;
  }
  return gameState.content.entries.reduce(function (total, entry) {
    const revenue = entry && entry.results ? entry.results.revenue : 0;
    return total + (Number.isFinite(revenue) ? revenue : 0);
  }, 0);
}

function getMilestoneMetricValue(gameState, milestone) {
  if (!gameState || !milestone) {
    return 0;
  }
  const type = milestone.type;
  if (type === "followers") {
    return gameState.player.socialFollowers;
  }
  if (type === "subscribers") {
    return gameState.player.onlyFansSubscribers;
  }
  if (type === "reputation") {
    return gameState.player.reputation;
  }
  if (type === "lifetimeRevenue") {
    return getLifetimeRevenue(gameState);
  }
  if (type === "mrr") {
    return getMRR(gameState);
  }
  return 0;
}

function getLegacyMilestoneMetricValue(gameState, milestone) {
  if (!gameState || !milestone) {
    return 0;
  }
  if (milestone.type === "storyComplete") {
    if (gameState.story && gameState.story.act3 && Array.isArray(gameState.story.act3.eventsShown)) {
      return gameState.story.act3.eventsShown.indexOf("act3_exit_strategy_day270") !== -1 ? 1 : 0;
    }
    return 0;
  }
  return getMilestoneMetricValue(gameState, milestone);
}

function applyMilestoneRewards(gameState, milestone) {
  const rewardLabels = [];
  if (!gameState || !milestone) {
    return "Rewards: none.";
  }

  const cashReward = milestone.rewardCash;
  if (Number.isFinite(cashReward) && cashReward !== 0) {
    gameState.player.cash = Math.max(0, gameState.player.cash + cashReward);
    rewardLabels.push("+" + formatCurrency(cashReward) + " cash");
  }

  const followerReward = milestone.rewardFollowers;
  if (Number.isFinite(followerReward) && followerReward !== 0) {
    gameState.player.socialFollowers = Math.max(0, gameState.player.socialFollowers + followerReward);
    rewardLabels.push("+" + followerReward + " social followers");
  }

  const subscriberReward = milestone.rewardSubscribers;
  if (Number.isFinite(subscriberReward) && subscriberReward !== 0) {
    gameState.player.onlyFansSubscribers = Math.max(0, gameState.player.onlyFansSubscribers + subscriberReward);
    rewardLabels.push("+" + subscriberReward + " OF subs");
  }

  const reputationReward = milestone.rewardReputation;
  if (Number.isFinite(reputationReward) && reputationReward !== 0) {
    gameState.player.reputation = Math.max(0, gameState.player.reputation + reputationReward);
    rewardLabels.push("+" + reputationReward + " reputation");
  }

  if (milestone.unlockFlags && typeof milestone.unlockFlags === "object") {
    const unlockKeys = Object.keys(milestone.unlockFlags);
    unlockKeys.forEach(function (key) {
      if (gameState.unlocks && typeof milestone.unlockFlags[key] === "boolean") {
        gameState.unlocks[key] = milestone.unlockFlags[key];
        rewardLabels.push("Unlocked " + key);
      }
    });
  }

  if (rewardLabels.length === 0) {
    return "Rewards: none.";
  }

  return "Rewards: " + rewardLabels.join(", ") + ".";
}

function checkMilestones(gameState) {
  const order = CONFIG.milestones ? CONFIG.milestones.milestoneOrder : [];
  if (!gameState || !Array.isArray(order) || order.length === 0) {
    return [];
  }

  if (!Array.isArray(gameState.milestones)) {
    gameState.milestones = [];
  }

  const triggered = [];
  order.forEach(function (milestoneId) {
    const definition = CONFIG.milestones.milestones[milestoneId];
    if (!definition) {
      return;
    }
    const existing = gameState.milestones.find(function (entry) {
      return entry.id === milestoneId;
    });
    if (existing && existing.completed) {
      if (!Number.isFinite(existing.completedDay)) {
        existing.completedDay = gameState.player.day;
      }
      return;
    }
    const metricValue = getMilestoneMetricValue(gameState, definition);
    if (!Number.isFinite(metricValue) || metricValue < definition.threshold) {
      return;
    }

    const rewardSummary = applyMilestoneRewards(gameState, definition);
    const record = existing || { id: milestoneId };
    record.completed = true;
    record.completedDay = gameState.player.day;
    if (!existing) {
      gameState.milestones.push(record);
    }

    triggered.push({
      id: milestoneId,
      title: definition.label || milestoneId,
      rewardSummary: rewardSummary
    });
  });

  return triggered;
}

function checkLegacyMilestones(gameState) {
  const legacyConfig = CONFIG.legacyMilestones;
  const order = legacyConfig ? legacyConfig.milestoneOrder : [];
  if (!gameState || !Array.isArray(order) || order.length === 0) {
    return [];
  }

  if (!Array.isArray(gameState.legacyMilestones)) {
    gameState.legacyMilestones = [];
  }

  const triggered = [];
  order.forEach(function (milestoneId) {
    const definition = legacyConfig.milestones[milestoneId];
    if (!definition) {
      return;
    }
    const existing = gameState.legacyMilestones.find(function (entry) {
      return entry.id === milestoneId;
    });
    if (existing) {
      if (!Number.isFinite(existing.completedDay)) {
        existing.completedDay = gameState.player.day;
      }
      return;
    }
    const metricValue = getLegacyMilestoneMetricValue(gameState, definition);
    if (!Number.isFinite(metricValue) || metricValue < definition.threshold) {
      return;
    }

    const rewardSummary = applyMilestoneRewards(gameState, definition);
    const record = {
      id: milestoneId,
      completedDay: gameState.player.day
    };
    gameState.legacyMilestones.push(record);
    const cashReward = Number.isFinite(definition.rewardCash) ? definition.rewardCash : 0;
    const legacyMessage = "Legacy Milestone Achieved: " + (definition.label || milestoneId) +
      " (+" + formatCurrency(cashReward) + ")";

    triggered.push({
      id: milestoneId,
      title: definition.label || milestoneId,
      rewardSummary: rewardSummary,
      kind: "legacy",
      message: legacyMessage
    });
  });

  return triggered;
}

function getReputationBranches() {
  if (CONFIG.reputation && Array.isArray(CONFIG.reputation.branches)) {
    return CONFIG.reputation.branches.slice();
  }
  return [];
}

function getSelectedReputationBranch(gameState) {
  if (!gameState || !gameState.reputation) {
    return null;
  }
  const branchId = gameState.reputation.branchId;
  if (!branchId) {
    return null;
  }
  return getReputationBranches().find(function (branch) {
    return branch && branch.id === branchId;
  }) || null;
}

function selectReputationBranch(gameState, branchId) {
  if (!gameState || !gameState.player) {
    return { ok: false, code: "missing_state", message: "Game state missing." };
  }
  ensureReputationState(gameState);
  const branch = getReputationBranches().find(function (entry) {
    return entry && entry.id === branchId;
  });
  if (!branch) {
    return { ok: false, code: "branch_not_found", message: "Branch not found." };
  }
  if (gameState.reputation.branchId) {
    return { ok: false, code: "branch_already_selected", message: "Studio Identity already locked." };
  }
  const requiredReputation = Number.isFinite(branch.requiredReputation) ? branch.requiredReputation : 0;
  if (gameState.player.reputation < requiredReputation) {
    return {
      ok: false,
      code: "branch_not_eligible",
      message: "Need Reputation ≥ " + requiredReputation + " to choose an identity."
    };
  }
  gameState.reputation.branchId = branch.id;
  gameState.reputation.branchProgress = 0;
  return {
    ok: true,
    code: "branch_selected",
    message: "Studio Identity locked: " + branch.label + "."
  };
}
