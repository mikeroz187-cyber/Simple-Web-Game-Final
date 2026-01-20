function renderApp(gameState) {
  renderHub(gameState);
  renderBooking(gameState);
  renderContent(gameState);
  renderAnalytics(gameState);
  renderRoster(gameState);
  renderSocial(gameState);
  renderGallery(gameState);
  renderShop(gameState);
}

function renderHub(gameState) {
  const hub = qs("#screen-hub");
  const statusHtml = [
    "<p><strong>Day:</strong> " + gameState.player.day + "</p>",
    "<p><strong>Cash:</strong> " + formatCurrency(gameState.player.cash) + "</p>",
    "<p><strong>Debt Remaining:</strong> " + formatCurrency(gameState.player.debtRemaining) + "</p>",
    "<p><strong>Followers:</strong> " + gameState.player.followers + "</p>",
    "<p><strong>Subscribers:</strong> " + gameState.player.subscribers + "</p>",
    "<p><strong>Reputation:</strong> " + gameState.player.reputation + "</p>"
  ].join("");

  const navButtons = [
    createButton("Booking", "nav-booking", "primary"),
    createButton("Analytics", "nav-analytics"),
    createButton("Social", "nav-social"),
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
    "<div class=\"button-row\">" + saveButtons + "</div>";
}

function renderBooking() {
  const screen = qs("#screen-booking");
  const body = "<p class=\"helper-text\">Booking screen placeholder.</p>" +
    "<div class=\"button-row\">" +
    createButton("Confirm Shoot", "confirm-shoot", "primary") +
    createButton("Back to Hub", "nav-hub") +
    "</div>";
  screen.innerHTML = createPanel("Booking", body);
}

function renderContent() {
  const screen = qs("#screen-content");
  const body = "<p class=\"helper-text\">Content screen placeholder.</p>" +
    "<div class=\"button-row\">" +
    createButton("View Analytics", "nav-analytics", "primary") +
    createButton("Back to Hub", "nav-hub") +
    "</div>";
  screen.innerHTML = createPanel("Content", body);
}

function renderAnalytics() {
  const screen = qs("#screen-analytics");
  const body = "<p class=\"helper-text\">Analytics screen placeholder.</p>" +
    "<div class=\"button-row\">" +
    createButton("Book Next Shoot", "nav-booking", "primary") +
    createButton("Back to Hub", "nav-hub") +
    "</div>";
  screen.innerHTML = createPanel("Analytics", body);
}

function renderRoster() {
  const screen = qs("#screen-roster");
  const body = "<p class=\"helper-text\">Roster screen placeholder.</p>" +
    "<div class=\"button-row\">" +
    createButton("Back to Hub", "nav-hub") +
    "</div>";
  screen.innerHTML = createPanel("Roster", body);
}

function renderSocial() {
  const screen = qs("#screen-social");
  const body = "<p class=\"helper-text\">Social screen placeholder.</p>" +
    "<div class=\"button-row\">" +
    createButton("Post to Instagram", "post-instagram", "primary") +
    createButton("Post to X", "post-x") +
    createButton("Back to Hub", "nav-hub") +
    "</div>";
  screen.innerHTML = createPanel("Social", body);
}

function renderGallery() {
  const screen = qs("#screen-gallery");
  const body = "<p class=\"helper-text\">Gallery screen placeholder.</p>" +
    "<div class=\"button-row\">" +
    createButton("Back to Hub", "nav-hub") +
    "</div>";
  screen.innerHTML = createPanel("Gallery", body);
}

function renderShop() {
  const screen = qs("#screen-shop");
  const body = "<p class=\"helper-text\">Shop screen placeholder.</p>" +
    "<div class=\"button-row\">" +
    createButton("Buy Upgrade", "buy-upgrade", "primary") +
    createButton("Back to Hub", "nav-hub") +
    "</div>";
  screen.innerHTML = createPanel("Shop", body);
}
