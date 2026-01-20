function createButton(label, action, extraClass, isDisabled) {
  const classes = ["button"].concat(extraClass ? [extraClass] : []).join(" ");
  const disabledAttr = isDisabled ? " disabled" : "";
  return "<button class=\"" + classes + "\" data-action=\"" + action + "\"" + disabledAttr + ">" + label + "</button>";
}

function createPanel(title, bodyHtml, titleId) {
  const idAttr = titleId ? " id=\"" + titleId + "\"" : "";
  return "<div class=\"panel\"><h2 class=\"screen-title\"" + idAttr + ">" + title + "</h2>" + bodyHtml + "</div>";
}
