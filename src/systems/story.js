function checkStoryEvents(gameState) {
  if (!gameState || !gameState.story || !gameState.player) {
    return { ok: false, events: [] };
  }

  const events = [];
  const currentDay = gameState.player.day;

  if (!gameState.story.act2 || typeof gameState.story.act2 !== "object" || Array.isArray(gameState.story.act2)) {
    gameState.story.act2 = { eventsShown: [], lastEventId: null };
  }
  if (!Array.isArray(gameState.story.act2.eventsShown)) {
    gameState.story.act2.eventsShown = [];
  }
  if (!gameState.story.act3 || typeof gameState.story.act3 !== "object" || Array.isArray(gameState.story.act3)) {
    gameState.story.act3 = { eventsShown: [], lastEventId: null };
  }
  if (!Array.isArray(gameState.story.act3.eventsShown)) {
    gameState.story.act3.eventsShown = [];
  }

  if (!gameState.story.introShown && currentDay === CONFIG.story.act1.act1_intro_day) {
    gameState.story.introShown = true;
    events.push({ id: CONFIG.story.act1.intro.id, day: currentDay });
  }

  CONFIG.story.act1.act1_debt_reminder_days.forEach(function (day) {
    if (day === currentDay && gameState.story.debtReminderDaysShown.indexOf(day) === -1) {
      gameState.story.debtReminderDaysShown.push(day);
      const reminder = CONFIG.story.act1.debtReminders.find(function (entry) {
        return entry.triggerDay === day;
      });
      events.push({ id: reminder ? reminder.id : "debt_reminder_" + day, day: day });
    }
  });

  if (currentDay === gameState.player.debtDueDay) {
    const endEvent = gameState.player.debtRemaining <= 0
      ? CONFIG.story.act1.endEvents.win
      : CONFIG.story.act1.endEvents.loss;
    events.push({ id: endEvent.id, day: currentDay });
  }

  if (CONFIG.story.act2 && Array.isArray(CONFIG.story.act2.schedule)) {
    CONFIG.story.act2.schedule.forEach(function (entry) {
      if (!entry || entry.triggerDay !== currentDay) {
        return;
      }
      if (gameState.story.act2.eventsShown.indexOf(entry.id) !== -1) {
        return;
      }
      gameState.story.act2.eventsShown.push(entry.id);
      gameState.story.act2.lastEventId = entry.id;
      events.push({ id: entry.id, day: currentDay });
    });
  }

  if (CONFIG.story.act3 && Array.isArray(CONFIG.story.act3.schedule)) {
    CONFIG.story.act3.schedule.forEach(function (entry) {
      if (!entry || entry.triggerDay !== currentDay) {
        return;
      }
      if (gameState.story.act3.eventsShown.indexOf(entry.id) !== -1) {
        return;
      }
      applyAct3EventEffects(gameState, entry.id);
      gameState.story.act3.eventsShown.push(entry.id);
      gameState.story.act3.lastEventId = entry.id;
      events.push({ id: entry.id, day: currentDay });
    });
  }

  return { ok: true, events: events };
}

const STORY_EVENT_COPY = {
  act1_intro_day1: {
    title: "Loan Due, Day 90",
    message: "You start with a $5,000 cash loan, but the debt is $10,000 due by Day 90. This is the only debt in the MVP and it must be cleared before the end of Day 90. Keep cash flow tight and prioritize steady MRR early."
  },
  act1_pack01_client_referral_day15: {
    title: "Client Referral Pipeline",
    message: "A satisfied client passes your name along. The booking inbox feels lighter, and your schedule steadies."
  },
  act1_pack01_premium_editing_day25: {
    title: "Premium Editing Standards",
    message: "You tighten post-production standards. The studio’s output feels more deliberate and confident."
  },
  act1_pack01_vendor_discount_day45: {
    title: "Vendor Discount Window",
    message: "A reliable vendor offers a short discount window. You plan the next shoots with less friction."
  },
  act1_pack01_repeat_commissions_day70: {
    title: "Repeat Commissions Roll In",
    message: "Repeat clients begin to return on schedule. The studio’s rhythm starts to feel dependable."
  },
  act1_pack01_final_stretch_day85: {
    title: "Final Stretch Focus",
    message: "With the deadline near, you lock in on steady work. Consistency becomes the only priority."
  },
  act1_pack02_sponsor_ping_day22: {
    title: "Sponsor Ping, No String Attached",
    message: "A sponsor slides into your inbox with a winking subject line and a tidy contract. No demands, just a reminder that attention has a price tag—and yours is climbing."
  },
  act1_pack02_backroom_buzz_day29: {
    title: "Backroom Buzz",
    message: "A private forum thread starts dissecting your numbers with the reverence of conspiracy theorists and stock traders. The consensus is clear: you’re not a secret anymore."
  },
  act1_pack02_rumor_polish_day37: {
    title: "Rumor, Polished",
    message: "Someone packages your latest rumors into a glossy “origin story.” It’s flattering, overproduced, and a little filthy-minded, which makes it travel even faster."
  },
  act1_pack02_midnight_metrics_day46: {
    title: "Midnight Metrics",
    message: "You wake up to see the dashboard still climbing. The numbers are doing that thing where they don’t stop, and you don’t feel like sleeping anymore."
  },
  act1_pack02_press_quote_day55: {
    title: "Press Quote, Carefully Spicy",
    message: "A journalist asks for a single line to sum you up. You give them something tasteful with a bite, and it gets repeated like a mantra."
  },
  act1_pack02_whisper_network_day63: {
    title: "Whisper Network",
    message: "A quiet network starts routing work your way, the kind that pays more for discretion than effort. It feels like the city just nudged you toward the velvet rope."
  },
  act1_pack02_fanmail_stack_day72: {
    title: "Fanmail Stack",
    message: "The inbox is now a queue of confessions, proposals, and dubious ideas. It’s messy, flattering, and very good for the ego—and the myth."
  },
  act1_pack02_late_act1_fever_day83: {
    title: "Late Act 1 Fever",
    message: "There’s a heat in the room even when no one is there. You can feel the next step looking at you, counting the days like you do."
  },
  act1_pack03_debt_spiral_day18: {
    title: "The Clock Starts Talking Back",
    message: "You wake up and swear the calendar is louder today. Every dollar feels like it has a due date. The good news? Panic is a fantastic productivity tool. The bad news? It charges interest."
  },
  act1_pack03_power_trip_day36: {
    title: "You’re Not ‘Trying’ Anymore",
    message: "Somewhere between the fourth spreadsheet and the fifth ‘quick shoot,’ it clicks: you’re not surviving — you’re directing traffic. People are waiting on your calls now. It’s… addictive."
  },
  act1_pack03_debt_pressure_day63: {
    title: "Friendly Reminder (Not Friendly)",
    message: "A message comes in with no greeting and no punctuation. Just numbers. Dates. A polite suggestion that you keep things ‘smooth.’ Your studio feels bigger than it used to… but so does the shadow behind it."
  },
  act1_pack03_empire_swagger_day84: {
    title: "Empire Mode: Enabled",
    message: "You catch your own reflection and don’t recognize the rookie anymore. This place runs on your decisions. The debt is still there, sure — but now it feels less like a threat and more like an opponent you plan to embarrass."
  },
  act1_debt_reminder_day30: {
    title: "Debt Check — Day 30",
    message: "Thirty days in, the $10,000 debt clock is already ticking. You still have 60 days to close the gap. Keep shoots consistent and avoid unnecessary costs."
  },
  act1_debt_reminder_day60: {
    title: "Debt Check — Day 60",
    message: "Day 60 puts you in the final stretch. The $10,000 debt is due in 30 days, and cash on hand will decide the outcome. Audit your plan and keep MRR predictable."
  },
  act1_debt_reminder_day80: {
    title: "Debt Check — Day 80",
    message: "Ten days left before the Day 90 deadline. If the debt is not covered by then, the game ends. Focus on high-confidence shoots and minimize risk."
  },
  act1_end_win_day90: {
    title: "Debt Cleared",
    message: "You paid the $10,000 debt on time. The studio is stable, and the loan is behind you. You now have a real foundation for long-term growth."
  },
  act2_saturation_activated: {
    title: "Debt Cleared — Act 2",
    message: "Debt cleared. Congrats—you’re legit now. Unfortunately, the market noticed. New Premium subs will taper as you grow (Saturation tiers are now active)."
  },
  act2_competition_unlocked: {
    title: "Act 2 — Rivals Wake Up",
    message: "Debt cleared. The market noticed. Rival studios are now active—competition pressure will affect your results."
  },
  act1_end_loss_day90: {
    title: "Defaulted on the Debt",
    message: "The $10,000 debt was not paid by Day 90. The lender shuts the studio down, and the run ends here. Use what you learned to plan a tighter start next time."
  },
  act2_expansion_plan_day95: {
    title: "Expansion Plan Drafted",
    message: "With the debt cleared, you formalize a growth plan focused on steady MRR and brand consistency. New hires and upgrades are now on the table."
  },
  act2_staffing_push_day120: {
    title: "Staffing Push",
    message: "Demand is rising, and capacity is tight. You greenlight a staffing push to stabilize booking consistency."
  },
  act2_studio_upgrade_day145: {
    title: "Studio Upgrade Decision",
    message: "Production quality is plateauing. You decide to invest in equipment upgrades to keep premium output competitive."
  },
  act2_partnership_offer_day170: {
    title: "Partnership Offer",
    message: "A platform partner offers cross-promotion in exchange for consistent premium releases. You accept and lock in a long-term collaboration."
  },
  act3_brand_legacy_day200: {
    title: "Brand Legacy Review",
    message: "Your studio is now a recognizable brand. You commit to a legacy plan that prioritizes long-term reputation and stability."
  },
  act3_market_shift_day225: {
    title: "Market Shift",
    message: "Audience preferences pivot toward premium experiences. You adjust strategy to defend MRR and protect retention."
  },
  act3_mentorship_day245: {
    title: "Mentorship and Succession",
    message: "You begin mentoring a successor team to preserve studio standards while scaling output."
  },
  act3_exit_strategy_day270: {
    title: "Exit Strategy",
    message: "You formalize a long-term exit strategy focused on stability and legacy recognition."
  },
  unlock_equipment_lighting: {
    title: "Unlocked!",
    message: "New gear available: Lighting upgrades."
  },
  unlock_performer_aria_lux: {
    title: "Unlocked!",
    message: "New performer available: Aria Lux."
  },
  unlock_equipment_camera: {
    title: "Unlocked!",
    message: "New gear available: Camera upgrades."
  },
  unlock_performer_bryn_sterling: {
    title: "Unlocked!",
    message: "New performer available: Bryn Sterling."
  },
  unlock_performer_dahlia_slate: {
    title: "Unlocked!",
    message: "New performer available: Dahlia Slate."
  },
  unlock_performer_eden_frost: {
    title: "Unlocked!",
    message: "New performer available: Eden Frost."
  },
  unlock_performer_fern_kestrel: {
    title: "Unlocked!",
    message: "New performer available: Fern Kestrel."
  },
  unlock_performer_celeste_noir: {
    title: "Unlocked!",
    message: "New performer available: Celeste Noir."
  },
  unlock_performer_gigi_blade: {
    title: "Unlocked!",
    message: "New performer available: Gigi Blade."
  },
  unlock_equipment_set_dressing: {
    title: "Unlocked!",
    message: "New gear available: Set Dressing upgrades."
  }
};

function getAct3EventEffects(eventId) {
  if (!eventId || !CONFIG.story || !CONFIG.story.act3 || !CONFIG.story.act3.effects) {
    return null;
  }
  const effects = CONFIG.story.act3.effects[eventId];
  if (!effects || typeof effects !== "object") {
    return null;
  }
  return effects;
}

function formatSignedNumber(value) {
  if (!Number.isFinite(value) || value === 0) {
    return "";
  }
  return (value > 0 ? "+" : "") + value;
}

function formatCashDelta(value) {
  if (!Number.isFinite(value) || value === 0) {
    return "";
  }
  const sign = value > 0 ? "+" : "-";
  return sign + "$" + Math.abs(value);
}

function buildAct3EffectSummaryParts(effects) {
  if (!effects) {
    return [];
  }
  const parts = [];
  if (Number.isFinite(effects.cashDelta) && effects.cashDelta !== 0) {
    parts.push(formatCashDelta(effects.cashDelta) + " cash");
  }
  if (Number.isFinite(effects.reputationDelta) && effects.reputationDelta !== 0) {
    parts.push(formatSignedNumber(effects.reputationDelta) + " reputation");
  }
  if (Number.isFinite(effects.socialFollowersDelta) && effects.socialFollowersDelta !== 0) {
    parts.push(formatSignedNumber(effects.socialFollowersDelta) + " social followers");
  }
  if (Number.isFinite(effects.fatigueAllPerformersDelta) && effects.fatigueAllPerformersDelta !== 0) {
    parts.push(formatSignedNumber(effects.fatigueAllPerformersDelta) + " fatigue (all performers)");
  }
  return parts;
}

function buildEffectSummaryText(summaryParts) {
  if (!Array.isArray(summaryParts) || summaryParts.length === 0) {
    return "";
  }
  return "Effect: " + summaryParts.join(", ");
}

function applyAct3EventEffects(gameState, eventId) {
  if (!gameState || !gameState.player) {
    return "";
  }
  const effects = getAct3EventEffects(eventId);
  if (!effects) {
    return "";
  }
  if (Number.isFinite(effects.cashDelta) && effects.cashDelta !== 0) {
    gameState.player.cash = Math.max(0, gameState.player.cash + effects.cashDelta);
  }
  if (Number.isFinite(effects.reputationDelta) && effects.reputationDelta !== 0) {
    if (!Number.isFinite(gameState.player.reputation)) {
      gameState.player.reputation = 0;
    }
    gameState.player.reputation = Math.max(0, gameState.player.reputation + effects.reputationDelta);
  }
  if (Number.isFinite(effects.socialFollowersDelta) && effects.socialFollowersDelta !== 0) {
    if (!Number.isFinite(gameState.player.socialFollowers)) {
      gameState.player.socialFollowers = 0;
    }
    gameState.player.socialFollowers = Math.max(0, gameState.player.socialFollowers + effects.socialFollowersDelta);
  }
  if (Number.isFinite(effects.fatigueAllPerformersDelta) && effects.fatigueAllPerformersDelta !== 0) {
    if (gameState.roster && Array.isArray(gameState.roster.performers)) {
      gameState.roster.performers.forEach(function (performer) {
        if (!performer || !Number.isFinite(performer.fatigue)) {
          return;
        }
        performer.fatigue = Math.max(0, performer.fatigue + effects.fatigueAllPerformersDelta);
      });
    }
  }
  const summaryParts = buildAct3EffectSummaryParts(effects);
  return buildEffectSummaryText(summaryParts);
}

function getPerformerUnlockContext(eventId) {
  if (!eventId || eventId.indexOf("unlock_performer_") !== 0) {
    return null;
  }
  const candidates = CONFIG.recruitment && Array.isArray(CONFIG.recruitment.candidates)
    ? CONFIG.recruitment.candidates
    : [];
  const candidate = candidates.find(function (entry) {
    return entry && entry.storyId === eventId && typeof entry.performerId === "string";
  }) || null;
  if (!candidate) {
    return null;
  }
  const performerId = candidate.performerId;
  const repRequired = candidate && Number.isFinite(candidate.repRequired) ? candidate.repRequired : 0;
  const hireCost = candidate && Number.isFinite(candidate.hireCost) ? candidate.hireCost : 0;
  const catalog = CONFIG.performers && CONFIG.performers.catalog ? CONFIG.performers.catalog : {};
  const performer = catalog && catalog[performerId];
  const performerName = performer && performer.name ? performer.name : performerId;
  return {
    performerId: performerId,
    performerName: performerName,
    repRequired: repRequired,
    hireCost: hireCost
  };
}

function getStoryEventCopy(eventId, gameState) {
  const unlockContext = getPerformerUnlockContext(eventId);
  if (unlockContext) {
    const baseCopy = STORY_EVENT_COPY[eventId] || {
      title: "Unlocked!",
      message: "New performer lead: " + unlockContext.performerName + "."
    };
    const resolvedState = gameState || (typeof window !== "undefined" ? window.gameState : null);
    const currentRep = resolvedState && resolvedState.player && Number.isFinite(resolvedState.player.reputation)
      ? resolvedState.player.reputation
      : 0;
    const repRequired = Number.isFinite(unlockContext.repRequired) ? unlockContext.repRequired : 0;
    const hireCost = Number.isFinite(unlockContext.hireCost) ? unlockContext.hireCost : 0;
    const repStatusText = currentRep >= repRequired
      ? "Ready to recruit now (Reputation ≥ " + repRequired + ")."
      : "Requires Reputation ≥ " + repRequired + ".";
    const costText = "Hire cost: " + formatCurrency(hireCost) + ".";
    const callToAction = "Go to Roster → Recruitment to sign her.";
    const recruitmentText = "Recruitment: " + repStatusText + " " + costText + " " + callToAction;
    return {
      title: baseCopy.title,
      message: baseCopy.message + "\n\n" + recruitmentText
    };
  }

  const baseCopy = STORY_EVENT_COPY[eventId] || { title: "Story Update", message: "A story event occurred." };
  const summaryText = buildEffectSummaryText(buildAct3EffectSummaryParts(getAct3EventEffects(eventId)));
  if (!summaryText) {
    return baseCopy;
  }
  return {
    title: baseCopy.title,
    message: baseCopy.message + "\n\n" + summaryText
  };
}

function appendStoryLogEntries(gameState, events) {
  if (!gameState || !Array.isArray(events) || events.length === 0) {
    return [];
  }
  ensureStoryLogState(gameState);
  const logged = [];
  events.forEach(function (event) {
    if (!event || typeof event.id !== "string") {
      return;
    }
    const exists = gameState.storyLog.some(function (entry) {
      return entry.id === event.id;
    });
    if (exists) {
      return;
    }
    const copy = getStoryEventCopy(event.id, gameState);
    const dayNumber = Number.isFinite(event.day)
      ? event.day
      : (gameState.player && Number.isFinite(gameState.player.day) ? gameState.player.day : 0);
    const entry = {
      id: event.id,
      dayNumber: dayNumber,
      title: copy.title,
      body: copy.message,
      timestamp: new Date().toISOString()
    };
    gameState.storyLog.push(entry);
    logged.push(entry);
  });
  return logged;
}
