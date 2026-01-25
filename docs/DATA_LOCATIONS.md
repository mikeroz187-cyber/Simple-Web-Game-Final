# Location Catalog (Current Scope)

This document defines the current in-scope locations. Each location lists the required data fields used for configuration.

## Thumbnail Fields
- `thumbnailPath` is a string path to the location thumbnail image used in the UI.
- If `thumbnailPath` is missing or invalid, the UI falls back to the placeholder at `assets/images/placeholders/location_placeholder.svg`.

## Current Location List (Tier 0–2)

### Tier 0 (Available at Start)

| id | name | tier | cost | unlockCost | unlockRequirements | description |
| --- | --- | --- | --- | --- | --- | --- |
| bedroom | Bedroom (Tier 0) | 0 | 50 | 0 | None | A simple, familiar space for low-stakes starter shoots. |

### Tier 1 (Unlockable via Shop)

| id | name | tier | cost | unlockCost | unlockRequirements | description |
| --- | --- | --- | --- | --- | --- | --- |
| shower | Shower (Tier 1) | 1 | 300 | See `config.toml` | None | A tiled set with steamy ambiance and higher production value. |

### Tier 2 (Unlockable via Shop + Reputation)

| id | name | tier | cost | unlockCost | unlockRequirements | description |
| --- | --- | --- | --- | --- | --- | --- |
| office | Office (Tier 2) | 2 | 1800 | 5000 | Reputation ≥ 25 | A clean corporate space that signals serious growth. |

## JSON Example (Config Mapping)

```json
{
  "locations": [
    {
      "id": "bedroom",
      "name": "Bedroom (Tier 0)",
      "tier": 0,
      "cost": 50,
      "unlockCost": 0,
      "unlockRequirements": [],
      "thumbnailPath": "assets/images/placeholders/location_placeholder.svg",
      "description": "A simple, familiar space for low-stakes starter shoots."
    },
    {
      "id": "shower",
      "name": "Shower (Tier 1)",
      "tier": 1,
      "cost": 300,
      "unlockCost": "See config.toml",
      "unlockRequirements": [],
      "thumbnailPath": "assets/images/placeholders/location_placeholder.svg",
      "description": "A tiled set with steamy ambiance and higher production value."
    }
  ]
}
```

Notes:
- `cost` is the per-shoot cost to use the location.
- `unlockCost` applies to Tier 1+ locations only. Tier unlocks are defined in `config.toml` (`[locations].tier1UnlockCost`, `[locations].tier2UnlockCost`).
- `unlockRequirements` is an array for gating rules (for example, Tier 2 reputation requirements).
