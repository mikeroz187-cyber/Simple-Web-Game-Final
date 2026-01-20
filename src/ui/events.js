function setUiMessage(message) {
  const uiState = getUiState();
  uiState.message = message || "";
}

function resetBookingSelection() {
  const uiState = getUiState();
  uiState.booking = {
    performerId: null,
    locationId: null,
    themeId: null,
    contentType: null
  };
}

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
    const target = event.target.closest("[data-action]");
    const action = target && target.dataset ? target.dataset.action : null;
    if (!action) {
      return;
    }

    const uiState = getUiState();

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

    if (action === "nav-gallery") {
      showScreen("screen-gallery");
      renderApp(window.gameState);
      return;
    }

    if (action === "nav-shop") {
      showScreen("screen-shop");
      renderApp(window.gameState);
      return;
    }

    if (action === "select-performer") {
      uiState.booking.performerId = target.dataset.id;
      setUiMessage("");
      renderApp(window.gameState);
      return;
    }

    if (action === "select-location") {
      uiState.booking.locationId = target.dataset.id;
      setUiMessage("");
      renderApp(window.gameState);
      return;
    }

    if (action === "select-theme") {
      uiState.booking.themeId = target.dataset.id;
      setUiMessage("");
      renderApp(window.gameState);
      return;
    }

    if (action === "select-content-type") {
      uiState.booking.contentType = target.dataset.id;
      setUiMessage("");
      renderApp(window.gameState);
      return;
    }

    if (action === "confirm-shoot") {
      const result = confirmBooking(window.gameState, uiState.booking);
      setUiMessage(result.message || "");
      if (result.ok) {
        resetBookingSelection();
        const saveResult = saveGame(window.gameState);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message);
        }
        renderApp(window.gameState);
        showScreen("screen-content");
        return;
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "select-social-content") {
      uiState.social.selectedContentId = target.dataset.id;
      setUiMessage("");
      renderApp(window.gameState);
      return;
    }

    if (action === "post-instagram" || action === "post-x") {
      const platform = action === "post-instagram" ? "Instagram" : "X";
      const result = postPromoContent(window.gameState, platform, uiState.social.selectedContentId);
      setUiMessage(result.message || "");
      if (result.ok) {
        const saveResult = saveGame(window.gameState);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message);
        }
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "select-gallery-entry") {
      uiState.gallery.selectedContentId = target.dataset.id;
      setUiMessage("");
      renderApp(window.gameState);
      return;
    }

    if (action === "buy-tier1-location") {
      const result = purchaseTier1Location(window.gameState);
      setUiMessage(result.message || "");
      if (result.ok) {
        const saveResult = saveGame(window.gameState);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message);
        }
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "save-now") {
      const result = saveGame(window.gameState);
      setUiMessage(result.message || "");
      renderApp(window.gameState);
      return;
    }

    if (action === "load-save") {
      const result = loadGame();
      if (result.ok) {
        window.gameState = result.gameState;
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
        }
        setUiMessage(result.message || "");
        renderApp(window.gameState);
      });
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
