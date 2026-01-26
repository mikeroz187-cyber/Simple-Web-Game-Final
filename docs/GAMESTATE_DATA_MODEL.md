# GameState Data Model (Current Additions)

This document lists **post-MVP** additions to the `gameState` model.

## New / Updated Fields

### `player`
- `agencyPackUsedToday` (boolean)
  - Tracks whether the Agency Sample Pack has been used on the current day.
  - Resets to `false` on Advance Day.

### `recruitment`
```json
{
  "declinedIds": ["recruit_bryn_sterling"],
  "hiredIds": ["recruit_aria_lux"]
}
```
- `declinedIds` (string[]) — performerIds that were declined.
- `hiredIds` (string[]) — performerIds hired through recruitment.

### `content.entries[*]`
- `photoPaths` (string[])
  - Array of 5 image paths for the shoot photo slideshow.
  - Placeholder images are used until real art is provided.

## Notes
- UI-only slideshow state is **not** persisted.
- All new fields must be persisted through save/load and import/export.
