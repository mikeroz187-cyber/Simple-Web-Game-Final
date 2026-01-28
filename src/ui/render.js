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
  var prevCash = typeof getPreviousValue === "function" ? getPreviousValue("header-cash") : undefined;
  var cashChanged = prevCash !== undefined && prevCash !== cash;
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
  var hub = qs("#screen-hub .screen-content") || qs("#screen-hub");
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

  // Stagger entrance animation for hero stats
  var heroMetrics = hub.querySelector(".hero-metrics");
  if (heroMetrics) {
    heroMetrics.classList.add("stagger-enter");
  }
}

function renderBooking(gameState) {
  var screen = qs("#screen-booking .screen-content") || qs("#screen-booking");
  if (!screen) return;

  var uiState = getUiState();
  var bookingMode = uiState.booking.bookingMode || "core";
  var agencyPackUsedToday = Boolean(gameState.player.agencyPackUsedToday);
  var isAgencyPack = bookingMode === "agency_pack";

  // Get performers
  var allPerformers = gameState.roster.performers || [];
  var corePerformers = allPerformers.filter(function(p) { return p.type === "core"; });
  var selectedPerformerId = uiState.booking.performerIdA;
  var selectedPerformer = selectedPerformerId ? corePerformers.find(function(p) { return p.id === selectedPerformerId; }) : null;

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
  var finalCost = adjustedCost.finalCost;

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
    var performerCardsHtml = corePerformers.map(function(p) {
      var isSelected = p.id === selectedPerformerId;
      var status = isPerformerBookable(gameState, p);
      var statusClass = status.ok ? 'performer-card__status--available' : 'performer-card__status--unavailable';
      var statusText = status.ok ? 'Available' : status.reason;
      var portraitPath = getPerformerPortraitPath(p);
      return '<div class="performer-card' + (isSelected ? ' is-selected' : '') + '" data-action="select-performer-a" data-id="' + p.id + '" style="cursor:pointer;">' +
        '<img class="performer-card__portrait" src="' + portraitPath + '" alt="' + p.name + '">' +
        '<div class="performer-card__info">' +
          '<div class="performer-card__name">' + p.name + '</div>' +
          '<div class="performer-card__stats">' +
            '<span class="performer-card__stat">⭐ <span class="performer-card__stat-value">' + p.starPower + '</span></span>' +
            '<span class="performer-card__stat">😓 <span class="performer-card__stat-value">' + p.fatigue + '</span></span>' +
            '<span class="performer-card__stat">❤️ <span class="performer-card__stat-value">' + p.loyalty + '</span></span>' +
          '</div>' +
          '<div class="performer-card__status ' + statusClass + '">' + statusText + '</div>' +
        '</div>' +
      '</div>';
    }).join('');
    performerHtml = '<div class="panel"><h3 class="panel-title">Select Performer</h3>' + performerCardsHtml + '</div>';
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
  var summaryHtml = '<div class="booking-summary">' +
    '<div class="booking-summary__row"><span class="booking-summary__label">Mode</span><span class="booking-summary__value">' + (isAgencyPack ? 'Agency Pack' : 'Core') + '</span></div>' +
    '<div class="booking-summary__row"><span class="booking-summary__label">Performer</span><span class="booking-summary__value">' + (isAgencyPack ? 'Agency' : (selectedPerformer ? selectedPerformer.name : '—')) + '</span></div>' +
    '<div class="booking-summary__row"><span class="booking-summary__label">Location</span><span class="booking-summary__value">' + (selectedLocation ? selectedLocation.name : '—') + '</span></div>' +
    '<div class="booking-summary__row"><span class="booking-summary__label">Theme</span><span class="booking-summary__value">' + (selectedTheme ? selectedTheme.name : '—') + '</span></div>' +
    '<div class="booking-summary__row"><span class="booking-summary__label">Type</span><span class="booking-summary__value">' + (selectedContentType || '—') + '</span></div>' +
    '<div class="divider"></div>' +
    '<div class="booking-summary__row"><span class="booking-summary__label">Total Cost</span><span class="booking-summary__value booking-summary__value--cost">' + formatCurrency(finalCost) + '</span></div>' +
    '<div class="button-row" style="margin-top:var(--gap-md);">' +
      '<button class="button primary" data-action="confirm-shoot"' + (canConfirm ? '' : ' disabled') + ' style="flex:1;">📷 Confirm Shoot</button>' +
    '</div>' +
  '</div>';

  // Assemble layout
  screen.innerHTML = '<h2 class="screen-title">Booking</h2>' +
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
}


function renderContent(gameState) {
  const screen = qs("#screen-content .screen-content") || qs("#screen-content");
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
      "<div style=\"" + locationRowStyle + "\">" +
      "<img src=\"" + locationThumbPath + "\" alt=\"" + locationAlt + "\" width=\"" + locationThumbSize + "\" height=\"" + locationThumbSize + "\" style=\"" + locationThumbStyle + "\" onerror=\"this.onerror=null;this.src='" + locationFallbackPath + "';\" />" +
      "<p><strong>Location:</strong> " + location + "</p>" +
      "</div>" +
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

  const body = contentBody +
    renderStatusMessage() +
    "<div class=\"button-row\">" +
    createButton("View Analytics", "nav-analytics", "primary", !entry) +
    createButton("Back to Hub", "nav-hub") +
    "</div>";
  screen.innerHTML = createPanel("Content", body, "screen-content-title");
}

function renderAnalytics(gameState) {
  var screen = qs("#screen-analytics .screen-content") || qs("#screen-analytics");
  if (!screen) return;

  var player = gameState.player;
  var cash = player.cash;
  var ofSubs = player.onlyFansSubscribers;
  var followers = player.socialFollowers;
  var socialSubs = player.socialSubscribers;
  var reputation = player.reputation;
  var mrr = typeof getMRR === "function" ? getMRR(gameState) : 0;
  var netWorth = typeof getNetWorth === "function" ? getNetWorth(gameState) : cash;
  var dailyPayout = typeof getDailyOfPayout === "function" ? getDailyOfPayout(gameState) : 0;
  var dailyOverhead = typeof getDailyOverhead === "function" ? getDailyOverhead(gameState) : { amount: 0 };

  var contentEntries = gameState.content.entries || [];
  var promoCount = contentEntries.filter(function(e) { return e.contentType === 'Promo'; }).length;
  var premiumCount = contentEntries.filter(function(e) { return e.contentType === 'Premium'; }).length;

  // Top stats grid
  var topStatsHtml = '<div class="analytics-grid">' +
    '<div class="analytics-card"><div class="analytics-card__value analytics-card__value--gold">' + formatCurrency(cash) + '</div><div class="analytics-card__label">Cash</div></div>' +
    '<div class="analytics-card"><div class="analytics-card__value analytics-card__value--pink">' + ofSubs.toLocaleString() + '</div><div class="analytics-card__label">OF Subscribers</div></div>' +
    '<div class="analytics-card"><div class="analytics-card__value analytics-card__value--gold">' + formatCurrency(mrr) + '</div><div class="analytics-card__label">Monthly Revenue</div></div>' +
    '<div class="analytics-card"><div class="analytics-card__value">' + formatCurrency(netWorth) + '</div><div class="analytics-card__label">Net Worth</div></div>' +
  '</div>';

  // Secondary stats
  var secondaryStatsHtml = '<div class="panel"><h3 class="panel-title">Social & Reputation</h3>' +
    '<div class="stat-row"><span class="stat-row__label">Social Followers</span><span class="stat-row__value">' + followers.toLocaleString() + '</span></div>' +
    '<div class="stat-row"><span class="stat-row__label">Social Subscribers</span><span class="stat-row__value">' + socialSubs.toLocaleString() + '</span></div>' +
    '<div class="stat-row"><span class="stat-row__label">Reputation</span><span class="stat-row__value">' + reputation + '</span></div>' +
  '</div>';

  // Cashflow stats
  var dailyNet = dailyPayout - dailyOverhead.amount;
  var cashflowHtml = '<div class="panel"><h3 class="panel-title">Daily Cashflow</h3>' +
    '<div class="stat-row"><span class="stat-row__label">OF Payout</span><span class="stat-row__value stat-row__value--positive">+' + formatCurrency(dailyPayout) + '</span></div>' +
    '<div class="stat-row"><span class="stat-row__label">Overhead</span><span class="stat-row__value stat-row__value--negative">-' + formatCurrency(dailyOverhead.amount) + '</span></div>' +
    '<div class="stat-row"><span class="stat-row__label">Net Daily</span><span class="stat-row__value ' + (dailyNet >= 0 ? 'stat-row__value--positive' : 'stat-row__value--negative') + '">' + (dailyNet >= 0 ? '+' : '') + formatCurrency(dailyNet) + '</span></div>' +
  '</div>';

  // Content stats
  var contentStatsHtml = '<div class="panel"><h3 class="panel-title">Content Library</h3>' +
    '<div class="stat-row"><span class="stat-row__label">Total Shoots</span><span class="stat-row__value">' + contentEntries.length + '</span></div>' +
    '<div class="stat-row"><span class="stat-row__label">Promo Content</span><span class="stat-row__value">' + promoCount + '</span></div>' +
    '<div class="stat-row"><span class="stat-row__label">Premium Content</span><span class="stat-row__value">' + premiumCount + '</span></div>' +
  '</div>';

  // Layout
  screen.innerHTML = '<h2 class="screen-title">Analytics</h2>' +
    '<div class="analytics-layout">' +
      topStatsHtml +
      '<div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:var(--gap-md);">' +
        secondaryStatsHtml +
        cashflowHtml +
        contentStatsHtml +
      '</div>' +
    '</div>' +
    '<div class="button-row"><button class="button ghost" data-action="nav-hub">← Back to Hub</button></div>';
}


function renderRoster(gameState) {
  var screen = qs("#screen-roster .screen-content") || qs("#screen-roster");
  if (!screen) return;

  var performers = gameState.roster.performers || [];
  var contractedPerformers = performers.filter(function(p) { return p.type === "core"; });

  // Performer grid
  var performerCardsHtml = contractedPerformers.map(function(p) {
    var status = isPerformerBookable(gameState, p);
    var statusClass = status.ok ? 'performer-card__status--available' : 'performer-card__status--unavailable';
    var statusText = status.ok ? 'Available' : status.reason;
    var portraitPath = getPerformerPortraitPath(p);
    var contractSummary = getContractSummary(gameState, p.id);
    var availSummary = getAvailabilitySummary(gameState, p);

    return '<div class="performer-card">' +
      '<img class="performer-card__portrait" src="' + portraitPath + '" alt="' + p.name + '">' +
      '<div class="performer-card__info">' +
        '<div class="performer-card__name">' + p.name + '</div>' +
        '<div class="performer-card__type">' + getPerformerTypeLabel(p.type) + '</div>' +
        '<div class="performer-card__stats">' +
          '<span class="performer-card__stat">⭐ <span class="performer-card__stat-value">' + p.starPower + '</span></span>' +
          '<span class="performer-card__stat">😓 <span class="performer-card__stat-value">' + p.fatigue + '</span></span>' +
          '<span class="performer-card__stat">❤️ <span class="performer-card__stat-value">' + p.loyalty + '</span></span>' +
        '</div>' +
        '<div style="font-size:10px;color:var(--text-muted);margin-top:4px;">' + contractSummary.label + '</div>' +
        '<div style="font-size:10px;color:var(--text-muted);">' + availSummary.label + '</div>' +
        '<div class="performer-card__status ' + statusClass + '">' + statusText + '</div>' +
      '</div>' +
    '</div>';
  }).join('');

  if (!performerCardsHtml) {
    performerCardsHtml = '<div class="empty-state"><div class="empty-state__icon">👤</div><div class="empty-state__title">No Performers</div><div class="empty-state__description">Recruit performers to build your roster.</div></div>';
  }

  // Recruitment panel
  var rosterSize = getContractedRosterCount(gameState);
  var maxRosterSize = getRecruitmentMaxRosterSize();
  var isRosterFull = maxRosterSize > 0 && rosterSize >= maxRosterSize;
  var activeCandidate = getActiveRecruitCandidate(gameState);
  var recruitmentHeader = '<div class="stat-row"><span class="stat-row__label">Reputation</span><span class="stat-row__value">' + gameState.player.reputation + '</span></div>' +
    '<div class="stat-row"><span class="stat-row__label">Roster Size</span><span class="stat-row__value">' + rosterSize + ' / ' + maxRosterSize + '</span></div>';
  var recruitmentHtml = '';
  var recruitmentAmbient = '<div class="ambient-layers">' +
    '<div class="ambient-bg placeholder-bg"></div>' +
    '<div class="ambient-mascot mascot-pos-right-center placeholder-mascot ambient-breathe">' +
      '<span>TALENT SCOUT<br>Mascot Zone</span>' +
    '</div>' +
  '</div>';

  if (isRosterFull) {
    recruitmentHtml = '<div class="panel">' + recruitmentAmbient +
      '<div class="screen-content"><h3 class="panel-title">Recruitment</h3>' + recruitmentHeader +
      '<p style="color:var(--text-muted);font-size:12px;">Roster full. Release a contract to recruit more talent.</p></div></div>';
  } else if (!activeCandidate) {
    recruitmentHtml = '<div class="panel">' + recruitmentAmbient +
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
    recruitmentHtml = '<div class="panel">' + recruitmentAmbient +
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
            '<div class="button-row" style="margin-top:6px;">' +
              '<button class="button small primary" data-action="open-meet-recruit" data-id="' + activeCandidate.performerId + '">Meet</button>' +
              '<button class="button small" data-action="recruit-decline" data-id="' + activeCandidate.performerId + '">Decline</button>' +
            '</div>' +
          '</div>' +
        '</div>' +
      '</div></div>';
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
      return '<div class="post-item"><div class="post-item__info"><div class="post-item__title">' + p.name + '</div><div class="post-item__meta">' + contract.daysRemaining + ' days remaining</div></div>' +
        '<button class="button small secondary" data-action="renew-contract" data-id="' + p.id + '">Renew</button></div>';
    }).join('');
    renewalsHtml = '<div class="panel"><h3 class="panel-title">⚠️ Expiring Contracts</h3>' + renewalItemsHtml + '</div>';
  }

  // Layout
  screen.innerHTML = '<h2 class="screen-title">Roster</h2>' +
    '<div class="roster-layout">' +
      '<div class="roster-grid">' + performerCardsHtml + '</div>' +
      '<div class="roster-sidebar">' + recruitmentHtml + renewalsHtml + '</div>' +
    '</div>' +
    '<div class="button-row"><button class="button ghost" data-action="nav-hub">← Back to Hub</button></div>';
}



function renderSocial(gameState) {
  var screen = qs("#screen-social .screen-content") || qs("#screen-social");
  if (!screen) return;

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
    return '<div class="post-item">' +
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
  screen.innerHTML = '<h2 class="screen-title">Social</h2>' +
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
}


function renderGallery(gameState) {
  var screen = qs("#screen-gallery .screen-content") || qs("#screen-gallery");
  if (!screen) return;

  var uiState = getUiState();
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
  screen.innerHTML = '<h2 class="screen-title">Gallery</h2>' +
    '<div class="gallery-layout">' +
      '<div class="gallery-grid">' + contentCardsHtml + '</div>' +
      detailPanel +
    '</div>' +
    '<div class="button-row"><button class="button ghost" data-action="nav-hub">← Back to Hub</button></div>';
}


function renderSlideshow(gameState) {
  const screen = qs("#screen-slideshow .screen-content") || qs("#screen-slideshow");
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
    const imageHtml = "<div class=\"slideshow-image-container\">" +
      "<img class=\"slideshow-image\" src=\"" + slidePath + "\" alt=\"Audition slide " + (safeIndex + 1) + "\" />" +
      "</div>";
    const controlsHtml = "<div class=\"slideshow-controls\">" +
      "<span class=\"slideshow-counter\">Slide " + slideNumber + " of " + slideCount + "</span>" +
      "</div>";
    const body = "<div class=\"panel\">" +
      "<h3 class=\"panel-title\">Private Audition — " + name + "</h3>" +
      "<p class=\"helper-text\">" + pitchText + "</p>" +
      "<div class=\"slideshow-layout\">" +
      imageHtml +
      controlsHtml +
      "</div>" +
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
    screen.innerHTML = createPanel("Shoot Photos", body, "screen-slideshow-title");
    return;
  }

  const fallbackBody = "<p class=\"helper-text\">Slideshow unavailable.</p>" +
    "<div class=\"button-row\">" + createButton("Back to Hub", "nav-hub") + "</div>";
  screen.innerHTML = createPanel("Slideshow", fallbackBody, "screen-slideshow-title");
}

function renderStoryLog(gameState) {
  var screen = qs("#screen-story-log .screen-content") || qs("#screen-story-log");
  if (!screen) return;

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

  screen.innerHTML = '<h2 class="screen-title">Story Log</h2>' +
    '<div class="story-log-layout">' +
      '<div class="story-log-list">' + entriesHtml + '</div>' +
    '</div>' +
    '<div class="button-row"><button class="button ghost" data-action="nav-hub">← Back to Hub</button></div>';
}


function renderShop(gameState) {
  var screen = qs("#screen-shop .screen-content") || qs("#screen-shop");
  if (!screen) return;

  var cash = gameState.player.cash;

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

  // Layout
  screen.innerHTML = '<h2 class="screen-title">Shop</h2>' +
    '<div class="shop-layout">' +
      '<div class="panel"><h3 class="panel-title">Locations</h3><div class="shop-grid">' + locationCardsHtml + '</div></div>' +
      '<div class="panel"><h3 class="panel-title">Equipment</h3>' + renderEquipmentMessage() + '<div class="shop-grid">' + equipmentCardsHtml + '</div></div>' +
    '</div>' +
    renderStatusMessage() +
    '<div class="button-row"><button class="button ghost" data-action="nav-hub">← Back to Hub</button></div>';
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
