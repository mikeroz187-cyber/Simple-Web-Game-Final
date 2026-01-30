function showScreen(screenId) {
  var screens = document.querySelectorAll(".screen");
  var targetScreen = document.getElementById(screenId);

  if (!targetScreen) return;

  var applyMascotUpdate = function() {
    if (typeof updateMascot === "function") {
      updateMascot(screenId);
    }
  };

  // Find currently active screen
  var activeScreen = document.querySelector(".screen.is-active");

  // If same screen, do nothing
  if (activeScreen && activeScreen.id === screenId) {
    applyMascotUpdate();
    return;
  }

  if (activeScreen) {
    // Animate out the current screen
    activeScreen.classList.add("screen--exiting");

    setTimeout(function() {
      // Remove active from all screens
      screens.forEach(function(screen) {
        screen.classList.remove("is-active", "screen--exiting", "screen--entering");
      });

      // Show target screen - start invisible
      targetScreen.classList.add("is-active");

      // Force a reflow to ensure the initial state is applied
      void targetScreen.offsetWidth;

      // Update mascot
      applyMascotUpdate();

      // Trigger stagger entrance if available
      if (typeof triggerStaggerEntrance === "function") {
        triggerStaggerEntrance(targetScreen);
      }

      // Re-render the app to ensure content is fresh
      if (typeof renderApp === "function" && window.gameState) {
        renderApp(window.gameState);
      }
    }, 150);
  } else {
    // No active screen - just show target immediately
    targetScreen.classList.add("is-active");
    applyMascotUpdate();

    if (typeof triggerStaggerEntrance === "function") {
      triggerStaggerEntrance(targetScreen);
    }
  }

  // Sync nav rail active state
  document.querySelectorAll(".nav-item[data-action=\"nav-screen\"]").forEach(function(navItem) {
    var navScreenId = navItem.getAttribute("data-screen");
    if (navScreenId === screenId) {
      navItem.classList.add("is-active");
    } else {
      navItem.classList.remove("is-active");
    }
  });
}
