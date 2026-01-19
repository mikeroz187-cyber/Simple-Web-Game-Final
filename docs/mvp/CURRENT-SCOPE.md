# CURRENT SCOPE (Authoritative)

This document is the single source of truth for what to build.
If ANY other document conflicts with this file, this file wins.

## Current Phase

MVP — Act 1 Only (Days 1–90)

## Game Concept

Studio Empire is an adult content production management simulator. The player starts with a loan, hires performers, produces content, grows a social media following, and must repay their debt within 90 days.

## MVP Core Loop

Book Shoot → View Content → Analyze Metrics → Adjust Strategy → Repeat

## MVP Hard Numbers

| Item | MVP Value | Vision Says (Ignore) |
|------|-----------|----------------------|
| Core performers | 3 | 6-8 |
| Freelance performers | 5 | 10-15 |
| Social platforms | Instagram, X | Instagram, X, Reddit |
| Total screens | 8 | 13 |
| Content types | Promo, Premium | Promo, Premium, POV |
| Location tiers | Tier 0-1 only | Tier 0-3 |
| Equipment upgrades | None in MVP | Multiple tiers |
| Story events | Debt intro + 2-3 reminders | Branching moral paths |
| Starting cash | $5,000 | — |
| Debt owed | $10,000 | — |
| Day limit | 90 | — |

## Screens (8 Total)

1. **Hub** — Status overview, primary navigation
2. **Booking** — Select performer, location, theme, content type
3. **Content** — Display shoot result image
4. **Analytics** — Show revenue, followers, subscribers, feedback
5. **Roster** — View performers and their stats
6. **Social** — Post content to Instagram/X
7. **Gallery** — Browse created content
8. **Shop** — Purchase location unlocks

## In Scope (Implement These)

### Core Features
- Booking system: performer + location + theme + content type
- Two content types: Promo (SFW) and Premium (NSFW)
- Content display with platform-appropriate framing
- Analytics showing revenue, followers gained, subscribers gained
- Day counter advancing after each shoot cycle

### Performer System
- 3 core performers with consistent identity
- 5 freelance performers (hire per shoot)
- Stats: starPower, fatigue, loyalty (display only for MVP)
- Fatigue increases after shoots
- Basic fatigue recovery over time

### Economy
- Starting cash: $5,000
- Debt: $10,000 due by Day 90
- Revenue from Premium content
- Follower/subscriber growth from Promo content
- Location costs per shoot

### Social Media
- Instagram: conservative reach, high conversion
- X (Twitter): moderate reach, engagement focused
- Post promo content to gain followers
- Followers convert to subscribers at fixed rate

### Progression
- One unlockable location (Tier 1)
- Reputation stat (tracks overall progress)
- Debt pressure creates urgency

### Technical
- Single-page application
- Vanilla HTML/CSS/JS only
- Desktop-only (no mobile)
- Single gameState object
- localStorage save/load
- JSON export/import for backup

## Explicitly Out of Scope (Do Not Build)

### Features — Do Not Implement
- Acts 2 and 3 story content
- Rival studios and competition system
- Rankings and leaderboards
- POV reward scenes
- Contract negotiation choices
- Sexual leverage mechanics
- Moral alignment system effects
- Chemistry and duo shoots
- Reddit platform
- Paid promotion campaigns
- Viral mechanics
- Custom subscriber requests
- Performer poaching
- Awards system
- Multiple equipment tiers
- Tier 2-3 locations

### Technical — Do Not Implement
- Mobile or responsive layouts
- Backend server or database
- API integrations
- Authentication or user accounts
- Payment processing
- Frameworks (React, Vue, etc.)
- Build tools (Webpack, Vite, etc.)
- Service workers
- Background music
- Complex animations

## Document Authority Order

When documents conflict, follow this priority:

1. **CURRENT-SCOPE.md** (this file) — wins over everything
2. **BUILD-ORDER.md** — wins for implementation sequence
3. **TECHNICAL-GUARDRAILS.md** — wins for tech decisions
4. **GAME-CONFIG.md** — wins for balance values
5. **STATE-AND-FLOW.md** — wins for data structures
6. **UI-BLUEPRINT.md** — wins for screen layouts

All docs in `/docs/vision/` are reference only.

## Quick Decision Guide

Before implementing any feature, ask:

1. Is it listed in "In Scope" above? → Build it
2. Is it listed in "Out of Scope" above? → Do not build it
3. Does it appear only in vision docs? → Do not build it
4. Not sure? → Build the simpler version

## Updating This Document

When MVP scope changes:
1. Update this file first
2. Move items between In Scope and Out of Scope
3. Update MVP Hard Numbers table if needed
4. Other docs follow this file, not the reverse
