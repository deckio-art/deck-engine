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

### 2026-03-13 — Visual Audit: Slide Transition Bleed-through

**Critical Bug Found:** In `audit-after-nav.png`, previous slide content ("Test Shadcn Deck" title from slide 1) bleeds through at the top of slide 2 during/after navigation. This is a **z-index/opacity stacking bug** caused by:

1. `.slide` class in `global.css:218-231` has **no background-color** set — slides are transparent by default
2. When transitioning: old slide gets `.exit-left` → `opacity: 0; transform: translateX(-60px)` but **remains visible in DOM**
3. New slide gets `.active` → `opacity: 1; transform: translateX(0)` but without an opaque background, old content can show through
4. The semi-transparent nature of slide content (cards over Aurora) compounds this — there's no solid layer to hide the exit-left slide

**Root Cause:** The transition relies on `opacity` alone, but both slides coexist in DOM with `position: absolute; inset: 0`. Without `visibility: hidden` on non-active slides OR an opaque `background` on each slide, content bleeds through.

**Fix Options:**
- Add `visibility: hidden` to `.slide` base class, `visibility: visible` only on `.active`
- Or add `background: var(--slide-bg)` to `.slide` base class so each slide has solid background

**Other Audit Notes (slides look good overall):**
- Capability cards: well-spaced, proper shadcn border-radius (~10px), clean emoji icons
- Typography hierarchy: "CAPABILITIES" eyebrow in blue, "What You Can Build" in clean bold heading
- Code badges (monospace inline code): consistent appearance across cards
- Bottom bar: "TEST-SHADCN-DECK" positioned left, gear icon positioned right — correct z-index, clean blur backdrop
- Card grid: 3-up responsive layout, subtle shadows, consistent internal padding
- Design token compliance: Cards use `--border` color, backgrounds appear token-based

**Severity:** High — this bug is visible to users after any navigation and fails the "top notch" bar for issue #2.
