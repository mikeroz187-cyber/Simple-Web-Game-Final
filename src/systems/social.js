function postPromoContent(gameState, platform, contentId) {
  if (!gameState || !platform || !contentId) {
    return { ok: false, message: "Select a Promo content entry first." };
  }

  if (CONFIG.social_platforms.platforms.indexOf(platform) === -1) {
    return { ok: false, message: "Invalid platform selection." };
  }

  if (!gameState.social || !Array.isArray(gameState.social.posts)) {
    gameState.social = { posts: [] };
  }

  const entry = gameState.content.entries.find(function (item) {
    return item.id === contentId;
  });

  if (!entry || entry.contentType !== "Promo") {
    return { ok: false, message: "Promo content required for posting." };
  }

  const alreadyPosted = gameState.social.posts.some(function (post) {
    return post.contentId === entry.id && post.platform === platform;
  });

  if (alreadyPosted) {
    return { ok: false, message: "Already posted to " + platform + "." };
  }

  const platformMultiplier = platform === "Instagram"
    ? CONFIG.social_platforms.instagram_reach_multiplier
    : CONFIG.social_platforms.x_reach_multiplier;

  const baseFollowers = Math.round(
    CONFIG.economy.promo_followers_gain * platformMultiplier
  );
  const followersGained = applyEquipmentFollowersMultiplier(baseFollowers, gameState);
  const subscribersGained = calculateSubscribersGained(followersGained);

  const postId = "post_" + (gameState.social.posts.length + 1);
  const post = {
    id: postId,
    dayPosted: gameState.player.day,
    platform: platform,
    contentId: entry.id,
    followersGained: followersGained,
    subscribersGained: subscribersGained
  };

  gameState.social.posts.push(post);
  gameState.player.followers = Math.max(0, gameState.player.followers + followersGained);
  gameState.player.subscribers = Math.max(0, gameState.player.subscribers + subscribersGained);

  return {
    ok: true,
    message: "Posted to " + platform + ". +" + followersGained + " followers."
  };
}
