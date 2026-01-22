function getWindowedSummary(gameState, windowDays) {
  const windowDaysNumber = Number.isFinite(windowDays) ? windowDays : 0;
  const safeWindowDays = windowDaysNumber > 0 ? windowDaysNumber : 0;
  const currentDay = gameState && gameState.player && Number.isFinite(gameState.player.day)
    ? gameState.player.day
    : 0;
  const startDay = safeWindowDays > 0 ? currentDay - safeWindowDays + 1 : currentDay;
  const summary = {
    windowDays: safeWindowDays,
    revenue: 0,
    followers: 0,
    subscribers: 0,
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
    summary.revenue += Number.isFinite(results.revenue) ? results.revenue : 0;
    summary.followers += Number.isFinite(results.followersGained) ? results.followersGained : 0;
    summary.subscribers += Number.isFinite(results.subscribersGained) ? results.subscribersGained : 0;

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

    summary.followers += Number.isFinite(post.followersGained) ? post.followersGained : 0;
    summary.subscribers += Number.isFinite(post.subscribersGained) ? post.subscribersGained : 0;
  });

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
    lifetimeRevenue: Number.isFinite(gameState.player.lifetimeRevenue) ? gameState.player.lifetimeRevenue : 0,
    cash: Number.isFinite(gameState.player.cash) ? gameState.player.cash : 0,
    followers: Number.isFinite(gameState.player.followers) ? gameState.player.followers : 0,
    subscribers: Number.isFinite(gameState.player.subscribers) ? gameState.player.subscribers : 0,
    reputation: Number.isFinite(gameState.player.reputation) ? gameState.player.reputation : 0,
    totalShoots: gameState.content && Array.isArray(gameState.content.entries) ? gameState.content.entries.length : 0,
    totalPosts: gameState.social && Array.isArray(gameState.social.posts) ? gameState.social.posts.length : 0
  };

  gameState.analyticsHistory.push(snapshot);
  return { ok: true, code: "snapshot_recorded" };
}
