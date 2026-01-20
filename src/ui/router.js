function showScreen(screenId) {
  qsa(".screen").forEach(function (screen) {
    if (screen.id === screenId) {
      screen.classList.add("is-active");
    } else {
      screen.classList.remove("is-active");
    }
  });
}
