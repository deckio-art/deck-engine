---
name: deck-validate-project
description: Validate and audit a deck project for correctness. Use this when asked to validate, audit, polish, review, check, or verify slides.
---

# Validate & Audit a Deck Project

## Step 0: Detect Design System

Open `deck.config.js` and read the `designSystem` field:

- **`designSystem: 'shadcn'`** → use the **shadcn validation rules** in each step below.
- **`designSystem: 'none'`** or field missing → use the **default validation rules**.

This determines which slide patterns are correct for this project.

---

## Step 1: Audit deck.config.js

Open `deck.config.js` and verify:

### 1a. All imports resolve

For each slide import at the top of the file, verify the target file exists in `src/slides/`.

### 1b. slides array matches imports

- Every imported slide should appear in the `slides` array.
- No unused imports (imported but not in the array).
- No undefined entries in the array (in array but not imported).

---

## Step 2: Verify slide structure

For each slide `.jsx` file in `src/slides/`, verify:

### Common checks (all design systems):

- [ ] Imports `{ Slide }` and `{ BottomBar }` from `'@deckio/deck-engine'`
- [ ] Wrapped in `<Slide index={index} className={styles.xxx}>` (accepts `index` as prop)
- [ ] Content is inside `<div className="content-frame content-gutter">`
- [ ] `<BottomBar />` is the **last child** inside `<Slide>`
- [ ] `BottomBar text` is consistent across all slides in the project

### Default design system — additional checks:

- [ ] Contains `<div className="accent-bar" />` as first child
- [ ] Contains at least one decorative orb (`<div className="orb ...">`)

### shadcn design system — additional checks:

- [ ] Does **NOT** contain `<div className="accent-bar" />` (dark-theme element)
- [ ] Does **NOT** contain orb elements (`className="orb"` or `className={\`orb ...`)
- [ ] Does **NOT** reference dark-theme tokens (`var(--bg-deep)`, `var(--surface)`, `var(--text)`, `var(--text-muted)`)
- [ ] Uses shadcn imports from `'@/components/ui/'` where appropriate (BlurText, ShinyText, SpotlightCard, etc.)

### CSS validation — default design system:

For each `.module.css` file, verify the root class has:
- [ ] `background: var(--bg-deep)` or `background: var(--background)`
- [ ] `padding: 0 0 44px 0`
- [ ] Does NOT use `flex: 1` on the body wrapper
- [ ] Does NOT redundantly set `flex-direction: column`

### CSS validation — shadcn design system:

For each `.module.css` file, verify the root class has:
- [ ] `background: color-mix(in oklch, var(--background) 85%, transparent)` or `background: var(--background)` — **NOT** `var(--bg-deep)`
- [ ] `padding: 0 0 44px 0`
- [ ] Does NOT use `flex: 1` on the body wrapper
- [ ] Does NOT use dark-theme tokens: `--bg-deep`, `--surface`, `--text`, `--text-muted`
- [ ] Does NOT include orb positioning classes (`.orb1`, `.orb2`, etc.)
- [ ] Cards use `var(--card)` and `var(--border)` — NOT `var(--surface)` with gradient `::before` bars

---

## Step 3: Check companion files

- Every `.jsx` slide in `src/slides/` should have a matching `.module.css` file
- No orphaned `.module.css` files without a matching `.jsx`

---

## Step 4: Verify metadata

Check `deck.config.js` exports these fields:
- [ ] `id` — string, matches the project folder name convention
- [ ] `title` — display name
- [ ] `subtitle` — tagline
- [ ] `icon` — emoji
- [ ] `accent` — CSS color value
- [ ] `slides` — non-empty array

### Additional shadcn metadata:
- [ ] `theme: 'shadcn'` — theme field present
- [ ] `designSystem: 'shadcn'` — design system field present

---

## Step 5: Design system consistency check

### For shadcn projects, flag these as **theme mismatches**:

| Finding | Severity | Fix |
|---------|----------|-----|
| Slide uses `accent-bar` class | 🔴 Error | Remove the `<div className="accent-bar" />` |
| Slide uses `orb` class | 🔴 Error | Remove all orb `<div>` elements |
| CSS uses `var(--bg-deep)` | 🔴 Error | Replace with `color-mix(in oklch, var(--background) 85%, transparent)` |
| CSS uses `var(--surface)` | 🟡 Warning | Replace with `var(--card)` or `var(--secondary)` |
| CSS uses `var(--text)` | 🟡 Warning | Replace with `var(--foreground)` |
| CSS uses `var(--text-muted)` | 🟡 Warning | Replace with `var(--muted-foreground)` |
| Card has gradient `::before` bar | 🟡 Warning | Remove — shadcn cards use clean borders |
| Opaque `var(--background)` on content slide | 🟡 Info | Consider semi-transparent for Aurora visibility |

### For default projects, flag these as **theme mismatches**:

| Finding | Severity | Fix |
|---------|----------|-----|
| Slide missing `accent-bar` | 🔴 Error | Add `<div className="accent-bar" />` as first child |
| Slide missing orbs | 🟡 Warning | Add 2–4 orb decorative elements |
| CSS uses `var(--background)` instead of `var(--bg-deep)` | 🟡 Info | Both work, but `--bg-deep` is the convention |

---

## Step 6: Report results

Summarize findings:

- Design system detected: **default** or **shadcn**
- Number of slides validated
- Theme mismatches found (if any)
- Any issues found and fixed (missing files, broken imports, structural issues)
- Overall project health: **pass** or **issues found**

---

## Quick checklist

- [ ] Read `designSystem` from `deck.config.js` — determined validation rules
- [ ] All imports in `deck.config.js` resolve to existing files
- [ ] `slides` array matches imports (no unused, no missing)
- [ ] Every `.jsx` slide has a companion `.module.css`
- [ ] All slides have content-frame, BottomBar
- [ ] Slides match the project's design system (no theme mismatches)
- [ ] BottomBar text is consistent across the project
- [ ] CSS root classes have required properties and no `flex: 1` on body wrapper
- [ ] Project metadata (id, title, subtitle, icon, accent) is present
