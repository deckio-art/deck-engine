---
description: "Use when creating or editing slide CSS modules in a deck project. Enforces required properties, layout rules, and theme-appropriate variables."
applyTo: "**/slides/**/*.module.css"
---

# Slide CSS Module Conventions

## Step 0 — Read `deck.config.js` and the active descriptor

Before writing any slide CSS:

1. Read `theme` and `designSystem` from `deck.config.js`
2. Resolve the active theme descriptor
3. Use that descriptor as the source of truth for CSS skeleton, token names, decorative rules, and anti-patterns

### Descriptor resolution

- Built-in themes: read `dark.md`, `light.md`, or `shadcn.md` from `node_modules/@deckio/deck-engine/themes/descriptors/`
- Custom themes: read `src/themes/<theme>/descriptor.md` or `src/themes/<theme>.descriptor.md`
- If the custom descriptor is missing, fall back to the built-in descriptor implied by `designSystem`

If `designSystem` is `shadcn`, also read `.github/instructions/shadcn-setup.instructions.md` before editing setup-sensitive files or claiming component availability.

## What to read in the descriptor

Before generating CSS, read:

- **Exact CSS skeleton**
- **Token table**
- **Decorative elements available**
- **Anti-patterns**

If the descriptor gives an exact skeleton, start there and adapt only as needed for content.

## Engine `.slide` class (all themes)

The engine's `.slide` class already sets `flex-direction: column`, `justify-content: center`, and `overflow: hidden`. The engine also sets `flex-grow: 0` on all direct slide children, so content stays at its natural height and is vertically centered by default. No scrolling is allowed.

For dense slides that need top-alignment, override with `justify-content: flex-start`.

> **Do NOT add `flex: 1` or `flex-grow: 1`** to the body wrapper or any direct slide child.

## Global classes (no import needed)

Some global classes are shared across all themes and some are descriptor-specific. Always defer to the active descriptor for which of these are actually allowed:

| Class | Purpose |
|-------|---------|
| `content-frame` | Width constraint to `1280px`, centered |
| `content-gutter` | `72px` left/right padding |
| `accent-bar` | Default DECKIO descriptor only |
| `orb` | Default DECKIO descriptor only |
| `grid-dots` | Default DECKIO descriptor only |

## Typography

Use the descriptor's scale first. If the descriptor does not specify a detail, default to:

| Element | Size | Weight | Spacing |
|---------|------|--------|---------|
| h1 | `clamp(42px, 5vw, 72px)` | 800–900 | `-2px` |
| h2 | `clamp(28px, 3.2vw, 36px)` | 700 | `-0.8px` |
| h3 | `16px–20px` | 600–700 | `-0.3px` |
| Subtitle | `16px–19px` | 300–400 | — |
| Body | `13px–14px` | 400 | — |
| Label | `10px–13px` | 500–700 | `1.5px` to `3px` |

Text colors should usually come from `var(--foreground)` and `var(--muted-foreground)` unless the descriptor says otherwise.

## Content density limits

Slides must never overflow the viewport. The engine shows a red dashed border warning in dev mode when content exceeds the slide bounds. When content doesn't fit, split across multiple slides rather than cramming.
