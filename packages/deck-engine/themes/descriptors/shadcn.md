# Theme Descriptor — shadcn

## Metadata

- **Theme id:** `shadcn`
- **Primary slide authoring pattern:** `component-native`
- **Compatible design systems:** `shadcn`
- **Design system supplement:** `shadcn-design-system.md` (loaded when `designSystem: 'shadcn'`)
- **Mood:** editorial, product-grade, semantic-token-driven, clean
- **Read this file when:** `deck.config.js` uses `theme: 'shadcn'` or `designSystem: 'shadcn'` and you need to create, inspect, validate, or generate assets for slides

---

## Component availability

Scaffolded shadcn decks ship with **real shadcn/ui v4 components** ready to import. This is the real component library — not CSS imitation.

### Component status table

| Component | Status | Import | Notes |
|---|---|---|---|
| **Button** | ✅ Preinstalled | `import { Button } from '@/components/ui/button'` | 6 variants, 8 sizes, `asChild` via Radix Slot |
| **Card** | ✅ Preinstalled | `import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from '@/components/ui/card'` | 7 sub-components, container queries |
| **Badge** | ✅ Preinstalled | `import { Badge } from '@/components/ui/badge'` | 6 variants, Slot support |
| **Separator** | ✅ Preinstalled | `import { Separator } from '@/components/ui/separator'` | Radix primitive, horizontal/vertical |
| **Alert** | ✅ Preinstalled | `import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'` | 2 variants (default, destructive) |
| Dialog | 🔧 Add via CLI | `npx shadcn@latest add dialog` | Radix Dialog primitive |
| Sheet | 🔧 Add via CLI | `npx shadcn@latest add sheet` | Slide-out panels |
| Tooltip | 🔧 Add via CLI | `npx shadcn@latest add tooltip` | Hover information |
| Tabs | 🔧 Add via CLI | `npx shadcn@latest add tabs` | Content organization |
| Input | 🔧 Add via CLI | `npx shadcn@latest add input` | Form input fields |
| Select | 🔧 Add via CLI | `npx shadcn@latest add select` | Dropdown selection |
| Table | 🔧 Add via CLI | `npx shadcn@latest add table` | Data display |
| Accordion | 🔧 Add via CLI | `npx shadcn@latest add accordion` | Collapsible sections |
| Avatar | 🔧 Add via CLI | `npx shadcn@latest add avatar` | User/brand images |
| Progress | 🔧 Add via CLI | `npx shadcn@latest add progress` | Progress indicators |

> **Expand via CLI:** `npx shadcn@latest add <component>`
> **Expand via MCP:** Use the preconfigured shadcn MCP server in `.vscode/mcp.json`

### ReactBits animation components (preinstalled)

| Component | Import | Use case |
|---|---|---|
| `Aurora` | `'@/components/ui/aurora'` | Animated gradient canvas background |
| `BlurText` | `'@/components/ui/blur-text'` | Staggered text reveal on scroll |
| `ShinyText` | `'@/components/ui/shiny-text'` | Shimmer gradient sweep |
| `DecryptedText` | `'@/components/ui/decrypted-text'` | Character scramble → reveal |
| `SpotlightCard` | `'@/components/ui/spotlight-card'` | Mouse-following radial highlight |

### Infrastructure (preinstalled)

- `src/index.css` — imports `@deckio/deck-engine/styles/global.css` and the active theme CSS
- `packages/deck-engine/themes/shadcn.css` — shadcn token map, Tailwind v4 import, `@theme inline` bridge
- `components.json` — shadcn CLI config with `@/` aliases + `@react-bits` registry
- `src/lib/utils.js` — exports `cn()` (clsx + tailwind-merge)
- `src/components/theme-provider.jsx` — light/dark mode for the deck shell
- `vite.config.js` — `@` → `src` path alias
- `jsconfig.json` — path mappings for `@/*`
- `.vscode/mcp.json` — preconfigured shadcn MCP server

---

## Slide personality

shadcn slides should look intentionally different from the default DECKIO system: cleaner surfaces, no deep-space ornament, no left accent bar, no floating orbs inside slide content, and strong reliance on **real components first**, semantic tokens second.

**Component-native composition is the default pattern.** Reach for Button, Card, Badge, Alert, and Separator before writing custom HTML. CSS modules handle layout and deck-specific polish — components handle content structure.

---

## Default authoring pattern — component-native JSX

This is the **primary** pattern for new slides. Use real shadcn components for content structure; CSS modules for layout and slide-specific polish.

```jsx
import { BottomBar, Slide } from '@deckio/deck-engine'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle
} from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import SpotlightCard from '@/components/ui/spotlight-card'
import styles from './MyNewSlide.module.css'

export default function MyNewSlide({ index, project }) {
  return (
    <Slide index={index} className={styles.myNewSlide}>
      <div className={`${styles.body} content-frame content-gutter`}>
        <div className={styles.header}>
          <Badge variant="secondary">Product Update</Badge>
          <h2 className={styles.title}>Slide Title</h2>
          <p className={styles.subtitle}>Supporting copy for the slide.</p>
        </div>

        <Alert>
          <AlertTitle>Key signal</AlertTitle>
          <AlertDescription>
            Use Alert for the framing point, then let Cards carry deeper detail.
          </AlertDescription>
        </Alert>

        <Separator />

        <div className={styles.grid}>
          <Card>
            <CardHeader>
              <CardTitle>Metric card</CardTitle>
              <CardDescription>Real shadcn surfaces, not DIVs.</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Keep custom CSS focused on layout, spacing, and deck-specific polish.</p>
            </CardContent>
          </Card>

          <SpotlightCard
            className={styles.accentCard}
            spotlightColor="color-mix(in srgb, var(--accent) 25%, transparent)"
          >
            <h3>ReactBits accent</h3>
            <p>Motion belongs inside content blocks, not as full-slide ornament.</p>
          </SpotlightCard>
        </div>

        <div className={styles.actions}>
          <Button>Next step</Button>
          <Button variant="outline">Learn more</Button>
        </div>
      </div>

      <BottomBar text={project.title} />
    </Slide>
  )
}
```

### Companion CSS module

CSS modules handle **layout only** — not content structure. Components own their own visual appearance via Tailwind classes and CVA variants.

```css
.myNewSlide {
  background: var(--background);
  padding: 0 0 44px 0;
}

.body {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg, 24px);
}

.header {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-sm, 12px);
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
  gap: var(--spacing-md, 20px);
}

.actions {
  display: flex;
  gap: var(--spacing-sm, 12px);
  justify-content: flex-start;
}
```

---

## shadcn v4 patterns used in preinstalled components

Understanding these patterns helps you use components correctly and stay consistent when adding new ones:

| Pattern | What it means | Example |
|---|---|---|
| `data-slot` | Every component emits a `data-slot` attribute for styling hooks | `<button data-slot="button">` |
| CVA variants | Variants defined via `class-variance-authority`, selected by prop | `<Button variant="destructive" size="lg">` |
| `asChild` | Renders as child element instead of default tag (via Radix Slot) | `<Button asChild><a href="/next">Go</a></Button>` |
| `cn()` | Class merging via clsx + tailwind-merge — always use for className composition | `className={cn("p-4", className)}` |
| Sub-components | Compound components composed as children | `<Card><CardHeader><CardTitle>...</CardTitle></CardHeader></Card>` |
| Container queries | Card uses `@container` for responsive internal layout | `@container/card-header` |

---

## Migration examples

### Before: raw HTML/CSS → After: real components

**Badge — before (CSS imitation):**
```jsx
<span className={styles.badge}>Beta</span>
```
```css
.badge {
  display: inline-flex;
  align-items: center;
  border-radius: 9999px;
  padding: 2px 10px;
  font-size: 12px;
  background: var(--secondary);
  color: var(--secondary-foreground);
}
```

**Badge — after (real component):**
```jsx
import { Badge } from '@/components/ui/badge'

<Badge variant="secondary">Beta</Badge>
```
No custom CSS needed. Variant handles styling. `data-slot="badge"` available for overrides.

---

**Card — before (raw markup):**
```jsx
<div className={styles.card}>
  <div className={styles.cardHeader}>
    <h3 className={styles.cardTitle}>Feature</h3>
    <p className={styles.cardDesc}>Description text</p>
  </div>
  <div className={styles.cardBody}>
    <p>Content here</p>
  </div>
</div>
```
```css
.card { background: var(--card); border: 1px solid var(--border); border-radius: var(--radius); }
.cardHeader { padding: 24px 24px 0; }
.cardTitle { font-size: 18px; font-weight: 600; color: var(--card-foreground); }
.cardDesc { font-size: 14px; color: var(--muted-foreground); }
.cardBody { padding: 24px; }
```

**Card — after (real component):**
```jsx
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'

<Card>
  <CardHeader>
    <CardTitle>Feature</CardTitle>
    <CardDescription>Description text</CardDescription>
  </CardHeader>
  <CardContent>
    <p>Content here</p>
  </CardContent>
</Card>
```
Zero custom CSS. Card's built-in Tailwind classes handle spacing, colors, borders. Override by adding `className` prop.

---

**Alert — before (manual markup):**
```jsx
<div className={styles.callout} role="alert">
  <strong>Important</strong>
  <p>This is the key takeaway for this slide.</p>
</div>
```

**Alert — after (real component):**
```jsx
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Info } from 'lucide-react'

<Alert>
  <Info className="size-4" />
  <AlertTitle>Important</AlertTitle>
  <AlertDescription>This is the key takeaway for this slide.</AlertDescription>
</Alert>
```
Semantic `role="alert"` is built in. SVG icon support via grid layout. Destructive variant available.

---

**Button — before (raw link):**
```jsx
<a href="/next" className={styles.button}>Continue →</a>
```

**Button — after (real component with `asChild`):**
```jsx
import { Button } from '@/components/ui/button'

<Button asChild variant="outline">
  <a href="/next">Continue →</a>
</Button>
```
`asChild` renders the `<a>` tag directly while applying Button styling. No wrapper element.

---

## Token and Tailwind contract

### `packages/deck-engine/themes/shadcn.css` contains

1. **Tailwind v4 import:** `@import "tailwindcss"`
2. **Light and dark semantic token sets:** background, foreground, card, primary, secondary, muted, accent, destructive, border, input, ring, popover, and radius
3. **Deck-specific token groups:** decorative palette, overlays/glows, layout, typography, spacing, radius scale, z-index, and transition tokens
4. **Chart tokens:** `--chart-1` through `--chart-5`
5. **Tailwind bridge:** `@theme inline` maps the shadcn semantic variables into Tailwind utilities

### `@theme inline` bridge mapping

The bridge exposes these Tailwind-facing variables:

| CSS variable | Tailwind utility |
|---|---|
| `--color-background` | `bg-background` |
| `--color-foreground` | `text-foreground` |
| `--color-card` / `--color-card-foreground` | `bg-card`, `text-card-foreground` |
| `--color-primary` / `--color-primary-foreground` | `bg-primary`, `text-primary-foreground` |
| `--color-secondary` / `--color-secondary-foreground` | `bg-secondary`, `text-secondary-foreground` |
| `--color-accent` / `--color-accent-foreground` | `bg-accent`, `text-accent-foreground` |
| `--color-destructive` / `--color-destructive-foreground` | `bg-destructive`, `text-destructive-foreground` |
| `--color-muted` / `--color-muted-foreground` | `bg-muted`, `text-muted-foreground` |
| `--color-border` | `border-border` |
| `--color-input` | `border-input` |
| `--color-ring` | `ring-ring` |
| `--color-popover` / `--color-popover-foreground` | `bg-popover`, `text-popover-foreground` |
| `--radius` | `rounded-[var(--radius)]` |

### Semantic tokens (full list)

| Category | Tokens |
|---|---|
| Core | `--background`, `--foreground` |
| Card | `--card`, `--card-foreground` |
| Primary | `--primary`, `--primary-foreground` |
| Secondary | `--secondary`, `--secondary-foreground` |
| Muted | `--muted`, `--muted-foreground` |
| Accent | `--accent`, `--accent-foreground` |
| Destructive | `--destructive`, `--destructive-foreground` |
| Form | `--border`, `--input`, `--ring` |
| Popover | `--popover`, `--popover-foreground` |
| Radius | `--radius` |

### Deck-specific support tokens

| Category | Tokens |
|---|---|
| Layout | `--slide-bg`, `--content-max-width`, `--content-gutter` |
| Overlays | `--surface-overlay`, `--surface-overlay-heavy`, `--background-overlay`, `--border-subtle`, `--shadow-elevated` |
| Decorative | `--blue-glow`, `--purple`, `--purple-deep`, `--pink`, `--cyan`, `--green` |
| Charts | `--chart-1` through `--chart-5` |

---

## Available components — import reference

### Engine primitives

| Resource | Import |
|---|---|
| `Slide`, `BottomBar`, `Navigation`, `SlideProvider`, `useSlides`, `GenericThankYouSlide` | `'@deckio/deck-engine'` |
| Data / logos | `'../data/<file>'` |

### Preinstalled shadcn/ui (v4)

| Resource | Import |
|---|---|
| `Button` | `'@/components/ui/button'` |
| `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter` | `'@/components/ui/card'` |
| `Badge` | `'@/components/ui/badge'` |
| `Separator` | `'@/components/ui/separator'` |
| `Alert`, `AlertTitle`, `AlertDescription` | `'@/components/ui/alert'` |

### Preinstalled ReactBits

| Resource | Import |
|---|---|
| `Aurora` | `'@/components/ui/aurora'` |
| `BlurText` | `'@/components/ui/blur-text'` |
| `ShinyText` | `'@/components/ui/shiny-text'` |
| `DecryptedText` | `'@/components/ui/decrypted-text'` |
| `SpotlightCard` | `'@/components/ui/spotlight-card'` |

### Utilities

| Resource | Import |
|---|---|
| `cn()` | `'@/lib/utils'` |
| `ThemeProvider` | `'./components/theme-provider'` |
| Icons (Lucide) | `'lucide-react'` |

---

## Decorative elements

| Element | Rule |
|---|---|
| `content-frame` | Required layout wrapper on every slide body |
| `content-gutter` | Required layout wrapper — provides horizontal padding |
| `Button`, `Card`, `Badge`, `Alert`, `Separator` | **Default** content structure — use these first |
| ReactBits accents | Allowed when they support the story and stay inside content blocks |
| Decorative gradients | Allowed only inside content blocks, never as full-slide space effects |

---

## Canonical setup path

For the full DECKIO shadcn wiring, also read:

- `.github/instructions/shadcn-setup.instructions.md`
- `packages/deck-engine/themes/descriptors/shadcn-design-system.md` (design system supplement)

---

## Anti-patterns

1. **Never use raw HTML where a preinstalled component exists** — `<div class="badge">` when `Badge` is available is always wrong
2. **Never use CSS modules to recreate component appearance** — Card, Badge, Alert have built-in styling via Tailwind classes
3. Never use `accent-bar` (dark theme only)
4. Never use `orb` (dark theme only)
5. Never use `grid-dots` as a default shadcn framing device
6. Never use legacy token names: `var(--bg-deep)`, `var(--surface)`, `var(--text)`, `var(--text-muted)`
7. Never add deep-space glow decoration as full-slide ornament
8. **Never import a component that hasn't been added** — check the status table above; use `npx shadcn@latest add <name>` for components marked "Add via CLI"
9. **Never skip `cn()` when composing classNames** — always merge with `cn()` to avoid Tailwind class conflicts
10. **Never hardcode colors** — use semantic tokens or Tailwind utilities mapped to the token bridge

---

## Example slide direction

A strong shadcn slide reads like a polished product or strategy artifact: real components for every recognizable UI pattern (badges, cards, alerts, buttons, separators), CSS modules only for grid layout and slide-level spacing, semantic tokens for any custom styling, and ReactBits accents only where motion genuinely supports the story.
