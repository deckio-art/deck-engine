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

Read `deck.config.js` and check:

- `theme`
- `designSystem`

Then read the active theme descriptor:

- Built-in themes → `node_modules/@deckio/deck-engine/themes/descriptors/<theme>.md`
- Custom themes → `src/themes/<theme>/descriptor.md` or `src/themes/<theme>.descriptor.md`
- If a custom descriptor is missing, fall back to the built-in descriptor implied by `designSystem`

Use the descriptor as the source of truth for slide structure, CSS patterns, decorative language, component ecosystem, and anti-patterns.

If `designSystem` is `shadcn`, also read the shadcn supplement instructions:
- `shadcn-setup.instructions.md` — infrastructure contract
- `shadcn-components.instructions.md` — component reference, preinstalled set, MCP expansion workflow

Real shadcn/ui components (`Button`, `Card`, `Badge`, `Separator`, `Alert`) are preinstalled — prefer them over CSS imitation. To add more components, use MCP (prompt Copilot, e.g., *"Add Dialog from shadcn"*) or CLI (`npx shadcn@latest add dialog`). See `MCP-GUIDE.md` for the full MCP authoring reference.

## Out of scope — do NOT modify

- `App.jsx`, `main.jsx` — these are generic, engine-driven, identical across projects
- `vite.config.js`, `package.json`, `index.html` — project scaffolding, don't touch
- Anything in `node_modules/` or the deck-engine package itself

## Project architecture

- `deck.config.js` — single source of truth: metadata + slide array + theme + design-system choice
- `src/slides/` — one `PascalCase.jsx` + matching `.module.css` per slide
- `src/data/` — ESM exports for logos, speakers, opportunity data, governance
- The engine (`@deckio/deck-engine`) provides: `Slide`, `BottomBar`, `Navigation`, `SlideProvider`, `useSlides`, `GenericThankYouSlide`
- The active theme descriptor provides the AI-facing slide-authoring rules

## Data conventions

- Always use ESM imports for images: `import logo from '../data/logos/acme.png'`
- Export data as named exports or default objects
- Keep data files focused — one concern per file
