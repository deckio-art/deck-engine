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

## Preinstalled components

Scaffolded shadcn decks ship with **real, working components** out of the box. These are source files copied into the project — not npm dependencies.

### shadcn/ui starter set (preinstalled)

| Component | Import path | Source |
|-----------|-------------|--------|
| `Button` | `'@/components/ui/button'` | Pre-scaffolded from engine templates |
| `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter` | `'@/components/ui/card'` | Pre-scaffolded from engine templates |
| `Badge` | `'@/components/ui/badge'` | Pre-scaffolded from engine templates |
| `Separator` | `'@/components/ui/separator'` | Pre-scaffolded from engine templates |
| `Alert`, `AlertTitle`, `AlertDescription` | `'@/components/ui/alert'` | Pre-scaffolded from engine templates |

### ReactBits starter set (preinstalled)

| Component | Import path | Purpose |
|-----------|-------------|---------|
| `Aurora` | `'@/components/ui/aurora'` | Gradient background effect |
| `BlurText` | `'@/components/ui/blur-text'` | Blur-in text animation |
| `ShinyText` | `'@/components/ui/shiny-text'` | Shimmer text effect |
| `DecryptedText` | `'@/components/ui/decrypted-text'` | Glitch text animation |
| `SpotlightCard` | `'@/components/ui/spotlight-card'` | Spotlight glow card wrapper |

### Infrastructure (preinstalled)

| Resource | Path | Purpose |
|----------|------|---------|
| `cn()` utility | `src/lib/utils.js` | Class name merging (clsx + tailwind-merge) |
| `ThemeProvider` | `src/components/theme-provider.jsx` | Light/dark mode shell |
| `components.json` | project root | shadcn CLI + registry config |
| `jsconfig.json` | project root | `@/*` path alias |
| `.vscode/mcp.json` | `.vscode/` | shadcn MCP server config |

### Add via CLI or MCP (not preinstalled)

Everything else in the shadcn/ui and ReactBits registries must be added before importing:

```bash
# Official shadcn/ui components
npx shadcn@latest add dialog
npx shadcn@latest add sheet tooltip input textarea select

# ReactBits components via registry
npx shadcn@latest add @react-bits/code-block
npx shadcn@latest add @react-bits/animated-content
```

Or use the shadcn MCP server (preconfigured in `.vscode/mcp.json`) to add components through Copilot.

## Default authoring pattern

**Real components are the default.** When `designSystem: 'shadcn'`, every new slide should:

1. **Import preinstalled components first** — `Button`, `Card`, `Badge`, `Separator`, `Alert` are already there. Use them.
2. **Use ReactBits for motion** — `BlurText`, `SpotlightCard`, etc. for animation inside content blocks.
3. **Use CSS Modules only for layout** — grid, spacing, density, positioning. Not for recreating what components already do.
4. **Never imitate a component with raw markup** — if `<Card>` exists, use it. Don't hand-build a card-like div with border-radius and background.
5. **Add more components via CLI when needed** — if the slide needs a dialog, accordion, or tabs, run `npx shadcn@latest add <name>` first, then import.

## Design-system supplement layer

When `designSystem: 'shadcn'` is set in `deck.config.js`, agents should load additional authoring context beyond the theme descriptor:

1. Read this file (`shadcn-setup.instructions.md`) for the setup contract
2. Read `shadcn-components.instructions.md` for the component reference and migration patterns
3. Check which components exist in `src/components/ui/` before importing — the preinstalled set is guaranteed, but additional ones may have been added by the author

This two-layer approach (theme descriptor + design-system supplement) lets the theme control visual language while the design system controls component authoring patterns.

## Verification checklist

Before claiming a deck is "using shadcn":

- `src/index.css` exists and is imported by `src/main.jsx`
- `components.json` exists
- `@/` resolves to `src`
- `src/lib/utils.js` exists
- Preinstalled shadcn/ui components exist: `button.jsx`, `card.jsx`, `badge.jsx`, `separator.jsx`, `alert.jsx` in `src/components/ui/`
- Preinstalled ReactBits components exist in `src/components/ui/`
- Any additional imported component actually exists under `src/components/ui/`
