(function () {
  function applyAmbientArtLayoutVars() {
    if (!CONFIG || !CONFIG.ambientArt || typeof CONFIG.ambientArt !== "object") {
      return;
    }
    var layout = CONFIG.ambientArt.layout;
    if (!layout || typeof layout !== "object") {
      return;
    }
    var root = document.documentElement;
    if (!root || !root.style) {
      return;
    }
    if (Number.isFinite(layout.rightOffsetRem)) {
      root.style.setProperty("--ambient-mascot-right", layout.rightOffsetRem + "rem");
    }
    if (Number.isFinite(layout.bottomOffsetPx)) {
      root.style.setProperty("--ambient-mascot-bottom", layout.bottomOffsetPx + "px");
    }
    if (Number.isFinite(layout.maxWidthPx)) {
      root.style.setProperty("--ambient-mascot-max-width", layout.maxWidthPx + "px");
    }
    if (Number.isFinite(layout.maxHeightVh)) {
      root.style.setProperty("--ambient-mascot-max-height", layout.maxHeightVh + "vh");
    }
    if (Number.isFinite(layout.clearanceLgPx)) {
      root.style.setProperty("--ambient-mascot-clearance-lg", layout.clearanceLgPx + "px");
    }
    if (Number.isFinite(layout.clearanceMdPx)) {
      root.style.setProperty("--ambient-mascot-clearance-md", layout.clearanceMdPx + "px");
    }
    if (Number.isFinite(layout.clearanceSmPx)) {
      root.style.setProperty("--ambient-mascot-clearance-sm", layout.clearanceSmPx + "px");
    }
  }

  function initApp() {
    const loadResult = loadGame(CONFIG.save.autosave_slot_id);
    if (loadResult.ok && loadResult.gameState) {
      window.gameState = loadResult.gameState;
      if (loadResult.message && loadResult.message !== "Save loaded.") {
        setUiMessage(loadResult.message);
      }
    } else {
      if (loadResult && loadResult.message) {
        setUiMessage(loadResult.message);
      }
      window.gameState = newGameState();
    }
    ensureAutomationState(window.gameState);
    ensureUnlocksState(window.gameState);
    ensureShootOutputsState(window.gameState);
    ensureStoryLogState(window.gameState);
    ensureFlagsState(window.gameState);
    ensureSocialManualStrategyState(window.gameState);
    ensureSocialCollabWeekState(window.gameState);
    ensureReputationState(window.gameState);
    ensureRecruitmentState(window.gameState);
    ensurePlayerUpgradesState(window.gameState);
    ensureStatsState(window.gameState);
    ensureTakeoverState(window.gameState);
    if (typeof ensureAfterHoursState === "function") {
      ensureAfterHoursState(window.gameState);
    }
    if (typeof ensureConquestsState === "function") {
      ensureConquestsState(window.gameState);
    }
    initCompetitionStateIfMissing(window.gameState);
    const storyResult = checkStoryEvents(window.gameState);
    applyAmbientArtLayoutVars();
    if (CONFIG.save.autosave_enabled) {
      const intervalMs = CONFIG.save.autosave_interval_seconds * 1000;
      setInterval(function () {
        const result = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
        if (!result.ok) {
          setUiMessage(result.message || "Autosave failed.");
          renderApp(window.gameState);
        }
      }, intervalMs);
    }
    showScreen("screen-hub");
    renderApp(window.gameState);
    if (storyResult.ok && storyResult.events.length) {
      appendStoryLogEntries(window.gameState, storyResult.events);
      const saveResult = saveGame(window.gameState, CONFIG.save.autosave_slot_id);
      if (!saveResult.ok) {
        setUiMessage(saveResult.message || "");
        renderApp(window.gameState);
      }
      showStoryEvents(storyResult.events);
    }
    setupEventHandlers();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
})();
