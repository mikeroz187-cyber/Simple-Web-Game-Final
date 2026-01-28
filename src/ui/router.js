function showScreen(screenId) {
  var screens = document.querySelectorAll(".screen");
  var targetScreen = document.getElementById(screenId);
  var applyMascotUpdate = function() {
    if (typeof updateMascot === "function") {
      updateMascot(screenId);
    }
  };

  if (!targetScreen) return;

  // Find currently active screen
  var activeScreen = document.querySelector(".screen.is-active");

  if (activeScreen && activeScreen.id !== screenId) {
    // Use transition animation
    activeScreen.classList.add("screen--exiting");

    setTimeout(function() {
      screens.forEach(function(screen) {
        screen.classList.remove("is-active", "screen--exiting");
      });

      targetScreen.classList.add("is-active", "screen--entering");
      applyMascotUpdate();

      // Remove entering class after animation
      setTimeout(function() {
        targetScreen.classList.remove("screen--entering");
      }, 150);
    }, 150);
  } else if (!activeScreen) {
    targetScreen.classList.add("is-active");
    applyMascotUpdate();
  } else {
    applyMascotUpdate();
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
