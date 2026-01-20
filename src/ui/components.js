function createButton(label, action, extraClass) {
  const classes = ["button"].concat(extraClass ? [extraClass] : []).join(" ");
  return "<button class=\"" + classes + "\" data-action=\"" + action + "\">" + label + "</button>";
}

function createPanel(title, bodyHtml) {
  return "<div class=\"panel\"><h2 class=\"screen-title\">" + title + "</h2>" + bodyHtml + "</div>";
}
