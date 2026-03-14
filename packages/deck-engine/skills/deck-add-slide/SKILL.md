---
name: deck-add-slide
description: Guide for adding a new slide to a deck project. Use this when asked to create, add, or build a new slide component.
---

# Adding a Slide to a Deck Project

## Step 0 — Read `deck.config.js`

Before writing any JSX or CSS:

1. Open `deck.config.js`.
2. Read both `theme` and `designSystem`.
3. Resolve the active theme descriptor.
4. Follow that descriptor exactly for slide structure, CSS, tokens, decorative elements, allowed components, and anti-patterns.
5. Do **not** mix patterns from multiple descriptors.

## Step 1 — Resolve the active theme descriptor

### Built-in themes

Read the matching built-in descriptor from the engine package:

| Theme | Monorepo path | Generated deck path |
|---|---|---|
| `dark` | `packages/deck-engine/themes/descriptors/dark.md` | `node_modules/@deckio/deck-engine/themes/descriptors/dark.md` |
| `light` | `packages/deck-engine/themes/descriptors/light.md` | `node_modules/@deckio/deck-engine/themes/descriptors/light.md` |
| `shadcn` | `packages/deck-engine/themes/descriptors/shadcn.md` | `node_modules/@deckio/deck-engine/themes/descriptors/shadcn.md` |

### Custom or on-demand themes

If `theme` is not one of the built-ins, look for a custom descriptor in this order:

1. `src/themes/<theme>/descriptor.md`
2. `src/themes/<theme>.descriptor.md`
3. If `theme` is a CSS path such as `./src/themes/client-a.css`, look for:
   - `./src/themes/client-a/descriptor.md`
   - `./src/themes/client-a.descriptor.md`

If no custom descriptor exists, fall back to the built-in descriptor that matches `designSystem`:

- `designSystem === 'shadcn'` → use the `shadcn` descriptor
- any other value or no `designSystem` → use the `dark` descriptor as the default DECKIO fallback

## Step 2 — Cross-check `designSystem`

`designSystem` remains the safety check for structure:

- `designSystem === 'shadcn'` → the slide must obey shadcn structure and anti-patterns
- any other value or missing field → the slide must obey the default DECKIO structure and anti-patterns

If the descriptor and `designSystem` disagree, follow `designSystem` for structure and call out the mismatch in your response so the project owner can fix the configuration.

### When `designSystem === 'shadcn'`: load the component supplement

Also read the shadcn supplement instructions before generating code:

1. `shadcn-setup.instructions.md` — infrastructure contract
2. `shadcn-components.instructions.md` — component reference, migration patterns, decision tree

These tell you which real components are preinstalled and ready to import:

| Preinstalled | Import |
|---|---|
| `Button` | `'@/components/ui/button'` |
| `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter` | `'@/components/ui/card'` |
| `Badge` | `'@/components/ui/badge'` |
| `Separator` | `'@/components/ui/separator'` |
| `Alert`, `AlertTitle`, `AlertDescription` | `'@/components/ui/alert'` |
| `Aurora`, `BlurText`, `ShinyText`, `DecryptedText`, `SpotlightCard` | `'@/components/ui/<name>'` |

**Always prefer real component imports over CSS imitation.** If a preinstalled component can replace a hand-built div, use the component.

## Step 3 — Create the slide from the descriptor

The descriptor is the source of truth. Read these sections before generating code:

1. **Exact JSX skeleton**
2. **Exact CSS skeleton**
3. **Token table**
4. **Decorative elements available**
5. **Available components**
6. **Anti-patterns**
7. **Example slide direction**

Do not paraphrase the structure if the descriptor gives an exact skeleton. Start from it, then fill in real content.

## Step 4 — Registration in `deck.config.js`

After creating the slide files:

1. Add an import at the top: `import MyNewSlide from './src/slides/MyNewSlide.jsx'`
2. Add the component to the `slides` array at the desired position.
3. Do **not** change `theme`, `designSystem`, or `aurora` while registering the slide.

The generic `App.jsx` renders slides from this array and passes `index` automatically. You do **not** manage slide indices manually.

## Step 5 — Common limits and guardrails

These apply regardless of theme:

- Always include `content-frame content-gutter`
- Always include `BottomBar` as the last child inside `<Slide>`
- Always use ESM imports for images and logos
- Never use string paths for images
- Never use `flex: 1` on the body wrapper
- Never add `flex-direction: column` on the slide root
- Never overload a slide until it overflows the viewport

### Content density limits

| Layout | Max items | Notes |
|--------|-----------|-------|
| Cards (3-col grid) | 6 (2 rows) | Reduce card padding if tight |
| Cards (2-col grid) | 4 (2 rows) | Preferred for detailed cards |
| Timeline / event list | 3–4 items | Use compact card height for 4 |
| Bullet points | 6–8 | Depends on line length |
| Full-width content blocks | 2–3 | Split across slides if it gets tight |

## Step 6 — Verify

After writing the slide:

1. Re-read the descriptor and confirm the slide still matches it.
2. Run the project validation flow.
3. Visually inspect the slide in the deck.

## Quick checklist

- [ ] Read `theme` and `designSystem` from `deck.config.js`
- [ ] Read the active theme descriptor before writing code
- [ ] If `designSystem === 'shadcn'`: read the shadcn supplement instructions
- [ ] If `designSystem === 'shadcn'`: used real component imports (Card, Badge, Button, Alert, Separator) instead of CSS imitation
- [ ] Used the descriptor's exact JSX skeleton or direct variant of it
- [ ] Used the descriptor's exact CSS skeleton or direct variant of it
- [ ] Stayed inside the descriptor's token set and component ecosystem
- [ ] Avoided the descriptor's anti-patterns
- [ ] Added the import to `deck.config.js`
- [ ] Added the slide to the `slides` array
- [ ] Left `theme`, `designSystem`, and `aurora` unchanged
