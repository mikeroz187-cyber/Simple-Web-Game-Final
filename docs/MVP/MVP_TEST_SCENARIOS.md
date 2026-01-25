STATUS: Historical (MVP reference). MVP is complete and frozen. For current scope, see CURRENT_SCOPE.md.

# MVP Test Scenarios

This document lists simple **Given X, expect Y** checks to verify MVP gameplay behavior. All numeric values are sourced from `config.toml` and mirrored into `docs/DATA_*.md` and `docs/MVP/MVP_FORMULAS.md` for reference.

---

## 1) New Game Scenario (Fresh Start)

**Given** a brand-new game with no prior save loaded.  
**Expect** the initial state matches config defaults:
- `day = 1`
- `cash = 5000`
- `debtRemaining = 10000`
- `followers = 0`
- `reputation = 0`

---

## 2) Booking Scenario (Promo Shoot)

**Given** a Promo booking with:
- Performer: **Lena Watts** (`starPower = 3`)
- Location: **Bedroom (Tier 0)** (`location cost = 50`)
- Theme: **Nightlife** (`followersMult = 1.00`)

**Expect**:
- **Shoot cost** = base shoot cost `100` + location cost `50` = **150** cash deducted.
- **Followers gained** = round(`100` base promo followers × `1.00` theme × `3` star power) = **300** followers added.

---

## 3) Premium Revenue Scenario

**Given** a Premium booking with:
- Performer: **Milo Park** (`starPower = 2`)
- Theme: **Nightlife** (`revenueMult = 1.00`)

**Expect**:
- **Revenue** = round(`250` base revenue × `1.00` theme × `2` star power) = **500** cash added.

---

## 4) Social Post Scenario (Instagram)

**Given** a Promo social post to **Instagram**.

**Expect**:
- **Followers gained** = round(`100` base promo followers × `1.00` Instagram multiplier) = **100** followers added.

---

## 5) Fatigue Scenario

**Given** a performer with `fatigue = 0` completes a shoot.  
**Expect** fatigue increases by `10`, resulting in `fatigue = 10`.

**Given** a performer with `fatigue = 100` (max).  
**Expect** the performer is **unavailable** for booking until fatigue drops below 100.

---

## 6) Day Advance Scenario

**Given** the player confirms 5 bookings on `day = 1`.  
**Expect** the day increments to `day = 2` and `shootsToday` resets to `0`.

---

## 7) Debt Win Scenario

**Given** `day = 90` and `debtRemaining = 0`.  
**Expect** the win event triggers.

---

## 8) Debt Loss Scenario

**Given** `day = 90` and `debtRemaining > 0`.  
**Expect** the loss event triggers.

---

## 9) Save/Load Scenario

**Given** the player saves the game, refreshes the browser, and then loads the save.  
**Expect** all state values (day, cash, debt, followers, roster fatigue, locations, etc.) are preserved exactly.

---

## 10) Pay Debt Scenario

**Given** `cash >= debtRemaining` on the Hub.  
**Expect** the Pay Debt button is enabled and paying clears `debtRemaining` to `0`.
