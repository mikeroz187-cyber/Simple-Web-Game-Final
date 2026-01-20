function createSeededRng(seed) {
  let value = seed || 1;
  return function () {
    value = (value * 9301 + 49297) % 233280;
    return value / 233280;
  };
}
