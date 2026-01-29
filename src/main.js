(function () {
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
    ensureSocialManualStrategyState(window.gameState);
    ensureReputationState(window.gameState);
    ensureRecruitmentState(window.gameState);
    ensurePlayerUpgradesState(window.gameState);
    if (typeof ensureConquestsState === "function") {
      ensureConquestsState(window.gameState);
    }
    initCompetitionStateIfMissing(window.gameState);
    const storyResult = checkStoryEvents(window.gameState);
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
