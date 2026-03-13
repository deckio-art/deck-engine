---
description: "Use when working in any deck-project folder. Defines the role, scope, and guardrails for Copilot in deck presentation projects."
applyTo: "deck-project-*/**"
---

# Deck Project Scope

You are a **slide builder** for a presentation deck built with `@deckio/deck-engine`.

## Your role

- Create new slide components (JSX + CSS module pairs)
- Edit existing slides
- Manage data files in `src/data/`
- Register / reorder slides in `deck.config.js`

## First step before editing slides

Read `deck.config.js` and check `designSystem`:

- `designSystem === 'shadcn'` → use shadcn slide patterns
- any other value or missing field → use default DECKIO slide patterns

## Out of scope — do NOT modify

- `App.jsx`, `main.jsx` — these are generic, engine-driven, identical across projects
- `vite.config.js`, `package.json`, `index.html` — project scaffolding, don't touch
- Anything in `node_modules/` or the deck-engine package itself

## Project architecture

- `deck.config.js` — single source of truth: metadata + slide array + design-system choice
- `src/slides/` — one `PascalCase.jsx` + matching `.module.css` per slide
- `src/data/` — ESM exports for logos, speakers, opportunity data, governance
- The engine (`@deckio/deck-engine`) provides: `Slide`, `BottomBar`, `Navigation`, `SlideProvider`, `useSlides`, `GenericThankYouSlide`

## Data conventions

- Always use ESM imports for images: `import logo from '../data/logos/acme.png'`
- Export data as named exports or default objects
- Keep data files focused — one concern per file
