# Data — Content Themes

This document defines the **content themes catalog** used by the booking system. Themes are available for both **Promo** and **Premium** content types and only change the **modifiers** applied to follower gain and OF subscriber output (no new systems or UI screens). All values are placeholders and should be tuned in `config.js` later.

---

## Theme Catalog (Locked)

> These themes are **in scope** and should be selectable during booking.

| id | name | description (one line) | modifiers (placeholder) |
| --- | --- | --- | --- |
| `lingerie` | Lingerie | Your signature premium look — lace, heels, and zero subtlety. | `followersMult: 1.00`, `ofSubsMult: 1.00` |
| `office` | Office | After-hours authority — desks, suits, and someone ‘breaking rules.’ | `followersMult: 1.00`, `ofSubsMult: 1.00` |
| `uniform` | Uniform | Roleplay on demand — maid, nurse, teacher vibes, you call the shots. | `followersMult: 1.00`, `ofSubsMult: 1.00` |
| `interracial` | Interracial | A bold, high-click category flex — instantly legible, instantly addictive. | `followersMult: 1.00`, `ofSubsMult: 1.00` |

---

## JSON Example (Config Mapping)

Below is an example of how this catalog maps into `config.js`. This is **illustrative only**; the authoritative source remains this document.

```js
const CONFIG = {
  themes: {
    mvp: {
      themeIds: [
        "lingerie",
        "office",
        "uniform",
        "interracial"
      ],
      themes: {
        lingerie: {
          id: "lingerie",
          name: "Lingerie",
          description: "Your signature premium look — lace, heels, and zero subtlety.",
          modifiers: { followersMult: 1.00, ofSubsMult: 1.00 }
        },
        office: {
          id: "office",
          name: "Office",
          description: "After-hours authority — desks, suits, and someone ‘breaking rules.’",
          modifiers: { followersMult: 1.00, ofSubsMult: 1.00 }
        }
      }
    },
    act2: {
      themeIds: [],
      themes: {}
    }
  }
};
```
