### DESIGN-003: Design System Supplement Layer Architecture
**Author:** Saul | **Date:** 2026-03-14 | **Status:** Implemented

The design system supplement is a separate descriptor that activates alongside the theme descriptor when `designSystem: 'shadcn'` is configured. It is orthogonal to theme choice.

1. **File location:** `packages/deck-engine/themes/descriptors/shadcn-design-system.md` — lives alongside theme descriptors but serves a different role
2. **Activation model:** `theme` loads the theme descriptor (tokens, visual identity); `designSystem` loads the supplement (composition patterns, coherence rules)
3. **Content scope:** Composition patterns (slide anatomy, header/grid/alert/action patterns), variant usage in slide context, Radix primitive patterns, coherence rules (typography/color/spacing/radius/animation), CSS-modules-vs-Tailwind guidance
4. **Does not duplicate the theme descriptor** — theme descriptor answers "what do I have"; supplement answers "how do the pieces work together"
5. **Extensible to future design systems** — if a non-shadcn design system is added, its supplement follows the same pattern: `{design-system}-design-system.md`
6. **Coherence checklist included** — when authors add new components via CLI/MCP, the supplement provides a verification checklist (font sizing, spacing at 1280×720, animation conflicts)

**Key files:**
- `packages/deck-engine/themes/descriptors/shadcn-design-system.md` — the supplement
- `packages/deck-engine/themes/descriptors/shadcn.md` — updated to reference it
