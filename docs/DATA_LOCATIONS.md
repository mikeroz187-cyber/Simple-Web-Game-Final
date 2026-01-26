# Location Catalog (Current)

This document defines the current in‑game locations. Values mirror `src/config.js`.

## Thumbnail Fields
- `thumbnailPath` is the image path used in the UI.
- If the image fails to load, the UI falls back to the placeholder at `assets/images/placeholders/location_placeholder.svg`.

## Current Location List (Tier 0–2)

### Tier 0 (Available at Start)

| id | name | tier | cost | unlockCost | unlockRequirements | description |
| --- | --- | --- | --- | --- | --- | --- |
| bedroom | Bedroom (Tier 0) | 0 | 50 | 0 | None | A simple, familiar space for low-stakes starter shoots. |

### Tier 1 (Unlockable via Shop)

| id | name | tier | cost | unlockCost | unlockRequirements | description |
| --- | --- | --- | --- | --- | --- | --- |
| shower | Shower (Tier 1) | 1 | 300 | 2000 | None | A tiled set with steamy ambiance and higher production value. |

### Tier 2 (Unlockable via Shop + Reputation)

| id | name | tier | cost | unlockCost | unlockRequirements | description |
| --- | --- | --- | --- | --- | --- | --- |
| office | Office (Tier 2) | 2 | 1800 | 5000 | Reputation ≥ 25 | A clean corporate space that signals serious growth. |

## Behavior Notes
- Tier unlocks are purchased in the Shop and stored in `gameState.unlocks.locationTiers`.
- Tier 2 usage requires **both** the unlock purchase **and** the reputation threshold.

## Config Mapping
Values map to:
- `CONFIG.locations.*`
