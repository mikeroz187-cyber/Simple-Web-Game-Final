function newGameState() {
  const now = new Date().toISOString();

  return {
    version: CONFIG.save.save_schema_version,
    createdAt: now,
    updatedAt: now,
    player: {
      day: CONFIG.game.starting_day,
      cash: CONFIG.game.starting_cash,
      debtRemaining: CONFIG.game.loan_total_due,
      debtDueDay: CONFIG.game.debt_due_day,
      followers: 0,
      subscribers: 0,
      reputation: CONFIG.progression.starting_reputation,
      lifetimeRevenue: 0
    },
    roster: {
      performers: CONFIG.performers.core_ids
        .concat(CONFIG.performers.freelance_ids)
        .map(function (id) {
          const performer = CONFIG.performers.catalog[id];
          return {
            id: performer.id,
            name: performer.name,
            type: performer.type,
            starPower: performer.starPower,
            fatigue: 0,
            loyalty: CONFIG.performers.starting_loyalty
          };
        })
    },
    content: {
      lastContentId: null,
      entries: []
    },
    social: {
      posts: []
    },
    unlocks: {
      locationTier1Unlocked: false
    },
    story: {
      introShown: false,
      debtReminderDaysShown: []
    }
  };
}
