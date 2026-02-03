function createSeededRng(seed) {
  let value = Number.isFinite(seed) ? seed >>> 0 : 1;
  return function () {
    const next = getNextSeededFloat(value);
    value = next.seed;
    return next.value;
  };
}

function getNextSeededFloat(seed) {
  const safeSeed = Number.isFinite(seed) ? seed >>> 0 : 1;
  const nextSeed = (safeSeed * 1664525 + 1013904223) >>> 0;
  return { seed: nextSeed, value: nextSeed / 4294967296 };
}

function randomIntInclusive(min, max) {
  const minValue = Number.isFinite(min) ? Math.ceil(min) : 0;
  const maxValue = Number.isFinite(max) ? Math.floor(max) : minValue;
  if (maxValue <= minValue) {
    return minValue;
  }
  return Math.floor(Math.random() * (maxValue - minValue + 1)) + minValue;
}
