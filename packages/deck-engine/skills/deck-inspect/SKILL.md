---
name: deck-inspect
description: Capture a screenshot of the deck app to visually inspect slides. Use this when asked to look at, see, view, inspect, check visually, or preview a slide.
---

# Visual Inspection — Capture a Slide Screenshot

Captures a screenshot of the running deck using VS Code browser tools (Edge "Sharing with Agent").

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
// run_playwright_code on the page
for (let i = 0; i < N - 1; i++) {
  await page.keyboard.press('ArrowRight');
  await page.waitForTimeout(300);
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

### Step 5 — Check for theme mismatches

Read `deck.config.js` and note the `designSystem` field. Then check the screenshot for design system inconsistencies:

**If `designSystem: 'shadcn'`**, flag these visual issues:
- Visible glowing orbs in the background (dark-theme decoration)
- Left-side gradient accent bar (dark-theme element)
- Dark backgrounds (`#080b10` or similar deep-space color) instead of light/neutral
- Neon gradient text effects that clash with the editorial aesthetic
- Cards with gradient top-bar decorations

**If `designSystem: 'none'` or absent**, flag these visual issues:
- Missing accent bar on the left edge
- No ambient orb glow in the background
- Overly light/white backgrounds that don't match the dark theme

Report any theme mismatches alongside other visual issues. Theme mismatches indicate the slide was built with the wrong design system patterns — reference `deck-add-slide` skill for the correct patterns.
