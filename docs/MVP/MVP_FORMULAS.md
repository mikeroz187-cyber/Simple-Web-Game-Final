STATUS: Historical (MVP reference). MVP is complete and frozen. For current scope, see CURRENT_SCOPE.md.

# MVP Gameplay Formulas

This document defines the **exact MVP formulas** used for gameplay calculations. It is the source of truth so no one has to guess.

All formulas reference **`config.toml`** values via `CONFIG.*` and use only MVP data inputs.

**Single Source of Truth (MVP numeric values)**
- `config.toml` is authoritative for **all MVP numeric values**, including economy tuning and catalog data (locations, performers, themes).
- The `docs/DATA_*.md` tables are **mirrors for readability** and must be kept in sync with `config.toml`.

**Balancing Note**
- Economy tuning values (promo followers, premium base revenue, subscriber conversion, base shoot cost) and theme modifiers are intentionally conservative placeholders for MVP balancing. Update them in `config.toml` first, then mirror changes into the data tables.

---

## 1) Shoot Cost Formula

**Plain English**
- The final shoot cost is the **base shoot cost** from config **plus** the **selected location’s per-shoot cost**.
- No additional modifiers (themes, star power, etc.) apply in MVP.

**Code-ready expression**
```js
const shootCost = CONFIG.economy.base_shoot_cost + selectedLocation.cost;
```

**Config values used**
- `CONFIG.economy.base_shoot_cost`

---

## 2) Promo Results Formula (Followers Gained)

**Plain English**
- Promo follower gain starts with a **base promo follower value**.
- It is multiplied by the selected theme’s **followers multiplier** and the performer’s **star power**.
- The result is rounded to a whole number.

**Code-ready expression**
```js
const followersGained = Math.round(
  CONFIG.economy.promo_followers_gain *
  selectedTheme.modifiers.followersMult *
  performer.starPower
);
```

**Config values used**
- `CONFIG.economy.promo_followers_gain`

---

## 3) Premium Results Formula (Revenue)

**Plain English**
- Premium revenue starts with a **base revenue value**.
- It is multiplied by the selected theme’s **revenue multiplier** and the performer’s **star power**.
- The result is rounded to a whole number.
- MVP does **not** add a separate subscriber bonus multiplier; the base revenue is the MVP proxy for subscriber revenue.

**Code-ready expression**
```js
const revenue = Math.round(
  CONFIG.economy.premium_base_revenue *
  selectedTheme.modifiers.revenueMult *
  performer.starPower
);
```

**Config values used**
- `CONFIG.economy.premium_base_revenue`

---

## 4) Subscriber Conversion Formula

**Plain English**
- New subscribers are a **fixed percentage of new followers**.
- The result is rounded down to keep the value an integer.

**Code-ready expression**
```js
const subscribersGained = Math.floor(
  newFollowers * CONFIG.economy.subscriber_conversion_rate
);
```

**Config values used**
- `CONFIG.economy.subscriber_conversion_rate`

---

## 5) Social Post Impact Formula (Instagram vs X)

**Plain English**
- Social posts use the **base promo follower gain** and apply the platform’s reach multiplier.
- The result is rounded to a whole number.
- Instagram uses `instagram_reach_multiplier`, and X uses `x_reach_multiplier`.

**Code-ready expression**
```js
const platformMultiplier = platform === "Instagram"
  ? CONFIG.social_platforms.instagram_reach_multiplier
  : CONFIG.social_platforms.x_reach_multiplier;

const followersGained = Math.round(
  CONFIG.economy.promo_followers_gain * platformMultiplier
);
```

**Config values used**
- `CONFIG.economy.promo_followers_gain`
- `CONFIG.social_platforms.instagram_reach_multiplier`
- `CONFIG.social_platforms.x_reach_multiplier`

---

## 6) Fatigue Formula

**Plain English**
- Each shoot adds a **fixed fatigue amount**.
- Each in-game day of rest removes a **fixed fatigue amount**.
- Fatigue is clamped between `0` and the maximum fatigue value.

**Code-ready expression**
```js
const fatigueAfterShoot = Math.min(
  CONFIG.performers.max_fatigue,
  performer.fatigue + CONFIG.performers.fatigue_per_shoot
);

const fatigueAfterRest = Math.max(
  0,
  performer.fatigue - CONFIG.performers.fatigue_recovery_per_day
);
```

**Config values used**
- `CONFIG.performers.fatigue_per_shoot`
- `CONFIG.performers.fatigue_recovery_per_day`
- `CONFIG.performers.max_fatigue`

---

## 7) Availability Threshold

**Plain English**
- A performer is **unavailable** when their fatigue reaches the maximum allowed fatigue.
- They become available again once fatigue drops below that maximum.

**Code-ready expression**
```js
const isAvailable = performer.fatigue < CONFIG.performers.max_fatigue;
```

**Config values used**
- `CONFIG.performers.max_fatigue`
