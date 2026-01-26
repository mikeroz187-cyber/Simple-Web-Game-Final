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
      roster: {
        showFreelancers: false
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

function formatCompetitionMultiplier(value) {
  const numeric = Number.isFinite(value) ? value : 1;
  return "x" + numeric.toFixed(2);
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

function getPerformerTypeLabel(type) {
  if (type === "freelance") {
    return "Freelance";
  }
  return "Core";
}

function getFreelancerProfilesConfig() {
  if (CONFIG.freelancers && typeof CONFIG.freelancers === "object") {
    return CONFIG.freelancers;
  }
  return {};
}

function getFreelancerProfiles() {
  const config = getFreelancerProfilesConfig();
  return Array.isArray(config.profiles) ? config.profiles : [];
}

function getFreelancerProfileById(profileId) {
  if (!profileId) {
    return null;
  }
  const profiles = getFreelancerProfiles();
  return profiles.find(function (profile) {
    return profile && profile.id === profileId;
  }) || null;
}

function getFreelancerProfileId(gameState, performerId) {
  if (!gameState || !gameState.roster || !performerId) {
    return null;
  }
  const profiles = gameState.roster.freelancerProfiles || {};
  return profiles[performerId] || null;
}

function getPerformerDisplayProfile(gameState, performer) {
  if (!performer) {
    return { name: "Unknown", description: "" };
  }
  if (performer.type === "freelance") {
    const profileId = getFreelancerProfileId(gameState, performer.id);
    const profile = getFreelancerProfileById(profileId);
    if (profile) {
      return {
        name: profile.name || performer.name,
        description: profile.description || ""
      };
    }
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
  const competitionConfig = CONFIG.competition && typeof CONFIG.competition === "object" ? CONFIG.competition : {};
  const competitionDay = Number.isFinite(gameState.player.day) ? gameState.player.day : 0;
  const competitionStartDay = typeof getCompetitionStartDay === "function"
    ? getCompetitionStartDay(competitionConfig)
    : null;
  const competitionEnabled = typeof isCompetitionEnabled === "function"
    ? isCompetitionEnabled(competitionConfig, competitionDay)
    : Boolean(competitionConfig.enabled);
  const standings = competitionEnabled && typeof getCompetitionStandings === "function"
    ? getCompetitionStandings(gameState)
    : null;
  const standingLabel = competitionEnabled && standings
    ? standings.rank + "/" + standings.total
    : "—";
  const activeMarketShift = competitionEnabled && typeof getActiveMarketShift === "function"
    ? getActiveMarketShift(gameState, competitionDay)
    : null;
  const marketShiftLabel = activeMarketShift ? activeMarketShift.name : "None";
  const reputationConfig = CONFIG.reputation && typeof CONFIG.reputation === "object" ? CONFIG.reputation : {};
  const selectionStartDay = Number.isFinite(reputationConfig.selectionStartDay) ? reputationConfig.selectionStartDay : null;
  const reputationBranches = typeof getReputationBranches === "function" ? getReputationBranches() : [];
  const selectedBranch = typeof getSelectedReputationBranch === "function"
    ? getSelectedReputationBranch(gameState)
    : null;
  const legacyConfig = CONFIG.legacyMilestones && typeof CONFIG.legacyMilestones === "object"
    ? CONFIG.legacyMilestones
    : { milestoneOrder: [], milestones: {} };
  const legacyOrder = Array.isArray(legacyConfig.milestoneOrder) ? legacyConfig.milestoneOrder : [];

  const statusHtml = [
    "<p><strong>Day:</strong> " + gameState.player.day + "</p>",
    "<p><strong>Days Left:</strong> " + daysLeft + "</p>",
    "<p><strong>Shoots Today:</strong> " + gameState.player.shootsToday + " / " + CONFIG.game.shoots_per_day + "</p>",
    "<p><strong>Cash:</strong> " + formatCurrency(gameState.player.cash) + "</p>",
    "<p><strong>Debt Remaining:</strong> " + formatCurrency(gameState.player.debtRemaining) + " (Due Day " + gameState.player.debtDueDay + ")</p>",
    "<p><strong>Social Followers:</strong> " + gameState.player.socialFollowers + "</p>",
    "<p><strong>Social Subscribers:</strong> " + gameState.player.socialSubscribers + "</p>",
    "<p><strong>OnlyFans Subscribers:</strong> " + gameState.player.onlyFansSubscribers + "</p>",
    "<p><strong>MRR:</strong> " + formatCurrency(getMRR(gameState)) + "/mo</p>",
    "<p><strong>Reputation:</strong> " + gameState.player.reputation + "</p>",
    "<p><strong>Next Action:</strong> " + nextAction + "</p>"
  ].join("");

  let competitionPanelBody = "";
  if (competitionEnabled) {
    competitionPanelBody = "<p><strong>Status:</strong> Enabled</p>" +
      "<p><strong>Standing:</strong> " + standingLabel + "</p>" +
      "<p><strong>Market Shift:</strong> " + marketShiftLabel + "</p>";
  } else {
    const startDayLabel = Number.isFinite(competitionStartDay)
      ? "Competition begins Day " + competitionStartDay + "."
      : "Competition begins soon.";
    competitionPanelBody = "<p class=\"helper-text\">" + startDayLabel + "</p>";
  }
  const competitionPanel = "<div class=\"panel\">" +
    "<h3 class=\"panel-title\">Competition</h3>" +
    competitionPanelBody +
    "</div>";

  let reputationPanelBody = "";
  if (!Number.isFinite(selectionStartDay)) {
    reputationPanelBody = "<p class=\"helper-text\">Studio Identity unavailable.</p>";
  } else if (gameState.player.day < selectionStartDay) {
    reputationPanelBody = "<p class=\"helper-text\">Studio Identity unlocks Day " + selectionStartDay + ".</p>";
  } else if (!selectedBranch) {
    const requiredReputation = reputationBranches.length && Number.isFinite(reputationBranches[0].requiredReputation)
      ? reputationBranches[0].requiredReputation
      : 0;
    if (gameState.player.reputation < requiredReputation) {
      reputationPanelBody = "<p class=\"helper-text\">Need Reputation ≥ " + requiredReputation + " to choose an identity.</p>";
    } else if (reputationBranches.length === 0) {
      reputationPanelBody = "<p class=\"helper-text\">No identity paths available.</p>";
    } else {
      const branchCards = reputationBranches.map(function (branch) {
        const revenueLabel = "Premium payout " + formatCompetitionMultiplier(branch.revenueMult);
        const followersLabel = "Promo followers " + formatCompetitionMultiplier(branch.followersMult);
        return "<div class=\"list-item\">" +
          "<p><strong>" + branch.label + "</strong></p>" +
          "<p class=\"helper-text\">" + branch.blurb + "</p>" +
          "<p class=\"helper-text\">" + revenueLabel + ", " + followersLabel + "</p>" +
          "<div class=\"button-row\">" +
          createButton("Choose", "select-reputation-branch", "primary", false, "data-id=\"" + branch.id + "\"") +
          "</div>" +
          "</div>";
      }).join("");
      reputationPanelBody = branchCards;
    }
  } else {
    const revenueLabel = "Premium payout " + formatCompetitionMultiplier(selectedBranch.revenueMult);
    const followersLabel = "Promo followers " + formatCompetitionMultiplier(selectedBranch.followersMult);
    reputationPanelBody = "<p><strong>Selected:</strong> " + selectedBranch.label + "</p>" +
      "<p class=\"helper-text\">" + revenueLabel + ", " + followersLabel + "</p>" +
      "<p class=\"helper-text\">Locked.</p>";
  }
  const reputationPanel = "<div class=\"panel\">" +
    "<h3 class=\"panel-title\">Studio Identity</h3>" +
    reputationPanelBody +
    "</div>";

  const legacyMilestoneRows = legacyOrder.map(function (milestoneId) {
    const definition = legacyConfig.milestones ? legacyConfig.milestones[milestoneId] : null;
    if (!definition) {
      return "";
    }
    const legacyEntries = Array.isArray(gameState.legacyMilestones) ? gameState.legacyMilestones : [];
    const existing = legacyEntries.find(function (entry) {
      return entry.id === milestoneId;
    });
    const metricValue = typeof getLegacyMilestoneMetricValue === "function"
      ? getLegacyMilestoneMetricValue(gameState, definition)
      : 0;
    const threshold = Number.isFinite(definition.threshold) ? definition.threshold : 0;
    const currentValue = Number.isFinite(metricValue) ? metricValue : 0;
    const isComplete = Boolean(existing);
    const label = definition.type === "storyComplete"
      ? "Complete Act 3 Story (Day 270 event)"
      : definition.label;
    let progressLabel = currentValue + " / " + threshold;
    if (definition.type === "lifetimeRevenue") {
      progressLabel = formatCurrency(currentValue) + " / " + formatCurrency(threshold);
    }
    if (definition.type === "storyComplete") {
      progressLabel = currentValue >= threshold ? "1 / 1" : "0 / 1";
    }
    const statusLabel = isComplete ? "✅ Complete" : "⏳ In Progress";
    return "<div class=\"list-item\">" +
      "<p><strong>" + label + "</strong></p>" +
      "<p class=\"helper-text\">Progress: " + progressLabel + "</p>" +
      "<p class=\"helper-text\">Status: " + statusLabel + "</p>" +
      "</div>";
  }).join("");
  const legacyPanelBody = legacyMilestoneRows
    ? legacyMilestoneRows
    : "<p class=\"helper-text\">No legacy milestones available.</p>";
  const legacyPanel = "<div class=\"panel\">" +
    "<h3 class=\"panel-title\">Legacy Milestones</h3>" +
    legacyPanelBody +
    "</div>";

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

  const automationConfig = CONFIG.automation || {};
  const autoBookCount = Number.isFinite(automationConfig.maxActionsPerDay)
    ? automationConfig.maxActionsPerDay
    : 1;
  const automationEnabled = Boolean(gameState.automation && gameState.automation.enabled);
  const automationChecked = automationEnabled ? " checked" : "";
  const autoBookEnabled = Boolean(gameState.automation && gameState.automation.autoBookEnabled);
  const autoBookChecked = autoBookEnabled ? " checked" : "";
  const autoPostEnabled = Boolean(gameState.automation && gameState.automation.autoPostEnabled);
  const autoPostChecked = autoPostEnabled ? " checked" : "";
  const autoBookLabel = "Auto-Book (" + autoBookCount + "/day)";
  const autoPostLabel = "Auto-Post (" + autoBookCount + "/day)";
  const automationCapLabel = autoBookCount === 1
    ? "1 automated action"
    : autoBookCount + " automated actions";
  const automationPanel = "<div class=\"panel\">" +
    "<h3 class=\"panel-title\">Automation</h3>" +
    "<div class=\"field-row\">" +
    "<label class=\"field-label\" for=\"automation-enabled-toggle\">Automation Enabled</label>" +
    "<input id=\"automation-enabled-toggle\" class=\"checkbox-control\" type=\"checkbox\" data-action=\"toggle-automation-enabled\"" +
    automationChecked + " />" +
    "</div>" +
    "<div class=\"field-row\">" +
    "<label class=\"field-label\" for=\"auto-book-toggle\">" + autoBookLabel + "</label>" +
    "<input id=\"auto-book-toggle\" class=\"checkbox-control\" type=\"checkbox\" data-action=\"toggle-auto-book\"" +
    autoBookChecked + " />" +
    "</div>" +
    "<div class=\"field-row\">" +
    "<label class=\"field-label\" for=\"auto-post-toggle\">" + autoPostLabel + "</label>" +
    "<input id=\"auto-post-toggle\" class=\"checkbox-control\" type=\"checkbox\" data-action=\"toggle-auto-post\"" +
    autoPostChecked + " />" +
    "</div>" +
    "<p class=\"helper-text\">Runs only when you click Advance Day. Max " + automationCapLabel + " per day.</p>" +
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
  const debugStatus = uiState.debug && uiState.debug.dayStatus ? uiState.debug.dayStatus : "";
  const debugMaxShoots = Number.isFinite(CONFIG.game.shoots_per_day) ? CONFIG.game.shoots_per_day : 5;
  const debugPanel = isDebugEnabled()
    ? "<div class=\"panel\">" +
      "<h3 class=\"panel-title\">Debug (Dev Only)</h3>" +
      "<div class=\"field-row\">" +
      "<label class=\"field-label\" for=\"debug-day-input\">Day</label>" +
      "<input id=\"debug-day-input\" class=\"input-control\" type=\"number\" min=\"" + CONFIG.debug.minDay +
      "\" max=\"" + CONFIG.debug.maxDay + "\" step=\"1\" value=\"" + gameState.player.day + "\" />" +
      "</div>" +
      "<div class=\"button-row\">" +
      "<button class=\"button\" type=\"button\" data-action=\"debug-set-day-reload\">Set Day + Reload</button>" +
      "</div>" +
      "<h4 class=\"panel-title\">Set Stats (Dev Only)</h4>" +
      "<div class=\"field-row\">" +
      "<label class=\"field-label\" for=\"debug-cash-input\">Cash</label>" +
      "<input id=\"debug-cash-input\" class=\"input-control\" type=\"number\" min=\"0\" step=\"1\" value=\"" + gameState.player.cash + "\" />" +
      "</div>" +
      "<div class=\"field-row\">" +
      "<label class=\"field-label\" for=\"debug-reputation-input\">Reputation</label>" +
      "<input id=\"debug-reputation-input\" class=\"input-control\" type=\"number\" min=\"0\" step=\"1\" value=\"" + gameState.player.reputation + "\" />" +
      "</div>" +
      "<div class=\"field-row\">" +
      "<label class=\"field-label\" for=\"debug-followers-input\">Social Followers</label>" +
      "<input id=\"debug-followers-input\" class=\"input-control\" type=\"number\" min=\"0\" step=\"1\" value=\"" + gameState.player.socialFollowers + "\" />" +
      "</div>" +
      "<div class=\"field-row\">" +
      "<label class=\"field-label\" for=\"debug-social-subs-input\">Social Subs</label>" +
      "<input id=\"debug-social-subs-input\" class=\"input-control\" type=\"number\" min=\"0\" step=\"1\" value=\"" + gameState.player.socialSubscribers + "\" />" +
      "</div>" +
      "<div class=\"field-row\">" +
      "<label class=\"field-label\" for=\"debug-of-subs-input\">OF Subs</label>" +
      "<input id=\"debug-of-subs-input\" class=\"input-control\" type=\"number\" min=\"0\" step=\"1\" value=\"" + gameState.player.onlyFansSubscribers + "\" />" +
      "</div>" +
      "<div class=\"field-row\">" +
      "<label class=\"field-label\" for=\"debug-shoots-today-input\">Shoots Today</label>" +
      "<input id=\"debug-shoots-today-input\" class=\"input-control\" type=\"number\" min=\"0\" max=\"" + debugMaxShoots +
      "\" step=\"1\" value=\"" + gameState.player.shootsToday + "\" />" +
      "</div>" +
      "<div class=\"button-row\">" +
      "<button class=\"button\" type=\"button\" data-action=\"debug-apply-stats\">Apply Stats (No Reload)</button>" +
      "</div>" +
      "<div class=\"button-row\">" +
      "<button class=\"button\" type=\"button\" data-action=\"debug-run-milestone-checks\">Run Milestone Checks Now</button>" +
      "</div>" +
      "<p class=\"helper-text\">Applies immediately and autosaves.</p>" +
      "<div id=\"debug-day-status\" class=\"muted\">" + debugStatus + "</div>" +
      "<p class=\"helper-text\">Current day: " + gameState.player.day +
      ". Debug mode is enabled via ?" + CONFIG.debug.queryParam + "=" + CONFIG.debug.queryValue + ".</p>" +
      "</div>"
    : "";

  hub.innerHTML = "<h2 id=\"screen-hub-title\" class=\"screen-title\">Hub</h2>" +
    "<div class=\"panel\">" + statusHtml + "</div>" +
    competitionPanel +
    reputationPanel +
    legacyPanel +
    debtButtonRow +
    "<div class=\"button-row\">" + navButtons + "</div>" +
    renderStatusMessage() +
    automationPanel +
    saveSlotControl +
    "<div class=\"button-row\">" + saveButtons + "</div>" +
    debugPanel;
}

function renderBooking(gameState) {
  const screen = qs("#screen-booking");
  const uiState = getUiState();
  const bookingMode = uiState.booking.bookingMode || "core";
  const isAgencyPack = bookingMode === "agency_pack";
  const allPerformers = gameState.roster.performers;
  const performers = allPerformers.filter(function (performer) {
    return performer.type !== "freelance";
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
    return "<div class=\"list-item\">" +
      "<button class=\"select-button" + (isSelected ? " is-selected" : "") + "\" data-action=\"select-booking-mode\" data-id=\"" + option.id + "\">" +
      option.label + "</button>" +
      "<p class=\"helper-text\">" + option.description + "</p>" +
      "</div>";
  }).join("");

  const performerOptions = hasPerformers
    ? performers.map(function (performer) {
      const displayProfile = getPerformerDisplayProfile(gameState, performer);
      const roleLabel = getPerformerRoleLabel(gameState, performer.id);
      const typeLabel = getPerformerTypeLabel(performer.type);
      const optionLabel = "[" + typeLabel + "][" + roleLabel + "] " + displayProfile.name;
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
    const roleLabel = getPerformerRoleLabel(gameState, performer.id);
    const typeLabel = getPerformerTypeLabel(performer.type);
    const contractSummary = getContractSummary(gameState, performer.id);
    const availabilitySummary = getAvailabilitySummary(gameState, performer.id);
    const detail = "Role: " + roleLabel + " | Star Power: " + performer.starPower +
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
      "<p class=\"helper-text\">" + typeLabel + " | " + roleLabel + "</p>" +
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
    return "<div class=\"list-item\">" +
      "<button class=\"select-button" + (isSelected ? " is-selected" : "") + "\" data-action=\"select-theme\" data-id=\"" + theme.id + "\">" + theme.name + "</button>" +
      "<p class=\"helper-text\">" + theme.description + "</p>" +
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
  const computedShootCost = selectedLocation
    ? (hasCombo ? Math.floor(shootCostResult.value * costMultiplier) : shootCostResult.value)
    : 0;
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
    !selectedLocationLocked;

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
    const bundleThumbs = renderBundleThumbs(entry.bundleThumbs);
    const bundlePanel = bundleThumbs
      ? "<p><strong>Sample Pack:</strong></p>" + bundleThumbs
      : "";
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
  const competitionConfig = CONFIG.competition && typeof CONFIG.competition === "object" ? CONFIG.competition : {};
  const competitionEnabled = typeof isCompetitionEnabled === "function"
    ? isCompetitionEnabled(competitionConfig, dayNumber)
    : Boolean(competitionConfig.enabled);
  const activeMarketShift = competitionEnabled && typeof getActiveMarketShift === "function"
    ? getActiveMarketShift(gameState, dayNumber)
    : null;
  const competitionMultipliers = competitionEnabled && typeof getCompetitionMultipliers === "function"
    ? getCompetitionMultipliers(gameState, dayNumber)
    : { promoFollowerMult: 1, premiumRevenueMult: 1 };

  const todayTotalsPanel = "<div class=\"panel\">" +
    "<h3 class=\"panel-title\">Today (Day " + dayNumber + ") Totals</h3>" +
    "<p><strong>MRR Change:</strong> " + formatCurrency(todaySummary.mrrDelta) + "/mo</p>" +
    "<p><strong>Social Followers Gained:</strong> " + todaySummary.socialFollowers + "</p>" +
    "<p><strong>Social Subscribers Gained:</strong> " + todaySummary.socialSubscribers + "</p>" +
    "<p><strong>OnlyFans Subscribers Gained:</strong> " + todaySummary.onlyFansSubscribers + "</p>" +
    "<p class=\"helper-text\">Totals for the current in-game day.</p>" +
    "</div>";

  const marketShiftNote = competitionEnabled && activeMarketShift
    ? "<div class=\"panel\"><p class=\"helper-text\">Market shift active: " + activeMarketShift.name +
      " (Promo " + formatCompetitionMultiplier(competitionMultipliers.promoFollowerMult) +
      ", Premium " + formatCompetitionMultiplier(competitionMultipliers.premiumRevenueMult) + ").</p></div>"
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
    latestShootBody = "<p><strong>MRR Change:</strong> " + formatCurrency(latestMrrDelta) + "/mo</p>" +
      "<p><strong>Social Followers Gained:</strong> " + entry.results.socialFollowersGained + "</p>" +
      "<p><strong>Social Subscribers Gained:</strong> " + entry.results.socialSubscribersGained + "</p>" +
      "<p><strong>OnlyFans Subscribers Gained:</strong> " + latestOnlyFansSubs + "</p>" +
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
      return "<div class=\"list-item\"><p>Day " + snapshot.dayNumber + " — Social Followers " + socialFollowers +
        ", Social Subs " + socialSubscribers + ", OF Subs " + onlyFansSubscribers +
        ", Cash " + formatCurrency(cash) + ", MRR " + formatCurrency(mrr) + "/mo</p></div>";
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
  getUiState();

  const contractedPerformers = performers.filter(function (performer) {
    return performer.type !== "freelance";
  });

  const contractedRows = contractedPerformers.length
    ? contractedPerformers.map(function (performer) {
      const performerStatus = isPerformerBookable(gameState, performer);
      const availability = performerStatus.ok ? "Available" : "Unavailable";
      const portraitPath = getPerformerPortraitPath(performer);
      const displayProfile = getPerformerDisplayProfile(gameState, performer);
      const portraitAlt = "Portrait of " + displayProfile.name;
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
        "<p><strong>" + displayProfile.name + "</strong> (" + performer.type + ")</p>" +
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
    : "<p class=\"helper-text\">No contracted performers available.</p>";

  const contractedSection = "<div class=\"panel\"><h3 class=\"panel-title\">Contracted Talent</h3>" + contractedRows + "</div>";

  const body = contractedSection +
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
