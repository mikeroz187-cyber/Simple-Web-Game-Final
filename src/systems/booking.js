function confirmBooking(gameState, selection) {
  if (!gameState || !selection) {
    return { ok: false, message: "Select all fields before confirming." };
  }

  if (gameState.player.day >= gameState.player.debtDueDay) {
    return { ok: false, message: "Day limit reached. No more shoots allowed." };
  }

  const performer = gameState.roster.performers.find(function (entry) {
    return entry.id === selection.performerId;
  });
  if (!performer) {
    return { ok: false, message: "Select a performer." };
  }
  if (!isPerformerAvailable(performer)) {
    return { ok: false, message: "Performer is unavailable due to fatigue." };
  }

  const location = CONFIG.locations.catalog[selection.locationId];
  if (!location) {
    return { ok: false, message: "Select a location." };
  }
  if (location.tier === 1 && !gameState.unlocks.locationTier1Unlocked) {
    return { ok: false, message: "Tier 1 locations are locked." };
  }

  const theme = CONFIG.themes.mvp.themes[selection.themeId];
  if (!theme) {
    return { ok: false, message: "Select a theme." };
  }

  if (CONFIG.content_types.available.indexOf(selection.contentType) === -1) {
    return { ok: false, message: "Select a content type." };
  }

  const shootCostResult = calculateShootCost(location);
  if (!shootCostResult.ok) {
    return { ok: false, message: "Unable to calculate shoot cost." };
  }

  const shootCost = shootCostResult.value;
  if (gameState.player.cash < shootCost) {
    return { ok: false, message: "Not enough cash for this shoot." };
  }

  let followersGained = 0;
  let revenue = 0;
  if (selection.contentType === "Promo") {
    const promoResult = calculatePromoFollowers(performer, theme);
    followersGained = promoResult.ok ? promoResult.value : 0;
  } else {
    const premiumResult = calculatePremiumRevenue(performer, theme);
    revenue = premiumResult.ok ? premiumResult.value : 0;
  }

  const subscribersGained = calculateSubscribersGained(followersGained);
  const feedbackSummary = selection.contentType === "Promo"
    ? "Promo reach boosted visibility."
    : "Premium release generated revenue.";

  const contentId = "content_" + (gameState.content.entries.length + 1);
  const entry = {
    id: contentId,
    dayCreated: gameState.player.day,
    performerId: performer.id,
    locationId: location.id,
    themeId: theme.id,
    contentType: selection.contentType,
    shootCost: shootCost,
    results: {
      revenue: revenue,
      followersGained: followersGained,
      subscribersGained: subscribersGained,
      feedbackSummary: feedbackSummary
    }
  };

  gameState.player.cash = Math.max(0, gameState.player.cash - shootCost + revenue);
  gameState.player.followers = Math.max(0, gameState.player.followers + followersGained);
  gameState.player.subscribers = Math.max(0, gameState.player.subscribers + subscribersGained);

  gameState.content.entries.push(entry);
  gameState.content.lastContentId = entry.id;

  updatePerformerStats(gameState, performer.id);
  const shootsPerDay = CONFIG.game.shoots_per_day;
  const currentShoots = Number.isFinite(gameState.player.shootsToday) ? gameState.player.shootsToday : 0;
  const nextShoots = currentShoots + 1;
  gameState.player.shootsToday = nextShoots;

  let storyEvents = [];
  if (nextShoots >= shootsPerDay) {
    gameState.player.shootsToday = 0;
    gameState.player.day += 1;
    recoverAllPerformers(gameState);
    const storyResult = checkStoryEvents(gameState);
    storyEvents = storyResult.events || [];
  }

  return {
    ok: true,
    contentId: entry.id,
    message: "Shoot booked. +" + followersGained + " followers, +" + formatCurrency(revenue) + ".",
    storyEvents: storyEvents
  };
}
