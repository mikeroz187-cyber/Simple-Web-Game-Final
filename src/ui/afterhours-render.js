// After Hours UI Rendering

function getAfterHoursContent(performerId) {
  var content = {
    "core_lena_watts": {
      performerName: "Kendra Lynn",
      askTitle: "A Private Word",
      askText: "Kendra lingers after the shoot wraps. She glances at the door, then back at you.<br><br>\"I've been thinking about my rate. I know what I'm worth. And I know how things work around here.\"<br><br>She steps closer.<br><br>\"So let's talk.\"",
      askWant: "Featured scenes (+$50/scene)",
      offerText: "\"One time. Right here. Right now. Then we're even, and I get what I want.\"<br><br>She holds your gaze, waiting.",
      dealText: "THE DEAL: She gets featured scenes. You get this."
    },
    "core_milo_park": {
      performerName: "Abella Banks",
      askTitle: "After Hours",
      askText: "Abella catches you at the door as everyone else leaves.<br><br>\"Hey. Got a second?\"<br><br>She's still in costume. Or half of it.<br><br>\"I want more screen time. Better setups. I know I have to earn it.\"",
      askWant: "Better scenes and screen time",
      offerText: "\"I'm not naive. I know what gets results around here.\"<br><br>She steps into your office and closes the door.",
      dealText: "THE DEAL: She gets better scenes. You get this."
    },
    "core_tess_rowan": {
      performerName: "Jessie Star",
      askTitle: "Staying Late",
      askText: "Jessie's still here. Everyone else left an hour ago.<br><br>\"I need to talk to you about something.\"<br><br>She's nervous but determined.<br><br>\"I want to move up. I'll do whatever it takes.\"",
      askWant: "A chance to prove herself",
      offerText: "\"I mean it. Whatever it takes.\"<br><br>She locks the door before you can respond.",
      dealText: "THE DEAL: She gets her shot. You get this."
    }
  };

  var defaultContent = {
    performerName: "Unknown",
    askTitle: "A Private Conversation",
    askText: "She approaches you after hours with a proposition.",
    askWant: "Better treatment",
    offerText: "\"I think we can help each other out.\"",
    dealText: "THE DEAL: She gets what she wants. You get this."
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
  }
}
