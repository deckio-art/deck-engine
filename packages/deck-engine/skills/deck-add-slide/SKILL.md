---
name: deck-add-slide
description: Guide for adding a new slide to a deck project. Use this when asked to create, add, or build a new slide component.
---

# Adding a Slide to a Deck Project

## ⚠ Theme Detection — Read First

Before generating any slide, **read `deck.config.js`** and check the `designSystem` field:

- **`designSystem: 'shadcn'`** → Follow **Section S (shadcn patterns)** below.
- **`designSystem: 'none'`** or field missing → Follow **Section A–D (default patterns)** below.

This determines the entire visual identity of the slide. Using the wrong patterns will create a jarring mismatch with the rest of the deck.

---

# DEFAULT Design System (`designSystem: 'none'` or absent)

## A. Slide Component Structure (mandatory skeleton)

Every slide **must** follow this structure:

```jsx
import { BottomBar, Slide } from '@deckio/deck-engine'
import styles from './MyNewSlide.module.css'

export default function MyNewSlide({ index, project }) {
  return (
    <Slide index={index} className={styles.myNewSlide}>
      {/* 1. Decorative elements — always first */}
      <div className="accent-bar" />
      <div className={`orb ${styles.orb1}`} />
      <div className={`orb ${styles.orb2}`} />

      {/* 2. Content area — vertically centered */}
      <div className={`${styles.body} content-frame content-gutter`}>
        {/* Slide content */}
      </div>

      {/* 3. Footer — always last child */}
      <BottomBar text="Project Footer Text" />
    </Slide>
  )
}
```

### Mandatory elements (in order inside `<Slide>`):

1. **`<div className="accent-bar" />`** — Left gradient accent bar. Include on every slide.
2. **Orbs** — 2–4 `<div className={\`orb ${styles.orbN}\`} />` for ambient background glow.
3. **Content wrapper** — `<div className="content-frame content-gutter">` constrains width to `1280px` and adds `72px` horizontal padding. **All visible content goes inside this wrapper.**
4. **`<BottomBar text="..." />`** — Sticky footer, always the last child. The `text` must match the project's convention (check existing slides).

### Import paths (standalone project):

| Resource | Import Path |
|---|---|
| `Slide`, `BottomBar`, `Navigation`, `SlideProvider`, `useSlides` | `'@deckio/deck-engine'` |
| `GenericThankYouSlide` | `'@deckio/deck-engine'` |
| Data / logos | `'../data/<file>'` |

---

## B. CSS Module Rules (Default)

Create a companion `.module.css` file matching the JSX filename (e.g., `MyNewSlide.module.css`).

### Required root class properties

```css
.myNewSlide {
  background: var(--bg-deep);
  padding: 0 0 44px 0;
}
```

- `background: var(--bg-deep)` — dark background on every slide
- `padding: 0 0 44px 0` — reserves space for the 44px BottomBar

The engine's `.slide` class provides `flex-direction: column`, `justify-content: center`, `align-items: stretch`, and `overflow: hidden` by default. It also sets `flex-grow: 0` on all direct slide children, so **content stays at its natural height and is vertically centered by default** — building from the center outward. No scrolling is allowed.

For dense slides that need top-alignment, override with `justify-content: flex-start`.

### Orb positioning (standard recipe)

```css
.orb1 {
  width: 420px; height: 420px;
  top: -100px; right: -60px;
  background: radial-gradient(circle at 40% 40%, var(--accent), var(--blue-glow) 50%, transparent 70%);
}
.orb2 {
  width: 320px; height: 320px;
  bottom: -40px; right: 100px;
  background: radial-gradient(circle at 50% 50%, var(--purple-deep), rgba(110,64,201,0.25) 60%, transparent 75%);
}
```

### Body wrapper

```css
.body {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
```

> **Do NOT add `flex: 1` or `flex-grow: 1`** to the body wrapper or any direct slide child — it stretches the wrapper to fill the slide and defeats the engine's built-in vertical centering. Inner elements within the body should also avoid `flex: 1` unless they genuinely need to fill remaining space within the body.

### Available CSS custom properties (Default / Dark theme)

```
--bg-deep: #080b10       --surface: #161b22      --border: #30363d
--text: #e6edf3          --text-muted: #8b949e   --accent: #58a6ff
--blue-glow: #1f6feb     --purple: #bc8cff       --purple-deep: #6e40c9
--pink: #f778ba          --cyan: #56d4dd         --green: #3fb950
--orange: #d29922
```

### Available global CSS classes (no import needed)

| Class | Purpose |
|---|---|
| `accent-bar` | Left gradient accent bar |
| `orb` | Base decorative orb (absolute, rounded, blur, opacity) |
| `grid-dots` | Dot grid pattern (200×200px) |
| `content-frame` | Width constraint to `1280px`, centered |
| `content-gutter` | `72px` left/right padding |

---

## C. Typography Conventions

| Element | Size | Weight | Spacing | Usage |
|---|---|---|---|---|
| `h1` | `clamp(42px, 5vw, 72px)` | 900 | `-2px` | Cover slides only |
| `h2` | `clamp(28px, 3.2vw, 36px)` | 700 | `-0.8px` | Main slide heading |
| `h3` | `16px–20px` | 700 | `-0.3px` | Card titles |
| Subtitle | `17px` | 300–400 | — | `color: var(--text-muted)`, below heading |
| Body text | `13px–14px` | 400 | — | `color: var(--text-muted)` |
| Badge/label | `10px–11px` | 600–700 | `1.5px` | Uppercase, rounded bg |

---

## D. Content Layout Patterns (Default)

### Card grid
```css
.cards { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
```

### Standard card
```css
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
  overflow: hidden;
  transition: transform 0.3s ease, border-color 0.3s ease;
}
.card::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0; height: 3px;
  background: linear-gradient(90deg, var(--purple), var(--accent));
  opacity: 0.6;
}
```

---

# shadcn Design System (`designSystem: 'shadcn'`)

## S1. Slide Component Structure (shadcn skeleton)

shadcn slides have a **clean, editorial aesthetic** — no orbs, no accent-bar, no speed-streak backgrounds. The Aurora background animation is handled by the engine and shows through semi-transparent slide backgrounds.

```jsx
import { BottomBar, Slide } from '@deckio/deck-engine'
import styles from './MyNewSlide.module.css'

export default function MyNewSlide({ index, project }) {
  return (
    <Slide index={index} className={styles.myNewSlide}>
      {/* Content area — vertically centered */}
      <div className={`${styles.body} content-frame content-gutter`}>
        {/* Slide content */}
      </div>

      {/* Footer — always last child */}
      <BottomBar text="Project Footer Text" />
    </Slide>
  )
}
```

### Key differences from default:

- **NO `accent-bar`** — shadcn does not use the left gradient bar
- **NO orbs** — no `<div className="orb ...">` elements
- **NO decorative gradients** — no radial-gradient backgrounds or glow effects
- Content wrapper (`content-frame content-gutter`) and `BottomBar` are still required

### Import paths (shadcn project):

| Resource | Import Path |
|---|---|
| `Slide`, `BottomBar`, `Navigation`, `SlideProvider`, `useSlides` | `'@deckio/deck-engine'` |
| `GenericThankYouSlide` | `'@deckio/deck-engine'` |
| Data / logos | `'../data/<file>'` |
| ReactBits components | `'@/components/ui/<component>'` |
| shadcn/ui components | `'@/components/ui/<component>'` |

### Available ReactBits components (pre-installed):

| Component | Import | Usage |
|---|---|---|
| `BlurText` | `import BlurText from '@/components/ui/blur-text'` | Animated text reveal (word-by-word or character-by-character) |
| `ShinyText` | `import ShinyText from '@/components/ui/shiny-text'` | Shimmering text effect for labels and overlines |
| `DecryptedText` | `import DecryptedText from '@/components/ui/decrypted-text'` | Matrix-style text decode animation |
| `SpotlightCard` | `import SpotlightCard from '@/components/ui/spotlight-card'` | Card with mouse-following spotlight glow |

### Adding shadcn/ui components:

Users can install any shadcn component via `npx shadcn add <component>`. Common useful ones:
- `npx shadcn add button` → `import { Button } from '@/components/ui/button'`
- `npx shadcn add badge` → `import { Badge } from '@/components/ui/badge'`
- `npx shadcn add card` → `import { Card, CardHeader, CardContent } from '@/components/ui/card'`
- `npx shadcn add separator` → `import { Separator } from '@/components/ui/separator'`

---

## S2. CSS Module Rules (shadcn)

### Required root class properties

```css
.myNewSlide {
  background: color-mix(in oklch, var(--background) 85%, transparent);
  padding: 0 0 44px 0;
}
```

- `background: color-mix(in oklch, var(--background) 85%, transparent)` — semi-transparent so the Aurora background animation shows through. Use 85% for most slides. Use `var(--background)` (fully opaque) only for cover or thank-you slides that need a solid backdrop.
- `padding: 0 0 44px 0` — reserves space for the 44px BottomBar (same as default)

The engine's `.slide` class provides the same flex layout as default — vertical centering, no scrolling.

### Body wrapper (same as default)

```css
.body {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
```

> **Do NOT add `flex: 1` or `flex-grow: 1`** — same rule as default.

### Available CSS custom properties (shadcn theme)

These are the **semantic tokens** from shadcn/ui. Always use these — never hardcode colors:

| Token | Purpose |
|---|---|
| `var(--background)` | Page/slide background |
| `var(--foreground)` | Primary text color |
| `var(--card)` | Card/surface background |
| `var(--card-foreground)` | Text on cards |
| `var(--primary)` | Bold emphasis, buttons |
| `var(--primary-foreground)` | Text on primary |
| `var(--secondary)` | Subtle surface (muted background areas) |
| `var(--secondary-foreground)` | Text on secondary |
| `var(--muted)` | Very subtle background (almost invisible fill) |
| `var(--muted-foreground)` | Dimmed text — subtitles, captions, labels |
| `var(--border)` | Borders and dividers |
| `var(--ring)` | Focus rings |
| `var(--radius)` | Default border-radius (`0.625rem`) |
| `var(--destructive)` | Error / danger accent |
| `var(--surface-overlay)` | Semi-transparent overlay |
| `var(--shadow-elevated)` | Elevated card shadow |

Decorative palette (for occasional color accents — use sparingly):

```
var(--blue-glow)     var(--purple)     var(--purple-deep)
var(--pink)          var(--cyan)       var(--green)
```

### Global classes available in shadcn projects

| Class | Purpose |
|---|---|
| `content-frame` | Width constraint to `1280px`, centered |
| `content-gutter` | `72px` left/right padding |

> **Do NOT use** `accent-bar`, `orb`, or `grid-dots` in shadcn projects — they are dark-theme visual elements.

---

## S3. Typography Conventions (shadcn)

Same sizes as default, but use shadcn tokens for colors:

| Element | Size | Weight | Color |
|---|---|---|---|
| `h1` | `clamp(44px, 5vw, 72px)` | 800 | `var(--foreground)` |
| `h2` | `clamp(28px, 3.2vw, 36px)` | 700 | `var(--foreground)` |
| `h3` | `16px–20px` | 600 | `var(--foreground)` |
| Subtitle | `clamp(16px, 1.6vw, 19px)` | 400 | `var(--muted-foreground)` |
| Body text | `13px–14px` | 400 | `var(--muted-foreground)` |
| Overline/label | `12px–13px` | 500 | `var(--muted-foreground)`, uppercase, `letter-spacing: 2–3px` |

### Overline pattern (common in shadcn slides)

```jsx
<div className={styles.overline}>
  <span className={styles.overlineDash} />
  <span className={styles.overlineText}>SECTION LABEL</span>
</div>
```

```css
.overline {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 28px;
}
.overlineDash {
  display: inline-block;
  width: 32px;
  height: 2px;
  background: var(--primary);
  border-radius: 1px;
}
.overlineText {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: var(--muted-foreground);
}
```

---

## S4. Content Layout Patterns (shadcn)

### Card grid

```css
.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
```

### Standard card (shadcn style — NO gradient top-bar)

```css
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  box-shadow: 0 1px 3px color-mix(in srgb, var(--foreground) 4%, transparent);
  transition: border-color var(--transition-base), box-shadow var(--transition-base);
}
.card:hover {
  border-color: var(--ring);
}
```

> **No `::before` gradient bars** — shadcn cards are clean with subtle borders and optional shadows. For interactive cards, consider `SpotlightCard` from ReactBits.

### Two-column layout (common for shadcn)

```css
.layout {
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 64px;
  align-items: center;
}
```

### Section with subtle separator

```css
.section {
  padding: 20px 0;
  border-top: 1px solid var(--border);
}
```

---

## S5. shadcn Anti-Patterns

1. **Using `accent-bar`** — this is a dark-theme element. Do not include in shadcn slides.
2. **Using orbs** — glowing orbs are the dark-theme visual identity. Not for shadcn.
3. **Using `var(--bg-deep)` or `var(--surface)`** — these are dark-theme tokens. Use `var(--background)`, `var(--card)`, `var(--secondary)` instead.
4. **Hardcoded dark gradients** — no `linear-gradient(135deg, #1a1a2e, ...)`. Use tokens.
5. **Opaque backgrounds hiding Aurora** — use `color-mix(in oklch, var(--background) 85%, transparent)` to let the Aurora shine through.
6. **Gradient top-bars on cards** — shadcn cards use clean borders, not gradient `::before` decorations.
7. **Using `var(--text)` or `var(--text-muted)`** — these are dark-theme token names. Use `var(--foreground)` and `var(--muted-foreground)`.

---

# Common to Both Design Systems

## E. Registration in deck.config.js

After creating the slide files, register the slide in `deck.config.js`:

1. **Add an import** at the top: `import MyNewSlide from './src/slides/MyNewSlide.jsx'`
2. **Add the component** to the `slides` array at the desired position.

The generic `App.jsx` renders slides from this array, passing `index` as a prop automatically. **You do NOT need to manage index numbers manually** — they are assigned by array position.

### Example: adding before ThankYou

```js
import MyNewSlide from './src/slides/MyNewSlide.jsx'
// ... other imports

export default {
  // ... metadata
  slides: [
    CoverSlide,
    // ... existing slides
    MyNewSlide,        // ← insert here
    ThankYouSlide,     // stays last
  ],
}
```

---

## F. Content Density Limits

Slides must never overflow the viewport. The engine shows a **red dashed border warning** in dev mode when content exceeds the slide bounds. Follow these limits:

| Layout | Max items | Notes |
|--------|-----------|-------|
| Cards (3-col grid) | 6 (2 rows) | Reduce card padding if tight |
| Cards (2-col grid) | 4 (2 rows) | Preferred for detailed cards |
| Timeline / event list | 3–4 items | Use compact card height for 4 |
| Bullet points | 6–8 | Depends on line length |
| Full-width content blocks | 2–3 | E.g. quote + detail section |

**When content exceeds limits**, split across multiple slides rather than cramming.

---

## G. Anti-Patterns to Avoid (all design systems)

1. **Missing `content-frame content-gutter`** — content will be full-width without standard margins.
2. **Missing `BottomBar`** — every slide needs it as the last child.
3. **String paths for images** — always use `import logo from '../data/...'` (Vite resolves to URL).
4. **Missing `padding: 0 0 44px 0`** on the slide root CSS class — content will overlap the BottomBar.
5. **Inconsistent `BottomBar text`** — check existing slides and match their footer text.
6. **Using `flex: 1` on body wrapper** — defeats vertical centering; the body should size to its content.
7. **Adding `flex-direction: column` on slide root** — already provided by the engine's `.slide` class.
8. **Overloading a slide** — if the dev server shows a red dashed border, the slide has too much content. Split into multiple slides.
9. **Wrong design system patterns** — check `deck.config.js` for `designSystem` before generating. Using orbs in a shadcn project or shadcn tokens in a default project creates visual mismatches.

---

## H. Complete Step-by-Step

1. **Read `deck.config.js`** — check `designSystem` to determine which pattern set to use.
2. **Create** `src/slides/<SlideName>Slide.jsx` following the correct skeleton (section A for default, section S1 for shadcn).
3. **Create** `src/slides/<SlideName>Slide.module.css` with correct root properties (section B for default, section S2 for shadcn).
4. **Register** in `deck.config.js` — add import + add to `slides` array (section E).
5. **Verify** — the dev server hot-reloads automatically. Navigate to the new slide and check layout.

### Quick checklist (default design system)

- [ ] Read `deck.config.js` — confirmed `designSystem` is `'none'` or absent
- [ ] Created `<SlideName>Slide.jsx` with Slide, accent-bar, orbs, content-frame, BottomBar
- [ ] Created `<SlideName>Slide.module.css` with `background: var(--bg-deep)`, `padding: 0 0 44px 0`, body wrapper (no `flex: 1`)
- [ ] Import added to `deck.config.js`
- [ ] Component added to `slides` array at correct position
- [ ] `BottomBar text` matches project convention

### Quick checklist (shadcn design system)

- [ ] Read `deck.config.js` — confirmed `designSystem: 'shadcn'`
- [ ] Created `<SlideName>Slide.jsx` with Slide, content-frame, BottomBar — **NO accent-bar, NO orbs**
- [ ] Created `<SlideName>Slide.module.css` with `background: color-mix(in oklch, var(--background) 85%, transparent)`, `padding: 0 0 44px 0`
- [ ] Used shadcn tokens (`--background`, `--foreground`, `--card`, `--border`, `--muted-foreground`) — **NOT** dark-theme tokens
- [ ] Cards use clean borders — **NO** gradient `::before` bars
- [ ] Import added to `deck.config.js`
- [ ] Component added to `slides` array at correct position
- [ ] `BottomBar text` matches project convention
