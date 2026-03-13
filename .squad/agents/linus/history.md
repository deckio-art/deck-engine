# Project Context

- **Owner:** Ali Soliman
- **Project:** DECKIO / deck-engine — a presentation engine and scaffolder for creating beautiful, Copilot-powered slide decks
- **Stack:** Node.js monorepo (npm workspaces), Vite, HTML/CSS/JS, packages: `@deckio/deck-engine` and `@deckio/create-deck-project`
- **Created:** 2026-03-13

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->
- **2026-03-13 Team Kickoff:** Zero tests in repository; no Vitest, Jest, or Playwright configured. `package.json` missing `test` script. Publishing to npm with zero automated gates—critical Phase 1 blocker. Core untested components: SlideProvider, Slide, Navigation, export logic, CLI scaffolder.
- **Team Findings (Rusty synthesis):** Engine architecture solid: SlideProvider owns state/persistence, Slide handles render states, Navigation owns chrome. Export is screenshot-first (modern-screenshot + Puppeteer). Vite integration critical (dedupes react/react-dom). CLI works but no error handling.
- **Phase 1 Roadmap:** Install Vitest, write 20-30 unit tests for core components, set up GitHub Actions CI gates before npm publish. Phase 1 concurrent with Basher (dev scripts). Phase 2 integration tests + layout tests. Phase 3 E2E deck authoring + export.
