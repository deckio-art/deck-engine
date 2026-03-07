---
name: deck-delete-slide
description: Guide for removing a slide from a deck project. Use this when asked to delete, remove, or drop a slide.
---

# Removing a Slide from a Deck Project

## Step 1: Identify the slide to remove

Open `deck.config.js` and review the `slides` array to see all slides and their order. If the user didn't specify which slide to remove, list them so the user can choose.

## Step 2: Remove from deck.config.js

1. **Remove the import statement** for the slide being deleted.
2. **Remove the component** from the `slides` array.

No index management is needed — the generic `App.jsx` assigns indexes by array position automatically.

## Step 3: Delete the slide files

Delete from `src/slides/`:

- `<SlideName>Slide.jsx`
- `<SlideName>Slide.module.css`

**Do not delete** shared slides from `@deckio/deck-engine` (like `GenericThankYouSlide`) — only remove the import.

## Step 4: Check for references

Search `src/slides/` for any remaining references to the deleted slide:

- Other slides that import or reference the deleted component
- Data files specific to the deleted slide (if any)
- Remove any orphaned references

## Step 5: Verify

The dev server hot-reloads automatically. Navigate through all slides and confirm:

- The deleted slide no longer appears
- All remaining slides are navigable (← → arrows, keyboard)
- Progress bar reflects the correct new total
- No console errors

## Quick checklist

- [ ] Removed import from `deck.config.js`
- [ ] Removed component from `slides` array
- [ ] Deleted slide `.jsx` and `.module.css` files
- [ ] No orphaned references to the deleted slide
- [ ] No console errors, all slides navigable
