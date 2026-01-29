# Performer Catalog (Current)

This document mirrors the performer catalog in `src/config.js`.

## Field Definitions
- **type**: `core` or `freelance` (contracted roster shows non‑freelance performers).
- **starPower**: Base Star Power at start.
- **starPowerShoots**: Per‑performer counter for Star Power progression (5 shoots → +1 Star Power, max 6).
- **loyalty**: Relationship score (0–100) that rises on bookings and decays by full idle weeks.
- **loyalty gain/decay**: Booking a core performer adds `loyaltyGainPerBooking`; each full week idle removes `loyaltyDecayPerWeekIdle`.
- **diva fee tiers**: Low loyalty triggers added shoot + renewal fees based on `performerManagement.divaFeeRules`.
- **maxBookingsPerDay**: Optional per‑performer daily cap override (defaults to 1/day, max 3/day).
- **portraitPath**: Derived from the performer ID; placeholders are used when no art is available.
- **starPowerExponent**: Economy multiplier that boosts effective star power using `starPower ^ starPowerExponent`.

## Core Performers (Starting Team)

| id | name | type | starPower | description |
| --- | --- | --- | --- | --- |
| core_lena_watts | Kendra Lynn | core | 3 | Polished lead with calm authority and a steady fanbase. |
| core_milo_park | Abella Banks | core | 2 | Warm, versatile collaborator who fits any concept. |
| core_tess_rowan | Jessie Star | core | 1 | Scrappy newcomer with raw energy and room to grow. |

## Freelance Performers (Roster Catalog)

| id | name | type | starPower | description |
| --- | --- | --- | --- | --- |
| free_jade_voss | Candy Blaze | freelance | 3 | Seasoned pro who delivers instantly but keeps it professional. |
| free_nico_blade | Skye Ryder | freelance | 2 | Flashy specialist known for bold aesthetics and fast turnarounds. |
| free_rin_holt | Nova Quinn | freelance | 2 | Reliable utility hire with a clean, consistent style. |
| free_kira_sol | Tiffany Heat | freelance | 1 | Quiet wildcard who surprises when the concept is right. |
| free_eli_hart | Mila Rush | freelance | 1 | Budget-friendly helper with earnest charm and limited reach. |

## Act 2 Freelance Additions (Included in Roster)

| id | name | type | starPower | description |
| --- | --- | --- | --- | --- |
| act2_ivy_glaze | Ivy Glaze | freelance | 4 | Glossy brand-builder who treats every shoot like a product launch. |
| act2_dex_marion | Dex Malone | freelance | 3 | Over‑prepared specialist who still improvises to steal the scene. |
| act2_sable_quinn | Sable Quinn | freelance | 3 | Trend‑chasing chameleon with a knack for monetizing the moment. |
| act2_joel_riggs | Eli Black | freelance | 2 | Deadpan support who makes chaos look like a deliberate choice. |

## Recruitable Performers (Roster Expansion)

| id | name | type | starPower | maxBookingsPerDay | description |
| --- | --- | --- | --- | --- | --- |
| recruit_bryn_sterling | Scarlett Sterling | core | 2 | 1 | Quick study with a sharp camera instinct and easy chemistry. |
| recruit_aria_lux | Aria Afterdark | core | 3 | 2 | Polished starlet who treats every set like a headline moment. |
| recruit_dahlia_slate | Dahlia Kane | core | 3 | 1 | Glossy brand-builder who keeps the vibe premium and polished. |
| recruit_eden_frost | Eden Ivy | core | 2 | 2 | Cool, composed performer who thrives under pressure and bright lights. |
| recruit_fern_kestrel | Raven Foxx | core | 3 | 1 | Hyper-competent closer with a knack for turning concepts into buzz. |
| recruit_celeste_noir | Celeste Sin | core | 4 | 3 | High-stamina headliner with a loyal fan club and a cinematic gaze. |
| recruit_gigi_blade | Gigi Blade | core | 4 | 3 | Relentless showstopper who lives for big swings and bold sets. |

## Freelancer Personas (Daily Rerolls)
- Freelance performers display a **persona profile** that rerolls daily.
- Personas are stored in `CONFIG.freelancers.profiles` and tracked in `roster.freelancerProfiles`.

## Config Mapping
Values map to:
- `CONFIG.performers.*`
- `CONFIG.freelancers.profiles`
- `CONFIG.performerManagement.retentionRules`
- `CONFIG.performerManagement.divaFeeRules`
- `CONFIG.economy.starPowerExponent`
