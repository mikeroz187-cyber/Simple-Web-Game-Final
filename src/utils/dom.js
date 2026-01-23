function qs(selector, scope) {
  return (scope || document).querySelector(selector);
}

function qsa(selector, scope) {
  return Array.from((scope || document).querySelectorAll(selector));
}

function isDebugEnabled() {
  if (!CONFIG || !CONFIG.debug || !CONFIG.debug.enabled) {
    return false;
  }
  const params = new URLSearchParams(window.location.search);
  return params.get(CONFIG.debug.queryParam) === CONFIG.debug.queryValue;
}
