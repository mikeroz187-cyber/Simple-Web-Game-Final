**Status:** Historical MVP reference. This document is not authoritative for the current build.
Current behavior lives in `docs/CORE_GAMEPLAY_LOOP.md` and `docs/GAMESTATE_DATA_MODEL.md`.
Legacy references to CURRENT_SCOPE are historical; CURRENT_SCOPE is now a non‑binding focus snapshot.
Note: The current build uses `src/config.js`; `config.toml` is a legacy reference.

# MVP State Model (Authoritative gameState Spec)

## 1) Purpose (Historical)
This document was the **single source of truth** for the MVP `gameState` shape during the original MVP build. It is no longer authoritative for the current implementation.

## 2) Authority & Scope Lock
**Authority order (historical, MVP only):**
1) `docs/SCOPE_MVP.md`
2) `docs/MVP/` (including this doc)
3) `docs/VISION/` (read-only inspiration)

**Bold rules (historical, MVP only):**
- **No extra fields were added without updating this doc and `CHANGELOG.md`.**
- **Act 2/Act 3 fields were not part of the MVP state model.**

## 3) State Design Principles (MVP)
- `gameState` is the **only authoritative runtime state**.
- UI renders from `gameState`; **no hidden globals or DOM state** are allowed.
- Prefer storing **facts** (transactions/content records) and derive totals where feasible.
- Avoid duplicating the same fact in multiple places.
- Use **stable IDs** for entities (performers, content, posts).
- Deterministic outcomes only **unless MVP docs explicitly allow randomness**.
  - If randomness exists: **store RNG seed + per-action roll results** for reload consistency.

## 4) Versioning & Save Compatibility
- `gameState.version` is **required** and must match `config.toml -> [save].save_schema_version`.
- `gameState.createdAt` and `gameState.updatedAt` are **ISO 8601 strings**.
- **Migration policy:**
  - Future versions must include a migration path from earlier versions.
  - Save import must reject unsupported versions (see Validation Rules).
- **Export format rule:** Exported JSON **must be the full `gameState` object** at the top level.

## 5) Top-Level Schema (Table)
| Key | Type | Required | Default / Generation | Owned By | Notes / Constraints |
| --- | --- | --- | --- | --- | --- |
| `version` | number | Required | `config.save.save_schema_version` | save | Must match supported versions. |
| `createdAt` | string (ISO) | Required | `new Date().toISOString()` at new game | save | Immutable after creation. |
| `updatedAt` | string (ISO) | Required | Updated on every save-worthy mutation | save | Must always be >= `createdAt`. |
| `player` | object | Required | `newGameState()` | economy/time/progression | Core metrics: day, cash, debt, followers, subscribers, reputation. |
| `roster` | object | Required | `newGameState()` | roster | Performer list and stats. |
| `content` | object | Required | `newGameState()` | booking/content | Content history (gallery). |
| `social` | object | Required | `newGameState()` | social | Social posts log (Instagram/X). |
| `unlocks` | object | Required | `newGameState()` | progression/shop | Tier 1 location unlock flag. |
| `story` | object | Required | `newGameState()` | story | Act 1 intro + debt reminder tracking. |
| `rng` | object | Optional* | Only if MVP uses randomness | systems | *Only include if randomness exists; otherwise omit. |

## 6) Nested Schemas (Tables)

### 6.1 `player`
| Field | Type | Required | Default | Invariants |
| --- | --- | --- | --- | --- |
| `day` | integer | Required | `config.game.starting_day` | `>= 1` and `<= player.debtDueDay`. |
| `cash` | number | Required | `config.game.starting_cash` | Must be finite and `>= 0`. |
| `debtRemaining` | number | Required | `config.game.loan_total_due` | Must be finite and `>= 0`. |
| `debtDueDay` | integer | Required | `config.game.debt_due_day` | Constant in MVP (Day 90). |
| `shootsToday` | integer | Required | `0` | Must be `>= 0` and `<= config.game.shoots_per_day`. |
| `followers` | integer | Required | `0` | Must be `>= 0`. |
| `subscribers` | integer | Required | `0` | Must be `>= 0`. |
| `onlyFansSubCarry` | number | Optional | `0` | Fractional carry for OF conversion; must be finite and `>= 0`. |
| `reputation` | integer | Required | `config.progression.starting_reputation` | Must be `>= 0` (if negatives are not defined in scope). |
| `lifetimeMRR` | number | Optional | `0` | Only include if MVP UI displays cumulative MRR. Must be `>= 0`. |

**Day limit alignment rule:** If `config.game.action_day_max` exists, it must match `config.game.debt_due_day`. `player.debtDueDay` is the authoritative cap for MVP day progression.

### 6.2 `roster`
| Field | Type | Required | Default | Invariants |
| --- | --- | --- | --- | --- |
| `performers` | array of `Performer` | Required | 3 core + 5 freelance from config | IDs must be unique. |

#### `Performer`
| Field | Type | Required | Default | Invariants |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Generated stable ID | Must be unique across roster. |
| `name` | string | Required | Config-driven | Non-empty. |
| `type` | enum | Required | `core` or `freelance` | Must be one of `core`, `freelance`. |
| `starPower` | number | Required | `config.performers.default_star_power` | Must be `>= 0`. |
| `fatigue` | number | Required | `0` | `0` to `config.performers.max_fatigue`. |
| `loyalty` | number | Required | `config.performers.starting_loyalty` | Must be finite. |

### 6.3 `content`
| Field | Type | Required | Default | Invariants |
| --- | --- | --- | --- | --- |
| `entries` | array of `ContentEntry` | Required | `[]` | IDs unique; append-only. |
| `lastContentId` | string or null | Required | `null` | If not null, must exist in `entries`. |

#### `ContentEntry`
| Field | Type | Required | Default | Invariants |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Generated stable ID | Unique across content. |
| `dayCreated` | integer | Required | `player.day` at creation | Must be `>= 1`. |
| `performerId` | string | Required | Selected performer | Must exist in `roster.performers`. |
| `locationId` | string | Required | Selected location ID | Location IDs are defined in CONFIG.locations in /src/config.js |
| `themeId` | string | Required | Selected theme ID | Theme IDs are defined in CONFIG.themes in /src/config.js |
| `contentType` | enum | Required | `Promo` or `Premium` | Must match config `[content_types].available`. |
| `shootCost` | number | Required | Config-derived | Must be `>= 0`. |
| `results` | object | Required | Calculated on completion | Immutable after creation (except if explicit corrections are needed). |

#### `ContentEntry.results`
| Field | Type | Required | Default | Invariants |
| --- | --- | --- | --- | --- |
| `socialFollowersGained` | integer | Required | `0` for Premium | Must be `>= 0`. |
| `socialSubscribersGained` | integer | Required | `0` for Premium | Must be `>= 0`. |
| `onlyFansSubscribersGained` | integer | Required | Derived from Premium output | Must be `>= 0`. |
| `feedbackSummary` | string | Required | Generated text | Non-empty if shown in UI. |

### 6.4 `social`
| Field | Type | Required | Default | Invariants |
| --- | --- | --- | --- | --- |
| `posts` | array of `SocialPost` | Required | `[]` | IDs unique; append-only. Per-item posted flags are derived from these records. |

#### `SocialPost`
| Field | Type | Required | Default | Invariants |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Generated stable ID | Unique across posts. |
| `postedAtDay` | integer | Required | `player.day` at posting | Must be `>= 1`. |
| `platformId` | string | Required | Platform ID | Must match config `[social_platforms].platforms`. |
| `contentId` | string | Required | Targeted content | Must exist in `content.entries`. Must be Promo content. |
| `socialFollowersGained` | integer | Required | Calculated impact | Must be `>= 0`. |
| `socialSubscribersGained` | integer | Required | Calculated impact | Must be `>= 0`. |
| `onlyFansSubscribersGained` | integer | Required | Calculated impact | Must be `>= 0`. |

**Per-item posted flags rule:** To answer “has this content been posted to platform X?”, **search `social.posts`** for a record with matching `contentId` + `platformId`. Do **not** add posted flags to `content.entries` or mutate content metadata.

### 6.5 `unlocks`
| Field | Type | Required | Default | Invariants |
| --- | --- | --- | --- | --- |
| `locationTier1Unlocked` | boolean | Required | `false` | True only after purchase. |

### 6.6 `story`
| Field | Type | Required | Default | Invariants |
| --- | --- | --- | --- | --- |
| `introShown` | boolean | Required | `false` | Set true after Act 1 intro event. |
| `debtReminderDaysShown` | array of integer | Required | `[]` | Unique days; must be `< player.debtDueDay`. |

### 6.7 `rng` (Optional — only if randomness exists in MVP)
| Field | Type | Required | Default | Invariants |
| --- | --- | --- | --- | --- |
| `seed` | string or number | Required if `rng` exists | Generated once | Must be stable for a save. |
| `rollLog` | array of `RngRoll` | Required if `rng` exists | `[]` | Append-only. |

#### `RngRoll`
| Field | Type | Required | Default | Invariants |
| --- | --- | --- | --- | --- |
| `id` | string | Required | Generated stable ID | Unique. |
| `context` | string | Required | Action name | Non-empty. |
| `result` | number | Required | Generated roll | Must be finite. |

## 7) Enumerations & Allowed Values
- `contentType`: **`Promo`, `Premium`** (from `config.toml` → `[content_types].available`).
- `platformId`: **`Instagram`, `X`** (from `config.toml` → `[social_platforms].platforms`).
- `performer.type`: **`core`, `freelance`** (implied by MVP roster definitions in `docs/SCOPE_MVP.md`).

**Rule:** Enum values in state **must not drift** from config definitions. Update config and this doc together.

## 8) Derived Values vs Stored Values
**Stored in `gameState`:**
- Player metrics (`day`, `cash`, `debtRemaining`, `shootsToday`, `followers`, `subscribers`, `reputation`).
- Roster performers and their stats.
- Content entries (facts about each shoot and results).
- Social posts and their impacts.
- Unlock flags and story flags.

**Derived at render time (do NOT persist redundantly):**
- Current day’s “next action” text on the Hub.
- Analytics screen values (derived from the **latest content entry** and `player` totals).
- Gallery filters/sorting state.
- Performer availability (derive from fatigue and config thresholds).
- Per-item posted flags (derive by searching `social.posts` for `contentId` + `platformId`).

If MVP UI **requires** a stored total (e.g., lifetime MRR), store it once in `player.lifetimeMRR` and **do not duplicate** it elsewhere.

## 9) Invariants (Must Always Be True)
- `player.day` is an integer `>= 1` and `<= player.debtDueDay`.
- `player.shootsToday` is an integer `>= 0` and `<= config.game.shoots_per_day`.
- `player.cash`, `player.debtRemaining`, `player.followers`, `player.subscribers` are finite and `>= 0`.
- `content.entries` and `social.posts` IDs are **unique** and append-only.
- `content.lastContentId` is either `null` or references an existing content entry.
- Content entries are **immutable after creation**, except where explicitly allowed (e.g., if a post is added, do not mutate the entry itself; store the post in `social.posts`).
- All enum fields contain **only** allowed values.
- No unknown top-level keys are permitted in MVP saves.

## 10) State Mutation Rules (Who Can Write What)
**Write-access matrix (MVP):**
- **Booking system** may write:
  - `content.entries` (append new content), `content.lastContentId`, `player.cash` (shoot cost), `player.shootsToday` (count toward day), `player.day` (advance after 5 shoots).
- **Content/Analytics system** may write:
  - `content.entries[*].results`, `player.followers`, `player.subscribers`, `player.cash`, `player.lifetimeRevenue` (if tracked), `player.reputation` (if used).
- **Roster system** may write:
  - `roster.performers[*].fatigue`, `roster.performers[*].starPower`, `roster.performers[*].loyalty`.
- **Social system** may write:
  - `social.posts` (append), `player.followers`, `player.subscribers`.
- **Progression/Shop system** may write:
  - `unlocks.locationTier1Unlocked`, `player.cash`, `player.reputation` (if affected).
- **Story system** may write:
  - `story.introShown`, `story.debtReminderDaysShown`.
- **Save system** may write:
  - `updatedAt` only (and `createdAt` only at new game creation).

**UI layer must not mutate deep fields directly.** It must call state/action functions that enforce these rules.

## 11) Canonical Examples (Copy/Paste)
**Note:** IDs in examples are placeholders. Actual IDs must come from config or data tables defined by MVP scope.

### Example A — `newGameState()` (fresh start)
```json
{
  "version": 1,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-01T00:00:00.000Z",
  "player": {
    "day": 1,
    "cash": 5000,
    "debtRemaining": 25000,
    "debtDueDay": 90,
    "shootsToday": 0,
    "followers": 0,
    "subscribers": 0,
    "reputation": 0
  },
  "roster": {
    "performers": [
      {
        "id": "perf_core_1",
        "name": "Core Performer 1",
        "type": "core",
        "starPower": 1,
        "fatigue": 0,
        "loyalty": 50
      },
      {
        "id": "perf_core_2",
        "name": "Core Performer 2",
        "type": "core",
        "starPower": 1,
        "fatigue": 0,
        "loyalty": 50
      },
      {
        "id": "perf_core_3",
        "name": "Core Performer 3",
        "type": "core",
        "starPower": 1,
        "fatigue": 0,
        "loyalty": 50
      },
      {
        "id": "perf_free_1",
        "name": "Freelance Performer 1",
        "type": "freelance",
        "starPower": 1,
        "fatigue": 0,
        "loyalty": 50
      },
      {
        "id": "perf_free_2",
        "name": "Freelance Performer 2",
        "type": "freelance",
        "starPower": 1,
        "fatigue": 0,
        "loyalty": 50
      },
      {
        "id": "perf_free_3",
        "name": "Freelance Performer 3",
        "type": "freelance",
        "starPower": 1,
        "fatigue": 0,
        "loyalty": 50
      },
      {
        "id": "perf_free_4",
        "name": "Freelance Performer 4",
        "type": "freelance",
        "starPower": 1,
        "fatigue": 0,
        "loyalty": 50
      },
      {
        "id": "perf_free_5",
        "name": "Freelance Performer 5",
        "type": "freelance",
        "starPower": 1,
        "fatigue": 0,
        "loyalty": 50
      }
    ]
  },
  "content": {
    "entries": [],
    "lastContentId": null
  },
  "social": {
    "posts": []
  },
  "unlocks": {
    "locationTier1Unlocked": false
  },
  "story": {
    "introShown": false,
    "debtReminderDaysShown": []
  }
}
```

### Example B — Mid-game (after one shoot + one post)
```json
{
  "version": 1,
  "createdAt": "2025-01-01T00:00:00.000Z",
  "updatedAt": "2025-01-03T00:00:00.000Z",
  "player": {
    "day": 2,
    "cash": 5150,
    "debtRemaining": 25000,
    "debtDueDay": 90,
    "followers": 120,
    "subscribers": 2,
    "reputation": 0
  },
  "roster": {
    "performers": [
      {
        "id": "perf_core_1",
        "name": "Core Performer 1",
        "type": "core",
        "starPower": 1,
        "fatigue": 10,
        "loyalty": 50
      },
      {
        "id": "perf_core_2",
        "name": "Core Performer 2",
        "type": "core",
        "starPower": 1,
        "fatigue": 0,
        "loyalty": 50
      },
      {
        "id": "perf_core_3",
        "name": "Core Performer 3",
        "type": "core",
        "starPower": 1,
        "fatigue": 0,
        "loyalty": 50
      },
      {
        "id": "perf_free_1",
        "name": "Freelance Performer 1",
        "type": "freelance",
        "starPower": 1,
        "fatigue": 0,
        "loyalty": 50
      },
      {
        "id": "perf_free_2",
        "name": "Freelance Performer 2",
        "type": "freelance",
        "starPower": 1,
        "fatigue": 0,
        "loyalty": 50
      },
      {
        "id": "perf_free_3",
        "name": "Freelance Performer 3",
        "type": "freelance",
        "starPower": 1,
        "fatigue": 0,
        "loyalty": 50
      },
      {
        "id": "perf_free_4",
        "name": "Freelance Performer 4",
        "type": "freelance",
        "starPower": 1,
        "fatigue": 0,
        "loyalty": 50
      },
      {
        "id": "perf_free_5",
        "name": "Freelance Performer 5",
        "type": "freelance",
        "starPower": 1,
        "fatigue": 0,
        "loyalty": 50
      }
    ]
  },
  "content": {
    "entries": [
      {
        "id": "content_1",
        "dayCreated": 1,
        "performerId": "perf_core_1",
        "locationId": "location_tier0_1",
        "themeId": "theme_1",
        "contentType": "Promo",
        "shootCost": 100,
        "results": {
          "socialFollowersGained": 100,
          "socialSubscribersGained": 1,
          "onlyFansSubscribersGained": 0,
          "feedbackSummary": "Solid promo reach."
        }
      }
    ],
    "lastContentId": "content_1"
  },
  "social": {
    "posts": [
      {
        "id": "post_1",
        "postedAtDay": 1,
        "platformId": "Instagram",
        "contentId": "content_1",
        "socialFollowersGained": 20,
        "socialSubscribersGained": 1,
        "onlyFansSubscribersGained": 0
      }
    ]
  },
  "unlocks": {
    "locationTier1Unlocked": false
  },
  "story": {
    "introShown": true,
    "debtReminderDaysShown": []
  }
}
```

## 12) Validation Rules (for Import)
Minimum required validation before accepting an import:
- `version` exists and is supported.
- All **required keys** exist and types match this spec.
- Enum fields contain only allowed values.
- Unknown top-level keys cause **rejection** (MVP default for stability).
- IDs referenced across objects resolve to existing entries (e.g., `contentId` exists).
- Numeric fields are finite and within allowed ranges.

## 13) Owner Notes (Non-Developer Friendly)
**What “state” means:**
- The **state** is the game’s single data record — the truth of everything that has happened and everything the game needs to know (day, money, performers, content, posts).

**How export/import relates to the state model:**
- Export saves **this exact object** to a JSON file.
- Import replaces the current game with the saved object **after validation**.

**Why adding fields requires updating this doc:**
- This doc is how the game stays stable and predictable. If new fields are added, they must be documented here and in `CHANGELOG.md` so saves remain compatible.
