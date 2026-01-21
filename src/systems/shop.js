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
    return { ok: false, code: "upgrade_maxed", message: getEquipmentUpgradeLabel(upgradeId) + " already maxed." };
  }

  const cost = upgrade.levelCosts[currentLevel];
  if (!Number.isFinite(cost)) {
    return { ok: false, code: "upgrade_not_found", message: "Upgrade cost missing." };
  }

  if (gameState.player.cash < cost) {
    return { ok: false, code: "insufficient_funds", message: "Not enough cash for this upgrade." };
  }

  gameState.player.cash = Math.max(0, gameState.player.cash - cost);
  const nextLevel = currentLevel + 1;
  gameState.equipment[levelKey] = nextLevel;

  return {
    ok: true,
    message: "Upgraded " + getEquipmentUpgradeLabel(upgradeId) + " to Level " + nextLevel + "."
  };
}
