function getEquipmentLevelKey(upgradeId) {
  if (upgradeId === "lighting") {
    return "lightingLevel";
  }
  if (upgradeId === "camera") {
    return "cameraLevel";
  }
  if (upgradeId === "set_dressing") {
    return "setDressingLevel";
  }
  return null;
}

function getEquipmentUpgradeLabel(upgradeId) {
  if (upgradeId === "lighting") {
    return "Lighting";
  }
  if (upgradeId === "camera") {
    return "Camera";
  }
  if (upgradeId === "set_dressing") {
    return "Set Dressing";
  }
  return "Unknown";
}

function formatEquipmentPercent(value) {
  const safeValue = Number.isFinite(value) ? value : 0;
  return Math.round(safeValue * 100);
}

function buildEquipmentBonusMessage(upgrade, level) {
  if (!upgrade || !Number.isFinite(level) || level <= 0) {
    return "";
  }

  const followerPerLevel = Number.isFinite(upgrade.followersMultPerLevel) ? upgrade.followersMultPerLevel : 0;
  const ofSubsPerLevel = Number.isFinite(upgrade.ofSubsMultPerLevel) ? upgrade.ofSubsMultPerLevel : 0;
  const parts = [];

  if (followerPerLevel > 0) {
    parts.push(
      "Social follower bonus: +" + formatEquipmentPercent(followerPerLevel) +
      "% per level (you're now at +" + formatEquipmentPercent(followerPerLevel * level) + "%)."
    );
  }

  if (ofSubsPerLevel > 0) {
    parts.push(
      "Premium OF subs bonus: +" + formatEquipmentPercent(ofSubsPerLevel) +
      "% per level (you're now at +" + formatEquipmentPercent(ofSubsPerLevel * level) + "%)."
    );
  }

  return parts.join(" ");
}

function purchaseEquipmentUpgrade(gameState, upgradeId) {
  if (!gameState || !gameState.player || !gameState.equipment) {
    return { ok: false, code: "state_missing", message: "Game state missing." };
  }

  const upgrades = CONFIG.equipment && CONFIG.equipment.upgrades ? CONFIG.equipment.upgrades : null;
  if (!upgrades || !upgrades[upgradeId]) {
    return { ok: false, code: "upgrade_not_found", message: "Upgrade not found." };
  }

  const levelKey = getEquipmentLevelKey(upgradeId);
  if (!levelKey) {
    return { ok: false, code: "upgrade_not_found", message: "Upgrade not found." };
  }

  const upgrade = upgrades[upgradeId];
  const currentLevel = Number.isFinite(gameState.equipment[levelKey]) ? gameState.equipment[levelKey] : 0;
  const maxLevel = Number.isFinite(upgrade.maxLevel) ? upgrade.maxLevel : 0;

  if (currentLevel >= maxLevel) {
    return {
      ok: false,
      code: "upgrade_maxed",
      message: getEquipmentUpgradeLabel(upgradeId) + " is MAXED (Level " + currentLevel + "/" + maxLevel + "). " +
        "You can't squeeze more quality out of this setup."
    };
  }

  const cost = upgrade.levelCosts[currentLevel];
  if (!Number.isFinite(cost)) {
    return { ok: false, code: "upgrade_not_found", message: "Upgrade cost missing." };
  }

  if (gameState.player.cash < cost) {
    const needed = Math.max(0, cost - gameState.player.cash);
    return {
      ok: false,
      code: "insufficient_funds",
      message: "Not enough cash for " + getEquipmentUpgradeLabel(upgradeId) + " Level " + (currentLevel + 1) + ". " +
        "Need " + formatCurrency(needed) + " more. Go book a shoot."
    };
  }

  gameState.player.cash = Math.max(0, gameState.player.cash - cost);
  const nextLevel = currentLevel + 1;
  gameState.equipment[levelKey] = nextLevel;
  if (typeof ensureStatsState === "function") {
    ensureStatsState(gameState);
  }
  if (gameState.stats) {
    gameState.stats.totalShopSpend = Math.max(0, (gameState.stats.totalShopSpend || 0) + cost);
    gameState.stats.totalUpgradesPurchased = Math.max(0, (gameState.stats.totalUpgradesPurchased || 0) + 1);
  }

  const bonusMessage = buildEquipmentBonusMessage(upgrade, nextLevel);
  const upcomingCost = nextLevel < maxLevel ? upgrade.levelCosts[nextLevel] : null;
  const nextCostMessage = Number.isFinite(upcomingCost)
    ? "Next upgrade costs " + formatCurrency(upcomingCost) + "."
    : getEquipmentUpgradeLabel(upgradeId) + " is MAXED (Level " + nextLevel + "/" + maxLevel + ").";
  const messageParts = [
    "🔥 Upgraded " + getEquipmentUpgradeLabel(upgradeId) + " to Level " + nextLevel + "/" + maxLevel + ".",
    bonusMessage,
    nextCostMessage
  ].filter(Boolean);
  const conquestResult = typeof checkConquests === "function"
    ? checkConquests(gameState)
    : { cards: [] };

  return {
    ok: true,
    message: messageParts.join(" "),
    conquestEvents: conquestResult.cards || []
  };
}

function getLeaseUpgradeConfig() {
  if (CONFIG.leaseUpgrade && typeof CONFIG.leaseUpgrade === "object") {
    return CONFIG.leaseUpgrade;
  }
  return null;
}

function getLeaseUpgradeStatus(gameState) {
  const config = getLeaseUpgradeConfig();
  if (!config || config.enabled !== true) {
    return { available: false, reason: "Lease upgrade unavailable." };
  }
  if (!gameState || !gameState.player) {
    return { available: false, reason: "Game state missing." };
  }
  if (typeof ensurePlayerUpgradesState === "function") {
    ensurePlayerUpgradesState(gameState);
  }
  const leaseState = gameState.player.upgrades && gameState.player.upgrades.lease
    ? gameState.player.upgrades.lease
    : null;
  if (!leaseState) {
    return { available: false, reason: "Lease data missing." };
  }
  const currentDay = Number.isFinite(gameState.player.day) ? gameState.player.day : 0;
  const offerStartedDay = Number.isFinite(leaseState.offerStartedDay) ? leaseState.offerStartedDay : null;
  const offerDeadlineDay = Number.isFinite(leaseState.offerDeadlineDay)
    ? leaseState.offerDeadlineDay
    : (Number.isFinite(config.storyTriggerDay) && Number.isFinite(config.windowDays)
      ? config.storyTriggerDay + config.windowDays
      : null);
  const isUnlocked = Number.isFinite(config.shopUnlockAfterDay) ? currentDay >= config.shopUnlockAfterDay : true;
  const isPurchased = Boolean(leaseState.purchased);
  const isOfferActive = isUnlocked && !isPurchased && offerDeadlineDay !== null && currentDay <= offerDeadlineDay;
  const isLate = isUnlocked && !isPurchased && offerDeadlineDay !== null && currentDay > offerDeadlineDay;
  const price = isOfferActive
    ? config.windowPrice
    : (isLate ? config.latePrice : null);
  return {
    available: isOfferActive || isLate,
    isUnlocked: isUnlocked,
    isPurchased: isPurchased,
    isOfferActive: isOfferActive,
    isLate: isLate,
    price: Number.isFinite(price) ? price : null,
    deadlineDay: offerDeadlineDay
  };
}

function purchaseLeaseUpgrade(gameState) {
  const config = getLeaseUpgradeConfig();
  if (!config || config.enabled !== true) {
    return { ok: false, message: "Lease upgrade not available." };
  }
  if (!gameState || !gameState.player) {
    return { ok: false, message: "Game state missing." };
  }
  if (typeof ensurePlayerUpgradesState === "function") {
    ensurePlayerUpgradesState(gameState);
  }
  const leaseState = gameState.player.upgrades && gameState.player.upgrades.lease
    ? gameState.player.upgrades.lease
    : null;
  if (!leaseState) {
    return { ok: false, message: "Lease data missing." };
  }
  if (leaseState.purchased) {
    return { ok: false, message: "Lease upgrade already purchased." };
  }
  const status = getLeaseUpgradeStatus(gameState);
  if (!status.available || !Number.isFinite(status.price)) {
    return { ok: false, message: "Lease upgrade not available yet." };
  }
  const price = status.price;
  if (gameState.player.cash < price) {
    return { ok: false, message: "Not enough cash for the lease upgrade." };
  }
  gameState.player.cash = Math.max(0, gameState.player.cash - price);
  leaseState.purchased = true;
  if (!Number.isFinite(leaseState.offerStartedDay)) {
    leaseState.offerStartedDay = Number.isFinite(config.storyTriggerDay) ? config.storyTriggerDay : null;
  }
  if (!Number.isFinite(leaseState.offerDeadlineDay)) {
    leaseState.offerDeadlineDay = Number.isFinite(config.storyTriggerDay) && Number.isFinite(config.windowDays)
      ? config.storyTriggerDay + config.windowDays
      : null;
  }
  const repBonus = Number.isFinite(config.repOnPurchase) ? config.repOnPurchase : 0;
  gameState.player.reputation = Math.max(0, gameState.player.reputation + repBonus);
  if (typeof ensureStatsState === "function") {
    ensureStatsState(gameState);
  }
  if (gameState.stats) {
    gameState.stats.totalShopSpend = Math.max(0, (gameState.stats.totalShopSpend || 0) + price);
    gameState.stats.totalUpgradesPurchased = Math.max(0, (gameState.stats.totalUpgradesPurchased || 0) + 1);
  }
  return {
    ok: true,
    message: "Lease signed. Bigger stage, bigger burn, and the city starts to treat you like the real thing."
  };
}
