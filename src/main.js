(function () {
  function initApp() {
    window.gameState = newGameState();
    const storyResult = checkStoryEvents(window.gameState);
    if (CONFIG.save.autosave_enabled) {
      const intervalMs = CONFIG.save.autosave_interval_seconds * 1000;
      setInterval(function () {
        const result = saveGame(window.gameState);
        if (!result.ok) {
          setUiMessage(result.message || "Autosave failed.");
          renderApp(window.gameState);
        }
      }, intervalMs);
    }
    showScreen("screen-hub");
    renderApp(window.gameState);
    if (storyResult.ok && storyResult.events.length) {
      const saveResult = saveGame(window.gameState);
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
