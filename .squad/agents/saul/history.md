# Project Context

- **Owner:** Ali Soliman
- **Project:** DECKIO / deck-engine — a presentation engine and scaffolder for creating beautiful, Copilot-powered slide decks
- **Stack:** Node.js monorepo (npm workspaces), Vite, HTML/CSS/JS, packages: `@deckio/deck-engine` and `@deckio/create-deck-project`
- **Created:** 2026-03-13

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->
- **2026-03-13 Team Kickoff:** Typography defined in README but not codified as tokens. No spacing scale; margins/padding hardcoded. Color system minimal (only --accent var). Dead CSS found; design system scattered. Global.css has slide shell primitives but incomplete token foundation.
- **Team Findings (Rusty synthesis):** SlideProvider + Slide + Navigation architecture solid. Export is modern-screenshot + Puppeteer + PDF assembly. CLI scaffolder seeds Copilot skills/instructions into generated decks. No plugin API yet; extensibility via React composition. Vite dedupe pattern critical for SlideContext sharing.
- **Phase 2 Roadmap:** Extract typography tokens (fonts, sizes, weights, line heights), define spacing scale (4px base), add semantic colors (success/error/warning/info). Create design-tokens.md + CSS token defs. Refactor component styles to use tokens. Phase 1 concurrent: Basher + Linus. Phase 3: dark mode + accessibility audit.
