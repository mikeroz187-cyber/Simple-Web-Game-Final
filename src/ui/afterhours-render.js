// After Hours UI Rendering

function getAfterHoursContent(performerId) {
  var content = {
    // CORE PERFORMERS
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
    },

    // RECRUIT PERFORMERS
    "recruit_aria_lux": {
      performerName: "Aria Afterdark",
      askTitle: "Ambition Knocks",
      askText: "Aria appears in your doorway after the last crew member leaves.<br><br>\"I didn't get where I am by being patient.\"<br><br>She steps inside, closing the door behind her.<br><br>\"I want headline billing. And I know exactly how to get it.\"",
      askWant: "Headline billing on premium content",
      offerText: "\"Let's skip the part where we pretend this is complicated.\"<br><br>She's already walking toward you.",
      lockText: "\"Smart choice.\"<br><br>Aria locks the door without breaking eye contact.<br><br><em>*click*</em>",
      buildText: "She moves like she's rehearsed this. Maybe she has.<br><br>\"I'm very good at what I do,\" she says, sliding off her jacket. \"All of what I do.\"<br><br>She straddles the arm of your chair.<br><br>\"Let me show you.\"",
      aftermathText: "Aria checks her makeup in her phone screen.<br><br>\"I'll expect to see my name at the top of tomorrow's call sheet.\"<br><br>It's not a request.",
      dealText: "THE DEAL: She gets headline billing. You get this.",
      outcomeLabel: "Aria gets headline billing"
    },
    "recruit_bryn_sterling": {
      performerName: "Scarlett Sterling",
      askTitle: "A Business Proposal",
      askText: "Scarlett knocks twice, then enters without waiting.<br><br>\"I've run the numbers. My content outperforms half your roster, but my rate doesn't reflect that.\"<br><br>She sits on the edge of your desk.<br><br>\"Let's renegotiate.\"",
      askWant: "A significant rate increase",
      offerText: "\"I'm prepared to offer... additional services. As a signing bonus.\"<br><br>Her hand rests on your arm.",
      lockText: "\"Then we have a deal.\"<br><br>Scarlett stands, walks to the door, and turns the lock with a decisive click.<br><br><em>*click*</em>",
      buildText: "\"I believe in being thorough,\" she says, unbuttoning her blouse with methodical precision.<br><br>\"In all my negotiations.\"<br><br>She folds her clothes neatly on your desk.<br><br>\"Now. Let's discuss terms.\"",
      aftermathText: "Scarlett is dressed and composed within minutes.<br><br>\"I'll have my new contract expectations on your desk by morning.\"<br><br>She leaves like she's leaving any other business meeting.",
      dealText: "THE DEAL: She gets a raise. You get this.",
      outcomeLabel: "Scarlett's rate increases"
    },
    "recruit_celeste_noir": {
      performerName: "Celeste Sin",
      askTitle: "After Dark",
      askText: "Celeste finds you alone. She always seems to know when you're alone.<br><br>\"I've been watching you,\" she says. \"Watching how you watch me.\"<br><br>She traces a finger along your desk.<br><br>\"I want my own content line. And I think you want something too.\"",
      askWant: "Her own premium content series",
      offerText: "\"I can be very... persuasive.\"<br><br>She's closer now. You didn't see her move.",
      lockText: "You nod.<br><br>Celeste smiles slowly and reaches behind her to turn the lock.<br><br><em>*click*</em><br><br>\"Good choice.\"",
      buildText: "The lights seem to dim on their own. Or maybe she did it. You're not sure.<br><br>\"I've done things,\" she whispers, \"that would make your other girls blush.\"<br><br>Her dress pools at her feet.<br><br>\"Want to see?\"",
      aftermathText: "Celeste is at the door before you've caught your breath.<br><br>\"My series starts next week.\"<br><br>She doesn't look back. She doesn't need to.",
      dealText: "THE DEAL: She gets her own series. You get this.",
      outcomeLabel: "Celeste gets her content series"
    },
    "recruit_dahlia_slate": {
      performerName: "Dahlia Kane",
      askTitle: "Power Move",
      askText: "Dahlia closes your office door and leans against it.<br><br>\"Let's be honest with each other. I'm your best earner, and we both know it.\"<br><br>She walks toward you slowly.<br><br>\"I want producer credit on my content. And I know how to make that happen.\"",
      askWant: "Producer credit on her content",
      offerText: "\"I've closed bigger deals than this. But never one I've looked forward to more.\"<br><br>She sits in your lap without asking.",
      lockText: "\"I thought so.\"<br><br>Dahlia reaches over and flicks the lock without getting up.<br><br><em>*click*</em>",
      buildText: "\"I didn't get this far by being subtle,\" she says, pulling her top over her head.<br><br>\"I see something I want, I take it.\"<br><br>She pushes you back in your chair.<br><br>\"Right now, I want this.\"",
      aftermathText: "Dahlia buttons her blouse like nothing happened.<br><br>\"I'll send over the paperwork for my producer credit.\"<br><br>She kisses your cheek on the way out. \"Pleasure doing business.\"",
      dealText: "THE DEAL: She gets producer credit. You get this.",
      outcomeLabel: "Dahlia gets producer credit"
    },
    "recruit_eden_frost": {
      performerName: "Eden Ivy",
      askTitle: "Cool Proposition",
      askText: "Eden waits until everyone's gone, then slips into your office.<br><br>\"I don't do drama. I don't do games.\"<br><br>She closes the door quietly.<br><br>\"I want a guaranteed contract. Twelve months. And I'm prepared to earn it tonight.\"",
      askWant: "A 12-month guaranteed contract",
      offerText: "\"I'm not like the others. I won't beg or flirt. I'll just... deliver.\"<br><br>She begins unbuttoning her coat.",
      lockText: "\"Efficient. I like that.\"<br><br>Eden locks the door.<br><br><em>*click*</em><br><br>\"Let's be efficient together.\"",
      buildText: "She undresses with calm precision. No show, no tease. Just purpose.<br><br>\"I'm going to make this very simple for you,\" she says.<br><br>\"Sit back. Don't talk.\"<br><br>She kneels.",
      aftermathText: "Eden is dressed and at the door in under a minute.<br><br>\"I'll expect the contract by end of week.\"<br><br>She's gone before you can respond.",
      dealText: "THE DEAL: She gets job security. You get this.",
      outcomeLabel: "Eden gets her guaranteed contract"
    },
    "recruit_fern_kestrel": {
      performerName: "Raven Foxx",
      askTitle: "The Closer",
      askText: "Raven intercepts you at your office door.<br><br>\"You've been avoiding my calls about the international distribution deal.\"<br><br>She backs you into your office.<br><br>\"I want my content going global. Let's talk about how to make that happen.\"",
      askWant: "International distribution for her content",
      offerText: "\"I'm very good at closing deals.\"<br><br>She pushes your door shut with her foot.<br><br>\"Let me demonstrate.\"",
      lockText: "\"You won't regret this.\"<br><br>Raven turns the lock.<br><br><em>*click*</em><br><br>\"Well. You might. In the best way.\"",
      buildText: "She's aggressive. Confident. Her hands are on your belt before you can sit down.<br><br>\"I've wanted to do this since my first day,\" she admits.<br><br>\"The deal is just a bonus.\"",
      aftermathText: "Raven fixes her lipstick using your desk lamp as a mirror.<br><br>\"International. By end of quarter.\"<br><br>She winks on the way out.",
      dealText: "THE DEAL: She goes global. You get this.",
      outcomeLabel: "Raven gets international distribution"
    },
    "recruit_gigi_blade": {
      performerName: "Gigi Blade",
      askTitle: "All In",
      askText: "Gigi bursts into your office like she owns the place.<br><br>\"I'm done waiting for my shot at the premium tier. I've earned it ten times over.\"<br><br>She kicks the door closed behind her.<br><br>\"So here's what's gonna happen.\"",
      askWant: "Promotion to premium tier talent",
      offerText: "\"I'm not gonna beg. That's not my style.\"<br><br>She pulls her shirt over her head.<br><br>\"I'm gonna take what I want. You're gonna enjoy it. Then we're both gonna get what we need.\"",
      lockText: "You reach over and lock the door yourself.<br><br><em>*click*</em><br><br>Gigi grins. \"Now we're talking.\"",
      buildText: "She doesn't do slow. She doesn't do gentle. That's not who she is.<br><br>\"Keep up,\" she says, pushing you onto the couch.<br><br>\"Or don't. I'll do the work either way.\"",
      aftermathText: "Gigi pulls on her clothes while heading for the door.<br><br>\"Premium tier. Tomorrow. Make it happen.\"<br><br>She's gone before you can even nod.",
      dealText: "THE DEAL: She goes premium. You get this.",
      outcomeLabel: "Gigi moves to premium tier"
    }
  };

  return content[performerId] || content["core_lena_watts"];
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
  var fee = getAfterHoursOneTimeFee(performer.id);
  var feeLabel = formatCurrency(fee);
  var canAfford = canAffordAfterHours(gameState, fee);
  var declinePenalty = Number.isFinite(CONFIG.afterHours.declineLoyaltyPenalty)
    ? CONFIG.afterHours.declineLoyaltyPenalty
    : 0;
  var declineDays = Number.isFinite(CONFIG.afterHours.declineCooldownDays)
    ? CONFIG.afterHours.declineCooldownDays
    : 0;

  var counterSection = '';
  if (canCounterStar || (canCounterRecruit && hasRecruitOption)) {
    counterSection = '<button class="button secondary" data-action="after-hours-counter" data-performer="' + performer.id + '">Counter-offer</button>';
  }

  var warningText = '';
  if (!canAfford) {
    warningText = '<div class="after-hours-warning">You need ' + feeLabel + ' cash on hand to accept.</div>';
  }

  return '<div class="modal-overlay after-hours-modal">' +
    '<div class="modal-card after-hours-card">' +
    '<h3 class="after-hours-title">The Offer</h3>' +
    '<div class="after-hours-text">' + content.offerText + '</div>' +
    '<div class="after-hours-offer-box">' +
    '<div><strong>WHAT SHE WANTS:</strong> Cash. Tonight.</div>' +
    '<div><strong>THE DEAL:</strong> Pay ' + feeLabel + ' right now and she’s all smiles again.</div>' +
    '<div><strong>CONSEQUENCE:</strong> If you dismiss her: -' + declinePenalty + ' Loyalty and she won’t come back for ' + declineDays + ' days.</div>' +
    '</div>' +
    warningText +
    '<div class="button-row">' +
    '<button class="button primary" data-action="after-hours-accept" data-performer="' + performer.id + '"' + (canAfford ? '' : ' disabled') + '>Pay ' + feeLabel + ' (Accept)</button>' +
    counterSection +
    '<button class="button secondary" data-action="after-hours-dismiss">Dismiss (Loyalty -' + declinePenalty + ')</button>' +
    '</div>' +
    '</div>' +
    '</div>';
}

function renderAfterHoursCounterModal(performer, content, gameState) {
  var canCounterStar = canAcceptCounterOffer(gameState, "star");
  var canCounterRecruit = canAcceptCounterOffer(gameState, "recruit");
  var recruitId = getRecruitUnlockForPerformer(performer.id);
  var hasRecruitOption = recruitId !== null;
  var fee = getAfterHoursOneTimeFee(performer.id);
  var feeLabel = formatCurrency(fee);
  var canAfford = canAffordAfterHours(gameState, fee);

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

  var warningText = '';
  if (!canAfford) {
    warningText = '<div class="after-hours-warning">You need ' + feeLabel + ' cash on hand to accept.</div>';
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
    warningText +
    '<div class="button-row">' +
    '<button class="button primary" data-action="after-hours-submit-counter" data-performer="' + performer.id + '">Offer these terms</button>' +
    '<button class="button secondary" data-action="after-hours-accept" data-performer="' + performer.id + '"' + (canAfford ? '' : ' disabled') + '>Just accept her original offer</button>' +
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
