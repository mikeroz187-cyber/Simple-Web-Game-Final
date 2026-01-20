function setupEventHandlers() {
  document.body.addEventListener("click", function (event) {
    const action = event.target && event.target.dataset ? event.target.dataset.action : null;
    if (!action) {
      return;
    }

    if (action === "nav-hub") {
      showScreen("screen-hub");
      return;
    }

    if (action === "nav-booking") {
      showScreen("screen-booking");
      return;
    }

    if (action === "nav-content") {
      showScreen("screen-content");
      return;
    }

    if (action === "nav-analytics") {
      showScreen("screen-analytics");
      return;
    }

    if (action === "nav-roster") {
      showScreen("screen-roster");
      return;
    }

    if (action === "nav-social") {
      showScreen("screen-social");
      return;
    }

    if (action === "nav-gallery") {
      showScreen("screen-gallery");
      return;
    }

    if (action === "nav-shop") {
      showScreen("screen-shop");
      return;
    }

    console.warn("Action not wired yet:", action);
  });
}
