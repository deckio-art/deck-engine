---
name: deck-validate-project
description: Validate and audit a deck project for correctness. Use this when asked to validate, audit, polish, review, check, or verify slides.
---

# Validate & Audit a Deck Project

## Step 0 — Read `deck.config.js` → check `designSystem`

Open `deck.config.js` and read the `designSystem` field:

- **`designSystem: 'shadcn'`** → use the **shadcn validation rules** below.
- **Any other value or field missing** → use the **default validation rules** below.

This determines which slide patterns are correct for this project.

---

## Step 1: Audit `deck.config.js`

Open `deck.config.js` and verify:

### 1a. All imports resolve

For each slide import at the top of the file, verify the target file exists in `src/slides/`.

### 1b. `slides` array matches imports

- Every imported slide appears in the `slides` array.
- No unused imports.
- No undefined entries in the array.

---

## Step 2: Verify slide structure

For each slide `.jsx` file in `src/slides/`, verify:

### Common checks (all design systems)

- [ ] Imports `{ Slide, BottomBar }` from `'@deckio/deck-engine'`
- [ ] Wrapped in `<Slide index={index} className={styles.xxx}>`
- [ ] Content is inside a wrapper that includes `content-frame content-gutter`
- [ ] `<BottomBar />` is the last child inside `<Slide>`
- [ ] `BottomBar text` is consistent across slides

### Default design system — additional checks

- [ ] Contains `<div className="accent-bar" />` as the first child
- [ ] Contains at least one decorative orb (`<div className="orb ...">`)
- [ ] Does **NOT** import from `'@/components/ui/'`

### shadcn design system — additional checks

- [ ] **NEVER** contains `<div className="accent-bar" />`
- [ ] **NEVER** contains orb elements (`className="orb"` or `className={\`orb ...`)
- [ ] **NEVER** references `var(--bg-deep)`, `var(--surface)`, `var(--text)`, or `var(--text-muted)`
- [ ] If the slide imports UI components beyond deck-engine primitives, those imports come from `'@/components/ui/'`

### CSS validation — default design system

For each `.module.css` file, verify the root class has:

- [ ] `background: var(--background)` or `background: var(--slide-bg)`
- [ ] `padding: 0 0 44px 0`
- [ ] No `flex: 1` on the body wrapper
- [ ] No redundant `flex-direction: column` on the slide root
- [ ] Uses current semantic tokens such as `--background`, `--secondary`, `--foreground`, `--muted-foreground`

### CSS validation — shadcn design system

For each `.module.css` file, verify the root class has:

- [ ] `background: color-mix(in oklch, var(--background) 85%, transparent)` or `background: var(--background)` — **NEVER** `var(--bg-deep)`
- [ ] `padding: 0 0 44px 0`
- [ ] No `flex: 1` on the body wrapper
- [ ] No `--bg-deep`, `--surface`, `--text`, or `--text-muted`
- [ ] No orb positioning classes (`.orb1`, `.orb2`, etc.)
- [ ] Cards use `var(--card)` and `var(--border)` — **NEVER** gradient `::before` bars

---

## Step 3: Check companion files

- Every `.jsx` slide in `src/slides/` should have a matching `.module.css` file.
- No orphaned `.module.css` files without a matching `.jsx`.

---

## Step 4: Verify metadata

Check `deck.config.js` exports these fields:

- [ ] `id` — string
- [ ] `title` — display name
- [ ] `subtitle` — tagline
- [ ] `icon` — emoji
- [ ] `accent` — CSS color value
- [ ] `slides` — non-empty array

### Additional shadcn metadata

- [ ] `designSystem: 'shadcn'` is present
- [ ] `theme` field is present and left unchanged unless the task explicitly changes theme

> `theme` and `designSystem` are separate axes. Do **not** require `theme: 'shadcn'` just because `designSystem` is `'shadcn'`.

---

## Step 5: Design-system consistency check

### For shadcn projects, flag these as **design-system mismatches**

| Finding | Severity | Fix |
|---------|----------|-----|
| Slide uses `accent-bar` class | 🔴 Error | Remove the `<div className="accent-bar" />` |
| Slide uses `orb` class | 🔴 Error | Remove all orb `<div>` elements |
| CSS uses `var(--bg-deep)` | 🔴 Error | Replace with `color-mix(in oklch, var(--background) 85%, transparent)` or `var(--background)` |
| CSS uses `var(--surface)` | 🔴 Error | Replace with `var(--card)` or `var(--secondary)` |
| CSS uses `var(--text)` | 🔴 Error | Replace with `var(--foreground)` |
| CSS uses `var(--text-muted)` | 🔴 Error | Replace with `var(--muted-foreground)` |
| Card has gradient `::before` bar | 🔴 Error | Remove it — shadcn cards use clean borders |
| Heavy deep-space glow/orb decoration visible | 🔴 Error | Remove the default DECKIO decoration and use shadcn structure |

### For default projects, flag these as **design-system mismatches**

| Finding | Severity | Fix |
|---------|----------|-----|
| Slide missing `accent-bar` | 🔴 Error | Add `<div className="accent-bar" />` as first child |
| Slide missing orbs | 🟡 Warning | Add 2–4 orb decorative elements |
| Slide imports from `'@/components/ui/'` | 🔴 Error | Default projects do not use shadcn-only imports |
| Card uses clean shadcn card styling with no DECKIO decoration | 🟡 Warning | Restore the default visual language if the deck uses it elsewhere |

---

## Step 6: Report results

Summarize findings:

- Design system detected: **default** or **shadcn**
- Number of slides validated
- Design-system mismatches found (if any)
- Any issues found and fixed
- Overall project health: **pass** or **issues found**

---

## Quick checklist

- [ ] Read `designSystem` from `deck.config.js`
- [ ] All imports in `deck.config.js` resolve to existing files
- [ ] `slides` array matches imports
- [ ] Every `.jsx` slide has a companion `.module.css`
- [ ] All slides have `content-frame content-gutter` and `BottomBar`
- [ ] Slides match the project's design system
- [ ] `BottomBar` text is consistent across the project
- [ ] CSS root classes have required properties and no `flex: 1` on the body wrapper
- [ ] Project metadata is present
