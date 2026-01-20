function purchaseTier1Location(gameState) {
  if (!gameState) {
    return { ok: false, message: "Game state missing." };
  }

  if (gameState.unlocks.locationTier1Unlocked) {
    return { ok: false, message: "Tier 1 location already unlocked." };
  }

  const cost = CONFIG.progression.location_tier_1_unlock_cost;
  if (gameState.player.cash < cost) {
    return { ok: false, message: "Not enough cash to unlock Tier 1." };
  }

  gameState.player.cash = Math.max(0, gameState.player.cash - cost);
  gameState.unlocks.locationTier1Unlocked = true;

  return { ok: true, message: "Tier 1 location unlocked." };
}

function purchaseLocationUnlock(gameState) {
  return purchaseTier1Location(gameState);
}
