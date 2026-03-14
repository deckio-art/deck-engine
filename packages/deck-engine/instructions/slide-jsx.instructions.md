---
description: "Use when creating, editing, or reviewing slide JSX components in a deck project. Enforces the mandatory slide skeleton, imports, and anti-patterns."
applyTo: "**/slides/**/*.jsx"
---

# Slide JSX Conventions

## Step 0 — Read `deck.config.js` and the active descriptor

Before writing any slide JSX:

1. Read `theme` and `designSystem` from `deck.config.js`
2. Resolve the active theme descriptor
3. Use that descriptor as the source of truth for slide structure, imports, allowed components, and anti-patterns

### Descriptor resolution

- Built-in themes: read `dark.md`, `light.md`, or `shadcn.md` from `node_modules/@deckio/deck-engine/themes/descriptors/`
- Custom themes: read `src/themes/<theme>/descriptor.md` or `src/themes/<theme>.descriptor.md`
- If the custom descriptor is missing, fall back to the built-in descriptor implied by `designSystem`

If `designSystem` is `shadcn`, also read the shadcn supplement instructions:
- `shadcn-setup.instructions.md` — infrastructure contract
- `shadcn-components.instructions.md` — component reference, preinstalled set, migration patterns

## Common imports

```jsx
import { BottomBar, Slide } from '@deckio/deck-engine'
import styles from './MySlide.module.css'
```

### shadcn deck imports (when `designSystem === 'shadcn'`)

Preinstalled components are ready to import — no CLI setup needed:

```jsx
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardAction, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import SpotlightCard from '@/components/ui/spotlight-card'
import BlurText from '@/components/ui/blur-text'
```

**Real components are the default authoring pattern.** Never recreate a Card, Badge, Button, Alert, or Separator with raw `<div>` + CSS when the real component is available.

## What to read in the descriptor

Before generating JSX, read:

- **Exact JSX skeleton**
- **Decorative elements available**
- **Available components**
- **Anti-patterns**

If the descriptor gives an exact skeleton, start there and fill in real content. Do not mix descriptor families.

## Props

Every slide receives `{ index, project }`. Pass `index` to `<Slide>`.

## Registration

After creating the slide component, register it in `deck.config.js`:

```js
import MySlide from './src/slides/MySlide.jsx'
```

Then add `MySlide` to the `slides` array.

## Hard rules

- Never omit `content-frame content-gutter`
- Never omit `BottomBar`
- Never use string paths for images — always `import logo from '../data/...'`
- Never hardcode slide indices — use `useSlides().goTo()` for navigation
- Never violate the active descriptor's anti-patterns
- If `designSystem` and the descriptor disagree, follow `designSystem` for structure and report the mismatch
