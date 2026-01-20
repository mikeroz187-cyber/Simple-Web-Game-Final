(function () {
  function initApp() {
    window.gameState = newGameState();
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
    setupEventHandlers();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initApp);
  } else {
    initApp();
  }
})();
