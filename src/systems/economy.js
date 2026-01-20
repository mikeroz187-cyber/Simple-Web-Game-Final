function calculateShootCost(location) {
  if (!location) {
    return { ok: false, value: 0, message: "Select a location to calculate cost." };
  }
  const cost = CONFIG.economy.base_shoot_cost + location.cost;
  return { ok: true, value: Math.max(0, Math.round(cost)) };
}

function calculatePromoFollowers(performer, theme) {
  if (!performer || !theme) {
    return { ok: false, value: 0 };
  }
  const followersGained = Math.round(
    CONFIG.economy.promo_followers_gain *
    theme.modifiers.followersMult *
    performer.starPower
  );
  return { ok: true, value: Math.max(0, followersGained) };
}

function calculatePremiumRevenue(performer, theme) {
  if (!performer || !theme) {
    return { ok: false, value: 0 };
  }
  const revenue = Math.round(
    CONFIG.economy.premium_base_revenue *
    theme.modifiers.revenueMult *
    performer.starPower
  );
  return { ok: true, value: Math.max(0, revenue) };
}

function calculateSubscribersGained(followersGained) {
  const safeFollowers = Number.isFinite(followersGained) ? followersGained : 0;
  const subscribersGained = Math.floor(
    safeFollowers * CONFIG.economy.subscriber_conversion_rate
  );
  return Math.max(0, subscribersGained);
}
