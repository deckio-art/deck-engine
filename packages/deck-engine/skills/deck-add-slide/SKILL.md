---
name: deck-add-slide
description: Guide for adding a new slide to a deck project. Use this when asked to create, add, or build a new slide component.
---

# Adding a Slide to a Deck Project

## Step 0 — Read `deck.config.js` → check `designSystem`

Do this **before writing any JSX or CSS**:

1. Open `deck.config.js`.
2. Read the `designSystem` field.
3. Branch immediately:
   - If `designSystem === 'shadcn'` → follow **Section S** exactly.
   - If `designSystem` is missing or any value other than `'shadcn'` → follow **Section D** exactly.
4. Do **not** mix rules from both sections.

This decision comes first because `designSystem` controls the slide structure, allowed classes, and allowed tokens.

---

# D. Default Design System (`designSystem` is NOT `'shadcn'`)

If `designSystem` is **not** `'shadcn'`, use the default DECKIO slide patterns below.

## D1. Mandatory JSX skeleton

Every default slide **must** start from this exact structure:

```jsx
import { BottomBar, Slide } from '@deckio/deck-engine'
import styles from './MyNewSlide.module.css'

export default function MyNewSlide({ index, project }) {
  return (
    <Slide index={index} className={styles.myNewSlide}>
      <div className="accent-bar" />
      <div className={`orb ${styles.orb1}`} />
      <div className={`orb ${styles.orb2}`} />

      <div className={`${styles.body} content-frame content-gutter`}>
        {/* Slide content */}
      </div>

      <BottomBar text="Project Footer Text" />
    </Slide>
  )
}
```

### Required child order inside `<Slide>`

1. `<div className="accent-bar" />`
2. `2–4` orb elements using the global `orb` class plus local positioning classes
3. One content wrapper using `content-frame content-gutter`
4. `<BottomBar text="..." />` as the last child

### Import paths

| Resource | Import Path |
|---|---|
| `Slide`, `BottomBar`, `Navigation`, `SlideProvider`, `useSlides`, `GenericThankYouSlide` | `'@deckio/deck-engine'` |
| Data / logos | `'../data/<file>'` |

## D2. Mandatory CSS module skeleton

Create `MyNewSlide.module.css` with this starting structure:

```css
.myNewSlide {
  background: var(--background);
  padding: 0 0 44px 0;
}

.orb1 {
  width: 420px;
  height: 420px;
  top: -100px;
  right: -60px;
  background: radial-gradient(
    circle at 40% 40%,
    var(--accent),
    color-mix(in srgb, var(--green) 30%, transparent) 50%,
    transparent 70%
  );
}

.orb2 {
  width: 320px;
  height: 320px;
  bottom: -40px;
  right: 100px;
  background: radial-gradient(
    circle at 50% 50%,
    var(--purple-deep),
    color-mix(in srgb, var(--purple-deep) 30%, transparent) 60%,
    transparent 75%
  );
}

.body {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
}

.card {
  position: relative;
  overflow: hidden;
  background: var(--secondary);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--purple), var(--accent));
  opacity: 0.6;
}
```

### Default tokens — use these exact names

Use these tokens in default slides:

- `var(--background)`
- `var(--foreground)`
- `var(--muted-foreground)`
- `var(--secondary)`
- `var(--border)`
- `var(--accent)`
- `var(--blue-glow)`
- `var(--purple)`
- `var(--purple-deep)`
- `var(--pink)`
- `var(--cyan)`
- `var(--green)`
- `var(--surface-overlay)`

### Default global classes available without import

| Class | Purpose |
|---|---|
| `accent-bar` | Left gradient accent bar |
| `orb` | Base decorative orb |
| `grid-dots` | Dot grid pattern |
| `content-frame` | Width constraint to `1280px`, centered |
| `content-gutter` | `72px` left/right padding |

---

## D3. Typography conventions

| Element | Size | Weight | Spacing | Usage |
|---|---|---|---|---|
| `h1` | `clamp(42px, 5vw, 72px)` | 900 | `-2px` | Cover slides only |
| `h2` | `clamp(28px, 3.2vw, 36px)` | 700 | `-0.8px` | Main slide heading |
| `h3` | `16px–20px` | 700 | `-0.3px` | Card titles |
| Subtitle | `17px` | 300–400 | — | `color: var(--muted-foreground)`, below heading |
| Body text | `13px–14px` | 400 | — | `color: var(--muted-foreground)` |
| Badge/label | `10px–11px` | 600–700 | `1.5px` | Uppercase, rounded bg |

---

## D4. Content layout patterns

### Card grid
```css
.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
```

### Standard card
```css
.card {
  position: relative;
  overflow: hidden;
  background: var(--secondary);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
}
.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--purple), var(--accent));
  opacity: 0.6;
}
```

---

# S. shadcn Design System (`designSystem: 'shadcn'`)

## S1. Mandatory JSX skeleton

shadcn slides use shadcn/ui-style structure rules. The appearance can still be light or dark, but the component language stays editorial and clean.

```jsx
import { BottomBar, Slide } from '@deckio/deck-engine'
import styles from './MyNewSlide.module.css'

export default function MyNewSlide({ index, project }) {
  return (
    <Slide index={index} className={styles.myNewSlide}>
      <div className={`${styles.body} content-frame content-gutter`}>
        <div className={styles.overline}>
          <span className={styles.overlineDash} />
          <span className={styles.overlineText}>SECTION LABEL</span>
        </div>

        <h2 className={styles.title}>Slide Title</h2>
        <p className={styles.subtitle}>Supporting copy for the slide.</p>

        <div className={styles.cards}>
          <article className={styles.card}>
            <h3>Card title</h3>
            <p>Card body text.</p>
          </article>
        </div>
      </div>

      <BottomBar text="Project Footer Text" />
    </Slide>
  )
}
```

## S2. Mandatory CSS module skeleton

Create `MyNewSlide.module.css` with this starting structure:

```css
.myNewSlide {
  background: color-mix(in oklch, var(--background) 85%, transparent);
  padding: 0 0 44px 0;
}

.body {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.overline {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 4px;
}

.overlineDash {
  width: 32px;
  height: 2px;
  border-radius: 999px;
  background: var(--primary);
}

.overlineText {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--muted-foreground);
}

.title {
  font-size: clamp(28px, 3.2vw, 36px);
  font-weight: 700;
  color: var(--foreground);
}

.subtitle {
  font-size: clamp(16px, 1.6vw, 19px);
  font-weight: 400;
  color: var(--muted-foreground);
}

.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  box-shadow: 0 1px 3px color-mix(in srgb, var(--foreground) 4%, transparent);
}
```

Use `background: var(--background)` instead of the semi-transparent mix **only** when the slide intentionally needs a solid backdrop (typically cover or thank-you slides).

### Import paths (shadcn project)

| Resource | Import Path |
|---|---|
| `Slide`, `BottomBar`, `Navigation`, `SlideProvider`, `useSlides`, `GenericThankYouSlide` | `'@deckio/deck-engine'` |
| Data / logos | `'../data/<file>'` |
| ReactBits components | `'@/components/ui/<component>'` |
| shadcn/ui components | `'@/components/ui/<component>'` |

### Available ReactBits components (pre-installed)

| Component | Import | Usage |
|---|---|---|
| `BlurText` | `import BlurText from '@/components/ui/blur-text'` | Animated text reveal |
| `ShinyText` | `import ShinyText from '@/components/ui/shiny-text'` | Shimmering labels / overlines |
| `DecryptedText` | `import DecryptedText from '@/components/ui/decrypted-text'` | Decode animation |
| `SpotlightCard` | `import SpotlightCard from '@/components/ui/spotlight-card'` | Interactive spotlight card |

### Adding shadcn/ui components

Users can install components via `npx shadcn add <component>`. Common examples:

- `npx shadcn add button` → `import { Button } from '@/components/ui/button'`
- `npx shadcn add badge` → `import { Badge } from '@/components/ui/badge'`
- `npx shadcn add card` → `import { Card, CardHeader, CardContent } from '@/components/ui/card'`
- `npx shadcn add separator` → `import { Separator } from '@/components/ui/separator'`

---

## S3. shadcn tokens — use these exact names

Always use these token names:

| Token | Purpose |
|---|---|
| `var(--background)` | Page/slide background |
| `var(--foreground)` | Primary text color |
| `var(--card)` | Card/surface background |
| `var(--card-foreground)` | Text on cards |
| `var(--primary)` | Bold emphasis, buttons |
| `var(--primary-foreground)` | Text on primary |
| `var(--secondary)` | Subtle surface |
| `var(--secondary-foreground)` | Text on secondary |
| `var(--muted)` | Very subtle background |
| `var(--muted-foreground)` | Dimmed text |
| `var(--border)` | Borders and dividers |
| `var(--ring)` | Focus rings |
| `var(--radius)` | Default border-radius |
| `var(--destructive)` | Error accent |
| `var(--surface-overlay)` | Semi-transparent overlay |
| `var(--shadow-elevated)` | Elevated shadow |

Optional decorative accents allowed inside content only — do not turn them into full-slide background decoration:

```
var(--blue-glow)     var(--purple)     var(--purple-deep)
var(--pink)          var(--cyan)       var(--green)
```

### shadcn global classes available without import

| Class | Purpose |
|---|---|
| `content-frame` | Width constraint to `1280px`, centered |
| `content-gutter` | `72px` left/right padding |

---

## S4. shadcn anti-patterns — never do these

These are hard rules:

1. **NEVER use `accent-bar` class in shadcn projects.**
2. **NEVER use `orb` class in shadcn projects.**
3. **NEVER use `grid-dots` in shadcn projects.**
4. **NEVER use `var(--bg-deep)` in shadcn projects.**
5. **NEVER use `var(--surface)` in shadcn projects.**
6. **NEVER use `var(--text)` in shadcn projects.**
7. **NEVER use `var(--text-muted)` in shadcn projects.**
8. **NEVER add gradient `::before` bars to cards in shadcn projects.**
9. **NEVER hardcode deep-space glow decoration in shadcn projects.**

---

## S5. Typography conventions (shadcn)

| Element | Size | Weight | Color |
|---|---|---|---|
| `h1` | `clamp(44px, 5vw, 72px)` | 800 | `var(--foreground)` |
| `h2` | `clamp(28px, 3.2vw, 36px)` | 700 | `var(--foreground)` |
| `h3` | `16px–20px` | 600 | `var(--foreground)` |
| Subtitle | `clamp(16px, 1.6vw, 19px)` | 400 | `var(--muted-foreground)` |
| Body text | `13px–14px` | 400 | `var(--muted-foreground)` |
| Overline/label | `12px–13px` | 500 | `var(--muted-foreground)`, uppercase, `letter-spacing: 2–3px` |

### Overline pattern

```jsx
<div className={styles.overline}>
  <span className={styles.overlineDash} />
  <span className={styles.overlineText}>SECTION LABEL</span>
</div>
```

---

## S6. Content layout patterns (shadcn)

### Card grid
```css
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
```

### Standard card
```css
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  box-shadow: 0 1px 3px color-mix(in srgb, var(--foreground) 4%, transparent);
}
```

### Two-column layout
```css
.layout {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 64px;
  align-items: center;
}
```

---

# Common to Both Design Systems

## E. Registration in `deck.config.js`

After creating the slide files, register the slide in `deck.config.js`:

1. Add an import at the top: `import MyNewSlide from './src/slides/MyNewSlide.jsx'`
2. Add the component to the `slides` array at the desired position.
3. Do **not** change `theme`, `designSystem`, or `aurora` while registering the slide.

The generic `App.jsx` renders slides from this array, passing `index` as a prop automatically. You do **not** manage slide indices manually.

### Example: adding before ThankYou

```js
import MyNewSlide from './src/slides/MyNewSlide.jsx'
// ... other imports

export default {
  // ... metadata
  slides: [
    CoverSlide,
    // ... existing slides
    MyNewSlide,
    ThankYouSlide,
  ],
}
```

---

## F. Content density limits

Slides must never overflow the viewport. The engine shows a **red dashed border warning** in dev mode when content exceeds the slide bounds. Follow these limits:

| Layout | Max items | Notes |
|--------|-----------|-------|
| Cards (3-col grid) | 6 (2 rows) | Reduce card padding if tight |
| Cards (2-col grid) | 4 (2 rows) | Preferred for detailed cards |
| Timeline / event list | 3–4 items | Use compact card height for 4 |
| Bullet points | 6–8 | Depends on line length |
| Full-width content blocks | 2–3 | E.g. quote + detail section |

When content exceeds limits, split across multiple slides rather than cramming.

---

## G. Anti-patterns to avoid (all design systems)

1. Missing `content-frame content-gutter`
2. Missing `BottomBar`
3. String paths for images instead of ESM imports
4. Missing `padding: 0 0 44px 0` on the slide root CSS class
5. Inconsistent `BottomBar text`
6. Using `flex: 1` on the body wrapper
7. Adding `flex-direction: column` on the slide root
8. Overloading a slide until it overflows
9. Using the wrong design-system pattern set for the project

---

## H. Complete step-by-step

1. Read `deck.config.js`.
2. Branch on `designSystem`.
3. Create `src/slides/<SlideName>Slide.jsx` using **Section D1** or **Section S1**.
4. Create `src/slides/<SlideName>Slide.module.css` using **Section D2** or **Section S2**.
5. Register the slide in `deck.config.js`.
6. Verify the slide in the running deck.

### Quick checklist (default design system)

- [ ] Read `deck.config.js` — confirmed `designSystem` is **not** `'shadcn'`
- [ ] Created `<SlideName>Slide.jsx` with `accent-bar`, orbs, `content-frame content-gutter`, and `BottomBar`
- [ ] Created `<SlideName>Slide.module.css` with `background: var(--background)`, `padding: 0 0 44px 0`, body wrapper, and default card/orb patterns
- [ ] Import added to `deck.config.js`
- [ ] Component added to the `slides` array
- [ ] `BottomBar text` matches the project convention

### Quick checklist (shadcn design system)

- [ ] Read `deck.config.js` — confirmed `designSystem: 'shadcn'`
- [ ] Created `<SlideName>Slide.jsx` with `content-frame content-gutter` and `BottomBar`
- [ ] Created `<SlideName>Slide.module.css` with `background: color-mix(in oklch, var(--background) 85%, transparent)` and `padding: 0 0 44px 0`
- [ ] Used shadcn tokens (`--background`, `--foreground`, `--card`, `--border`, `--muted-foreground`, `--primary`)
- [ ] **NO `accent-bar` class**
- [ ] **NO `orb` class**
- [ ] **NO `var(--bg-deep)`**
- [ ] **NO card gradient `::before` bars**
- [ ] Import added to `deck.config.js`
- [ ] Component added to the `slides` array
- [ ] `BottomBar text` matches the project convention
