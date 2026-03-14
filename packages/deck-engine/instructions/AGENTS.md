# Deck Project

This is a presentation deck built with `@deckio/deck-engine`.

## Purpose

Create and maintain slide-based presentations. Each project is a self-contained deck with its own theme, data, and slides.

## What to do

- Create, edit, and delete slides in `src/slides/`
- Manage project data in `src/data/`
- Register and reorder slides in `deck.config.js`

## What NOT to do

- Do not modify `App.jsx`, `main.jsx`, `vite.config.js`, `package.json`, or `index.html` — these are scaffolding files driven by the engine
- Do not modify anything in `node_modules/` or the engine itself
- Do not add dependencies without being asked

## Stack

- React 19, Vite, CSS Modules
- `@deckio/deck-engine` provides: `Slide`, `BottomBar`, `Navigation`, `SlideProvider`, `useSlides`, `GenericThankYouSlide`
- See `.github/instructions/` for detailed conventions on slide JSX, CSS modules, and deck.config.js
- See `.github/skills/` for step-by-step workflows (e.g., adding a slide)

## Design system

Check `designSystem` in `deck.config.js`. When it is `'shadcn'`:

- Real shadcn/ui components are preinstalled: `Button`, `Card`, `Badge`, `Separator`, `Alert`
- ReactBits motion components are preinstalled: `Aurora`, `BlurText`, `ShinyText`, `DecryptedText`, `SpotlightCard`
- **Prefer real component imports over CSS imitation** — this is the default authoring pattern
- **Expand via MCP** — the shadcn MCP server is pre-configured in `.vscode/mcp.json`. To add new components, prompt Copilot (e.g., *"Add Dialog from shadcn"*) or use `npx shadcn@latest add <name>`
- Both shadcn/ui and ReactBits registries are configured in `components.json` and coexist cleanly
- Read the shadcn supplement instructions (`shadcn-setup.instructions.md`, `shadcn-components.instructions.md`) for the full reference
- See `MCP-GUIDE.md` for detailed MCP authoring prompts and workflows
