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
