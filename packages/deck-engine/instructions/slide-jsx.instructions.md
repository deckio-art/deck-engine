---
description: "Use when creating, editing, or reviewing slide JSX components in a deck project. Enforces the mandatory slide skeleton, imports, and anti-patterns."
applyTo: "**/slides/**/*.jsx"
---

# Slide JSX Conventions

## Theme Detection

**Before writing any slide JSX**, read `deck.config.js` and check `designSystem`:
- `designSystem: 'shadcn'` → follow the **shadcn skeleton** below
- `designSystem: 'none'` or absent → follow the **default skeleton** below

## Imports

```jsx
import { BottomBar, Slide } from '@deckio/deck-engine'
import styles from './MySlide.module.css'
```

## Default skeleton (in order inside `<Slide>`)

1. `<div className="accent-bar" />` — always first
2. 2–4 orbs: `<div className={\`orb ${styles.orbN}\`} />`
3. Content wrapper: `<div className={\`${styles.body} content-frame content-gutter\`}>` — all visible content here
4. `<BottomBar text="..." />` — always last child

## shadcn skeleton (in order inside `<Slide>`)

1. Content wrapper: `<div className={\`${styles.body} content-frame content-gutter\`}>` — all visible content here
2. `<BottomBar text="..." />` — always last child

**NO `accent-bar`. NO orbs.** The Aurora background animation shows through the semi-transparent slide background.

### shadcn component imports

```jsx
import BlurText from '@/components/ui/blur-text'
import ShinyText from '@/components/ui/shiny-text'
import DecryptedText from '@/components/ui/decrypted-text'
import SpotlightCard from '@/components/ui/spotlight-card'
```

shadcn/ui components (if installed): `import { Button } from '@/components/ui/button'`

## Props

Every slide receives `{ index, project, title, subtitle }`. Pass `index` to `<Slide>`.

## Available engine exports

`Slide`, `BottomBar`, `Navigation`, `SlideProvider`, `useSlides`, `GenericThankYouSlide`

## Anti-patterns

- Never omit `content-frame content-gutter` or `BottomBar`
- Never use string paths for images — always `import logo from '../data/...'`
- Never hardcode slide indices — use `useSlides().goTo()` for navigation
- Never use `accent-bar` or `orb` in a shadcn project
- Never use dark-theme tokens (`--bg-deep`, `--surface`, `--text`, `--text-muted`) in a shadcn project
