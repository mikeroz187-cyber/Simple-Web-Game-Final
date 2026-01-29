function setUiMessage(message) {
  const uiState = getUiState();
  uiState.message = message || "";
}

function setDebugDayStatus(message) {
  const uiState = getUiState();
  if (!uiState.debug) {
    uiState.debug = { dayStatus: "" };
  }
  uiState.debug.dayStatus = message || "";
}

function setEquipmentMessage(message) {
  const uiState = getUiState();
  if (!uiState.shop) {
    uiState.shop = { equipmentMessage: "" };
  }
  uiState.shop.equipmentMessage = message || "";
}

function buildDailyCashflowMessage(cashflow) {
  if (!cashflow || typeof cashflow !== "object") {
    return "";
  }
  const subs = Number.isFinite(cashflow.subs) ? cashflow.subs : 0;
  const payout = Number.isFinite(cashflow.payout) ? cashflow.payout : 0;
  const overheadAmount = Number.isFinite(cashflow.overheadAmount) ? cashflow.overheadAmount : 0;
  const overheadLabel = typeof cashflow.overheadLabel === "string" ? cashflow.overheadLabel : "";
  const payoutLine = "OF Payout: +" + formatCurrency(payout) + " (" + subs + " subs)";
  const overheadLabelSuffix = overheadLabel ? (" - " + overheadLabel) : "";
  const overheadLine = "Overhead (Scaling" + overheadLabelSuffix + "): -" + formatCurrency(overheadAmount);
  return payoutLine + "<br>" + overheadLine;
}

function clearSlideshowState() {
  const uiState = getUiState();
  uiState.slideshow = { mode: null, id: null, index: 0 };
  uiState.recruitMeet = { performerId: null, slideIndex: 0 };
}

function resetBookingSelection() {
  const uiState = getUiState();
  const bookingMode = uiState.booking && uiState.booking.bookingMode ? uiState.booking.bookingMode : "core";
  uiState.booking = {
    performerIdA: null,
    locationId: null,
    themeId: null,
    contentType: null,
    bookingMode: bookingMode
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
    const copy = getStoryEventCopy(event.id, typeof window !== "undefined" ? window.gameState : null);
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
    if (event && event.kind === "legacy" && event.message) {
      return {
        title: "🏆 Legacy Milestone Achieved",
        message: event.message
      };
    }
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

function clamp(value, min, max) {
  if (!Number.isFinite(value)) {
    return min;
  }
  if (!Number.isFinite(min)) {
    return value;
  }
  if (!Number.isFinite(max)) {
    return value;
  }
  return Math.min(Math.max(value, min), max);
}

function getSlideshowImagePaths(gameState, slideshow) {
  if (!slideshow || !slideshow.mode) {
    return [];
  }
  if (slideshow.mode === "recruit") {
    const candidate = getRecruitmentCandidateById(slideshow.id);
    return candidate && Array.isArray(candidate.meetSlides) ? candidate.meetSlides : [];
  }
  if (slideshow.mode === "shoot") {
    const entry = gameState.content.entries.find(function (contentEntry) {
      return contentEntry.id === slideshow.id;
    }) || null;
    return entry ? getEntryPhotoPaths(entry) : [];
  }
  if (slideshow.mode === "conquest") {
    const pack = typeof getConquestPackById === "function"
      ? getConquestPackById(gameState, slideshow.id)
      : null;
    return pack && Array.isArray(pack.imagePaths) ? pack.imagePaths : [];
  }
  return [];
}

function setupEventHandlers() {
  ensureAutomationValidation();

  document.querySelectorAll("[data-action=\"nav-screen\"]").forEach(function (el) {
    el.addEventListener("click", function (event) {
      event.preventDefault();
      var screenId = el.getAttribute("data-screen");
      if (screenId) {
        showScreen(screenId);
        document.querySelectorAll(".nav-item[data-action=\"nav-screen\"]").forEach(function (navItem) {
          navItem.classList.remove("is-active");
        });
        el.classList.add("is-active");
      }
    });
  });

  var saveToggle = document.querySelector("[data-action=\"toggle-save-menu\"]");
  var saveDropdown = document.getElementById("nav-save-dropdown");
  if (saveToggle && saveDropdown) {
    saveToggle.addEventListener("click", function (event) {
      event.preventDefault();
      event.stopPropagation();
      var isOpen = saveDropdown.classList.contains("is-open");

      if (!isOpen) {
        var rect = saveToggle.getBoundingClientRect();
        saveDropdown.style.left = (rect.right + 8) + "px";
        saveDropdown.style.bottom = (window.innerHeight - rect.bottom) + "px";
        saveDropdown.classList.add("is-open");
      } else {
        saveDropdown.classList.remove("is-open");
      }
    });

    // Add explicit handlers for save dropdown buttons
    var saveNowBtn = saveDropdown.querySelector("[data-action=\"save-now\"]");
    var loadSaveBtn = saveDropdown.querySelector("[data-action=\"load-save\"]");
    var exportSaveBtn = saveDropdown.querySelector("[data-action=\"export-save\"]");
    var importSaveBtn = saveDropdown.querySelector("[data-action=\"import-save\"]");

    if (saveNowBtn) {
      saveNowBtn.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        saveDropdown.classList.remove("is-open");
        var uiState = getUiState();
        var result = saveGame(window.gameState, uiState.save.selectedSlotId);
        setUiMessage(result.message || "");
        renderApp(window.gameState);
        if (typeof showToast === "function") {
          showToast(result.ok ? "Game saved!" : "Save failed", result.ok ? "success" : "error");
        }
      });
    }

    if (loadSaveBtn) {
      loadSaveBtn.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        saveDropdown.classList.remove("is-open");
        var uiState = getUiState();
        var result = loadGame(uiState.save.selectedSlotId);
        if (result.ok) {
          window.gameState = result.gameState;
          ensureAutomationState(window.gameState);
          ensureUnlocksState(window.gameState);
          ensureShootOutputsState(window.gameState);
          ensureStoryLogState(window.gameState);
          ensureSocialManualStrategyState(window.gameState);
          ensureReputationState(window.gameState);
          ensureRecruitmentState(window.gameState);
          ensurePlayerUpgradesState(window.gameState);
          if (typeof initCompetitionStateIfMissing === "function") {
            initCompetitionStateIfMissing(window.gameState);
          }
          if (typeof showToast === "function") {
            showToast("Game loaded!", "success");
          }
        } else {
          if (typeof showToast === "function") {
            showToast(result.message || "Load failed", "error");
          }
        }
        setUiMessage(result.message || "");
        renderApp(window.gameState);
      });
    }

    if (exportSaveBtn) {
      exportSaveBtn.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        saveDropdown.classList.remove("is-open");
        var result = exportSaveToFile(window.gameState);
        setUiMessage(result.message || "");
        renderApp(window.gameState);
        if (typeof showToast === "function") {
          showToast(result.ok ? "Save exported!" : "Export failed", result.ok ? "success" : "error");
        }
      });
    }

    if (importSaveBtn) {
      importSaveBtn.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();
        saveDropdown.classList.remove("is-open");
        importSaveFromFile().then(function (result) {
          if (result.ok) {
            window.gameState = result.gameState;
            ensureAutomationState(window.gameState);
            ensureUnlocksState(window.gameState);
            ensureShootOutputsState(window.gameState);
            ensureStoryLogState(window.gameState);
            ensureSocialManualStrategyState(window.gameState);
            ensureReputationState(window.gameState);
            ensureRecruitmentState(window.gameState);
            ensurePlayerUpgradesState(window.gameState);
            if (typeof showToast === "function") {
              showToast("Save imported!", "success");
            }
          } else {
            if (typeof showToast === "function") {
              showToast(result.message || "Import failed", "error");
            }
          }
          setUiMessage(result.message || "");
          renderApp(window.gameState);
        });
      });
    }
  }

  document.body.addEventListener("click", function (event) {
    const actionEl = event.target.closest("[data-action]");
    if (!actionEl) {
      return;
    }
    const action = actionEl.getAttribute("data-action");
    const actionId = actionEl.getAttribute("data-id");
    const actionTier = actionEl.getAttribute("data-tier");
    if (!action) {
      return;
    }

    const uiState = getUiState();

    if (action === "dismiss-modal") {
      clearModal();
      return;
    }

    if (action === "toggle-auto-book") {
      ensureAutomationState(window.gameState);
      window.gameState.automation.autoBookEnabled = !window.gameState.automation.autoBookEnabled;
      window.gameState.automation.enabled = window.gameState.automation.autoBookEnabled ||
        window.gameState.automation.autoPostEnabled;
      saveGame(window.gameState, CONFIG.save.autosave_slot_id);
      renderApp(window.gameState);
      return;
    }

    if (action === "toggle-auto-post") {
      ensureAutomationState(window.gameState);
      window.gameState.automation.autoPostEnabled = !window.gameState.automation.autoPostEnabled;
      window.gameState.automation.enabled = window.gameState.automation.autoBookEnabled ||
        window.gameState.automation.autoPostEnabled;
      saveGame(window.gameState, CONFIG.save.autosave_slot_id);
      renderApp(window.gameState);
      return;
    }

    if (action === "open-meet-recruit") {
      const performerId = actionId;
      uiState.slideshow = { mode: "recruit", id: performerId, index: 0 };
      uiState.recruitMeet = { performerId: performerId, slideIndex: 0 };
      setUiMessage("");
      showScreen("screen-slideshow");
      renderApp(window.gameState);
      return;
    }

    if (action === "recruit-next-slide") {
      const slideshow = uiState.slideshow;
      if (!slideshow || slideshow.mode !== "recruit") {
        return;
      }
      const slides = getSlideshowImagePaths(window.gameState, slideshow);
      const maxIndex = Math.max(0, slides.length - 1);
      const nextIndex = Math.min(maxIndex, (slideshow.index || 0) + 1);
      slideshow.index = nextIndex;
      uiState.recruitMeet = { performerId: slideshow.id, slideIndex: nextIndex };
      renderApp(window.gameState);
      return;
    }

    if (action === "recruit-hire") {
      const performerId = actionId;
      const result = hireRecruitCandidate(window.gameState, performerId);
      setUiMessage(result.message || "");
      if (result.ok) {
        clearSlideshowState();
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message || "");
        }
        showScreen("screen-roster");
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "recruit-decline") {
      const performerId = actionId || (uiState.recruitMeet && uiState.recruitMeet.performerId);
      const result = declineRecruitCandidate(window.gameState, performerId);
      setUiMessage(result.message || "");
      if (result.ok) {
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message || "");
        }
      }
      if (uiState.slideshow && uiState.slideshow.mode === "recruit") {
        clearSlideshowState();
        showScreen("screen-roster");
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "view-shoot-photos") {
      const contentId = actionId;
      uiState.slideshow = { mode: "shoot", id: contentId, index: 0 };
      setUiMessage("");
      showScreen("screen-slideshow");
      renderApp(window.gameState);
      return;
    }

    if (action === "slideshow-prev" || action === "slideshow-next") {
      const slideshow = uiState.slideshow;
      if (!slideshow || (slideshow.mode !== "shoot" && slideshow.mode !== "conquest")) {
        return;
      }
      const slides = getSlideshowImagePaths(window.gameState, slideshow);
      const maxIndex = Math.max(0, slides.length - 1);
      const delta = action === "slideshow-next" ? 1 : -1;
      slideshow.index = clamp((slideshow.index || 0) + delta, 0, maxIndex);
      renderApp(window.gameState);
      return;
    }

    if (action === "slideshow-close") {
      const mode = uiState.slideshow && uiState.slideshow.mode ? uiState.slideshow.mode : null;
      clearSlideshowState();
      if (mode === "recruit") {
        showScreen("screen-roster");
      } else if (mode === "shoot") {
        showScreen("screen-gallery");
      } else if (mode === "conquest") {
        showScreen("screen-conquests");
      } else {
        showScreen("screen-hub");
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "booking-slideshow-prev" || action === "booking-slideshow-next") {
      const entry = getLatestContentEntry(window.gameState);
      if (!entry) {
        return;
      }
      const slides = typeof getEntryPhotoPaths === "function"
        ? getEntryPhotoPaths(entry).slice(0, 5)
        : [];
      const maxIndex = Math.max(0, slides.length - 1);
      const delta = action === "booking-slideshow-next" ? 1 : -1;
      uiState.bookingSlideshowIndex = clamp((uiState.bookingSlideshowIndex || 0) + delta, 0, maxIndex);
      renderApp(window.gameState);
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

    if (action === "select-reputation-branch") {
      const branchId = actionId;
      const result = selectReputationBranch(window.gameState, branchId);
      setUiMessage(result.message || "");
      if (result.ok) {
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message || "");
        }
        showEventCards([{
          title: "🏷️ Studio Identity Locked",
          message: result.message
        }]);
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "select-booking-mode") {
      const mode = actionId;
      uiState.booking.bookingMode = mode;
      if (mode === "agency_pack") {
        uiState.booking.performerIdA = null;
      }
      setUiMessage("");
      renderApp(window.gameState);
      return;
    }

    if (action === "select-performer-a") {
      uiState.booking.performerIdA = actionId || null;
      setUiMessage("");
      renderApp(window.gameState);
      return;
    }

    if (action === "select-location") {
      uiState.booking.locationId = actionId;
      setUiMessage("");
      renderApp(window.gameState);
      return;
    }

    if (action === "select-theme") {
      uiState.booking.themeId = actionId;
      setUiMessage("");
      renderApp(window.gameState);
      return;
    }

    if (action === "select-content-type") {
      uiState.booking.contentType = actionId;
      setUiMessage("");
      renderApp(window.gameState);
      return;
    }

    if (action === "confirm-shoot") {
      const result = confirmBooking(window.gameState, uiState.booking);
      setUiMessage(result.message || "");
      if (result.ok) {
        resetBookingSelection();
        uiState.bookingSlideshowIndex = 0;
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
        if (typeof showToast === "function") {
          showToast("Shoot booked!", "success");
        }
        return;
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "renew-contract") {
      const performerId = actionId;
      const result = renewPerformerContract(window.gameState, performerId);
      setUiMessage(result.message || "");
      if (result.ok) {
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message || "");
        }
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "select-social-content") {
      uiState.social.selectedContentId = actionId;
      setUiMessage("");
      renderApp(window.gameState);
      return;
    }

    if (action === "select-social-strategy") {
      const strategyId = actionId;
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
      setUiMessage("Applied — come back tomorrow to change.");
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
      const pipelineBefore = typeof getOfPipeline === "function" ? getOfPipeline(window.gameState) : null;
      const carryBefore = pipelineBefore ? pipelineBefore.carry : null;
      const result = postPromoContent(window.gameState, platform, uiState.social.selectedContentId);
      if (!result.ok) {
        setUiMessage(result.message || "");
        renderApp(window.gameState);
        return;
      }
      const latestPost = window.gameState.social.posts.length
        ? window.gameState.social.posts[window.gameState.social.posts.length - 1]
        : null;
      const pipelineAfter = typeof getOfPipeline === "function" ? getOfPipeline(window.gameState) : null;
      const carryAfter = pipelineAfter ? pipelineAfter.carry : null;
      let message = "Posted Promo";
      if (latestPost) {
        message += ": +" + latestPost.socialFollowersGained + " followers, +" + latestPost.socialSubscribersGained + " social subs";
      }
      if (Number.isFinite(carryBefore) && Number.isFinite(carryAfter) && pipelineAfter) {
        let delta = carryAfter - carryBefore;
        if (carryAfter < carryBefore) {
          delta = (1 - carryBefore) + carryAfter;
        }
        const pipelineValue = pipelineAfter.progressText.replace("OF Pipeline: ", "").replace(" / ", "/");
        message += ", OF Pipeline +" + delta.toFixed(2) + " (now " + pipelineValue + ")";
      }
      setUiMessage(message + ".");
      const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
      if (!saveResult.ok) {
        setUiMessage(saveResult.message);
      }
      const milestoneCards = buildMilestoneEventCards(result.milestoneEvents);
      if (milestoneCards.length) {
        showEventCards(milestoneCards);
      }
      if (typeof showToast === "function") {
        showToast("Posted to social media!", "success");
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "select-gallery-entry") {
      uiState.gallery.selectedContentId = actionId;
      setUiMessage("");
      renderApp(window.gameState);
      return;
    }

    if (action === "select-conquest-message") {
      if (!uiState.conquests) {
        uiState.conquests = { selectedMessageId: null };
      }
      uiState.conquests.selectedMessageId = actionId;
      setUiMessage("");
      renderApp(window.gameState);
      return;
    }

    if (action === "conquest-accept") {
      const result = typeof acceptConquestMessage === "function"
        ? acceptConquestMessage(window.gameState, actionId)
        : { ok: false, message: "Conquests system unavailable." };
      setUiMessage(result.message || "");
      if (result.ok) {
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message || "");
        }
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "conquest-dismiss") {
      const result = typeof dismissConquestMessage === "function"
        ? dismissConquestMessage(window.gameState, actionId)
        : { ok: false, message: "Conquests system unavailable." };
      setUiMessage(result.message || "");
      if (result.ok) {
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message || "");
        }
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "conquest-view-reward") {
      uiState.slideshow = { mode: "conquest", id: actionId, index: 0 };
      setUiMessage("");
      showScreen("screen-slideshow");
      renderApp(window.gameState);
      return;
    }

    if (action === "unlock-location-tier") {
      const tierId = actionTier;
      const result = unlockLocationTier(window.gameState, tierId);
      setUiMessage(result.message || "");
      if (result.ok) {
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message);
        }
        if (typeof showToast === "function") {
          showToast("Upgrade purchased!", "unlock");
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
        if (typeof showToast === "function") {
          showToast("Upgrade purchased!", "unlock");
        }
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "upgrade-equipment") {
      const upgradeId = actionId;
      const result = purchaseEquipmentUpgrade(window.gameState, upgradeId);
      setEquipmentMessage(result.message || "");
      setUiMessage("");
      if (result.ok) {
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message);
        }
        if (typeof showToast === "function") {
          showToast("Upgrade purchased!", "unlock");
        }
        if (Array.isArray(result.conquestEvents) && result.conquestEvents.length) {
          showEventCards(result.conquestEvents);
        }
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "debug-set-day-reload") {
      event.preventDefault();
      event.stopPropagation();
      if (!isDebugEnabled()) {
        return;
      }
      const input = qs("#debug-day-input");
      if (!input) {
        setDebugDayStatus("Attempted day: (missing). Save key: unknown. Verified: no. Debug day input missing.");
        renderApp(window.gameState);
        return;
      }
      const dayRaw = input.valueAsNumber;
      const saveSlotId = CONFIG.save.autosave_slot_id;
      const saveKey = getSaveSlotKey(saveSlotId);
      if (!Number.isFinite(dayRaw)) {
        setDebugDayStatus("Attempted day: " + (input.value || "(blank)") + ". Save key: " + saveKey + ". Verified: no. Invalid day.");
        renderApp(window.gameState);
        return;
      }
      const minDay = Number.isFinite(CONFIG.debug.minDay) ? CONFIG.debug.minDay : 1;
      const configuredMaxDay = CONFIG.game && Number.isFinite(CONFIG.game.max_day) ? CONFIG.game.max_day : null;
      const debugMaxDay = Number.isFinite(CONFIG.debug.maxDay) ? CONFIG.debug.maxDay : 9999;
      const maxDay = Number.isFinite(configuredMaxDay) ? configuredMaxDay : debugMaxDay;
      const day = clamp(Math.floor(dayRaw), minDay, maxDay);
      const attemptedLabel = Math.floor(dayRaw);
      try {
        window.gameState.player.day = day;
        const saveResult = saveGame(window.gameState, saveSlotId);
        if (!saveResult.ok) {
          setDebugDayStatus("Attempted day: " + attemptedLabel + ". Save key: " + saveKey + ". Verified: no. " + (saveResult.message || "Failed to save debug day change."));
          renderApp(window.gameState);
          return;
        }
        const savedPayload = localStorage.getItem(saveKey);
        if (!savedPayload) {
          setDebugDayStatus("Attempted day: " + attemptedLabel + ". Save key: " + saveKey + ". Verified: no. Save verification failed (missing payload).");
          renderApp(window.gameState);
          return;
        }
        let parsedSave = null;
        try {
          parsedSave = JSON.parse(savedPayload);
        } catch (error) {
          setDebugDayStatus("Attempted day: " + attemptedLabel + ". Save key: " + saveKey + ". Verified: no. Save verification failed (invalid JSON).");
          renderApp(window.gameState);
          return;
        }
        const savedDay = parsedSave && parsedSave.player ? parsedSave.player.day : null;
        if (savedDay !== day) {
          setDebugDayStatus("Attempted day: " + attemptedLabel + ". Save key: " + saveKey + ". Verified: no. Save verification failed (did not persist).");
          renderApp(window.gameState);
          return;
        }
        setDebugDayStatus("Attempted day: " + attemptedLabel + ". Saved day: " + day + ". Save key: " + saveKey + ". Verified: yes. Reloading...");
        renderApp(window.gameState);
        window.setTimeout(function () {
          window.location.reload();
        }, 0);
        return;
      } catch (error) {
        const message = error && error.message ? error.message : "Unknown error.";
        setDebugDayStatus("Attempted day: " + attemptedLabel + ". Save key: " + saveKey + ". Verified: no. Error: " + message);
        renderApp(window.gameState);
        return;
      }
    }

    if (action === "debug-apply-stats") {
      event.preventDefault();
      event.stopPropagation();
      if (!isDebugEnabled()) {
        return;
      }
      const player = window.gameState.player;
      const statInputs = [
        { selector: "#debug-cash-input", field: "cash" },
        { selector: "#debug-reputation-input", field: "reputation" },
        { selector: "#debug-followers-input", field: "socialFollowers" },
        { selector: "#debug-social-subs-input", field: "socialSubscribers" },
        { selector: "#debug-of-subs-input", field: "onlyFansSubscribers" }
      ];
      statInputs.forEach(function (entry) {
        const input = qs(entry.selector);
        if (!input) {
          return;
        }
        const rawValue = input.valueAsNumber;
        if (!Number.isFinite(rawValue)) {
          return;
        }
        player[entry.field] = Math.max(0, Math.floor(rawValue));
      });

      const shootsInput = qs("#debug-shoots-today-input");
      if (shootsInput) {
        const rawShoots = shootsInput.valueAsNumber;
        if (Number.isFinite(rawShoots)) {
          player.shootsToday = Math.max(0, Math.floor(rawShoots));
        }
      }

      const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
      if (saveResult.ok) {
        setDebugDayStatus("Applied stats and autosaved.");
      } else {
        setDebugDayStatus("Applied stats but failed to autosave. " + (saveResult.message || ""));
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "debug-run-milestone-checks") {
      event.preventDefault();
      event.stopPropagation();
      if (!isDebugEnabled()) {
        return;
      }
      const legacyEvents = checkLegacyMilestones(window.gameState);
      const milestoneEvents = checkMilestones(window.gameState).concat(legacyEvents);
      const triggeredCount = milestoneEvents.length;
      const countLabel = triggeredCount === 1 ? "milestone" : "milestones";
      let statusMessage = "Triggered " + triggeredCount + " " + countLabel + ".";
      const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
      if (saveResult.ok) {
        statusMessage += " Autosaved.";
      } else {
        statusMessage += " Autosave failed. " + (saveResult.message || "");
      }
      if (milestoneEvents.length) {
        showEventCards(buildMilestoneEventCards(milestoneEvents));
      }
      setDebugDayStatus(statusMessage);
      renderApp(window.gameState);
      return;
    }

    if (action === "advance-day") {
      ensureAutomationState(window.gameState);
      const advanceResult = advanceDay(window.gameState);
      const storyEvents = advanceResult && Array.isArray(advanceResult.storyEvents)
        ? advanceResult.storyEvents
        : [];
      const conquestEvents = advanceResult && Array.isArray(advanceResult.conquestEvents)
        ? advanceResult.conquestEvents
        : [];
      const cashflowMessage = buildDailyCashflowMessage(advanceResult ? advanceResult.cashflow : null);
      const automationResult = runAutomationOnDayAdvance(window.gameState);
      appendStoryLogEntries(window.gameState, storyEvents);
      if (cashflowMessage) {
        setUiMessage(cashflowMessage);
      }
      const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
      if (!saveResult.ok) {
        setUiMessage(saveResult.message || "");
      }
      const eventCards = buildStoryEventCards(storyEvents).concat(automationResult.cards).concat(conquestEvents);
      if (eventCards.length) {
        showEventCards(eventCards);
      }
      renderApp(window.gameState);
      if (typeof showToast === "function") {
        showToast("Day " + window.gameState.player.day, "info");
      }
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
        ensureReputationState(window.gameState);
        ensureRecruitmentState(window.gameState);
        ensurePlayerUpgradesState(window.gameState);
        if (typeof ensureConquestsState === "function") {
          ensureConquestsState(window.gameState);
        }
        initCompetitionStateIfMissing(window.gameState);
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
          ensureReputationState(window.gameState);
          ensureRecruitmentState(window.gameState);
          ensurePlayerUpgradesState(window.gameState);
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
        const storyEvents = [];
        if (result.saturationActivated) {
          const saturationConfig = CONFIG.market && CONFIG.market.saturation
            ? CONFIG.market.saturation
            : {};
          const saturationMessageId = typeof saturationConfig.unlockMessageId === "string"
            ? saturationConfig.unlockMessageId
            : "act2_saturation_activated";
          storyEvents.push({ id: saturationMessageId, day: window.gameState.player.day });
        }
        if (result.competitionUnlocked) {
          const competitionConfig = CONFIG.market && CONFIG.market.competition
            ? CONFIG.market.competition
            : {};
          const unlockMessageId = typeof competitionConfig.unlockMessageId === "string"
            ? competitionConfig.unlockMessageId
            : "act2_competition_unlocked";
          storyEvents.push({ id: unlockMessageId, day: window.gameState.player.day });
        }
        if (storyEvents.length) {
          ensureStoryLogState(window.gameState);
          appendStoryLogEntries(window.gameState, storyEvents);
          showStoryEvents(storyEvents);
        }
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message);
        }
        if (typeof showToast === "function") {
          showToast("Debt paid in full!", "success");
        }
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "hire-manager") {
      const result = hireManager(window.gameState);
      setUiMessage(result.message || "");
      if (result.ok) {
        const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!saveResult.ok) {
          setUiMessage(saveResult.message || "");
        }
        if (typeof showToast === "function") {
          showToast("Manager hired!", "unlock");
        }
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "view-story-log-entry") {
      const entryId = actionId;
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

    if (action === "select-performer-a") {
      const uiState = getUiState();
      uiState.booking.performerIdA = target.value || null;
      setUiMessage("");
      renderApp(window.gameState);
      return;
    }

    if (action === "toggle-automation-enabled") {
      ensureAutomationState(window.gameState);
      window.gameState.automation.enabled = Boolean(target.checked);
      const message = window.gameState.automation.enabled
        ? "Automation enabled."
        : "Automation disabled.";
      setUiMessage(message);
      const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
      if (!saveResult.ok) {
        setUiMessage(saveResult.message || "");
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "toggle-auto-book") {
      ensureAutomationState(window.gameState);
      const automationConfig = CONFIG.automation || {};
      const maxActions = Number.isFinite(automationConfig.maxActionsPerDay)
        ? automationConfig.maxActionsPerDay
        : 1;
      window.gameState.automation.autoBookEnabled = Boolean(target.checked);
      window.gameState.automation.enabled = window.gameState.automation.autoBookEnabled ||
        window.gameState.automation.autoPostEnabled;
      const message = window.gameState.automation.autoBookEnabled
        ? "Automation enabled: Auto-Book (" + maxActions + "/day)."
        : "Automation disabled: Auto-Book.";
      setUiMessage(message);
      const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
      if (!saveResult.ok) {
        setUiMessage(saveResult.message || "");
      }
      renderApp(window.gameState);
      return;
    }

    if (action === "toggle-auto-post") {
      ensureAutomationState(window.gameState);
      const automationConfig = CONFIG.automation || {};
      const maxActions = Number.isFinite(automationConfig.maxActionsPerDay)
        ? automationConfig.maxActionsPerDay
        : 1;
      window.gameState.automation.autoPostEnabled = Boolean(target.checked);
      window.gameState.automation.enabled = window.gameState.automation.autoBookEnabled ||
        window.gameState.automation.autoPostEnabled;
      const message = window.gameState.automation.autoPostEnabled
        ? "Automation enabled: Auto-Post (" + maxActions + "/day)."
        : "Automation disabled: Auto-Post.";
      setUiMessage(message);
      const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
      if (!saveResult.ok) {
        setUiMessage(saveResult.message || "");
      }
      renderApp(window.gameState);
      return;
    }
  });

  document.addEventListener("click", function (event) {
    var saveDropdown = document.getElementById("nav-save-dropdown");
    if (saveDropdown && saveDropdown.classList.contains("is-open")) {
      var clickedToggle = event.target.closest("[data-action=\"toggle-save-menu\"]");
      var clickedDropdown = event.target.closest(".nav-save-dropdown");
      if (!clickedToggle && !clickedDropdown) {
        saveDropdown.classList.remove("is-open");
      }
    }
  });
}
