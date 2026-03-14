# Theme Descriptor — Funky Punk

## Metadata

- **Theme id:** `funky-punk`
- **Primary slide authoring pattern:** `default`
- **Compatible design systems:** `default`
- **Mood:** loud, neon, rebellious, anti-corporate, punk-zine, high-energy
- **Read this file when:** `deck.config.js` uses `theme: 'funky-punk'` and you need to create, inspect, validate, or generate assets for slides

## Slide personality

Funky-punk slides scream rebellion. Jet-black canvas, hot-pink borders, electric-lime accents, offset neon text-shadows, and razor-sharp edges. Nothing is subtle — every element shouts. Think punk zine meets neon sign shop: clashing colors on purpose, uppercase everything, zero rounded corners. The built-in scanline overlay and heading text-shadows fire automatically; don't fight them, lean into the chaos.

Headings are **Bebas Neue**, always uppercase with wide letter-spacing. Body/mono text is **Space Mono**. Bullet lists use ✘ markers (styled by the theme). Horizontal rules are rainbow neon gradients. Links have wavy underlines in electric lime.

## Exact JSX skeleton

Use this exact starting structure for new slides:

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

1. `<div className="accent-bar" />` — renders as hot pink via `var(--primary)`
2. `2–4` decorative orb elements using the global `orb` class plus local positioning classes — use the neon palette for maximum clash
3. One content wrapper using `content-frame content-gutter`
4. `<BottomBar text="..." />` as the last child

## Exact CSS skeleton

```css
.myNewSlide {
  background: var(--background);
  padding: 0 0 44px 0;
}

.orb1 {
  width: 500px;
  height: 500px;
  top: -120px;
  right: -80px;
  background: radial-gradient(
    circle at 40% 40%,
    var(--pink),
    color-mix(in srgb, var(--pink) 30%, transparent) 50%,
    transparent 70%
  );
}

.orb2 {
  width: 380px;
  height: 380px;
  bottom: -60px;
  left: -40px;
  background: radial-gradient(
    circle at 50% 50%,
    var(--cyan),
    color-mix(in srgb, var(--purple) 25%, transparent) 55%,
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
  background: var(--card);
  border: 2px solid var(--border);
  border-radius: var(--radius-md);
  padding: 24px;
  box-shadow: var(--shadow-elevated);
}

.card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, var(--pink), var(--accent), var(--cyan), var(--purple));
}
```

### Key CSS rules for funky-punk

- **Sharp edges everywhere.** `border-radius` must be `0px`–`4px` max. Use `var(--radius-md)` (2px) or `var(--radius-sm)` (0px). Never round off corners.
- **Borders are neon.** Use `var(--border)` which resolves to hot pink. Make borders `2px solid` not `1px solid`.
- **Shadows glow pink/lime.** Use `var(--shadow-elevated)` for neon glow or hand-craft with `var(--glow-primary)` / `var(--glow-ring)`.
- **Card top-stripe is rainbow.** The `::before` gradient should use multiple neon stops: `var(--pink)`, `var(--accent)`, `var(--cyan)`, `var(--purple)`.
- **Transitions are snappy.** Use `var(--transition-fast)` (0.08s) or `var(--transition-base)` (0.15s). Nothing slow or floaty.

## Token table

### Use these tokens

| Token | Value | When to use |
|---|---|---|
| `var(--background)` | `#0a0a0a` | Slide backgrounds, deep surfaces |
| `var(--foreground)` | `#f0f0f0` | Primary text, headings |
| `var(--card)` | `#1a1a1a` | Card / panel backgrounds |
| `var(--card-foreground)` | `#f0f0f0` | Text inside cards |
| `var(--primary)` | `#ff2d6f` | Hot pink — hero elements, accent bar, key actions |
| `var(--primary-foreground)` | `#000000` | Text on primary-colored surfaces |
| `var(--secondary)` | `#1c1c2e` | Secondary card/panel backgrounds |
| `var(--secondary-foreground)` | `#e0ff00` | Text on secondary surfaces (electric lime) |
| `var(--accent)` | `#e0ff00` | Electric lime — highlights, emphasis, links |
| `var(--accent-foreground)` | `#000000` | Text on accent surfaces |
| `var(--muted)` | `#2a2a2a` | Muted backgrounds, input fields |
| `var(--muted-foreground)` | `#888888` | Subdued text, timestamps, footnotes |
| `var(--border)` | `#ff2d6f` | Hot pink borders — all borders scream |
| `var(--ring)` | `rgba(224, 255, 0, 0.6)` | Focus rings, interactive outlines |
| `var(--radius)` | `2px` | Base radius — sharp, not smooth |
| `var(--destructive)` | `#ff0040` | Error / danger states |
| `var(--blue-glow)` | `#00e5ff` | Cyan decorative glow |
| `var(--purple)` | `#bf00ff` | Purple decorative accent |
| `var(--purple-deep)` | `#7b00cc` | Deeper purple for orbs, gradients |
| `var(--pink)` | `#ff2d6f` | Hot pink decorative (alias of primary) |
| `var(--cyan)` | `#00e5ff` | Cyan decorative (alias of blue-glow) |
| `var(--green)` | `#e0ff00` | Electric lime decorative (alias of accent) |
| `var(--surface-overlay)` | `rgba(10, 10, 10, 0.85)` | Translucent dark overlay panels |
| `var(--surface-overlay-heavy)` | `rgba(10, 10, 10, 0.95)` | Near-opaque overlay for modals |
| `var(--border-subtle)` | `rgba(255, 45, 111, 0.35)` | Softer pink border for secondary elements |
| `var(--glow-primary)` | `rgba(255, 45, 111, 0.3)` | Pink glow for box-shadow / drop-shadow |
| `var(--glow-primary-strong)` | `rgba(255, 45, 111, 0.45)` | Stronger pink glow for hover states |
| `var(--glow-ring)` | `rgba(224, 255, 0, 0.3)` | Lime glow for emphasis borders |
| `var(--glow-accent)` | `rgba(224, 255, 0, 0.15)` | Subtle lime glow, background washes |
| `var(--glow-purple)` | `rgba(191, 0, 255, 0.2)` | Purple glow for decorative depth |
| `var(--glow-cyan)` | `rgba(0, 229, 255, 0.15)` | Cyan glow for cool-tone accents |
| `var(--dot-color)` | `rgba(255, 45, 111, 0.2)` | Dot-grid pattern fill |
| `var(--shadow-elevated)` | multi-stop pink + lime glow | Elevated card shadows |

### Never regress to

- `var(--bg-deep)` — removed legacy token
- `var(--surface)` — removed legacy token
- `var(--text)` or `var(--text-muted)` — removed legacy tokens
- Hardcoded `rgba(...)` or `#hex` values when a token exists — always use the token

## Typography tokens

| Token | Value | Usage |
|---|---|---|
| `var(--font-family)` | `'Bebas Neue', 'Impact', 'Arial Black', sans-serif` | Headings, display text |
| `var(--font-family-mono)` | `'Space Mono', 'Courier New', monospace` | Code, technical labels |
| `var(--font-size-display)` | `clamp(48px, 8vw, 80px)` | Hero / title text |
| `var(--font-size-2xl)` | `40px` | Section headings |
| `var(--font-size-xl)` | `28px` | Sub-headings |
| `var(--font-size-lg)` | `22px` | Large body / lead text |
| `var(--font-size-base)` | `17px` | Body copy |
| `var(--font-weight-extrabold)` | `900` | Headings, bold emphasis |
| `var(--font-weight-bold)` | `700` | Strong text |
| `var(--letter-spacing-wide)` | `3px` | Default heading spacing |
| `var(--letter-spacing-wider)` | `5px` | Screaming subheadings |
| `var(--letter-spacing-widest)` | `8px` | Labels, eyebrow text |
| `var(--line-height-tight)` | `1.1` | Headings |
| `var(--line-height-normal)` | `1.4` | Body text |

## Decorative elements available

| Element | How to use it |
|---|---|
| `accent-bar` | Required first child — renders in hot pink via `var(--primary)` |
| `orb` | Required ambient decoration; 2–4 per slide using neon palette clashes (pink + cyan, lime + purple) |
| Scanlines | **Automatic** — the theme injects a fixed scanline overlay via `:root::after`. No JSX needed. |
| Rainbow `<hr>` | Use `<hr />` in JSX — theme styles it as a 4-stop neon gradient (pink → lime → cyan → purple) |
| `✘` bullet markers | Use `<ul><li>` — theme replaces default bullets with hot-pink ✘ |
| Heading text-shadows | **Automatic** — `h1` gets offset lime + cyan shadows; `h2` gets pink shadow. No extra CSS needed. |
| Wavy links | **Automatic** — `<a>` tags get lime wavy underlines with cyan hover. No extra CSS needed. |
| `grid-dots` | Optional — subtle dot-grid pattern using `var(--dot-color)` |
| Card top rainbow stripe | Apply via `.card::before` — 4-stop gradient matching `<hr>` |
| Neon box-shadow | Use `var(--shadow-elevated)` for pink + lime dual-glow lift |

## Available components

| Resource | Import path |
|---|---|
| `Slide`, `BottomBar`, `Navigation`, `SlideProvider`, `useSlides`, `GenericThankYouSlide` | `'@deckio/deck-engine'` |
| Data / logos | `'../data/<file>'` |

## Anti-patterns

1. **Rounded corners** — `border-radius` above `4px` violates the sharp-edge punk identity. Never use `--radius-lg: 16px` patterns from other themes.
2. **Missing `accent-bar`** — every slide must have it as the first child.
3. **Missing orb decoration** — use 2–4 orbs with clashing neon colors.
4. **Missing `content-frame content-gutter`** — body wrapper must use these globals.
5. **Missing `BottomBar`** — required as the last child.
6. **Clean / editorial / corporate style** — never use shadcn's minimal editorial aesthetic, calm whitespace, or restrained color palettes. This theme is the opposite of tasteful restraint.
7. **Subtle borders** — borders should be visible and neon (`2px solid var(--border)`), not hairline or muted.
8. **Slow transitions** — everything snaps. Never use transitions above `0.3s`. Prefer `var(--transition-fast)` (0.08s).
9. **Lowercase headings** — the theme forces `text-transform: uppercase` on headings. Don't fight it with `text-transform: none`.
10. **Serif or neutral fonts** — the theme uses Bebas Neue + Space Mono. Don't import or specify other font families.
11. **Single-color schemes** — punk thrives on clash. Always use at least 2–3 neon colors from the decorative palette per slide.
12. **Importing shadcn UI components** — this is a `default` design-system theme; shadcn components are incompatible.

## Example slide direction

A strong funky-punk slide slams a massive uppercase Bebas Neue heading (with automatic neon text-shadow) over a jet-black canvas peppered with clashing pink and cyan orbs. Content cards sit in sharp-edged boxes with hot-pink borders and rainbow top-stripes. The scanline overlay adds CRT texture. Everything feels like a screen-printed concert poster: loud, layered, unapologetic. Readable from across the room because contrast is maxed out and type is enormous.
