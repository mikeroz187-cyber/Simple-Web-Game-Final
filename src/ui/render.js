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
  renderShop(gameState);
}

function renderStatusMessage() {
  const uiState = getUiState();
  if (!uiState.message) {
    return "";
  }
  return "<p class=\"helper-text status-message\">" + uiState.message + "</p>";
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
    createButton("Roster", "nav-roster"),
    createButton("Shop", "nav-shop")
  ].join("");

  const saveButtons = [
    createButton("Save Now", "save-now"),
    createButton("Load Save", "load-save"),
    createButton("Export Save", "export-save"),
    createButton("Import Save", "import-save")
  ].join("");

  hub.innerHTML = "<h2 id=\"screen-hub-title\" class=\"screen-title\">Hub</h2>" +
    "<div class=\"panel\">" + statusHtml + "</div>" +
    "<div class=\"button-row\">" + navButtons + "</div>" +
    renderStatusMessage() +
    "<div class=\"button-row\">" + saveButtons + "</div>";
}

function renderBooking(gameState) {
  const screen = qs("#screen-booking");
  const uiState = getUiState();
  const performers = gameState.roster.performers;
  const hasPerformers = performers.length > 0;

  const performerRows = hasPerformers
    ? performers.map(function (performer) {
      const isSelected = performer.id === uiState.booking.performerId;
      const available = isPerformerAvailable(performer);
      const label = performer.name + " (" + performer.type + ")";
      const detail = "Star Power: " + performer.starPower + " | Fatigue: " + performer.fatigue + " | Loyalty: " + performer.loyalty;
      return "<div class=\"list-item\">" +
        "<button class=\"select-button" + (isSelected ? " is-selected" : "") + "\" data-action=\"select-performer\" data-id=\"" + performer.id + "\"" + (available ? "" : " disabled") + ">" + label + "</button>" +
        "<p class=\"helper-text\">" + detail + (available ? "" : " — Unavailable") + "</p>" +
        "</div>";
    }).join("")
    : "<p class=\"helper-text\">No performers available.</p>";

  const locations = CONFIG.locations.tier0_ids.concat(CONFIG.locations.tier1_ids);
  const locationRows = locations.map(function (locationId) {
    const location = CONFIG.locations.catalog[locationId];
    const isSelected = location.id === uiState.booking.locationId;
    const isLocked = location.tier === 1 && !gameState.unlocks.locationTier1Unlocked;
    const label = location.name + " (Tier " + location.tier + ")";
    const detail = "Cost: " + formatCurrency(location.cost) + (isLocked ? " — Locked" : "");
    return "<div class=\"list-item\">" +
      "<button class=\"select-button" + (isSelected ? " is-selected" : "") + "\" data-action=\"select-location\" data-id=\"" + location.id + "\"" + (isLocked ? " disabled" : "") + ">" + label + "</button>" +
      "<p class=\"helper-text\">" + detail + "</p>" +
      "</div>";
  }).join("");

  const themeRows = CONFIG.themes.mvp.theme_ids.map(function (themeId) {
    const theme = CONFIG.themes.mvp.themes[themeId];
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
  const performerAvailable = selectedPerformer ? isPerformerAvailable(selectedPerformer) : false;
  const selectedLocation = uiState.booking.locationId
    ? CONFIG.locations.catalog[uiState.booking.locationId]
    : null;
  const shootCostResult = calculateShootCost(selectedLocation);
  const shootCostLabel = selectedLocation
    ? formatCurrency(shootCostResult.value)
    : "Select a location";

  const canConfirm = hasPerformers && uiState.booking.performerId && uiState.booking.locationId && uiState.booking.themeId && uiState.booking.contentType && shootCostResult.ok && gameState.player.cash >= shootCostResult.value && performerAvailable;

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

  let contentBody = "<p class=\"helper-text\">No content yet. Book a shoot first.</p>";
  if (!entry && gameState.content.lastContentId) {
    contentBody = "<p class=\"helper-text\">Content record missing.</p>";
  }
  if (entry) {
    const performer = getPerformerName(gameState, entry.performerId);
    const location = getLocationName(entry.locationId);
    const theme = getThemeName(entry.themeId);
    contentBody = "<div class=\"content-placeholder\">Content preview placeholder</div>" +
      "<div class=\"panel\">" +
      "<p><strong>Performer:</strong> " + performer + "</p>" +
      "<p><strong>Location:</strong> " + location + "</p>" +
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

  const body = analyticsBody +
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

  const rosterBody = performers.length
    ? performers.map(function (performer) {
      const availability = isPerformerAvailable(performer) ? "Available" : "Unavailable";
      return "<div class=\"panel\">" +
        "<p><strong>" + performer.name + "</strong> (" + performer.type + ")</p>" +
        "<p>Star Power: " + performer.starPower + "</p>" +
        "<p>Fatigue: " + performer.fatigue + " (" + availability + ")</p>" +
        "<p>Loyalty: " + performer.loyalty + "</p>" +
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
  const promoEntries = gameState.content.entries.filter(function (entry) {
    return entry.contentType === "Promo";
  });

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

  const canPost = promoEntries.length > 0 && Boolean(uiState.social.selectedContentId);

  const body = "<div class=\"panel\"><h3 class=\"panel-title\">Recent Posts</h3>" + postsList + "</div>" +
    "<div class=\"panel\"><h3 class=\"panel-title\">Promo Content</h3>" + promoList + "</div>" +
    renderStatusMessage() +
    "<div class=\"button-row\">" +
    createButton("Post to Instagram", "post-instagram", "primary", !canPost) +
    createButton("Post to X", "post-x", "", !canPost) +
    createButton("Back to Hub", "nav-hub") +
    "</div>";
  screen.innerHTML = createPanel("Social", body, "screen-social-title");
}

function renderGallery(gameState) {
  const screen = qs("#screen-gallery");
  const uiState = getUiState();
  const entries = gameState.content.entries;

  const entryList = entries.length
    ? entries.map(function (entry) {
      const isSelected = entry.id === uiState.gallery.selectedContentId;
      const performer = getPerformerName(gameState, entry.performerId);
      const location = getLocationName(entry.locationId);
      const theme = getThemeName(entry.themeId);
      return "<div class=\"list-item\">" +
        "<button class=\"select-button" + (isSelected ? " is-selected" : "") + "\" data-action=\"select-gallery-entry\" data-id=\"" + entry.id + "\">" +
        "Day " + entry.dayCreated + " — " + performer + " — " + location + " — " + theme + " — " + entry.contentType +
        "</button>" +
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
      "<p><strong>Location:</strong> " + getLocationName(selectedEntry.locationId) + "</p>" +
      "<p><strong>Theme:</strong> " + getThemeName(selectedEntry.themeId) + "</p>" +
      "<p><strong>Type:</strong> " + selectedEntry.contentType + "</p>" +
      "<p><strong>Shoot Cost:</strong> " + formatCurrency(selectedEntry.shootCost) + "</p>" +
      "</div>"
    : "";

  const body = "<div class=\"panel\"><h3 class=\"panel-title\">Content History</h3>" + entryList + "</div>" +
    detailPanel +
    renderStatusMessage() +
    "<div class=\"button-row\">" +
    createButton("Back to Hub", "nav-hub") +
    "</div>";
  screen.innerHTML = createPanel("Gallery", body, "screen-gallery-title");
}

function renderShop(gameState) {
  const screen = qs("#screen-shop");
  const cost = CONFIG.progression.location_tier_1_unlock_cost;
  const unlocked = gameState.unlocks.locationTier1Unlocked;
  const canBuy = !unlocked && gameState.player.cash >= cost;

  const body = "<div class=\"panel\">" +
    "<h3 class=\"panel-title\">Tier 1 Location Unlock</h3>" +
    "<p><strong>Cost:</strong> " + formatCurrency(cost) + "</p>" +
    "<p><strong>Status:</strong> " + (unlocked ? "Unlocked" : "Locked") + "</p>" +
    "</div>" +
    renderStatusMessage() +
    "<div class=\"button-row\">" +
    createButton("Buy Unlock", "buy-tier1-location", "primary", !canBuy) +
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

function getThemeName(themeId) {
  const theme = CONFIG.themes.mvp.themes[themeId];
  return theme ? theme.name : "Unknown";
}

function getNextActionLabel(gameState) {
  if (!gameState.content.lastContentId) {
    return "Book your first shoot.";
  }
  return "Review the latest content and analytics, then book again.";
}
