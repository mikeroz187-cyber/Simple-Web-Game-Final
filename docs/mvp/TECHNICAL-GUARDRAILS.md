# Technical Guardrails (MVP)

This document defines strict technical rules for the Studio Empire MVP.
These rules are non-negotiable. Do not deviate from them.

## Allowed Tech Stack

The MVP must use ONLY:

- HTML5
- CSS3
- Vanilla JavaScript (ES6+)

The project must:
- Run entirely in the browser
- Work without a backend server
- Require no build step
- Have no external dependencies

## Prohibited Technologies

Do not add any of the following:

### Frameworks and Libraries
- React, Vue, Angular, Svelte
- jQuery
- Bootstrap, Tailwind
- Any UI component library

### Build Tools
- Webpack, Vite, Parcel, Rollup
- Babel
- TypeScript
- Sass, Less, PostCSS

### Backend
- Node.js, Express, or any server
- Firebase, Supabase, or any BaaS
- Any database (SQL or NoSQL)
- Serverless functions

### Authentication
- OAuth flows
- JWT tokens
- Session management
- User account systems

### Payments
- Stripe, PayPal, or any payment processor

If a feature requires any of these, it is out of scope for MVP.

## Architecture Rules

### Single Source of Truth

All game data lives in ONE object called gameState.

- No duplicate state objects
- No storing state in the DOM
- UI reads from gameState, never the reverse

### File Organization

Follow this structure exactly:
