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
        selectedContentId: null
      },
      bookingSlideshowIndex: 0,
      slideshow: {
        mode: null,
        id: null,
        index: 0
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
      }
    };
  }
  return window.uiState;
}

function renderHeaderStats(gameState) {
  var container = document.getElementById("header-stats");
  if (!container) {
    return;
  }

  var day = gameState.player.day;
  var cash = gameState.player.cash;
  var debt = gameState.player.debtRemaining;
  var ofSubs = gameState.player.onlyFansSubscribers;
  var rep = gameState.player.reputation;
  var daysLeft = Math.max(0, gameState.player.debtDueDay - day + 1);

  var stats = [
    { label: "Day", value: day, className: "" },
    { label: "Cash", value: formatCurrency(cash), className: "header-stat--gold" },
    { label: "OF Subs", value: ofSubs.toLocaleString(), className: "header-stat--accent" },
    { label: "Debt", value: formatCurrency(debt), className: debt > 0 ? "header-stat--danger" : "" },
    { label: "Days Left", value: daysLeft, className: daysLeft <= 14 ? "header-stat--danger" : "" },
    { label: "Rep", value: rep, className: "" }
  ];

  var html = stats.map(function (stat) {
    return "<div class=\"header-stat " + stat.className + "\">" +
      "<span class=\"header-stat__label\">" + stat.label + "</span>" +
      "<span class=\"header-stat__value\">" + stat.value + "</span>" +
      "</div>";
  }).join("");

  container.innerHTML = html;
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
  var hub = qs("#screen-hub");
  if (!hub) return;

  var player = gameState.player;
  var day = player.day;
  var cash = player.cash;
  var debt = player.debtRemaining;
  var debtDueDay = player.debtDueDay;
  var ofSubs = player.onlyFansSubscribers;
  var followers = player.socialFollowers;
  var socialSubs = player.socialSubscribers;
  var reputation = player.reputation;

  var mrr = typeof getMRR === "function" ? getMRR(gameState) : 0;
  var netWorth = typeof getNetWorth === "function" ? getNetWorth(gameState) : cash;
  var dailyPayout = typeof getDailyOfPayout === "function" ? getDailyOfPayout(gameState) : 0;
  var dailyOverhead = typeof getDailyOverhead === "function" ? getDailyOverhead(gameState) : { amount: 0 };
  var dailyNet = dailyPayout - dailyOverhead.amount;
  var debtEstimate = typeof getDaysToAffordDebtEstimate === "function" ? getDaysToAffordDebtEstimate(gameState) : { days: null };

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
      "<div class=\"hero-stat__sub\">" + (debt > 0 ? "Due Day " + debtDueDay : "PAID OFF") + "</div>" +
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

  // Secondary stats row
  var secondaryStatsHtml = "<div class=\"secondary-stats-row\">" +
    "<div class=\"secondary-stat\"><span>Followers</span><span class=\"secondary-stat__value\">" + followers.toLocaleString() + "</span></div>" +
    "<div class=\"secondary-stat\"><span>Social Subs</span><span class=\"secondary-stat__value\">" + socialSubs.toLocaleString() + "</span></div>" +
    "<div class=\"secondary-stat\"><span>Reputation</span><span class=\"secondary-stat__value\">" + reputation + "</span></div>" +
    "<div class=\"secondary-stat\"><span>Shoots Today</span><span class=\"secondary-stat__value\">" + player.shootsToday + "</span></div>" +
  "</div>";

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
  var canPayDebt = debt > 0 && cash >= debt;
  var autoBookEnabled = gameState.automation && gameState.automation.autoBookEnabled;
  var autoPostEnabled = gameState.automation && gameState.automation.autoPostEnabled;

  var footerHtml = "<div class=\"hub-footer\">" +
    "<div class=\"hub-footer__actions\">" +
      "<button class=\"button vip\" data-action=\"pay-debt\"" + (canPayDebt ? "" : " disabled") + ">👑 Pay Debt (" + formatCurrency(debt) + ")</button>" +
    "</div>" +
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
  hub.innerHTML = "<div class=\"hub-dashboard\">" +
    "<div class=\"hub-dashboard__metrics\">" +
      "<div class=\"panel\" style=\"flex:1;display:flex;flex-direction:column;\">" +
        "<h3 class=\"panel-title\">VIP Dashboard</h3>" +
        heroMetricsHtml +
        secondaryStatsHtml +
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
}

function renderBooking(gameState) {
  const screen = qs("#screen-booking");
  const uiState = getUiState();
  const bookingMode = uiState.booking.bookingMode || "core";
  const agencyPackUsedToday = Boolean(gameState.player.agencyPackUsedToday);
  const isAgencyPack = bookingMode === "agency_pack";
  const allPerformers = gameState.roster.performers;
  const performers = allPerformers.filter(function (performer) {
    return performer.type === "core";
  });
  const hasPerformers = performers.length > 0;
  const portraitSize = getPerformerPortraitSizePx();
  const portraitRadius = getPerformerPortraitRadiusPx();
  const portraitStyle = "width:" + portraitSize + "px;height:" + portraitSize + "px;object-fit:cover;border-radius:" + portraitRadius + "px;border:1px solid var(--panel-border);background:var(--panel-bg);flex-shrink:0;";
  const locationThumbSize = getLocationThumbnailSizePx();
  const locationThumbRadius = getLocationThumbnailRadiusPx();
  const locationThumbStyle = "width:" + locationThumbSize + "px;height:" + locationThumbSize + "px;object-fit:cover;border-radius:" + locationThumbRadius + "px;border:1px solid var(--panel-border);background:var(--panel-bg);flex-shrink:0;";
  const locationRowStyle = "display:flex;gap:" + CONFIG.ui.panel_gap_px + "px;align-items:center;";

  const tier2Ids = Array.isArray(CONFIG.locations.tier2_ids) ? CONFIG.locations.tier2_ids : [];
  const locationIds = CONFIG.locations.tier0_ids
    .concat(CONFIG.locations.tier1_ids)
    .concat(tier2Ids);
  if (uiState.booking.locationId && locationIds.indexOf(uiState.booking.locationId) === -1) {
    uiState.booking.locationId = locationIds.length ? locationIds[0] : null;
  }

  const bookingModeOptions = [
    {
      id: "core",
      label: "Core Performer",
      description: "Book your core roster with full premium upside."
    },
    {
      id: "agency_pack",
      label: "Agency Sample Pack",
      description: "Source a five-image pack matched to the chosen theme and location."
    }
  ];
  const bookingModeRows = bookingModeOptions.map(function (option) {
    const isSelected = option.id === bookingMode;
    const isAgencyOption = option.id === "agency_pack";
    const isDisabled = isAgencyOption && agencyPackUsedToday;
    const lockNote = isDisabled ? " Used today — available tomorrow." : "";
    return "<div class=\"list-item\">" +
      "<button class=\"select-button" + (isSelected ? " is-selected" : "") + "\" data-action=\"select-booking-mode\" data-id=\"" +
      option.id + "\"" + (isDisabled ? " disabled" : "") + ">" +
      option.label + "</button>" +
      "<p class=\"helper-text\">" + option.description + lockNote + "</p>" +
      "</div>";
  }).join("");

  const performerOptions = hasPerformers
    ? performers.map(function (performer) {
      const displayProfile = getPerformerDisplayProfile(gameState, performer);
      const optionLabel = displayProfile.name;
      const selectedA = performer.id === uiState.booking.performerIdA ? " selected" : "";
      return {
        id: performer.id,
        label: optionLabel,
        selectedA: selectedA
      };
    })
    : [];
  const performerOptionsA = performerOptions.map(function (option) {
    return "<option value=\"" + option.id + "\"" + option.selectedA + ">" + option.label + "</option>";
  }).join("");
  const performerSelectA = "<div class=\"field-row\">" +
    "<label class=\"field-label\" for=\"performer-slot-a\">Performer (Required)</label>" +
    "<select id=\"performer-slot-a\" class=\"select-control\" data-action=\"select-performer-a\">" +
    "<option value=\"\"" + (uiState.booking.performerIdA ? "" : " selected") + ">Select performer...</option>" +
    performerOptionsA +
    "</select>" +
    "</div>";

  const selectedPerformerA = uiState.booking.performerIdA
    ? performers.find(function (performer) {
      return performer.id === uiState.booking.performerIdA;
    })
    : null;
  const performerCardStyle = "display:flex;gap:" + CONFIG.ui.panel_gap_px + "px;align-items:center;";
  const performerCards = [selectedPerformerA].filter(Boolean).map(function (performer) {
    const displayProfile = getPerformerDisplayProfile(gameState, performer);
    const typeLabel = getPerformerTypeLabel(performer.type);
    const contractSummary = getContractSummary(gameState, performer.id);
    const availabilitySummary = getAvailabilitySummary(gameState, performer);
    const detail = "Star Power: " + performer.starPower +
      " | Fatigue: " + performer.fatigue + " | Loyalty: " + performer.loyalty +
      " | " + contractSummary.label +
      " | " + availabilitySummary.label;
    const performerStatus = isPerformerBookable(gameState, performer);
    const availabilityNote = performerStatus.ok ? "Available" : "Unavailable — " + performerStatus.reason;
    const portraitPath = getPerformerPortraitPath(performer);
    const portraitAlt = "Portrait of " + displayProfile.name;
    return "<div class=\"panel\" style=\"" + performerCardStyle + "\">" +
      "<img src=\"" + portraitPath + "\" alt=\"" + portraitAlt + "\" width=\"" + portraitSize + "\" height=\"" + portraitSize + "\" style=\"" + portraitStyle + "\" />" +
      "<div>" +
      "<p><strong>" + displayProfile.name + "</strong></p>" +
      "<p class=\"helper-text\">" + typeLabel + "</p>" +
      "<p class=\"helper-text\">" + detail + "</p>" +
      "<p class=\"helper-text\">" + availabilityNote + "</p>" +
      "</div>" +
      "</div>";
  }).join("");
  const performerCardsRow = performerCards
    ? "<div class=\"panel-row\" style=\"display:flex;gap:" + CONFIG.ui.panel_gap_px + "px;flex-wrap:wrap;align-items:flex-start;\">" + performerCards + "</div>"
    : "<p class=\"helper-text\">Select a performer to preview their portrait.</p>";

  const locationRows = locationIds.map(function (locationId) {
    const location = CONFIG.locations.catalog[locationId];
    const isSelected = location.id === uiState.booking.locationId;
    const tier2RepRequirement = Number.isFinite(CONFIG.locations.tier2ReputationRequirement)
      ? CONFIG.locations.tier2ReputationRequirement
      : 0;
    const tier1Locked = location.tier === 1 && !isLocationTierUnlocked(gameState, "tier1");
    const tier2Locked = location.tier === 2 && !isLocationTierUnlocked(gameState, "tier2");
    const tier2RepLocked = location.tier === 2 && gameState.player.reputation < tier2RepRequirement;
    const isLocked = tier1Locked || tier2Locked || tier2RepLocked;
    const label = location.name;
    let lockNote = "";
    if (tier1Locked || tier2Locked) {
      lockNote = "Locked";
    } else if (tier2RepLocked) {
      lockNote = "Requires Rep ≥ " + tier2RepRequirement;
    }
    const detail = "Cost: " + formatCurrency(location.cost) + (lockNote ? " — " + lockNote : "");
    const thumbPath = getLocationThumbnailPath(location);
    const fallbackPath = CONFIG.LOCATION_PLACEHOLDER_THUMB_PATH;
    const thumbAlt = "Thumbnail of " + location.name;
    return "<div class=\"list-item\" style=\"" + locationRowStyle + "\">" +
      "<img src=\"" + thumbPath + "\" alt=\"" + thumbAlt + "\" width=\"" + locationThumbSize + "\" height=\"" + locationThumbSize + "\" style=\"" + locationThumbStyle + "\" onerror=\"this.onerror=null;this.src='" + fallbackPath + "';\" />" +
      "<div>" +
      "<button class=\"select-button" + (isSelected ? " is-selected" : "") + "\" data-action=\"select-location\" data-id=\"" + location.id + "\"" + (isLocked ? " disabled" : "") + ">" + label + "</button>" +
      "<p class=\"helper-text\">" + detail + "</p>" +
      "</div>" +
      "</div>";
  }).join("");

  const themeIds = CONFIG.themes.mvp.theme_ids.concat(CONFIG.themes.act2 ? CONFIG.themes.act2.theme_ids : []);
  if (themeIds.length && uiState.booking.themeId && themeIds.indexOf(uiState.booking.themeId) === -1) {
    uiState.booking.themeId = themeIds[0];
  }
  const themeRows = themeIds.map(function (themeId) {
    const theme = getThemeById(themeId);
    if (!theme) {
      return "";
    }
    const isSelected = theme.id === uiState.booking.themeId;
    const effectsLabel = formatThemeEffects(theme);
    return "<div class=\"list-item\">" +
      "<button class=\"select-button" + (isSelected ? " is-selected" : "") + "\" data-action=\"select-theme\" data-id=\"" + theme.id + "\">" + theme.name + "</button>" +
      "<p class=\"helper-text\">" + theme.description + "</p>" +
      "<p class=\"helper-text\">" + effectsLabel + "</p>" +
      "</div>";
  }).join("");

  const contentTypeRows = CONFIG.content_types.available.map(function (type) {
    const isSelected = type === uiState.booking.contentType;
    return "<button class=\"select-button" + (isSelected ? " is-selected" : "") + "\" data-action=\"select-content-type\" data-id=\"" + type + "\">" + type + "</button>";
  }).join("");

  const performerSelection = isAgencyPack
    ? { ok: true }
    : getBookingPerformerSelection(gameState, {
      performerIdA: uiState.booking.performerIdA
    });
  const performerSelectionOk = performerSelection.ok;
  const selectedLocation = uiState.booking.locationId
    ? CONFIG.locations.catalog[uiState.booking.locationId]
    : null;
  const shootCostResult = isAgencyPack
    ? calculateAgencyPackCost(selectedLocation)
    : calculateShootCost(selectedLocation);
  const comboConfig = getBookingComboConfig();
  const hasCombo = !isAgencyPack && comboConfig.enabled && performerSelectionOk && performerSelection.performerIds.length === 2;
  const costMultiplier = Number.isFinite(comboConfig.costMultiplier) ? comboConfig.costMultiplier : 1;
  const baseShootCost = selectedLocation
    ? (hasCombo ? Math.floor(shootCostResult.value * costMultiplier) : shootCostResult.value)
    : 0;
  const adjustedCost = applyContentTypeCostMultiplier(baseShootCost, uiState.booking.contentType);
  const computedShootCost = adjustedCost.finalCost;
  const shootCostLabel = selectedLocation
    ? formatCurrency(computedShootCost)
    : "Select a location";

  const selectedLocationLocked = selectedLocation
    ? (selectedLocation.tier === 1 && !isLocationTierUnlocked(gameState, "tier1"))
      || (selectedLocation.tier === 2 && !isLocationTierUnlocked(gameState, "tier2"))
      || (selectedLocation.tier === 2 && gameState.player.reputation < (Number.isFinite(CONFIG.locations.tier2ReputationRequirement)
        ? CONFIG.locations.tier2ReputationRequirement
        : 0))
    : false;
  const canConfirm = (isAgencyPack || (hasPerformers && performerSelectionOk)) &&
    uiState.booking.locationId &&
    uiState.booking.themeId &&
    uiState.booking.contentType &&
    shootCostResult.ok &&
    gameState.player.cash >= computedShootCost &&
    !selectedLocationLocked &&
    !(isAgencyPack && agencyPackUsedToday);

  const performerPanel = isAgencyPack
    ? "<div class=\"panel\"><h3 class=\"panel-title\">Agency Sample Pack</h3>" +
      "<p class=\"helper-text\">We source a five-image pack that fits the selected theme and location.</p>" +
      "</div>"
    : "<div class=\"panel\"><h3 class=\"panel-title\">Performers</h3>" +
      performerSelectA +
      performerCardsRow +
      "</div>";

  const body = "<div class=\"panel\"><h3 class=\"panel-title\">Booking Mode</h3>" + bookingModeRows + "</div>" +
    performerPanel +
    "<div class=\"panel\"><h3 class=\"panel-title\">Locations</h3>" + locationRows + "</div>" +
    "<div class=\"panel\"><h3 class=\"panel-title\">Themes</h3>" + themeRows + "</div>" +
    "<div class=\"panel\"><h3 class=\"panel-title\">Content Type</h3><div class=\"button-row\">" + contentTypeRows + "</div></div>" +
    "<div class=\"panel\"><p><strong>Shoot Cost:</strong> " + shootCostLabel + "</p></div>" +
    renderStatusMessage() +
    "<div class=\"button-row\">" +
    createButton("Confirm Shoot", "confirm-shoot", "primary", !canConfirm) +
    createButton("Back to Hub", "nav-hub") +
    "</div>";

  screen.innerHTML = createPanel("Booking", body, "screen-booking-title");
}

function renderContent(gameState) {
  const screen = qs("#screen-content");
  const uiState = getUiState();
  const entry = getLatestContentEntry(gameState);
  const locationThumbSize = getLocationThumbnailSizePx();
  const locationThumbRadius = getLocationThumbnailRadiusPx();
  const locationThumbStyle = "width:" + locationThumbSize + "px;height:" + locationThumbSize + "px;object-fit:cover;border-radius:" + locationThumbRadius + "px;border:1px solid var(--panel-border);background:var(--panel-bg);flex-shrink:0;";
  const locationRowStyle = "display:flex;gap:" + CONFIG.ui.panel_gap_px + "px;align-items:center;";

  let contentBody = "<p class=\"helper-text\">No content yet. Book a shoot first.</p>";
  if (!entry && gameState.content.lastContentId) {
    contentBody = "<p class=\"helper-text\">Content record missing.</p>";
  }
  if (entry) {
    const performer = getContentEntryPerformerLabel(gameState, entry);
    const location = getLocationName(entry.locationId);
    const locationData = CONFIG.locations.catalog[entry.locationId];
    const locationThumbPath = getLocationThumbnailPath(locationData);
    const locationFallbackPath = CONFIG.LOCATION_PLACEHOLDER_THUMB_PATH;
    const locationAlt = "Thumbnail of " + location;
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
    const bundleThumbs = renderBundleThumbs(entry.bundleThumbs);
    const bundlePanel = bundleThumbs
      ? "<p><strong>Sample Pack:</strong></p>" + bundleThumbs
      : "";
    const slideshowPanel = "<div class=\"slideshow-frame\">" +
      "<img class=\"slideshow-image\" src=\"" + slidePath + "\" alt=\"Shoot preview " + (safeIndex + 1) + "\" />" +
      "</div>" +
      "<div class=\"button-row\">" +
      createButton("Prev", "booking-slideshow-prev", "", prevDisabled) +
      createButton("Next", "booking-slideshow-next", "primary", nextDisabled) +
      "<span class=\"helper-text\">" + counterLabel + "</span>" +
      "</div>";
    contentBody = slideshowPanel +
      "<div class=\"panel\">" +
      "<p><strong>Performer:</strong> " + performer + "</p>" +
      "<div style=\"" + locationRowStyle + "\">" +
      "<img src=\"" + locationThumbPath + "\" alt=\"" + locationAlt + "\" width=\"" + locationThumbSize + "\" height=\"" + locationThumbSize + "\" style=\"" + locationThumbStyle + "\" onerror=\"this.onerror=null;this.src='" + locationFallbackPath + "';\" />" +
      "<p><strong>Location:</strong> " + location + "</p>" +
      "</div>" +
      "<p><strong>Theme:</strong> " + theme + "</p>" +
      "<p><strong>Content Type:</strong> " + entry.contentType + "</p>" +
      "<p><strong>Day Created:</strong> " + entry.dayCreated + "</p>" +
      "<p><strong>Shoot Cost:</strong> " + formatCurrency(entry.shootCost) + "</p>" +
      bundlePanel +
      "</div>";
  }

  const body = contentBody +
    renderStatusMessage() +
    "<div class=\"button-row\">" +
    createButton("View Analytics", "nav-analytics", "primary", !entry) +
    createButton("Back to Hub", "nav-hub") +
    "</div>";
  screen.innerHTML = createPanel("Content", body, "screen-content-title");
}

function renderAnalytics(gameState) {
  const screen = qs("#screen-analytics");
  const entry = getLatestContentEntry(gameState);
  const dayNumber = gameState && gameState.player && Number.isFinite(gameState.player.day)
    ? gameState.player.day
    : 0;
  const todaySummary = getWindowedSummary(gameState, 1);
  const competitionConfig = CONFIG.market && CONFIG.market.competition && typeof CONFIG.market.competition === "object"
    ? CONFIG.market.competition
    : {};
  const competitionEnabled = typeof isCompetitionEnabled === "function"
    ? isCompetitionEnabled(competitionConfig, dayNumber, gameState)
    : Boolean(competitionConfig.enabled);
  const activeMarketShift = competitionEnabled && typeof getActiveMarketShift === "function"
    ? getActiveMarketShift(gameState, dayNumber)
    : null;
  const competitionMultipliers = competitionEnabled && typeof getCompetitionMultipliers === "function"
    ? getCompetitionMultipliers(gameState, dayNumber)
    : { promoFollowerMult: 1, premiumOfSubsMult: 1 };
  const ofPipeline = typeof getOfPipeline === "function" ? getOfPipeline(gameState) : null;
  const ofPipelineLine = ofPipeline
    ? "<p><strong>OF Pipeline:</strong> " + ofPipeline.progressText.replace("OF Pipeline: ", "") + "</p>"
    : "";
  const debtEstimateLine = getDebtEstimateLine(gameState);

  const todayTotalsPanel = "<div class=\"panel\">" +
    "<h3 class=\"panel-title\">Today (Day " + dayNumber + ") Totals</h3>" +
    "<p><strong>Net Worth:</strong> " + formatCurrency(getNetWorth(gameState)) + "</p>" +
    debtEstimateLine +
    "<p><strong>MRR Change:</strong> " + formatCurrency(todaySummary.mrrDelta) + "/mo</p>" +
    "<p><strong>Social Followers Gained:</strong> " + todaySummary.socialFollowers + "</p>" +
    "<p><strong>Social Subscribers Gained:</strong> " + todaySummary.socialSubscribers + "</p>" +
    "<p><strong>OnlyFans Subscribers Gained:</strong> " + todaySummary.onlyFansSubscribers + "</p>" +
    ofPipelineLine +
    "<p class=\"helper-text\">Totals for the current in-game day.</p>" +
    "</div>";

  const marketShiftNote = competitionEnabled && activeMarketShift
    ? "<div class=\"panel\"><p class=\"helper-text\">Market shift active: " + activeMarketShift.name +
      " (Promo " + formatCompetitionMultiplier(competitionMultipliers.promoFollowerMult) +
      ", Premium OF subs " + formatCompetitionMultiplier(competitionMultipliers.premiumOfSubsMult) + ").</p></div>"
    : "";

  let latestShootBody = "<p class=\"helper-text\">No shoots yet today.</p>";
  if (!entry && gameState.content.lastContentId) {
    latestShootBody = "<p class=\"helper-text\">Latest shoot record missing.</p>";
  }
  if (entry) {
    const latestOnlyFansSubs = Number.isFinite(entry.results.onlyFansSubscribersGained)
      ? entry.results.onlyFansSubscribersGained
      : 0;
    const latestMrrDelta = getMRRDeltaForSubs(latestOnlyFansSubs);
    let socialBonusLine = "";
    if (entry.contentType === "Premium" && Number.isFinite(entry.results.socialFootprintMult)) {
      const socialPercent = Math.round((entry.results.socialFootprintMult - 1) * 100);
      socialBonusLine = "<p><strong>Social bonus:</strong> +" + socialPercent + "% (followers-based)</p>";
      if (entry.results.socialFootprintDetail) {
        socialBonusLine += "<p class=\"helper-text\">" + entry.results.socialFootprintDetail + "</p>";
      }
    }
    let saturationLine = "";
    if (entry.contentType === "Premium" && Number.isFinite(entry.results.saturationMult)) {
      const saturationLabel = entry.results.saturationTierLabel || "Saturation tier";
      const saturationMult = entry.results.saturationMult.toFixed(2) + "x";
      saturationLine = "<p><strong>Saturation:</strong> " + saturationMult + " (" + saturationLabel + ")</p>";
    }
    latestShootBody = "<p><strong>MRR Change:</strong> " + formatCurrency(latestMrrDelta) + "/mo</p>" +
      "<p><strong>Social Followers Gained:</strong> " + entry.results.socialFollowersGained + "</p>" +
      "<p><strong>Social Subscribers Gained:</strong> " + entry.results.socialSubscribersGained + "</p>" +
      "<p><strong>OnlyFans Subscribers Gained:</strong> " + latestOnlyFansSubs + "</p>" +
      socialBonusLine +
      saturationLine +
      "<p><strong>Feedback:</strong> " + entry.results.feedbackSummary + "</p>";
  }
  const latestShootPanel = "<div class=\"panel\"><h3 class=\"panel-title\">Latest Shoot Results</h3>" +
    latestShootBody + "</div>";
  const analyticsBody = todayTotalsPanel + marketShiftNote + latestShootPanel;

  const rollupWindows = CONFIG.analytics && Array.isArray(CONFIG.analytics.rollupWindowsDays)
    ? CONFIG.analytics.rollupWindowsDays
    : [];
  const rollupRows = rollupWindows.length
    ? rollupWindows.map(function (windowDays) {
      const summary = getWindowedSummary(gameState, windowDays);
      return "<div class=\"list-item\"><p>Last " + summary.windowDays + " days: MRR +" + formatCurrency(summary.mrrDelta) +
        "/mo | Social Followers +" + summary.socialFollowers + " | Social Subs +" + summary.socialSubscribers +
        " | OF Subs +" + summary.onlyFansSubscribers + " | Shoots: Promo " + summary.promoCount +
        " / Premium " + summary.premiumCount + "</p></div>";
    }).join("")
    : "<p class=\"helper-text\">No rollup windows configured.</p>";
  const rollupsPanel = "<div class=\"panel\"><h3 class=\"panel-title\">Rollups</h3>" + rollupRows + "</div>";

  const snapshots = Array.isArray(gameState.analyticsHistory) ? gameState.analyticsHistory.slice(-5).reverse() : [];
  const snapshotRows = snapshots.length
    ? snapshots.map(function (snapshot) {
      const socialFollowers = Number.isFinite(snapshot.socialFollowers) ? snapshot.socialFollowers : 0;
      const socialSubscribers = Number.isFinite(snapshot.socialSubscribers) ? snapshot.socialSubscribers : 0;
      const onlyFansSubscribers = Number.isFinite(snapshot.onlyFansSubscribers) ? snapshot.onlyFansSubscribers : 0;
      const cash = Number.isFinite(snapshot.cash) ? snapshot.cash : 0;
      const mrr = Number.isFinite(snapshot.mrr) ? snapshot.mrr : 0;
      const netWorth = Number.isFinite(snapshot.netWorth) ? snapshot.netWorth : null;
      const netWorthLabel = Number.isFinite(netWorth)
        ? ", Net Worth " + formatCurrency(netWorth)
        : "";
      return "<div class=\"list-item\"><p>Day " + snapshot.dayNumber + " — Social Followers " + socialFollowers +
        ", Social Subs " + socialSubscribers + ", OF Subs " + onlyFansSubscribers +
        ", Cash " + formatCurrency(cash) + ", MRR " + formatCurrency(mrr) + "/mo" +
        netWorthLabel + "</p></div>";
    }).join("")
    : "<p class=\"helper-text\">No snapshots yet.</p>";
  const snapshotsPanel = "<div class=\"panel\"><h3 class=\"panel-title\">Snapshots</h3>" + snapshotRows + "</div>";

  const body = analyticsBody +
    rollupsPanel +
    snapshotsPanel +
    renderStatusMessage() +
    "<div class=\"button-row\">" +
    createButton("Book Next Shoot", "nav-booking", "primary", !entry) +
    createButton("Back to Hub", "nav-hub") +
    "</div>";
  screen.innerHTML = createPanel("Analytics", body, "screen-analytics-title");
}

function renderRoster(gameState) {
  const screen = qs("#screen-roster");
  const performers = gameState.roster && Array.isArray(gameState.roster.performers)
    ? gameState.roster.performers
    : [];
  const portraitSize = getPerformerPortraitSizePx();
  const portraitRadius = getPerformerPortraitRadiusPx();
  const portraitStyle = "width:" + portraitSize + "px;height:" + portraitSize + "px;object-fit:cover;border-radius:" + portraitRadius + "px;border:1px solid var(--panel-border);background:var(--panel-bg);flex-shrink:0;";
  const performerRowStyle = "display:flex;gap:" + CONFIG.ui.panel_gap_px + "px;align-items:center;";
  getUiState();

  const contractedPerformers = performers.filter(function (performer) {
    return performer.type === "core";
  });

  const rosterSize = getContractedRosterCount(gameState);
  const maxRosterSize = getRecruitmentMaxRosterSize();
  const isRosterFull = maxRosterSize > 0 && rosterSize >= maxRosterSize;
  const activeCandidate = getActiveRecruitCandidate(gameState);
  const recruitmentHeader = "<p><strong>Reputation:</strong> " + gameState.player.reputation + "</p>" +
    "<p><strong>Roster Size:</strong> " + rosterSize + " / " + maxRosterSize + "</p>";
  let recruitmentBody = "";
  if (isRosterFull) {
    recruitmentBody = "<p class=\"helper-text\">Roster full.</p>";
  } else if (!activeCandidate) {
    recruitmentBody = "<p class=\"helper-text\">Gain reputation to attract new talent.</p>";
  } else {
    const performer = CONFIG.performers.catalog[activeCandidate.performerId];
    const name = performer ? performer.name : "Unknown";
    const portraitPath = getPerformerPortraitPath(performer);
    const portraitAlt = "Portrait of " + name;
    const starPower = performer && Number.isFinite(performer.starPower) ? performer.starPower : 1;
    const dailyCap = performer ? getPerformerDailyBookingCap(performer) : 1;
    const repRequired = Number.isFinite(activeCandidate.repRequired) ? activeCandidate.repRequired : 0;
    const hireCost = Number.isFinite(activeCandidate.hireCost) ? activeCandidate.hireCost : 0;
    recruitmentBody = "<div class=\"panel\" style=\"" + performerRowStyle + "\">" +
      "<img src=\"" + portraitPath + "\" alt=\"" + portraitAlt + "\" width=\"" + portraitSize + "\" height=\"" +
      portraitSize + "\" style=\"" + portraitStyle + "\" />" +
      "<div>" +
      "<p><strong>" + name + "</strong></p>" +
      "<p>Star Power: " + starPower + "</p>" +
      "<p>Daily Cap: " + dailyCap + "</p>" +
      "<p>Hire Cost: " + formatCurrency(hireCost) + "</p>" +
      "<p>Rep Required: " + repRequired + "</p>" +
      "<div class=\"button-row\">" +
      createButton("Meet", "open-meet-recruit", "primary", false, "data-id=\"" + activeCandidate.performerId + "\"") +
      createButton("Decline", "recruit-decline", "", false, "data-id=\"" + activeCandidate.performerId + "\"") +
      "</div>" +
      "</div>" +
      "</div>";
  }

  const recruitmentSection = "<div class=\"panel\"><h3 class=\"panel-title\">Recruitment</h3>" +
    recruitmentHeader +
    recruitmentBody +
    "</div>";

  const contractedRows = contractedPerformers.length
    ? contractedPerformers.map(function (performer) {
      const performerStatus = isPerformerBookable(gameState, performer);
      const availability = performerStatus.ok ? "Available" : "Unavailable";
      const portraitPath = getPerformerPortraitPath(performer);
      const displayProfile = getPerformerDisplayProfile(gameState, performer);
      const portraitAlt = "Portrait of " + displayProfile.name;
      const contractSummary = getContractSummary(gameState, performer.id);
      const availabilitySummary = getAvailabilitySummary(gameState, performer);
      const renewalCost = getRenewalCostByType(performer.type);
      const renewLabel = Number.isFinite(renewalCost)
        ? "Renew Contract (" + formatCurrency(renewalCost) + ")"
        : "Renew Contract";
      const renewButton = contractSummary.isExpired
        ? "<div class=\"button-row\">" + createButton(renewLabel, "renew-contract", "primary", false, "data-id=\"" + performer.id + "\"") + "</div>"
        : "";
      return "<div class=\"panel\" style=\"" + performerRowStyle + "\">" +
        "<img src=\"" + portraitPath + "\" alt=\"" + portraitAlt + "\" width=\"" + portraitSize + "\" height=\"" + portraitSize + "\" style=\"" + portraitStyle + "\" />" +
        "<div>" +
        "<p><strong>" + displayProfile.name + "</strong> (" + performer.type + ")</p>" +
        "<p>Star Power: " + performer.starPower + "</p>" +
        "<p>Fatigue: " + performer.fatigue + " (" + availability + ")</p>" +
        "<p>Loyalty: " + performer.loyalty + "</p>" +
        "<p>" + contractSummary.label + "</p>" +
        "<p>Availability: " + availabilitySummary.label + "</p>" +
        renewButton +
        "</div>" +
        "</div>";
    }).join("")
    : "<p class=\"helper-text\">No contracted performers available.</p>";

  const contractedSection = "<div class=\"panel\"><h3 class=\"panel-title\">Contracted Talent</h3>" + contractedRows + "</div>";

  const body = recruitmentSection +
    contractedSection +
    renderStatusMessage() +
    "<div class=\"button-row\">" +
    createButton("Back to Hub", "nav-hub") +
    "</div>";
  screen.innerHTML = createPanel("Roster", body, "screen-roster-title");
}

function renderSocial(gameState) {
  const screen = qs("#screen-social");
  const uiState = getUiState();
  const strategies = getSocialStrategies();
  const activeStrategyId = getActiveSocialStrategyId(gameState);
  const manualConfig = getManualSocialStrategyConfig();
  const manualStrategy = gameState.social && gameState.social.manualStrategy
    ? gameState.social.manualStrategy
    : null;
  const lastAppliedDay = manualStrategy && Number.isFinite(manualStrategy.lastAppliedDay)
    ? manualStrategy.lastAppliedDay
    : null;
  const appliedToday = hasAppliedManualSocialStrategyToday(gameState);
  const promoEntries = gameState.content.entries.filter(function (entry) {
    return entry.contentType === "Promo";
  });
  const postedPlatformsByContent = new Map();
  gameState.social.posts.forEach(function (post) {
    if (!postedPlatformsByContent.has(post.contentId)) {
      postedPlatformsByContent.set(post.contentId, new Set());
    }
    postedPlatformsByContent.get(post.contentId).add(post.platform);
  });
  const availablePromoEntries = promoEntries.filter(function (entry) {
    const platforms = postedPlatformsByContent.get(entry.id) || new Set();
    const isFullyPosted = platforms.has("Instagram") && platforms.has("X");
    return !isFullyPosted;
  });

  const strategyList = strategies.length
    ? strategies.map(function (strategy) {
      const isActive = strategy.id === activeStrategyId;
      const activeTag = isActive ? " <span class=\"helper-text\">(Active)</span>" : "";
      const statusLine = isActive ? "<p><strong>Status:</strong> Active</p>" : "";
      const buttonLabel = isActive ? "Active Strategy" : "Select Strategy";
      return "<div class=\"list-item\">" +
        "<div class=\"panel\">" +
        "<p><strong>" + strategy.label + "</strong>" + activeTag + "</p>" +
        "<p class=\"helper-text\">" + strategy.description + "</p>" +
        "<p><strong>Primary Effect:</strong> " + strategy.primaryEffect + "</p>" +
        statusLine +
        "<div class=\"button-row\">" +
        createButton(buttonLabel, "select-social-strategy", isActive ? "is-disabled" : "", isActive, "data-id=\"" + strategy.id + "\"") +
        "</div>" +
        "</div>" +
        "</div>";
    }).join("")
    : "<p class=\"helper-text\">No social strategies available.</p>";

  const strategyPanel = "<div class=\"panel\"><h3 class=\"panel-title\">Social Strategies</h3>" + strategyList + "</div>";

  const manualChannels = manualConfig ? manualConfig.channels : [];
  const manualPreview = getManualSocialStrategyPreview(gameState);
  const manualIssues = getManualSocialStrategyIssues(gameState);
  const manualMaxSpend = manualConfig ? getManualStrategyMaxSpend(gameState) : 0;
  const manualAllocationRows = manualChannels.map(function (channel) {
    const label = getManualStrategyChannelLabel(channel);
    const value = manualStrategy && manualStrategy.allocations && Number.isFinite(manualStrategy.allocations[channel])
      ? manualStrategy.allocations[channel]
      : 0;
    const inputId = "manual-strategy-" + channel;
    return "<div class=\"field-row\">" +
      "<label class=\"field-label\" for=\"" + inputId + "\">" + label + " %</label>" +
      "<input id=\"" + inputId + "\" class=\"select-control\" type=\"number\" min=\"0\" max=\"100\" step=\"1\" value=\"" + value + "\"" +
      " data-action=\"manual-strategy-channel\" data-channel=\"" + channel + "\" />" +
      "</div>";
  }).join("");

  const budgetValue = manualStrategy && Number.isFinite(manualStrategy.dailyBudget)
    ? manualStrategy.dailyBudget
    : 0;
  const totalPct = manualPreview.totalPct || 0;
  const allocationStatus = totalPct === 100
    ? "Allocation total: 100%."
    : "Allocation total: " + totalPct + "% (must be 100%).";
  const previewLine = "Est. Social Followers +" + manualPreview.socialFollowersGained +
    ", Est. Social Subs +" + manualPreview.socialSubscribersGained;
  const issueLines = manualIssues.length
    ? "<p class=\"helper-text\">" + manualIssues.join(" ") + "</p>"
    : "";
  const appliedDayLabel = Number.isFinite(lastAppliedDay) ? lastAppliedDay : "Never";
  const todayLabel = gameState && gameState.player && Number.isFinite(gameState.player.day)
    ? gameState.player.day
    : "?";
  const appliedTransparencyLine = "<p class=\"helper-text\">Last applied day: " + appliedDayLabel +
    " (Today: " + todayLabel + ")</p>";
  const canApplyManual = manualIssues.length === 0;
  const manualApplyLabel = appliedToday ? "Applied — come back tomorrow" : "Apply Strategy";
  const disableManualApply = appliedToday || !canApplyManual;

  const manualPanel = manualConfig
    ? "<div class=\"panel\">" +
      "<h3 class=\"panel-title\">Manual Social Strategy</h3>" +
      "<p class=\"helper-text\">Allocate a daily budget across channels and apply once per day.</p>" +
      "<div class=\"field-row\">" +
      "<label class=\"field-label\" for=\"manual-strategy-budget\">Daily Social Budget</label>" +
      "<input id=\"manual-strategy-budget\" class=\"select-control\" type=\"number\" min=\"" + manualConfig.minSpend + "\" max=\"" + manualMaxSpend + "\" step=\"1\" value=\"" + budgetValue + "\"" +
      " data-action=\"manual-strategy-budget\" />" +
      "</div>" +
      manualAllocationRows +
      "<p class=\"helper-text\">" + allocationStatus + "</p>" +
      "<p class=\"helper-text\">" + previewLine + "</p>" +
      appliedTransparencyLine +
      issueLines +
      "<div class=\"button-row\">" +
      createButton("Auto-normalize", "normalize-manual-strategy") +
      createButton(manualApplyLabel, "apply-manual-strategy", "primary", disableManualApply) +
      "</div>" +
      "</div>"
    : "";

  const recentPosts = gameState.social.posts.length
    ? gameState.social.posts.slice(-5).reverse()
    : [];
  const postsList = recentPosts.length
    ? recentPosts.map(function (post) {
      return "<div class=\"panel\">" +
        "<p><strong>" + post.platform + "</strong> — Day " + post.dayPosted + "</p>" +
        "<p>Social Followers Gained: " + post.socialFollowersGained + "</p>" +
        "<p>Social Subscribers Gained: " + post.socialSubscribersGained + "</p>" +
        "<p>OnlyFans Subscribers Gained: " + post.onlyFansSubscribersGained + "</p>" +
        "</div>";
    }).join("")
    : "<p class=\"helper-text\">No social posts yet.</p>";

  const promoList = availablePromoEntries.length
    ? availablePromoEntries.map(function (entry) {
      const isSelected = entry.id === uiState.social.selectedContentId;
      const performer = getContentEntryPerformerLabel(gameState, entry);
      const theme = getThemeName(entry.themeId);
      const label = "Day " + entry.dayCreated + " — " + performer + " (" + theme + ")";
      return "<div class=\"list-item\">" +
        "<button class=\"select-button" + (isSelected ? " is-selected" : "") + "\" data-action=\"select-social-content\" data-id=\"" + entry.id + "\">" + label + "</button>" +
        "</div>";
    }).join("")
    : "<p class=\"helper-text\">No unposted promo content available.</p>";

  const selectedEntry = uiState.social.selectedContentId
    ? availablePromoEntries.find(function (entry) {
      return entry.id === uiState.social.selectedContentId;
    })
    : null;

  const postedStatus = selectedEntry
    ? "<p><strong>Posted:</strong> " + CONFIG.social_platforms.platforms.map(function (platform) {
      return platform + " " + (hasPosted(gameState, selectedEntry.id, platform) ? "✅" : "❌");
    }).join(" / ") + "</p>"
    : "<p class=\"helper-text\">Select a Promo content entry to see posted status.</p>";

  const canPost = availablePromoEntries.length > 0 && Boolean(uiState.social.selectedContentId);
  const hasPostedInstagram = selectedEntry ? hasPosted(gameState, selectedEntry.id, "Instagram") : false;
  const hasPostedX = selectedEntry ? hasPosted(gameState, selectedEntry.id, "X") : false;
  const socialPipeline = typeof getOfPipeline === "function" ? getOfPipeline(gameState) : null;
  const socialPipelineLine = socialPipeline
    ? "<p class=\"helper-text\">" + socialPipeline.progressText + "</p>"
    : "";

  const body = strategyPanel +
    manualPanel +
    "<div class=\"panel\"><h3 class=\"panel-title\">Recent Posts</h3>" + postsList + "</div>" +
    "<div class=\"panel\"><h3 class=\"panel-title\">Promo Content</h3>" + promoList + "</div>" +
    "<div class=\"panel\"><h3 class=\"panel-title\">Posted Status</h3>" + postedStatus + socialPipelineLine + "</div>" +
    renderStatusMessage() +
    "<div class=\"button-row\">" +
    createButton("Post to Instagram", "post-instagram", "primary", !canPost || hasPostedInstagram) +
    createButton("Post to X", "post-x", "", !canPost || hasPostedX) +
    createButton("Back to Hub", "nav-hub") +
    "</div>";
  screen.innerHTML = createPanel("Social", body, "screen-social-title");
}

function renderGallery(gameState) {
  const screen = qs("#screen-gallery");
  const uiState = getUiState();
  const entries = gameState.content.entries;
  const shootOutputs = Array.isArray(gameState.shootOutputs) ? gameState.shootOutputs : [];
  const outputThumbSize = getShootOutputThumbnailSizePx();
  const outputThumbRadius = getShootOutputThumbnailRadiusPx();
  const outputThumbStyle = "width:" + outputThumbSize + "px;height:" + outputThumbSize + "px;object-fit:cover;border-radius:" + outputThumbRadius + "px;border:1px solid var(--panel-border);background:var(--panel-bg);flex-shrink:0;";
  const outputCardStyle = "display:flex;gap:" + CONFIG.ui.panel_gap_px + "px;align-items:flex-start;";
  const outputMetaStyle = "display:flex;flex-direction:column;gap:" + Math.max(1, Math.round(CONFIG.ui.panel_gap_px / 2)) + "px;";
  const locationThumbSize = getLocationThumbnailSizePx();
  const locationThumbRadius = getLocationThumbnailRadiusPx();
  const locationThumbStyle = "width:" + locationThumbSize + "px;height:" + locationThumbSize + "px;object-fit:cover;border-radius:" + locationThumbRadius + "px;border:1px solid var(--panel-border);background:var(--panel-bg);flex-shrink:0;";
  const locationRowStyle = "display:flex;gap:" + CONFIG.ui.panel_gap_px + "px;align-items:center;";

  const entryList = entries.length
    ? entries.map(function (entry) {
      const isSelected = entry.id === uiState.gallery.selectedContentId;
      const performer = getContentEntryPerformerLabel(gameState, entry);
      const location = getLocationName(entry.locationId);
      const theme = getThemeName(entry.themeId);
      const locationData = CONFIG.locations.catalog[entry.locationId];
      const locationThumbPath = getLocationThumbnailPath(locationData);
      const locationFallbackPath = CONFIG.LOCATION_PLACEHOLDER_THUMB_PATH;
      const locationAlt = "Thumbnail of " + location;
      return "<div class=\"list-item\">" +
        "<div style=\"" + locationRowStyle + "\">" +
        "<img src=\"" + locationThumbPath + "\" alt=\"" + locationAlt + "\" width=\"" + locationThumbSize + "\" height=\"" + locationThumbSize + "\" style=\"" + locationThumbStyle + "\" onerror=\"this.onerror=null;this.src='" + locationFallbackPath + "';\" />" +
        "<button class=\"select-button" + (isSelected ? " is-selected" : "") + "\" data-action=\"select-gallery-entry\" data-id=\"" + entry.id + "\">" +
        "Day " + entry.dayCreated + " — " + performer + " — " + location + " — " + theme + " — " + entry.contentType +
        "</button>" +
        "</div>" +
        "</div>";
    }).join("")
    : "<p class=\"helper-text\">No content yet. Book a shoot first.</p>";

  const selectedEntry = uiState.gallery.selectedContentId
    ? entries.find(function (entry) {
      return entry.id === uiState.gallery.selectedContentId;
    })
    : null;
  const detailBundleThumbs = selectedEntry ? renderBundleThumbs(selectedEntry.bundleThumbs) : "";
  const detailBundlePanel = detailBundleThumbs
    ? "<p><strong>Sample Pack:</strong></p>" + detailBundleThumbs
    : "";
  const detailPhotoPaths = selectedEntry ? getEntryPhotoPaths(selectedEntry) : [];
  const photoButton = selectedEntry
    ? "<div class=\"button-row\">" +
      createButton("View Shoot Photos", "view-shoot-photos", "primary", detailPhotoPaths.length === 0,
        "data-id=\"" + selectedEntry.id + "\"") +
      "</div>"
    : "";

  const detailPanel = selectedEntry
    ? "<div class=\"panel\"><h3 class=\"panel-title\">Entry Details</h3>" +
      "<p><strong>Day:</strong> " + selectedEntry.dayCreated + "</p>" +
      "<p><strong>Performer:</strong> " + getContentEntryPerformerLabel(gameState, selectedEntry) + "</p>" +
      "<div style=\"" + locationRowStyle + "\">" +
      "<img src=\"" + getLocationThumbnailPath(CONFIG.locations.catalog[selectedEntry.locationId]) + "\" alt=\"Thumbnail of " + getLocationName(selectedEntry.locationId) + "\" width=\"" + locationThumbSize + "\" height=\"" + locationThumbSize + "\" style=\"" + locationThumbStyle + "\" onerror=\"this.onerror=null;this.src='" + CONFIG.LOCATION_PLACEHOLDER_THUMB_PATH + "';\" />" +
      "<p><strong>Location:</strong> " + getLocationName(selectedEntry.locationId) + "</p>" +
      "</div>" +
      "<p><strong>Theme:</strong> " + getThemeName(selectedEntry.themeId) + "</p>" +
      "<p><strong>Type:</strong> " + selectedEntry.contentType + "</p>" +
      "<p><strong>Shoot Cost:</strong> " + formatCurrency(selectedEntry.shootCost) + "</p>" +
      detailBundlePanel +
      photoButton +
      "</div>"
    : "";

  const outputCards = shootOutputs.length
    ? shootOutputs.slice().reverse().map(function (output) {
      const thumbPath = output.thumbnailPath || CONFIG.SHOOT_OUTPUT_PLACEHOLDER_THUMB_PATH;
      const fallbackPath = CONFIG.SHOOT_OUTPUT_PLACEHOLDER_THUMB_PATH;
      const performerLabel = output.source === "agency_pack"
        ? "Agency Sample Pack"
        : getShootOutputPerformerLabel(gameState, output.performerIds);
      const tierLabel = formatShootOutputTierLabel(output.tier);
      const dayLabel = Number.isFinite(output.day) ? output.day : "?";
      const socialFollowers = Number.isFinite(output.socialFollowersGained) ? output.socialFollowersGained : 0;
      const onlyFansSubscribers = Number.isFinite(output.onlyFansSubscribersGained) ? output.onlyFansSubscribersGained : 0;
      return "<div class=\"panel\" style=\"" + outputCardStyle + "\">" +
        "<img src=\"" + thumbPath + "\" alt=\"Shoot output thumbnail\" width=\"" + outputThumbSize + "\" height=\"" + outputThumbSize + "\"" +
        " style=\"" + outputThumbStyle + "\" onerror=\"this.onerror=null;this.src='" + fallbackPath + "';\" />" +
        "<div style=\"" + outputMetaStyle + "\">" +
        "<p><strong>Day " + dayLabel + " — " + tierLabel + " Shoot</strong></p>" +
        "<p class=\"helper-text\">Performers: " + performerLabel + "</p>" +
        "<p class=\"helper-text\">Social Followers: " + socialFollowers + " | OF Subs: " + onlyFansSubscribers + "</p>" +
        "</div>" +
        "</div>";
    }).join("")
    : "<p class=\"helper-text\">No content yet. Book a shoot first.</p>";

  const body = "<div class=\"panel\"><h3 class=\"panel-title\">Shoot Outputs</h3>" + outputCards + "</div>" +
    "<div class=\"panel\"><h3 class=\"panel-title\">Content History</h3>" + entryList + "</div>" +
    detailPanel +
    renderStatusMessage() +
    "<div class=\"button-row\">" +
    createButton("Back to Hub", "nav-hub") +
    "</div>";
  screen.innerHTML = createPanel("Gallery", body, "screen-gallery-title");
}

function renderSlideshow(gameState) {
  const screen = qs("#screen-slideshow");
  if (!screen) {
    return;
  }
  const uiState = getUiState();
  const slideshow = uiState.slideshow || { mode: null, id: null, index: 0 };
  if (!slideshow.mode) {
    const emptyBody = "<p class=\"helper-text\">No slideshow selected.</p>" +
      "<div class=\"button-row\">" + createButton("Back to Hub", "nav-hub") + "</div>";
    screen.innerHTML = createPanel("Slideshow", emptyBody, "screen-slideshow-title");
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
    const repRequired = candidate && Number.isFinite(candidate.repRequired) ? candidate.repRequired : 0;
    const hireCost = candidate && Number.isFinite(candidate.hireCost) ? candidate.hireCost : 0;
    const rosterSize = getContractedRosterCount(gameState);
    const maxRosterSize = getRecruitmentMaxRosterSize();
    const rosterFull = maxRosterSize > 0 && rosterSize >= maxRosterSize;
    const canHire = !rosterFull && gameState.player.cash >= hireCost && gameState.player.reputation >= repRequired;
    const nextButton = safeIndex < slideCount - 1
      ? "<div class=\"button-row\">" + createButton("Next", "recruit-next-slide", "primary") + "</div>"
      : "";
    const decisionButtons = safeIndex === slideCount - 1
      ? "<div class=\"button-row\">" +
        createButton("Hire (" + formatCurrency(hireCost) + ")", "recruit-hire", "primary", !canHire,
          "data-id=\"" + (candidate ? candidate.performerId : "") + "\"") +
        createButton("Decline", "recruit-decline", "", false, "data-id=\"" + (candidate ? candidate.performerId : "") + "\"") +
        "</div>"
      : "";
    const body = "<div class=\"panel\">" +
      "<h3 class=\"panel-title\">Private Audition — " + name + "</h3>" +
      "<p class=\"helper-text\">" + pitchText + "</p>" +
      "<div class=\"slideshow-frame\">" +
      "<img class=\"slideshow-image\" src=\"" + slidePath + "\" alt=\"Audition slide " + (safeIndex + 1) + "\" />" +
      "</div>" +
      "<p class=\"helper-text\">Slide " + slideNumber + " of " + slideCount + "</p>" +
      nextButton +
      decisionButtons +
      "<div class=\"button-row\">" +
      createButton("Back to Roster", "slideshow-close") +
      "</div>" +
      "</div>";
    screen.innerHTML = createPanel("Meet Recruit", body, "screen-slideshow-title");
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
    const body = "<div class=\"panel\">" +
      "<h3 class=\"panel-title\">Shoot Photos</h3>" +
      "<div class=\"slideshow-frame\">" +
      "<img class=\"slideshow-image\" src=\"" + slidePath + "\" alt=\"Shoot photo " + (safeIndex + 1) + "\" />" +
      "</div>" +
      "<p class=\"helper-text\">Photo " + slideNumber + " of " + slideCount + "</p>" +
      "<div class=\"button-row\">" +
      createButton("Prev", "slideshow-prev", "", prevDisabled) +
      createButton("Next", "slideshow-next", "primary", nextDisabled) +
      createButton("Close", "slideshow-close") +
      "</div>" +
      "</div>";
    screen.innerHTML = createPanel("Shoot Photos", body, "screen-slideshow-title");
    return;
  }

  const fallbackBody = "<p class=\"helper-text\">Slideshow unavailable.</p>" +
    "<div class=\"button-row\">" + createButton("Back to Hub", "nav-hub") + "</div>";
  screen.innerHTML = createPanel("Slideshow", fallbackBody, "screen-slideshow-title");
}

function renderStoryLog(gameState) {
  const screen = qs("#screen-story-log");
  const entries = Array.isArray(gameState.storyLog) ? gameState.storyLog.slice().reverse() : [];
  const entryList = entries.length
    ? entries.map(function (entry) {
      const dayLabel = Number.isFinite(entry.dayNumber) ? "Day " + entry.dayNumber + " — " : "";
      const title = dayLabel + entry.title;
      const preview = getStoryLogPreview(entry.body);
      return "<div class=\"list-item\">" +
        "<button class=\"select-button\" data-action=\"view-story-log-entry\" data-id=\"" + entry.id + "\">" + title + "</button>" +
        "<p class=\"helper-text\">" + preview + "</p>" +
        "</div>";
    }).join("")
    : "<p class=\"helper-text\">No story events logged yet.</p>";

  const body = "<div class=\"panel\">" +
    "<h3 class=\"panel-title\">Story Log</h3>" +
    "<div class=\"story-log-list\">" + entryList + "</div>" +
    "</div>" +
    renderStatusMessage() +
    "<div class=\"button-row\">" +
    createButton("Back to Hub", "nav-hub") +
    "</div>";

  screen.innerHTML = createPanel("Story Log", body, "screen-story-log-title");
}

function renderShop(gameState) {
  const screen = qs("#screen-shop");
  const cost = Number.isFinite(CONFIG.locations.tier1UnlockCost)
    ? CONFIG.locations.tier1UnlockCost
    : 0;
  const unlocked = isLocationTierUnlocked(gameState, "tier1");
  const canBuy = !unlocked && gameState.player.cash >= cost;
  const tier1Name = CONFIG.locations.tier1Name || "Location Tier 1";
  const tier2Cost = Number.isFinite(CONFIG.locations.tier2UnlockCost)
    ? CONFIG.locations.tier2UnlockCost
    : 0;
  const tier2RepRequirement = Number.isFinite(CONFIG.locations.tier2ReputationRequirement)
    ? CONFIG.locations.tier2ReputationRequirement
    : 0;
  const tier2Unlocked = isLocationTierUnlocked(gameState, "tier2");
  const canBuyTier2 = !tier2Unlocked && gameState.player.cash >= tier2Cost && gameState.player.reputation >= tier2RepRequirement;
  const tier2Name = CONFIG.locations.tier2Name || "Location Tier 2";

  const equipmentOrder = CONFIG.equipment && Array.isArray(CONFIG.equipment.upgradeOrder)
    ? CONFIG.equipment.upgradeOrder
    : [];
  const unlockedEquipmentOrder = equipmentOrder.filter(function (upgradeId) {
    if (typeof isScheduledUnlockAvailable !== "function") {
      return true;
    }
    return isScheduledUnlockAvailable(gameState, "equipment", upgradeId);
  });

  const equipmentRows = unlockedEquipmentOrder.length
    ? unlockedEquipmentOrder.map(function (upgradeId) {
      const upgrade = CONFIG.equipment.upgrades[upgradeId];
      if (!upgrade) {
        return "";
      }
      const levelKey = getEquipmentLevelKey(upgradeId);
      const currentLevel = levelKey && gameState.equipment && Number.isFinite(gameState.equipment[levelKey])
        ? gameState.equipment[levelKey]
        : 0;
      const maxLevel = Number.isFinite(upgrade.maxLevel) ? upgrade.maxLevel : 0;
      const isMaxed = currentLevel >= maxLevel;
      const nextCost = isMaxed ? null : upgrade.levelCosts[currentLevel];
      const costLabel = isMaxed ? "MAX" : formatCurrency(nextCost);

      const buttonClass = "button vip" + (isMaxed ? " is-disabled" : "");
      const buttonLabel = isMaxed ? "Maxed" : "Upgrade";
      const buttonAttributes = isMaxed ? " aria-disabled=\"true\" data-disabled=\"true\"" : "";

      return "<div class=\"list-item\">" +
        "<p><strong>" + getEquipmentUpgradeLabel(upgradeId) + "</strong></p>" +
        "<p class=\"helper-text\">Level " + currentLevel + " / " + maxLevel + "</p>" +
        "<p><strong>Next Cost:</strong> " + costLabel + "</p>" +
        "<div class=\"button-row\">" +
        "<button class=\"" + buttonClass + "\" data-action=\"upgrade-equipment\" data-id=\"" + upgradeId + "\"" +
        buttonAttributes + ">" + buttonLabel + "</button>" +
        "</div>" +
        "</div>";
    }).join("")
    : "<p class=\"helper-text\">No equipment upgrades available.</p>";

  const body = renderStatusMessage() +
    "<div class=\"panel\">" +
    "<h3 class=\"panel-title\">Location Tiers</h3>" +
    "<div class=\"list-item\">" +
    "<p><strong>Tier 0 — Starter Locations</strong></p>" +
    "<p class=\"helper-text\">Status: Unlocked</p>" +
    "</div>" +
    "<div class=\"list-item\">" +
    "<p><strong>" + tier1Name + "</strong></p>" +
    "<p class=\"helper-text\">Cost: " + formatCurrency(cost) + " | Status: " + (unlocked ? "Unlocked" : "Locked") + "</p>" +
    "<div class=\"button-row\">" +
    createButton("Unlock", "unlock-location-tier", "vip", !canBuy, "data-tier=\"tier1\"") +
    "</div>" +
    "</div>" +
    "<div class=\"list-item\">" +
    "<p><strong>" + tier2Name + "</strong></p>" +
    "<p class=\"helper-text\">Cost: " + formatCurrency(tier2Cost) + " | Rep ≥ " + tier2RepRequirement +
    " | Status: " + (tier2Unlocked ? "Unlocked" : "Locked") + "</p>" +
    "<div class=\"button-row\">" +
    createButton("Unlock", "unlock-location-tier", "vip", !canBuyTier2, "data-tier=\"tier2\"") +
    "</div>" +
    "</div>" +
    "</div>" +
    "<div class=\"panel\">" +
    "<h3 class=\"panel-title\">Equipment Upgrades</h3>" +
    renderEquipmentMessage() +
    equipmentRows +
    "</div>" +
    "<div class=\"button-row\">" +
    createButton("Back to Hub", "nav-hub") +
    "</div>";
  screen.innerHTML = createPanel("Shop", body, "screen-shop-title");
}

function getLatestContentEntry(gameState) {
  if (!gameState.content.lastContentId) {
    return null;
  }
  return gameState.content.entries.find(function (entry) {
    return entry.id === gameState.content.lastContentId;
  }) || null;
}

function getBundleThumbSizePx() {
  return CONFIG.ui.main_padding_px * 3;
}

function renderBundleThumbs(bundleThumbs) {
  if (!Array.isArray(bundleThumbs) || bundleThumbs.length === 0) {
    return "";
  }
  const thumbSize = getBundleThumbSizePx();
  const thumbRadius = Math.round(CONFIG.ui.panel_gap_px / 2);
  const thumbStyle = "width:" + thumbSize + "px;height:" + thumbSize + "px;object-fit:cover;border-radius:" +
    thumbRadius + "px;border:1px solid var(--panel-border);background:var(--panel-bg);";
  const thumbs = bundleThumbs.map(function (thumbPath) {
    const resolvedPath = thumbPath || CONFIG.SHOOT_OUTPUT_PLACEHOLDER_THUMB_PATH;
    const fallbackPath = CONFIG.SHOOT_OUTPUT_PLACEHOLDER_THUMB_PATH;
    return "<img src=\"" + resolvedPath + "\" alt=\"Sample pack thumbnail\" width=\"" + thumbSize + "\" height=\"" + thumbSize +
      "\" style=\"" + thumbStyle + "\" onerror=\"this.onerror=null;this.src='" + fallbackPath + "';\" />";
  }).join("");
  return "<div class=\"bundle-thumbs\">" + thumbs + "</div>";
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
