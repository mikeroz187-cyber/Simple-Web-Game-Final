function getUiState() {
  if (!window.uiState) {
    window.uiState = {
      message: "",
      booking: {
        performerIdA: null,
        locationId: null,
        themeId: null,
        contentType: null,
        bookingMode: "core"
      },
      social: {
        selectedContentId: null
      },
      gallery: {
        selectedContentId: null,
        mode: "shoots"
      },
      conquests: {
        selectedMessageId: null
      },
      bookingSlideshowIndex: 0,
      slideshow: {
        mode: null,
        id: null,
        index: 0,
        origin: null
      },
      recruitMeet: {
        performerId: null,
        slideIndex: 0
      },
      shop: {
        equipmentMessage: ""
      },
      save: {
        selectedSlotId: CONFIG.save.default_slot_id
      },
      debug: {
        dayStatus: ""
      },
      afterHours: null,
      afterHoursSkip: false
    };
  }
  return window.uiState;
}

/**
 * Updates the persistent mascot container with the appropriate mascot for the given screen.
 * Call this whenever the active screen changes.
 * @param {string} screenId - The screen ID (e.g., 'screen-hub')
 */
function updateMascot(screenId) {
  var container = document.getElementById("ambient-mascot-container");
  if (!container) {
    console.warn("Mascot container not found");
    return;
  }

  var config = CONFIG.ambientArt;
  if (!config || !config.enabled) {
    container.innerHTML = "";
    return;
  }

  var screenKeyMap = {
    "screen-hub": "hub",
    "screen-booking": "booking",
    "screen-gallery": "gallery",
    "screen-roster": "roster",
    "screen-recruitment": "recruitment",
    "screen-analytics": "analytics",
    "screen-shop": "shop",
    "screen-social": "social",
    "screen-story-log": "storyLog"
  };

  var screenKey = screenKeyMap[screenId];
  if (!screenKey) {
    container.innerHTML = "";
    return;
  }

  var screenMascot = config.screenMascots && config.screenMascots[screenKey];
  if (!screenMascot || !screenMascot.character) {
    container.innerHTML = "";
    container.className = "ambient-mascot-container";
    return;
  }

  var characterConfig = config.mascots && config.mascots[screenMascot.character];
  if (!characterConfig || !characterConfig.poses) {
    container.innerHTML = "";
    return;
  }

  var poseConfig = characterConfig.poses[screenMascot.defaultPose];
  if (!poseConfig || !poseConfig.path) {
    container.innerHTML = "";
    return;
  }

  var positionClass = getMascotContainerPositionClass(screenKey);
  container.className = "ambient-mascot-container " + positionClass;

  var existingImg = container.querySelector("img");
  if (existingImg && existingImg.src.endsWith(poseConfig.path)) {
    return;
  }

  container.innerHTML = "<img src=\"" + poseConfig.path + "\" alt=\"" + characterConfig.name +
    "\" class=\"ambient-mascot\" />";
}

function getMascotContainerPositionClass(screenKey) {
  var positionMap = {
    hub: "pos-right",
    booking: "pos-right",
    gallery: "pos-right",
    recruitment: "pos-right",
    analytics: "pos-right",
    shop: "pos-right",
    social: "pos-right pos-crop",
    storyLog: "pos-right"
  };
  return positionMap[screenKey] || "pos-right";
}

/**
 * Renders ONLY the background ambient layer for a screen.
 * Mascots are handled separately via updateMascot().
 */
function renderAmbientLayers(screenId) {
  var config = CONFIG.ambientArt;
  if (!config || !config.enabled) {
    return "";
  }

  var screenKeyMap = {
    "screen-hub": "hub",
    "screen-booking": "booking",
    "screen-gallery": "gallery",
    "screen-roster": "roster",
    "screen-recruitment": "recruitment",
    "screen-analytics": "analytics",
    "screen-shop": "shop",
    "screen-social": "social",
    "screen-story-log": "storyLog"
  };

  var screenKey = screenKeyMap[screenId];
  if (!screenKey) {
    return "";
  }

  var bgHtml = "";
  var bgConfig = config.backgrounds && config.backgrounds[screenKey];
  if (bgConfig && bgConfig.path) {
    bgHtml = "<div class=\"ambient-bg\" style=\"background-image: url('" + bgConfig.path + "');\"></div>";
  }

  return "<div class=\"ambient-layers\">" + bgHtml + "</div>";
}

function renderHeaderStats(gameState) {
  var container = document.getElementById("header-stats");
  if (!container) {
    return;
  }

  var day = gameState.player.day;
  var cash = gameState.player.cash;
  var prevCash = typeof getPreviousValue === "function" ? getPreviousValue("header-cash") : undefined;
  var cashChanged = prevCash !== undefined && prevCash !== cash;
  var debt = Number.isFinite(gameState.player.debtRemaining) ? gameState.player.debtRemaining : 0;
  var ofSubs = gameState.player.onlyFansSubscribers;
  var rep = gameState.player.reputation;
  var defaultDebtDueDay = Number.isFinite(CONFIG.game.debt_due_day) ? CONFIG.game.debt_due_day : 90;
  var debtDueDay = Number.isFinite(gameState.player.debtDueDay) ? gameState.player.debtDueDay : defaultDebtDueDay;
  var daysLeft = Math.max(0, debtDueDay - day);

  var stats = [
    { label: "Day", value: day, className: "" },
    { label: "Cash", value: formatCurrency(cash), className: "header-stat--gold" },
    { label: "OF Subs", value: ofSubs.toLocaleString(), className: "header-stat--accent" },
    { label: "Debt", value: formatCurrency(debt), className: debt > 0 ? "header-stat--danger" : "" }
  ];
  if (debt > 0) {
    stats.push({ label: "Days Left", value: daysLeft, className: daysLeft <= 14 ? "header-stat--danger" : "" });
  }
  stats.push({ label: "Rep", value: rep, className: "" });

  var html = stats.map(function (stat) {
    return "<div class=\"header-stat " + stat.className + "\">" +
      "<span class=\"header-stat__label\">" + stat.label + "</span>" +
      "<span class=\"header-stat__value\">" + stat.value + "</span>" +
      "</div>";
  }).join("");
  var staffingStatusLine = getStaffingCrisisStatusLine(gameState);
  if (staffingStatusLine) {
    html += "<div class=\"header-status header-status--warning\">" + staffingStatusLine + "</div>";
  }

  container.innerHTML = html;

  // Animate cash if changed
  if (cashChanged && typeof animateCurrency === "function") {
    var cashValueEl = container.querySelector(".header-stat--gold .header-stat__value");
    if (cashValueEl) {
      animateCurrency(cashValueEl, prevCash, cash, 600);
      if (typeof flashValueChange === "function") {
        flashValueChange(cashValueEl, cash > prevCash ? "positive" : "negative");
      }
    }
  }
  if (typeof setPreviousValue === "function") {
    setPreviousValue("header-cash", cash);
  }
}

function getStaffingCrisisStatusLine(gameState) {
  if (!gameState || !gameState.flags || !gameState.flags.act2StaffingCrisisActive) {
    return "";
  }
  const config = typeof getStaffingPushConfig === "function" ? getStaffingPushConfig() : null;
  if (!config) {
    return "";
  }
  const penalty = config.penalty || {};
  const overhead = Number.isFinite(penalty.crisisOverheadPerDay) ? penalty.crisisOverheadPerDay : 0;
  const booking = Number.isFinite(penalty.crisisBookingCostPerShoot) ? penalty.crisisBookingCostPerShoot : 0;
  const required = Number.isFinite(config.requiredActiveContracted) ? config.requiredActiveContracted : 0;
  return "⚠ Staffing Crisis: +" + formatCurrency(overhead) + "/day, +" + formatCurrency(booking) +
    " per shoot until " + required + " ACTIVE contracts";
}

function getEventIcon(entry) {
  if (!entry || !entry.id) return "📋";
  var id = entry.id.toLowerCase();
  if (id.indexOf("debt") >= 0 || id.indexOf("loan") >= 0) return "⚠️";
  if (id.indexOf("unlock") >= 0 || id.indexOf("new") >= 0) return "🔓";
  if (id.indexOf("performer") >= 0 || id.indexOf("recruit") >= 0) return "⭐";
  if (id.indexOf("milestone") >= 0 || id.indexOf("legacy") >= 0) return "🏆";
  if (id.indexOf("shoot") >= 0 || id.indexOf("content") >= 0) return "📸";
  if (id.indexOf("social") >= 0 || id.indexOf("post") >= 0) return "📱";
  if (id.indexOf("competition") >= 0 || id.indexOf("rival") >= 0) return "🏁";
  if (id.indexOf("market") >= 0 || id.indexOf("shift") >= 0) return "📈";
  if (id.indexOf("manager") >= 0) return "👔";
  if (id.indexOf("win") >= 0 || id.indexOf("success") >= 0) return "🎉";
  if (id.indexOf("fail") >= 0 || id.indexOf("loss") >= 0) return "💔";
  return "📋";
}

function formatMultiplier(value) {
  var num = Number.isFinite(value) ? value : 1;
  if (num >= 1) {
    return "+" + Math.round((num - 1) * 100) + "%";
  } else {
    return Math.round((num - 1) * 100) + "%";
  }
}

function renderApp(gameState) {
  getUiState();
  renderHeaderStats(gameState);
  renderHub(gameState);
  renderBooking(gameState);
  renderContent(gameState);
  renderAnalytics(gameState);
  renderRoster(gameState);
  renderSocial(gameState);
  renderGallery(gameState);
  renderConquests(gameState);
  renderSlideshow(gameState);
  renderStoryLog(gameState);
  renderShop(gameState);
}

function renderStatusMessage() {
  const uiState = getUiState();
  if (!uiState.message) {
    return "";
  }
  return "<p class=\"helper-text status-message\">" + uiState.message + "</p>";
}

function renderEquipmentMessage() {
  const uiState = getUiState();
  if (!uiState.shop || !uiState.shop.equipmentMessage) {
    return "";
  }
  return "<p class=\"helper-text status-message equipment-message\">" + uiState.shop.equipmentMessage + "</p>";
}

function getStoryLogPreview(text) {
  const limit = Number.isFinite(CONFIG.ui.story_log_preview_length)
    ? CONFIG.ui.story_log_preview_length
    : 120;
  const normalized = String(text || "");
  if (normalized.length <= limit) {
    return normalized;
  }
  return normalized.slice(0, limit).trim() + "…";
}

function formatCompetitionMultiplier(value) {
  const numeric = Number.isFinite(value) ? value : 1;
  return "x" + numeric.toFixed(2);
}

function getDebtEstimateLine(gameState) {
  const player = gameState && gameState.player ? gameState.player : null;
  const debtRemaining = player && Number.isFinite(player.debtRemaining) ? player.debtRemaining : 0;
  const estimate = typeof getDaysToAffordDebtEstimate === "function"
    ? getDaysToAffordDebtEstimate(gameState)
    : { days: null, dailyNet: 0 };
  if (estimate.days === 0 && debtRemaining <= 0) {
    return "<p><strong>Debt:</strong> PAID</p>";
  }
  const dailyNet = Number.isFinite(estimate.dailyNet) ? estimate.dailyNet : 0;
  const netSign = dailyNet >= 0 ? "+" : "-";
  const netLabel = "Net " + netSign + formatCurrency(Math.abs(dailyNet)) + "/day from OF payout − overhead";
  if (estimate.days === null) {
    return "<p><strong>Est. days to afford debt:</strong> — " +
      "<span class=\"helper-text\">(cashflow negative; " + netLabel + ")</span></p>";
  }
  return "<p><strong>Est. days to afford debt:</strong> " + estimate.days +
    " days <span class=\"helper-text\">(" + netLabel + ")</span></p>";
}

function getDebtEstimateMetric(gameState) {
  const player = gameState && gameState.player ? gameState.player : null;
  const debtRemaining = player && Number.isFinite(player.debtRemaining) ? player.debtRemaining : 0;
  const estimate = typeof getDaysToAffordDebtEstimate === "function"
    ? getDaysToAffordDebtEstimate(gameState)
    : { days: null, dailyNet: 0 };
  const dailyNet = Number.isFinite(estimate.dailyNet) ? estimate.dailyNet : 0;
  const netSign = dailyNet >= 0 ? "+" : "-";
  const netLabel = "Net " + netSign + formatCurrency(Math.abs(dailyNet)) + "/day from OF payout − overhead";
  if (estimate.days === 0 && debtRemaining <= 0) {
    return { label: "Est. days to afford debt", value: "Paid", sub: netLabel };
  }
  if (estimate.days === null) {
    return { label: "Est. days to afford debt", value: "—", sub: "Cashflow negative; " + netLabel };
  }
  return { label: "Est. days to afford debt", value: estimate.days + " days", sub: netLabel };
}

function getPerformerTypeLabel(type) {
  if (type === "core") {
    return "Core";
  }
  if (type === "agency_pack") {
    return "Agency Pack";
  }
  return "Performer";
}

function getPerformerDisplayProfile(gameState, performer) {
  if (!performer) {
    return { name: "Unknown", description: "" };
  }
  const catalogEntry = CONFIG.performers.catalog[performer.id];
  return {
    name: performer.name,
    description: catalogEntry && catalogEntry.description ? catalogEntry.description : ""
  };
}

function getContractSummary(gameState, performerId) {
  const contract = getContractState(gameState, performerId);
  const daysRemaining = contract && Number.isFinite(contract.daysRemaining) ? contract.daysRemaining : 0;
  const isExpired = daysRemaining <= 0 || (contract && contract.status === "expired");
  const warningThreshold = Number.isFinite(CONFIG.performerManagement.contractWarningThresholdDays)
    ? CONFIG.performerManagement.contractWarningThresholdDays
    : 0;
  const warningLabel = !isExpired && warningThreshold > 0 && daysRemaining <= warningThreshold
    ? " (Expiring Soon)"
    : "";
  return {
    isExpired: isExpired,
    daysRemaining: daysRemaining,
    label: "Contract: " + (isExpired ? "EXPIRED" : daysRemaining + " days" + warningLabel)
  };
}

function getAvailabilitySummary(gameState, performerId) {
  const performer = typeof performerId === "string" && gameState && gameState.roster
    ? gameState.roster.performers.find(function (entry) {
      return entry.id === performerId;
    })
    : performerId;
  const resolvedId = performer && performer.id ? performer.id : performerId;
  const availability = getAvailabilityState(gameState, resolvedId);
  const restDaysRemaining = availability && Number.isFinite(availability.restDaysRemaining)
    ? availability.restDaysRemaining
    : 0;
  const consecutiveBookings = availability && Number.isFinite(availability.consecutiveBookings)
    ? availability.consecutiveBookings
    : 0;
  const defaultDailyCap = Number.isFinite(CONFIG.performers.default_max_bookings_per_day)
    ? CONFIG.performers.default_max_bookings_per_day
    : 1;
  const dailyCap = performer ? getPerformerDailyBookingCap(performer) : defaultDailyCap;
  return {
    restDaysRemaining: restDaysRemaining,
    consecutiveBookings: consecutiveBookings,
    maxConsecutive: dailyCap,
    label: (restDaysRemaining > 0 ? "Rest: " + restDaysRemaining + " day(s) | " : "") +
      "Daily shoots: " + consecutiveBookings + " / " + dailyCap
  };
}

function renderHub(gameState) {
  var container = document.getElementById("screen-hub");
  if (!container) {
    return;
  }

  var player = gameState.player;
  var day = player.day;
  var cash = player.cash;
  var debt = player.debtRemaining;
  var defaultDebtDueDay = Number.isFinite(CONFIG.game.debt_due_day) ? CONFIG.game.debt_due_day : 90;
  var debtDueDay = Number.isFinite(player.debtDueDay) ? player.debtDueDay : defaultDebtDueDay;
  var debtDaysLeft = Math.max(0, debtDueDay - day);
  var ofSubs = player.onlyFansSubscribers;
  var followers = player.socialFollowers;
  var socialSubs = player.socialSubscribers;
  var reputation = player.reputation;

  var mrr = typeof getMRR === "function" ? getMRR(gameState) : 0;
  var netWorth = typeof getNetWorth === "function" ? getNetWorth(gameState) : cash;
  var dailyPayout = typeof getDailyOfPayout === "function" ? getDailyOfPayout(gameState) : 0;
  var dailyOverhead = typeof getDailyOverhead === "function" ? getDailyOverhead(gameState) : { amount: 0 };
  var dailyOverheadAmount = Number.isFinite(dailyOverhead.amount) ? dailyOverhead.amount : 0;
  var dailyNet = dailyPayout - dailyOverheadAmount;
  var debtEstimate = typeof getDaysToAffordDebtEstimate === "function" ? getDaysToAffordDebtEstimate(gameState) : { days: null };
  var debtPaymentConfig = CONFIG.economy && CONFIG.economy.debtPayment ? CONFIG.economy.debtPayment : null;
  var debtPaymentEnabled = debtPaymentConfig && debtPaymentConfig.enabled === true;
  var debtPaymentHtml = "";

  // Hero Metrics (4 big stats)
  var heroMetricsHtml = "<div class=\"hero-metrics\">" +
    "<div class=\"hero-stat\">" +
      "<div class=\"hero-stat__value hero-stat__value--gold\">" + formatCurrency(cash) + "</div>" +
      "<div class=\"hero-stat__divider\"></div>" +
      "<div class=\"hero-stat__label\">Cash</div>" +
      "<div class=\"hero-stat__sub " + (dailyNet >= 0 ? "hero-stat__sub--positive" : "hero-stat__sub--negative") + "\">" +
        (dailyNet >= 0 ? "+" : "") + formatCurrency(dailyNet) + "/day</div>" +
    "</div>" +
    "<div class=\"hero-stat\">" +
      "<div class=\"hero-stat__value" + (debt > 0 ? " hero-stat__value--red" : " hero-stat__value--green") + "\">" + formatCurrency(debt) + "</div>" +
      "<div class=\"hero-stat__divider\"></div>" +
      "<div class=\"hero-stat__label\">Debt</div>" +
      "<div class=\"hero-stat__sub\">" + (debt > 0 ? "Debt due in " + debtDaysLeft + " days" : "Debt: Cleared") + "</div>" +
    "</div>" +
    "<div class=\"hero-stat\">" +
      "<div class=\"hero-stat__value hero-stat__value--pink\">" + ofSubs.toLocaleString() + "</div>" +
      "<div class=\"hero-stat__divider\"></div>" +
      "<div class=\"hero-stat__label\">OF Subscribers</div>" +
      "<div class=\"hero-stat__sub\">" + formatCurrency(mrr) + " MRR</div>" +
    "</div>" +
    "<div class=\"hero-stat\">" +
      "<div class=\"hero-stat__value\">" + netWorth.toLocaleString() + "</div>" +
      "<div class=\"hero-stat__divider\"></div>" +
      "<div class=\"hero-stat__label\">Net Worth</div>" +
      "<div class=\"hero-stat__sub\">" + (debtEstimate.days !== null ? "~" + debtEstimate.days + " days to clear debt" : "Cashflow negative") + "</div>" +
    "</div>" +
  "</div>";

  var dailyCashflowHtml = "<div class=\"daily-cashflow\">" +
    "<div class=\"daily-cashflow__title\">Daily Cashflow</div>" +
    "<div class=\"daily-cashflow__row\"><span>OF Payouts</span><span class=\"daily-cashflow__value daily-cashflow__value--positive\">+" + formatCurrency(dailyPayout) + "/day</span></div>" +
    "<div class=\"daily-cashflow__row\"><span>Overhead</span><span class=\"daily-cashflow__value daily-cashflow__value--negative\">-" + formatCurrency(dailyOverheadAmount) + "/day</span></div>" +
  "</div>";

  // Secondary stats row
  var secondaryStatsHtml = "<div class=\"secondary-stats-row\">" +
    "<div class=\"secondary-stat\"><span>Followers</span><span class=\"secondary-stat__value\">" + followers.toLocaleString() + "</span></div>" +
    "<div class=\"secondary-stat\"><span>Social Subs</span><span class=\"secondary-stat__value\">" + socialSubs.toLocaleString() + "</span></div>" +
    "<div class=\"secondary-stat\"><span>Reputation</span><span class=\"secondary-stat__value\">" + reputation + "</span></div>" +
    "<div class=\"secondary-stat\"><span>Shoots Today</span><span class=\"secondary-stat__value\">" + player.shootsToday + "</span></div>" +
  "</div>";

  if (debtPaymentEnabled) {
    var quickAmounts = Array.isArray(debtPaymentConfig.quickAmounts) ? debtPaymentConfig.quickAmounts : [];
    var minPayment = Number.isFinite(debtPaymentConfig.minPayment) ? debtPaymentConfig.minPayment : 0;
    var allowMax = debtPaymentConfig.allowMax === true;
    var canPayDebt = debt > 0 && cash >= minPayment;
    var paymentButtons = quickAmounts.filter(function (amount) {
      return Number.isFinite(amount) && amount > 0;
    }).map(function (amount) {
      return createButton(
        "Pay " + formatCurrency(amount),
        "pay-debt",
        "small",
        !canPayDebt,
        "data-amount=\"" + amount + "\""
      );
    });
    if (allowMax) {
      paymentButtons.push(
        createButton(
          "Pay Max",
          "open-pay-max-modal",
          "small primary",
          !canPayDebt,
          ""
        )
      );
    }
    var debtStatusValue = debt > 0 ? formatCurrency(debt) : "Paid";
    var debtAmountClass = debt > 0 ? "debt-payment__amount debt-payment__amount--danger" : "debt-payment__amount debt-payment__amount--good";
    var debtStatusSub = debt > 0 ? ("Min payment " + formatCurrency(minPayment)) : "Debt cleared";
    debtPaymentHtml = "<div class=\"debt-payment-panel\">" +
      "<div class=\"debt-payment__header\">" +
        "<div>" +
          "<div class=\"debt-payment__title\">Pay Down Debt</div>" +
          "<div class=\"" + debtAmountClass + "\">" + debtStatusValue + "</div>" +
          "<div class=\"debt-payment__sub\">" + debtStatusSub + "</div>" +
        "</div>" +
      "</div>" +
      "<div class=\"button-row\">" + paymentButtons.join("") + "</div>" +
    "</div>";
  }

  // Tabloid Feed
  var storyEntries = Array.isArray(gameState.storyLog) ? gameState.storyLog.slice().reverse().slice(0, 8) : [];
  var feedItemsHtml = storyEntries.length ? storyEntries.map(function (entry, index) {
    var isNew = index === 0;
    var dayLabel = Number.isFinite(entry.dayNumber) ? "Day " + entry.dayNumber : "";
    var title = entry.title || "Studio Update";
    var body = entry.body || "";
    var preview = body.length > 80 ? body.substring(0, 80) + "..." : body;
    var icon = getEventIcon(entry);
    return "<div class=\"feed-item" + (isNew ? " feed-item--new" : "") + "\">" +
      "<div class=\"feed-item__header\">" +
        "<span class=\"feed-item__badge" + (isNew ? " feed-item__badge--now" : "") + "\">" + (isNew ? "New" : dayLabel) + "</span>" +
        "<span class=\"feed-item__icon\">" + icon + "</span>" +
        "<span class=\"feed-item__title\">" + title + "</span>" +
      "</div>" +
      "<div class=\"feed-item__body\">" + preview + "</div>" +
    "</div>";
  }).join("") : "<div class=\"feed-item\"><div class=\"feed-item__body\">No events yet. Start booking shoots!</div></div>";

  var feedHtml = "<div class=\"live-feed\">" +
    "<div class=\"live-feed__header\">" +
      "<span class=\"live-feed__title\">📰 Tabloid Feed</span>" +
      "<button class=\"button\" data-action=\"nav-story-log\" style=\"padding:4px 8px;font-size:10px;min-height:auto;\">View All</button>" +
    "</div>" +
    "<div class=\"live-feed__list\">" + feedItemsHtml + "</div>" +
  "</div>";

  // Competition card
  var competitionConfig = CONFIG.market && CONFIG.market.competition ? CONFIG.market.competition : {};
  var competitionUnlocked = typeof isCompetitionUnlocked === "function" ? isCompetitionUnlocked(gameState) : false;
  var competitionEnabled = typeof isCompetitionEnabled === "function" ? isCompetitionEnabled(competitionConfig, day, gameState) : false;
  var standings = competitionEnabled && typeof getCompetitionStandings === "function" ? getCompetitionStandings(gameState) : null;
  var activeShift = competitionEnabled && typeof getActiveMarketShift === "function" ? getActiveMarketShift(gameState, day) : null;

  var competitionValue = !competitionUnlocked ? "Locked" : (competitionEnabled && standings ? "Rank " + standings.rank + "/" + standings.total : "Inactive");
  var competitionSub = !competitionUnlocked ? "Clear debt to unlock" : (activeShift ? "Shift: " + activeShift.name : "No active shift");
  var competitionBadge = !competitionUnlocked ? "<span class=\"strip-card__badge strip-card__badge--locked\">Locked</span>" :
    (competitionEnabled ? "<span class=\"strip-card__badge strip-card__badge--active\">Active</span>" : "");

  // Identity card
  var selectedBranch = typeof getSelectedReputationBranch === "function" ? getSelectedReputationBranch(gameState) : null;
  var reputationConfig = CONFIG.reputation || {};
  var selectionStartDay = reputationConfig.selectionStartDay || 181;
  var identityValue = selectedBranch ? selectedBranch.label : (day >= selectionStartDay ? "Choose Identity" : "Locked");
  var identitySub = selectedBranch ?
    "OF " + formatMultiplier(selectedBranch.ofSubsMult) + ", Followers " + formatMultiplier(selectedBranch.followersMult) :
    (day >= selectionStartDay ? "Select your path" : "Unlocks Day " + selectionStartDay);
  var identityBadge = selectedBranch ? "<span class=\"strip-card__badge strip-card__badge--active\">Active</span>" :
    (day >= selectionStartDay ? "" : "<span class=\"strip-card__badge strip-card__badge--locked\">Locked</span>");

  // Legacy milestones card
  var legacyConfig = CONFIG.legacyMilestones || { milestoneOrder: [], milestones: {} };
  var legacyOrder = legacyConfig.milestoneOrder || [];
  var completedLegacy = Array.isArray(gameState.legacyMilestones) ? gameState.legacyMilestones.length : 0;
  var totalLegacy = legacyOrder.length;
  var legacyValue = completedLegacy + " / " + totalLegacy + " Complete";
  var nextLegacy = legacyOrder.find(function (id) {
    return !gameState.legacyMilestones || !gameState.legacyMilestones.find(function (m) { return m.id === id; });
  });
  var nextLegacyDef = nextLegacy && legacyConfig.milestones ? legacyConfig.milestones[nextLegacy] : null;
  var legacySub = nextLegacyDef ? "Next: " + (nextLegacyDef.label || nextLegacy) : "All complete!";
  var legacyBadge = completedLegacy === totalLegacy ? "<span class=\"strip-card__badge strip-card__badge--active\">Done</span>" : "";

  // Manager card
  var managerConfig = CONFIG.upgrades && CONFIG.upgrades.manager ? CONFIG.upgrades.manager : null;
  var managerHired = player.upgrades && player.upgrades.managerHired;
  var managerUnlocked = managerConfig && (managerConfig.unlockAfterDebt !== true || debt <= 0);
  var managerValue = managerHired ? "Hired" : (managerUnlocked ? formatCurrency(managerConfig ? managerConfig.cost : 0) : "Locked");
  var managerSub = managerHired ? "Overhead reduced" : (managerUnlocked ? "Reduces daily overhead" : "Clear debt to unlock");
  var managerBadge = managerHired ? "<span class=\"strip-card__badge strip-card__badge--active\">Active</span>" :
    (!managerUnlocked ? "<span class=\"strip-card__badge strip-card__badge--locked\">Locked</span>" : "");
  var managerButton = !managerHired && managerUnlocked && managerConfig ?
    "<button class=\"button primary\" data-action=\"hire-manager\" style=\"margin-top:6px;padding:4px 8px;font-size:10px;min-height:auto;\">Hire</button>" : "";

  var cardsStripHtml = "<div class=\"cards-strip\">" +
    "<div class=\"strip-card\">" +
      "<div class=\"strip-card__title\">Competition</div>" +
      "<div class=\"strip-card__value\">" + competitionValue + "</div>" +
      "<div class=\"strip-card__sub\">" + competitionSub + "</div>" +
      competitionBadge +
    "</div>" +
    "<div class=\"strip-card\">" +
      "<div class=\"strip-card__title\">Studio Identity</div>" +
      "<div class=\"strip-card__value\">" + identityValue + "</div>" +
      "<div class=\"strip-card__sub\">" + identitySub + "</div>" +
      identityBadge +
    "</div>" +
    "<div class=\"strip-card\">" +
      "<div class=\"strip-card__title\">Legacy Milestones</div>" +
      "<div class=\"strip-card__value\">" + legacyValue + "</div>" +
      "<div class=\"strip-card__sub\">" + legacySub + "</div>" +
      legacyBadge +
    "</div>" +
    "<div class=\"strip-card\">" +
      "<div class=\"strip-card__title\">Manager</div>" +
      "<div class=\"strip-card__value\">" + managerValue + "</div>" +
      "<div class=\"strip-card__sub\">" + managerSub + "</div>" +
      managerBadge +
      managerButton +
    "</div>" +
  "</div>";

  // Footer controls
  var autoBookEnabled = gameState.automation && gameState.automation.autoBookEnabled;
  var autoPostEnabled = gameState.automation && gameState.automation.autoPostEnabled;

  var footerHtml = "<div class=\"hub-footer\">" +
    "<div class=\"hub-footer__actions\"></div>" +
    "<div class=\"hub-footer__automation\">" +
      "<span>Automation</span>" +
      "<div class=\"automation-group\">" +
        "<button class=\"automation-toggle" + (autoBookEnabled ? " is-on" : "") + "\" data-action=\"toggle-auto-book\" title=\"Auto-Book\"></button>" +
        "<span>Book</span>" +
      "</div>" +
      "<div class=\"automation-group\">" +
        "<button class=\"automation-toggle" + (autoPostEnabled ? " is-on" : "") + "\" data-action=\"toggle-auto-post\" title=\"Auto-Post\"></button>" +
        "<span>Post</span>" +
      "</div>" +
    "</div>" +
  "</div>";

  // Debug panel (only if enabled)
  var debugPanel = "";
  if (typeof isDebugEnabled === "function" && isDebugEnabled()) {
    var uiState = getUiState();
    var debugStatus = uiState.debug && uiState.debug.dayStatus ? uiState.debug.dayStatus : "";
    debugPanel = "<div class=\"panel\" style=\"margin-top:var(--gap-md);\">" +
      "<h3 class=\"panel-title\">Debug (Dev Only)</h3>" +
      "<div class=\"field-row\">" +
        "<label class=\"field-label\" for=\"debug-day-input\">Day</label>" +
        "<input id=\"debug-day-input\" class=\"input-control\" type=\"number\" min=\"" + CONFIG.debug.minDay + "\" max=\"" + CONFIG.debug.maxDay + "\" step=\"1\" value=\"" + day + "\" style=\"width:80px;\" />" +
        "<button class=\"button\" type=\"button\" data-action=\"debug-set-day-reload\" style=\"margin-left:8px;\">Set Day</button>" +
      "</div>" +
      "<div class=\"field-row\" style=\"margin-top:8px;\">" +
        "<label class=\"field-label\" for=\"debug-cash-input\">Cash</label>" +
        "<input id=\"debug-cash-input\" class=\"input-control\" type=\"number\" min=\"0\" step=\"1\" value=\"" + cash + "\" style=\"width:100px;\" />" +
      "</div>" +
      "<div class=\"field-row\">" +
        "<label class=\"field-label\" for=\"debug-reputation-input\">Rep</label>" +
        "<input id=\"debug-reputation-input\" class=\"input-control\" type=\"number\" min=\"0\" step=\"1\" value=\"" + reputation + "\" style=\"width:80px;\" />" +
      "</div>" +
      "<div class=\"button-row\" style=\"margin-top:8px;\">" +
        "<button class=\"button\" type=\"button\" data-action=\"debug-apply-stats\">Apply Stats</button>" +
        "<button class=\"button\" type=\"button\" data-action=\"debug-run-milestone-checks\">Run Milestones</button>" +
      "</div>" +
      "<div id=\"debug-day-status\" class=\"muted\" style=\"margin-top:8px;\">" + debugStatus + "</div>" +
    "</div>";
  }

  // Assemble Hub
  var contentHtml = "<div class=\"hub-dashboard\">" +
    "<div class=\"hub-dashboard__metrics\">" +
      "<div class=\"panel\" style=\"flex:1;display:flex;flex-direction:column;\">" +
        "<h3 class=\"panel-title\">VIP Dashboard</h3>" +
        heroMetricsHtml +
        dailyCashflowHtml +
        secondaryStatsHtml +
        debtPaymentHtml +
      "</div>" +
    "</div>" +
    "<div class=\"hub-dashboard__feed\">" +
      "<div class=\"panel\" style=\"flex:1;display:flex;flex-direction:column;overflow:hidden;\">" +
        feedHtml +
      "</div>" +
    "</div>" +
  "</div>" +
  cardsStripHtml +
  footerHtml +
  renderStatusMessage() +
  debugPanel;

  var html = renderAmbientLayers("screen-hub") +
    "<div class=\"screen-content mascot-clearance\">" +
    contentHtml +
    "</div>";
  container.innerHTML = html;

  // Stagger entrance animation for hero stats
  var heroMetrics = container.querySelector(".hero-metrics");
  if (heroMetrics) {
    heroMetrics.classList.add("stagger-enter");
  }
}

function renderBooking(gameState) {
  var container = document.getElementById("screen-booking");
  if (!container) {
    return;
  }

  var uiState = getUiState();
  var bookingMode = uiState.booking.bookingMode || "core";
  var agencyPackUsedToday = Boolean(gameState.player.agencyPackUsedToday);
  var isAgencyPack = bookingMode === "agency_pack";

  // Get performers
  var allPerformers = gameState.roster.performers || [];
  var corePerformers = allPerformers.filter(function(p) { return p.type === "core"; });
  var selectedPerformerId = uiState.booking.performerIdA;
  var selectedPerformer = selectedPerformerId ? corePerformers.find(function(p) { return p.id === selectedPerformerId; }) : null;
  var divaFee = (!isAgencyPack && selectedPerformer) ? getDivaShootFeeForPerformer(selectedPerformer) : 0;
  var divaLabel = (!isAgencyPack && selectedPerformer) ? getDivaFeeLabelForPerformer(selectedPerformer) : null;
  var divaLoyaltyValue = (!isAgencyPack && selectedPerformer)
    ? (Number.isFinite(selectedPerformer.loyalty) ? selectedPerformer.loyalty : CONFIG.performers.starting_loyalty)
    : null;
  var effectiveStar = (!isAgencyPack && selectedPerformer) ? getEffectiveStarPower(selectedPerformer) : null;

  // Get locations
  var locationIds = (CONFIG.locations.tier0_ids || [])
    .concat(CONFIG.locations.tier1_ids || [])
    .concat(CONFIG.locations.tier2_ids || []);
  var selectedLocationId = uiState.booking.locationId;
  var selectedLocation = selectedLocationId ? CONFIG.locations.catalog[selectedLocationId] : null;

  // Get themes
  var themeIds = CONFIG.themes.mvp.theme_ids || [];
  var selectedThemeId = uiState.booking.themeId;
  var selectedTheme = selectedThemeId ? getThemeById(selectedThemeId) : null;

  // Content type
  var selectedContentType = uiState.booking.contentType;

  // Calculate cost
  var shootCostResult = isAgencyPack ? calculateAgencyPackCost(selectedLocation) : calculateShootCost(selectedLocation);
  var baseCost = shootCostResult.ok ? shootCostResult.value : 0;
  var adjustedCost = applyContentTypeCostMultiplier(baseCost, selectedContentType);
  var starPremium = (!isAgencyPack && selectedPerformer)
    ? getStarPowerCostPremium(selectedPerformer, adjustedCost.finalCost)
    : { mult: 1, surcharge: 0, maxStar: null };
  var starPowerSurcharge = Number.isFinite(starPremium.surcharge) ? starPremium.surcharge : 0;
  var staffingPenalty = getStaffingCrisisBookingPenalty(gameState);
  var finalCost = adjustedCost.finalCost + (Number.isFinite(divaFee) ? divaFee : 0) + starPowerSurcharge +
    (Number.isFinite(staffingPenalty) ? staffingPenalty : 0);

  // Booking mode cards
  var modeCardsHtml = '<div class="selection-grid selection-grid--2col">' +
    '<div class="selection-card' + (bookingMode === 'core' ? ' is-selected' : '') + '" data-action="select-booking-mode" data-id="core">' +
      '<div class="selection-card__title">Core Performer</div>' +
      '<div class="selection-card__subtitle">Book your contracted talent</div>' +
      '<div class="selection-card__meta">Full premium potential</div>' +
    '</div>' +
    '<div class="selection-card' + (bookingMode === 'agency_pack' ? ' is-selected' : '') + (agencyPackUsedToday ? ' is-disabled' : '') + '" data-action="select-booking-mode" data-id="agency_pack">' +
      (agencyPackUsedToday ? '<span class="selection-card__badge">Used Today</span>' : '') +
      '<div class="selection-card__title">Agency Sample Pack</div>' +
      '<div class="selection-card__subtitle">5-image variety bundle</div>' +
      '<div class="selection-card__meta">Good for promos</div>' +
    '</div>' +
  '</div>';

  // Performer selection (only for core mode)
  var performerHtml = '';
  if (!isAgencyPack) {
    var performerOptionsHtml = corePerformers.map(function(p) {
      var isSelected = p.id === selectedPerformerId;
      var status = isPerformerBookable(gameState, p);
      var availabilityText = status.ok ? 'Available' : 'Busy';
      return '<option value="' + p.id + '"' + (isSelected ? ' selected' : '') + '>' +
        p.name + ' \u2022 ' + availabilityText +
      '</option>';
    }).join('');
    var selectPanelHtml = '<div class="panel">' +
      '<h3 class="panel-title">Select Performer</h3>' +
      '<div class="field-row" style="flex-direction:column;align-items:stretch;gap:var(--gap-xs);">' +
        '<label class="form-label" for="booking-performer-select">Performer</label>' +
        '<select id="booking-performer-select" class="select-control" data-action="select-performer-a">' +
          '<option value=""' + (selectedPerformerId ? '' : ' selected') + '>\u2014 Select a performer \u2014</option>' +
          performerOptionsHtml +
        '</select>' +
      '</div>' +
    '</div>';

    var performerCardHtml = '';
    if (selectedPerformer) {
      var cardStatus = isPerformerBookable(gameState, selectedPerformer);
      var cardStatusText = cardStatus.ok ? 'Available'
        : (cardStatus.reason && cardStatus.reason.indexOf('Cooldown') >= 0 ? 'On Cooldown' : 'Busy');
      var cardStatusClass = cardStatus.ok ? 'performer-profile-card__status-badge--available'
        : (cardStatus.reason && cardStatus.reason.indexOf('Cooldown') >= 0
          ? 'performer-profile-card__status-badge--cooldown'
          : 'performer-profile-card__status-badge--busy');
      performerCardHtml = '<div class="panel">' +
        '<h3 class="panel-title">Performer Card</h3>' +
        '<div class="performer-profile-card">' +
          '<div class="performer-profile-card__portrait">Portrait</div>' +
          '<div class="performer-profile-card__name">' + selectedPerformer.name + '</div>' +
          '<div class="performer-profile-card__stats">' +
            '<div class="performer-profile-card__stat">⭐ <span class="performer-profile-card__stat-value">' + selectedPerformer.starPower + '</span></div>' +
            '<div class="performer-profile-card__stat">😓 <span class="performer-profile-card__stat-value">' + selectedPerformer.fatigue + '</span></div>' +
            '<div class="performer-profile-card__stat" title="Loyalty — keep her booked or she gets expensive.">❤️ <span class="performer-profile-card__stat-value">' + selectedPerformer.loyalty + '</span></div>' +
          '</div>' +
          (divaLabel ? '<div class="diva-fee-note">⚠ ' + divaLabel + ' Active</div>' : '') +
          '<div class="performer-profile-card__status-badge ' + cardStatusClass + '">' + cardStatusText + '</div>' +
        '</div>' +
      '</div>';
    }

    performerHtml = selectPanelHtml + performerCardHtml;
  } else {
    performerHtml = '<div class="panel"><h3 class="panel-title">Agency Pack</h3>' +
      '<p style="color:var(--text-muted);font-size:13px;">Agency provides a 5-image sample pack matched to your selected theme and location.</p></div>';
  }

  // Location selection
  var locationCardsHtml = locationIds.map(function(locId) {
    var loc = CONFIG.locations.catalog[locId];
    if (!loc) return '';
    var isSelected = locId === selectedLocationId;
    var tier1Locked = loc.tier === 1 && !isLocationTierUnlocked(gameState, "tier1");
    var tier2Locked = loc.tier === 2 && !isLocationTierUnlocked(gameState, "tier2");
    var tier2RepReq = CONFIG.locations.tier2ReputationRequirement || 0;
    var tier2RepLocked = loc.tier === 2 && gameState.player.reputation < tier2RepReq;
    var isLocked = tier1Locked || tier2Locked || tier2RepLocked;
    var lockReason = tier1Locked || tier2Locked ? 'Locked' : (tier2RepLocked ? 'Rep ' + tier2RepReq + ' required' : '');
    var thumbPath = getLocationThumbnailPath(loc);
    return '<div class="location-card' + (isSelected ? ' is-selected' : '') + (isLocked ? ' is-disabled' : '') + '" data-action="select-location" data-id="' + locId + '">' +
      '<img class="location-card__thumb" src="' + thumbPath + '" alt="' + loc.name + '">' +
      '<div class="location-card__info">' +
        '<div class="location-card__name">' + loc.name + '</div>' +
        '<div class="location-card__meta">' +
          '<span class="location-card__cost">' + formatCurrency(loc.cost) + '</span>' +
          (isLocked ? ' <span class="location-card__lock">• ' + lockReason + '</span>' : '') +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');

  // Theme selection
  var themeCardsHtml = themeIds.map(function(themeId) {
    var theme = getThemeById(themeId);
    if (!theme) return '';
    var isSelected = themeId === selectedThemeId;
    var effectsLabel = formatThemeEffects(theme);
    return '<div class="selection-card' + (isSelected ? ' is-selected' : '') + '" data-action="select-theme" data-id="' + themeId + '">' +
      '<div class="selection-card__title">' + theme.name + '</div>' +
      '<div class="selection-card__subtitle">' + theme.description + '</div>' +
      '<div class="selection-card__meta selection-card__meta--highlight">' + effectsLabel + '</div>' +
    '</div>';
  }).join('');

  // Content type selection
  var contentTypes = CONFIG.content_types.available || ['Promo', 'Premium'];
  var contentTypeHtml = contentTypes.map(function(type) {
    var isSelected = type === selectedContentType;
    var isPremium = type === 'Premium';
    return '<div class="selection-card' + (isSelected ? ' is-selected' : '') + '" data-action="select-content-type" data-id="' + type + '" style="text-align:center;">' +
      (isPremium ? '<span class="selection-card__badge selection-card__badge--premium">💎</span>' : '') +
      '<div class="selection-card__title">' + type + '</div>' +
      '<div class="selection-card__meta">' + (isPremium ? 'Higher cost, OF subs' : 'Social reach') + '</div>' +
    '</div>';
  }).join('');

  // Validation
  var performerValid = isAgencyPack || (selectedPerformer && isPerformerBookable(gameState, selectedPerformer).ok);
  var locationValid = selectedLocation && !((selectedLocation.tier === 1 && !isLocationTierUnlocked(gameState, "tier1")) || (selectedLocation.tier === 2 && !isLocationTierUnlocked(gameState, "tier2")));
  var canAfford = gameState.player.cash >= finalCost;
  var canConfirm = performerValid && locationValid && selectedTheme && selectedContentType && canAfford && !(isAgencyPack && agencyPackUsedToday);

  // Summary
  var divaFeeReason = (!isAgencyPack && divaFee > 0 && selectedPerformer)
    ? "Low loyalty " + divaLoyaltyValue + (divaLabel ? " \u2014 " + divaLabel : "")
    : "";
  var divaFeeRow = (!isAgencyPack && divaFee > 0)
    ? '<div class="booking-summary__row"><span class="booking-summary__label">Diva Fee</span><span class="booking-summary__value">+' + formatCurrency(divaFee) + (divaFeeReason ? ' (' + divaFeeReason + ')' : '') + '</span></div>'
    : '';
  var starRatingRow = (!isAgencyPack && selectedPerformer && Number.isFinite(selectedPerformer.starPower))
    ? '<div class="booking-summary__row"><span class="booking-summary__label">Star Rating</span><span class="booking-summary__value">★' + selectedPerformer.starPower + '</span></div>'
    : '';
  var starPowerPremiumRow = (!isAgencyPack && starPowerSurcharge > 0)
    ? '<div class="booking-summary__row"><span class="booking-summary__label">Star Power Premium (★' + starPremium.maxStar + ' x' + starPremium.mult.toFixed(2) + ')</span><span class="booking-summary__value">+' + formatCurrency(starPowerSurcharge) + '</span></div>'
    : '';
  var starPowerPremiumNote = (!isAgencyPack && starPowerSurcharge > 0)
    ? '<div class="helper-text">High-star talent costs more to book.</div>'
    : '';
  var staffingPenaltyRow = (Number.isFinite(staffingPenalty) && staffingPenalty > 0)
    ? '<div class="booking-summary__row"><span class="booking-summary__label">Staffing Crisis</span><span class="booking-summary__value">+' + formatCurrency(staffingPenalty) + '</span></div>'
    : '';
  var starRow = (!isAgencyPack && selectedPerformer && Number.isFinite(effectiveStar))
    ? '<div class="booking-summary__row"><span class="booking-summary__label">Audience Pull (Star Power)</span><span class="booking-summary__value">x' + effectiveStar.toFixed(2) + '</span></div>'
    : '';
  var summaryHtml = '<div class="booking-summary">' +
    '<div class="booking-summary__row"><span class="booking-summary__label">Mode</span><span class="booking-summary__value">' + (isAgencyPack ? 'Agency Pack' : 'Core') + '</span></div>' +
    '<div class="booking-summary__row"><span class="booking-summary__label">Performer</span><span class="booking-summary__value">' + (isAgencyPack ? 'Agency' : (selectedPerformer ? selectedPerformer.name : '—')) + '</span></div>' +
    '<div class="booking-summary__row"><span class="booking-summary__label">Location</span><span class="booking-summary__value">' + (selectedLocation ? selectedLocation.name : '—') + '</span></div>' +
    '<div class="booking-summary__row"><span class="booking-summary__label">Theme</span><span class="booking-summary__value">' + (selectedTheme ? selectedTheme.name : '—') + '</span></div>' +
    '<div class="booking-summary__row"><span class="booking-summary__label">Type</span><span class="booking-summary__value">' + (selectedContentType || '—') + '</span></div>' +
    starRatingRow +
    starRow +
    divaFeeRow +
    starPowerPremiumRow +
    starPowerPremiumNote +
    staffingPenaltyRow +
    '<div class="divider"></div>' +
    '<div class="booking-summary__row"><span class="booking-summary__label">Total Cost</span><span class="booking-summary__value booking-summary__value--cost">' + formatCurrency(finalCost) + '</span></div>' +
    '<div class="button-row" style="margin-top:var(--gap-md);">' +
      '<button class="button primary" data-action="confirm-shoot"' + (canConfirm ? '' : ' disabled') + ' style="flex:1;">📷 Confirm Shoot</button>' +
    '</div>' +
  '</div>';

  // Assemble layout
  var contentHtml = '<h2 class="screen-title">Booking</h2>' +
    '<div class="booking-layout">' +
      '<div class="booking-layout__left">' +
        '<div class="panel"><h3 class="panel-title">Booking Mode</h3>' + modeCardsHtml + '</div>' +
        performerHtml +
      '</div>' +
      '<div class="booking-layout__right">' +
        '<div class="panel"><h3 class="panel-title">Location</h3>' + locationCardsHtml + '</div>' +
        '<div class="panel"><h3 class="panel-title">Theme</h3><div class="selection-grid selection-grid--2col">' + themeCardsHtml + '</div></div>' +
        '<div class="panel"><h3 class="panel-title">Content Type</h3><div class="selection-grid selection-grid--2col">' + contentTypeHtml + '</div></div>' +
        summaryHtml +
      '</div>' +
    '</div>' +
    renderStatusMessage() +
    '<div class="button-row"><button class="button ghost" data-action="nav-hub">← Back to Hub</button></div>';

  container.innerHTML = renderAmbientLayers("screen-booking") +
    '<div class="screen-content mascot-clearance">' +
    contentHtml +
    '</div>';
}


function renderContent(gameState) {
  const container = document.getElementById("screen-content");
  if (!container) {
    return;
  }
  const uiState = getUiState();
  const entry = getLatestContentEntry(gameState);

  let contentBody = "<p class=\"helper-text\">No content yet. Book a shoot first.</p>";
  if (!entry && gameState.content.lastContentId) {
    contentBody = "<p class=\"helper-text\">Content record missing.</p>";
  }
  if (entry) {
    const performer = getContentEntryPerformerLabel(gameState, entry);
    const location = getLocationName(entry.locationId);
    const theme = getThemeName(entry.themeId);
    const photoPaths = typeof getEntryPhotoPaths === "function"
      ? getEntryPhotoPaths(entry).slice(0, 5)
      : [];
    const slideCount = photoPaths.length;
    const maxIndex = Math.max(0, slideCount - 1);
    const rawIndex = Number.isFinite(uiState.bookingSlideshowIndex) ? uiState.bookingSlideshowIndex : 0;
    const safeIndex = Math.min(Math.max(0, rawIndex), maxIndex);
    const slidePath = slideCount ? photoPaths[safeIndex] : CONFIG.SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH;
    const counterLabel = slideCount ? (safeIndex + 1) + " / " + slideCount : "0 / 0";
    const prevDisabled = safeIndex <= 0;
    const nextDisabled = safeIndex >= maxIndex;
    uiState.bookingSlideshowIndex = safeIndex;
    const imageHtml = "<div class=\"slideshow-image-container\">" +
      "<img class=\"slideshow-image\" src=\"" + slidePath + "\" alt=\"Shoot preview " + (safeIndex + 1) + "\" />" +
      "</div>";
    const controlsHtml = "<div class=\"slideshow-controls\">" +
      createButton("Prev", "booking-slideshow-prev", "", prevDisabled) +
      createButton("Next", "booking-slideshow-next", "primary", nextDisabled) +
      "<span class=\"slideshow-counter\">" + counterLabel + "</span>" +
      "</div>";
    const infoHtml = "<div class=\"slideshow-info\">" +
      "<p><strong>Performer:</strong> " + performer + "</p>" +
      "<p><strong>Location:</strong> " + location + "</p>" +
      "<p><strong>Theme:</strong> " + theme + "</p>" +
      "<p><strong>Content Type:</strong> " + entry.contentType + "</p>" +
      "<p><strong>Day Created:</strong> " + entry.dayCreated + "</p>" +
      "<p><strong>Shoot Cost:</strong> " + formatCurrency(entry.shootCost) + "</p>" +
      "</div>";
    contentBody = "<div class=\"slideshow-layout\">" +
      imageHtml +
      controlsHtml +
      infoHtml +
      "</div>";
  }

  let actionButtons = "";
  if (!entry) {
    actionButtons = createButton("View Analytics", "nav-analytics", "primary", true) +
      createButton("Back to Hub", "nav-hub");
  } else if (entry.contentType === "Premium") {
    actionButtons = createButton("Back to Booking", "nav-booking", "primary") +
      createButton("Back to Hub", "nav-hub");
  } else if (entry.contentType === "Promo") {
    actionButtons = createButton(
      "Post on Social",
      "content-post-social",
      "primary",
      false,
      "data-id=\"" + entry.id + "\""
    ) +
      createButton("Back to Booking", "nav-booking");
  } else {
    actionButtons = createButton("View Analytics", "nav-analytics", "primary") +
      createButton("Back to Hub", "nav-hub");
  }

  const body = contentBody +
    renderStatusMessage() +
    "<div class=\"button-row\">" +
    actionButtons +
    "</div>";
  const contentHtml = createPanel("Content", body, "screen-content-title");
  container.innerHTML = renderAmbientLayers("screen-content") +
    "<div class=\"screen-content\">" +
    contentHtml +
    "</div>";
}

function clampNumber(value, fallback) {
  return Number.isFinite(value) ? value : fallback;
}

function getHistorySeries(history, key, days) {
  if (!Array.isArray(history) || !history.length) {
    return [];
  }
  var safeDays = Number.isFinite(days) ? Math.max(1, Math.floor(days)) : history.length;
  var sliced = history.slice(Math.max(0, history.length - safeDays));
  return sliced.map(function (entry) {
    if (!entry) {
      return 0;
    }
    return clampNumber(entry[key], 0);
  });
}

function getDelta(values, daysBack) {
  if (!Array.isArray(values) || values.length < 2) {
    return 0;
  }
  var safeDaysBack = Number.isFinite(daysBack) ? Math.max(1, Math.floor(daysBack)) : 1;
  var lastIndex = values.length - 1;
  var compareIndex = lastIndex - safeDaysBack;
  if (compareIndex < 0) {
    return 0;
  }
  return values[lastIndex] - values[compareIndex];
}

function renderSparkline(values) {
  if (!Array.isArray(values) || values.length < 2) {
    return "";
  }
  var width = 140;
  var height = 34;
  var min = Math.min.apply(null, values);
  var max = Math.max.apply(null, values);
  var range = max - min;
  if (!Number.isFinite(range) || range === 0) {
    range = 1;
  }

  var points = values.map(function (value, index) {
    var x = (index / (values.length - 1)) * (width - 2) + 1;
    var normalized = (value - min) / range;
    var y = height - 1 - normalized * (height - 2);
    return x.toFixed(1) + "," + y.toFixed(1);
  }).join(" ");

  return "<div class=\"sparkline\">" +
    "<svg viewBox=\"0 0 " + width + " " + height + "\" aria-hidden=\"true\">" +
    "<line x1=\"0\" y1=\"" + (height - 1) + "\" x2=\"" + width + "\" y2=\"" + (height - 1) + "\" stroke=\"rgba(255,255,255,0.2)\" stroke-width=\"1\" />" +
    "<polyline fill=\"none\" stroke=\"rgba(212,175,55,0.85)\" stroke-width=\"2\" points=\"" + points + "\" />" +
    "</svg>" +
    "</div>";
}

function formatDelta(value) {
  var safeValue = Number.isFinite(value) ? value : 0;
  if (safeValue > 0) {
    return "+" + safeValue.toLocaleString();
  }
  if (safeValue < 0) {
    return "-" + Math.abs(safeValue).toLocaleString();
  }
  return "0";
}

function renderAnalytics(gameState) {
  var container = document.getElementById("screen-analytics");
  if (!container) {
    return;
  }

  var player = gameState.player;
  var cash = clampNumber(player.cash, 0);
  var ofSubs = clampNumber(player.onlyFansSubscribers, 0);
  var followers = clampNumber(player.socialFollowers, 0);
  var reputation = clampNumber(player.reputation, 0);
  var history = Array.isArray(gameState.analyticsHistory) ? gameState.analyticsHistory : [];
  var sparklineDays = CONFIG.analytics && Number.isFinite(CONFIG.analytics.sparklineDays)
    ? CONFIG.analytics.sparklineDays
    : 30;
  var cashflowDays = CONFIG.analytics && Number.isFinite(CONFIG.analytics.cashflowDays)
    ? CONFIG.analytics.cashflowDays
    : 7;
  var hasWeeklyTrend = history.length >= 8;

  var cashSeries = getHistorySeries(history, "cash", sparklineDays);
  var subsSeries = getHistorySeries(history, "onlyFansSubscribers", sparklineDays);
  var followersSeries = getHistorySeries(history, "socialFollowers", sparklineDays);
  var reputationSeries = getHistorySeries(history, "reputation", sparklineDays);

  var weeklyCashDelta = hasWeeklyTrend ? getDelta(cashSeries, 7) : 0;
  var weeklySubsDelta = hasWeeklyTrend ? getDelta(subsSeries, 7) : 0;

  var momentumLabel = "STEADY";
  var momentumClass = "chip--steady";
  if (weeklyCashDelta > 0 && weeklySubsDelta > 0) {
    momentumLabel = "HOT";
    momentumClass = "chip--hot";
  } else if (weeklyCashDelta <= 0 && weeklySubsDelta <= 0) {
    momentumLabel = "STALLING";
    momentumClass = "chip--stalling";
  }

  function renderHeatCard(label, valueHtml, seriesValues) {
    if (!hasWeeklyTrend) {
      return '<div class="analytics-card"><div class="analytics-card__value">' + valueHtml + '</div>' +
        '<div class="analytics-card__label">' + label + '</div>' +
        '<div class="analytics-card__sub">Collecting trend data…</div></div>';
    }
    var delta = getDelta(seriesValues, 7);
    var deltaClass = delta > 0 ? "delta--pos" : (delta < 0 ? "delta--neg" : "");
    var sparklineHtml = renderSparkline(seriesValues);
    return '<div class="analytics-card"><div class="analytics-card__value">' + valueHtml + '</div>' +
      '<div class="analytics-card__label">' + label + '</div>' +
      '<div class="delta ' + deltaClass + '">7D ' + formatDelta(delta) + '</div>' +
      sparklineHtml +
      '</div>';
  }

  var heatCardsHtml = '<div class="analytics-heat-grid">' +
    renderHeatCard("Cash", formatCurrency(cash), cashSeries) +
    renderHeatCard("OF Subscribers", ofSubs.toLocaleString(), subsSeries) +
    renderHeatCard("Social Followers", followers.toLocaleString(), followersSeries) +
    renderHeatCard("Reputation", reputation.toLocaleString(), reputationSeries) +
    '</div>';

  var cashflowHtml = "";
  if (history.length < 2) {
    cashflowHtml = '<div class="panel"><h3 class="panel-title">Cashflow (7 Days)</h3>' +
      '<div class="analytics-subtitle">Cashflow bars start after 2+ days of data.</div></div>';
  } else {
    var startIndex = Math.max(1, history.length - cashflowDays);
    var deltas = [];
    for (var i = startIndex; i < history.length; i += 1) {
      var current = history[i];
      var previous = history[i - 1];
      if (!current || !previous) {
        continue;
      }
      deltas.push({
        delta: clampNumber(current.cash, 0) - clampNumber(previous.cash, 0),
        day: current.dayNumber
      });
    }
    var maxAbs = deltas.reduce(function (maxValue, item) {
      var absValue = Math.abs(item.delta);
      return absValue > maxValue ? absValue : maxValue;
    }, 1);
    var barsHtml = deltas.map(function (item, index) {
      var height = Math.max(6, Math.round((Math.abs(item.delta) / maxAbs) * 60));
      var barClass = item.delta >= 0 ? "bar--pos" : "bar--neg";
      var label = "D" + (index - deltas.length + 1);
      if (Number.isFinite(item.day)) {
        label = "Day " + item.day;
      }
      return '<div class="cashflow-bar ' + barClass + '" style="height:' + height + 'px" title="' +
        formatCurrency(item.delta) + '"></div>';
    }).join("");
    var labelsHtml = deltas.map(function (item, index) {
      var label = "D" + (index - deltas.length + 1);
      if (Number.isFinite(item.day)) {
        label = "Day " + item.day;
      }
      return '<span>' + label + '</span>';
    }).join("");
    cashflowHtml = '<div class="panel"><h3 class="panel-title">Cashflow (7 Days)</h3>' +
      '<div class="cashflow-bars">' + barsHtml + '</div>' +
      '<div class="analytics-subtitle" style="display:flex;gap:8px;flex-wrap:wrap;">' + labelsHtml + '</div>' +
      '</div>';
  }

  var debtRemaining = clampNumber(player.debtRemaining, 0);
  var debtInitial = clampNumber(player.debtInitialPrincipal, CONFIG.game.loan_total_due);
  var debtHtml = "";
  if (debtRemaining <= 0) {
    debtHtml = '<div class="panel"><h3 class="panel-title">Debt</h3>' +
      '<div class="stat-row"><span class="stat-row__label">Debt: Cleared.</span></div></div>';
  } else {
    var pctPaid = debtInitial > 0 ? Math.min(1, Math.max(0, (debtInitial - debtRemaining) / debtInitial)) : 1;
    var pctLabel = Math.round(pctPaid * 100);
    debtHtml = '<div class="panel"><h3 class="panel-title">Debt</h3>' +
      '<div class="stat-row"><span class="stat-row__label">Debt:</span><span class="stat-row__value">' +
      formatCurrency(debtRemaining) + ' remaining (' + pctLabel + '% paid)</span></div>' +
      '<div class="progress" aria-hidden="true"><div class="progress__fill" style="width:' + pctLabel + '%;"></div></div>' +
      '</div>';
  }

  var summary = typeof getWindowedSummary === "function" ? getWindowedSummary(gameState, 7) : {};
  var promoCount = clampNumber(summary.promoCount, 0);
  var premiumCount = clampNumber(summary.premiumCount, 0);
  var weeklyOverhead = typeof getDailyOverhead === "function"
    ? clampNumber(getDailyOverhead(gameState).amount, 0) * 7
    : 0;

  var topDriver = "Quiet week. No content means no momentum.";
  if (premiumCount > promoCount) {
    topDriver = "Premium did the heavy lifting. Keep them thirsty.";
  } else if (promoCount > 0) {
    topDriver = "Promo is your bait. Don’t skip the bait.";
  }

  var biggestLeak = weeklyOverhead > 0
    ? "Overhead is the silent pimp — about " + formatCurrency(weeklyOverhead) + "/week."
    : "Overhead is under control. For now.";

  var suggestedMove = "Keep pressure: alternate Promo → Premium to keep growth compounding.";
  if (promoCount === 0) {
    suggestedMove = "Drop 2–3 Promos to spike followers fast.";
  } else if (premiumCount === 0) {
    suggestedMove = "Book a Premium shoot to convert attention into subs.";
  } else if (weeklyCashDelta < 0) {
    suggestedMove = "Cut the bleed: run Premium + pay down debt.";
  }

  var insightsHtml = '<div class="panel analytics-insights">' +
    '<h3 class="panel-title">The Memo</h3>' +
    '<ul class="insights-list">' +
    '<li><strong>Top Driver:</strong> ' + topDriver + '</li>' +
    '<li><strong>Biggest Leak:</strong> ' + biggestLeak + '</li>' +
    '<li><strong>Suggested Move:</strong> ' + suggestedMove + '</li>' +
    '</ul>' +
    '</div>';

  var contentHtml = '<h2 class="screen-title">Analytics</h2>' +
    '<div class="analytics-dashboard">' +
      '<div class="analytics-dashboard__header">' +
        '<div class="analytics-momentum">' +
          '<span class="chip ' + momentumClass + '">Momentum: ' + momentumLabel + '</span>' +
          '<div class="analytics-subtitle">Weekly Heat Check (Last 7 Days)</div>' +
        '</div>' +
      '</div>' +
      heatCardsHtml +
      '<div class="analytics-money-row">' +
        cashflowHtml +
        debtHtml +
      '</div>' +
      insightsHtml +
    '</div>' +
    '<div class="button-row"><button class="button ghost" data-action="nav-hub">← Back to Hub</button></div>';

  container.innerHTML = renderAmbientLayers("screen-analytics") +
    '<div class="screen-content mascot-clearance">' +
    contentHtml +
    '</div>';
}


function renderRoster(gameState) {
  var container = document.getElementById("screen-roster");
  if (!container) {
    return;
  }

  var performers = gameState.roster.performers || [];
  var contractedPerformers = performers.filter(function(p) { return p.type === "core"; });
  var rosterSize = getContractedRosterCount(gameState);
  var maxRosterSize = getRecruitmentMaxRosterSize(gameState);

  // Performer grid
  var performerCardsHtml = contractedPerformers.map(function(p) {
    var status = isPerformerBookable(gameState, p);
    var statusClass = status.ok ? 'performer-card__status--available' : 'performer-card__status--unavailable';
    var statusText = status.ok ? 'Available' : status.reason;
    var portraitPath = getPerformerPortraitPath(p);
    var contractSummary = getContractSummary(gameState, p.id);
    var availSummary = getAvailabilitySummary(gameState, p);
    var divaLabelText = getDivaFeeLabelForPerformer(p);
    var divaFeeExplanation = getDivaFeeExplanationForPerformer(p);
    var renewalButtonHtml = "";
    if (contractSummary.isExpired) {
      var baseRenewalCost = getRenewalCostByType(p.type);
      var divaRenewalFee = getDivaRenewalFeeForPerformer(p);
      var renewalLabel = divaRenewalFee > 0
        ? 'Renew (' + formatCurrency(baseRenewalCost) + ' + Diva Fee ' + formatCurrency(divaRenewalFee) + ')'
        : 'Renew (' + formatCurrency(baseRenewalCost) + ')';
      renewalButtonHtml = '<div class="button-row" style="margin-top:6px;">' +
        '<button class="button small secondary" data-action="renew-contract" data-id="' + p.id + '">' + renewalLabel + '</button>' +
      '</div>';
    }

    return '<div class="performer-card">' +
      '<img class="performer-card__portrait" src="' + portraitPath + '" alt="' + p.name + '">' +
      '<div class="performer-card__info">' +
        '<div class="performer-card__name">' + p.name + '</div>' +
        '<div class="performer-card__type">' + getPerformerTypeLabel(p.type) + '</div>' +
        '<div class="performer-card__stats">' +
          '<span class="performer-card__stat">⭐ <span class="performer-card__stat-value">' + p.starPower + '</span></span>' +
          '<span class="performer-card__stat">😓 <span class="performer-card__stat-value">' + p.fatigue + '</span></span>' +
          '<span class="performer-card__stat" title="Loyalty — keep her booked or she gets expensive.">❤️ <span class="performer-card__stat-value">' + p.loyalty + '</span></span>' +
        '</div>' +
        (divaFeeExplanation ? '<div class="diva-fee-note" style="margin-top:4px;">⚠ ' + divaFeeExplanation + '</div>' : (divaLabelText ? '<div class="diva-fee-note" style="margin-top:4px;">⚠ ' + divaLabelText + ' Active</div>' : '')) +
        '<div style="font-size:10px;color:var(--text-muted);margin-top:4px;">' + contractSummary.label + '</div>' +
        '<div style="font-size:10px;color:var(--text-muted);">' + availSummary.label + '</div>' +
        '<div class="performer-card__status ' + statusClass + '">' + statusText + '</div>' +
        renewalButtonHtml +
      '</div>' +
    '</div>';
  }).join('');

  if (!performerCardsHtml) {
    performerCardsHtml = '<div class="empty-state"><div class="empty-state__icon">👤</div><div class="empty-state__title">No Performers</div><div class="empty-state__description">Recruit performers to build your roster.</div></div>';
  }

  // Recruitment panel
  var isRosterFull = maxRosterSize > 0 && rosterSize >= maxRosterSize;
  var rosterSummaryHtml = '<div class="helper-text" style="margin-bottom:var(--gap-sm);">Roster: ' + rosterSize + ' / ' + maxRosterSize + '</div>';
  var activeCandidate = getActiveRecruitCandidate(gameState);
  var recruitmentHeader = '<div class="stat-row"><span class="stat-row__label">Reputation</span><span class="stat-row__value">' + gameState.player.reputation + '</span></div>' +
    '<div class="stat-row"><span class="stat-row__label">Roster Size</span><span class="stat-row__value">' + rosterSize + ' / ' + maxRosterSize + '</span></div>';
  var recruitmentHtml = '';
  if (isRosterFull) {
    recruitmentHtml = '<div class="panel">' +
      '<div class="screen-content"><h3 class="panel-title">Recruitment</h3>' + recruitmentHeader +
      '<p style="color:var(--text-muted);font-size:12px;">Roster full. Upgrade your lease to expand the cap.</p></div></div>';
  } else if (!activeCandidate) {
    recruitmentHtml = '<div class="panel">' +
      '<div class="screen-content"><h3 class="panel-title">Recruitment</h3>' + recruitmentHeader +
      '<p style="color:var(--text-muted);font-size:12px;">No recruits available. Increase reputation to attract talent.</p></div></div>';
  } else {
    var performer = CONFIG.performers.catalog[activeCandidate.performerId];
    var name = performer ? performer.name : "Unknown";
    var portraitPath = performer ? getPerformerPortraitPath(performer) : '';
    var starPower = performer && Number.isFinite(performer.starPower) ? performer.starPower : '?';
    var dailyCap = performer ? getPerformerDailyBookingCap(performer) : '?';
    var repRequired = Number.isFinite(activeCandidate.repRequired) ? activeCandidate.repRequired : 0;
    var hireCost = Number.isFinite(activeCandidate.hireCost) ? activeCandidate.hireCost : 0;
    var pitchTitle = activeCandidate.pitchTitle ? activeCandidate.pitchTitle : "";
    var pitchText = activeCandidate.pitchText ? activeCandidate.pitchText : "";
    var pitchBullets = Array.isArray(activeCandidate.pitchBullets) ? activeCandidate.pitchBullets.filter(Boolean) : [];
    var pitchBulletsHtml = pitchBullets.length
      ? '<ul class="recruit-bullets">' + pitchBullets.map(function(bullet) {
        return '<li>' + bullet + '</li>';
      }).join('') + '</ul>'
      : '';
    var pitchHtml = (pitchTitle ? '<div class="recruit-pitch"><strong>' + pitchTitle + '</strong></div>' : '') +
      (pitchText ? '<div class="recruit-pitch">' + pitchText + '</div>' : '') +
      pitchBulletsHtml;
    recruitmentHtml = '<div class="panel">' +
      '<div class="screen-content"><h3 class="panel-title">🔥 Available Recruit</h3>' + recruitmentHeader +
        '<div class="performer-card performer-card--compact" style="margin-top:var(--gap-sm);">' +
          '<img class="performer-card__portrait" src="' + portraitPath + '" alt="' + name + '">' +
          '<div class="performer-card__info">' +
            '<div class="performer-card__name">' + name + '</div>' +
            '<div class="performer-card__stats">' +
              '<span class="performer-card__stat">⭐ <span class="performer-card__stat-value">' + starPower + '</span></span>' +
              '<span class="performer-card__stat">🎯 <span class="performer-card__stat-value">' + dailyCap + '</span></span>' +
            '</div>' +
            '<div style="font-size:10px;color:var(--text-muted);margin-top:4px;">Rep Required: ' + repRequired + '</div>' +
            '<div style="font-size:10px;color:var(--text-muted);">Hire Cost: ' + formatCurrency(hireCost) + '</div>' +
            pitchHtml +
            '<div class="button-row" style="margin-top:6px;">' +
              '<button class="button small primary" data-action="open-meet-recruit" data-id="' + activeCandidate.performerId + '">Meet</button>' +
              '<button class="button small" data-action="recruit-decline" data-id="' + activeCandidate.performerId + '">Decline</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div></div>';
  }

  // Expired contracts
  var expiredContracts = contractedPerformers.filter(function(p) {
    var c = getContractState(gameState, p.id);
    return c && (c.status === "expired" || c.daysRemaining <= 0);
  });
  var expiredContractsHtml = "";
  if (expiredContracts.length > 0) {
    var expiredItemsHtml = expiredContracts.map(function(p) {
      var baseRenewalCost = getRenewalCostByType(p.type);
      var divaRenewalFee = getDivaRenewalFeeForPerformer(p);
      var renewalLabel = divaRenewalFee > 0
        ? 'Renew (' + formatCurrency(baseRenewalCost) + ' + Diva Fee ' + formatCurrency(divaRenewalFee) + ')'
        : 'Renew (' + formatCurrency(baseRenewalCost) + ')';
      return '<div class="post-item"><div class="post-item__info"><div class="post-item__title">' + p.name + '</div><div class="post-item__meta">Expired</div></div>' +
        '<button class="button small secondary" data-action="renew-contract" data-id="' + p.id + '">' + renewalLabel + '</button>' +
        '</div>';
    }).join('');
    expiredContractsHtml = '<div class="panel"><h3 class="panel-title">🔥 Expired Contracts</h3>' + expiredItemsHtml + '</div>';
  }

  // Contract renewals
  var renewalsHtml = '';
  var expiringSoon = contractedPerformers.filter(function(p) {
    var contract = getContractState(gameState, p.id);
    return contract && contract.daysRemaining > 0 && contract.daysRemaining <= 7;
  });
  if (expiringSoon.length > 0) {
    var renewalItemsHtml = expiringSoon.map(function(p) {
      var contract = getContractState(gameState, p.id);
      var baseRenewalCost = getRenewalCostByType(p.type);
      var divaRenewalFee = getDivaRenewalFeeForPerformer(p);
      var divaFeeExplanation = getDivaFeeExplanationForPerformer(p);
      var renewalLabel = divaRenewalFee > 0
        ? 'Renew (' + formatCurrency(baseRenewalCost) + ' + Diva Fee ' + formatCurrency(divaRenewalFee) + ')'
        : 'Renew (' + formatCurrency(baseRenewalCost) + ')';
      return '<div class="post-item"><div class="post-item__info"><div class="post-item__title">' + p.name + '</div><div class="post-item__meta">' + contract.daysRemaining + ' days remaining</div></div>' +
        '<div style="display:flex;flex-direction:column;align-items:flex-end;gap:4px;">' +
          '<button class="button small secondary" data-action="renew-contract" data-id="' + p.id + '">' + renewalLabel + '</button>' +
          (divaFeeExplanation ? '<div class="diva-fee-note">⚠ ' + divaFeeExplanation + '</div>' : '') +
        '</div></div>';
    }).join('');
    renewalsHtml = '<div class="panel"><h3 class="panel-title">⚠️ Expiring Contracts</h3>' + renewalItemsHtml + '</div>';
  }

  // Layout
  var contentHtml = '<h2 class="screen-title">Roster</h2>' +
    rosterSummaryHtml +
    '<div class="roster-layout">' +
      '<div class="roster-grid">' + performerCardsHtml + '</div>' +
      '<div class="roster-sidebar">' + recruitmentHtml + expiredContractsHtml + renewalsHtml + '</div>' +
    '</div>' +
    '<div class="button-row"><button class="button ghost" data-action="nav-hub">← Back to Hub</button></div>';

  container.innerHTML = renderAmbientLayers("screen-roster") +
    '<div class="screen-content no-mascot-clearance">' +
    contentHtml +
    '</div>';
}



function renderSocial(gameState) {
  var container = document.getElementById("screen-social");
  if (!container) {
    return;
  }

  var uiState = getUiState();
  var entries = gameState.content.entries || [];
  var promoEntries = entries.filter(function(e) { return e.contentType === 'Promo'; });

  // Get posts
  var posts = gameState.social.posts || [];

  // Available to post (promo content not fully posted)
  var availableToPost = promoEntries.filter(function(entry) {
    var postedPlatforms = posts.filter(function(p) { return p.contentId === entry.id; }).map(function(p) { return p.platform; });
    return postedPlatforms.length < 2; // Assuming 2 platforms
  }).slice(0, 5);

  var availableListHtml = availableToPost.map(function(entry) {
    var postedPlatforms = posts.filter(function(p) { return p.contentId === entry.id; }).map(function(p) { return p.platform; });
    var canPostIG = postedPlatforms.indexOf('Instagram') === -1;
    var canPostX = postedPlatforms.indexOf('X') === -1;
    var isSelected = entry.id === uiState.social.selectedContentId;

    return '<div class="post-item" data-action="select-social-content" data-id="' + entry.id + '">' +
      '<div class="post-item__info">' +
        '<div class="post-item__title">' + (entry.title || 'Promo #' + entry.id) + '</div>' +
        '<div class="post-item__meta">Day ' + entry.dayCreated + '</div>' +
      '</div>' +
      '<div style="display:flex;gap:4px;align-items:center;">' +
        (canPostIG ? '<span class="tag">IG</span>' : '<span class="tag tag--success">IG ✓</span>') +
        (canPostX ? '<span class="tag">X</span>' : '<span class="tag tag--success">X ✓</span>') +
        (isSelected ? '<span class="tag tag--accent">Selected</span>' : '') +
      '</div>' +
    '</div>';
  }).join('');

  if (!availableListHtml) {
    availableListHtml = '<div class="empty-state" style="padding:var(--gap-md);"><div class="empty-state__description">No promo content available to post.</div></div>';
  }

  var selectedEntry = uiState.social.selectedContentId
    ? promoEntries.find(function(entry) { return entry.id === uiState.social.selectedContentId; })
    : null;
  var canPost = Boolean(selectedEntry);
  var hasPostedInstagram = selectedEntry ? hasPosted(gameState, selectedEntry.id, 'Instagram') : false;
  var hasPostedX = selectedEntry ? hasPosted(gameState, selectedEntry.id, 'X') : false;

  // Recent posts
  var recentPosts = posts.slice().reverse().slice(0, 5);
  var recentPostsHtml = recentPosts.map(function(post) {
    var entry = entries.find(function(e) { return e.id === post.contentId; });
    var title = 'Content #' + post.contentId;
    if (entry) {
      var entryTitle = entry.title ? entry.title.trim() : '';
      if (entryTitle) {
        title = entryTitle;
      } else if (entry.contentType === 'Promo') {
        title = 'Promo #' + post.contentId;
      }
    }
    return '<div class="post-item" data-action="view-shoot-photos" data-id="' + post.contentId + '" data-origin="social">' +
      '<div class="post-item__info">' +
        '<div class="post-item__title">' + title + '</div>' +
        '<div class="post-item__meta">' + post.platform + ' • Day ' + post.dayPosted + '</div>' +
      '</div>' +
      '<span class="tag tag--success">Posted</span>' +
    '</div>';
  }).join('');

  if (!recentPostsHtml) {
    recentPostsHtml = '<div class="empty-state" style="padding:var(--gap-md);"><div class="empty-state__description">No posts yet.</div></div>';
  }

  // Social stats
  var statsHtml = '<div class="panel"><h3 class="panel-title">Social Stats</h3>' +
    '<div class="stat-row"><span class="stat-row__label">Followers</span><span class="stat-row__value">' + gameState.player.socialFollowers.toLocaleString() + '</span></div>' +
    '<div class="stat-row"><span class="stat-row__label">Subscribers</span><span class="stat-row__value">' + gameState.player.socialSubscribers.toLocaleString() + '</span></div>' +
    '<div class="stat-row"><span class="stat-row__label">OF Pipeline</span><span class="stat-row__value">' + (gameState.player.onlyFansSubCarry * 100).toFixed(0) + '%</span></div>' +
  '</div>';

  // Layout
  var contentHtml = '<h2 class="screen-title">Social</h2>' +
    '<div class="social-layout">' +
      '<div class="social-panel">' +
        '<div class="panel" style="flex:1;display:flex;flex-direction:column;">' +
          '<h3 class="panel-title">Available to Post</h3>' +
          '<div class="social-panel__content">' + availableListHtml + '</div>' +
          '<div class="button-row" style="margin-top:var(--gap-sm);">' +
            '<button class="button small primary" data-action="post-instagram"' + (canPost && !hasPostedInstagram ? '' : ' disabled') + '>Post to IG</button>' +
            '<button class="button small" data-action="post-x"' + (canPost && !hasPostedX ? '' : ' disabled') + '>Post to X</button>' +
          '</div>' +
        '</div>' +
      '</div>' +
      '<div class="social-panel">' +
        statsHtml +
        '<div class="panel" style="flex:1;display:flex;flex-direction:column;">' +
          '<h3 class="panel-title">Recent Posts</h3>' +
          '<div class="social-panel__content">' + recentPostsHtml + '</div>' +
        '</div>' +
      '</div>' +
    '</div>' +
    '<div class="button-row"><button class="button ghost" data-action="nav-hub">← Back to Hub</button></div>';

  container.innerHTML = renderAmbientLayers("screen-social") +
    '<div class="screen-content mascot-clearance">' +
    contentHtml +
    '</div>';
}


function renderGallery(gameState) {
  var container = document.getElementById("screen-gallery");
  if (!container) {
    return;
  }

  var uiState = getUiState();
  if (!uiState.gallery) {
    uiState.gallery = { selectedContentId: null, mode: "shoots" };
  }
  if (!uiState.gallery.mode) {
    uiState.gallery.mode = "shoots";
  }
  var galleryMode = uiState.gallery.mode === "conquests" ? "conquests" : "shoots";
  var modeToggleHtml = "<div class=\"button-row\">" +
    createButton(
      "Shoots",
      "gallery-mode",
      galleryMode === "shoots" ? "small primary" : "small secondary",
      false,
      "data-mode=\"shoots\""
    ) +
    createButton(
      "Conquests",
      "gallery-mode",
      galleryMode === "conquests" ? "small primary" : "small secondary",
      false,
      "data-mode=\"conquests\""
    ) +
    "</div>";

  if (galleryMode === "conquests") {
    var conquests = gameState.conquests || { unlockedPacks: [] };
    var unlockedPacks = Array.isArray(conquests.unlockedPacks) ? conquests.unlockedPacks.slice() : [];
    unlockedPacks.sort(function (a, b) {
      var dayA = Number.isFinite(a.unlockedDay) ? a.unlockedDay : 0;
      var dayB = Number.isFinite(b.unlockedDay) ? b.unlockedDay : 0;
      return dayB - dayA;
    });
    var packsHtml = "";
    if (!unlockedPacks.length) {
      packsHtml = "<div class=\"empty-state\">" +
        "<div class=\"empty-state__description\">No conquests yet. Make money. Make moves.</div>" +
        "</div>";
    } else {
      packsHtml = unlockedPacks.map(function (pack) {
        var characterConfig = typeof getConquestCharacterConfig === "function"
          ? getConquestCharacterConfig(pack.characterId)
          : null;
        var characterName = characterConfig && characterConfig.name ? characterConfig.name : "Unknown";
        var stageLabel = "Stage " + pack.stageIndex;
        var imageCount = Array.isArray(pack.imagePaths) ? pack.imagePaths.length : 0;
        return "<div class=\"conquest-pack\">" +
          "<div class=\"conquest-pack__text\">" +
          "<div class=\"conquest-pack__title\">" + pack.title + "</div>" +
          "<div class=\"conquest-pack__meta\">" + characterName + " · " + stageLabel + " · " + imageCount + " images</div>" +
          "</div>" +
          createButton("View", "gallery-view-conquest", "small", false, "data-id=\"" + pack.packId + "\"") +
          "</div>";
      }).join("");
    }

    var conquestsHtml = "<div class=\"panel\">" +
      "<h3 class=\"panel-title\">Unlocked Conquests</h3>" +
      packsHtml +
      "</div>";

    var conquestContentHtml = "<h2 class=\"screen-title\">Gallery</h2>" +
      modeToggleHtml +
      conquestsHtml +
      "<div class=\"button-row\"><button class=\"button ghost\" data-action=\"nav-hub\">← Back to Hub</button></div>";

    container.innerHTML = renderAmbientLayers("screen-gallery") +
      "<div class=\"screen-content mascot-clearance\">" +
      conquestContentHtml +
      "</div>";
    return;
  }

  var entries = gameState.content.entries || [];
  var reversedEntries = entries.slice().reverse();
  var selectedEntryId = uiState.gallery.selectedContentId;

  // Content cards
  var contentCardsHtml = reversedEntries.map(function(entry) {
    var performer = getContentEntryPerformerLabel(gameState, entry);
    var isPremium = entry.contentType === 'Premium';
    var typeClass = isPremium ? 'content-card__type--premium' : 'content-card__type--promo';
    var thumbPath = entry.thumbnailPath || CONFIG.LOCATION_PLACEHOLDER_THUMB_PATH;
    var isSelected = entry.id === selectedEntryId;

    return '<div class="content-card' + (isSelected ? ' is-selected' : '') + '" data-action="select-gallery-entry" data-id="' + entry.id + '">' +
      '<img class="content-card__image" src="' + thumbPath + '" alt="' + entry.title + '">' +
      '<div class="content-card__body">' +
        '<div class="content-card__title">' + (entry.title || 'Untitled') + '</div>' +
        '<div class="content-card__meta">' +
          '<span class="content-card__type ' + typeClass + '">' + entry.contentType + '</span>' +
          '<span>' + performer + '</span>' +
        '</div>' +
      '</div>' +
    '</div>';
  }).join('');

  if (!contentCardsHtml) {
    contentCardsHtml = '<div class="empty-state"><div class="empty-state__icon">📷</div><div class="empty-state__title">No Content Yet</div><div class="empty-state__description">Book your first shoot to start building your library.</div><button class="button primary" data-action="nav-booking">Book a Shoot</button></div>';
  }

  var selectedEntry = selectedEntryId
    ? entries.find(function(entry) {
      return entry.id === selectedEntryId;
    })
    : null;

  var detailPanel = '';
  if (selectedEntry) {
    var locationName = getLocationName(selectedEntry.locationId);
    var themeName = getThemeName(selectedEntry.themeId);
    var photoPaths = getEntryPhotoPaths(selectedEntry);
    detailPanel = '<div class="panel"><h3 class="panel-title">Entry Details</h3>' +
      '<div class="stat-row"><span class="stat-row__label">Day Created</span><span class="stat-row__value">' + selectedEntry.dayCreated + '</span></div>' +
      '<div class="stat-row"><span class="stat-row__label">Performer</span><span class="stat-row__value">' + getContentEntryPerformerLabel(gameState, selectedEntry) + '</span></div>' +
      '<div class="stat-row"><span class="stat-row__label">Location</span><span class="stat-row__value">' + locationName + '</span></div>' +
      '<div class="stat-row"><span class="stat-row__label">Theme</span><span class="stat-row__value">' + themeName + '</span></div>' +
      '<div class="stat-row"><span class="stat-row__label">Type</span><span class="stat-row__value">' + selectedEntry.contentType + '</span></div>' +
      '<div class="stat-row"><span class="stat-row__label">Shoot Cost</span><span class="stat-row__value">' + formatCurrency(selectedEntry.shootCost) + '</span></div>' +
      '<div class="button-row">' +
        '<button class="button primary" data-action="view-shoot-photos" data-id="' + selectedEntry.id + '"' + (photoPaths.length ? '' : ' disabled') + '>View Shoot Photos</button>' +
      '</div>' +
    '</div>';
  }

  // Layout
  var contentHtml = '<h2 class="screen-title">Gallery</h2>' +
    modeToggleHtml +
    '<div class="gallery-layout">' +
      '<div class="gallery-grid">' + contentCardsHtml + '</div>' +
      detailPanel +
    '</div>' +
    '<div class="button-row"><button class="button ghost" data-action="nav-hub">← Back to Hub</button></div>';

  container.innerHTML = renderAmbientLayers("screen-gallery") +
    '<div class="screen-content mascot-clearance">' +
    contentHtml +
    '</div>';
}

function getConquestMessageStatusLabel(status) {
  if (status === "accepted") {
    return "Accepted";
  }
  if (status === "dismissed") {
    return "Dismissed";
  }
  return "Unread";
}

function getConquestStage1PortraitPath(characterConfig) {
  if (!characterConfig || !Array.isArray(characterConfig.stages)) {
    return "";
  }
  var stage1 = characterConfig.stages.find(function (stage) {
    return stage && stage.stageIndex === 1;
  });
  return stage1 && stage1.portraitPath ? stage1.portraitPath : "";
}

function handleConquestPortraitError(img) {
  if (!img) {
    return;
  }
  var fallbackStage1 = img.getAttribute("data-fallback-stage1") || "";
  var fallbackPlaceholder = img.getAttribute("data-fallback-placeholder") || "";
  var step = Number(img.getAttribute("data-fallback-step")) || 0;

  if (step === 0 && fallbackStage1) {
    img.setAttribute("data-fallback-step", "1");
    img.src = fallbackStage1;
    return;
  }

  if (step <= 1 && fallbackPlaceholder) {
    img.setAttribute("data-fallback-step", "2");
    img.src = fallbackPlaceholder;
    return;
  }

  img.onerror = null;
}

function renderConquests(gameState) {
  var container = document.getElementById("screen-conquests");
  if (!container) {
    return;
  }
  var config = typeof getConquestsConfig === "function" ? getConquestsConfig() : { enabled: false, characters: {} };
  if (!config.enabled) {
    var disabledBody = "<p class=\"helper-text\">Conquests are currently offline.</p>";
    container.innerHTML = renderAmbientLayers("screen-conquests") +
      "<div class=\"screen-content mascot-clearance\">" +
      createPanel("Conquests", disabledBody, "screen-conquests-title") +
      "</div>";
    return;
  }
  var uiState = getUiState();
  var conquests = gameState.conquests || { inbox: [], unlockedPacks: [], characters: {} };
  var inbox = Array.isArray(conquests.inbox) ? conquests.inbox.slice() : [];
  inbox.sort(function (a, b) {
    var dayA = Number.isFinite(a.createdDay) ? a.createdDay : 0;
    var dayB = Number.isFinite(b.createdDay) ? b.createdDay : 0;
    if (dayA !== dayB) {
      return dayB - dayA;
    }
    var stageA = Number.isFinite(a.stageIndex) ? a.stageIndex : 0;
    var stageB = Number.isFinite(b.stageIndex) ? b.stageIndex : 0;
    return stageA - stageB;
  });
  var selectedMessageId = uiState.conquests ? uiState.conquests.selectedMessageId : null;
  var selectedMessage = inbox.find(function (message) {
    return message && message.id === selectedMessageId;
  }) || inbox[0] || null;
  var selectedMessageIdSafe = selectedMessage ? selectedMessage.id : "";

  var inboxHtml = "";
  if (!inbox.length) {
    inboxHtml = "<p class=\"helper-text\">No messages yet. Upgrade your studio to attract attention.</p>";
  } else {
    inboxHtml = inbox.map(function (message) {
      var characterConfig = typeof getConquestCharacterConfig === "function"
        ? getConquestCharacterConfig(message.characterId)
        : null;
      var stageConfig = typeof getConquestStageConfig === "function"
        ? getConquestStageConfig(characterConfig, message.stageIndex)
        : null;
      var subject = stageConfig && stageConfig.message ? stageConfig.message : "New message";
      var characterName = characterConfig && characterConfig.name ? characterConfig.name : "Unknown";
      var stageLabel = "Stage " + message.stageIndex;
      var statusLabel = getConquestMessageStatusLabel(message.status);
      var classes = ["conquest-message"];
      if (selectedMessageIdSafe === message.id) {
        classes.push("is-selected");
      }
      if (message.status === "unread") {
        classes.push("is-unread");
      }
      if (message.status === "dismissed") {
        classes.push("is-dismissed");
      }
      if (message.status === "accepted") {
        classes.push("is-accepted");
      }
      return "<button class=\"" + classes.join(" ") + "\" type=\"button\" data-action=\"select-conquest-message\" data-id=\"" +
        message.id + "\">" +
        "<div class=\"conquest-message__text\">" +
        "<div class=\"conquest-message__sender\">" + characterName + "</div>" +
        "<div class=\"conquest-message__subject\">" + subject + "</div>" +
        "</div>" +
        "<div class=\"conquest-message__meta\">" +
        "<span class=\"badge\">" + stageLabel + "</span>" +
        "<span class=\"pill\">" + statusLabel + "</span>" +
        "</div>" +
        "</button>";
    }).join("");
  }

  var unlockedPacks = Array.isArray(conquests.unlockedPacks) ? conquests.unlockedPacks : [];
  var packsHtml = "";
  if (!unlockedPacks.length) {
    packsHtml = "<p class=\"helper-text\">No packs unlocked yet.</p>";
  } else {
    packsHtml = unlockedPacks.map(function (pack) {
      var stageLabel = "Stage " + pack.stageIndex;
      return "<div class=\"conquest-pack\">" +
        "<div class=\"conquest-pack__text\">" +
        "<div class=\"conquest-pack__title\">" + pack.title + "</div>" +
        "<div class=\"conquest-pack__meta\">" + stageLabel + "</div>" +
        "</div>" +
        createButton("View", "conquest-view-reward", "small", false, "data-id=\"" + pack.packId + "\"") +
        "</div>";
    }).join("");
  }

  var detailHtml = "<p class=\"helper-text\">Select a message to see the scene.</p>";
  if (selectedMessage) {
    var characterConfig = typeof getConquestCharacterConfig === "function"
      ? getConquestCharacterConfig(selectedMessage.characterId)
      : null;
    var stageConfig = typeof getConquestStageConfig === "function"
      ? getConquestStageConfig(characterConfig, selectedMessage.stageIndex)
      : null;
    var basePortraitPath = characterConfig && characterConfig.portraitPath ? characterConfig.portraitPath : "";
    var stagePortraitPath = stageConfig && stageConfig.portraitPath ? stageConfig.portraitPath : "";
    var stage1PortraitPath = getConquestStage1PortraitPath(characterConfig);
    var placeholderPortraitPath = config.placeholderPortraitPath || "assets/images/mascots/placeholder.svg";
    var portraitPath = stagePortraitPath || stage1PortraitPath || basePortraitPath || placeholderPortraitPath;
    var fallbackStage1 = stage1PortraitPath && stage1PortraitPath !== portraitPath ? stage1PortraitPath : "";
    var fallbackPlaceholder = placeholderPortraitPath && placeholderPortraitPath !== portraitPath ? placeholderPortraitPath : "";
    var portraitFallbackAttr = " data-fallback-stage1=\"" + fallbackStage1 +
      "\" data-fallback-placeholder=\"" + fallbackPlaceholder +
      "\" data-fallback-step=\"0\" onerror=\"handleConquestPortraitError(this)\"";
    var characterName = characterConfig && characterConfig.name ? characterConfig.name : "Unknown";
    var roleLabel = characterConfig && characterConfig.roleLabel ? characterConfig.roleLabel : "";
    var stageLabel = "Stage " + selectedMessage.stageIndex;
    var statusLabel = getConquestMessageStatusLabel(selectedMessage.status);
    var sceneTitle = stageConfig && stageConfig.sceneTitle ? stageConfig.sceneTitle : "New message";
    var sceneBody = stageConfig && stageConfig.sceneBody ? stageConfig.sceneBody : "";
    if (typeof formatSceneText === "function") {
      sceneBody = formatSceneText(sceneBody, gameState);
    }
    var rewardPack = stageConfig && stageConfig.rewardPack ? stageConfig.rewardPack : null;
    var rewardImageCount = rewardPack && Array.isArray(rewardPack.imagePaths) ? rewardPack.imagePaths.length : 0;
    var rewardSummary = rewardPack
      ? "<div class=\"conquest-reward\">" +
        "<div class=\"conquest-reward__title\">" + rewardPack.title + "</div>" +
        "<div class=\"conquest-reward__desc\">" + rewardPack.description + "</div>" +
        "<div class=\"conquest-reward__meta\">" + rewardImageCount + " images</div>" +
        "</div>"
      : "";
    var viewRewardButton = "";
    if (selectedMessage.status === "accepted" && rewardPack) {
      viewRewardButton = createButton("View Reward", "conquest-view-reward", "primary", false, "data-id=\"" + rewardPack.packId + "\"");
    }
    var acceptDisabled = selectedMessage.status === "accepted";
    var dismissDisabled = selectedMessage.status === "accepted";
    detailHtml = "<div class=\"conquest-detail\">" +
      "<div class=\"conquest-detail__portrait\">" +
      (portraitPath ? "<img src=\"" + portraitPath + "\" alt=\"" + characterName + "\"\"" + portraitFallbackAttr + " />" : "") +
      "</div>" +
      "<div class=\"conquest-detail__body\">" +
      "<div class=\"conquest-detail__header\">" +
      "<div>" +
      "<div class=\"conquest-detail__name\">" + characterName + "</div>" +
      (roleLabel ? "<div class=\"conquest-detail__role\">" + roleLabel + "</div>" : "") +
      "</div>" +
      "<div class=\"conquest-detail__badges\">" +
      "<span class=\"badge\">" + stageLabel + "</span>" +
      "<span class=\"pill\">" + statusLabel + "</span>" +
      "</div>" +
      "</div>" +
      "<div class=\"conquest-detail__scene\">" +
      "<h3>" + sceneTitle + "</h3>" +
      "<p>" + sceneBody + "</p>" +
      "</div>" +
      rewardSummary +
      "<div class=\"button-row\">" +
      createButton("Accept", "conquest-accept", "primary", acceptDisabled, "data-id=\"" + selectedMessageIdSafe + "\"") +
      createButton("Close", "conquest-dismiss", "ghost", dismissDisabled, "data-id=\"" + selectedMessageIdSafe + "\"") +
      viewRewardButton +
      "</div>" +
      "</div>" +
      "</div>";
  }

  var contentHtml = "<div class=\"screen-header\">" +
    "<h2 class=\"screen-title\" id=\"screen-conquests-title\">Conquests</h2>" +
    "<p class=\"helper-text\">Messages from power players. Accept to unlock exclusive reward packs.</p>" +
    "</div>" +
    "<div class=\"conquests-layout\">" +
    "<div class=\"conquests-panel\">" +
    "<div class=\"panel\">" +
    "<h3 class=\"panel-title\">Inbox</h3>" +
    "<div class=\"conquest-inbox\">" + inboxHtml + "</div>" +
    "<div class=\"conquest-unlocked\">" +
    "<h4>Unlocked Packs</h4>" +
    packsHtml +
    "</div>" +
    "</div>" +
    "</div>" +
    "<div class=\"conquests-panel\">" +
    "<div class=\"panel\">" +
    "<h3 class=\"panel-title\">Message</h3>" +
    detailHtml +
    "</div>" +
    "</div>" +
    "</div>" +
    "<div class=\"button-row\"><button class=\"button ghost\" data-action=\"nav-hub\">← Back to Hub</button></div>";

  container.innerHTML = renderAmbientLayers("screen-conquests") +
    "<div class=\"screen-content mascot-clearance\">" +
    contentHtml +
    "</div>";
}


function renderSlideshow(gameState) {
  const container = document.getElementById("screen-slideshow");
  if (!container) {
    return;
  }
  const uiState = getUiState();
  const slideshow = uiState.slideshow || { mode: null, id: null, index: 0, origin: null };
  if (!slideshow.mode) {
    const emptyBody = "<p class=\"helper-text\">No slideshow selected.</p>" +
      "<div class=\"button-row\">" + createButton("Back to Hub", "nav-hub") + "</div>";
    const emptyContent = createPanel("Slideshow", emptyBody, "screen-slideshow-title");
    container.innerHTML = renderAmbientLayers("screen-slideshow") +
      "<div class=\"screen-content\">" +
      emptyContent +
      "</div>";
    return;
  }

  if (slideshow.mode === "recruit") {
    const candidate = getRecruitmentCandidateById(slideshow.id);
    const performer = candidate ? CONFIG.performers.catalog[candidate.performerId] : null;
    const name = performer ? performer.name : "Recruit";
    const slides = candidate && Array.isArray(candidate.meetSlides) ? candidate.meetSlides : [];
    const slideCount = slides.length;
    const safeIndex = Math.min(Math.max(0, slideshow.index), Math.max(0, slideCount - 1));
    const slidePath = slideCount ? slides[safeIndex] : CONFIG.SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH;
    const slideNumber = slideCount ? safeIndex + 1 : 0;
    const pitchText = candidate && candidate.pitchText ? candidate.pitchText : "A private audition, tastefully framed.";
    const pitchTitle = candidate && candidate.pitchTitle ? candidate.pitchTitle : "";
    const pitchBullets = candidate && Array.isArray(candidate.pitchBullets) ? candidate.pitchBullets.filter(Boolean) : [];
    const caption = candidate && Array.isArray(candidate.meetCaptions) && candidate.meetCaptions[safeIndex]
      ? candidate.meetCaptions[safeIndex]
      : "";
    const repRequired = candidate && Number.isFinite(candidate.repRequired) ? candidate.repRequired : 0;
    const hireCost = candidate && Number.isFinite(candidate.hireCost) ? candidate.hireCost : 0;
    const rosterSize = getContractedRosterCount(gameState);
    const maxRosterSize = getRecruitmentMaxRosterSize(gameState);
    const rosterFull = maxRosterSize > 0 && rosterSize >= maxRosterSize;
    const canHire = !rosterFull && gameState.player.cash >= hireCost && gameState.player.reputation >= repRequired;
    const nextButton = safeIndex < slideCount - 1
      ? "<div class=\"button-row\">" + createButton("Next", "recruit-next-slide", "primary") + "</div>"
      : "";
    const decisionButtons = "<div class=\"button-row\">" +
      createButton("Hire (" + formatCurrency(hireCost) + ")", "recruit-hire", "primary", !canHire,
        "data-id=\"" + (candidate ? candidate.performerId : "") + "\"") +
      createButton("Decline", "recruit-decline", "", false, "data-id=\"" + (candidate ? candidate.performerId : "") + "\"") +
      "</div>";
    const imageHtml = "<div class=\"slideshow-image-container\">" +
      "<img class=\"slideshow-image\" src=\"" + slidePath + "\" alt=\"Audition slide " + (safeIndex + 1) + "\" />" +
      "</div>";
    const captionHtml = caption ? "<div class=\"slideshow-caption\">" + caption + "</div>" : "";
    const controlsHtml = "<div class=\"slideshow-controls\">" +
      "<span class=\"slideshow-counter\">Slide " + slideNumber + " of " + slideCount + "</span>" +
      "</div>";
    const recruitModalConfig = CONFIG.ui && CONFIG.ui.recruitModal ? CONFIG.ui.recruitModal : {};
    const modalMaxHeightVh = Number.isFinite(recruitModalConfig.modalMaxHeightVh) ? recruitModalConfig.modalMaxHeightVh : 80;
    const modalMaxWidthPx = Number.isFinite(recruitModalConfig.modalMaxWidthPx) ? recruitModalConfig.modalMaxWidthPx : 1100;
    const modalMaxWidthVw = Number.isFinite(recruitModalConfig.modalMaxWidthVw) ? recruitModalConfig.modalMaxWidthVw : 92;
    const imageMaxHeightVh = Number.isFinite(recruitModalConfig.imageMaxHeightVh) ? recruitModalConfig.imageMaxHeightVh : 55;
    const modalStyle = "style=\"--recruit-modal-max-height-vh:" + modalMaxHeightVh + "vh;" +
      "--recruit-modal-max-width-px:" + modalMaxWidthPx + "px;" +
      "--recruit-modal-max-width-vw:" + modalMaxWidthVw + "vw;" +
      "--recruit-modal-image-max-height-vh:" + imageMaxHeightVh + "vh;\"";
    const bulletsHtml = pitchBullets.length
      ? "<ul class=\"recruit-bullets\">" + pitchBullets.map(function(bullet) {
        return "<li>" + bullet + "</li>";
      }).join("") + "</ul>"
      : "";
    const headerHtml = "<div class=\"recruit-slideshow-header\">" +
      "<h3 class=\"panel-title\">Private Audition — " + name + "</h3>" +
      (pitchTitle ? "<div class=\"recruit-pitch\"><strong>" + pitchTitle + "</strong></div>" : "") +
      "<p class=\"helper-text\">" + pitchText + "</p>" +
      bulletsHtml +
      "</div>";
    const mediaHtml = "<div class=\"recruit-slideshow-media\">" +
      "<div class=\"slideshow-layout\">" +
      imageHtml +
      captionHtml +
      controlsHtml +
      "</div>" +
      "</div>";
    const footerHtml = "<div class=\"recruit-slideshow-footer\">" +
      nextButton +
      decisionButtons +
      "<div class=\"button-row\">" +
      createButton("Back to Roster", "slideshow-close") +
      "</div>" +
      "</div>";
    const body = "<div class=\"recruit-slideshow-content\">" +
      headerHtml +
      mediaHtml +
      footerHtml +
      "</div>";
    const slideshowHtml = "<div class=\"panel recruit-slideshow-panel\" " + modalStyle + ">" +
      "<h2 class=\"screen-title\" id=\"screen-slideshow-title\">Meet Recruit</h2>" +
      body +
      "</div>";
    container.innerHTML = renderAmbientLayers("screen-slideshow") +
      "<div class=\"screen-content\">" +
      slideshowHtml +
      "</div>";
    return;
  }

  if (slideshow.mode === "shoot") {
    const entry = gameState.content.entries.find(function (contentEntry) {
      return contentEntry.id === slideshow.id;
    }) || null;
    const photos = entry ? getEntryPhotoPaths(entry) : [];
    const slideCount = photos.length;
    const safeIndex = Math.min(Math.max(0, slideshow.index), Math.max(0, slideCount - 1));
    const slidePath = slideCount ? photos[safeIndex] : CONFIG.SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH;
    const slideNumber = slideCount ? safeIndex + 1 : 0;
    const prevDisabled = safeIndex <= 0;
    const nextDisabled = safeIndex >= slideCount - 1;
    const imageHtml = "<div class=\"slideshow-image-container\">" +
      "<img class=\"slideshow-image\" src=\"" + slidePath + "\" alt=\"Shoot photo " + (safeIndex + 1) + "\" />" +
      "</div>";
    const controlsHtml = "<div class=\"slideshow-controls\">" +
      createButton("Prev", "slideshow-prev", "", prevDisabled) +
      createButton("Next", "slideshow-next", "primary", nextDisabled) +
      "<span class=\"slideshow-counter\">Photo " + slideNumber + " of " + slideCount + "</span>" +
      "</div>";
    const body = "<div class=\"panel\">" +
      "<h3 class=\"panel-title\">Shoot Photos</h3>" +
      "<div class=\"slideshow-layout\">" +
      imageHtml +
      controlsHtml +
      "</div>" +
      "<div class=\"button-row\">" +
      createButton("Close", "slideshow-close") +
      "</div>" +
      "</div>";
    const shootHtml = createPanel("Shoot Photos", body, "screen-slideshow-title");
    container.innerHTML = renderAmbientLayers("screen-slideshow") +
      "<div class=\"screen-content\">" +
      shootHtml +
      "</div>";
    return;
  }

  if (slideshow.mode === "conquest") {
    const pack = typeof getConquestPackById === "function"
      ? getConquestPackById(gameState, slideshow.id)
      : null;
    const photos = pack && Array.isArray(pack.imagePaths) ? pack.imagePaths : [];
    const slideCount = photos.length;
    const safeIndex = Math.min(Math.max(0, slideshow.index), Math.max(0, slideCount - 1));
    const slidePath = slideCount ? photos[safeIndex] : CONFIG.SHOOT_OUTPUT_PLACEHOLDER_IMAGE_PATH;
    const slideNumber = slideCount ? safeIndex + 1 : 0;
    const prevDisabled = safeIndex <= 0;
    const nextDisabled = safeIndex >= slideCount - 1;
    const origin = slideshow.origin === "gallery" ? "gallery" : "conquests";
    const backLabel = origin === "gallery" ? "Back to Gallery" : "Back to Conquests";
    const imageHtml = "<div class=\"slideshow-image-container\">" +
      "<img class=\"slideshow-image\" src=\"" + slidePath + "\" alt=\"Conquest reward " + (safeIndex + 1) + "\" />" +
      "</div>";
    const controlsHtml = "<div class=\"slideshow-controls\">" +
      createButton("Prev", "slideshow-prev", "", prevDisabled) +
      createButton("Next", "slideshow-next", "primary", nextDisabled) +
      "<span class=\"slideshow-counter\">Photo " + slideNumber + " of " + slideCount + "</span>" +
      "</div>";
    const backButtonRow = "<div class=\"slideshow-back-row\">" +
      createButton(backLabel, "slideshow-close", "secondary slideshow-back-button") +
      "</div>";
    const body = "<div class=\"panel\">" +
      backButtonRow +
      "<h3 class=\"panel-title\">" + (pack ? pack.title : "Conquest Reward") + "</h3>" +
      "<p class=\"helper-text\">" + (pack ? pack.description : "Unlock a reward pack to view it here.") + "</p>" +
      "<div class=\"slideshow-layout\">" +
      imageHtml +
      controlsHtml +
      "</div>" +
      "</div>";
    const conquestHtml = createPanel(pack ? pack.title : "Conquest Reward", body, "screen-slideshow-title");
    container.innerHTML = renderAmbientLayers("screen-slideshow") +
      "<div class=\"screen-content\">" +
      conquestHtml +
      "</div>";
    return;
  }

  const fallbackBody = "<p class=\"helper-text\">Slideshow unavailable.</p>" +
    "<div class=\"button-row\">" + createButton("Back to Hub", "nav-hub") + "</div>";
  const fallbackHtml = createPanel("Slideshow", fallbackBody, "screen-slideshow-title");
  container.innerHTML = renderAmbientLayers("screen-slideshow") +
    "<div class=\"screen-content\">" +
    fallbackHtml +
    "</div>";
}

function renderStoryLog(gameState) {
  var container = document.getElementById("screen-story-log");
  if (!container) {
    return;
  }

  var entries = Array.isArray(gameState.storyLog) ? gameState.storyLog.slice().reverse() : [];

  var entriesHtml = entries.map(function(entry) {
    var icon = getEventIcon(entry);
    var dayLabel = Number.isFinite(entry.dayNumber) ? 'Day ' + entry.dayNumber : '';
    return '<div class="story-log-item" data-action="view-story-log-entry" data-id="' + entry.id + '">' +
      '<div class="story-log-item__header">' +
        (dayLabel ? '<span class="story-log-item__day">' + dayLabel + '</span>' : '') +
        '<span style="font-size:14px;">' + icon + '</span>' +
        '<span class="story-log-item__title">' + (entry.title || 'Event') + '</span>' +
      '</div>' +
      '<div class="story-log-item__body">' + (entry.body || '') + '</div>' +
    '</div>';
  }).join('');

  if (!entriesHtml) {
    entriesHtml = '<div class="empty-state"><div class="empty-state__icon">📜</div><div class="empty-state__title">No Story Events</div><div class="empty-state__description">Events will appear here as your studio grows.</div></div>';
  }

  var contentHtml = '<h2 class="screen-title">Story Log</h2>' +
    '<div class="story-log-layout">' +
      '<div class="story-log-list">' + entriesHtml + '</div>' +
    '</div>' +
    '<div class="button-row"><button class="button ghost" data-action="nav-hub">← Back to Hub</button></div>';

  container.innerHTML = renderAmbientLayers("screen-story-log") +
    '<div class="screen-content mascot-clearance">' +
    contentHtml +
    '</div>';
}


function renderShop(gameState) {
  var container = document.getElementById("screen-shop");
  if (!container) {
    return;
  }

  var cash = gameState.player.cash;
  var onlyFansSubs = Number.isFinite(gameState.player.onlyFansSubscribers)
    ? gameState.player.onlyFansSubscribers
    : 0;
  var dailyPayout = typeof getDailyOfPayout === "function" ? getDailyOfPayout(gameState) : 0;
  var dailyOverhead = typeof getDailyOverhead === "function" ? getDailyOverhead(gameState) : { amount: 0 };
  var dailyOverheadAmount = Number.isFinite(dailyOverhead.amount) ? dailyOverhead.amount : 0;
  var dailyNet = dailyPayout - dailyOverheadAmount;
  var payoutInactiveNote = onlyFansSubs > 0
    ? ""
    : '<p class="helper-text">OF payouts start once you have subscribers.</p>';
  var leaseConfig = CONFIG.leaseUpgrade && typeof CONFIG.leaseUpgrade === "object"
    ? CONFIG.leaseUpgrade
    : null;
  var leaseStatus = leaseConfig && typeof getLeaseUpgradeStatus === "function"
    ? getLeaseUpgradeStatus(gameState)
    : null;
  var rosterSize = getContractedRosterCount(gameState);
  var rosterCap = getRecruitmentMaxRosterSize(gameState);

  // Location unlocks
  var tier1Unlocked = isLocationTierUnlocked(gameState, "tier1");
  var tier2Unlocked = isLocationTierUnlocked(gameState, "tier2");
  var tier1Cost = CONFIG.locations.tier1UnlockCost || 500;
  var tier2Cost = CONFIG.locations.tier2UnlockCost || 2000;
  var tier2RepReq = CONFIG.locations.tier2ReputationRequirement || 50;
  var canBuyTier1 = !tier1Unlocked && cash >= tier1Cost;
  var canBuyTier2 = !tier2Unlocked && cash >= tier2Cost && gameState.player.reputation >= tier2RepReq;

  var locationCardsHtml = '<div class="shop-card' + (tier1Unlocked ? ' shop-card--owned' : '') + '">' +
    '<div class="shop-card__title">Tier 1 Locations</div>' +
    '<div class="shop-card__description">Unlock Shower and other Tier 1 locations for your shoots.</div>' +
    (tier1Unlocked ?
      '<div class="shop-card__status shop-card__status--owned">✓ Owned</div>' :
      '<div class="shop-card__price">' + formatCurrency(tier1Cost) + '</div><button class="button primary" data-action="buy-tier1-location"' + (canBuyTier1 ? '' : ' disabled') + '>Unlock</button>'
    ) +
  '</div>' +
  '<div class="shop-card' + (tier2Unlocked ? ' shop-card--owned' : (!canBuyTier2 && !tier2Unlocked ? ' shop-card--locked' : '')) + '">' +
    '<div class="shop-card__title">Tier 2 Locations</div>' +
    '<div class="shop-card__description">Unlock Office and premium Tier 2 locations. Requires ' + tier2RepReq + ' reputation.</div>' +
    (tier2Unlocked ?
      '<div class="shop-card__status shop-card__status--owned">✓ Owned</div>' :
      '<div class="shop-card__price">' + formatCurrency(tier2Cost) + '</div>' +
      (gameState.player.reputation < tier2RepReq ? '<div class="shop-card__status shop-card__status--locked">Requires Rep ' + tier2RepReq + '</div>' : '') +
      '<button class="button primary" data-action="unlock-location-tier" data-tier="tier2"' + (canBuyTier2 ? '' : ' disabled') + '>Unlock</button>'
    ) +
    '</div>';

  var leaseCardHtml = "";
  if (leaseConfig && leaseConfig.enabled) {
    var leasePurchased = leaseStatus && leaseStatus.isPurchased;
    var deadlineLabel = leaseStatus && Number.isFinite(leaseStatus.deadlineDay)
      ? "Deadline: Day " + leaseStatus.deadlineDay
      : "Deadline: TBD";
    var latePrice = Number.isFinite(leaseConfig.latePrice) ? leaseConfig.latePrice : 0;
    var windowPrice = Number.isFinite(leaseConfig.windowPrice) ? leaseConfig.windowPrice : 0;
    var overheadDelta = Number.isFinite(leaseConfig.overheadDeltaPerDay) ? leaseConfig.overheadDeltaPerDay : 0;
    var repBonus = Number.isFinite(leaseConfig.repOnPurchase) ? leaseConfig.repOnPurchase : 0;
    var capAfter = Number.isFinite(leaseConfig.rosterCapAfterUpgrade) ? leaseConfig.rosterCapAfterUpgrade : rosterCap;
    var canBuyLease = leaseStatus && leaseStatus.available && Number.isFinite(leaseStatus.price) && cash >= leaseStatus.price;
    var leaseStatusHtml = "";
    if (leasePurchased) {
      leaseStatusHtml = '<div class="shop-card__status shop-card__status--owned">✓ Upgraded</div>' +
        '<div class="helper-text">Overhead +' + formatCurrency(overheadDelta) + '/day • Roster cap ' + capAfter + '</div>';
    } else if (leaseStatus && leaseStatus.isOfferActive) {
      leaseStatusHtml = '<div class="shop-card__price">' + formatCurrency(windowPrice) + '</div>' +
        '<div class="helper-text">' + deadlineLabel + ' • Late price ' + formatCurrency(latePrice) + '</div>' +
        '<button class="button primary" data-action="purchase-lease-upgrade"' + (canBuyLease ? '' : ' disabled') + '>Lock in the Lease</button>';
    } else if (leaseStatus && leaseStatus.isLate) {
      leaseStatusHtml = '<div class="shop-card__price">' + formatCurrency(latePrice) + '</div>' +
        '<div class="helper-text">Window missed. Available anytime.</div>' +
        '<button class="button primary" data-action="purchase-lease-upgrade"' + (canBuyLease ? '' : ' disabled') + '>Buy the Lease</button>';
    } else {
      var unlockDay = Number.isFinite(leaseConfig.shopUnlockAfterDay) ? leaseConfig.shopUnlockAfterDay : leaseConfig.storyTriggerDay;
      leaseStatusHtml = '<div class="shop-card__status shop-card__status--locked">Available Day ' + unlockDay + '</div>' +
        '<div class="helper-text">A glossy lease offer is circling. Keep your cash ready.</div>' +
        '<button class="button primary" data-action="purchase-lease-upgrade" disabled>Locked</button>';
    }
    leaseCardHtml = '<div class="shop-card' + (leasePurchased ? ' shop-card--owned' : '') + '">' +
      '<div class="shop-card__title">Studio Lease Upgrade</div>' +
      '<div class="shop-card__description">Bigger floor, slicker light, and a roster that looks like a real operation. Roster ' +
      rosterSize + '/' + rosterCap + '.</div>' +
      '<div class="helper-text">Impact: +' + formatCurrency(overheadDelta) + '/day overhead • Roster cap ' + rosterCap + '→' +
      capAfter + ' • +' + repBonus + ' Rep</div>' +
      leaseStatusHtml +
      '</div>';
  }

  // Equipment upgrades
  var equipmentOrder = CONFIG.equipment && Array.isArray(CONFIG.equipment.upgradeOrder)
    ? CONFIG.equipment.upgradeOrder
    : [];
  var unlockedEquipmentOrder = equipmentOrder.filter(function(upgradeId) {
    if (typeof isScheduledUnlockAvailable !== "function") {
      return true;
    }
    return isScheduledUnlockAvailable(gameState, "equipment", upgradeId);
  });

  var equipmentCardsHtml = unlockedEquipmentOrder.length
    ? unlockedEquipmentOrder.map(function(upgradeId) {
      var upgrade = CONFIG.equipment.upgrades[upgradeId];
      if (!upgrade) {
        return '';
      }
      var levelKey = getEquipmentLevelKey(upgradeId);
      var currentLevel = levelKey && gameState.equipment && Number.isFinite(gameState.equipment[levelKey])
        ? gameState.equipment[levelKey]
        : 0;
      var maxLevel = Number.isFinite(upgrade.maxLevel) ? upgrade.maxLevel : 0;
      var isMaxed = currentLevel >= maxLevel;
      var nextCost = isMaxed ? null : upgrade.levelCosts[currentLevel];
      var canBuy = nextCost !== null && cash >= nextCost;
      var title = getEquipmentUpgradeLabel(upgradeId);
      return '<div class="shop-card' + (isMaxed ? ' shop-card--owned' : '') + '">' +
        '<div class="shop-card__title">' + title + ' (Level ' + currentLevel + ')</div>' +
        '<div class="shop-card__description">Upgrade to improve shoot performance and growth multipliers.</div>' +
        (isMaxed
          ? '<div class="shop-card__status shop-card__status--owned">✓ Maxed</div>'
          : '<div class="shop-card__price">' + formatCurrency(nextCost) + '</div><button class="button primary" data-action="upgrade-equipment" data-id="' + upgradeId + '"' + (canBuy ? '' : ' disabled') + '>Upgrade to L' + (currentLevel + 1) + '</button>'
        ) +
      '</div>';
    }).join('')
    : '<div class="empty-state"><div class="empty-state__description">No equipment upgrades available.</div></div>';

  var cashflowPanelHtml = '<div class="panel cashflow-panel">' +
    '<h3 class="panel-title">Daily Cashflow</h3>' +
    '<p class="helper-text">Buying upgrades changes your burn and your payouts. Here’s the current snapshot.</p>' +
    '<div class="cashflow-snapshot">' +
      '<div class="cashflow-snapshot__row"><span>OF Payouts</span><span class="cashflow-snapshot__value cashflow-snapshot__value--positive">+' + formatCurrency(dailyPayout) + '/day</span></div>' +
      '<div class="cashflow-snapshot__row"><span>Overhead</span><span class="cashflow-snapshot__value cashflow-snapshot__value--negative">-' + formatCurrency(dailyOverheadAmount) + '/day</span></div>' +
      '<div class="cashflow-snapshot__row cashflow-snapshot__row--total"><span>Net/day</span><span class="cashflow-snapshot__value ' + (dailyNet >= 0 ? 'cashflow-snapshot__value--positive' : 'cashflow-snapshot__value--negative') + '">' + (dailyNet >= 0 ? "+" : "-") + formatCurrency(Math.abs(dailyNet)) + '/day</span></div>' +
    '</div>' +
    payoutInactiveNote +
    '</div>';

  // Layout
  var contentHtml = '<h2 class="screen-title">Shop</h2>' +
    '<div class="shop-layout">' +
      '<div class="panel"><h3 class="panel-title">Locations</h3><div class="shop-grid">' + locationCardsHtml + '</div></div>' +
      (leaseCardHtml ? '<div class="panel"><h3 class="panel-title">Lease Upgrades</h3><div class="shop-grid">' + leaseCardHtml + '</div></div>' : '') +
      '<div class="panel"><h3 class="panel-title">Equipment</h3>' + renderEquipmentMessage() + '<div class="shop-grid">' + equipmentCardsHtml + '</div></div>' +
      cashflowPanelHtml +
    '</div>' +
    renderStatusMessage() +
    '<div class="button-row"><button class="button ghost" data-action="nav-hub">← Back to Hub</button></div>';

  container.innerHTML = renderAmbientLayers("screen-shop") +
    '<div class="screen-content mascot-clearance">' +
    contentHtml +
    '</div>';
}



function getLatestContentEntry(gameState) {
  if (!gameState.content.lastContentId) {
    return null;
  }
  return gameState.content.entries.find(function (entry) {
    return entry.id === gameState.content.lastContentId;
  }) || null;
}

function getPerformerName(gameState, performerId) {
  const performer = gameState.roster.performers.find(function (entry) {
    return entry.id === performerId;
  });
  if (!performer) {
    return "Unknown";
  }
  return getPerformerDisplayProfile(gameState, performer).name;
}

function getContentEntryPerformerLabel(gameState, entry) {
  if (entry && entry.source === "agency_pack") {
    return "Agency Sample Pack";
  }
  const performerIds = typeof getEntryPerformerIds === "function"
    ? getEntryPerformerIds(entry)
    : (entry && entry.performerId ? [entry.performerId] : []);
  return getShootOutputPerformerLabel(gameState, performerIds);
}

function getLocationName(locationId) {
  const location = CONFIG.locations.catalog[locationId];
  return location ? location.name : "Legacy Location";
}

function getThemeById(themeId) {
  if (!themeId) {
    return null;
  }
  if (CONFIG.themes.mvp && CONFIG.themes.mvp.themes && CONFIG.themes.mvp.themes[themeId]) {
    return CONFIG.themes.mvp.themes[themeId];
  }
  if (CONFIG.themes.act2 && CONFIG.themes.act2.themes && CONFIG.themes.act2.themes[themeId]) {
    return CONFIG.themes.act2.themes[themeId];
  }
  return null;
}

function getThemeName(themeId) {
  const theme = getThemeById(themeId);
  return theme ? theme.name : "Unknown Theme";
}

function formatSignedPercent(value) {
  const safeValue = Number.isFinite(value) ? value : 0;
  const sign = safeValue > 0 ? "+" : "";
  return sign + safeValue + "%";
}

function formatThemeEffects(theme) {
  const modifiers = theme && theme.modifiers ? theme.modifiers : {};
  const followersMult = Number.isFinite(modifiers.followersMult) ? modifiers.followersMult : 1;
  const ofSubsMult = Number.isFinite(modifiers.ofSubsMult) ? modifiers.ofSubsMult : 1;
  const followersPct = Math.round((followersMult - 1) * 100);
  const ofSubsPct = Math.round((ofSubsMult - 1) * 100);
  return "Effects: Followers " + formatSignedPercent(followersPct) + ", OF Subs " + formatSignedPercent(ofSubsPct);
}

function getNextActionLabel(gameState) {
  if (!gameState.content.lastContentId) {
    return "Book your first shoot.";
  }
  return "Review the latest content and analytics, then book again.";
}

function getShootOutputThumbnailSizePx() {
  return CONFIG.ui.main_padding_px * 6;
}

function getShootOutputThumbnailRadiusPx() {
  return CONFIG.ui.panel_gap_px / 2;
}

function formatShootOutputTierLabel(tierId) {
  if (tierId === "premium") {
    return "Premium";
  }
  return "Standard";
}

function getShootOutputPerformerLabel(gameState, performerIds) {
  if (!Array.isArray(performerIds) || performerIds.length === 0) {
    return "Unknown";
  }
  const names = performerIds.map(function (performerId) {
    return getPerformerName(gameState, performerId);
  });
  return names.join(", ");
}

function hasPosted(gameState, contentId, platform) {
  if (!contentId || !platform || !gameState || !gameState.social || !Array.isArray(gameState.social.posts)) {
    return false;
  }
  return gameState.social.posts.some(function (post) {
    return post.contentId === contentId && post.platform === platform;
  });
}
