function setUiMessage(message) {
  const uiState = getUiState();
  uiState.message = message || "";
}

function setEquipmentMessage(message) {
  const uiState = getUiState();
  if (!uiState.shop) {
    uiState.shop = { equipmentMessage: "" };
  }
  uiState.shop.equipmentMessage = message || "";
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

function clearModal() {
  const modalRoot = qs("#modal-root");
  if (modalRoot) {
    modalRoot.innerHTML = "";
  }
}

function showStoryEvents(events) {
  const modalRoot = qs("#modal-root");
  if (!modalRoot || !Array.isArray(events) || events.length === 0) {
    return;
  }

  const eventHtml = events.map(function (event) {
    const copy = getStoryEventCopy(event.id);
    return "<div class=\"modal-event\">" +
      "<h3 class=\"modal-title\">" + copy.title + "</h3>" +
      "<p class=\"modal-message\">" + copy.message + "</p>" +
      "</div>";
  }).join("");

  modalRoot.innerHTML =
    "<div class=\"modal-overlay\">" +
    "<div class=\"modal-card\">" +
    eventHtml +
    "<div class=\"button-row\">" +
    "<button class=\"button primary\" data-action=\"dismiss-modal\">Close</button>" +
    "</div>" +
    "</div>" +
    "</div>";
}

function setupEventHandlers() {
  document.body.addEventListener("click", function (event) {
    const target = event.target.closest("[data-action]");
    const action = target && target.dataset ? target.dataset.action : null;
    if (!action) {
      return;
    }

    const uiState = getUiState();

    if (action === "dismiss-modal") {
      clearModal();
      return;
    }

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
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message);
        }
        if (result.storyEvents && result.storyEvents.length) {
          showStoryEvents(result.storyEvents);
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
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
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

    if (action === "unlock-location-tier") {
      const tierId = target.dataset.tier;
      const result = unlockLocationTier(window.gameState, tierId);
      setUiMessage(result.message || "");
      if (result.ok) {
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message);
        }
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "buy-tier1-location") {
      const result = purchaseTier1Location(window.gameState);
      setUiMessage(result.message || "");
      if (result.ok) {
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message);
        }
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "upgrade-equipment") {
      const upgradeId = target.dataset.id;
      const result = purchaseEquipmentUpgrade(window.gameState, upgradeId);
      setEquipmentMessage(result.message || "");
      setUiMessage("");
      if (result.ok) {
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message);
        }
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "advance-day") {
      const storyEvents = advanceDay(window.gameState);
      const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
      if (!saveResult.ok) {
        setUiMessage(saveResult.message || "");
      }
      if (storyEvents && storyEvents.length) {
        showStoryEvents(storyEvents);
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "save-now") {
      const result = saveGame(window.gameState, uiState.save.selectedSlotId);
      setUiMessage(result.message || "");
      renderApp(window.gameState);
      return;
    }

    if (action === "load-save") {
      const result = loadGame(uiState.save.selectedSlotId);
      if (result.ok) {
        window.gameState = result.gameState;
        const storyResult = checkStoryEvents(window.gameState);
        if (storyResult.ok && storyResult.events.length) {
          const saveResult = saveGame(window.gameState, uiState.save.selectedSlotId);
          if (!saveResult.ok) {
            setUiMessage(saveResult.message || "");
          }
          showStoryEvents(storyResult.events);
        }
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
          const storyResult = checkStoryEvents(window.gameState);
          if (storyResult.ok && storyResult.events.length) {
            const saveResult = saveGame(window.gameState, uiState.save.selectedSlotId);
            if (!saveResult.ok) {
              setUiMessage(saveResult.message || "");
            }
            showStoryEvents(storyResult.events);
          }
        }
        setUiMessage(result.message || "");
        renderApp(window.gameState);
      });
      return;
    }

    if (action === "pay-debt") {
      const result = payDebt(window.gameState);
      setUiMessage(result.message || "");
      if (result.ok) {
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message);
        }
      }
      renderApp(window.gameState);
      return;
    }

    console.warn("Action not wired yet:", action);
  });

  document.body.addEventListener("change", function (event) {
    const target = event.target;
    const action = target && target.dataset ? target.dataset.action : null;
    if (action !== "select-save-slot") {
      return;
    }
    const uiState = getUiState();
    uiState.save.selectedSlotId = target.value;
    setUiMessage("");
    renderApp(window.gameState);
  });
}
