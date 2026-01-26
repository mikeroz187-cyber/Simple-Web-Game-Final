function getWindowedSummary(gameState, windowDays) {
  const windowDaysNumber = Number.isFinite(windowDays) ? windowDays : 0;
  const safeWindowDays = windowDaysNumber > 0 ? windowDaysNumber : 0;
  const currentDay = gameState && gameState.player && Number.isFinite(gameState.player.day)
    ? gameState.player.day
    : 0;
  const startDay = safeWindowDays > 0 ? currentDay - safeWindowDays + 1 : currentDay;
  const summary = {
    windowDays: safeWindowDays,
    mrrDelta: 0,
    socialFollowers: 0,
    socialSubscribers: 0,
    onlyFansSubscribers: 0,
    promoCount: 0,
    premiumCount: 0
  };

  if (!gameState) {
    return summary;
  }

  const entries = gameState.content && Array.isArray(gameState.content.entries)
    ? gameState.content.entries
    : [];

  entries.forEach(function (entry) {
    if (!entry || !Number.isFinite(entry.dayCreated)) {
      return;
    }
    if (entry.dayCreated < startDay || entry.dayCreated > currentDay) {
      return;
    }

    const results = entry.results || {};
    summary.socialFollowers += Number.isFinite(results.socialFollowersGained) ? results.socialFollowersGained : 0;
    summary.socialSubscribers += Number.isFinite(results.socialSubscribersGained) ? results.socialSubscribersGained : 0;
    summary.onlyFansSubscribers += Number.isFinite(results.onlyFansSubscribersGained) ? results.onlyFansSubscribersGained : 0;

    if (entry.contentType === "Promo") {
      summary.promoCount += 1;
    }
    if (entry.contentType === "Premium") {
      summary.premiumCount += 1;
    }
  });

  const posts = gameState.social && Array.isArray(gameState.social.posts)
    ? gameState.social.posts
    : [];

  posts.forEach(function (post) {
    if (!post || !Number.isFinite(post.dayPosted)) {
      return;
    }
    if (post.dayPosted < startDay || post.dayPosted > currentDay) {
      return;
    }

    summary.socialFollowers += Number.isFinite(post.socialFollowersGained) ? post.socialFollowersGained : 0;
    summary.socialSubscribers += Number.isFinite(post.socialSubscribersGained) ? post.socialSubscribersGained : 0;
    summary.onlyFansSubscribers += Number.isFinite(post.onlyFansSubscribersGained) ? post.onlyFansSubscribersGained : 0;
  });

  summary.mrrDelta = getMRRDeltaForSubs(summary.onlyFansSubscribers);

  return summary;
}

function shouldRecordSnapshot(gameState) {
  if (!CONFIG || !CONFIG.analytics || !Number.isFinite(CONFIG.analytics.snapshotFrequencyDays)) {
    return false;
  }
  if (!gameState || !gameState.player || !Number.isFinite(gameState.player.day)) {
    return false;
  }
  return gameState.player.day % CONFIG.analytics.snapshotFrequencyDays === 0;
}

function recordAnalyticsSnapshot(gameState) {
  if (!shouldRecordSnapshot(gameState)) {
    return { ok: false, code: "not_due" };
  }

  if (!gameState.analyticsHistory || !Array.isArray(gameState.analyticsHistory)) {
    gameState.analyticsHistory = [];
  }

  const dayNumber = gameState.player.day;
  const alreadyRecorded = gameState.analyticsHistory.some(function (snapshot) {
    return snapshot && snapshot.dayNumber === dayNumber;
  });

  if (alreadyRecorded) {
    return { ok: false, code: "already_recorded" };
  }

  const snapshot = {
    dayNumber: dayNumber,
    timestamp: Date.now(),
    mrr: getMRR(gameState),
    netWorth: getNetWorth(gameState),
    cash: Number.isFinite(gameState.player.cash) ? gameState.player.cash : 0,
    socialFollowers: Number.isFinite(gameState.player.socialFollowers) ? gameState.player.socialFollowers : 0,
    socialSubscribers: Number.isFinite(gameState.player.socialSubscribers) ? gameState.player.socialSubscribers : 0,
    onlyFansSubscribers: Number.isFinite(gameState.player.onlyFansSubscribers) ? gameState.player.onlyFansSubscribers : 0,
    reputation: Number.isFinite(gameState.player.reputation) ? gameState.player.reputation : 0,
    totalShoots: gameState.content && Array.isArray(gameState.content.entries) ? gameState.content.entries.length : 0,
    totalPosts: gameState.social && Array.isArray(gameState.social.posts) ? gameState.social.posts.length : 0
  };

  gameState.analyticsHistory.push(snapshot);
  return { ok: true, code: "snapshot_recorded" };
}
