# Theme Descriptor — shadcn

## Metadata

- **Theme id:** `shadcn`
- **Primary slide authoring pattern:** `shadcn-ready`
- **Compatible design systems:** `shadcn`
- **Mood:** editorial, product-grade, semantic-token-driven, clean
- **Read this file when:** `deck.config.js` uses `theme: 'shadcn'` or `designSystem: 'shadcn'` and you need to create, inspect, validate, or generate assets for slides

## Contract status — what is real today

### Preinstalled today

Generated shadcn decks already ship with the **setup contract**, not the full component library:

- `src/index.css` imports `@deckio/deck-engine/styles/global.css` and the active theme CSS
- `packages/deck-engine/themes/shadcn.css` provides the shadcn token map, Tailwind v4 import, and `@theme inline` bridge
- `components.json` exists with `@/` aliases plus the `@react-bits` registry
- `src/lib/utils.js` exports `cn()`
- `src/components/theme-provider.jsx` handles light/dark mode for the deck shell
- `vite.config.js` resolves `@` to `src`
- `.vscode/mcp.json` preconfigures the shadcn MCP server
- Local ReactBits files are scaffolded into `src/components/ui/`: `aurora`, `blur-text`, `shiny-text`, `decrypted-text`, `spotlight-card`

### Not preinstalled today

These official shadcn/ui primitives are **not** present until the author adds them or Phase 1 lands:

- `@/components/ui/button`
- `@/components/ui/card`
- `@/components/ui/badge`
- `@/components/ui/separator`
- `@/components/ui/alert`
- Any other registry component such as `dialog`, `sheet`, `tooltip`, `input`, or form primitives

Do **not** claim those files exist unless they are physically present in `src/components/ui/`.

### Phase 1 starter set (planned next)

Phase 1 will make the shadcn path immediately useful by preinstalling:

- `Button`
- `Card`
- `Badge`
- `Separator`
- `Alert`
- ReactBits picks already aligned with the starter deck: `Aurora`, `BlurText`, `ShinyText`, `DecryptedText`, `SpotlightCard`

## Slide personality

shadcn slides should look intentionally different from the default DECKIO system: cleaner surfaces, no deep-space ornament, no left accent bar, no floating orbs inside slide content, and strong reliance on semantic tokens or real components.

## Audit summary — token and Tailwind contract

### `packages/deck-engine/themes/shadcn.css` really contains

1. **Tailwind v4 import:** `@import "tailwindcss"`
2. **Light and dark semantic token sets:** background, foreground, card, primary, secondary, muted, accent, destructive, border, input, ring, popover, and radius
3. **Deck-specific token groups:** decorative palette, overlays/glows, layout, typography, spacing, radius scale, z-index, and transition tokens
4. **Chart tokens:** `--chart-1` through `--chart-5`
5. **Tailwind bridge:** `@theme inline` maps the shadcn semantic variables into Tailwind utilities

### `@theme inline` bridge mapping

The bridge currently exposes these Tailwind-facing variables:

- `--color-background`
- `--color-foreground`
- `--color-card`
- `--color-card-foreground`
- `--color-primary`
- `--color-primary-foreground`
- `--color-secondary`
- `--color-secondary-foreground`
- `--color-accent`
- `--color-accent-foreground`
- `--color-destructive`
- `--color-destructive-foreground`
- `--color-muted`
- `--color-muted-foreground`
- `--color-border`
- `--color-input`
- `--color-ring`
- `--color-popover`
- `--color-popover-foreground`
- `--radius`

That is what makes utilities like `bg-background`, `text-foreground`, `border-border`, and `ring-ring` line up with the active theme.

## Canonical setup path

For the full DECKIO shadcn wiring, also read:

- `.github/instructions/shadcn-setup.instructions.md`

That instruction file is the canonical source for how `src/index.css`, Tailwind v4, the theme CSS, aliases, `components.json`, and CLI/MCP expansion fit together.

## Exact JSX skeleton

Use this as the **target authoring pattern** once the official components exist locally (after Phase 1 or after running `npx shadcn@latest add button card badge separator alert`):

```jsx
import { BottomBar, Slide } from '@deckio/deck-engine'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import SpotlightCard from '@/components/ui/spotlight-card'
import styles from './MyNewSlide.module.css'

export default function MyNewSlide({ index, project }) {
  return (
    <Slide index={index} className={styles.myNewSlide}>
      <div className={`${styles.body} content-frame content-gutter`}>
        <div className={styles.header}>
          <Badge variant="secondary" className={styles.kicker}>Phase 1 target</Badge>
          <h2 className={styles.title}>Slide Title</h2>
          <p className={styles.subtitle}>Supporting copy for the slide.</p>
        </div>

        <Alert className={styles.alert}>
          <AlertTitle>Key signal</AlertTitle>
          <AlertDescription>
            Use Alert for the framing point, then let Cards carry the deeper detail.
          </AlertDescription>
        </Alert>

        <Separator />

        <div className={styles.grid}>
          <Card className={styles.metricCard}>
            <CardHeader>
              <CardTitle>Metric card</CardTitle>
              <CardDescription>Use real shadcn surfaces first.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Keep custom CSS focused on layout, spacing, and deck-specific polish.</p>
            </CardContent>
          </Card>

          <SpotlightCard className={styles.reactBitsCard} spotlightColor="color-mix(in srgb, var(--accent) 25%, transparent)">
            <h3>ReactBits accent</h3>
            <p>Optional motion or glow belongs inside content blocks, not as full-slide ornament.</p>
          </SpotlightCard>
        </div>

        <div className={styles.actions}>
          <Button>Next step</Button>
        </div>
      </div>

      <BottomBar text={project.title} />
    </Slide>
  )
}
```

If the official primitives are still missing, fall back to the preinstalled ReactBits files plus plain semantic-token markup. Do not fake imports.

## Exact CSS skeleton

```css
.myNewSlide {
  background: color-mix(in oklch, var(--background) 85%, transparent);
  padding: 0 0 44px 0;
}

.body {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.kicker {
  width: fit-content;
}

.title {
  font-size: clamp(28px, 3.2vw, 36px);
  font-weight: 700;
  color: var(--foreground);
}

.subtitle {
  font-size: clamp(16px, 1.6vw, 19px);
  color: var(--muted-foreground);
}

.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 20px;
}

.alert,
.metricCard,
.reactBitsCard {
  border-radius: var(--radius);
}

.actions {
  display: flex;
  justify-content: flex-start;
}
```

## Token table

### Semantic tokens available in the theme CSS

- `var(--background)`
- `var(--foreground)`
- `var(--card)`
- `var(--card-foreground)`
- `var(--primary)`
- `var(--primary-foreground)`
- `var(--secondary)`
- `var(--secondary-foreground)`
- `var(--muted)`
- `var(--muted-foreground)`
- `var(--accent)`
- `var(--accent-foreground)`
- `var(--destructive)`
- `var(--destructive-foreground)`
- `var(--border)`
- `var(--input)`
- `var(--ring)`
- `var(--popover)`
- `var(--popover-foreground)`
- `var(--radius)`

### Deck-specific support tokens

- Layout: `var(--slide-bg)`, `var(--content-max-width)`, `var(--content-gutter)`
- Overlays / shadows: `var(--surface-overlay)`, `var(--surface-overlay-heavy)`, `var(--background-overlay)`, `var(--border-subtle)`, `var(--shadow-elevated)`
- Decorative palette: `var(--blue-glow)`, `var(--purple)`, `var(--purple-deep)`, `var(--pink)`, `var(--cyan)`, `var(--green)`
- Charts: `var(--chart-1)` through `var(--chart-5)`

### Tailwind utility bridge that is safe to assume

The audited `@theme inline` block supports utility classes based on the semantic tokens above, including:

- `bg-background`, `text-foreground`
- `bg-card`, `text-card-foreground`
- `bg-primary`, `text-primary-foreground`
- `bg-secondary`, `text-secondary-foreground`
- `bg-muted`, `text-muted-foreground`
- `border-border`, `ring-ring`
- `bg-popover`, `text-popover-foreground`

## Decorative elements available

| Element | Rule |
|---|---|
| `content-frame` | Required layout wrapper |
| `content-gutter` | Required layout wrapper |
| `Badge`, `Alert`, `Separator`, `Card`, `Button` | Target component-first composition once official primitives exist |
| ReactBits accents | Allowed when they support the story and stay inside content blocks |
| Decorative gradients | Allowed only inside content blocks, never as full-slide space effects |

## Available components

### Core engine imports

| Resource | Import path |
|---|---|
| `Slide`, `BottomBar`, `Navigation`, `SlideProvider`, `useSlides`, `GenericThankYouSlide` | `'@deckio/deck-engine'` |
| Data / logos | `'../data/<file>'` |

### Preinstalled local authoring files

| Resource | Import path |
|---|---|
| `cn()` utility | `'@/lib/utils'` |
| `ThemeProvider` | `'./components/theme-provider'` from `src/App.jsx` |
| `Aurora` | `'@/components/ui/aurora'` |
| `BlurText` | `'@/components/ui/blur-text'` |
| `ShinyText` | `'@/components/ui/shiny-text'` |
| `DecryptedText` | `'@/components/ui/decrypted-text'` |
| `SpotlightCard` | `'@/components/ui/spotlight-card'` |

### Official shadcn/ui primitives — add before importing

- `npx shadcn@latest add button` → `import { Button } from '@/components/ui/button'`
- `npx shadcn@latest add badge` → `import { Badge } from '@/components/ui/badge'`
- `npx shadcn@latest add card` → `import { Card, CardHeader, CardContent } from '@/components/ui/card'`
- `npx shadcn@latest add separator` → `import { Separator } from '@/components/ui/separator'`
- `npx shadcn@latest add alert` → `import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'`

## Anti-patterns

1. Never imply that `@/components/ui/button` or other official shadcn primitives already exist unless the files are present
2. Never use `accent-bar`
3. Never use `orb`
4. Never use `grid-dots` as a default shadcn framing device
5. Never use `var(--bg-deep)`
6. Never use `var(--surface)`
7. Never use `var(--text)`
8. Never use `var(--text-muted)`
9. Never add deep-space glow decoration as full-slide ornament
10. Never let custom CSS replace obvious shadcn primitives once those primitives are available

## Example slide direction

A strong shadcn slide should read like a polished product or strategy artifact: real components when present, semantic token usage when not, calm card surfaces, clean hierarchy, and optional ReactBits accents only where they help the story.
