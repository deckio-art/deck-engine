---
description: "Use when creating or editing slide CSS modules in a deck project. Enforces required properties, layout rules, and theme-appropriate variables."
applyTo: "**/slides/**/*.module.css"
---

# Slide CSS Module Conventions

## Theme Detection

**Before writing any slide CSS**, read `deck.config.js` and check `designSystem`:
- `designSystem: 'shadcn'` → follow the **shadcn CSS rules** below
- `designSystem: 'none'` or absent → follow the **default CSS rules** below

---

## Default Design System — Required root class

```css
.mySlide {
  background: var(--bg-deep);
  padding: 0 0 44px 0;        /* reserve BottomBar height */
}
```

## shadcn Design System — Required root class

```css
.mySlide {
  background: color-mix(in oklch, var(--background) 85%, transparent);
  padding: 0 0 44px 0;        /* reserve BottomBar height */
}
```

Use `85%` opacity for most slides (lets Aurora show through). Use `var(--background)` (fully opaque) for cover/thank-you slides.

---

## Engine `.slide` class (both design systems)

The engine's `.slide` class already sets `flex-direction: column`, `justify-content: center`, and `overflow: hidden`. The engine also sets `flex-grow: 0` on all direct slide children, so **content stays at its natural height and is vertically centered by default** — building from the center outward. No scrolling is allowed.

For dense slides that need top-alignment, override with `justify-content: flex-start`.

## Body wrapper (both design systems)

```css
.body {
  position: relative;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
```

> **Do NOT add `flex: 1` or `flex-grow: 1`** to the body wrapper or any direct slide child — it stretches the wrapper to fill the slide and defeats the engine's built-in vertical centering.

---

## Default Design System — Orb positioning recipe

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

> **Do NOT include orb classes in shadcn projects** — orbs are a dark-theme visual element.

---

## Theme variables — Default design system

| Variable | Value |
|----------|-------|
| `--bg-deep` | `#080b10` |
| `--surface` | `#161b22` |
| `--border` | `#30363d` |
| `--text` | `#e6edf3` |
| `--text-muted` | `#8b949e` |
| `--accent` | project-specific |
| `--blue-glow` | `#1f6feb` |
| `--purple` | `#bc8cff` |
| `--purple-deep` | `#6e40c9` |
| `--pink` | `#f778ba` |
| `--cyan` | `#56d4dd` |
| `--green` | `#3fb950` |
| `--orange` | `#d29922` |

## Theme variables — shadcn design system

| Variable | Purpose |
|----------|---------|
| `--background` | Page/slide background |
| `--foreground` | Primary text color |
| `--card` | Card/surface background |
| `--card-foreground` | Text on cards |
| `--primary` | Bold emphasis, buttons |
| `--secondary` | Subtle surface background |
| `--muted` | Very subtle fill |
| `--muted-foreground` | Dimmed text (subtitles, labels) |
| `--border` | Borders and dividers |
| `--ring` | Focus rings |
| `--radius` | Default border-radius (`0.625rem`) |
| `--surface-overlay` | Semi-transparent overlay |

> **Do NOT use** `--bg-deep`, `--surface`, `--text`, or `--text-muted` in shadcn projects. Use the shadcn equivalents above.

---

## Global classes (no import needed)

| Class | Available in | Purpose |
|-------|-------------|---------|
| `content-frame` | All | Width constraint to `1280px`, centered |
| `content-gutter` | All | `72px` left/right padding |
| `accent-bar` | Default only | Left gradient accent bar |
| `orb` | Default only | Base decorative orb |
| `grid-dots` | Default only | Dot grid pattern |

---

## Card pattern — Default

```css
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 16px;
  padding: 24px;
}
```

## Card pattern — shadcn

```css
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  box-shadow: 0 1px 3px color-mix(in srgb, var(--foreground) 4%, transparent);
}
```

> **No `::before` gradient bars on shadcn cards** — use clean borders and subtle shadows.

---

## Typography (both design systems)

| Element | Size | Weight | Spacing |
|---------|------|--------|---------|
| h1 | `clamp(42px, 5vw, 72px)` | 900 (default) / 800 (shadcn) | `-2px` |
| h2 | `clamp(28px, 3.2vw, 36px)` | 700 | `-0.8px` |
| h3 | `16px–20px` | 700 (default) / 600 (shadcn) | `-0.3px` |
| Subtitle | `17px` | 300–400 | — |
| Body | `13px–14px` | 400 | — |
| Badge | `10px–11px` | 600–700 | `1.5px` |

Text colors: use `var(--text)` / `var(--text-muted)` for default, `var(--foreground)` / `var(--muted-foreground)` for shadcn.

---

## Content density limits

Slides must never overflow the viewport. The engine shows a **red dashed border warning** in dev mode when content exceeds the slide bounds. When content doesn't fit, split across multiple slides rather than cramming. A presentation with more slides is better than one with clipped content.
