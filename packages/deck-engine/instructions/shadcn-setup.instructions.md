---
description: "Canonical Tailwind v4 + shadcn setup contract for DECKIO decks. Read when designSystem is shadcn."
applyTo: "**/*"
---

# shadcn Setup Contract

Use this file when `deck.config.js` has `designSystem: 'shadcn'`.

## What is canonical today

1. `src/main.jsx` should import `./index.css`
2. `src/index.css` is the single CSS entrypoint for the deck
3. `src/index.css` should import:
   - `@deckio/deck-engine/styles/global.css`
   - `@deckio/deck-engine/themes/<theme>.css`
4. `global.css` establishes the canonical Tailwind layer order: `@layer theme, base, components, utilities;`
5. The active theme CSS provides `@import "tailwindcss"` plus the `@theme inline` bridge used by shadcn-style utilities

## What is preinstalled vs optional

### Preinstalled today

- `components.json`
- `jsconfig.json` plus the Vite `@` alias
- `src/lib/utils.js` with `cn()`
- `src/components/theme-provider.jsx`
- `.vscode/mcp.json`
- Local ReactBits files in `src/components/ui/`

### Not preinstalled today

Official shadcn/ui primitives like `button`, `card`, `badge`, `separator`, `alert`, `dialog`, and form controls are **not** bundled by default yet.

Only import `@/components/ui/<name>` for those primitives after the file exists locally.

## How to expand the project

### Add official shadcn/ui primitives

```bash
npx shadcn@latest add button card badge separator alert
```

### Add more ReactBits components through the shadcn registry

```bash
npx shadcn@latest add @react-bits/code-block
```

## Authoring rule of thumb

- Reach for real shadcn primitives first when they exist locally
- Use ReactBits for motion or special effects inside content blocks
- Keep custom CSS focused on layout, density, and deck-specific polish
- Do not rewrite the theme bridge inside slide CSS modules

## Verification checklist

Before claiming a deck is "using shadcn":

- `src/index.css` exists and is imported by `src/main.jsx`
- `components.json` exists
- `@/` resolves to `src`
- `src/lib/utils.js` exists
- Any imported official shadcn primitive actually exists under `src/components/ui/`
