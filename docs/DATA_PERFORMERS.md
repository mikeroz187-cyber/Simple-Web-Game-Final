# Performer Catalog (MVP + Vision)

This document defines the starting performer roster for the MVP and placeholder slots for future Acts.
All values are config-driven and should map directly to `config.js` and the initial `gameState` roster.

---

## Field Definitions (Applies to All Performers)
- **portraitPath** (string): Placeholder image path or data URI for the performer portrait. If missing or blank, the UI falls back to a generic placeholder.
- **starPowerShoots** (number): Shoot counter used for Star Power progression (counts shoots since last increase).

## Star Power Progression (Post-MVP)
- Star Power increases by +1 after **5 shoots** with the same performer.
- The counter resets after each increase.
- Progress is tracked per performer via `starPowerShoots` and persisted in save data.

---

## MVP — Core Performers (Your Team)

These are the three core performers that start as your in-house team.

| id | name | type | starPower | description |
| --- | --- | --- | --- | --- |
| core_lena_watts | Lena Watts | core | 3 | Polished lead with calm authority and a steady fanbase. |
| core_milo_park | Milo Park | core | 2 | Warm, versatile collaborator who fits any concept. |
| core_tess_rowan | Tess Rowan | core | 1 | Scrappy newcomer with raw energy and room to grow. |

## MVP — Freelance Performers (Hired Help)

These are available as short-term hires, not part of the core team.

| id | name | type | starPower | description |
| --- | --- | --- | --- | --- |
| free_jade_voss | Jade Voss | freelance | 3 | Seasoned pro who delivers instantly but keeps it professional. |
| free_nico_blade | Nico Blade | freelance | 2 | Flashy specialist known for bold aesthetics and fast turnarounds. |
| free_rin_holt | Rin Holt | freelance | 2 | Reliable utility hire with a clean, consistent style. |
| free_kira_sol | Kira Sol | freelance | 1 | Quiet wildcard who surprises when the concept is right. |
| free_eli_hart | Eli Hart | freelance | 1 | Budget-friendly helper with earnest charm and limited reach. |

---

## NOT IN MVP — Act 2 Only (Vision Definitions)

These performers are introduced during Act 2 (post-Day 90). They must not appear in MVP builds.

| id | name | type | starPower | description |
| --- | --- | --- | --- | --- |
| act2_aria_vale | Aria Vale | core | 3 | Brand-focused lead with consistent high-end delivery. |
| act2_jonah_kade | Jonah Kade | core | 2 | Versatile performer who adapts quickly to new themes. |
| act2_sky_moreno | Sky Moreno | freelance | 3 | High-demand freelancer known for premium polish. |
| act2_pax_hollow | Pax Hollow | freelance | 2 | Experimental stylist who boosts niche engagement. |

## NOT IN MVP — Act 3 Only (Vision Definitions)

These performers are introduced during Act 3 (late game). They must not appear in MVP or Act 2 builds.

| id | name | type | starPower | description |
| --- | --- | --- | --- | --- |
| act3_naomi_ward | Naomi Ward | core | 4 | Flagship talent with prestige-level draw and stability. |
| act3_ryker_lane | Ryker Lane | freelance | 3 | Elite specialist who excels in high-risk concepts. |
| act3_liv_solace | Liv Solace | freelance | 3 | Late-game wildcard with strong premium conversion. |

---

## JSON Example (Config + Initial Game State)

The catalog should live in config, and the initial roster should reference those IDs.

```json
{
  "config": {
    "performerCatalog": [
      {
        "id": "core_lena_watts",
        "name": "Lena Watts",
        "type": "core",
        "starPower": 3,
        "description": "Polished lead with calm authority and a steady fanbase."
      },
      {
        "id": "core_milo_park",
        "name": "Milo Park",
        "type": "core",
        "starPower": 2,
        "description": "Warm, versatile collaborator who fits any concept."
      },
      {
        "id": "core_tess_rowan",
        "name": "Tess Rowan",
        "type": "core",
        "starPower": 1,
        "description": "Scrappy newcomer with raw energy and room to grow."
      },
      {
        "id": "free_jade_voss",
        "name": "Jade Voss",
        "type": "freelance",
        "starPower": 3,
        "description": "Seasoned pro who delivers instantly but keeps it professional."
      },
      {
        "id": "free_nico_blade",
        "name": "Nico Blade",
        "type": "freelance",
        "starPower": 2,
        "description": "Flashy specialist known for bold aesthetics and fast turnarounds."
      },
      {
        "id": "free_rin_holt",
        "name": "Rin Holt",
        "type": "freelance",
        "starPower": 2,
        "description": "Reliable utility hire with a clean, consistent style."
      },
      {
        "id": "free_kira_sol",
        "name": "Kira Sol",
        "type": "freelance",
        "starPower": 1,
        "description": "Quiet wildcard who surprises when the concept is right."
      },
      {
        "id": "free_eli_hart",
        "name": "Eli Hart",
        "type": "freelance",
        "starPower": 1,
        "description": "Budget-friendly helper with earnest charm and limited reach."
      }
    ]
  },
  "gameState": {
    "roster": {
      "performers": [
        {
          "id": "core_lena_watts",
          "status": "active"
        },
        {
          "id": "core_milo_park",
          "status": "active"
        },
        {
          "id": "core_tess_rowan",
          "status": "active"
        }
      ]
    }
  }
}
```
