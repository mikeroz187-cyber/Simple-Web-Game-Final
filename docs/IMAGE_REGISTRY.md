# Image Registry

This registry documents all image path conventions used in the game so placeholder art can be swapped cleanly later.

## Placeholder Fallbacks

If a takeover image is missing, the UI falls back to:
- `assets/images/placeholders/location_placeholder.svg`

(This path is the current value of `CONFIG.takeover.placeholderPortraitPath`.)

## Takeover

### Performer Portrait
- `assets/images/takeover/<studioId>/<performerId>/portrait.png`

### Performer Stage Slides
- `assets/images/takeover/<studioId>/<performerId>/<stage>_<n>.png`
- `<stage>` is one of: `intel`, `approach`, `turn`, `debut`
- `<n>` ranges from `1..5`

### Boss Portrait
- `assets/images/takeover/<studioId>/<bossId>/portrait.png`

### Boss Stage Slides
- `assets/images/takeover/<studioId>/<bossId>/boss_<stageKey>_<n>.png`
- `<stageKey>` is one of: `summons`, `negotiation`, `power_play`, `fall`, `terms`
- `<n>` ranges from `1..5`

### Trophy
- `assets/images/takeover/<studioId>/trophy.png`
