// After Hours UI Rendering

function getAfterHoursContent(performerId) {
  var content = {
    "core_lena_watts": {
      performerName: "Kendra Lynn",
      askTitle: "A Private Word",
      askText: "Kendra lingers after the shoot wraps. She glances at the door, then back at you.<br><br>\"I've been thinking about my rate. I know what I'm worth. And I know how things work around here.\"<br><br>She steps closer.<br><br>\"So let's talk.\"",
      askWant: "Featured scenes (+$50/scene)",
      offerText: "\"One time. Right here. Right now. Then we're even, and I get what I want.\"<br><br>She holds your gaze, waiting.",
      lockText: "\"Deal.\"<br><br>Kendra holds your gaze for a moment.<br><br>Then she turns and locks the door.<br><br><em>*click*</em>",
      buildText: "She dims the lights. Not off. Just low enough that the office feels smaller. More private.<br><br>You watch her slip her jacket from her shoulders. It falls to the floor. She doesn't pick it up.<br><br>\"You just sit there,\" she says.<br><br>\"Let me do this.\"<br><br>She walks toward your desk.",
      aftermathText: "She gathers her things without looking at you.<br><br>At the door, she pauses.<br><br>\"We're even now.\"<br><br>She leaves. The office is quiet.<br><br>You finish your drink.",
      dealText: "THE DEAL: She gets featured scenes. You get this.",
      outcomeLabel: "Kendra's scenes now pay +$50"
    },
    "core_milo_park": {
      performerName: "Abella Banks",
      askTitle: "After Hours",
      askText: "Abella catches you at the door as everyone else leaves.<br><br>\"Hey. Got a second?\"<br><br>She's still in costume. Or half of it.<br><br>\"I want more screen time. Better setups. I know I have to earn it.\"",
      askWant: "Better scenes and screen time",
      offerText: "\"I'm not naive. I know what gets results around here.\"<br><br>She steps into your office and closes the door.",
      lockText: "\"Alright.\"<br><br>Abella smiles. Not sweet. Knowing.<br><br>She reaches past you and turns the lock.<br><br><em>*click*</em>",
      buildText: "She doesn't waste time. Her hands are already at her collar, undoing buttons with practiced ease.<br><br>\"I've thought about this,\" she admits. \"What I'd do. How I'd make it worth your while.\"<br><br>Her top hits the floor.<br><br>\"Don't look so surprised.\"",
      aftermathText: "Abella fixes her hair in the reflection of your window.<br><br>\"I expect to see my name higher on the call sheet.\"<br><br>She doesn't wait for confirmation. She already knows.",
      dealText: "THE DEAL: She gets screen time. You get this.",
      outcomeLabel: "Abella gets better scenes"
    },
    "core_tess_rowan": {
      performerName: "Jessie Star",
      askTitle: "Staying Late",
      askText: "Jessie's still here. Everyone else left an hour ago.<br><br>\"I need to talk to you about something.\"<br><br>She's nervous but determined.<br><br>\"I want to move up. I'll do whatever it takes.\"",
      askWant: "A chance to prove herself",
      offerText: "\"I mean it. Whatever it takes.\"<br><br>She locks the door before you can respond.",
      lockText: "You don't say anything.<br><br>Jessie takes that as a yes.<br><br>She turns the deadbolt herself.<br><br><em>*click*</em>",
      buildText: "Her hands are shaking slightly as she pulls off her sweater.<br><br>\"I've never... not like this,\" she says quietly. \"But I want this. I want to be someone here.\"<br><br>She steps closer.<br><br>\"Show me what you want.\"",
      aftermathText: "Jessie gets dressed slowly, like she's processing what just happened.<br><br>\"So... I'll get better scenes now, right?\"<br><br>You nod.<br><br>She almost smiles. \"Good.\"",
      dealText: "THE DEAL: She gets her shot. You get this.",
      outcomeLabel: "Jessie moves up the roster"
    }
  };

  var defaultContent = {
    performerName: "Unknown",
    askTitle: "A Private Conversation",
    askText: "She approaches you after hours with a proposition.",
    askWant: "Better treatment",
    offerText: "\"I think we can help each other out.\"",
    lockText: "\"Deal.\"<br><br>She locks the door.<br><br><em>*click*</em>",
    buildText: "She moves closer.<br><br>What happens next is inevitable.",
    aftermathText: "She leaves without a word.<br><br>Business concluded.",
    dealText: "THE DEAL: She gets what she wants. You get this.",
    outcomeLabel: "Deal complete"
  };

  return content[performerId] || defaultContent;
}

function renderAfterHoursKnockModal() {
  return '<div class="modal-overlay after-hours-modal">' +
    '<div class="modal-card after-hours-card">' +
    '<div class="after-hours-knock-text">' +
    '<p>The day wraps up.</p>' +
    '<p>You\'re about to head home when—</p>' +
    '<p class="knock-sound">*knock knock*</p>' +
    '</div>' +
    '<div class="button-row">' +
    '<button class="button primary" data-action="after-hours-answer">Answer the door</button>' +
    '<button class="button secondary" data-action="after-hours-ignore">Ignore it</button>' +
    '</div>' +
    '</div>' +
    '</div>';
}

function renderAfterHoursAskModal(performer, content) {
  return '<div class="modal-overlay after-hours-modal">' +
    '<div class="modal-card after-hours-card">' +
    '<h3 class="after-hours-title">' + content.askTitle + '</h3>' +
    '<div class="after-hours-text">' + content.askText + '</div>' +
    '<div class="after-hours-want">' +
    '<strong>WHAT SHE WANTS:</strong> ' + content.askWant +
    '</div>' +
    '<div class="button-row">' +
    '<button class="button primary" data-action="after-hours-engage" data-performer="' + performer.id + '">What are you offering?</button>' +
    '<button class="button secondary" data-action="after-hours-dismiss">Not interested. Get out.</button>' +
    '</div>' +
    '</div>' +
    '</div>';
}

function renderAfterHoursOfferModal(performer, content, gameState) {
  var canCounterStar = canAcceptCounterOffer(gameState, "star");
  var canCounterRecruit = canAcceptCounterOffer(gameState, "recruit");
  var recruitId = getRecruitUnlockForPerformer(performer.id);
  var hasRecruitOption = recruitId !== null;

  var counterSection = '';
  if (canCounterStar || (canCounterRecruit && hasRecruitOption)) {
    counterSection = '<button class="button secondary" data-action="after-hours-counter" data-performer="' + performer.id + '">Counter-offer</button>';
  }

  return '<div class="modal-overlay after-hours-modal">' +
    '<div class="modal-card after-hours-card">' +
    '<h3 class="after-hours-title">The Offer</h3>' +
    '<div class="after-hours-text">' + content.offerText + '</div>' +
    '<div class="after-hours-offer-box">' +
    '<div><strong>HER OFFER:</strong> One-time. Right here. Right now.</div>' +
    '<div><strong>IN EXCHANGE FOR:</strong> ' + content.askWant + '</div>' +
    '</div>' +
    '<div class="button-row">' +
    '<button class="button primary" data-action="after-hours-accept" data-performer="' + performer.id + '">Accept her terms</button>' +
    counterSection +
    '<button class="button secondary" data-action="after-hours-dismiss">Dismiss her</button>' +
    '</div>' +
    '</div>' +
    '</div>';
}

function renderAfterHoursCounterModal(performer, content, gameState) {
  var canCounterStar = canAcceptCounterOffer(gameState, "star");
  var canCounterRecruit = canAcceptCounterOffer(gameState, "recruit");
  var recruitId = getRecruitUnlockForPerformer(performer.id);
  var hasRecruitOption = recruitId !== null;

  var starOption = '<div class="counter-option ' + (canCounterStar ? '' : 'disabled') + '">' +
    '<input type="radio" name="counter-type" value="star" id="counter-star" ' + (canCounterStar ? '' : 'disabled') + '>' +
    '<label for="counter-star">"You do exactly what I say on set."<br><small>→ Her Star Rating +1</small>' +
    (canCounterStar ? '' : '<br><small class="rep-warning">Requires ' + CONFIG.afterHours.starBonusReputationRequired + ' Rep</small>') +
    '</label></div>';

  var recruitOption = '';
  if (hasRecruitOption) {
    recruitOption = '<div class="counter-option ' + (canCounterRecruit ? '' : 'disabled') + '">' +
      '<input type="radio" name="counter-type" value="recruit" id="counter-recruit" ' + (canCounterRecruit ? '' : 'disabled') + '>' +
      '<label for="counter-recruit">"You help me recruit someone new."<br><small>→ Unlocks a new performer</small>' +
      (canCounterRecruit ? '' : '<br><small class="rep-warning">Requires ' + CONFIG.afterHours.recruitHelpReputationRequired + ' Rep</small>') +
      '</label></div>';
  }

  return '<div class="modal-overlay after-hours-modal">' +
    '<div class="modal-card after-hours-card">' +
    '<h3 class="after-hours-title">Your Terms</h3>' +
    '<div class="after-hours-text">' +
    '"One time?" You lean back. "That\'s not how this works."<br><br>' +
    'She hesitates. "What do you mean?"' +
    '</div>' +
    '<div class="counter-options">' +
    starOption +
    recruitOption +
    '</div>' +
    '<div class="button-row">' +
    '<button class="button primary" data-action="after-hours-submit-counter" data-performer="' + performer.id + '">Offer these terms</button>' +
    '<button class="button secondary" data-action="after-hours-accept" data-performer="' + performer.id + '">Just accept her original offer</button>' +
    '</div>' +
    '</div>' +
    '</div>';
}

function renderAfterHoursRefusalModal(performer) {
  return '<div class="modal-overlay after-hours-modal">' +
    '<div class="modal-card after-hours-card">' +
    '<h3 class="after-hours-title">Refused</h3>' +
    '<div class="after-hours-text">' +
    getAfterHoursRefusalMessage() + '<br><br>' +
    'She grabs her things and leaves.<br><br>' +
    '<em>' + performer.name + ' won\'t approach you again for a while.</em>' +
    '</div>' +
    '<div class="button-row">' +
    '<button class="button primary" data-action="after-hours-end">Continue</button>' +
    '</div>' +
    '</div>' +
    '</div>';
}

function showAfterHoursModal(html) {
  var modalRoot = document.getElementById("modal-root");
  if (modalRoot) {
    modalRoot.innerHTML = html;
    document.body.classList.add("after-hours-active");
  }
}

function hideAfterHoursModal() {
  var modalRoot = document.getElementById("modal-root");
  if (modalRoot) {
    modalRoot.innerHTML = "";
  }
  document.body.classList.remove("after-hours-active");
}

function renderAfterHoursLockModal(performer, content) {
  var lockText = content.lockText || "\"Deal.\"<br><br>She locks the door.<br><br><em>*click*</em>";
  return '<div class="modal-overlay after-hours-modal">' +
    '<div class="modal-card after-hours-card after-hours-beat">' +
    '<div class="after-hours-beat-text">' + lockText + '</div>' +
    '<div class="button-row">' +
    '<button class="button primary" data-action="after-hours-next-beat" data-performer="' + performer.id + '">Continue</button>' +
    '</div>' +
    '</div>' +
    '</div>';
}

function renderAfterHoursBuildModal(performer, content) {
  var buildText = content.buildText || "She walks toward you.<br><br>The rest happens quickly.";
  return '<div class="modal-overlay after-hours-modal">' +
    '<div class="modal-card after-hours-card after-hours-beat">' +
    '<div class="after-hours-beat-text">' + buildText + '</div>' +
    '<div class="button-row">' +
    '<button class="button primary" data-action="after-hours-start-slideshow" data-performer="' + performer.id + '">Continue</button>' +
    '</div>' +
    '</div>' +
    '</div>';
}

function renderAfterHoursSlideshowModal(performer, content, imagePaths, currentIndex) {
  var totalImages = imagePaths.length;
  var currentPath = imagePaths[currentIndex] || "";
  var bgPath = CONFIG.afterHours.imagePaths.systemBackground;

  var dots = "";
  for (var i = 0; i < totalImages; i++) {
    dots += '<span class="slideshow-dot ' + (i === currentIndex ? 'active' : '') + '"></span>';
  }

  var dealText = content.dealText || "THE DEAL: She gets what she wants. You get this.";

  return '<div class="modal-overlay after-hours-modal after-hours-slideshow-overlay" style="background-image: url(\'' + bgPath + '\');">' +
    '<div class="after-hours-slideshow-frame">' +
    '<div class="after-hours-slideshow-container">' +
    '<div class="after-hours-slideshow-image-wrapper">' +
    '<img src="' + currentPath + '" class="after-hours-slideshow-image" alt="" onerror="this.style.display=\'none\'">' +
    '</div>' +
    '<div class="after-hours-slideshow-progress">' + dots + '</div>' +
    '<div class="after-hours-slideshow-deal">' + dealText + '</div>' +
    '<button class="button primary after-hours-slideshow-next" data-action="after-hours-slideshow-next" data-performer="' + performer.id + '">' +
    (currentIndex < totalImages - 1 ? 'Next →' : 'Continue') +
    '</button>' +
    '</div>' +
    '</div>' +
    '</div>';
}

function renderAfterHoursAftermathModal(performer, content, result) {
  var aftermathText = content.aftermathText || "She leaves without a word.<br><br>The office is quiet.";
  var outcomeLabel = content.outcomeLabel || "Deal complete";

  var outcomesHtml = '<div class="after-hours-outcomes">';
  outcomesHtml += '<div class="outcome-line">✓ ' + outcomeLabel + '</div>';
  outcomesHtml += '<div class="outcome-line">✓ 10 images unlocked in Gallery</div>';
  if (result && result.bonusApplied) {
    outcomesHtml += '<div class="outcome-line outcome-bonus">✓ ' + result.bonusApplied + '</div>';
  }
  outcomesHtml += '</div>';

  return '<div class="modal-overlay after-hours-modal">' +
    '<div class="modal-card after-hours-card">' +
    '<div class="after-hours-text">' + aftermathText + '</div>' +
    outcomesHtml +
    '<div class="button-row">' +
    '<button class="button primary" data-action="after-hours-end">End Night</button>' +
    '</div>' +
    '</div>' +
    '</div>';
}
