---
description: "Use when creating or editing slide CSS modules in a deck project. Enforces required properties, layout rules, and theme-appropriate variables."
applyTo: "**/slides/**/*.module.css"
---

# Slide CSS Module Conventions

## Step 0 — Read `deck.config.js` → check `designSystem`

Before writing any slide CSS:

- If `designSystem === 'shadcn'` → follow the **shadcn CSS rules**
- If `designSystem` is missing or any value other than `'shadcn'` → follow the **default CSS rules**

---

## Default design system (`designSystem` is NOT `'shadcn'`)

```css
.mySlide {
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

Use these token names in default slides:

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

## shadcn design system (`designSystem === 'shadcn'`)

```css
.mySlide {
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

.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
  box-shadow: 0 1px 3px color-mix(in srgb, var(--foreground) 4%, transparent);
}
```

Use `85%` opacity for most slides so Aurora can show through. Use `var(--background)` only when the slide intentionally needs a solid backdrop.

---

## Engine `.slide` class (both design systems)

The engine's `.slide` class already sets `flex-direction: column`, `justify-content: center`, and `overflow: hidden`. The engine also sets `flex-grow: 0` on all direct slide children, so content stays at its natural height and is vertically centered by default. No scrolling is allowed.

For dense slides that need top-alignment, override with `justify-content: flex-start`.

> **Do NOT add `flex: 1` or `flex-grow: 1`** to the body wrapper or any direct slide child.

---

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
| `--muted-foreground` | Dimmed text |
| `--border` | Borders and dividers |
| `--ring` | Focus rings |
| `--radius` | Default border-radius |
| `--surface-overlay` | Semi-transparent overlay |

Hard rules for shadcn slide CSS:

- **NEVER use `.orb1`, `.orb2`, or other orb positioning classes in a shadcn project**
- **NEVER use `accent-bar` class in a shadcn project**
- **NEVER use `--bg-deep`**
- **NEVER use `--surface`**
- **NEVER use `--text`**
- **NEVER use `--text-muted`**
- **NEVER add card `::before` gradient bars**

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

## Typography

| Element | Size | Weight | Spacing |
|---------|------|--------|---------|
| h1 | `clamp(42px, 5vw, 72px)` | 900 (default) / 800 (shadcn) | `-2px` |
| h2 | `clamp(28px, 3.2vw, 36px)` | 700 | `-0.8px` |
| h3 | `16px–20px` | 700 (default) / 600 (shadcn) | `-0.3px` |
| Subtitle | `17px` | 300–400 | — |
| Body | `13px–14px` | 400 | — |
| Badge | `10px–11px` | 600–700 | `1.5px` |

Text colors: use `var(--foreground)` and `var(--muted-foreground)` unless the design intentionally uses an accent color.

---

## Content density limits

Slides must never overflow the viewport. The engine shows a red dashed border warning in dev mode when content exceeds the slide bounds. When content doesn't fit, split across multiple slides rather than cramming.
