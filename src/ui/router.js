function showScreen(screenId) {
  var screens = document.querySelectorAll(".screen");
  screens.forEach(function (screen) {
    screen.classList.remove("is-active");
  });
  var target = document.getElementById(screenId);
  if (target) {
    target.classList.add("is-active");
  }
  document.querySelectorAll(".nav-item[data-action=\"nav-screen\"]").forEach(function (navItem) {
    var navScreenId = navItem.getAttribute("data-screen");
    if (navScreenId === screenId) {
      navItem.classList.add("is-active");
    } else {
      navItem.classList.remove("is-active");
    }
  });
}
