---
description: "Use when creating, editing, or reviewing slide JSX components in a deck project. Enforces the mandatory slide skeleton, imports, and anti-patterns."
applyTo: "**/slides/**/*.jsx"
---

# Slide JSX Conventions

## Imports

```jsx
import { BottomBar, Slide } from '@deckio/deck-engine'
import styles from './MySlide.module.css'
```

## Mandatory skeleton (in order inside `<Slide>`)

1. `<div className="accent-bar" />` — always first
2. 2–4 orbs: `<div className={\`orb ${styles.orbN}\`} />`
3. Content wrapper: `<div className={\`${styles.body} content-frame content-gutter\`}>` — all visible content here
4. `<BottomBar text="..." />` — always last child

## Props

Every slide receives `{ index, project, title, subtitle }`. Pass `index` to `<Slide>`.

## Available engine exports

`Slide`, `BottomBar`, `Navigation`, `SlideProvider`, `useSlides`, `GenericThankYouSlide`

## Anti-patterns

- Never omit `accent-bar`, `content-frame content-gutter`, or `BottomBar`
- Never use string paths for images — always `import logo from '../data/...'`
- Never hardcode slide indices — use `useSlides().goTo()` for navigation
