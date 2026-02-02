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

function getContentTypeCostMultiplier(contentType) {
  const economyConfig = CONFIG.economy && typeof CONFIG.economy === "object" ? CONFIG.economy : {};
  const multConfig = economyConfig.contentTypeCostMult && typeof economyConfig.contentTypeCostMult === "object"
    ? economyConfig.contentTypeCostMult
    : {};
  const typeKey = (contentType || "").toLowerCase();
  const mult = Number.isFinite(multConfig[typeKey]) ? multConfig[typeKey] : 1;
  return mult;
}

function applyContentTypeCostMultiplier(baseCost, contentType) {
  const safeBase = Number.isFinite(baseCost) ? baseCost : 0;
  const mult = getContentTypeCostMultiplier(contentType);
  return {
    baseCost: safeBase,
    mult: mult,
    finalCost: Math.round(safeBase * mult)
  };
}

function getStarPowerCostConfig() {
  const economyConfig = CONFIG.economy && typeof CONFIG.economy === "object" ? CONFIG.economy : {};
  const starPowerCost = economyConfig.starPowerCost && typeof economyConfig.starPowerCost === "object"
    ? economyConfig.starPowerCost
    : null;
  const multipliers = starPowerCost && typeof starPowerCost.multipliers === "object"
    ? starPowerCost.multipliers
    : (economyConfig.starPowerCostMultipliers && typeof economyConfig.starPowerCostMultipliers === "object"
      ? economyConfig.starPowerCostMultipliers
      : {});
  return {
    enabled: starPowerCost ? starPowerCost.enabled !== false : true,
    threshold: Number.isFinite(starPowerCost && starPowerCost.threshold)
      ? starPowerCost.threshold
      : (Number.isFinite(economyConfig.starPowerCostThreshold) ? economyConfig.starPowerCostThreshold : 0),
    multipliers: multipliers,
    defaultMultiplier: Number.isFinite(starPowerCost && starPowerCost.defaultMultiplier)
      ? starPowerCost.defaultMultiplier
      : (Number.isFinite(economyConfig.starPowerCostMultiplierDefault)
        ? economyConfig.starPowerCostMultiplierDefault
        : 1)
  };
}

function getStarPowerCostMultiplier(starPower) {
  const config = getStarPowerCostConfig();
  const defaultMultiplier = config.defaultMultiplier;
  if (!config.enabled) {
    return defaultMultiplier;
  }
  if (!Number.isFinite(starPower)) {
    return defaultMultiplier;
  }
  if (starPower <= config.threshold) {
    return defaultMultiplier;
  }
  const normalizedStar = Math.max(0, Math.round(starPower));
  const lookup = config.multipliers[String(normalizedStar)];
  if (Number.isFinite(lookup)) {
    return lookup;
  }
  return defaultMultiplier;
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

function getEquipmentOfSubsMultiplier(gameState) {
  const cameraLevel = getEquipmentLevel(gameState, "cameraLevel");
  const setDressingLevel = getEquipmentLevel(gameState, "setDressingLevel");
  return (cameraLevel * CONFIG.equipment.upgrades.camera.ofSubsMultPerLevel) +
    (setDressingLevel * CONFIG.equipment.upgrades.set_dressing.ofSubsMultPerLevel);
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

function getDailyOfPayout(gameState) {
  const cashflowConfig = CONFIG.economy && CONFIG.economy.cashflow
    ? CONFIG.economy.cashflow
    : {};
  if (!cashflowConfig.enableDailyOfPayout) {
    return 0;
  }
  if (!gameState || !gameState.player) {
    return 0;
  }
  const subs = Number.isFinite(gameState.player.onlyFansSubscribers)
    ? gameState.player.onlyFansSubscribers
    : 0;
  const netMonthlyPerSub = Number.isFinite(cashflowConfig.ofNetMonthlyPerSub)
    ? cashflowConfig.ofNetMonthlyPerSub
    : 0;
  const daysPerMonth = Number.isFinite(cashflowConfig.daysPerMonth)
    ? cashflowConfig.daysPerMonth
    : 30;
  if (daysPerMonth <= 0) {
    return 0;
  }
  const payout = subs * (netMonthlyPerSub / daysPerMonth);
  return Math.max(0, Math.round(payout));
}

function getDailyOverhead(gameState) {
  const cashflowConfig = CONFIG.economy && CONFIG.economy.cashflow
    ? CONFIG.economy.cashflow
    : {};
  if (!cashflowConfig.enableDailyOverhead) {
    return { amount: 0, label: null };
  }
  if (!gameState || !gameState.player) {
    return { amount: 0, label: null };
  }
  const subs = Number.isFinite(gameState.player.onlyFansSubscribers)
    ? gameState.player.onlyFansSubscribers
    : 0;
  const tiers = Array.isArray(cashflowConfig.overheadTiers)
    ? cashflowConfig.overheadTiers
    : [];
  let selectedTier = null;
  tiers.forEach(function (tier) {
    if (!tier || typeof tier !== "object") {
      return;
    }
    const minSubs = Number.isFinite(tier.minSubs) ? tier.minSubs : 0;
    if (subs >= minSubs && (!selectedTier || minSubs > selectedTier.minSubs)) {
      selectedTier = tier;
    }
  });
  let amount = selectedTier && Number.isFinite(selectedTier.dailyOverhead)
    ? selectedTier.dailyOverhead
    : 0;
  let label = selectedTier && typeof selectedTier.label === "string"
    ? selectedTier.label
    : null;
  const upgradesConfig = CONFIG.upgrades && CONFIG.upgrades.manager
    ? CONFIG.upgrades.manager
    : null;
  const managerHired = Boolean(
    gameState &&
    gameState.player &&
    gameState.player.upgrades &&
    gameState.player.upgrades.managerHired
  );
  if (upgradesConfig && upgradesConfig.enabled && managerHired) {
    const reductionMult = Number.isFinite(upgradesConfig.overheadReductionMult)
      ? upgradesConfig.overheadReductionMult
      : 1;
    amount = Math.round(amount * reductionMult);
    if (!label) {
      label = "Manager";
    } else {
      label = label + " + Manager";
    }
  }
  const leaseConfig = CONFIG.leaseUpgrade && typeof CONFIG.leaseUpgrade === "object"
    ? CONFIG.leaseUpgrade
    : null;
  const leasePurchased = Boolean(
    gameState &&
    gameState.player &&
    gameState.player.upgrades &&
    gameState.player.upgrades.lease &&
    gameState.player.upgrades.lease.purchased
  );
  if (leaseConfig && leaseConfig.enabled && leasePurchased) {
    const leaseDelta = Number.isFinite(leaseConfig.overheadDeltaPerDay) ? leaseConfig.overheadDeltaPerDay : 0;
    amount += leaseDelta;
    if (!label) {
      label = "Lease";
    } else {
      label = label + " + Lease";
    }
  }
  const studioConfig = getStudioUpgradeConfig();
  const studioState = getStudioUpgradeState(gameState);
  if (studioConfig && studioConfig.enabled && studioState && studioState.purchased) {
    const studioDelta = Number.isFinite(studioConfig.effects && studioConfig.effects.dailyOverheadDelta)
      ? studioConfig.effects.dailyOverheadDelta
      : 0;
    amount += studioDelta;
    if (!label) {
      label = "Studio";
    } else {
      label = label + " + Studio";
    }
  }
  if (studioState && studioState.financePlan && studioState.financePlan.active && studioState.financePlan.daysRemaining > 0) {
    const dailyPayment = Number.isFinite(studioState.financePlan.dailyPayment) ? studioState.financePlan.dailyPayment : 0;
    if (dailyPayment > 0) {
      amount += dailyPayment;
      if (!label) {
        label = "Studio Note";
      } else {
        label = label + " + Studio Note";
      }
    }
  }
  const staffingConfig = typeof getStaffingPushConfig === "function" ? getStaffingPushConfig() : null;
  if (staffingConfig && gameState.flags && gameState.flags.act2StaffingCrisisActive) {
    const penalty = staffingConfig.penalty || {};
    const overheadPenalty = Number.isFinite(penalty.crisisOverheadPerDay) ? penalty.crisisOverheadPerDay : 0;
    if (overheadPenalty > 0) {
      amount += overheadPenalty;
      if (!label) {
        label = "Staffing Crisis";
      } else {
        label = label + " + Staffing Crisis";
      }
    }
  }
  return { amount: Math.max(0, Math.round(amount)), label: label };
}

function getStudioUpgradeConfig() {
  return CONFIG.studioUpgrade && typeof CONFIG.studioUpgrade === "object"
    ? CONFIG.studioUpgrade
    : null;
}

function getStudioUpgradeState(gameState) {
  if (!gameState || !gameState.player || !gameState.player.upgrades) {
    return null;
  }
  return gameState.player.upgrades.studioUpgrade || null;
}

function isStudioUpgradePurchased(gameState) {
  const studioState = getStudioUpgradeState(gameState);
  return Boolean(studioState && studioState.purchased);
}

function isStudioUpgradePenaltyActive(gameState) {
  const config = getStudioUpgradeConfig();
  const studioState = getStudioUpgradeState(gameState);
  if (!config || !studioState || !config.penalty || config.penalty.enabled !== true) {
    return false;
  }
  const currentDay = gameState && gameState.player && Number.isFinite(gameState.player.day)
    ? gameState.player.day
    : 0;
  return Number.isFinite(studioState.penaltyUntilDay) && currentDay <= studioState.penaltyUntilDay;
}

function getStudioUpgradePremiumMult(gameState) {
  const config = getStudioUpgradeConfig();
  if (!config) {
    return 1;
  }
  if (isStudioUpgradePenaltyActive(gameState)) {
    const penaltyMult = Number.isFinite(config.penalty && config.penalty.premiumOfSubsMult)
      ? config.penalty.premiumOfSubsMult
      : 1;
    return penaltyMult;
  }
  if (isStudioUpgradePurchased(gameState)) {
    const bonusMult = Number.isFinite(config.effects && config.effects.premiumOfSubsMult)
      ? config.effects.premiumOfSubsMult
      : 1;
    return bonusMult;
  }
  return 1;
}

function getStudioUpgradeShootCapBonus(gameState) {
  const config = getStudioUpgradeConfig();
  if (!config || !isStudioUpgradePurchased(gameState)) {
    return 0;
  }
  const bonus = Number.isFinite(config.effects && config.effects.dailyShootCapBonus)
    ? config.effects.dailyShootCapBonus
    : 0;
  return bonus;
}

function startStudioUpgradeCashPurchase(gameState, price) {
  const config = getStudioUpgradeConfig();
  if (!config || !gameState || !gameState.player) {
    return { ok: false, message: "Studio upgrade unavailable." };
  }
  const studioState = getStudioUpgradeState(gameState);
  if (!studioState) {
    return { ok: false, message: "Studio upgrade state missing." };
  }
  if (studioState.purchased) {
    return { ok: false, message: "Studio upgrade already active." };
  }
  const resolvedPrice = Number.isFinite(price) ? price : (Number.isFinite(config.cashPrice) ? config.cashPrice : 0);
  if (gameState.player.cash < resolvedPrice) {
    return { ok: false, message: "Not enough cash for the studio upgrade." };
  }
  gameState.player.cash = Math.max(0, gameState.player.cash - resolvedPrice);
  studioState.purchased = true;
  studioState.decision = "cash";
  studioState.financed = false;
  if (studioState.financePlan) {
    studioState.financePlan.active = false;
    studioState.financePlan.daysRemaining = 0;
  }
  studioState.penaltyUntilDay = null;
  const repBonus = Number.isFinite(config.effects && config.effects.repBonus) ? config.effects.repBonus : 0;
  if (repBonus > 0) {
    gameState.player.reputation = Math.max(0, gameState.player.reputation + repBonus);
  }
  return { ok: true, message: "Studio upgrade secured in cash." };
}

function startStudioUpgradeFinance(gameState) {
  const config = getStudioUpgradeConfig();
  if (!config || !gameState || !gameState.player) {
    return { ok: false, message: "Studio upgrade unavailable." };
  }
  const financeConfig = config.finance || {};
  if (financeConfig.enabled !== true) {
    return { ok: false, message: "Financing is not available." };
  }
  const studioState = getStudioUpgradeState(gameState);
  if (!studioState) {
    return { ok: false, message: "Studio upgrade state missing." };
  }
  if (studioState.purchased) {
    return { ok: false, message: "Studio upgrade already active." };
  }
  const downPayment = Number.isFinite(financeConfig.downPayment) ? financeConfig.downPayment : 0;
  if (gameState.player.cash < downPayment) {
    return { ok: false, message: "Not enough cash for the down payment." };
  }
  const termDays = Number.isFinite(financeConfig.termDays) ? financeConfig.termDays : 0;
  const financedAmount = Number.isFinite(financeConfig.totalFinancedAmount) ? financeConfig.totalFinancedAmount : 0;
  const dailyPayment = termDays > 0 ? Math.ceil(financedAmount / termDays) : 0;
  gameState.player.cash = Math.max(0, gameState.player.cash - downPayment);
  studioState.purchased = true;
  studioState.decision = "finance";
  studioState.financed = true;
  studioState.financePlan = {
    active: true,
    termDays: termDays,
    daysRemaining: termDays,
    dailyPayment: dailyPayment,
    totalFinancedAmount: financedAmount,
    downPayment: downPayment
  };
  studioState.penaltyUntilDay = null;
  const repBonus = Number.isFinite(config.effects && config.effects.repBonus) ? config.effects.repBonus : 0;
  if (repBonus > 0) {
    gameState.player.reputation = Math.max(0, gameState.player.reputation + repBonus);
  }
  return { ok: true, message: "Studio upgrade financed. The note starts tomorrow." };
}

function declineStudioUpgrade(gameState) {
  const config = getStudioUpgradeConfig();
  if (!config || !gameState || !gameState.player) {
    return { ok: false, message: "Studio upgrade unavailable." };
  }
  const studioState = getStudioUpgradeState(gameState);
  if (!studioState) {
    return { ok: false, message: "Studio upgrade state missing." };
  }
  if (studioState.purchased) {
    return { ok: false, message: "Studio upgrade already active." };
  }
  if (studioState.decision !== "none") {
    return { ok: false, message: "You already made a decision." };
  }
  studioState.decision = "declined";
  const repPenalty = Number.isFinite(config.repPenaltyOnDecline) ? config.repPenaltyOnDecline : 0;
  if (repPenalty > 0) {
    gameState.player.reputation = Math.max(0, gameState.player.reputation - repPenalty);
  }
  const penaltyConfig = config.penalty || {};
  if (penaltyConfig.enabled === true) {
    const durationDays = Number.isFinite(penaltyConfig.durationDays) ? penaltyConfig.durationDays : 0;
    studioState.penaltyUntilDay = gameState.player.day + durationDays;
  }
  return { ok: true, message: "You pass. The room notices." };
}

function buyLateStudioUpgrade(gameState) {
  const config = getStudioUpgradeConfig();
  if (!config) {
    return { ok: false, message: "Studio upgrade unavailable." };
  }
  const studioState = getStudioUpgradeState(gameState);
  if (!studioState) {
    return { ok: false, message: "Studio upgrade state missing." };
  }
  if (studioState.decision !== "declined" && studioState.decision !== "missed") {
    return { ok: false, message: "Late buy is not available yet." };
  }
  return startStudioUpgradeCashPurchase(gameState, config.latePrice);
}

function getDaysToAffordDebtEstimate(gameState) {
  const player = gameState && gameState.player ? gameState.player : null;
  const debtRemaining = player && Number.isFinite(player.debtRemaining) ? player.debtRemaining : 0;
  const cash = player && Number.isFinite(player.cash) ? player.cash : 0;
  const dailyPayout = typeof getDailyOfPayout === "function" ? getDailyOfPayout(gameState) : 0;
  const overhead = typeof getDailyOverhead === "function"
    ? getDailyOverhead(gameState)
    : { amount: 0, label: null };
  const dailyNet = dailyPayout - overhead.amount;
  if (debtRemaining <= 0) {
    return { days: 0, dailyNet: dailyNet };
  }
  const amountNeeded = Math.max(0, debtRemaining - cash);
  if (dailyNet <= 0) {
    return { days: null, dailyNet: dailyNet };
  }
  return { days: Math.ceil(amountNeeded / dailyNet), dailyNet: dailyNet };
}

function hireManager(gameState) {
  const managerConfig = CONFIG.upgrades && CONFIG.upgrades.manager
    ? CONFIG.upgrades.manager
    : null;
  if (!managerConfig || managerConfig.enabled !== true) {
    return { ok: false, message: "Manager upgrade not available." };
  }
  if (!gameState || !gameState.player) {
    return { ok: false, message: "Game state missing." };
  }
  if (!gameState.player.upgrades || typeof gameState.player.upgrades !== "object") {
    gameState.player.upgrades = { managerHired: false };
  }
  if (managerConfig.unlockAfterDebt === true && gameState.player.debtRemaining > 0) {
    return { ok: false, message: "Locked until debt is cleared." };
  }
  if (gameState.player.upgrades.managerHired) {
    return { ok: false, message: "Manager already hired." };
  }
  const cost = Number.isFinite(managerConfig.cost) ? managerConfig.cost : 0;
  if (gameState.player.cash < cost) {
    return { ok: false, message: "Not enough cash." };
  }
  gameState.player.cash = Math.max(0, gameState.player.cash - cost);
  gameState.player.upgrades.managerHired = true;
  return { ok: true, message: "Manager hired. Daily overhead reduced." };
}

function getNetWorth(gameState) {
  const cash = (gameState && gameState.player && Number.isFinite(gameState.player.cash))
    ? gameState.player.cash
    : 0;
  const mrr = getMRR(gameState);
  const netWorthConfig = CONFIG.economy && CONFIG.economy.netWorth ? CONFIG.economy.netWorth : null;
  const mult = netWorthConfig && Number.isFinite(netWorthConfig.valuationMultiple)
    ? netWorthConfig.valuationMultiple
    : 0;
  return Math.max(0, Math.round(cash + (mrr * mult)));
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

function applyEquipmentOfSubsMultiplier(baseOfSubs, gameState) {
  const safeOfSubs = Number.isFinite(baseOfSubs) ? baseOfSubs : 0;
  const multiplier = getEquipmentOfSubsMultiplier(gameState);
  return Math.round(safeOfSubs * (1 + multiplier));
}

function getEffectiveStarPower(performer) {
  const baseStar = performer && Number.isFinite(performer.starPower) ? performer.starPower : 1;
  const exponent = CONFIG.economy && Number.isFinite(CONFIG.economy.starPowerExponent)
    ? CONFIG.economy.starPowerExponent
    : 1;
  return Math.pow(baseStar, exponent);
}

function calculatePromoFollowers(performer, theme) {
  if (!performer || !theme) {
    return { ok: false, value: 0 };
  }
  const effectiveStar = getEffectiveStarPower(performer);
  const followersGained = Math.round(
    CONFIG.economy.promo_followers_gain *
    theme.modifiers.followersMult *
    effectiveStar
  );
  return { ok: true, value: Math.max(0, followersGained) };
}

function calculatePremiumOfSubs(performer, theme) {
  if (!performer || !theme) {
    return { ok: false, value: 0 };
  }
  const effectiveStar = getEffectiveStarPower(performer);
  const ofSubs = Math.round(
    CONFIG.economy.premium_base_of_subs *
    theme.modifiers.ofSubsMult *
    effectiveStar
  );
  return { ok: true, value: Math.max(0, ofSubs) };
}

function calculateSubscribersGained(followersGained) {
  const safeFollowers = Number.isFinite(followersGained) ? followersGained : 0;
  const subscribersGained = Math.floor(
    safeFollowers * CONFIG.economy.subscriber_conversion_rate
  );
  return Math.max(0, subscribersGained);
}

function payDebt(gameState, amount) {
  if (!gameState || !gameState.player) {
    return { ok: false, message: "No game state available." };
  }
  const debtPaymentConfig = CONFIG.economy && CONFIG.economy.debtPayment
    ? CONFIG.economy.debtPayment
    : {};
  const minPayment = Number.isFinite(debtPaymentConfig.minPayment)
    ? debtPaymentConfig.minPayment
    : 0;
  const player = gameState.player;
  const cash = Number.isFinite(player.cash) ? player.cash : 0;
  const debtRemaining = Number.isFinite(player.debtRemaining) ? player.debtRemaining : 0;
  if (debtRemaining <= 0) {
    return { ok: false, message: "Debt already cleared." };
  }
  if (cash <= 0) {
    return { ok: false, message: "No cash available." };
  }
  let payAmount = 0;
  const upperBound = Math.min(cash, debtRemaining);
  if (amount === null || typeof amount === "undefined" || amount === "max") {
    payAmount = upperBound;
  } else {
    const requested = Number(amount);
    if (!Number.isFinite(requested)) {
      return { ok: false, message: "Invalid payment amount." };
    }
    payAmount = Math.min(Math.max(requested, minPayment), upperBound);
  }
  if (payAmount <= 0) {
    return { ok: false, message: "No valid payment amount available." };
  }
  const debtRemainingBefore = player.debtRemaining;
  player.cash = Math.max(0, cash - payAmount);
  player.debtRemaining = Math.max(0, debtRemaining - payAmount);
  const debtClearedNow = player.debtRemaining <= 0;
  const paidInOneGo = debtClearedNow && debtRemainingBefore > 0;
  if (paidInOneGo) {
    if (typeof ensureConquestsState === "function") {
      ensureConquestsState(gameState);
    }
    if (gameState.conquests && gameState.conquests.characters) {
      if (!gameState.conquests.characters.bankManager) {
        gameState.conquests.characters.bankManager = { stageUnlocked: 0 };
      }
      const bankManager = gameState.conquests.characters.bankManager;
      const currentStage = Number.isFinite(bankManager.stageUnlocked) ? bankManager.stageUnlocked : 0;
      bankManager.stageUnlocked = Math.max(currentStage, 3);
      if (Array.isArray(gameState.conquests.inbox)) {
        gameState.conquests.inbox = gameState.conquests.inbox.filter(function (message) {
          if (!message || message.characterId !== "bankManager") {
            return true;
          }
          return Number.isFinite(message.stageIndex) ? message.stageIndex >= 4 : false;
        });
      }
    }
  }
  const competitionUnlocked = debtRemainingBefore > 0 && player.debtRemaining <= 0;
  let saturationActivated = false;
  const saturationConfig = CONFIG.market && CONFIG.market.saturation ? CONFIG.market.saturation : null;
  if (competitionUnlocked && saturationConfig && saturationConfig.enabledAfterDebt === true) {
    if (!gameState.market || typeof gameState.market !== "object") {
      gameState.market = { activeShiftId: null, shiftHistory: [], saturation: { active: false, activatedDay: null } };
    }
    if (!gameState.market.saturation || typeof gameState.market.saturation !== "object") {
      gameState.market.saturation = { active: false, activatedDay: null };
    }
    if (!gameState.market.saturation.active) {
      gameState.market.saturation.active = true;
      gameState.market.saturation.activatedDay = Number.isFinite(player.day)
        ? player.day
        : null;
      saturationActivated = true;
    }
  }
  const formatValue = typeof formatCurrency === "function"
    ? formatCurrency
    : function (value) { return "$" + Math.round(value).toLocaleString(); };
  const debtCleared = player.debtRemaining <= 0;
  const message = debtCleared
    ? "Debt paid in full."
    : "Paid " + formatValue(payAmount) + " toward your debt.";
  const conquestResult = typeof checkConquests === "function"
    ? checkConquests(gameState)
    : { cards: [] };
  return {
    ok: true,
    message: message,
    amountPaid: payAmount,
    debtCleared: debtCleared,
    saturationActivated: saturationActivated,
    competitionUnlocked: competitionUnlocked,
    conquestResult: conquestResult
  };
}
