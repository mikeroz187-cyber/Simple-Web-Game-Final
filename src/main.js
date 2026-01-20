(function () {
  function initApp() {
    window.gameState = newGameState();
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
