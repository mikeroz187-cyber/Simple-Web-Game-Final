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
    return { ok: false, message: "Unknown location tier." };
  }

  if (!gameState.unlocks.locationTiers || typeof gameState.unlocks.locationTiers !== "object") {
    gameState.unlocks.locationTiers = { tier0: true, tier1: false, tier2: false };
  }

  if (isLocationTierUnlocked(gameState, tierId)) {
    return { ok: false, message: "Location Tier 1 already unlocked." };
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
