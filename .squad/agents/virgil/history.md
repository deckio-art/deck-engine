# Project Context

- **Owner:** Ali Soliman
- **Project:** DECKIO / deck-engine — a presentation engine and scaffolder for creating beautiful, Copilot-powered slide decks
- **Stack:** Node.js monorepo (npm workspaces), Vite, HTML/CSS/JS, packages: `@deckio/deck-engine` and `@deckio/create-deck-project`
- **Created:** 2026-03-13
- **Themes:** dark, light, shadcn — each with its own CSS file + design tokens
- **CSS Architecture:** @layer ordering (theme < base < components < utilities), Tailwind integration, design tokens as CSS custom properties
- **Test Infrastructure:** Vitest 4.x workspace, 130+ unit tests, tests in `packages/<pkg>/__tests__/*.test.js`
- **Key Findings from Team:**
  - Design token coverage is minimal (16 custom properties, mostly color). Zero typography/spacing/radius tokens. (DESIGN-001)
  - 3 unused tokens, 6 places where `--blue-glow` is bypassed with hardcoded rgba values
  - No `focus-visible` styles or `prefers-reduced-motion` queries yet
  - Production builds pass on all 3 themes after PROCESS-001 fix
  - `ThankYouSlide.module.css` is dead code (132 lines, not imported)

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->
