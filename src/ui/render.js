function getUiState() {
  if (!window.uiState) {
    window.uiState = {
      message: "",
      booking: {
        performerId: null,
        locationId: null,
        themeId: null,
        contentType: null
      },
      social: {
        selectedContentId: null
      },
      gallery: {
        selectedContentId: null
      },
      shop: {
        equipmentMessage: ""
      },
      save: {
        selectedSlotId: CONFIG.save.default_slot_id
      }
    };
  }
  return window.uiState;
}

function renderApp(gameState) {
  getUiState();
  renderHub(gameState);
  renderBooking(gameState);
  renderContent(gameState);
  renderAnalytics(gameState);
  renderRoster(gameState);
  renderSocial(gameState);
  renderGallery(gameState);
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

function getPerformerRoleLabel(gameState, performerId) {
  const roster = gameState && gameState.roster ? gameState.roster : {};
  const roleMap = roster.performerRoles || {};
  const roleId = roleMap[performerId];
  const labels = CONFIG.performers.role_labels || {};
  if (roleId && labels[roleId]) {
    return labels[roleId];
  }
  if (labels.support) {
    return labels.support;
  }
  return "Support";
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
  const availability = getAvailabilityState(gameState, performerId);
  const restDaysRemaining = availability && Number.isFinite(availability.restDaysRemaining)
    ? availability.restDaysRemaining
    : 0;
  const consecutiveBookings = availability && Number.isFinite(availability.consecutiveBookings)
    ? availability.consecutiveBookings
    : 0;
  const maxConsecutive = Number.isFinite(CONFIG.performerManagement.maxConsecutiveBookings)
    ? CONFIG.performerManagement.maxConsecutiveBookings
    : 0;
  return {
    restDaysRemaining: restDaysRemaining,
    consecutiveBookings: consecutiveBookings,
    maxConsecutive: maxConsecutive,
    label: (restDaysRemaining > 0 ? "Rest: " + restDaysRemaining + " day(s) | " : "") +
      "Streak: " + consecutiveBookings + " / " + maxConsecutive
  };
}

function renderHub(gameState) {
  const hub = qs("#screen-hub");
  const hasContent = Boolean(gameState.content.lastContentId);
  const hasPromo = gameState.content.entries.some(function (entry) {
    return entry.contentType === "Promo";
  });
  const daysLeft = Math.max(0, gameState.player.debtDueDay - gameState.player.day + 1);
  const nextAction = getNextActionLabel(gameState);

  const statusHtml = [
    "<p><strong>Day:</strong> " + gameState.player.day + "</p>",
    "<p><strong>Days Left:</strong> " + daysLeft + "</p>",
    "<p><strong>Shoots Today:</strong> " + gameState.player.shootsToday + " / " + CONFIG.game.shoots_per_day + "</p>",
    "<p><strong>Cash:</strong> " + formatCurrency(gameState.player.cash) + "</p>",
    "<p><strong>Debt Remaining:</strong> " + formatCurrency(gameState.player.debtRemaining) + " (Due Day " + gameState.player.debtDueDay + ")</p>",
    "<p><strong>Followers:</strong> " + gameState.player.followers + "</p>",
    "<p><strong>Subscribers:</strong> " + gameState.player.subscribers + "</p>",
    "<p><strong>Reputation:</strong> " + gameState.player.reputation + "</p>",
    "<p><strong>Next Action:</strong> " + nextAction + "</p>"
  ].join("");

  const navButtons = [
    createButton("Booking", "nav-booking", "primary"),
    createButton("Analytics", "nav-analytics", "", !hasContent),
    createButton("Social", "nav-social", "", !hasPromo),
    createButton("Gallery", "nav-gallery"),
    createButton("Story Log", "nav-story-log"),
    createButton("Roster", "nav-roster"),
    createButton("Shop", "nav-shop")
  ].join("");

  const uiState = getUiState();
  const activeSlotId = uiState.save.selectedSlotId || CONFIG.save.default_slot_id;
  const slotOptions = CONFIG.save.slots.map(function (slot) {
    const selectedAttr = slot.id === activeSlotId ? " selected" : "";
    return "<option value=\"" + slot.id + "\"" + selectedAttr + ">" + slot.label + "</option>";
  }).join("");
  const saveSlotControl = "<div class=\"panel\">" +
    "<h3 class=\"panel-title\">Save Slot</h3>" +
    "<div class=\"field-row\">" +
    "<label class=\"field-label\" for=\"save-slot-select\">Active Slot</label>" +
    "<select id=\"save-slot-select\" class=\"select-control\" data-action=\"select-save-slot\">" +
    slotOptions +
    "</select>" +
    "</div>" +
    "<p class=\"helper-text\">Save Now and Load Save use the selected slot. Autosave writes to the Autosave slot.</p>" +
    "</div>";

  const autoBookCount = CONFIG.AUTOMATION_AUTO_BOOK_PER_DAY;
  const autoBookEnabled = Boolean(gameState.automation && gameState.automation.autoBookEnabled);
  const autoBookChecked = autoBookEnabled ? " checked" : "";
  const autoBookLabel = "Automation: Auto-Book (" + autoBookCount + "/day)";
  const autoBookUnit = autoBookCount === 1 ? "shoot" : "shoots";
  const automationPanel = "<div class=\"panel\">" +
    "<h3 class=\"panel-title\">Automation</h3>" +
    "<div class=\"field-row\">" +
    "<label class=\"field-label\" for=\"auto-book-toggle\">" + autoBookLabel + "</label>" +
    "<input id=\"auto-book-toggle\" class=\"checkbox-control\" type=\"checkbox\" data-action=\"toggle-auto-book\"" + autoBookChecked + " />" +
    "</div>" +
    "<p class=\"helper-text\">When enabled, the studio tries to book " + autoBookCount + " " + autoBookUnit + " automatically each day (only when you click Advance Day).</p>" +
    "</div>";

  const advanceDayButton = "<button class=\"button\" data-action=\"advance-day\" title=\"Manually advance to the next day.\">Advance Day</button>";
  const saveButtons = [
    createButton("Save Now", "save-now"),
    createButton("Load Save", "load-save"),
    createButton("Export Save", "export-save"),
    createButton("Import Save", "import-save"),
    advanceDayButton
  ].join("");

  const canPayDebt = gameState.player.debtRemaining > 0 && gameState.player.cash >= gameState.player.debtRemaining;
  const debtButtonRow = "<div class=\"button-row\">" + createButton("Pay Debt", "pay-debt", "primary", !canPayDebt) + "</div>";

  hub.innerHTML = "<h2 id=\"screen-hub-title\" class=\"screen-title\">Hub</h2>" +
    "<div class=\"panel\">" + statusHtml + "</div>" +
    debtButtonRow +
    "<div class=\"button-row\">" + navButtons + "</div>" +
    renderStatusMessage() +
    automationPanel +
    saveSlotControl +
    "<div class=\"button-row\">" + saveButtons + "</div>";
}

function renderBooking(gameState) {
  const screen = qs("#screen-booking");
  const uiState = getUiState();
  const performers = gameState.roster.performers;
  const hasPerformers = performers.length > 0;
  const portraitSize = getPerformerPortraitSizePx();
  const portraitRadius = getPerformerPortraitRadiusPx();
  const portraitStyle = "width:" + portraitSize + "px;height:" + portraitSize + "px;object-fit:cover;border-radius:" + portraitRadius + "px;border:1px solid var(--panel-border);background:var(--panel-bg);flex-shrink:0;";
  const performerRowStyle = "display:flex;gap:" + CONFIG.ui.panel_gap_px + "px;align-items:center;";
  const locationThumbSize = getLocationThumbnailSizePx();
  const locationThumbRadius = getLocationThumbnailRadiusPx();
  const locationThumbStyle = "width:" + locationThumbSize + "px;height:" + locationThumbSize + "px;object-fit:cover;border-radius:" + locationThumbRadius + "px;border:1px solid var(--panel-border);background:var(--panel-bg);flex-shrink:0;";
  const locationRowStyle = "display:flex;gap:" + CONFIG.ui.panel_gap_px + "px;align-items:center;";

  const performerRows = hasPerformers
    ? performers.map(function (performer) {
      const isSelected = performer.id === uiState.booking.performerId;
      const performerStatus = isPerformerBookable(gameState, performer);
      const available = performerStatus.ok;
      const label = performer.name + " (" + performer.type + ")";
      const roleLabel = getPerformerRoleLabel(gameState, performer.id);
      const contractSummary = getContractSummary(gameState, performer.id);
      const availabilitySummary = getAvailabilitySummary(gameState, performer.id);
      const detail = "Role: " + roleLabel + " | Star Power: " + performer.starPower +
        " | Fatigue: " + performer.fatigue + " | Loyalty: " + performer.loyalty +
        " | " + contractSummary.label +
        " | " + availabilitySummary.label;
      const portraitPath = getPerformerPortraitPath(performer);
      const portraitAlt = "Portrait of " + performer.name;
      const availabilityNote = available ? "Available" : "Unavailable — " + performerStatus.reason;
      return "<div class=\"list-item\" style=\"" + performerRowStyle + "\">" +
        "<img src=\"" + portraitPath + "\" alt=\"" + portraitAlt + "\" width=\"" + portraitSize + "\" height=\"" + portraitSize + "\" style=\"" + portraitStyle + "\" />" +
        "<div>" +
        "<button class=\"select-button" + (isSelected ? " is-selected" : "") + "\" data-action=\"select-performer\" data-id=\"" + performer.id + "\"" + (available ? "" : " disabled") + ">" + label + "</button>" +
        "<p class=\"helper-text\">" + detail + "</p>" +
        "<p class=\"helper-text\">" + availabilityNote + "</p>" +
        "</div>" +
        "</div>";
    }).join("")
    : "<p class=\"helper-text\">No performers available.</p>";

  const tier2Ids = Array.isArray(CONFIG.locations.tier2_ids) ? CONFIG.locations.tier2_ids : [];
  const locations = CONFIG.locations.tier0_ids
    .concat(CONFIG.locations.tier1_ids)
    .concat(tier2Ids);
  const locationRows = locations.map(function (locationId) {
    const location = CONFIG.locations.catalog[locationId];
    const isSelected = location.id === uiState.booking.locationId;
    const tier2RepRequirement = Number.isFinite(CONFIG.locations.tier2ReputationRequirement)
      ? CONFIG.locations.tier2ReputationRequirement
      : 0;
    const tier1Locked = location.tier === 1 && !isLocationTierUnlocked(gameState, "tier1");
    const tier2Locked = location.tier === 2 && !isLocationTierUnlocked(gameState, "tier2");
    const tier2RepLocked = location.tier === 2 && gameState.player.reputation < tier2RepRequirement;
    const isLocked = tier1Locked || tier2Locked || tier2RepLocked;
    const label = location.name + " (Tier " + location.tier + ")";
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
  const themeRows = themeIds.map(function (themeId) {
    const theme = getThemeById(themeId);
    if (!theme) {
      return "";
    }
    const isSelected = theme.id === uiState.booking.themeId;
    return "<div class=\"list-item\">" +
      "<button class=\"select-button" + (isSelected ? " is-selected" : "") + "\" data-action=\"select-theme\" data-id=\"" + theme.id + "\">" + theme.name + "</button>" +
      "<p class=\"helper-text\">" + theme.description + "</p>" +
      "</div>";
  }).join("");

  const contentTypeRows = CONFIG.content_types.available.map(function (type) {
    const isSelected = type === uiState.booking.contentType;
    return "<button class=\"select-button" + (isSelected ? " is-selected" : "") + "\" data-action=\"select-content-type\" data-id=\"" + type + "\">" + type + "</button>";
  }).join("");

  const selectedPerformer = uiState.booking.performerId
    ? performers.find(function (performer) {
      return performer.id === uiState.booking.performerId;
    })
    : null;
  const performerAvailable = selectedPerformer ? isPerformerBookable(gameState, selectedPerformer).ok : false;
  const selectedLocation = uiState.booking.locationId
    ? CONFIG.locations.catalog[uiState.booking.locationId]
    : null;
  const shootCostResult = calculateShootCost(selectedLocation);
  const shootCostLabel = selectedLocation
    ? formatCurrency(shootCostResult.value)
    : "Select a location";

  const selectedLocationLocked = selectedLocation
    ? (selectedLocation.tier === 1 && !isLocationTierUnlocked(gameState, "tier1"))
      || (selectedLocation.tier === 2 && !isLocationTierUnlocked(gameState, "tier2"))
      || (selectedLocation.tier === 2 && gameState.player.reputation < (Number.isFinite(CONFIG.locations.tier2ReputationRequirement)
        ? CONFIG.locations.tier2ReputationRequirement
        : 0))
    : false;
  const canConfirm = hasPerformers && uiState.booking.performerId && uiState.booking.locationId && uiState.booking.themeId && uiState.booking.contentType && shootCostResult.ok && gameState.player.cash >= shootCostResult.value && performerAvailable && !selectedLocationLocked;

  const body = "<div class=\"panel\"><h3 class=\"panel-title\">Performers</h3>" + performerRows + "</div>" +
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
    const performer = getPerformerName(gameState, entry.performerId);
    const location = getLocationName(entry.locationId);
    const locationData = CONFIG.locations.catalog[entry.locationId];
    const locationThumbPath = getLocationThumbnailPath(locationData);
    const locationFallbackPath = CONFIG.LOCATION_PLACEHOLDER_THUMB_PATH;
    const locationAlt = "Thumbnail of " + location;
    const theme = getThemeName(entry.themeId);
    contentBody = "<div class=\"content-placeholder\">Content preview placeholder</div>" +
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

  let analyticsBody = "<p class=\"helper-text\">No analytics yet. Book a shoot first.</p>";
  if (!entry && gameState.content.lastContentId) {
    analyticsBody = "<p class=\"helper-text\">Latest analytics record missing.</p>";
  }
  if (entry) {
    analyticsBody = "<div class=\"panel\">" +
      "<p><strong>Revenue Gained:</strong> " + formatCurrency(entry.results.revenue) + "</p>" +
      "<p><strong>Followers Gained:</strong> " + entry.results.followersGained + "</p>" +
      "<p><strong>Subscribers Gained:</strong> " + entry.results.subscribersGained + "</p>" +
      "<p><strong>Feedback:</strong> " + entry.results.feedbackSummary + "</p>" +
      "</div>";
  }

  const rollupWindows = CONFIG.analytics && Array.isArray(CONFIG.analytics.rollupWindowsDays)
    ? CONFIG.analytics.rollupWindowsDays
    : [];
  const rollupRows = rollupWindows.length
    ? rollupWindows.map(function (windowDays) {
      const summary = getWindowedSummary(gameState, windowDays);
      return "<div class=\"list-item\"><p>Last " + summary.windowDays + " days: Revenue " + formatCurrency(summary.revenue) +
        " | Followers +" + summary.followers + " | Subs +" + summary.subscribers +
        " | Shoots: Promo " + summary.promoCount + " / Premium " + summary.premiumCount + "</p></div>";
    }).join("")
    : "<p class=\"helper-text\">No rollup windows configured.</p>";
  const rollupsPanel = "<div class=\"panel\"><h3 class=\"panel-title\">Rollups</h3>" + rollupRows + "</div>";

  const snapshots = Array.isArray(gameState.analyticsHistory) ? gameState.analyticsHistory.slice(-5).reverse() : [];
  const snapshotRows = snapshots.length
    ? snapshots.map(function (snapshot) {
      const followers = Number.isFinite(snapshot.followers) ? snapshot.followers : 0;
      const subscribers = Number.isFinite(snapshot.subscribers) ? snapshot.subscribers : 0;
      const cash = Number.isFinite(snapshot.cash) ? snapshot.cash : 0;
      const lifetimeRevenue = Number.isFinite(snapshot.lifetimeRevenue) ? snapshot.lifetimeRevenue : 0;
      return "<div class=\"list-item\"><p>Day " + snapshot.dayNumber + " — Followers " + followers +
        ", Subs " + subscribers + ", Cash " + formatCurrency(cash) +
        ", Lifetime Revenue " + formatCurrency(lifetimeRevenue) + "</p></div>";
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
  const performers = gameState.roster.performers;
  const portraitSize = getPerformerPortraitSizePx();
  const portraitRadius = getPerformerPortraitRadiusPx();
  const portraitStyle = "width:" + portraitSize + "px;height:" + portraitSize + "px;object-fit:cover;border-radius:" + portraitRadius + "px;border:1px solid var(--panel-border);background:var(--panel-bg);flex-shrink:0;";
  const performerRowStyle = "display:flex;gap:" + CONFIG.ui.panel_gap_px + "px;align-items:center;";

  const rosterBody = performers.length
    ? performers.map(function (performer) {
      const performerStatus = isPerformerBookable(gameState, performer);
      const availability = performerStatus.ok ? "Available" : "Unavailable";
      const portraitPath = getPerformerPortraitPath(performer);
      const portraitAlt = "Portrait of " + performer.name;
      const roleLabel = getPerformerRoleLabel(gameState, performer.id);
      const contractSummary = getContractSummary(gameState, performer.id);
      const availabilitySummary = getAvailabilitySummary(gameState, performer.id);
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
        "<p><strong>" + performer.name + "</strong> (" + performer.type + ")</p>" +
        "<p>Role: " + roleLabel + "</p>" +
        "<p>Star Power: " + performer.starPower + "</p>" +
        "<p>Fatigue: " + performer.fatigue + " (" + availability + ")</p>" +
        "<p>Loyalty: " + performer.loyalty + "</p>" +
        "<p>" + contractSummary.label + "</p>" +
        "<p>Availability: " + availabilitySummary.label + "</p>" +
        renewButton +
        "</div>" +
        "</div>";
    }).join("")
    : "<p class=\"helper-text\">No performers available.</p>";

  const body = rosterBody +
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
  const previewLine = "Est. Followers +" + manualPreview.followersGained + ", Est. Subs +" + manualPreview.subscribersGained;
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

  const postsList = gameState.social.posts.length
    ? gameState.social.posts.map(function (post) {
      return "<div class=\"panel\">" +
        "<p><strong>" + post.platform + "</strong> — Day " + post.dayPosted + "</p>" +
        "<p>Followers Gained: " + post.followersGained + "</p>" +
        "<p>Subscribers Gained: " + post.subscribersGained + "</p>" +
        "</div>";
    }).join("")
    : "<p class=\"helper-text\">No social posts yet.</p>";

  const promoList = promoEntries.length
    ? promoEntries.map(function (entry) {
      const isSelected = entry.id === uiState.social.selectedContentId;
      const performer = getPerformerName(gameState, entry.performerId);
      const theme = getThemeName(entry.themeId);
      const label = "Day " + entry.dayCreated + " — " + performer + " (" + theme + ")";
      return "<div class=\"list-item\">" +
        "<button class=\"select-button" + (isSelected ? " is-selected" : "") + "\" data-action=\"select-social-content\" data-id=\"" + entry.id + "\">" + label + "</button>" +
        "</div>";
    }).join("")
    : "<p class=\"helper-text\">No Promo content available to post.</p>";

  const selectedEntry = uiState.social.selectedContentId
    ? promoEntries.find(function (entry) {
      return entry.id === uiState.social.selectedContentId;
    })
    : null;

  const postedStatus = selectedEntry
    ? "<p><strong>Posted:</strong> " + CONFIG.social_platforms.platforms.map(function (platform) {
      return platform + " " + (hasPosted(gameState, selectedEntry.id, platform) ? "✅" : "❌");
    }).join(" / ") + "</p>"
    : "<p class=\"helper-text\">Select a Promo content entry to see posted status.</p>";

  const canPost = promoEntries.length > 0 && Boolean(uiState.social.selectedContentId);
  const hasPostedInstagram = selectedEntry ? hasPosted(gameState, selectedEntry.id, "Instagram") : false;
  const hasPostedX = selectedEntry ? hasPosted(gameState, selectedEntry.id, "X") : false;

  const body = strategyPanel +
    manualPanel +
    "<div class=\"panel\"><h3 class=\"panel-title\">Recent Posts</h3>" + postsList + "</div>" +
    "<div class=\"panel\"><h3 class=\"panel-title\">Promo Content</h3>" + promoList + "</div>" +
    "<div class=\"panel\"><h3 class=\"panel-title\">Posted Status</h3>" + postedStatus + "</div>" +
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
      const performer = getPerformerName(gameState, entry.performerId);
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

  const detailPanel = selectedEntry
    ? "<div class=\"panel\"><h3 class=\"panel-title\">Entry Details</h3>" +
      "<p><strong>Day:</strong> " + selectedEntry.dayCreated + "</p>" +
      "<p><strong>Performer:</strong> " + getPerformerName(gameState, selectedEntry.performerId) + "</p>" +
      "<div style=\"" + locationRowStyle + "\">" +
      "<img src=\"" + getLocationThumbnailPath(CONFIG.locations.catalog[selectedEntry.locationId]) + "\" alt=\"Thumbnail of " + getLocationName(selectedEntry.locationId) + "\" width=\"" + locationThumbSize + "\" height=\"" + locationThumbSize + "\" style=\"" + locationThumbStyle + "\" onerror=\"this.onerror=null;this.src='" + CONFIG.LOCATION_PLACEHOLDER_THUMB_PATH + "';\" />" +
      "<p><strong>Location:</strong> " + getLocationName(selectedEntry.locationId) + "</p>" +
      "</div>" +
      "<p><strong>Theme:</strong> " + getThemeName(selectedEntry.themeId) + "</p>" +
      "<p><strong>Type:</strong> " + selectedEntry.contentType + "</p>" +
      "<p><strong>Shoot Cost:</strong> " + formatCurrency(selectedEntry.shootCost) + "</p>" +
      "</div>"
    : "";

  const outputCards = shootOutputs.length
    ? shootOutputs.slice().reverse().map(function (output) {
      const thumbPath = output.thumbnailPath || CONFIG.SHOOT_OUTPUT_PLACEHOLDER_THUMB_PATH;
      const fallbackPath = CONFIG.SHOOT_OUTPUT_PLACEHOLDER_THUMB_PATH;
      const performerLabel = getShootOutputPerformerLabel(gameState, output.performerIds);
      const tierLabel = formatShootOutputTierLabel(output.tier);
      const dayLabel = Number.isFinite(output.day) ? output.day : "?";
      const revenue = Number.isFinite(output.revenue) ? output.revenue : 0;
      const followers = Number.isFinite(output.followersGained) ? output.followersGained : 0;
      return "<div class=\"panel\" style=\"" + outputCardStyle + "\">" +
        "<img src=\"" + thumbPath + "\" alt=\"Shoot output thumbnail\" width=\"" + outputThumbSize + "\" height=\"" + outputThumbSize + "\"" +
        " style=\"" + outputThumbStyle + "\" onerror=\"this.onerror=null;this.src='" + fallbackPath + "';\" />" +
        "<div style=\"" + outputMetaStyle + "\">" +
        "<p><strong>Day " + dayLabel + " — " + tierLabel + " Shoot</strong></p>" +
        "<p class=\"helper-text\">Performers: " + performerLabel + "</p>" +
        "<p class=\"helper-text\">Revenue: " + formatCurrency(revenue) + " | Followers: " + followers + "</p>" +
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
    : CONFIG.progression.location_tier_1_unlock_cost;
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

  const equipmentRows = equipmentOrder.length
    ? equipmentOrder.map(function (upgradeId) {
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

      const buttonClass = "button primary" + (isMaxed ? " is-disabled" : "");
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
    createButton("Unlock", "unlock-location-tier", "primary", !canBuy, "data-tier=\"tier1\"") +
    "</div>" +
    "</div>" +
    "<div class=\"list-item\">" +
    "<p><strong>" + tier2Name + "</strong></p>" +
    "<p class=\"helper-text\">Cost: " + formatCurrency(tier2Cost) + " | Rep ≥ " + tier2RepRequirement +
    " | Status: " + (tier2Unlocked ? "Unlocked" : "Locked") + "</p>" +
    "<div class=\"button-row\">" +
    createButton("Unlock", "unlock-location-tier", "primary", !canBuyTier2, "data-tier=\"tier2\"") +
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

function getPerformerName(gameState, performerId) {
  const performer = gameState.roster.performers.find(function (entry) {
    return entry.id === performerId;
  });
  return performer ? performer.name : "Unknown";
}

function getLocationName(locationId) {
  const location = CONFIG.locations.catalog[locationId];
  return location ? location.name : "Unknown";
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
  return theme ? theme.name : (themeId || "Unknown");
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
