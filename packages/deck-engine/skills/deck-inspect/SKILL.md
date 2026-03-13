---
name: deck-inspect
description: Capture a screenshot of the deck app to visually inspect slides. Use this when asked to look at, see, view, inspect, check visually, or preview a slide.
---

# Visual Inspection — Capture a Slide Screenshot

Captures a screenshot of the running deck using VS Code browser tools (Edge "Sharing with Agent").

## Step 0 — Read `deck.config.js` → check `designSystem`

Before deciding what to capture, open `deck.config.js` and read `designSystem`:

- If `designSystem === 'shadcn'` → inspect against **shadcn slide patterns**
- If `designSystem` is missing or any other value → inspect against **default DECKIO slide patterns**

This comes first because the screenshot must be judged against the correct pattern set.

## Deciding what to capture

1. **Slide** — resolve in this order:
   - If the user said "slide 3" or "the cover slide" → map to a 1-based number.
   - If you just created or edited a specific slide → use that slide's array position + 1.
   - If not specified → capture slide 1.

## Prerequisites

The dev server must be running. Check `.github/memory/state.md` for the port. Default is `5173`.

## Workflow

### Step 1 — Open or reuse a browser page

Check the attached browser pages for an existing deck tab. If none exists, open one:

```
open_browser_page → http://localhost:<port>/#/<project-id>
```

Read `project` and `port` from `.github/memory/state.md` if not known.

### Step 2 — Navigate to the target slide

The deck opens on slide 1. To reach slide N, press `ArrowRight` (N − 1) times:

```js
for (let i = 0; i < N - 1; i++) {
  await page.keyboard.press('ArrowRight')
  await page.waitForTimeout(300)
}
```

If the page is already on a different slide, navigate to slide 1 first by pressing `Home`, then advance forward.

### Step 3 — Take a screenshot

Use `screenshot_page` with the page ID to capture the current view. The screenshot is returned inline — no file path needed.

### Step 4 — Inspect and report

Study the screenshot and check for:

- Layout alignment and spacing
- Typography (size, weight, color)
- Missing or broken elements
- Color and contrast issues
- Overflow or clipping

### Step 5 — Check for design-system mismatches

Judge the screenshot using the `designSystem` value you read in Step 0:

**If `designSystem === 'shadcn'`, flag these mismatches:**
- Visible `accent-bar` styling on the left edge
- Visible orb/glow blobs that match the default DECKIO background treatment
- Card headers with gradient top bars
- Heavy neon/deep-space decoration that belongs to the default system
- Content pushed to the viewport edges instead of using the `content-frame content-gutter` layout

> Do **not** fail a shadcn slide just because it is dark. `theme` and `designSystem` are separate. A shadcn slide may be light or dark, but it must not use default DECKIO decorative classes.

**If `designSystem` is not `'shadcn'`, flag these mismatches:**
- Missing accent bar on the left edge
- Missing orb/glow background decoration
- Slides that look like generic shadcn cards dropped into the deck with no DECKIO framing

Report design-system mismatches alongside all other visual issues. When a mismatch exists, explicitly say the slide was built with the wrong pattern set and should be corrected using `deck-add-slide`.
