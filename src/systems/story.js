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

  const debtRemaining = Number.isFinite(gameState.player.debtRemaining)
    ? gameState.player.debtRemaining
    : 0;
  if (debtRemaining > 0) {
    CONFIG.story.act1.act1_debt_reminder_days.forEach(function (day) {
      if (day === currentDay && gameState.story.debtReminderDaysShown.indexOf(day) === -1) {
        gameState.story.debtReminderDaysShown.push(day);
        const reminder = CONFIG.story.act1.debtReminders.find(function (entry) {
          return entry.triggerDay === day;
        });
        if (!reminder) {
          return;
        }
        events.push({ id: reminder.id, day: day });
      }
    });
  }

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
    message: "You start with a $5,000 cash loan, but the debt is {{debtTotal}} due by Day 90. This is the only debt in the MVP and it must be cleared before the end of Day 90. Keep cash flow tight and prioritize steady MRR early."
  },
  act1_debt_reminder_day30: {
    title: "Debt Check — Day 30",
    message: "Thirty days in, the {{debtTotal}} debt clock is already ticking. You still have 60 days to close the gap. Keep shoots consistent and avoid unnecessary costs."
  },
  act1_debt_reminder_day60: {
    title: "Debt Check — Day 60",
    message: "Day 60 puts you in the final stretch. The {{debtTotal}} debt is due in 30 days, and cash on hand will decide the outcome. Audit your plan and keep MRR predictable."
  },
  act1_debt_reminder_day80: {
    title: "Debt Check — Day 80",
    message: "Ten days left before the Day 90 deadline. If the debt is not covered by then, the game ends. Focus on high-confidence shoots and minimize risk."
  },
  act1_end_win_day90: {
    title: "Debt Cleared",
    message: "You paid the {{debtTotal}} debt on time. The studio is stable, and the loan is behind you. You now have a real foundation for long-term growth."
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
    message: "The {{debtTotal}} debt was not paid by Day 90. The lender shuts the studio down, and the run ends here. Use what you learned to plan a tighter start next time."
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
    message: "New talent lead: Aria Afterdark. New talent becomes available as your Reputation grows. Check Roster → Recruitment."
  },
  unlock_equipment_camera: {
    title: "Unlocked!",
    message: "New gear available: Camera upgrades."
  },
  unlock_performer_bryn_sterling: {
    title: "Unlocked!",
    message: "New talent lead: Scarlett Sterling. New talent becomes available as your Reputation grows. Check Roster → Recruitment."
  },
  unlock_performer_dahlia_slate: {
    title: "Unlocked!",
    message: "New talent lead: Dahlia Kane. New talent becomes available as your Reputation grows. Check Roster → Recruitment."
  },
  unlock_performer_eden_frost: {
    title: "Unlocked!",
    message: "New talent lead: Eden Ivy. New talent becomes available as your Reputation grows. Check Roster → Recruitment."
  },
  unlock_performer_fern_kestrel: {
    title: "Unlocked!",
    message: "New talent lead: Raven Foxx. New talent becomes available as your Reputation grows. Check Roster → Recruitment."
  },
  unlock_performer_celeste_noir: {
    title: "Unlocked!",
    message: "New talent lead: Celeste Sin. New talent becomes available as your Reputation grows. Check Roster → Recruitment."
  },
  unlock_performer_gigi_blade: {
    title: "Unlocked!",
    message: "New talent lead: Gigi Blade. New talent becomes available as your Reputation grows. Check Roster → Recruitment."
  },
  unlock_equipment_set_dressing: {
    title: "Unlocked!",
    message: "New gear available: Set Dressing upgrades."
  }
};

function getReferencedStoryEventIdsFromConfig() {
  const ids = new Set();
  const addId = function (value) {
    if (typeof value === "string") {
      ids.add(value);
    }
  };
  if (!CONFIG || typeof CONFIG !== "object") {
    return [];
  }
  const story = CONFIG.story || {};
  const act1 = story.act1 || {};
  if (Array.isArray(act1.schedule)) {
    act1.schedule.forEach(function (entry) {
      addId(entry && entry.id);
    });
  }
  if (act1.intro) {
    addId(act1.intro.id);
  }
  if (Array.isArray(act1.debtReminders)) {
    act1.debtReminders.forEach(function (entry) {
      addId(entry && entry.id);
    });
  }
  if (act1.endEvents) {
    addId(act1.endEvents.win && act1.endEvents.win.id);
    addId(act1.endEvents.loss && act1.endEvents.loss.id);
  }
  const act2 = story.act2 || {};
  if (Array.isArray(act2.schedule)) {
    act2.schedule.forEach(function (entry) {
      addId(entry && entry.id);
    });
  }
  const act3 = story.act3 || {};
  if (Array.isArray(act3.schedule)) {
    act3.schedule.forEach(function (entry) {
      addId(entry && entry.id);
    });
  }
  const progression = CONFIG.progression || {};
  if (Array.isArray(progression.unlockSchedule)) {
    progression.unlockSchedule.forEach(function (entry) {
      addId(entry && entry.storyId);
    });
  }
  const recruitment = CONFIG.recruitment || {};
  if (Array.isArray(recruitment.candidates)) {
    recruitment.candidates.forEach(function (entry) {
      addId(entry && entry.storyId);
    });
  }
  const market = CONFIG.market || {};
  if (market.competition && typeof market.competition.unlockMessageId === "string") {
    addId(market.competition.unlockMessageId);
  }
  if (market.saturation && typeof market.saturation.unlockMessageId === "string") {
    addId(market.saturation.unlockMessageId);
  }
  return Array.from(ids).sort();
}

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

function resolvePerformerUnlockCopy(eventId, gameState) {
  if (!eventId || eventId.indexOf("unlock_performer_") !== 0) {
    return null;
  }
  const candidates = CONFIG.recruitment && Array.isArray(CONFIG.recruitment.candidates)
    ? CONFIG.recruitment.candidates
    : [];
  const candidate = candidates.find(function (entry) {
    return entry && entry.storyId === eventId;
  });
  if (!candidate) {
    return null;
  }
  const performerId = candidate.performerId;
  if (typeof performerId !== "string") {
    return null;
  }
  const repRequired = Number.isFinite(candidate.repRequired) ? candidate.repRequired : 0;
  const hireCost = Number.isFinite(candidate.hireCost) ? candidate.hireCost : 0;
  const catalog = CONFIG.performers && CONFIG.performers.catalog ? CONFIG.performers.catalog : {};
  const performer = catalog && catalog[performerId];
  const performerName = performer && performer.name ? performer.name : (performerId || "New performer");
  const resolvedState = gameState || (typeof window !== "undefined" ? window.gameState : null);
  const currentRep = resolvedState && resolvedState.player && Number.isFinite(resolvedState.player.reputation)
    ? resolvedState.player.reputation
    : 0;
  const costText = "Hire cost: " + formatCurrency(hireCost) + ".";
  const callToAction = "New talent becomes available as your Reputation grows. Check Roster → Recruitment.";
  const message = currentRep < repRequired
    ? "New talent lead: " + performerName + ". Requires Reputation ≥ " + repRequired + " to recruit. " + costText + " " + callToAction
    : performerName + " is ready to recruit now. " + costText + " " + callToAction;
  return { title: "Unlocked!", message: message };
}

function getDebtTotalText(gameState) {
  const resolvedState = gameState || (typeof window !== "undefined" ? window.gameState : null);
  const player = resolvedState && resolvedState.player ? resolvedState.player : null;
  const debtValue = player && Number.isFinite(player.debtInitialPrincipal)
    ? player.debtInitialPrincipal
    : (Number.isFinite(CONFIG.game.loan_total_due) ? CONFIG.game.loan_total_due : 0);
  const formatValue = typeof formatCurrency === "function"
    ? formatCurrency
    : function (value) { return "$" + Math.round(value).toLocaleString(); };
  return formatValue(Math.max(0, debtValue));
}

function applyStoryTokens(message, gameState) {
  if (typeof message !== "string") {
    return message;
  }
  return message.replace(/\{\{debtTotal\}\}/g, getDebtTotalText(gameState));
}

function getStoryEventCopy(eventId, gameState) {
  const performerUnlockCopy = resolvePerformerUnlockCopy(eventId, gameState);
  if (performerUnlockCopy) {
    return performerUnlockCopy;
  }

  const baseCopy = STORY_EVENT_COPY[eventId] || { title: "Story Update", message: "A story event occurred." };
  const resolvedCopy = {
    title: baseCopy.title,
    message: applyStoryTokens(baseCopy.message, gameState)
  };
  const summaryText = buildEffectSummaryText(buildAct3EffectSummaryParts(getAct3EventEffects(eventId)));
  if (!summaryText) {
    return resolvedCopy;
  }
  return {
    title: resolvedCopy.title,
    message: resolvedCopy.message + "\n\n" + summaryText
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
