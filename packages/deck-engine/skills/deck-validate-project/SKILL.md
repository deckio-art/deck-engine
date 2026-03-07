---
name: deck-validate-project
description: Validate and audit a deck project for correctness. Use this when asked to validate, audit, polish, review, check, or verify slides.
---

# Validate & Audit a Deck Project

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

- [ ] Imports `{ Slide }` and `{ BottomBar }` from `'@deckio/deck-engine'`
- [ ] Wrapped in `<Slide index={index} className={styles.xxx}>` (accepts `index` as prop)
- [ ] Contains `<div className="accent-bar" />` as first child
- [ ] Contains at least one decorative orb
- [ ] Content is inside `<div className="content-frame content-gutter">`
- [ ] `<BottomBar />` is the **last child** inside `<Slide>`
- [ ] `BottomBar text` is consistent across all slides in the project

For each `.module.css` file, verify the root class has:
- [ ] `background: var(--bg-deep)`
- [ ] `flex-direction: column`
- [ ] `padding: 0 0 44px 0`

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

---

## Step 5: Report results

Summarize findings:

- Number of slides validated
- Any issues found and fixed (missing files, broken imports, structural issues)
- Overall project health: **pass** or **issues found**

---

## Quick checklist

- [ ] All imports in `deck.config.js` resolve to existing files
- [ ] `slides` array matches imports (no unused, no missing)
- [ ] Every `.jsx` slide has a companion `.module.css`
- [ ] All slides have accent-bar, content-frame, BottomBar
- [ ] BottomBar text is consistent across the project
- [ ] CSS root classes have required properties
- [ ] Project metadata (id, title, subtitle, icon, accent) is present
