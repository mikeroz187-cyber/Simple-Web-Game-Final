# Location Catalog (Full Game)

This document defines all locations across MVP (Act 1) and Vision (Acts 2–3). Each location lists the required data fields used for configuration.

## Thumbnail Fields
- `thumbnailPath` is a string path to the location thumbnail image used in the UI.
- If `thumbnailPath` is missing or invalid, the UI falls back to the placeholder at `assets/images/placeholders/location_placeholder.svg`.

## MVP — Act 1 (Tier 0–1)

### Tier 0 (Available at Start)

| id | name | tier | cost | unlockCost | unlockRequirements | description |
| --- | --- | --- | --- | --- | --- | --- |
| location_basic_bedroom | Basic Bedroom | 0 | 50 | 0 | None | A simple, familiar space for low-stakes starter shoots. |
| location_shared_apartment | Shared Apartment | 0 | 80 | 0 | None | A modest room with everyday clutter and casual vibes. |
| location_spare_office | Spare Office | 0 | 120 | 0 | None | A quiet corner with a desk setup for clean, focused content. |

### Tier 1 (Unlockable in MVP via Shop)

| id | name | tier | cost | unlockCost | unlockRequirements | description |
| --- | --- | --- | --- | --- | --- | --- |
| location_studio_loft | Studio Loft | 1 | 300 | See `config.toml` | None | A compact loft with improved lighting and a cleaner backdrop. |
| location_city_apartment | City Apartment | 1 | 450 | See `config.toml` | None | A tidy urban space that feels more professional and polished. |
| location_small_warehouse | Small Warehouse | 1 | 600 | See `config.toml` | None | A larger, flexible space suited for varied set dressing. |

## NOT IN MVP — Act 2 only (Tier 2)

### Tier 2 (Act 2)

| id | name | tier | cost | unlockCost | unlockRequirements | description |
| --- | --- | --- | --- | --- | --- | --- |
| location_downtown_penthouse | Downtown Penthouse | 2 | 1800 | 4000 | Reputation ≥ 20 | A sleek high-rise space that signals serious growth. |
| location_suburban_house | Suburban House | 2 | 2200 | 5000 | Reputation ≥ 25 | A full home set that unlocks richer lifestyle shoots. |
| location_private_studio | Private Studio | 2 | 2600 | 6000 | Reputation ≥ 30 | A dedicated studio with controlled lighting and props. |

## NOT IN MVP — Act 3 only (Tier 3)

### Tier 3 (Act 3)

| id | name | tier | cost | unlockCost | unlockRequirements | description |
| --- | --- | --- | --- | --- | --- | --- |
| location_luxury_penthouse | Luxury Penthouse | 3 | 5200 | 12000 | Reputation ≥ 50 | A premium skyline suite built for top-tier showcases. |
| location_beachfront_villa | Beachfront Villa | 3 | 6500 | 15000 | Reputation ≥ 60 | An exclusive coastal property for aspirational content. |
| location_private_mansion | Private Mansion | 3 | 8200 | 20000 | Reputation ≥ 70 | A sprawling estate that defines elite production value. |

## JSON Example (Config Mapping)

```json
{
  "locations": [
    {
      "id": "location_basic_bedroom",
      "name": "Basic Bedroom",
      "tier": 0,
      "cost": 50,
      "unlockCost": 0,
      "unlockRequirements": [],
      "thumbnailPath": "assets/images/placeholders/location_placeholder.svg",
      "description": "A simple, familiar space for low-stakes starter shoots."
    },
    {
      "id": "location_studio_loft",
      "name": "Studio Loft",
      "tier": 1,
      "cost": 300,
      "unlockCost": "See config.toml",
      "unlockRequirements": [],
      "thumbnailPath": "assets/images/placeholders/location_placeholder.svg",
      "description": "A compact loft with improved lighting and a cleaner backdrop."
    }
  ]
}
```

Notes:
- `cost` is the per-shoot cost to use the location.
- `unlockCost` applies to Tier 1+ locations only. In MVP, Tier 1 unlock is a single purchase defined in `config.toml` (`[locations].tier1UnlockCost`, name in `[locations].tier1Name`).
- `unlockRequirements` is an array for future gating rules; keep it empty for MVP.
