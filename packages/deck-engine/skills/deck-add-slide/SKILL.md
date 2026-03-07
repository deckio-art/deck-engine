---
name: deck-add-slide
description: Guide for adding a new slide to a deck project. Use this when asked to create, add, or build a new slide component.
---

# Adding a Slide to a Deck Project

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

## B. CSS Module Rules

Create a companion `.module.css` file matching the JSX filename (e.g., `MyNewSlide.module.css`).

### Required root class properties

```css
.myNewSlide {
  background: var(--bg-deep);
  flex-direction: column;
  padding: 0 0 44px 0;
}
```

- `background: var(--bg-deep)` — dark background on every slide
- `flex-direction: column` — global `.slide` sets `display: flex`; this orients content vertically
- `padding: 0 0 44px 0` — reserves space for the 44px BottomBar

Optional: add `justify-content: center` to vertically center content (cover slides, thank-you slides).

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

### Vertical centering body wrapper

```css
.body {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex: 1;
  min-height: 0;
}
```

### Available CSS custom properties

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

## D. Content Layout Patterns

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

## F. Anti-Patterns to Avoid

1. **Missing `accent-bar`** — include on every slide.
2. **Missing `content-frame content-gutter`** — content will be full-width without standard margins.
3. **Missing `BottomBar`** — every slide needs it as the last child.
4. **String paths for images** — always use `import logo from '../data/...'` (Vite resolves to URL).
5. **Missing `padding: 0 0 44px 0`** on the slide root CSS class — content will overlap the BottomBar.
6. **Inconsistent `BottomBar text`** — check existing slides and match their footer text.

---

## G. Complete Step-by-Step

1. **Create** `src/slides/<SlideName>Slide.jsx` following the mandatory skeleton (section A).
2. **Create** `src/slides/<SlideName>Slide.module.css` with required root properties (section B).
3. **Register** in `deck.config.js` — add import + add to `slides` array (section E).
4. **Verify** — the dev server hot-reloads automatically. Navigate to the new slide and check layout.

### Quick checklist

- [ ] Created `<SlideName>Slide.jsx` with Slide, accent-bar, orbs, content-frame, BottomBar
- [ ] Created `<SlideName>Slide.module.css` with `background: var(--bg-deep)`, `flex-direction: column`, `padding: 0 0 44px 0`, body centering wrapper
- [ ] Import added to `deck.config.js`
- [ ] Component added to `slides` array at correct position
- [ ] `BottomBar text` matches project convention
