# Design System Supplement — shadcn

## Metadata

- **Design system id:** `shadcn`
- **Supplements theme descriptors:** `shadcn.md` (primary), but orthogonal to theme choice
- **Activates when:** `deck.config.js` includes `designSystem: 'shadcn'`
- **Read this file when:** You need to understand how shadcn/ui components compose together in slide context, how to maintain visual coherence across a deck, or how the design system layer relates to the theme layer

---

## What this file is

This is the **design system supplement** — it documents how components work _together_ to build coherent slides. The theme descriptor (`shadcn.md`) covers what's available and how to use individual components. This file covers **composition patterns, visual rhythm, and design system coherence**.

The design system layer is orthogonal to theme choice:
- `theme` controls visual appearance (colors, tokens, mood)
- `designSystem` controls component infrastructure (what components exist, how they compose)
- You can have `theme: "shadcn"` with or without `designSystem: "shadcn"`
- When `designSystem: "shadcn"` is active, this supplement applies regardless of theme

---

## Component composition patterns

### Slide anatomy

Every shadcn slide follows this structural hierarchy:

```
Slide (engine primitive — positioning, transitions)
└── content-frame + content-gutter (engine layout — max-width, padding)
    └── Slide body (CSS module — flex column, gap)
        ├── Header region (Badge + heading + subtitle)
        ├── Content region (Cards, Alerts, Separators, custom blocks)
        ├── Action region (Buttons)
        └── BottomBar (engine primitive — deck title, page number)
```

**Rules:**
- `Slide` + `BottomBar` always come from `@deckio/deck-engine`
- `content-frame` and `content-gutter` are required CSS classes on the body wrapper
- Everything between header and actions is the content region — compose freely with components

### Header pattern

The header is the most consistent element across slides. Always follow this order:

```jsx
<div className={styles.header}>
  <Badge variant="secondary">Category label</Badge>    {/* optional kicker */}
  <h2 className={styles.title}>Main heading</h2>        {/* required */}
  <p className={styles.subtitle}>Supporting text</p>     {/* optional */}
</div>
```

- Badge kickers use `variant="secondary"` or `variant="outline"` — never `default` (too heavy for a label)
- Title uses `var(--foreground)`, clamp sizing `clamp(28px, 3.2vw, 36px)`
- Subtitle uses `var(--muted-foreground)`, clamp sizing `clamp(16px, 1.6vw, 19px)`
- Header gap: 12px between elements

### Card grid pattern

Cards are the primary content container. Use grids of 2–4 columns:

```jsx
<div className={styles.grid}>
  <Card>
    <CardHeader>
      <CardTitle>Title</CardTitle>
      <CardDescription>Detail</CardDescription>
    </CardHeader>
    <CardContent>
      <p>Body content</p>
    </CardContent>
  </Card>
  {/* ... more cards */}
</div>
```

```css
.grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));  /* 2-col default */
  gap: var(--spacing-md, 20px);
}

/* 3-col for feature showcases */
.gridThree { grid-template-columns: repeat(3, minmax(0, 1fr)); }

/* 4-col for metric dashboards (tight) */
.gridFour { grid-template-columns: repeat(4, minmax(0, 1fr)); }
```

**Visual rhythm rules:**
- 2 columns: general content, comparisons, before/after
- 3 columns: feature showcases, step sequences
- 4 columns: metric dashboards, KPI rows (use sparingly — tight at 1280×720)
- Never mix column counts within a single slide
- Card gap: 20px (consistent across all grid sizes)

### Alert as framing device

Alerts work as contextual framing — use them to set up the content that follows:

```jsx
<Alert>
  <Info className="size-4" />
  <AlertTitle>Context setter</AlertTitle>
  <AlertDescription>
    Frame the problem or key insight before diving into detail cards.
  </AlertDescription>
</Alert>

<Separator />

<div className={styles.grid}>
  {/* Detail cards follow the alert */}
</div>
```

- Place alerts **before** card grids, not inside them
- Use `<Separator />` between alert and grid for visual breathing room
- Destructive variant (`variant="destructive"`) only for genuine warnings
- One alert per slide maximum

### Button action row

Buttons anchor the bottom of the content region:

```jsx
<div className={styles.actions}>
  <Button>Primary action</Button>
  <Button variant="outline">Secondary action</Button>
  <Button variant="ghost">Tertiary</Button>
</div>
```

- Maximum 3 buttons per action row
- Primary (default variant) always comes first
- `variant="outline"` for secondary actions
- `variant="ghost"` for tertiary/de-emphasized actions
- Gap: 12px between buttons
- Align left (`justify-content: flex-start`) — never center button rows

### Separator usage

Separators create visual breaks between content sections:

```jsx
<Header />
<Alert />
<Separator />        {/* between framing and detail */}
<CardGrid />
<Separator />        {/* between detail and actions */}
<Actions />
```

- Maximum 2 separators per slide
- Never stack separators adjacent to each other
- Horizontal orientation (default) for content breaks
- Vertical orientation for inline element separation (rare in slides)

---

## Variant usage guide

### Button variants in slide context

| Variant | Slide use case | Visual weight |
|---|---|---|
| `default` | Primary CTA, "next step", key action | Heavy — filled primary color |
| `destructive` | Delete, remove, warning actions | Heavy — filled destructive color |
| `outline` | Secondary action, "learn more", alternatives | Medium — bordered |
| `secondary` | Supplementary action, metadata links | Medium — muted fill |
| `ghost` | Tertiary action, navigation hints | Light — text only |
| `link` | Inline text links within content | Minimal — underlined text |

### Badge variants in slide context

| Variant | Slide use case |
|---|---|
| `secondary` | Default kicker/label above headings |
| `outline` | Subtle categorization, metadata tags |
| `default` | Status indicators (use sparingly — high contrast) |
| `destructive` | Warning/error status |
| `ghost` | Rarely used in slides; available for custom overlays |
| `link` | Rarely used in slides; available for badge links |

### Alert variants in slide context

| Variant | Slide use case |
|---|---|
| `default` | Context-setting, key insight framing, pro tips |
| `destructive` | Critical warnings, breaking changes, blockers |

---

## Composition with Radix primitives

Preinstalled components build on Radix UI. When adding components via CLI/MCP, they follow the same patterns:

### `asChild` pattern

`asChild` replaces the default rendered element with the child element, forwarding all props:

```jsx
{/* Button renders as <a> tag with Button styling */}
<Button asChild variant="outline">
  <a href="https://github.com/project" target="_blank">
    View on GitHub
  </a>
</Button>

{/* Badge renders as <a> tag */}
<Badge asChild variant="secondary">
  <a href="/changelog">v2.0</a>
</Badge>
```

**When to use:** Links that should look like buttons, or any case where the semantic HTML element differs from the visual component.

### Compound component composition

shadcn components use the compound component pattern — compose by nesting:

```jsx
{/* Card with action button in header (v4 pattern) */}
<Card>
  <CardHeader>
    <CardTitle>Feature</CardTitle>
    <CardDescription>Description</CardDescription>
    <CardAction>
      <Button variant="outline" size="sm">Edit</Button>
    </CardAction>
  </CardHeader>
  <CardContent>
    <p>Content</p>
  </CardContent>
  <CardFooter>
    <Button>Save</Button>
  </CardFooter>
</Card>
```

- Always maintain the nesting order: Header → Content → Footer
- `CardAction` goes inside `CardHeader` (v4 auto-positions it)
- Don't skip levels (no `CardTitle` outside `CardHeader`)

### `data-slot` styling hooks

Every component emits `data-slot` for external styling:

```css
/* Override Card background in a specific slide */
.specialSlide [data-slot="card"] {
  background: color-mix(in srgb, var(--card) 80%, var(--accent) 20%);
}

/* Style all badges in this slide */
.specialSlide [data-slot="badge"] {
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
```

**Prefer this over className overrides** when you need slide-scoped component styling. It targets component identity, not implementation-specific class names.

---

## Mixing preinstalled + added components

When you add new components via `npx shadcn@latest add`, they automatically inherit the token system. Visual coherence is maintained because:

1. **Same token foundation** — all shadcn components read from `--background`, `--foreground`, `--border`, `--radius`, etc.
2. **Same utility layer** — Tailwind classes resolve to the same theme bridge
3. **Same `cn()` utility** — className composition is consistent
4. **Same `data-slot` convention** — styling hooks work the same way

### Coherence checklist when adding components

- ✅ The new component reads from the same CSS variables — no configuration needed
- ✅ Border radius matches via `--radius` token
- ✅ Colors match via semantic tokens (not hardcoded values)
- ⚠️ Check font sizing — some components may use `text-sm` which maps to Tailwind's scale. Verify it aligns with slide heading/body sizes
- ⚠️ Check spacing — component internal padding uses Tailwind spacing. Verify it doesn't look cramped or loose at 1280×720 slide dimensions
- ⚠️ Animation — added components may include transitions. Ensure they don't conflict with ReactBits animations on the same slide

### Example: adding Dialog for a detail overlay

```bash
npx shadcn@latest add dialog
```

```jsx
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogDescription,
  DialogHeader, DialogTitle, DialogTrigger
} from '@/components/ui/dialog'

{/* Inside your slide content */}
<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">View details</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>Feature deep-dive</DialogTitle>
      <DialogDescription>
        Extended information that doesn't fit on the slide surface.
      </DialogDescription>
    </DialogHeader>
    <p>Detailed content here.</p>
  </DialogContent>
</Dialog>
```

Note: Dialogs render as overlays — they work in dev mode but may not export/screenshot correctly. Use with awareness of the export pipeline.

---

## Deck-specific design tokens

These tokens extend the shadcn vocabulary for presentation-specific needs. They are defined in the theme CSS (`shadcn.css`), not by shadcn/ui itself:

### Slide composition tokens

| Token | Purpose | Default (shadcn theme) |
|---|---|---|
| `--slide-bg` | Full slide background behind content frame | Same as `--background` |
| `--content-max-width` | Maximum width of `content-frame` | `1100px` |
| `--content-gutter` | Horizontal padding inside `content-gutter` | `48px` |
| `--surface-overlay` | Card/surface overlay for frosted effects | Translucent white/black |
| `--surface-overlay-heavy` | Stronger overlay for modal-like surfaces | Higher opacity overlay |
| `--border-subtle` | Lighter border for decorative separation | Lower opacity border |
| `--shadow-elevated` | Elevated card shadow | Subtle box-shadow value |

### Typography tokens

| Token | Purpose |
|---|---|
| `--font-family-body` | Body text font (Inter / system) |
| `--font-family-mono` | Code block font |
| `--font-size-body` | Base body text size |
| `--font-size-small` | Caption/small text |
| `--font-weight-normal` | Body weight |
| `--font-weight-semibold` | Heading weight |
| `--font-weight-bold` | Strong emphasis weight |
| `--line-height-body` | Body line height |

### Spacing tokens

| Token | Purpose |
|---|---|
| `--spacing-xs` | Tight spacing (4px) |
| `--spacing-sm` | Small spacing (8–12px) |
| `--spacing-md` | Medium spacing (16–20px) |
| `--spacing-lg` | Large spacing (24–32px) |
| `--spacing-xl` | Section spacing (40–48px) |

These tokens are **safe to use in CSS modules** alongside shadcn's Tailwind utilities. They bridge the gap between the component library's utility-first approach and the deck engine's CSS variable system.

---

## Visual coherence rules

These rules ensure every slide in a deck feels like it belongs to the same family:

### Typography hierarchy

1. **Slide title:** `clamp(28px, 3.2vw, 36px)`, weight 700, `var(--foreground)`
2. **Card titles:** Let `CardTitle` handle it (built-in `text-lg font-semibold`)
3. **Body text:** `clamp(14px, 1.2vw, 16px)`, `var(--foreground)` or `var(--muted-foreground)`
4. **Labels/kickers:** Badge component — never manual `font-size: 12px` spans
5. **Code:** `var(--font-family-mono)`, `text-sm`

### Color usage

| Role | Token | When to use |
|---|---|---|
| Page background | `--background` | Slide surface |
| Primary text | `--foreground` | Headings, body text |
| Secondary text | `--muted-foreground` | Subtitles, descriptions, metadata |
| Content surfaces | `--card` / `--card-foreground` | Card backgrounds |
| Interactive | `--primary` / `--primary-foreground` | Buttons (default variant), links |
| Neutral interactive | `--secondary` / `--secondary-foreground` | Badge kickers, secondary buttons |
| Emphasis | `--accent` / `--accent-foreground` | Hover states, highlights |
| Error/warning | `--destructive` / `--destructive-foreground` | Destructive buttons, error alerts |
| Borders | `--border` | Card borders, separators |
| Focus | `--ring` | Focus rings on interactive elements |

**Never use decorative palette tokens** (`--blue-glow`, `--purple`, etc.) for content structure. They exist for optional ambient effects only.

### Spacing rhythm

- Header-to-content gap: 24px (`--spacing-lg`)
- Between content blocks: 20px (`--spacing-md`)
- Inside card headers/content: handled by component (don't override)
- Action row gap: 12px (`--spacing-sm`)
- Slide bottom padding: 44px (BottomBar clearance)

### Border radius

- All components use `--radius` (0.625rem in shadcn theme)
- Don't mix `border-radius: var(--radius)` with hardcoded values
- Pill shapes (`border-radius: 9999px`) only for Badge — it handles this internally

### Animation discipline

- ReactBits components handle their own animation — don't layer CSS animations on top
- Entrance animations (stagger, fade-in) belong in CSS modules, not inline styles
- Maximum 2 animated elements per slide to avoid visual noise
- Prefer `opacity` + `transform` animations (GPU-accelerated) over `width`/`height`/`margin`

---

## Decision: CSS modules vs Tailwind utilities

Both are valid in shadcn slides. Here's when to use which:

| Use CSS modules for | Use Tailwind utilities for |
|---|---|
| Slide-level layout (grid, flex, positioning) | Component className overrides |
| Slide-specific animations (keyframes, stagger) | Quick spacing/color tweaks on components |
| Complex responsive patterns | One-off utility classes on wrapper divs |
| Anything that needs a named class for `styles.x` | Anything the component already supports via `className` |

**Example of correct mixing:**

```jsx
{/* CSS module for layout, Tailwind for component tweaks */}
<div className={styles.grid}>
  <Card className="shadow-md">                    {/* Tailwind override */}
    <CardHeader>
      <CardTitle className="text-xl">Big</CardTitle> {/* Tailwind override */}
    </CardHeader>
    <CardContent>
      <p>Content</p>
    </CardContent>
  </Card>
</div>
```

**Never do this:**
```jsx
{/* Don't rebuild Card with CSS modules */}
<div className={styles.card}>
  <div className={styles.cardHeader}>...</div>
</div>
```

---

## Relationship to other descriptors

```
deck.config.js
├── theme: 'shadcn'      → loads shadcn.md (theme descriptor)
│                            ↳ tokens, visual identity, what to import
├── designSystem: 'shadcn' → loads shadcn-design-system.md (this file)
│                            ↳ composition patterns, coherence rules
└── both active together  → full shadcn authoring experience
```

The theme descriptor answers: **"What do I have and how do I use each piece?"**
This supplement answers: **"How do the pieces work together to make a coherent deck?"**
