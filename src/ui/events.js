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

function showEventCards(cards) {
  const modalRoot = qs("#modal-root");
  if (!modalRoot || !Array.isArray(cards) || cards.length === 0) {
    return;
  }

  const eventHtml = cards.map(function (card) {
    return "<div class=\"modal-event\">" +
      "<h3 class=\"modal-title\">" + card.title + "</h3>" +
      "<p class=\"modal-message\">" + card.message + "</p>" +
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

function buildStoryEventCards(events) {
  if (!Array.isArray(events)) {
    return [];
  }
  return events.map(function (event) {
    const copy = getStoryEventCopy(event.id);
    return {
      title: copy.title,
      message: copy.message
    };
  });
}

function buildMilestoneEventCards(events) {
  if (!Array.isArray(events)) {
    return [];
  }
  return events.map(function (event) {
    return {
      title: "🏆 Milestone Reached",
      message: event.title + " — " + (event.rewardSummary || "Rewards: none.")
    };
  });
}

function showStoryEvents(events) {
  showEventCards(buildStoryEventCards(events));
}

function showStoryLogEntry(entry) {
  if (!entry) {
    return;
  }
  const dayLabel = Number.isFinite(entry.dayNumber) ? "Day " + entry.dayNumber + " — " : "";
  showEventCards([{
    title: dayLabel + entry.title,
    message: entry.body
  }]);
}

function ensureAutomationValidation() {
  if (typeof validateGameState !== "function") {
    return;
  }
  if (validateGameState._automationPatched) {
    return;
  }

  const baseValidate = validateGameState;
  validateGameState = function (candidate) {
    if (!candidate || typeof candidate !== "object") {
      return baseValidate(candidate);
    }
    const stripped = Object.assign({}, candidate);
    delete stripped.automation;
    delete stripped.shootOutputs;
    const result = baseValidate(stripped);
    if (!result || !result.ok) {
      return result;
    }
    return { ok: true, message: result.message };
  };
  validateGameState._automationPatched = true;
}

function normalizeAutomationReason(reason) {
  if (!reason) {
    return "Unknown issue";
  }
  const trimmed = String(reason).trim();
  if (!trimmed) {
    return "Unknown issue";
  }
  return trimmed.endsWith(".") ? trimmed.slice(0, -1) : trimmed;
}

function setupEventHandlers() {
  ensureAutomationValidation();

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

    if (action === "nav-story-log") {
      showScreen("screen-story-log");
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
        appendStoryLogEntries(window.gameState, result.storyEvents);
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message);
        }
        const eventCards = buildMilestoneEventCards(result.milestoneEvents).concat(
          buildStoryEventCards(result.storyEvents)
        );
        if (eventCards.length) {
          showEventCards(eventCards);
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

    if (action === "select-social-strategy") {
      const strategyId = target.dataset.id;
      const result = setSocialStrategy(window.gameState, strategyId);
      setUiMessage(result.message || "");
      if (result.ok) {
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message);
        }
        showEventCards([{
          title: "📣 Social Strategy Activated",
          message: "You’ve committed to " + result.strategy.label + ". Your follower growth will reflect this approach."
        }]);
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "normalize-manual-strategy") {
      ensureSocialManualStrategyState(window.gameState);
      const manualStrategy = window.gameState.social.manualStrategy;
      manualStrategy.allocations = normalizeManualStrategyAllocations(manualStrategy.allocations);
      setUiMessage("");
      renderApp(window.gameState);
      return;
    }

    if (action === "apply-manual-strategy") {
      const result = applyManualSocialStrategy(window.gameState);
      if (!result.ok) {
        setUiMessage(result.message || "");
        renderApp(window.gameState);
        return;
      }
      setUiMessage(result.message || "");
      const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
      if (!saveResult.ok) {
        setUiMessage(saveResult.message);
      }
      const milestoneCards = buildMilestoneEventCards(result.milestoneEvents);
      if (milestoneCards.length) {
        showEventCards(milestoneCards);
      }
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
        const milestoneCards = buildMilestoneEventCards(result.milestoneEvents);
        if (milestoneCards.length) {
          showEventCards(milestoneCards);
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
      ensureAutomationState(window.gameState);
      const storyEvents = advanceDay(window.gameState);
      const automationCards = [];
      if (window.gameState.automation.autoBookEnabled) {
        const maxPerDay = CONFIG.AUTOMATION_AUTO_BOOK_PER_DAY;
        for (let i = 0; i < maxPerDay; i += 1) {
          const result = tryAutoBookOne(window.gameState);
          if (result.success) {
            automationCards.push({
              title: "Automation",
              message: "Automation booked 1 shoot."
            });
          } else {
            automationCards.push({
              title: "Automation",
              message: "Automation couldn’t book a shoot: " + normalizeAutomationReason(result.reason) + "."
            });
          }
        }
      }
      appendStoryLogEntries(window.gameState, storyEvents);
      const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
      if (!saveResult.ok) {
        setUiMessage(saveResult.message || "");
      }
      const eventCards = buildStoryEventCards(storyEvents).concat(automationCards);
      if (eventCards.length) {
        showEventCards(eventCards);
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
        ensureAutomationState(window.gameState);
        ensureUnlocksState(window.gameState);
        ensureShootOutputsState(window.gameState);
        ensureStoryLogState(window.gameState);
        ensureSocialManualStrategyState(window.gameState);
        const storyResult = checkStoryEvents(window.gameState);
        if (storyResult.ok && storyResult.events.length) {
          appendStoryLogEntries(window.gameState, storyResult.events);
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
          ensureAutomationState(window.gameState);
          ensureUnlocksState(window.gameState);
          ensureShootOutputsState(window.gameState);
          ensureStoryLogState(window.gameState);
          ensureSocialManualStrategyState(window.gameState);
          const storyResult = checkStoryEvents(window.gameState);
          if (storyResult.ok && storyResult.events.length) {
            appendStoryLogEntries(window.gameState, storyResult.events);
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

    if (action === "view-story-log-entry") {
      const entryId = target.dataset.id;
      const entry = Array.isArray(window.gameState.storyLog)
        ? window.gameState.storyLog.find(function (logEntry) {
          return logEntry.id === entryId;
        })
        : null;
      showStoryLogEntry(entry);
      return;
    }

    console.warn("Action not wired yet:", action);
  });

  document.body.addEventListener("input", function (event) {
    const target = event.target;
    const action = target && target.dataset ? target.dataset.action : null;
    if (action === "manual-strategy-budget") {
      ensureSocialManualStrategyState(window.gameState);
      const manualStrategy = window.gameState.social.manualStrategy;
      const nextValue = Number(target.value);
      const minSpend = Number.isFinite(CONFIG.social.manualStrategy.minSpend)
        ? CONFIG.social.manualStrategy.minSpend
        : 0;
      manualStrategy.dailyBudget = Number.isFinite(nextValue) ? Math.max(minSpend, Math.round(nextValue)) : minSpend;
      setUiMessage("");
      renderApp(window.gameState);
      return;
    }

    if (action === "manual-strategy-channel") {
      ensureSocialManualStrategyState(window.gameState);
      const channel = target.dataset.channel;
      const manualStrategy = window.gameState.social.manualStrategy;
      const nextValue = Number(target.value);
      const sanitized = Number.isFinite(nextValue) ? Math.min(100, Math.max(0, Math.round(nextValue))) : 0;
      manualStrategy.allocations[channel] = sanitized;
      setUiMessage("");
      renderApp(window.gameState);
    }
  });

  document.body.addEventListener("change", function (event) {
    const target = event.target;
    const action = target && target.dataset ? target.dataset.action : null;
    if (action === "select-save-slot") {
      const uiState = getUiState();
      uiState.save.selectedSlotId = target.value;
      setUiMessage("");
      renderApp(window.gameState);
      return;
    }

    if (action === "toggle-auto-book") {
      ensureAutomationState(window.gameState);
      window.gameState.automation.autoBookEnabled = Boolean(target.checked);
      const message = window.gameState.automation.autoBookEnabled
        ? "Automation enabled: Auto-Book (1/day)."
        : "Automation disabled: Auto-Book.";
      setUiMessage(message);
      const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
      if (!saveResult.ok) {
        setUiMessage(saveResult.message || "");
      }
      renderApp(window.gameState);
    }
  });
}
