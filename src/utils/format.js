function formatCurrency(value) {
  const safeValue = Number.isFinite(value) ? value : 0;
  return "$" + safeValue.toFixed(0);
}
