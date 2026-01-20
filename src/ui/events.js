function setupEventHandlers() {
  function showModalMessage(status, title, message, details) {
    const modalRoot = qs("#modal-root");
    if (!modalRoot) {
      return;
    }

    const detailHtml = details && details.length
      ? "<ul class=\"modal-details\">" + details.map(function (detail) {
        return "<li>" + detail + "</li>";
      }).join("") + "</ul>"
      : "";

    modalRoot.innerHTML =
      "<div class=\"modal-message modal-" + status + "\">" +
      "<strong>" + title + "</strong>" +
      "<p>" + message + "</p>" +
      detailHtml +
      "</div>";
  }

  function showSaveResult(result, successTitle, errorTitle) {
    if (result.ok) {
      showModalMessage("success", successTitle, result.message || "Success.");
    } else {
      showModalMessage("error", errorTitle, result.message || "Something went wrong.", result.details);
    }
  }

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

    if (action === "save-now") {
      const result = saveGame();
      showSaveResult(result, "Save Complete", "Save Failed");
      return;
    }

    if (action === "load-save") {
      const result = loadGame();
      if (result.ok) {
        renderApp(window.gameState);
      }
      showSaveResult(result, "Load Complete", "Load Failed");
      return;
    }

    if (action === "export-save") {
      const result = exportSaveToFile();
      showSaveResult(result, "Export Complete", "Export Failed");
      return;
    }

    if (action === "import-save") {
      importSaveFromFile().then(function (result) {
        if (result.ok) {
          renderApp(window.gameState);
        }
        showSaveResult(result, "Import Complete", "Import Failed");
      });
      return;
    }

    console.warn("Action not wired yet:", action);
  });
}
