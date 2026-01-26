function calculateShootCost(location) {
  if (!location) {
    return { ok: false, value: 0, message: "Select a location to calculate cost." };
  }
  const cost = CONFIG.economy.base_shoot_cost + location.cost;
  return { ok: true, value: Math.max(0, Math.round(cost)) };
}

function calculateAgencyPackCost(location) {
  if (!location) {
    return { ok: false, value: 0, message: "Select a location to calculate cost." };
  }
  const agencyConfig = CONFIG.agencyPacks && typeof CONFIG.agencyPacks === "object"
    ? CONFIG.agencyPacks
    : {};
  const flatFee = Number.isFinite(agencyConfig.flatFee) ? agencyConfig.flatFee : 0;
  const cost = flatFee + location.cost;
  return { ok: true, value: Math.max(0, Math.round(cost)) };
}

function getEquipmentLevel(gameState, levelKey) {
  if (!gameState || !gameState.equipment) {
    return 0;
  }
  const level = Number.isFinite(gameState.equipment[levelKey]) ? gameState.equipment[levelKey] : 0;
  return Math.max(0, level);
}

function getEquipmentFollowersMultiplier(gameState) {
  const lightingLevel = getEquipmentLevel(gameState, "lightingLevel");
  const setDressingLevel = getEquipmentLevel(gameState, "setDressingLevel");
  return (lightingLevel * CONFIG.equipment.upgrades.lighting.followersMultPerLevel) +
    (setDressingLevel * CONFIG.equipment.upgrades.set_dressing.followersMultPerLevel);
}

function getEquipmentRevenueMultiplier(gameState) {
  const cameraLevel = getEquipmentLevel(gameState, "cameraLevel");
  const setDressingLevel = getEquipmentLevel(gameState, "setDressingLevel");
  return (cameraLevel * CONFIG.equipment.upgrades.camera.revenueMultPerLevel) +
    (setDressingLevel * CONFIG.equipment.upgrades.set_dressing.revenueMultPerLevel);
}

function getMRR(gameState) {
  if (!gameState || !gameState.player) {
    return 0;
  }
  const subs = Number.isFinite(gameState.player.onlyFansSubscribers)
    ? gameState.player.onlyFansSubscribers
    : 0;
  const price = CONFIG.onlyfans && Number.isFinite(CONFIG.onlyfans.pricePerMonth)
    ? CONFIG.onlyfans.pricePerMonth
    : 0;
  return Math.max(0, subs * price);
}

function getMRRDeltaForSubs(subsDelta) {
  const safeSubs = Number.isFinite(subsDelta) ? subsDelta : 0;
  const price = CONFIG.onlyfans && Number.isFinite(CONFIG.onlyfans.pricePerMonth)
    ? CONFIG.onlyfans.pricePerMonth
    : 0;
  return Math.max(0, safeSubs * price);
}

function applyEquipmentFollowersMultiplier(baseFollowers, gameState) {
  const safeFollowers = Number.isFinite(baseFollowers) ? baseFollowers : 0;
  const multiplier = getEquipmentFollowersMultiplier(gameState);
  return Math.round(safeFollowers * (1 + multiplier));
}

function applyEquipmentRevenueMultiplier(baseRevenue, gameState) {
  const safeRevenue = Number.isFinite(baseRevenue) ? baseRevenue : 0;
  const multiplier = getEquipmentRevenueMultiplier(gameState);
  return Math.round(safeRevenue * (1 + multiplier));
}

function calculatePromoFollowers(performer, theme) {
  if (!performer || !theme) {
    return { ok: false, value: 0 };
  }
  const followersGained = Math.round(
    CONFIG.economy.promo_followers_gain *
    theme.modifiers.followersMult *
    performer.starPower
  );
  return { ok: true, value: Math.max(0, followersGained) };
}

function calculatePremiumRevenue(performer, theme) {
  if (!performer || !theme) {
    return { ok: false, value: 0 };
  }
  const revenue = Math.round(
    CONFIG.economy.premium_base_revenue *
    theme.modifiers.revenueMult *
    performer.starPower
  );
  return { ok: true, value: Math.max(0, revenue) };
}

function calculateSubscribersGained(followersGained) {
  const safeFollowers = Number.isFinite(followersGained) ? followersGained : 0;
  const subscribersGained = Math.floor(
    safeFollowers * CONFIG.economy.subscriber_conversion_rate
  );
  return Math.max(0, subscribersGained);
}

function payDebt(gameState) {
  if (!gameState || !gameState.player) {
    return { ok: false, message: "No game state available." };
  }
  if (gameState.player.debtRemaining <= 0) {
    return { ok: false, message: "Debt already paid." };
  }
  if (gameState.player.cash < gameState.player.debtRemaining) {
    return { ok: false, message: "Not enough cash to pay the debt." };
  }
  gameState.player.cash = Math.max(0, gameState.player.cash - gameState.player.debtRemaining);
  gameState.player.debtRemaining = 0;
  return { ok: true, message: "Debt paid in full." };
}
