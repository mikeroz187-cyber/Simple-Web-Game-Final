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
    return gameState.player.followers;
  }
  if (type === "subscribers") {
    return gameState.player.subscribers;
  }
  if (type === "reputation") {
    return gameState.player.reputation;
  }
  if (type === "lifetimeRevenue") {
    return getLifetimeRevenue(gameState);
  }
  return 0;
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
    gameState.player.followers = Math.max(0, gameState.player.followers + followerReward);
    rewardLabels.push("+" + followerReward + " followers");
  }

  const subscriberReward = milestone.rewardSubscribers;
  if (Number.isFinite(subscriberReward) && subscriberReward !== 0) {
    gameState.player.subscribers = Math.max(0, gameState.player.subscribers + subscriberReward);
    rewardLabels.push("+" + subscriberReward + " subscribers");
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
      return;
    }
    const metricValue = getMilestoneMetricValue(gameState, definition);
    if (!Number.isFinite(metricValue) || metricValue < definition.threshold) {
      return;
    }

    const rewardSummary = applyMilestoneRewards(gameState, definition);
    const record = existing || { id: milestoneId };
    record.completed = true;
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
