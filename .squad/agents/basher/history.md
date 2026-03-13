# Project Context

- **Owner:** Ali Soliman
- **Project:** DECKIO / deck-engine — a presentation engine and scaffolder for creating beautiful, Copilot-powered slide decks
- **Stack:** Node.js monorepo (npm workspaces), Vite, HTML/CSS/JS, packages: `@deckio/deck-engine` and `@deckio/create-deck-project`
- **Created:** 2026-03-13

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->
- **2026-03-13 Team Kickoff:** Zero dev scripts exist; `npm run dev` missing entirely. Export code duplicated across browser/export and cli/pdf; consolidation into shared utility is Phase 1 priority. Bundling solid but no dev loop ergonomics. CLI export driver works but lacks error handling and progress indicators.
- **Team Findings (Rusty synthesis):** SlideProvider handles state persistence elegantly; Vite integration dedupes react/react-dom via subpath import magic. Copilot skills are file-driven (no code plugins). Export uses modern-screenshot for slides + Puppeteer for PDF assembly. No generalized plugin API yet; extensibility via React composition.
- **Phase 1 Roadmap:** Implement dev/build/preview scripts, consolidate export logic, add CLI error handling. Phase 1 is dev workflow + Vitest infrastructure (Linus concurrent). Phase 2 layout + animation (Livingston). Phase 3 polish + presenter mode.
