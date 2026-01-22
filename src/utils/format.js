function formatCurrency(value) {
  const safeValue = Number.isFinite(value) ? value : 0;
  return "$" + safeValue.toFixed(0);
}

const DEFAULT_PERFORMER_PORTRAIT_SVG = [
  "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"96\" height=\"96\" viewBox=\"0 0 96 96\">",
  "<rect width=\"96\" height=\"96\" fill=\"#eef1f6\"/>",
  "<circle cx=\"48\" cy=\"38\" r=\"18\" fill=\"#c3cad6\"/>",
  "<rect x=\"20\" y=\"62\" width=\"56\" height=\"22\" rx=\"10\" fill=\"#c3cad6\"/>",
  "</svg>"
].join("");

const DEFAULT_PERFORMER_PORTRAIT_PATH =
  "data:image/svg+xml;utf8," + encodeURIComponent(DEFAULT_PERFORMER_PORTRAIT_SVG);

function getPerformerPortraitPath(performer) {
  if (!performer || typeof performer.portraitPath !== "string") {
    return DEFAULT_PERFORMER_PORTRAIT_PATH;
  }
  const trimmed = performer.portraitPath.trim();
  return trimmed ? trimmed : DEFAULT_PERFORMER_PORTRAIT_PATH;
}

function getPerformerPortraitSizePx() {
  return CONFIG.ui.main_padding_px * 4;
}

function getPerformerPortraitRadiusPx() {
  return CONFIG.ui.panel_gap_px / 2;
}

function getLocationThumbnailPath(location) {
  if (!location || typeof location.thumbnailPath !== "string") {
    return CONFIG.LOCATION_PLACEHOLDER_THUMB_PATH;
  }
  const trimmed = location.thumbnailPath.trim();
  return trimmed ? trimmed : CONFIG.LOCATION_PLACEHOLDER_THUMB_PATH;
}

function getLocationThumbnailSizePx() {
  return CONFIG.ui.main_padding_px * 3;
}

function getLocationThumbnailRadiusPx() {
  return CONFIG.ui.panel_gap_px / 2;
}
