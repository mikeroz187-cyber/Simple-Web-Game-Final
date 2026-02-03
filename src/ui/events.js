function setUiMessage(message) {
  const uiState = getUiState();
  uiState.message = message || "";
}

function setDebugDayStatus(message) {
  const uiState = getUiState();
  if (!uiState.debug) {
    uiState.debug = { dayStatus: "" };
  }
  uiState.debug.dayStatus = message || "";
}

function setEquipmentMessage(message) {
  const uiState = getUiState();
  if (!uiState.shop) {
    uiState.shop = { equipmentMessage: "" };
  }
  uiState.shop.equipmentMessage = message || "";
}

function setIndustrySelectedStudioId(studioId) {
  const uiState = getUiState();
  uiState.industrySelectedStudioId = studioId || null;
}

function getIndustrySelectedStudioId() {
  const uiState = getUiState();
  return uiState.industrySelectedStudioId || null;
}

function buildDailyCashflowMessage(cashflow) {
  if (!cashflow || typeof cashflow !== "object") {
    return "";
  }
  const subs = Number.isFinite(cashflow.subs) ? cashflow.subs : 0;
  const payout = Number.isFinite(cashflow.payout) ? cashflow.payout : 0;
  const overheadAmount = Number.isFinite(cashflow.overheadAmount) ? cashflow.overheadAmount : 0;
  const overheadLabel = typeof cashflow.overheadLabel === "string" ? cashflow.overheadLabel : "";
  const payoutLine = "OF Payout: +" + formatCurrency(payout) + " (" + subs + " subs)";
  const overheadLabelSuffix = overheadLabel ? (" - " + overheadLabel) : "";
  const overheadLine = "Overhead (Scaling" + overheadLabelSuffix + "): -" + formatCurrency(overheadAmount);
  return payoutLine + "<br>" + overheadLine;
}

function clearSlideshowState() {
  const uiState = getUiState();
  uiState.slideshow = { mode: null, id: null, index: 0, origin: null };
  uiState.recruitMeet = { performerId: null, slideIndex: 0 };
}

function resetBookingSelection() {
  const uiState = getUiState();
  const bookingMode = uiState.booking && uiState.booking.bookingMode ? uiState.booking.bookingMode : "core";
  uiState.booking = {
    performerIdA: null,
    locationId: null,
    themeId: null,
    contentType: null,
    bookingMode: bookingMode
  };
}

function clearModal() {
  const modalRoot = qs("#modal-root");
  if (modalRoot) {
    modalRoot.innerHTML = "";
  }
}

function showEventCards(cards) {
  const modalRoot = qs("#modal-root");
  if (!modalRoot || !Array.isArray(cards) || cards.length === 0) {
    return;
  }

  const eventHtml = cards.map(function (card) {
    return "<div class=\"modal-event\">" +
      "<h3 class=\"modal-title\">" + card.title + "</h3>" +
      "<p class=\"modal-message\">" + card.message + "</p>" +
      "</div>";
  }).join("");

  modalRoot.innerHTML =
    "<div class=\"modal-overlay\">" +
    "<div class=\"modal-card\">" +
    eventHtml +
    "<div class=\"button-row\">" +
    "<button class=\"button primary\" data-action=\"dismiss-modal\">Close</button>" +
    "</div>" +
    "</div>" +
    "</div>";
}

function showDecisionModal(opts) {
  const modalRoot = qs("#modal-root");
  if (!modalRoot || !opts) {
    return;
  }
  const title = opts.title || "Decision";
  const messageHtml = opts.messageHtml || "";
  const imagePath = opts.imagePath || "";
  const imageFallbackPath = opts.imageFallbackPath || "";
  const primaryLabel = opts.primaryLabel || "Confirm";
  const primaryAction = opts.primaryAction || "dismiss-modal";
  const primaryDisabled = opts.primaryDisabled === true;
  const secondaryLabel = opts.secondaryLabel || "Cancel";
  const secondaryAction = opts.secondaryAction || "dismiss-modal";
  const extraHtml = opts.extraHtml || "";
  const imageHtml = imagePath
    ? "<img class=\"decision-mascot\" src=\"" + imagePath + "\" alt=\"\"" +
      (imageFallbackPath ? " onerror=\"this.onerror=null;this.src='" + imageFallbackPath + "'\"" : "") +
      " />"
    : "";

  modalRoot.innerHTML =
    "<div class=\"modal-overlay\">" +
    "<div class=\"modal-card modal-card--decision\">" +
    "<div class=\"decision-layout\">" +
    imageHtml +
    "<div class=\"decision-body\">" +
    "<h3 class=\"modal-title\">" + title + "</h3>" +
    "<p class=\"modal-message\">" + messageHtml + "</p>" +
    extraHtml +
    "<div class=\"button-row\" style=\"margin-top:12px;\">" +
    "<button class=\"button primary\" data-action=\"" + primaryAction + "\"" + (primaryDisabled ? " disabled" : "") + ">" + primaryLabel + "</button>" +
    "<button class=\"button\" data-action=\"" + secondaryAction + "\">" + secondaryLabel + "</button>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>";
}

function shouldShowTakeoverVictoryModal(gameState) {
  const victory = gameState && gameState.takeover && gameState.takeover.victory
    ? gameState.takeover.victory
    : null;
  return Boolean(victory && victory.achieved && !victory.modalShown);
}

function showTakeoverVictoryModal(gameState, extraHtml) {
  if (!shouldShowTakeoverVictoryModal(gameState)) {
    return false;
  }
  const takeoverConfig = CONFIG.takeover && typeof CONFIG.takeover === "object" ? CONFIG.takeover : {};
  const placeholderPath = takeoverConfig.placeholderPortraitPath || CONFIG.LOCATION_PLACEHOLDER_THUMB_PATH || "";
  const victory = gameState.takeover.victory;
  victory.modalShown = true;
  showDecisionModal({
    title: "INDUSTRY OWNED",
    messageHtml: "Five studios. Twenty-five contracts. One signature.<br>" +
      "You didn’t beat the market — you bought it." +
      "<ul style=\"margin-top: 10px;\">" +
        "<li>✓ All studios defeated</li>" +
        "<li>✓ Empire screen unlocked</li>" +
        "<li>✓ Free play continues</li>" +
      "</ul>",
    imagePath: "assets/images/mascots/talentscout_introducing.png",
    imageFallbackPath: placeholderPath,
    primaryLabel: "Open Empire",
    primaryAction: "nav-empire",
    secondaryLabel: "Later",
    secondaryAction: "dismiss-modal",
    extraHtml: extraHtml || ""
  });
  return true;
}

function getTakeoverStageLabel(stage) {
  if (stage === "intel") {
    return "Intel";
  }
  if (stage === "approach") {
    return "Approach";
  }
  if (stage === "turn") {
    return "Turn";
  }
  if (stage === "debut") {
    return "Debut";
  }
  return "Stage";
}

function getTakeoverWeaknessLabel(type) {
  if (type === "neglect") {
    return "Neglect";
  }
  if (type === "debt") {
    return "Debt";
  }
  if (type === "pride") {
    return "Pride";
  }
  if (type === "secret") {
    return "Secret";
  }
  return "Ambition";
}

function getTakeoverWeaknessAngle(type) {
  if (type === "neglect") {
    return "She wants attention. Give it to her until she can't go back.";
  }
  if (type === "debt") {
    return "Cover her bills, then make sure she knows what she owes.";
  }
  if (type === "pride") {
    return "Challenge her ego and make her prove she belongs with you.";
  }
  if (type === "secret") {
    return "Hold her secret tight enough that she can't risk saying no.";
  }
  return "Promise the stardom she craves, then set the price.";
}

function getTakeoverWeaknessRepDelta(weaknessType) {
  const takeoverConfig = CONFIG.takeover && typeof CONFIG.takeover === "object" ? CONFIG.takeover : {};
  const repChanges = takeoverConfig.repChanges || {};
  if (weaknessType === "neglect") {
    return Number.isFinite(repChanges.weaknessNeglect) ? repChanges.weaknessNeglect : 0;
  }
  if (weaknessType === "debt") {
    return Number.isFinite(repChanges.weaknessDebt) ? repChanges.weaknessDebt : -5;
  }
  if (weaknessType === "pride") {
    return Number.isFinite(repChanges.weaknessPride) ? repChanges.weaknessPride : -10;
  }
  if (weaknessType === "secret") {
    return Number.isFinite(repChanges.weaknessSecret) ? repChanges.weaknessSecret : -20;
  }
  return Number.isFinite(repChanges.weaknessAmbition) ? repChanges.weaknessAmbition : 0;
}

function getTakeoverStageSlideLimit(stage) {
  if (stage === "intel") {
    return 3;
  }
  return 5;
}

function getTakeoverStageNext(stage) {
  if (stage === "intel") {
    return "approach";
  }
  if (stage === "approach") {
    return "turn";
  }
  if (stage === "turn") {
    return "debut";
  }
  return null;
}

function buildTakeoverStoryLogEntry(gameState, performerName, message, suffix) {
  if (!gameState || !gameState.player) {
    return null;
  }
  const dayNumber = Number.isFinite(gameState.player.day) ? gameState.player.day : 0;
  const idSuffix = suffix || String(Date.now());
  return {
    id: "takeover_" + performerName.replace(/\s+/g, "_").toLowerCase() + "_" + idSuffix,
    dayNumber: dayNumber,
    title: "Industry Takeover",
    body: message,
    timestamp: new Date().toISOString()
  };
}

function getBossStageCopy(stageKey) {
  if (stageKey === "summons") {
    return "She contacts you. Neutral ground. Just talking. You both know that's a lie.";
  }
  if (stageKey === "negotiation") {
    return "\"A merger,\" she offers. \"Equal partners.\" You laugh. She doesn't.";
  }
  if (stageKey === "power_play") {
    return "Threats now. Lawyers. Old favors. None of it lands.";
  }
  if (stageKey === "fall") {
    return "The moment she realizes she's not negotiating anymore. She's surrendering.";
  }
  if (stageKey === "terms") {
    return "The terms are yours to dictate. And you dictate thoroughly.";
  }
  return "The room tilts. The leverage shifts. You're in control.";
}

function showTakeoverStageModal(gameState) {
  const modalRoot = qs("#modal-root");
  if (!modalRoot || !gameState) {
    return;
  }
  const uiState = getUiState();
  const modalState = uiState.takeoverStageModal;
  if (!modalState || !modalState.performerId) {
    clearModal();
    return;
  }
  const performerConfig = typeof getTakeoverPerformerConfig === "function"
    ? getTakeoverPerformerConfig(modalState.performerId)
    : null;
  const performerState = typeof getTakeoverPerformerState === "function"
    ? getTakeoverPerformerState(gameState, modalState.performerId)
    : null;
  const takeoverConfig = CONFIG.takeover && typeof CONFIG.takeover === "object" ? CONFIG.takeover : {};
  const placeholderPath = takeoverConfig.placeholderPortraitPath || CONFIG.LOCATION_PLACEHOLDER_THUMB_PATH || "";
  const stage = modalState.stage || (performerState ? performerState.currentStage : "intel");
  const stageLabel = getTakeoverStageLabel(stage);
  const performerName = performerConfig && performerConfig.name ? performerConfig.name : "Performer";
  const weaknessType = performerState && performerState.weaknessType
    ? performerState.weaknessType
    : (performerConfig && performerConfig.weaknessType ? performerConfig.weaknessType : "ambition");
  const weaknessLabel = getTakeoverWeaknessLabel(weaknessType);
  const weaknessAngle = getTakeoverWeaknessAngle(weaknessType);
  const repDelta = getTakeoverWeaknessRepDelta(weaknessType);
  const maxSlides = getTakeoverStageSlideLimit(stage);
  const slides = typeof getTakeoverStageImagePaths === "function"
    ? getTakeoverStageImagePaths(modalState.performerId, stage, maxSlides)
    : [];
  const slideCount = slides.length ? slides.length : 1;
  const safeIndex = Math.min(Math.max(0, modalState.index || 0), slideCount - 1);
  const slidePath = slides.length ? slides[safeIndex] : placeholderPath;
  const slideNumber = slideCount ? safeIndex + 1 : 0;
  const imageHtml = "<div class=\"slideshow-image-container\">" +
    "<img class=\"slideshow-image\" src=\"" + slidePath + "\" alt=\"" + stageLabel + " slide " + slideNumber + "\"" +
    (placeholderPath ? " onerror=\"this.onerror=null;this.src='" + placeholderPath + "'\"" : "") + " />" +
    "</div>";
  const prevDisabled = safeIndex <= 0;
  const nextDisabled = safeIndex >= slideCount - 1;
  const controlsHtml = "<div class=\"slideshow-controls\">" +
    createButton("Prev", "takeover-stage-prev", "", prevDisabled) +
    createButton("Next", "takeover-stage-next", "primary", nextDisabled) +
    "<span class=\"slideshow-counter\">Slide " + slideNumber + " of " + slideCount + "</span>" +
    "</div>";
  const messageLines = [];
  if (stage === "intel") {
    messageLines.push("<strong>Weakness Identified:</strong> " + weaknessLabel);
    messageLines.push("\"" + weaknessAngle + "\"");
  } else if (stage === "approach") {
    messageLines.push("She’s responding. She thinks she’s choosing this.");
    messageLines.push("Turn rep cost: " + (repDelta === 0 ? "None" : repDelta) + " (Weakness: " + weaknessLabel + ")");
  } else if (stage === "turn") {
    messageLines.push("She’s yours now. The hook is set.");
    messageLines.push("Rep cost (paid at Turn start): " + (repDelta === 0 ? "None" : repDelta) + " (Weakness: " + weaknessLabel + ")");
  } else if (stage === "debut") {
    messageLines.push("Her first shoot under your banner. Make it official.");
  }
  const messageHtml = messageLines.join("<br>");
  const nextStage = getTakeoverStageNext(stage);
  const tier = performerState && performerState.tier ? performerState.tier : (performerConfig ? performerConfig.tier : "tier1");
  const nextCost = nextStage && typeof getStageCost === "function"
    ? getStageCost(nextStage, tier)
    : 0;
  const primaryLabel = stage === "debut"
    ? "Finalize Acquisition"
    : "Proceed to " + getTakeoverStageLabel(nextStage) + " (Pay " + formatCurrency(nextCost) + ")";
  const primaryButton = createButton(primaryLabel, "takeover-stage-proceed", "primary");
  const abortButton = createButton("Abort", "takeover-stage-abort");
  modalRoot.innerHTML =
    "<div class=\"modal-overlay\">" +
    "<div class=\"modal-card modal-card--decision\">" +
    "<div class=\"decision-layout\">" +
    "<div class=\"decision-body\">" +
    "<h3 class=\"modal-title\">" + stageLabel.toUpperCase() + ": " + performerName + "</h3>" +
    "<div class=\"slideshow-layout\">" +
    imageHtml +
    controlsHtml +
    "</div>" +
    "<p class=\"modal-message\" style=\"margin-top:12px;\">" + messageHtml + "</p>" +
    "<div class=\"button-row\" style=\"margin-top:12px;\">" +
    primaryButton +
    abortButton +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>";
}

function showBossStageModal(gameState) {
  const modalRoot = qs("#modal-root");
  if (!modalRoot || !gameState) {
    return;
  }
  const uiState = getUiState();
  const modalState = uiState.bossStageModal;
  if (!modalState || !modalState.studioId) {
    clearModal();
    return;
  }
  const studioId = modalState.studioId;
  const takeoverConfig = CONFIG.takeover && typeof CONFIG.takeover === "object" ? CONFIG.takeover : {};
  const placeholderPath = takeoverConfig.placeholderPortraitPath || CONFIG.LOCATION_PLACEHOLDER_THUMB_PATH || "";
  const studioConfig = typeof getTakeoverStudioConfig === "function"
    ? getTakeoverStudioConfig(studioId)
    : (takeoverConfig.studios ? takeoverConfig.studios[studioId] : null);
  const bossConfig = typeof getBossConfigForStudio === "function"
    ? getBossConfigForStudio(studioId)
    : null;
  const bossName = bossConfig && bossConfig.name ? bossConfig.name : "Boss";
  const bossId = bossConfig && bossConfig.id ? bossConfig.id : (studioConfig ? studioConfig.bossId : null);
  const stageKey = modalState.stageKey || "summons";
  const stageLabel = typeof getBossStageLabel === "function" ? getBossStageLabel(stageKey) : "Stage";
  const slides = typeof getBossStageImagePaths === "function"
    ? getBossStageImagePaths(studioId, bossId, stageKey, 5)
    : [];
  const slideCount = slides.length ? slides.length : 1;
  const safeIndex = Math.min(Math.max(0, modalState.index || 0), slideCount - 1);
  const slidePath = slides.length ? slides[safeIndex] : placeholderPath;
  const slideNumber = slideCount ? safeIndex + 1 : 0;
  const imageHtml = "<div class=\"slideshow-image-container\">" +
    "<img class=\"slideshow-image\" src=\"" + slidePath + "\" alt=\"" + stageLabel + " slide " + slideNumber + "\"" +
    (placeholderPath ? " onerror=\"this.onerror=null;this.src='" + placeholderPath + "'\"" : "") + " />" +
    "</div>";
  const prevDisabled = safeIndex <= 0;
  const nextDisabled = safeIndex >= slideCount - 1;
  const controlsHtml = "<div class=\"slideshow-controls\">" +
    createButton("Prev", "boss-stage-prev", "", prevDisabled) +
    createButton("Next", "boss-stage-next", "primary", nextDisabled) +
    "<span class=\"slideshow-counter\">Slide " + slideNumber + " of " + slideCount + "</span>" +
    "</div>";
  const messageHtml = getBossStageCopy(stageKey);
  const stages = typeof getBossStagesList === "function"
    ? getBossStagesList()
    : ["summons", "negotiation", "power_play", "fall", "terms"];
  const isFinalStage = modalState.stageIndex >= stages.length - 1;
  const durationDays = typeof getBossStageDurationDays === "function" ? getBossStageDurationDays() : 2;
  const primaryLabel = isFinalStage ? "Finalize Acquisition" : "Proceed (" + durationDays + " days)";
  const primaryButton = createButton(primaryLabel, "boss-stage-proceed", "primary");
  modalRoot.innerHTML =
    "<div class=\"modal-overlay\">" +
    "<div class=\"modal-card modal-card--decision\">" +
    "<div class=\"decision-layout\">" +
    "<div class=\"decision-body\">" +
    "<h3 class=\"modal-title\">" + stageLabel.toUpperCase() + ": " + bossName + "</h3>" +
    "<div class=\"slideshow-layout\">" +
    imageHtml +
    controlsHtml +
    "</div>" +
    "<p class=\"modal-message\" style=\"margin-top:12px;\">" + messageHtml + "</p>" +
    "<div class=\"button-row\" style=\"margin-top:12px;\">" +
    primaryButton +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>" +
    "</div>";
}

function findCollabOfferEvent(events) {
  if (!Array.isArray(events)) {
    return null;
  }
  return events.find(function (event) {
    return event && typeof event.id === "string" && event.id.indexOf("act2_collab_offer_day_") === 0;
  }) || null;
}

function findTakeoverUnlockEvent(events) {
  if (!Array.isArray(events)) {
    return null;
  }
  return events.find(function (event) {
    return event && event.id === "act3_takeover_unlock_day181";
  }) || null;
}

function buildCollabExtraHtml(cards) {
  if (!Array.isArray(cards) || cards.length === 0) {
    return "";
  }
  const itemsHtml = cards.map(function (card) {
    return "<div class=\"modal-event\">" +
      "<h4 class=\"modal-title\" style=\"font-size:14px;\">" + card.title + "</h4>" +
      "<p class=\"modal-message\">" + card.message + "</p>" +
      "</div>";
  }).join("");
  return "<div class=\"decision-extra\" style=\"margin-top:12px;\">" +
    "<div class=\"panel-title\" style=\"font-size:12px;\">Also Today</div>" +
    itemsHtml +
    "</div>";
}

function showCollabOfferDecisionModal(offerEventId, extraCards, gameState) {
  const copy = getStoryEventCopy(offerEventId, gameState || null);
  const messageHtml = String(copy.message || "").replace(/\n/g, "<br>");
  showDecisionModal({
    title: "Collab Week: Cross-Promo Frenzy",
    messageHtml: messageHtml,
    imagePath: "assets/images/mascots/talentscout_introducing.png",
    primaryLabel: "Lock it in (7-day streak)",
    primaryAction: "collab-accept",
    secondaryLabel: "Pass (ask me again later)",
    secondaryAction: "collab-decline",
    extraHtml: buildCollabExtraHtml(extraCards)
  });
}

function showPayMaxModal(gameState) {
  const modalRoot = qs("#modal-root");
  if (!modalRoot || !gameState || !gameState.player) {
    return;
  }
  const player = gameState.player;
  const cash = Number.isFinite(player.cash) ? player.cash : 0;
  const debtRemaining = Number.isFinite(player.debtRemaining) ? player.debtRemaining : 0;
  const maxPay = Math.min(cash, debtRemaining);
  const formatValue = typeof formatCurrency === "function"
    ? formatCurrency
    : function (value) { return "$" + Math.round(value).toLocaleString(); };
  const payMaxDisabled = maxPay <= 0;
  modalRoot.innerHTML =
    "<div class=\"modal-overlay\">" +
    "<div class=\"modal-card\">" +
    "<h3 class=\"modal-title\">Pay Down Debt</h3>" +
    "<p class=\"modal-message\">" +
    "Current debt: <strong>" + formatValue(debtRemaining) + "</strong><br>" +
    "Cash on hand: <strong>" + formatValue(cash) + "</strong><br>" +
    "Pay Max will pay the maximum you can afford up to the remaining debt." +
    "</p>" +
    "<div class=\"button-row\">" +
    "<button class=\"button primary\" data-action=\"confirm-pay-max\"" + (payMaxDisabled ? " disabled" : "") + ">Pay Max</button>" +
    "<button class=\"button\" data-action=\"dismiss-modal\">Cancel</button>" +
    "</div>" +
    "</div>" +
    "</div>";
}

function showStudioUpgradeModal(gameState) {
  const modalRoot = qs("#modal-root");
  if (!modalRoot || !gameState || !gameState.player) {
    return;
  }
  const config = CONFIG.studioUpgrade && typeof CONFIG.studioUpgrade === "object" ? CONFIG.studioUpgrade : null;
  const studioState = gameState.player.upgrades && gameState.player.upgrades.studioUpgrade
    ? gameState.player.upgrades.studioUpgrade
    : null;
  if (!config || !studioState) {
    return;
  }
  const uiCopy = config.ui || {};
  const title = uiCopy.modalTitle || "Studio Upgrade";
  const body = uiCopy.modalBody || "";
  const formatValue = typeof formatCurrency === "function"
    ? formatCurrency
    : function (value) { return "$" + Math.round(value).toLocaleString(); };
  const day = Number.isFinite(gameState.player.day) ? gameState.player.day : 0;
  const offerExpiresDay = Number.isFinite(studioState.offerExpiresDay) ? studioState.offerExpiresDay : null;
  const offerActive = studioState.decision === "none" && Number.isFinite(offerExpiresDay) && day <= offerExpiresDay;
  const lateAvailable = studioState.decision === "declined" || studioState.decision === "missed";
  const financeConfig = config.finance || {};
  const financePlan = studioState.financePlan || {};
  const financedActive = Boolean(financePlan.active && financePlan.daysRemaining > 0);
  const purchased = Boolean(studioState.purchased);
  const penaltyActive = typeof isStudioUpgradePenaltyActive === "function"
    ? isStudioUpgradePenaltyActive(gameState)
    : false;

  const repBonus = Number.isFinite(config.effects && config.effects.repBonus) ? config.effects.repBonus : 0;
  const overheadDelta = Number.isFinite(config.effects && config.effects.dailyOverheadDelta)
    ? config.effects.dailyOverheadDelta
    : 0;
  const shootBonus = Number.isFinite(config.effects && config.effects.dailyShootCapBonus)
    ? config.effects.dailyShootCapBonus
    : 0;
  const premiumMult = Number.isFinite(config.effects && config.effects.premiumOfSubsMult)
    ? config.effects.premiumOfSubsMult
    : 1;
  const premiumPct = Math.round((premiumMult - 1) * 100);

  const effectLines = [];
  if (shootBonus) {
    effectLines.push("+" + shootBonus + " daily shoot cap");
  }
  if (overheadDelta) {
    effectLines.push("Overhead +" + formatValue(overheadDelta) + "/day");
  }
  if (repBonus) {
    effectLines.push("Reputation +" + repBonus);
  }
  if (premiumPct) {
    effectLines.push("Premium OF subs " + (premiumPct >= 0 ? "+" : "") + premiumPct + "%");
  }

  const effectListHtml = effectLines.length
    ? "<ul style=\"margin:12px 0 0 18px; color: var(--text-muted); font-size: 13px;\">" +
      effectLines.map(function (line) { return "<li>" + line + "</li>"; }).join("") +
      "</ul>"
    : "";

  let statusHtml = "";
  if (offerActive) {
    const daysLeft = Math.max(0, offerExpiresDay - day);
    statusHtml = "<p class=\"modal-message\" style=\"margin-top:10px;\">Offer window: " + daysLeft +
      " days left (Day " + offerExpiresDay + ").</p>";
  } else if (financedActive) {
    statusHtml = "<p class=\"modal-message\" style=\"margin-top:10px;\">Payments remaining: " + financePlan.daysRemaining +
      ". The note hits every morning.</p>";
  } else if (purchased) {
    statusHtml = "<p class=\"modal-message\" style=\"margin-top:10px;\">VIP buildout active. The room feels different now.</p>";
  } else if (lateAvailable) {
    statusHtml = "<p class=\"modal-message\" style=\"margin-top:10px;\">Late buy available at " +
      formatValue(config.latePrice || 0) + ".</p>";
  }

  if (penaltyActive) {
    const penaltyMult = Number.isFinite(config.penalty && config.penalty.premiumOfSubsMult)
      ? config.penalty.premiumOfSubsMult
      : 1;
    const penaltyPct = Math.round((penaltyMult - 1) * 100);
    statusHtml += "<p class=\"modal-message\" style=\"margin-top:8px; color: var(--danger);\">" +
      "Penalty active until Day " + studioState.penaltyUntilDay + ": Premium " +
      (penaltyPct >= 0 ? "+" : "") + penaltyPct + "%." +
      "</p>";
  }

  const imageHtml = "<div style=\"margin-top:12px; text-align:center;\">" +
    "<img src=\"" + CONFIG.SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH + "\" alt=\"Studio upgrade\" style=\"max-width:140px; opacity:0.9;\" />" +
    "</div>";

  let buttonsHtml = "<button class=\"button\" data-action=\"dismiss-modal\">Close</button>";
  if (offerActive) {
    const cashPrice = Number.isFinite(config.cashPrice) ? config.cashPrice : 0;
    const downPayment = Number.isFinite(financeConfig.downPayment) ? financeConfig.downPayment : 0;
    const termDays = Number.isFinite(financeConfig.termDays) ? financeConfig.termDays : 0;
    const financedAmount = Number.isFinite(financeConfig.totalFinancedAmount) ? financeConfig.totalFinancedAmount : 0;
    const dailyPayment = termDays > 0 ? Math.ceil(financedAmount / termDays) : 0;
    buttonsHtml =
      "<button class=\"button primary\" data-action=\"studio-upgrade-buy-cash\">Pay Cash — " + formatValue(cashPrice) + "</button>" +
      (financeConfig.enabled === true
        ? "<button class=\"button\" data-action=\"studio-upgrade-buy-finance\">Finance — " + formatValue(downPayment) +
          " down + " + formatValue(dailyPayment) + "/day (" + termDays + " days)</button>"
        : "") +
      "<button class=\"button\" data-action=\"studio-upgrade-decline\">Pass</button>";
  } else if (lateAvailable) {
    buttonsHtml = "<button class=\"button primary\" data-action=\"studio-upgrade-buy-late\">Buy Late — " +
      formatValue(config.latePrice || 0) + "</button>" +
      "<button class=\"button\" data-action=\"dismiss-modal\">Close</button>";
  }

  modalRoot.innerHTML =
    "<div class=\"modal-overlay\">" +
    "<div class=\"modal-card\">" +
    "<h3 class=\"modal-title\">" + title + "</h3>" +
    "<p class=\"modal-message\">" + body + "</p>" +
    effectListHtml +
    statusHtml +
    imageHtml +
    "<div class=\"button-row\" style=\"margin-top:12px;\">" + buttonsHtml + "</div>" +
    "</div>" +
    "</div>";
}

function processDebtPayment(amount, options) {
  const config = options && typeof options === "object" ? options : {};
  const skipConfirm = config.skipConfirm === true;
  const gameState = window.gameState;
  if (!gameState || !gameState.player) {
    return;
  }
  const debtPaymentConfig = CONFIG.economy && CONFIG.economy.debtPayment
    ? CONFIG.economy.debtPayment
    : {};
  const confirmThreshold = Number.isFinite(debtPaymentConfig.confirmForPaymentsAbove)
    ? debtPaymentConfig.confirmForPaymentsAbove
    : null;
  if (!skipConfirm && confirmThreshold !== null) {
    const player = gameState.player;
    const cash = Number.isFinite(player.cash) ? player.cash : 0;
    const debtRemaining = Number.isFinite(player.debtRemaining) ? player.debtRemaining : 0;
    const maxPay = Math.min(cash, debtRemaining);
    const minPayment = Number.isFinite(debtPaymentConfig.minPayment)
      ? debtPaymentConfig.minPayment
      : 0;
    let expectedPay = maxPay;
    if (amount !== null && amount !== "max" && Number.isFinite(amount)) {
      expectedPay = Math.min(Math.max(amount, minPayment), maxPay);
    }
    if (expectedPay > confirmThreshold) {
      const confirmMessage = "Pay " + formatCurrency(expectedPay) + " toward your debt?";
      if (!window.confirm(confirmMessage)) {
        return;
      }
    }
  }
  const result = payDebt(gameState, amount);
  setUiMessage(result.message || "");
  if (result.ok) {
    const storyEvents = [];
    if (result.saturationActivated) {
      const saturationConfig = CONFIG.market && CONFIG.market.saturation
        ? CONFIG.market.saturation
        : {};
      const saturationMessageId = typeof saturationConfig.unlockMessageId === "string"
        ? saturationConfig.unlockMessageId
        : "act2_saturation_activated";
      storyEvents.push({ id: saturationMessageId, day: gameState.player.day });
    }
    if (result.competitionUnlocked) {
      const competitionConfig = CONFIG.market && CONFIG.market.competition
        ? CONFIG.market.competition
        : {};
      const unlockMessageId = typeof competitionConfig.unlockMessageId === "string"
        ? competitionConfig.unlockMessageId
        : "act2_competition_unlocked";
      storyEvents.push({ id: unlockMessageId, day: gameState.player.day });
    }
    if (storyEvents.length) {
      ensureStoryLogState(gameState);
      ensureFlagsState(gameState);
      appendStoryLogEntries(gameState, storyEvents);
      showStoryEvents(storyEvents);
    }
    const saveResult = saveGame(gameState, CONFIG.save.autosave_slot_id);
    if (!saveResult.ok) {
      setUiMessage(saveResult.message);
    }
    if (result.conquestResult && result.conquestResult.cards && result.conquestResult.cards.length) {
      showEventCards(result.conquestResult.cards);
    }
    if (typeof showToast === "function") {
      const formatValue = typeof formatCurrency === "function"
        ? formatCurrency
        : function (value) { return "$" + Math.round(value).toLocaleString(); };
      const toastMessage = "Paid " + formatValue(result.amountPaid) + " toward your debt.";
      showToast(toastMessage, "success");
    }
  }
  renderApp(gameState);
}

function buildStoryEventCards(events) {
  if (!Array.isArray(events)) {
    return [];
  }
  return events.map(function (event) {
    const copy = getStoryEventCopy(event.id, typeof window !== "undefined" ? window.gameState : null);
    return {
      title: copy.title,
      message: copy.message
    };
  });
}

function buildMilestoneEventCards(events) {
  if (!Array.isArray(events)) {
    return [];
  }
  return events.map(function (event) {
    if (event && event.kind === "legacy" && event.message) {
      return {
        title: "🏆 Legacy Milestone Achieved",
        message: event.message
      };
    }
    return {
      title: "🏆 Milestone Reached",
      message: event.title + " — " + (event.rewardSummary || "Rewards: none.")
    };
  });
}

function addStoryLogEntry(gameState, entry) {
  if (!gameState || !entry || typeof entry.id !== "string") {
    return;
  }
  ensureStoryLogState(gameState);
  const exists = gameState.storyLog.some(function (logEntry) {
    return logEntry.id === entry.id;
  });
  if (exists) {
    return;
  }
  gameState.storyLog.push(entry);
}

function showStoryEvents(events) {
  const collabOffer = findCollabOfferEvent(events);
  if (collabOffer) {
    const otherEvents = events.filter(function (event) {
      return event && event.id !== collabOffer.id;
    });
    const extraCards = buildStoryEventCards(otherEvents);
    showCollabOfferDecisionModal(collabOffer.id, extraCards, typeof window !== "undefined" ? window.gameState : null);
    return;
  }
  showEventCards(buildStoryEventCards(events));
}

function showStoryLogEntry(entry) {
  if (!entry) {
    return;
  }
  const dayLabel = Number.isFinite(entry.dayNumber) ? "Day " + entry.dayNumber + " — " : "";
  showEventCards([{
    title: dayLabel + entry.title,
    message: entry.body
  }]);
}

function ensureAutomationValidation() {
  if (typeof validateGameState !== "function") {
    return;
  }
  if (validateGameState._automationPatched) {
    return;
  }

  const baseValidate = validateGameState;
  validateGameState = function (candidate) {
    if (!candidate || typeof candidate !== "object") {
      return baseValidate(candidate);
    }
    const stripped = Object.assign({}, candidate);
    delete stripped.automation;
    delete stripped.shootOutputs;
    const result = baseValidate(stripped);
    if (!result || !result.ok) {
      return result;
    }
    return { ok: true, message: result.message };
  };
  validateGameState._automationPatched = true;
}

function clamp(value, min, max) {
  if (!Number.isFinite(value)) {
    return min;
  }
  if (!Number.isFinite(min)) {
    return value;
  }
  if (!Number.isFinite(max)) {
    return value;
  }
  return Math.min(Math.max(value, min), max);
}

function getSlideshowImagePaths(gameState, slideshow) {
  if (!slideshow || !slideshow.mode) {
    return [];
  }
  if (slideshow.mode === "recruit") {
    const candidate = getRecruitmentCandidateById(slideshow.id);
    return candidate && Array.isArray(candidate.meetSlides) ? candidate.meetSlides : [];
  }
  if (slideshow.mode === "shoot") {
    const entry = gameState.content.entries.find(function (contentEntry) {
      return contentEntry.id === slideshow.id;
    }) || null;
    return entry ? getEntryPhotoPaths(entry) : [];
  }
  if (slideshow.mode === "conquest") {
    const pack = typeof getConquestPackById === "function"
      ? getConquestPackById(gameState, slideshow.id)
      : null;
    return pack && Array.isArray(pack.imagePaths) ? pack.imagePaths : [];
  }
  return [];
}

function setupEventHandlers() {
  ensureAutomationValidation();

  document.querySelectorAll("[data-action=\"nav-screen\"]").forEach(function (el) {
    el.addEventListener("click", function (event) {
      event.preventDefault();
      var screenId = el.getAttribute("data-screen");
      if (screenId) {
        showScreen(screenId);
        document.querySelectorAll(".nav-item[data-action=\"nav-screen\"]").forEach(function (navItem) {
          navItem.classList.remove("is-active");
        });
        el.classList.add("is-active");
      }
    });
  });

  var saveToggle = document.querySelector("[data-action=\"toggle-save-menu\"]");
  var saveDropdown = document.getElementById("nav-save-dropdown");
  if (saveToggle && saveDropdown) {
    saveToggle.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      var isOpen = saveDropdown.classList.contains("is-open");

      if (!isOpen) {
        var rect = saveToggle.getBoundingClientRect();
        saveDropdown.style.left = (rect.right + 8) + "px";
        saveDropdown.style.bottom = (window.innerHeight - rect.bottom) + "px";
        saveDropdown.classList.add("is-open");
      } else {
        saveDropdown.classList.remove("is-open");
      }
    });

    // Add explicit handlers for save dropdown buttons
    var saveNowBtn = saveDropdown.querySelector("[data-action=\"save-now\"]");
    var loadSaveBtn = saveDropdown.querySelector("[data-action=\"load-save\"]");
    var exportSaveBtn = saveDropdown.querySelector("[data-action=\"export-save\"]");
    var importSaveBtn = saveDropdown.querySelector("[data-action=\"import-save\"]");

    if (saveNowBtn) {
      saveNowBtn.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        saveDropdown.classList.remove("is-open");
        var uiState = getUiState();
        var result = saveGame(window.gameState, uiState.save.selectedSlotId);
        setUiMessage(result.message || "");
        renderApp(window.gameState);
        if (typeof showToast === "function") {
          showToast(result.ok ? "Game saved!" : "Save failed", result.ok ? "success" : "error");
        }
      });
    }

    if (loadSaveBtn) {
      loadSaveBtn.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        saveDropdown.classList.remove("is-open");
        var uiState = getUiState();
        var result = loadGame(uiState.save.selectedSlotId);
        if (result.ok) {
          window.gameState = result.gameState;
          ensureAutomationState(window.gameState);
          ensureUnlocksState(window.gameState);
          ensureShootOutputsState(window.gameState);
          ensureStoryLogState(window.gameState);
          ensureFlagsState(window.gameState);
          ensureSocialManualStrategyState(window.gameState);
          ensureSocialCollabWeekState(window.gameState);
          ensureReputationState(window.gameState);
          ensureRecruitmentState(window.gameState);
          ensurePlayerUpgradesState(window.gameState);
          if (typeof initCompetitionStateIfMissing === "function") {
            initCompetitionStateIfMissing(window.gameState);
          }
          if (typeof showToast === "function") {
            showToast("Game loaded!", "success");
          }
        } else {
          if (typeof showToast === "function") {
            showToast(result.message || "Load failed", "error");
          }
        }
        setUiMessage(result.message || "");
        renderApp(window.gameState);
      });
    }

    if (exportSaveBtn) {
      exportSaveBtn.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        saveDropdown.classList.remove("is-open");
        var result = exportSaveToFile(window.gameState);
        setUiMessage(result.message || "");
        renderApp(window.gameState);
        if (typeof showToast === "function") {
          showToast(result.ok ? "Save exported!" : "Export failed", result.ok ? "success" : "error");
        }
      });
    }

    if (importSaveBtn) {
      importSaveBtn.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        saveDropdown.classList.remove("is-open");
        importSaveFromFile().then(function (result) {
          if (result.ok) {
            window.gameState = result.gameState;
            ensureAutomationState(window.gameState);
            ensureUnlocksState(window.gameState);
            ensureShootOutputsState(window.gameState);
            ensureStoryLogState(window.gameState);
            ensureFlagsState(window.gameState);
            ensureSocialManualStrategyState(window.gameState);
            ensureSocialCollabWeekState(window.gameState);
            ensureReputationState(window.gameState);
            ensureRecruitmentState(window.gameState);
            ensurePlayerUpgradesState(window.gameState);
            if (typeof showToast === "function") {
              showToast("Save imported!", "success");
            }
          } else {
            if (typeof showToast === "function") {
              showToast(result.message || "Import failed", "error");
            }
          }
          setUiMessage(result.message || "");
          renderApp(window.gameState);
        });
      });
    }
  }

  document.body.addEventListener("click", function (event) {
    const actionEl = event.target.closest("[data-action]");
    if (!actionEl) {
      return;
    }
    const action = actionEl.getAttribute("data-action");
    const actionId = actionEl.getAttribute("data-id");
    const actionTier = actionEl.getAttribute("data-tier");
    const actionOrigin = actionEl.getAttribute("data-origin");
    if (!action) {
      return;
    }

    const uiState = getUiState();

    if (action === "dismiss-modal") {
      if (uiState.takeoverModal) {
        uiState.takeoverModal = null;
      }
      if (uiState.takeoverStageModal) {
        uiState.takeoverStageModal = null;
      }
      if (uiState.bossModal) {
        uiState.bossModal = null;
      }
      if (uiState.bossStageModal) {
        uiState.bossStageModal = null;
      }
      clearModal();
      return;
    }

    if (action === "collab-accept") {
      event.preventDefault();
      event.stopPropagation();
      ensureSocialCollabWeekState(window.gameState);
      const collab = window.gameState.social && window.gameState.social.collab ? window.gameState.social.collab : null;
      if (!collab) {
        clearModal();
        return;
      }
      const config = CONFIG.socialCollabWeek || {};
      const partners = Array.isArray(config.partners) ? config.partners : [];
      const partnerName = partners.length
        ? partners[collab.partnerIndex % partners.length]
        : "Partner Studio";
      const currentDay = window.gameState.player.day;
      const durationDays = Number.isFinite(config.durationDays) ? config.durationDays : 7;
      collab.status = "active";
      collab.attempt.partnerName = partnerName;
      collab.attempt.startDay = currentDay;
      collab.attempt.endDay = currentDay + durationDays - 1;
      collab.attempt.daysCompleted = 0;
      collab.attempt.lastEvaluatedDay = null;
      addStoryLogEntry(window.gameState, {
        id: "act2_collab_accept_day_" + currentDay,
        dayNumber: currentDay,
        title: "Collab Week — Accepted",
        body: "You tell your Scout to lock it in. Seven days. No silence. Time to flood the feed.",
        timestamp: new Date().toISOString()
      });
      clearModal();
      saveGame(window.gameState, CONFIG.save.autosave_slot_id);
      renderApp(window.gameState);
      return;
    }

    if (action === "collab-decline") {
      event.preventDefault();
      event.stopPropagation();
      ensureSocialCollabWeekState(window.gameState);
      const collab = window.gameState.social && window.gameState.social.collab ? window.gameState.social.collab : null;
      if (!collab) {
        clearModal();
        return;
      }
      const config = CONFIG.socialCollabWeek || {};
      const retryDelay = Number.isFinite(config.retryDelayDays) ? config.retryDelayDays : 14;
      const currentDay = window.gameState.player.day;
      collab.status = "idle";
      collab.nextOfferDay = currentDay + retryDelay;
      collab.partnerIndex = Number.isFinite(collab.partnerIndex) ? collab.partnerIndex + 1 : 1;
      collab.attempt = {
        partnerName: null,
        startDay: null,
        endDay: null,
        daysCompleted: 0,
        lastEvaluatedDay: null
      };
      addStoryLogEntry(window.gameState, {
        id: "act2_collab_decline_day_" + currentDay,
        dayNumber: currentDay,
        title: "Collab Week — Passed",
        body: "You tell your Scout ‘not this week.’ The partner shrugs and moves on. No harm, no foul — you’ll get another collab window in 14 days.",
        timestamp: new Date().toISOString()
      });
      clearModal();
      saveGame(window.gameState, CONFIG.save.autosave_slot_id);
      renderApp(window.gameState);
      return;
    }

    if (action === "open-pay-max-modal") {
      showPayMaxModal(window.gameState);
      return;
    }

    if (action === "confirm-pay-max") {
      clearModal();
      processDebtPayment("max", { skipConfirm: true });
      return;
    }

    if (action === "open-studio-upgrade-modal") {
      showStudioUpgradeModal(window.gameState);
      return;
    }

    if (action === "studio-upgrade-buy-cash") {
      const config = CONFIG.studioUpgrade && typeof CONFIG.studioUpgrade === "object" ? CONFIG.studioUpgrade : {};
      const result = startStudioUpgradeCashPurchase(window.gameState, config.cashPrice);
      setUiMessage(result.message || "");
      if (result.ok) {
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message || "");
        }
        if (typeof showToast === "function") {
          showToast("Studio upgrade secured.", "success");
        }
        clearModal();
      } else if (typeof showToast === "function") {
        showToast(result.message || "Upgrade failed.", "error");
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "studio-upgrade-buy-finance") {
      const result = startStudioUpgradeFinance(window.gameState);
      setUiMessage(result.message || "");
      if (result.ok) {
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message || "");
        }
        if (typeof showToast === "function") {
          showToast("Financing locked. The note starts tomorrow.", "success");
        }
        clearModal();
      } else if (typeof showToast === "function") {
        showToast(result.message || "Financing failed.", "error");
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "studio-upgrade-decline") {
      const result = declineStudioUpgrade(window.gameState);
      setUiMessage(result.message || "");
      if (result.ok) {
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message || "");
        }
        if (typeof showToast === "function") {
          showToast("You walked away from the offer.", "warning");
        }
        clearModal();
      } else if (typeof showToast === "function") {
        showToast(result.message || "Action failed.", "error");
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "studio-upgrade-buy-late") {
      const result = buyLateStudioUpgrade(window.gameState);
      setUiMessage(result.message || "");
      if (result.ok) {
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message || "");
        }
        if (typeof showToast === "function") {
          showToast("Late buy secured. The room remembers.", "success");
        }
        clearModal();
      } else if (typeof showToast === "function") {
        showToast(result.message || "Late buy failed.", "error");
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "toggle-auto-book") {
      ensureAutomationState(window.gameState);
      window.gameState.automation.autoBookEnabled = !window.gameState.automation.autoBookEnabled;
      window.gameState.automation.enabled = window.gameState.automation.autoBookEnabled ||
        window.gameState.automation.autoPostEnabled;
      saveGame(window.gameState, CONFIG.save.autosave_slot_id);
      renderApp(window.gameState);
      return;
    }

    if (action === "toggle-auto-post") {
      ensureAutomationState(window.gameState);
      window.gameState.automation.autoPostEnabled = !window.gameState.automation.autoPostEnabled;
      window.gameState.automation.enabled = window.gameState.automation.autoBookEnabled ||
        window.gameState.automation.autoPostEnabled;
      saveGame(window.gameState, CONFIG.save.autosave_slot_id);
      renderApp(window.gameState);
      return;
    }

    if (action === "open-meet-recruit") {
      const performerId = actionId;
      uiState.slideshow = { mode: "recruit", id: performerId, index: 0, origin: null };
      uiState.recruitMeet = { performerId: performerId, slideIndex: 0 };
      setUiMessage("");
      showScreen("screen-slideshow");
      renderApp(window.gameState);
      return;
    }

    if (action === "recruit-next-slide") {
      const slideshow = uiState.slideshow;
      if (!slideshow || slideshow.mode !== "recruit") {
        return;
      }
      const slides = getSlideshowImagePaths(window.gameState, slideshow);
      const maxIndex = Math.max(0, slides.length - 1);
      const nextIndex = Math.min(maxIndex, (slideshow.index || 0) + 1);
      slideshow.index = nextIndex;
      uiState.recruitMeet = { performerId: slideshow.id, slideIndex: nextIndex };
      renderApp(window.gameState);
      return;
    }

    if (action === "recruit-hire") {
      const performerId = actionId;
      const result = hireRecruitCandidate(window.gameState, performerId);
      setUiMessage(result.message || "");
      if (result.ok) {
        clearSlideshowState();
        const crisisEvents = resolveStaffingCrisisIfRecovered(window.gameState);
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message || "");
        }
        if (crisisEvents.length) {
          appendStoryLogEntries(window.gameState, crisisEvents);
          showEventCards(buildStoryEventCards(crisisEvents));
        }
        showScreen("screen-roster");
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "recruit-decline") {
      const performerId = actionId || (uiState.recruitMeet && uiState.recruitMeet.performerId);
      const result = declineRecruitCandidate(window.gameState, performerId);
      setUiMessage(result.message || "");
      if (result.ok) {
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message || "");
        }
      }
      if (uiState.slideshow && uiState.slideshow.mode === "recruit") {
        clearSlideshowState();
        showScreen("screen-roster");
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "view-shoot-photos") {
      const contentId = actionId;
      uiState.slideshow = { mode: "shoot", id: contentId, index: 0, origin: actionOrigin || null };
      setUiMessage("");
      showScreen("screen-slideshow");
      renderApp(window.gameState);
      return;
    }

    if (action === "slideshow-prev" || action === "slideshow-next") {
      const slideshow = uiState.slideshow;
      if (!slideshow || (slideshow.mode !== "shoot" && slideshow.mode !== "conquest")) {
        return;
      }
      const slides = getSlideshowImagePaths(window.gameState, slideshow);
      const maxIndex = Math.max(0, slides.length - 1);
      const delta = action === "slideshow-next" ? 1 : -1;
      slideshow.index = clamp((slideshow.index || 0) + delta, 0, maxIndex);
      renderApp(window.gameState);
      return;
    }

    if (action === "slideshow-close") {
      const mode = uiState.slideshow && uiState.slideshow.mode ? uiState.slideshow.mode : null;
      const origin = uiState.slideshow && uiState.slideshow.origin ? uiState.slideshow.origin : null;
      clearSlideshowState();
      if (mode === "recruit") {
        showScreen("screen-roster");
      } else if (mode === "shoot") {
        showScreen(origin === "social" ? "screen-social" : "screen-gallery");
      } else if (mode === "conquest") {
        showScreen(origin === "gallery" ? "screen-gallery" : "screen-conquests");
      } else {
        showScreen("screen-hub");
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "takeover-confirm-intel") {
      const modalState = uiState.takeoverModal;
      const performerId = modalState ? modalState.performerId : null;
      if (!performerId) {
        clearModal();
        uiState.takeoverModal = null;
        return;
      }
      const performerConfig = typeof getTakeoverPerformerConfig === "function"
        ? getTakeoverPerformerConfig(performerId)
        : null;
      const performerState = typeof getTakeoverPerformerState === "function"
        ? getTakeoverPerformerState(window.gameState, performerId)
        : null;
      if (!performerConfig || !performerState || performerState.status !== "available") {
        if (typeof showToast === "function") {
          showToast("Target not available.", "error");
        }
        return;
      }
      const cost = typeof getStageCost === "function" ? getStageCost("intel", performerState.tier || performerConfig.tier) : 0;
      if (window.gameState.player.cash < cost) {
        if (typeof showToast === "function") {
          showToast("Not enough cash.", "error");
        }
        return;
      }
      window.gameState.player.cash = Math.max(0, window.gameState.player.cash - cost);
      performerState.status = "in_progress";
      performerState.currentStage = "intel";
      performerState.stageStartDay = window.gameState.player.day;
      performerState.stageCompleteDay = window.gameState.player.day +
        (typeof getStageDurationDays === "function" ? getStageDurationDays() : 2);
      performerState.stageReady = false;
      performerState.attemptCount = Number.isFinite(performerState.attemptCount) ? performerState.attemptCount + 1 : 1;
      performerState.lockReason = null;
      uiState.takeoverModal = null;
      clearModal();
      const logEntry = buildTakeoverStoryLogEntry(
        window.gameState,
        performerConfig.name || "Performer",
        "Intel started: " + (performerConfig.name || "Performer") + " (complete Day " + performerState.stageCompleteDay + ")",
        "intel_start_day" + performerState.stageStartDay
      );
      if (logEntry) {
        addStoryLogEntry(window.gameState, logEntry);
      }
      saveGame(window.gameState, CONFIG.save.autosave_slot_id);
      renderApp(window.gameState);
      return;
    }

    if (action === "industry-confirm-boss") {
      const modalState = uiState.bossModal;
      const studioId = modalState ? modalState.studioId : null;
      if (!studioId) {
        clearModal();
        uiState.bossModal = null;
        return;
      }
      const studioConfig = typeof getTakeoverStudioConfig === "function"
        ? getTakeoverStudioConfig(studioId)
        : (CONFIG.takeover && CONFIG.takeover.studios ? CONFIG.takeover.studios[studioId] : null);
      const bossConfig = typeof getBossConfigForStudio === "function"
        ? getBossConfigForStudio(studioId)
        : null;
      if (!studioConfig || !bossConfig) {
        clearModal();
        uiState.bossModal = null;
        return;
      }
      if (typeof ensureTakeoverState === "function") {
        ensureTakeoverState(window.gameState);
      }
      const takeoverConfig = CONFIG.takeover && typeof CONFIG.takeover === "object" ? CONFIG.takeover : {};
      const bossSettings = takeoverConfig.boss || {};
      const cost = Number.isFinite(bossSettings.cost) ? bossSettings.cost : 150000;
      const requiredRep = Number.isFinite(bossSettings.requiredReputation) ? bossSettings.requiredReputation : 100;
      const currentRep = Number.isFinite(window.gameState.player.reputation) ? window.gameState.player.reputation : 0;
      if (currentRep < requiredRep) {
        if (typeof showToast === "function") {
          showToast("Reputation too low.", "error");
        }
        return;
      }
      if (window.gameState.player.cash < cost) {
        if (typeof showToast === "function") {
          showToast("Not enough cash.", "error");
        }
        return;
      }
      const stages = typeof getBossStagesList === "function"
        ? getBossStagesList()
        : ["summons", "negotiation", "power_play", "fall", "terms"];
      const stageKey = stages[0] || "summons";
      const stageDuration = typeof getBossStageDurationDays === "function" ? getBossStageDurationDays() : 2;
      window.gameState.player.cash = Math.max(0, window.gameState.player.cash - cost);
      const studioState = window.gameState.takeover.studios[studioId];
      studioState.bossConfrontation = {
        status: "in_progress",
        stageIndex: 0,
        stageKey: stageKey,
        stageStartDay: window.gameState.player.day,
        stageCompleteDay: window.gameState.player.day + stageDuration,
        stageReady: false
      };
      if (typeof buildTakeoverStoryLogEntry === "function" && typeof addStoryLogEntry === "function") {
        const logEntry = buildTakeoverStoryLogEntry(
          window.gameState,
          bossConfig.name || "Boss",
          "Boss confrontation started: " + (bossConfig.name || "Boss") +
            " (ready Day " + studioState.bossConfrontation.stageCompleteDay + ")",
          "boss_start_day" + window.gameState.player.day
        );
        if (logEntry) {
          addStoryLogEntry(window.gameState, logEntry);
        }
      }
      uiState.bossModal = null;
      clearModal();
      saveGame(window.gameState, CONFIG.save.autosave_slot_id);
      renderApp(window.gameState);
      return;
    }

    if (action === "takeover-stage-prev" || action === "takeover-stage-next") {
      const modalState = uiState.takeoverStageModal;
      if (!modalState || !modalState.performerId) {
        return;
      }
      const stage = modalState.stage;
      const maxSlides = getTakeoverStageSlideLimit(stage);
      const slides = typeof getTakeoverStageImagePaths === "function"
        ? getTakeoverStageImagePaths(modalState.performerId, stage, maxSlides)
        : [];
      const maxIndex = Math.max(0, (slides.length ? slides.length : 1) - 1);
      const delta = action === "takeover-stage-next" ? 1 : -1;
      modalState.index = clamp((modalState.index || 0) + delta, 0, maxIndex);
      showTakeoverStageModal(window.gameState);
      return;
    }

    if (action === "boss-stage-prev" || action === "boss-stage-next") {
      const modalState = uiState.bossStageModal;
      if (!modalState || !modalState.studioId) {
        return;
      }
      const studioId = modalState.studioId;
      const bossConfig = typeof getBossConfigForStudio === "function" ? getBossConfigForStudio(studioId) : null;
      const bossId = bossConfig && bossConfig.id ? bossConfig.id : null;
      const stageKey = modalState.stageKey || "summons";
      const slides = typeof getBossStageImagePaths === "function"
        ? getBossStageImagePaths(studioId, bossId, stageKey, 5)
        : [];
      const maxIndex = Math.max(0, (slides.length ? slides.length : 1) - 1);
      const delta = action === "boss-stage-next" ? 1 : -1;
      modalState.index = clamp((modalState.index || 0) + delta, 0, maxIndex);
      showBossStageModal(window.gameState);
      return;
    }

    if (action === "takeover-stage-abort") {
      const modalState = uiState.takeoverStageModal;
      if (!modalState || !modalState.performerId) {
        clearModal();
        return;
      }
      const performerConfig = typeof getTakeoverPerformerConfig === "function"
        ? getTakeoverPerformerConfig(modalState.performerId)
        : null;
      const performerState = typeof getTakeoverPerformerState === "function"
        ? getTakeoverPerformerState(window.gameState, modalState.performerId)
        : null;
      if (!performerConfig || !performerState) {
        clearModal();
        return;
      }
      const takeoverConfig = CONFIG.takeover && typeof CONFIG.takeover === "object" ? CONFIG.takeover : {};
      const repPenalty = takeoverConfig.repChanges && Number.isFinite(takeoverConfig.repChanges.failedAcquisition)
        ? takeoverConfig.repChanges.failedAcquisition
        : -15;
      if (typeof applyTakeoverReputationDelta === "function") {
        applyTakeoverReputationDelta(window.gameState, repPenalty);
      }
      performerState.status = "locked";
      performerState.currentStage = null;
      performerState.stageStartDay = null;
      performerState.stageCompleteDay = null;
      performerState.stageReady = false;
      performerState.nextAvailableDay = window.gameState.player.day + 7;
      performerState.lastOutcome = "aborted";
      performerState.lockReason = "cooldown";
      const logEntry = buildTakeoverStoryLogEntry(
        window.gameState,
        performerConfig.name || "Performer",
        "Acquisition cooled off: " + (performerConfig.name || "Performer") +
          " (available Day " + performerState.nextAvailableDay + ")",
        "cooldown_day" + window.gameState.player.day
      );
      if (logEntry) {
        addStoryLogEntry(window.gameState, logEntry);
      }
      uiState.takeoverStageModal = null;
      clearModal();
      saveGame(window.gameState, CONFIG.save.autosave_slot_id);
      renderApp(window.gameState);
      return;
    }

    if (action === "takeover-stage-proceed") {
      const modalState = uiState.takeoverStageModal;
      if (!modalState || !modalState.performerId) {
        clearModal();
        return;
      }
      const performerConfig = typeof getTakeoverPerformerConfig === "function"
        ? getTakeoverPerformerConfig(modalState.performerId)
        : null;
      const performerState = typeof getTakeoverPerformerState === "function"
        ? getTakeoverPerformerState(window.gameState, modalState.performerId)
        : null;
      if (!performerConfig || !performerState) {
        clearModal();
        return;
      }
      const currentStage = performerState.currentStage;
      if (currentStage === "debut") {
        const takeoverConfig = CONFIG.takeover && typeof CONFIG.takeover === "object" ? CONFIG.takeover : {};
        const repReward = takeoverConfig.repChanges && Number.isFinite(takeoverConfig.repChanges.successfulDebut)
          ? takeoverConfig.repChanges.successfulDebut
          : 3;
        if (typeof applyTakeoverReputationDelta === "function") {
          applyTakeoverReputationDelta(window.gameState, repReward);
        }
        const rosterSize = typeof getContractedRosterCount === "function"
          ? getContractedRosterCount(window.gameState)
          : (window.gameState.roster && Array.isArray(window.gameState.roster.performers)
            ? window.gameState.roster.performers.length
            : 0);
        const maxRosterSize = typeof getRecruitmentMaxRosterSize === "function"
          ? getRecruitmentMaxRosterSize(window.gameState)
          : 0;
        if (maxRosterSize > 0 && rosterSize >= maxRosterSize) {
          if (typeof showToast === "function") {
            showToast("Roster full. Free a slot before finalizing.", "error");
          }
          return;
        }
        if (!window.gameState.roster || !Array.isArray(window.gameState.roster.performers)) {
          window.gameState.roster = { performers: [] };
        }
        const rosterEntry = {
          id: performerConfig.id,
          name: performerConfig.name,
          type: "act2",
          starPower: Number.isFinite(performerConfig.starPower) ? performerConfig.starPower : CONFIG.performers.default_star_power,
          starPowerShoots: 0,
          portraitPath: performerConfig.portraitPath || (CONFIG.takeover && CONFIG.takeover.placeholderPortraitPath) || "",
          fatigue: 0,
          loyalty: CONFIG.performers.starting_loyalty
        };
        if (typeof isPerformerInRoster === "function" && isPerformerInRoster(window.gameState, rosterEntry.id)) {
          if (typeof showToast === "function") {
            showToast("Performer already on roster.", "info");
          }
          return;
        }
        window.gameState.roster.performers.push(rosterEntry);
        if (typeof ensurePerformerManagementForId === "function") {
          ensurePerformerManagementForId(window.gameState, rosterEntry);
        }
        performerState.status = "acquired";
        performerState.currentStage = null;
        performerState.stageStartDay = null;
        performerState.stageCompleteDay = null;
        performerState.stageReady = false;
        performerState.lastOutcome = "completed";
        performerState.lockReason = null;
        if (window.gameState.takeover && window.gameState.takeover.stats) {
          const stats = window.gameState.takeover.stats;
          stats.performersAcquired = Number.isFinite(stats.performersAcquired) ? stats.performersAcquired + 1 : 1;
        }
        const logEntry = buildTakeoverStoryLogEntry(
          window.gameState,
          performerConfig.name || "Performer",
          "Acquired: " + (performerConfig.name || "Performer") + " (now on your roster)",
          "acquired_day" + window.gameState.player.day
        );
        if (logEntry) {
          addStoryLogEntry(window.gameState, logEntry);
        }
        uiState.takeoverStageModal = null;
        clearModal();
        saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        renderApp(window.gameState);
        return;
      }
      const nextStage = getTakeoverStageNext(currentStage);
      if (!nextStage) {
        return;
      }
      const cost = typeof getStageCost === "function" ? getStageCost(nextStage, performerState.tier || performerConfig.tier) : 0;
      if (window.gameState.player.cash < cost) {
        if (typeof showToast === "function") {
          showToast("Not enough cash.", "error");
        }
        return;
      }
      window.gameState.player.cash = Math.max(0, window.gameState.player.cash - cost);
      if (nextStage === "turn") {
        const repDelta = getTakeoverWeaknessRepDelta(performerState.weaknessType || performerConfig.weaknessType);
        if (typeof applyTakeoverReputationDelta === "function") {
          applyTakeoverReputationDelta(window.gameState, repDelta);
        }
      }
      performerState.status = "in_progress";
      performerState.currentStage = nextStage;
      performerState.stageStartDay = window.gameState.player.day;
      performerState.stageCompleteDay = window.gameState.player.day +
        (typeof getStageDurationDays === "function" ? getStageDurationDays() : 2);
      performerState.stageReady = false;
      performerState.lockReason = null;
      const logEntry = buildTakeoverStoryLogEntry(
        window.gameState,
        performerConfig.name || "Performer",
        getTakeoverStageLabel(nextStage) + " started: " + (performerConfig.name || "Performer") +
          " (complete Day " + performerState.stageCompleteDay + ")",
        nextStage + "_start_day" + performerState.stageStartDay
      );
      if (logEntry) {
        addStoryLogEntry(window.gameState, logEntry);
      }
      uiState.takeoverStageModal = null;
      clearModal();
      saveGame(window.gameState, CONFIG.save.autosave_slot_id);
      renderApp(window.gameState);
      return;
    }

    if (action === "boss-stage-proceed") {
      const modalState = uiState.bossStageModal;
      if (!modalState || !modalState.studioId) {
        clearModal();
        return;
      }
      const studioId = modalState.studioId;
      const confrontation = typeof getBossConfrontationState === "function"
        ? getBossConfrontationState(window.gameState, studioId)
        : null;
      if (!confrontation || confrontation.status !== "in_progress" || !confrontation.stageReady) {
        clearModal();
        return;
      }
      const bossConfig = typeof getBossConfigForStudio === "function" ? getBossConfigForStudio(studioId) : null;
      const stages = typeof getBossStagesList === "function"
        ? getBossStagesList()
        : ["summons", "negotiation", "power_play", "fall", "terms"];
      const isFinalStage = confrontation.stageIndex >= stages.length - 1;
      if (isFinalStage) {
        if (typeof defeatStudioBoss === "function") {
          defeatStudioBoss(window.gameState, studioId);
        }
        if (shouldShowTakeoverVictoryModal(window.gameState)) {
          uiState.takeoverVictoryPending = true;
        }
        uiState.bossStageModal = null;
        clearModal();
        const studioConfig = typeof getTakeoverStudioConfig === "function"
          ? getTakeoverStudioConfig(studioId)
          : (CONFIG.takeover && CONFIG.takeover.studios ? CONFIG.takeover.studios[studioId] : null);
        const takeoverConfig = CONFIG.takeover && typeof CONFIG.takeover === "object" ? CONFIG.takeover : {};
        const placeholderPath = takeoverConfig.placeholderPortraitPath || CONFIG.LOCATION_PLACEHOLDER_THUMB_PATH || "";
        const trophyPath = studioConfig
          ? "assets/images/takeover/" + studioId + "/trophy.png"
          : placeholderPath;
        showDecisionModal({
          title: (studioConfig && studioConfig.name ? studioConfig.name : "Studio") + " — ACQUIRED",
          messageHtml: "<ul>" +
            "<li>✓ Remaining performers auto-acquired</li>" +
            "<li>✓ Trophy unlocked (studio bonus applied)</li>" +
            "<li>✓ Boss added to collection</li>" +
            "<li>✓ +25 Reputation (capped at 100)</li>" +
            "</ul>",
          imagePath: trophyPath,
          imageFallbackPath: placeholderPath,
          primaryLabel: "Return to Industry Map",
          primaryAction: "nav-industry-map",
          secondaryLabel: "Back to Studio",
          secondaryAction: "industry-return-to-studio"
        });
        saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        renderApp(window.gameState);
        return;
      }
      const nextStageIndex = confrontation.stageIndex + 1;
      const nextStageKey = stages[nextStageIndex] || confrontation.stageKey;
      const stageDuration = typeof getBossStageDurationDays === "function" ? getBossStageDurationDays() : 2;
      confrontation.stageIndex = nextStageIndex;
      confrontation.stageKey = nextStageKey;
      confrontation.stageStartDay = window.gameState.player.day;
      confrontation.stageCompleteDay = window.gameState.player.day + stageDuration;
      confrontation.stageReady = false;
      if (typeof buildTakeoverStoryLogEntry === "function" && typeof addStoryLogEntry === "function") {
        const logEntry = buildTakeoverStoryLogEntry(
          window.gameState,
          bossConfig && bossConfig.name ? bossConfig.name : "Boss",
          "Boss stage advanced: " + (bossConfig && bossConfig.name ? bossConfig.name : "Boss") +
            " — " + (typeof getBossStageLabel === "function" ? getBossStageLabel(nextStageKey) : "Stage") +
            " (ready Day " + confrontation.stageCompleteDay + ")",
          "boss_stage_" + confrontation.stageIndex + "_day" + window.gameState.player.day
        );
        if (logEntry) {
          addStoryLogEntry(window.gameState, logEntry);
        }
      }
      uiState.bossStageModal = null;
      clearModal();
      saveGame(window.gameState, CONFIG.save.autosave_slot_id);
      renderApp(window.gameState);
      return;
    }

    if (action === "booking-slideshow-prev" || action === "booking-slideshow-next") {
      const entry = getLatestContentEntry(window.gameState);
      if (!entry) {
        return;
      }
      const slides = typeof getEntryPhotoPaths === "function"
        ? getEntryPhotoPaths(entry).slice(0, 5)
        : [];
      const maxIndex = Math.max(0, slides.length - 1);
      const delta = action === "booking-slideshow-next" ? 1 : -1;
      uiState.bookingSlideshowIndex = clamp((uiState.bookingSlideshowIndex || 0) + delta, 0, maxIndex);
      renderApp(window.gameState);
      return;
    }

    if (action === "nav-hub") {
      showScreen("screen-hub");
      renderApp(window.gameState);
      return;
    }

    if (action === "nav-booking") {
      showScreen("screen-booking");
      renderApp(window.gameState);
      return;
    }

    if (action === "nav-content") {
      showScreen("screen-content");
      renderApp(window.gameState);
      return;
    }

    if (action === "nav-analytics") {
      showScreen("screen-analytics");
      renderApp(window.gameState);
      return;
    }

    if (action === "nav-roster") {
      showScreen("screen-roster");
      renderApp(window.gameState);
      return;
    }

    if (action === "nav-social") {
      showScreen("screen-social");
      renderApp(window.gameState);
      return;
    }

    if (action === "content-post-social") {
      if (!uiState.social) {
        uiState.social = { selectedContentId: null };
      }
      uiState.social.selectedContentId = actionId;
      setUiMessage("");
      showScreen("screen-social");
      renderApp(window.gameState);
      return;
    }

    if (action === "nav-gallery") {
      showScreen("screen-gallery");
      renderApp(window.gameState);
      return;
    }

    if (action === "nav-story-log") {
      showScreen("screen-story-log");
      renderApp(window.gameState);
      return;
    }

    if (action === "nav-shop") {
      showScreen("screen-shop");
      renderApp(window.gameState);
      return;
    }

    if (action === "nav-competition") {
      if (typeof isTakeoverUnlocked === "function" && isTakeoverUnlocked(window.gameState)) {
        showScreen("screen-competition");
      } else {
        showScreen("screen-competition");
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "nav-industry-map") {
      clearModal();
      showScreen("screen-industry-map");
      renderApp(window.gameState);
      if (uiState.takeoverVictoryPending) {
        uiState.takeoverVictoryPending = false;
        showTakeoverVictoryModal(window.gameState);
      }
      return;
    }

    if (action === "nav-empire") {
      clearModal();
      showScreen("screen-empire");
      renderApp(window.gameState);
      return;
    }

    if (action === "industry-view-studio") {
      event.preventDefault();
      event.stopPropagation();
      var studioEl = actionEl.closest("[data-studio-id]");
      var studioId = studioEl ? studioEl.getAttribute("data-studio-id") : null;
      setIndustrySelectedStudioId(studioId);
      showScreen("screen-industry-studio");
      renderApp(window.gameState);
      return;
    }

    if (action === "industry-resolve-poach-defense") {
      event.preventDefault();
      event.stopPropagation();
      if (typeof resolvePoachDefense === "function") {
        resolvePoachDefense(window.gameState);
      }
      clearModal();
      renderApp(window.gameState);
      return;
    }

    if (action === "industry-resolve-poach-loss") {
      event.preventDefault();
      event.stopPropagation();
      var result = typeof resolvePoachLoss === "function"
        ? resolvePoachLoss(window.gameState)
        : { ok: false };
      if (result && result.ok && result.performerId) {
        if (!uiState.booking) {
          uiState.booking = { performerIdA: null, locationId: null, themeId: null, contentType: null };
        }
        if (uiState.booking.performerIdA === result.performerId) {
          uiState.booking.performerIdA = null;
        }
      }
      clearModal();
      renderApp(window.gameState);
      return;
    }

    if (action === "industry-begin-acquisition") {
      event.preventDefault();
      event.stopPropagation();
      const performerId = actionId;
      const performerConfig = typeof getTakeoverPerformerConfig === "function"
        ? getTakeoverPerformerConfig(performerId)
        : null;
      const performerState = typeof getTakeoverPerformerState === "function"
        ? getTakeoverPerformerState(window.gameState, performerId)
        : null;
      if (!performerConfig || !performerState) {
        return;
      }
      const tier = performerState.tier || performerConfig.tier;
      const cost = typeof getStageCost === "function" ? getStageCost("intel", tier) : 0;
      const duration = typeof getStageDurationDays === "function" ? getStageDurationDays() : 2;
      const takeoverConfig = CONFIG.takeover && typeof CONFIG.takeover === "object" ? CONFIG.takeover : {};
      const placeholderPath = takeoverConfig.placeholderPortraitPath || CONFIG.LOCATION_PLACEHOLDER_THUMB_PATH || "";
      const portraitPath = performerConfig.portraitPath || placeholderPath;
      uiState.takeoverModal = { performerId: performerId };
      showDecisionModal({
        title: "INTEL: " + (performerConfig.name || "Performer"),
        messageHtml: "Dig into her background. Find the angle.<br><br>" +
          "<strong>Cost:</strong> " + formatCurrency(cost) + "<br>" +
          "<strong>Duration:</strong> " + duration + " days",
        imagePath: portraitPath,
        primaryLabel: "Pay " + formatCurrency(cost) + " — Begin Intel",
        primaryAction: "takeover-confirm-intel",
        secondaryLabel: "Cancel",
        secondaryAction: "dismiss-modal"
      });
      return;
    }

    if (action === "industry-begin-boss") {
      event.preventDefault();
      event.stopPropagation();
      const studioId = actionEl.getAttribute("data-studio-id");
      if (!studioId) {
        return;
      }
      if (typeof canStartBossConfrontation === "function" && !canStartBossConfrontation(window.gameState, studioId)) {
        return;
      }
      const studioConfig = typeof getTakeoverStudioConfig === "function"
        ? getTakeoverStudioConfig(studioId)
        : (CONFIG.takeover && CONFIG.takeover.studios ? CONFIG.takeover.studios[studioId] : null);
      const bossConfig = typeof getBossConfigForStudio === "function"
        ? getBossConfigForStudio(studioId)
        : null;
      if (!studioConfig || !bossConfig) {
        return;
      }
      const takeoverConfig = CONFIG.takeover && typeof CONFIG.takeover === "object" ? CONFIG.takeover : {};
      const bossSettings = takeoverConfig.boss || {};
      const cost = Number.isFinite(bossSettings.cost) ? bossSettings.cost : 150000;
      const stageDuration = Number.isFinite(bossSettings.daysPerStage) ? bossSettings.daysPerStage : 2;
      const stageCount = typeof getBossStagesList === "function" ? getBossStagesList().length : 5;
      const durationDays = stageDuration * (stageCount || 5);
      const requiredRep = Number.isFinite(bossSettings.requiredReputation) ? bossSettings.requiredReputation : 100;
      const currentRep = Number.isFinite(window.gameState.player.reputation) ? window.gameState.player.reputation : 0;
      const placeholderPath = takeoverConfig.placeholderPortraitPath || CONFIG.LOCATION_PLACEHOLDER_THUMB_PATH || "";
      const portraitPath = bossConfig.portraitPath || placeholderPath;
      uiState.bossModal = { studioId: studioId };
      showDecisionModal({
        title: "CONFRONT: " + (bossConfig.name || "Boss"),
        messageHtml: "You've taken three of her best. " + (studioConfig.name || "The studio") + " is bleeding.<br><br>" +
          "<strong>Cost:</strong> " + formatCurrency(cost) + "<br>" +
          "<strong>Duration:</strong> " + durationDays + " days<br>" +
          "<strong>Reputation Required:</strong> " + requiredRep + " (You have: " + currentRep + ")",
        imagePath: portraitPath,
        imageFallbackPath: placeholderPath,
        primaryLabel: "Pay " + formatCurrency(cost) + " — Accept Meeting",
        primaryAction: "industry-confirm-boss",
        secondaryLabel: "Decline",
        secondaryAction: "dismiss-modal"
      });
      return;
    }

    if (action === "industry-resolve-stage") {
      event.preventDefault();
      event.stopPropagation();
      const performerId = actionId;
      const performerState = typeof getTakeoverPerformerState === "function"
        ? getTakeoverPerformerState(window.gameState, performerId)
        : null;
      if (!performerState || performerState.status !== "in_progress" || !performerState.stageReady) {
        return;
      }
      uiState.takeoverStageModal = {
        performerId: performerId,
        stage: performerState.currentStage,
        index: 0
      };
      showTakeoverStageModal(window.gameState);
      return;
    }

    if (action === "industry-resolve-boss-stage") {
      event.preventDefault();
      event.stopPropagation();
      const studioId = actionEl.getAttribute("data-studio-id");
      if (!studioId || typeof getBossConfrontationState !== "function") {
        return;
      }
      const confrontation = getBossConfrontationState(window.gameState, studioId);
      if (!confrontation || confrontation.status !== "in_progress" || !confrontation.stageReady) {
        return;
      }
      uiState.bossStageModal = {
        studioId: studioId,
        stageIndex: confrontation.stageIndex || 0,
        stageKey: confrontation.stageKey,
        index: 0
      };
      showBossStageModal(window.gameState);
      return;
    }

    if (action === "industry-back-to-map") {
      event.preventDefault();
      event.stopPropagation();
      showScreen("screen-industry-map");
      renderApp(window.gameState);
      return;
    }

    if (action === "industry-return-to-studio") {
      clearModal();
      showScreen("screen-industry-studio");
      renderApp(window.gameState);
      if (uiState.takeoverVictoryPending) {
        uiState.takeoverVictoryPending = false;
        showTakeoverVictoryModal(window.gameState);
      }
      return;
    }

    if (action === "select-reputation-branch") {
      const branchId = actionId;
      const result = selectReputationBranch(window.gameState, branchId);
      setUiMessage(result.message || "");
      if (result.ok) {
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message || "");
        }
        showEventCards([{
          title: "🏷️ Studio Identity Locked",
          message: result.message
        }]);
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "select-booking-mode") {
      const mode = actionId;
      uiState.booking.bookingMode = mode;
      if (mode === "agency_pack") {
        uiState.booking.performerIdA = null;
      }
      setUiMessage("");
      renderApp(window.gameState);
      return;
    }

    if (action === "select-performer-a") {
      if (!actionId || (target && target.tagName === "SELECT")) {
        return;
      }
      uiState.booking.performerIdA = actionId || null;
      setUiMessage("");
      renderApp(window.gameState);
      return;
    }

    if (action === "select-location") {
      uiState.booking.locationId = actionId;
      setUiMessage("");
      renderApp(window.gameState);
      return;
    }

    if (action === "select-theme") {
      uiState.booking.themeId = actionId;
      setUiMessage("");
      renderApp(window.gameState);
      return;
    }

    if (action === "select-content-type") {
      uiState.booking.contentType = actionId;
      setUiMessage("");
      renderApp(window.gameState);
      return;
    }

    if (action === "confirm-shoot") {
      const result = confirmBooking(window.gameState, uiState.booking);
      setUiMessage(result.message || "");
      if (result.ok) {
        resetBookingSelection();
        uiState.bookingSlideshowIndex = 0;
        appendStoryLogEntries(window.gameState, result.storyEvents);
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message);
        }
        const eventCards = buildMilestoneEventCards(result.milestoneEvents).concat(
          buildStoryEventCards(result.storyEvents)
        );
        if (eventCards.length) {
          showEventCards(eventCards);
        }
        renderApp(window.gameState);
        showScreen("screen-content");
        if (typeof showToast === "function") {
          showToast("Shoot booked!", "success");
        }
        return;
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "renew-contract") {
      const performerId = actionId;
      const result = renewPerformerContract(window.gameState, performerId);
      setUiMessage(result.message || "");
      if (result.ok) {
        const crisisEvents = resolveStaffingCrisisIfRecovered(window.gameState);
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message || "");
        }
        if (crisisEvents.length) {
          appendStoryLogEntries(window.gameState, crisisEvents);
          showEventCards(buildStoryEventCards(crisisEvents));
        }
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "select-social-content") {
      uiState.social.selectedContentId = actionId;
      setUiMessage("");
      renderApp(window.gameState);
      return;
    }

    if (action === "select-social-strategy") {
      const strategyId = actionId;
      const result = setSocialStrategy(window.gameState, strategyId);
      setUiMessage(result.message || "");
      if (result.ok) {
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message);
        }
        showEventCards([{
          title: "📣 Social Strategy Activated",
          message: "You’ve committed to " + result.strategy.label + ". Your follower growth will reflect this approach."
        }]);
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "normalize-manual-strategy") {
      ensureSocialManualStrategyState(window.gameState);
      const manualStrategy = window.gameState.social.manualStrategy;
      manualStrategy.allocations = normalizeManualStrategyAllocations(manualStrategy.allocations);
      setUiMessage("");
      renderApp(window.gameState);
      return;
    }

    if (action === "apply-manual-strategy") {
      const result = applyManualSocialStrategy(window.gameState);
      if (!result.ok) {
        setUiMessage(result.message || "");
        renderApp(window.gameState);
        return;
      }
      setUiMessage("Applied — come back tomorrow to change.");
      const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
      if (!saveResult.ok) {
        setUiMessage(saveResult.message);
      }
      const milestoneCards = buildMilestoneEventCards(result.milestoneEvents);
      if (milestoneCards.length) {
        showEventCards(milestoneCards);
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "post-instagram" || action === "post-x") {
      const platform = action === "post-instagram" ? "Instagram" : "X";
      const pipelineBefore = typeof getOfPipeline === "function" ? getOfPipeline(window.gameState) : null;
      const carryBefore = pipelineBefore ? pipelineBefore.carry : null;
      const result = postPromoContent(window.gameState, platform, uiState.social.selectedContentId);
      if (!result.ok) {
        setUiMessage(result.message || "");
        renderApp(window.gameState);
        return;
      }
      const latestPost = window.gameState.social.posts.length
        ? window.gameState.social.posts[window.gameState.social.posts.length - 1]
        : null;
      const pipelineAfter = typeof getOfPipeline === "function" ? getOfPipeline(window.gameState) : null;
      const carryAfter = pipelineAfter ? pipelineAfter.carry : null;
      let message = "Posted Promo";
      if (latestPost) {
        message += ": +" + latestPost.socialFollowersGained + " followers, +" + latestPost.socialSubscribersGained + " social subs";
      }
      if (Number.isFinite(carryBefore) && Number.isFinite(carryAfter) && pipelineAfter) {
        let delta = carryAfter - carryBefore;
        if (carryAfter < carryBefore) {
          delta = (1 - carryBefore) + carryAfter;
        }
        const pipelineValue = pipelineAfter.progressText.replace("OF Pipeline: ", "").replace(" / ", "/");
        message += ", OF Pipeline +" + delta.toFixed(2) + " (now " + pipelineValue + ")";
      }
      setUiMessage(message + ".");
      const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
      if (!saveResult.ok) {
        setUiMessage(saveResult.message);
      }
      const milestoneCards = buildMilestoneEventCards(result.milestoneEvents);
      if (milestoneCards.length) {
        showEventCards(milestoneCards);
      }
      if (typeof showToast === "function") {
        showToast("Posted to social media!", "success");
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "select-gallery-entry") {
      uiState.gallery.selectedContentId = actionId;
      setUiMessage("");
      renderApp(window.gameState);
      return;
    }

    if (action === "gallery-mode") {
      const mode = actionEl.getAttribute("data-mode");
      if (!uiState.gallery) {
        uiState.gallery = { selectedContentId: null, mode: "shoots" };
      }
      if (mode === "shoots" || mode === "conquests") {
        uiState.gallery.mode = mode;
      }
      setUiMessage("");
      renderApp(window.gameState);
      return;
    }

    if (action === "select-conquest-message") {
      if (!uiState.conquests) {
        uiState.conquests = { selectedMessageId: null };
      }
      uiState.conquests.selectedMessageId = actionId;
      setUiMessage("");
      renderApp(window.gameState);
      return;
    }

    if (action === "conquest-accept") {
      const result = typeof acceptConquestMessage === "function"
        ? acceptConquestMessage(window.gameState, actionId)
        : { ok: false, message: "Conquests system unavailable." };
      setUiMessage(result.message || "");
      if (result.ok) {
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message || "");
        }
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "conquest-dismiss") {
      const result = typeof dismissConquestMessage === "function"
        ? dismissConquestMessage(window.gameState, actionId)
        : { ok: false, message: "Conquests system unavailable." };
      setUiMessage(result.message || "");
      if (result.ok) {
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message || "");
        }
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "conquest-view-reward") {
      uiState.slideshow = { mode: "conquest", id: actionId, index: 0, origin: "conquests" };
      setUiMessage("");
      showScreen("screen-slideshow");
      renderApp(window.gameState);
      return;
    }

    if (action === "gallery-view-conquest") {
      uiState.slideshow = { mode: "conquest", id: actionId, index: 0, origin: "gallery" };
      setUiMessage("");
      showScreen("screen-slideshow");
      renderApp(window.gameState);
      return;
    }

    if (action === "unlock-location-tier") {
      const tierId = actionTier;
      const result = unlockLocationTier(window.gameState, tierId);
      setUiMessage(result.message || "");
      if (result.ok) {
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message);
        }
        if (typeof showToast === "function") {
          showToast("Upgrade purchased!", "unlock");
        }
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "buy-tier1-location") {
      const result = purchaseTier1Location(window.gameState);
      setUiMessage(result.message || "");
      if (result.ok) {
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message);
        }
        if (typeof showToast === "function") {
          showToast("Upgrade purchased!", "unlock");
        }
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "upgrade-equipment") {
      const upgradeId = actionId;
      const result = purchaseEquipmentUpgrade(window.gameState, upgradeId);
      setEquipmentMessage(result.message || "");
      setUiMessage("");
      if (result.ok) {
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message);
        }
        if (typeof showToast === "function") {
          showToast("Upgrade purchased!", "unlock");
        }
        if (Array.isArray(result.conquestEvents) && result.conquestEvents.length) {
          showEventCards(result.conquestEvents);
        }
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "purchase-lease-upgrade") {
      const result = purchaseLeaseUpgrade(window.gameState);
      setUiMessage(result.message || "");
      if (result.ok) {
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message);
        }
        if (typeof showToast === "function") {
          showToast("Lease upgrade purchased!", "unlock");
        }
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "debug-set-day-reload") {
      event.preventDefault();
      event.stopPropagation();
      if (!isDebugEnabled()) {
        return;
      }
      const input = qs("#debug-day-input");
      if (!input) {
        setDebugDayStatus("Attempted day: (missing). Save key: unknown. Verified: no. Debug day input missing.");
        renderApp(window.gameState);
        return;
      }
      const dayRaw = input.valueAsNumber;
      const saveSlotId = CONFIG.save.autosave_slot_id;
      const saveKey = getSaveSlotKey(saveSlotId);
      if (!Number.isFinite(dayRaw)) {
        setDebugDayStatus("Attempted day: " + (input.value || "(blank)") + ". Save key: " + saveKey + ". Verified: no. Invalid day.");
        renderApp(window.gameState);
        return;
      }
      const minDay = Number.isFinite(CONFIG.debug.minDay) ? CONFIG.debug.minDay : 1;
      const configuredMaxDay = CONFIG.game && Number.isFinite(CONFIG.game.max_day) ? CONFIG.game.max_day : null;
      const debugMaxDay = Number.isFinite(CONFIG.debug.maxDay) ? CONFIG.debug.maxDay : 9999;
      const maxDay = Number.isFinite(configuredMaxDay) ? configuredMaxDay : debugMaxDay;
      const day = clamp(Math.floor(dayRaw), minDay, maxDay);
      const attemptedLabel = Math.floor(dayRaw);
      try {
        window.gameState.player.day = day;
        const saveResult = saveGame(window.gameState, saveSlotId);
        if (!saveResult.ok) {
          setDebugDayStatus("Attempted day: " + attemptedLabel + ". Save key: " + saveKey + ". Verified: no. " + (saveResult.message || "Failed to save debug day change."));
          renderApp(window.gameState);
          return;
        }
        const savedPayload = localStorage.getItem(saveKey);
        if (!savedPayload) {
          setDebugDayStatus("Attempted day: " + attemptedLabel + ". Save key: " + saveKey + ". Verified: no. Save verification failed (missing payload).");
          renderApp(window.gameState);
          return;
        }
        let parsedSave = null;
        try {
          parsedSave = JSON.parse(savedPayload);
        } catch (error) {
          setDebugDayStatus("Attempted day: " + attemptedLabel + ". Save key: " + saveKey + ". Verified: no. Save verification failed (invalid JSON).");
          renderApp(window.gameState);
          return;
        }
        const savedDay = parsedSave && parsedSave.player ? parsedSave.player.day : null;
        if (savedDay !== day) {
          setDebugDayStatus("Attempted day: " + attemptedLabel + ". Save key: " + saveKey + ". Verified: no. Save verification failed (did not persist).");
          renderApp(window.gameState);
          return;
        }
        setDebugDayStatus("Attempted day: " + attemptedLabel + ". Saved day: " + day + ". Save key: " + saveKey + ". Verified: yes. Reloading...");
        renderApp(window.gameState);
        window.setTimeout(function () {
          window.location.reload();
        }, 0);
        return;
      } catch (error) {
        const message = error && error.message ? error.message : "Unknown error.";
        setDebugDayStatus("Attempted day: " + attemptedLabel + ". Save key: " + saveKey + ". Verified: no. Error: " + message);
        renderApp(window.gameState);
        return;
      }
    }

    if (action === "debug-apply-stats") {
      event.preventDefault();
      event.stopPropagation();
      if (!isDebugEnabled()) {
        return;
      }
      const player = window.gameState.player;
      const statInputs = [
        { selector: "#debug-cash-input", field: "cash" },
        { selector: "#debug-reputation-input", field: "reputation" },
        { selector: "#debug-followers-input", field: "socialFollowers" },
        { selector: "#debug-social-subs-input", field: "socialSubscribers" },
        { selector: "#debug-of-subs-input", field: "onlyFansSubscribers" }
      ];
      statInputs.forEach(function (entry) {
        const input = qs(entry.selector);
        if (!input) {
          return;
        }
        const rawValue = input.valueAsNumber;
        if (!Number.isFinite(rawValue)) {
          return;
        }
        player[entry.field] = Math.max(0, Math.floor(rawValue));
      });

      const shootsInput = qs("#debug-shoots-today-input");
      if (shootsInput) {
        const rawShoots = shootsInput.valueAsNumber;
        if (Number.isFinite(rawShoots)) {
          player.shootsToday = Math.max(0, Math.floor(rawShoots));
        }
      }

      const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
      if (saveResult.ok) {
        setDebugDayStatus("Applied stats and autosaved.");
      } else {
        setDebugDayStatus("Applied stats but failed to autosave. " + (saveResult.message || ""));
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "debug-run-milestone-checks") {
      event.preventDefault();
      event.stopPropagation();
      if (!isDebugEnabled()) {
        return;
      }
      const legacyEvents = checkLegacyMilestones(window.gameState);
      const milestoneEvents = checkMilestones(window.gameState).concat(legacyEvents);
      const triggeredCount = milestoneEvents.length;
      const countLabel = triggeredCount === 1 ? "milestone" : "milestones";
      let statusMessage = "Triggered " + triggeredCount + " " + countLabel + ".";
      const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
      if (saveResult.ok) {
        statusMessage += " Autosaved.";
      } else {
        statusMessage += " Autosave failed. " + (saveResult.message || "");
      }
      if (milestoneEvents.length) {
        showEventCards(buildMilestoneEventCards(milestoneEvents));
      }
      setDebugDayStatus(statusMessage);
      renderApp(window.gameState);
      return;
    }

    if (action === "advance-day") {
      if (uiState.afterHoursSkip) {
        uiState.afterHoursSkip = false;
      } else if (typeof isAfterHoursEnabled === "function" && isAfterHoursEnabled()) {
        ensureAfterHoursState(window.gameState);
        var knocker = rollForKnock(window.gameState);
        if (knocker) {
          uiState.afterHours = {
            phase: "knock",
            performerId: knocker.id,
            performer: knocker
          };
          showAfterHoursModal(renderAfterHoursKnockModal());
          return;
        }
      }
      ensureAutomationState(window.gameState);
      const advanceResult = advanceDay(window.gameState);
      const storyEvents = advanceResult && Array.isArray(advanceResult.storyEvents)
        ? advanceResult.storyEvents
        : [];
      const conquestEvents = advanceResult && Array.isArray(advanceResult.conquestEvents)
        ? advanceResult.conquestEvents
        : [];
      const cashflowMessage = buildDailyCashflowMessage(advanceResult ? advanceResult.cashflow : null);
      const automationResult = runAutomationOnDayAdvance(window.gameState);
      appendStoryLogEntries(window.gameState, storyEvents);
      if (cashflowMessage) {
        setUiMessage(cashflowMessage);
      }
      const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
      if (!saveResult.ok) {
        setUiMessage(saveResult.message || "");
      }
      const collabOffer = findCollabOfferEvent(storyEvents);
      const takeoverUnlock = findTakeoverUnlockEvent(storyEvents);
      const storyCards = buildStoryEventCards(storyEvents);
      const eventCards = storyCards.concat(automationResult.cards).concat(conquestEvents);
      const retaliationState = window.gameState.takeover && window.gameState.takeover.retaliation
        ? window.gameState.takeover.retaliation
        : null;
      const pendingPoach = retaliationState && retaliationState.pending && retaliationState.pending.type === "poach_attempt"
        ? retaliationState.pending
        : null;
      // Modal priority: collab offer -> takeover unlock -> retaliation -> victory -> remaining story cards.
      if (collabOffer) {
        const otherStoryEvents = storyEvents.filter(function (event) {
          return event && event.id !== collabOffer.id;
        });
        const extraCards = buildStoryEventCards(otherStoryEvents).concat(automationResult.cards).concat(conquestEvents);
        showCollabOfferDecisionModal(collabOffer.id, extraCards, window.gameState);
      } else if (takeoverUnlock) {
        const otherStoryEvents = storyEvents.filter(function (event) {
          return event && event.id !== takeoverUnlock.id;
        });
        const extraCards = buildStoryEventCards(otherStoryEvents).concat(automationResult.cards).concat(conquestEvents);
        const copy = getStoryEventCopy(takeoverUnlock.id, window.gameState);
        const messageHtml = String(copy.message || "").replace(/\n/g, "<br>");
        showDecisionModal({
          title: copy.title,
          messageHtml: messageHtml,
          imagePath: "assets/images/mascots/talentscout_introducing.png",
          primaryLabel: "Open Industry Map",
          primaryAction: "nav-industry-map",
          secondaryLabel: "Later",
          secondaryAction: "dismiss-modal",
          extraHtml: buildCollabExtraHtml(extraCards)
        });
      } else if (pendingPoach) {
        const takeoverConfig = CONFIG.takeover && typeof CONFIG.takeover === "object" ? CONFIG.takeover : {};
        const placeholderPath = takeoverConfig.placeholderPortraitPath || CONFIG.LOCATION_PLACEHOLDER_THUMB_PATH || "";
        const performerConfig = typeof getTakeoverPerformerConfig === "function"
          ? getTakeoverPerformerConfig(pendingPoach.targetPerformerId)
          : null;
        const performerName = performerConfig && performerConfig.name ? performerConfig.name : "Performer";
        const defendCost = Number.isFinite(pendingPoach.defendCost) ? pendingPoach.defendCost : 0;
        const cashOnHand = Number.isFinite(window.gameState.player.cash) ? window.gameState.player.cash : 0;
        const canAfford = cashOnHand >= defendCost;
        const costLabel = formatCurrency(defendCost);
        const cashLabel = formatCurrency(cashOnHand);
        const primaryLabel = canAfford
          ? ("Pay " + costLabel + " — Keep Her")
          : ("Need " + costLabel + " (You: " + cashLabel + ")");
        const messageHtml =
          "A rival studio slid into her DMs with money and an exit plan.<br>" +
          "They’re not trying to win. They’re trying to take what’s yours." +
          "<br><br><strong>Target:</strong> " + performerName +
          "<br><strong>Defense Cost:</strong> " + costLabel;
        showDecisionModal({
          title: "Poach Attempt",
          messageHtml: messageHtml,
          imagePath: "assets/images/mascots/talentscout_introducing.png",
          imageFallbackPath: placeholderPath,
          primaryLabel: primaryLabel,
          primaryAction: "industry-resolve-poach-defense",
          primaryDisabled: !canAfford,
          secondaryLabel: "Let Her Go",
          secondaryAction: "industry-resolve-poach-loss",
          extraHtml: buildCollabExtraHtml(eventCards)
        });
      } else if (showTakeoverVictoryModal(window.gameState, buildCollabExtraHtml(eventCards))) {
        // Victory modal shown.
      } else if (eventCards.length) {
        showEventCards(eventCards);
      }
      renderApp(window.gameState);
      if (typeof showToast === "function") {
        showToast("Day " + window.gameState.player.day, "info");
      }
      return;
    }

    if (action === "save-now") {
      const result = saveGame(window.gameState, uiState.save.selectedSlotId);
      setUiMessage(result.message || "");
      renderApp(window.gameState);
      return;
    }

    if (action === "load-save") {
      const result = loadGame(uiState.save.selectedSlotId);
      if (result.ok) {
        window.gameState = result.gameState;
        ensureAutomationState(window.gameState);
        ensureUnlocksState(window.gameState);
        ensureShootOutputsState(window.gameState);
        ensureStoryLogState(window.gameState);
        ensureFlagsState(window.gameState);
        ensureSocialManualStrategyState(window.gameState);
        ensureSocialCollabWeekState(window.gameState);
        ensureReputationState(window.gameState);
        ensureRecruitmentState(window.gameState);
        ensurePlayerUpgradesState(window.gameState);
        if (typeof ensureAfterHoursState === "function") {
          ensureAfterHoursState(window.gameState);
        }
        if (typeof ensureConquestsState === "function") {
          ensureConquestsState(window.gameState);
        }
        initCompetitionStateIfMissing(window.gameState);
        const storyResult = checkStoryEvents(window.gameState);
        if (storyResult.ok && storyResult.events.length) {
          appendStoryLogEntries(window.gameState, storyResult.events);
          const saveResult = saveGame(window.gameState, uiState.save.selectedSlotId);
          if (!saveResult.ok) {
            setUiMessage(saveResult.message || "");
          }
          showStoryEvents(storyResult.events);
        }
      }
      setUiMessage(result.message || "");
      renderApp(window.gameState);
      return;
    }

    if (action === "export-save") {
      const result = exportSaveToFile(window.gameState);
      setUiMessage(result.message || "");
      renderApp(window.gameState);
      return;
    }

    if (action === "import-save") {
      importSaveFromFile().then(function (result) {
        if (result.ok) {
          window.gameState = result.gameState;
          ensureAutomationState(window.gameState);
          ensureUnlocksState(window.gameState);
          ensureShootOutputsState(window.gameState);
          ensureStoryLogState(window.gameState);
          ensureFlagsState(window.gameState);
          ensureSocialManualStrategyState(window.gameState);
          ensureSocialCollabWeekState(window.gameState);
          ensureReputationState(window.gameState);
          ensureRecruitmentState(window.gameState);
          ensurePlayerUpgradesState(window.gameState);
          const storyResult = checkStoryEvents(window.gameState);
          if (storyResult.ok && storyResult.events.length) {
            appendStoryLogEntries(window.gameState, storyResult.events);
            const saveResult = saveGame(window.gameState, uiState.save.selectedSlotId);
            if (!saveResult.ok) {
              setUiMessage(saveResult.message || "");
            }
            showStoryEvents(storyResult.events);
          }
        }
        setUiMessage(result.message || "");
        renderApp(window.gameState);
      });
      return;
    }

    if (action === "pay-debt") {
      const amountAttr = actionEl.getAttribute("data-amount");
      let amount = null;
      if (amountAttr === "max") {
        amount = "max";
      } else if (amountAttr !== null) {
        const parsedAmount = Number(amountAttr);
        amount = Number.isFinite(parsedAmount) ? parsedAmount : null;
      }
      processDebtPayment(amount, { skipConfirm: false });
      return;
    }

    if (action === "hire-manager") {
      const result = hireManager(window.gameState);
      setUiMessage(result.message || "");
      if (result.ok) {
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message || "");
        }
        if (typeof showToast === "function") {
          showToast("Manager hired!", "unlock");
        }
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "after-hours-answer") {
      var performer = uiState.afterHours.performer;
      var content = getAfterHoursContent(performer.id);
      uiState.afterHours.phase = "ask";
      showAfterHoursModal(renderAfterHoursAskModal(performer, content));
      return;
    }

    if (action === "after-hours-ignore") {
      var ignorePerformer = uiState.afterHours ? uiState.afterHours.performer : null;
      if (ignorePerformer) {
        ensureAfterHoursState(window.gameState);
        if (!window.gameState.afterHours.completed[ignorePerformer.id]) {
          var declineResult = applyAfterHoursDeclinePenalty(window.gameState, ignorePerformer.id);
          if (declineResult.ok) {
            saveGame(window.gameState, CONFIG.save.autosave_slot_id);
            if (typeof showToast === "function") {
              showToast(
                "She storms off. Loyalty " + declineResult.loyaltyDelta + ". " +
                CONFIG.afterHours.declineCooldownDays + "-day cooldown.",
                "info"
              );
            }
          }
        }
      }
      hideAfterHoursModal();
      uiState.afterHours = null;
      uiState.afterHoursSkip = true;
      document.querySelector('[data-action="advance-day"]').click();
      return;
    }

    if (action === "after-hours-engage") {
      var performer = uiState.afterHours.performer;
      var content = getAfterHoursContent(performer.id);
      uiState.afterHours.phase = "offer";
      showAfterHoursModal(renderAfterHoursOfferModal(performer, content, window.gameState));
      return;
    }

    if (action === "after-hours-dismiss") {
      var dismissPerformer = uiState.afterHours ? uiState.afterHours.performer : null;
      if (dismissPerformer) {
        ensureAfterHoursState(window.gameState);
        if (!window.gameState.afterHours.completed[dismissPerformer.id]) {
          var declineResult = applyAfterHoursDeclinePenalty(window.gameState, dismissPerformer.id);
          if (declineResult.ok) {
            saveGame(window.gameState, CONFIG.save.autosave_slot_id);
            if (typeof showToast === "function") {
              showToast(
                "She storms off. Loyalty " + declineResult.loyaltyDelta + ". " +
                CONFIG.afterHours.declineCooldownDays + "-day cooldown.",
                "info"
              );
            }
          }
        }
      }
      hideAfterHoursModal();
      uiState.afterHours = null;
      uiState.afterHoursSkip = true;
      document.querySelector('[data-action="advance-day"]').click();
      return;
    }

    if (action === "after-hours-counter") {
      var performer = uiState.afterHours.performer;
      var content = getAfterHoursContent(performer.id);
      uiState.afterHours.phase = "counter";
      showAfterHoursModal(renderAfterHoursCounterModal(performer, content, window.gameState));
      return;
    }

    if (action === "after-hours-submit-counter") {
      var performer = uiState.afterHours.performer;
      var selectedRadio = document.querySelector('input[name="counter-type"]:checked');

      if (!selectedRadio) {
        setUiMessage("Select a counter-offer option.");
        return;
      }

      var counterType = selectedRadio.value;
      var canAccept = canAcceptCounterOffer(window.gameState, counterType);

      if (!canAccept) {
        applyAfterHoursCooldown(window.gameState, performer.id);
        showAfterHoursModal(renderAfterHoursRefusalModal(performer));
        return;
      }

      uiState.afterHours.counterType = counterType;
      uiState.afterHours.phase = "lock";
      var content = getAfterHoursContent(performer.id);
      showAfterHoursModal(renderAfterHoursLockModal(performer, content));
      return;
    }

    if (action === "after-hours-accept") {
      var performer = uiState.afterHours.performer;
      if (!uiState.afterHours.paymentApplied) {
        var paymentResult = applyAfterHoursPayment(window.gameState, performer.id);
        if (!paymentResult.ok) {
          if (typeof showToast === "function") {
            showToast("Not enough cash.", "error");
          }
          return;
        }
        uiState.afterHours.paymentApplied = true;
        if (typeof renderHeaderStats === "function") {
          renderHeaderStats(window.gameState);
        }
        if (typeof setPreviousValue === "function") {
          setPreviousValue("header-cash", window.gameState.player.cash);
        }
        saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (typeof showToast === "function") {
          showToast(
            "You pay her " + formatCurrency(paymentResult.feePaid) + " cash. She smiles like nothing happened.",
            "info"
          );
        }
      }
      var content = getAfterHoursContent(performer.id);
      uiState.afterHours.phase = "lock";
      uiState.afterHours.counterType = null;
      showAfterHoursModal(renderAfterHoursLockModal(performer, content));
      return;
    }

    if (action === "after-hours-next-beat") {
      var performer = uiState.afterHours.performer;
      var content = getAfterHoursContent(performer.id);
      uiState.afterHours.phase = "build";
      showAfterHoursModal(renderAfterHoursBuildModal(performer, content));
      return;
    }

    if (action === "after-hours-start-slideshow") {
      var performer = uiState.afterHours.performer;
      var content = getAfterHoursContent(performer.id);
      var imagePaths = getAfterHoursImagePaths(performer);
      uiState.afterHours.phase = "slideshow";
      uiState.afterHours.slideIndex = 0;
      uiState.afterHours.imagePaths = imagePaths;
      showAfterHoursModal(renderAfterHoursSlideshowModal(performer, content, imagePaths, 0));
      return;
    }

    if (action === "after-hours-slideshow-next") {
      var performer = uiState.afterHours.performer;
      var content = getAfterHoursContent(performer.id);
      var imagePaths = uiState.afterHours.imagePaths || [];
      var currentIndex = uiState.afterHours.slideIndex || 0;
      var nextIndex = currentIndex + 1;

      if (nextIndex >= imagePaths.length) {
        // Slideshow complete - apply outcome and show aftermath
        var counterType = uiState.afterHours.counterType || null;
        var result = applyAfterHoursOutcome(window.gameState, performer.id, counterType);
        uiState.afterHours.phase = "aftermath";
        uiState.afterHours.result = result;
        saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        showAfterHoursModal(renderAfterHoursAftermathModal(performer, content, result));
        return;
      }

      uiState.afterHours.slideIndex = nextIndex;
      showAfterHoursModal(renderAfterHoursSlideshowModal(performer, content, imagePaths, nextIndex));
      return;
    }

    if (action === "after-hours-end") {
      hideAfterHoursModal();
      uiState.afterHours = null;
      uiState.afterHoursSkip = true;
      document.querySelector('[data-action="advance-day"]').click();
      return;
    }

    if (action === "view-story-log-entry") {
      const entryId = actionId;
      const entry = Array.isArray(window.gameState.storyLog)
        ? window.gameState.storyLog.find(function (logEntry) {
          return logEntry.id === entryId;
        })
        : null;
      showStoryLogEntry(entry);
      return;
    }

    console.warn("Action not wired yet:", action);
  });

  document.body.addEventListener("input", function (event) {
    const target = event.target;
    const action = target && target.dataset ? target.dataset.action : null;
    if (action === "manual-strategy-budget") {
      ensureSocialManualStrategyState(window.gameState);
      const manualStrategy = window.gameState.social.manualStrategy;
      const nextValue = Number(target.value);
      const minSpend = Number.isFinite(CONFIG.social.manualStrategy.minSpend)
        ? CONFIG.social.manualStrategy.minSpend
        : 0;
      manualStrategy.dailyBudget = Number.isFinite(nextValue) ? Math.max(minSpend, Math.round(nextValue)) : minSpend;
      setUiMessage("");
      renderApp(window.gameState);
      return;
    }

    if (action === "manual-strategy-channel") {
      ensureSocialManualStrategyState(window.gameState);
      const channel = target.dataset.channel;
      const manualStrategy = window.gameState.social.manualStrategy;
      const nextValue = Number(target.value);
      const sanitized = Number.isFinite(nextValue) ? Math.min(100, Math.max(0, Math.round(nextValue))) : 0;
      manualStrategy.allocations[channel] = sanitized;
      setUiMessage("");
      renderApp(window.gameState);
    }
  });

  document.body.addEventListener("change", function (event) {
    const target = event.target;
    const action = target && target.dataset ? target.dataset.action : null;
    if (action === "select-save-slot") {
      const uiState = getUiState();
      uiState.save.selectedSlotId = target.value;
      setUiMessage("");
      renderApp(window.gameState);
      return;
    }

    if (action === "select-performer-a") {
      const uiState = getUiState();
      uiState.booking.performerIdA = target.value || null;
      setUiMessage("");
      renderApp(window.gameState);
      return;
    }

    if (action === "toggle-automation-enabled") {
      ensureAutomationState(window.gameState);
      window.gameState.automation.enabled = Boolean(target.checked);
      const message = window.gameState.automation.enabled
        ? "Automation enabled."
        : "Automation disabled.";
      setUiMessage(message);
      const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
      if (!saveResult.ok) {
        setUiMessage(saveResult.message || "");
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "toggle-auto-book") {
      ensureAutomationState(window.gameState);
      const automationConfig = CONFIG.automation || {};
      const maxActions = Number.isFinite(automationConfig.maxActionsPerDay)
        ? automationConfig.maxActionsPerDay
        : 1;
      window.gameState.automation.autoBookEnabled = Boolean(target.checked);
      window.gameState.automation.enabled = window.gameState.automation.autoBookEnabled ||
        window.gameState.automation.autoPostEnabled;
      const message = window.gameState.automation.autoBookEnabled
        ? "Automation enabled: Auto-Book (" + maxActions + "/day)."
        : "Automation disabled: Auto-Book.";
      setUiMessage(message);
      const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
      if (!saveResult.ok) {
        setUiMessage(saveResult.message || "");
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "toggle-auto-post") {
      ensureAutomationState(window.gameState);
      const automationConfig = CONFIG.automation || {};
      const maxActions = Number.isFinite(automationConfig.maxActionsPerDay)
        ? automationConfig.maxActionsPerDay
        : 1;
      window.gameState.automation.autoPostEnabled = Boolean(target.checked);
      window.gameState.automation.enabled = window.gameState.automation.autoBookEnabled ||
        window.gameState.automation.autoPostEnabled;
      const message = window.gameState.automation.autoPostEnabled
        ? "Automation enabled: Auto-Post (" + maxActions + "/day)."
        : "Automation disabled: Auto-Post.";
      setUiMessage(message);
      const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
      if (!saveResult.ok) {
        setUiMessage(saveResult.message || "");
      }
      renderApp(window.gameState);
      return;
    }
  });

  document.addEventListener("click", function (event) {
    var saveDropdown = document.getElementById("nav-save-dropdown");
    if (saveDropdown && saveDropdown.classList.contains("is-open")) {
      var clickedToggle = event.target.closest("[data-action=\"toggle-save-menu\"]");
      var clickedDropdown = event.target.closest(".nav-save-dropdown");
      if (!clickedToggle && !clickedDropdown) {
        saveDropdown.classList.remove("is-open");
      }
    }
  });
}
