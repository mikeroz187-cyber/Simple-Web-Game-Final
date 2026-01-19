# Data — Content Themes

This document defines the **content themes catalog** used by the booking system. Themes are available for both **Promo** and **Premium** content types and only change the **modifiers** applied to follower gain and revenue (no new systems or UI screens). All values are placeholders and should be tuned in `config.js` later.

---

## MVP Themes (Act 1 — Available at Game Start)

> These themes are **in scope for MVP** and should be selectable during booking.

| id | name | description (one line) | modifiers (placeholder) |
| --- | --- | --- | --- |
| `theme_casual` | Casual | Everyday, approachable vibes that feel natural and low-pressure. | `followersMult: 1.05`, `revenueMult: 0.90` |
| `theme_glamour` | Glamour | High-polish styling with bold poses and premium presentation. | `followersMult: 0.95`, `revenueMult: 1.10` |
| `theme_fitness` | Fitness | Athletic energy with clean lighting and motion-focused shots. | `followersMult: 1.10`, `revenueMult: 0.95` |
| `theme_boudoir` | Boudoir | Intimate, classy sets with warm lighting and confident framing. | `followersMult: 0.90`, `revenueMult: 1.15` |
| `theme_nightlife` | Nightlife | Club-style ambiance with neon accents and late-night mood. | `followersMult: 1.00`, `revenueMult: 1.00` |

---

## NOT IN MVP — Act 2/Act 3 Only (Vision Placeholder Themes)

> These themes are **NOT IN MVP** and exist only as placeholders for Act 2/Act 3 expansion.

| id | name | description (one line) | modifiers (placeholder) |
| --- | --- | --- | --- |
| `theme_luxury_retreat` | Luxury Retreat | Resort-grade spaces with a relaxed, high-end atmosphere. | `followersMult: 0.95`, `revenueMult: 1.20` |
| `theme_editorial` | Editorial | Magazine-style staging with bold angles and fashion emphasis. | `followersMult: 1.05`, `revenueMult: 1.05` |
| `theme_downtown_chic` | Downtown Chic | Urban interiors with a sleek, modern aesthetic. | `followersMult: 1.00`, `revenueMult: 1.10` |
| `theme_sunlit_getaway` | Sunlit Getaway | Bright, airy sets with soft daylight and beachy calm. | `followersMult: 1.10`, `revenueMult: 0.95` |
| `theme_afterhours` | After Hours | Late-night ambience with moody shadows and intimate lighting. | `followersMult: 0.90`, `revenueMult: 1.20` |

---

## JSON Example (Config Mapping)

Below is an example of how this catalog maps into `config.js`. This is **illustrative only**; the authoritative source remains this document.

```js
const CONFIG = {
  themes: {
    mvp: {
      themeIds: [
        "theme_casual",
        "theme_glamour",
        "theme_fitness",
        "theme_boudoir",
        "theme_nightlife"
      ],
      themes: {
        theme_casual: {
          id: "theme_casual",
          name: "Casual",
          description: "Everyday, approachable vibes that feel natural and low-pressure.",
          modifiers: { followersMult: 1.05, revenueMult: 0.90 }
        },
        theme_glamour: {
          id: "theme_glamour",
          name: "Glamour",
          description: "High-polish styling with bold poses and premium presentation.",
          modifiers: { followersMult: 0.95, revenueMult: 1.10 }
        }
      }
    },
    act2: {
      themeIds: ["theme_luxury_retreat", "theme_editorial"],
      themes: {
        theme_luxury_retreat: {
          id: "theme_luxury_retreat",
          name: "Luxury Retreat",
          description: "Resort-grade spaces with a relaxed, high-end atmosphere.",
          modifiers: { followersMult: 0.95, revenueMult: 1.20 }
        }
      }
    }
  }
};
```
