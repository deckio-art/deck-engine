# Project Context

- **Owner:** Ali Soliman
- **Project:** DECKIO / deck-engine — a presentation engine and scaffolder for creating beautiful, Copilot-powered slide decks
- **Stack:** Node.js monorepo (npm workspaces), Vite, HTML/CSS/JS, packages: `@deckio/deck-engine` and `@deckio/create-deck-project`
- **Created:** 2026-03-13

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->
- The monorepo is intentionally minimal: root npm workspaces only, with two publishable packages — `@deckio/deck-engine` (runtime, styles, scripts, Copilot assets) and `@deckio/create-deck-project` (CLI scaffolder that generates deck projects and then runs engine bootstrap).
- `@deckio/deck-engine` is a thin React 19 presentation runtime: `SlideProvider` owns navigation state and persistence, `Slide` handles active/exit rendering plus dev overflow warnings, `Navigation` owns progress/export chrome, and `global.css` supplies the shared token system and slide shell primitives.
- The Vite integration point is small but critical: `packages/deck-engine/vite.js` dedupes `react` and `react-dom` so package subpath imports still share a single `SlideContext` instance.
- Copilot integration is file-driven, not code-plugin-driven: the engine ships `skills/`, `instructions/`, and `AGENTS.md`, and `scripts/init-project.mjs` copies them into a generated deck’s `.github/` and root files while also bootstrapping `.github/memory/state.md` and VS Code Simple Browser settings.
- Export is screenshot-first in both browser and CLI flows: in-app PDF/PPTX export captures each rendered slide with `modern-screenshot`, while the CLI PDF exporter drives a deck through Puppeteer and assembles a PDF from screenshots.
- There is no generalized runtime plugin API yet; extensibility today comes from composing React slides/components, overriding `--accent`, using `useSlides()`/`selectedCustomer`, passing `Navigation` export props, and adding more Copilot skills/instructions.
