---
description: "Use when creating, editing, or reviewing slide JSX components in a deck project. Enforces the mandatory slide skeleton, imports, and anti-patterns."
applyTo: "**/slides/**/*.jsx"
---

# Slide JSX Conventions

## Step 0 — Read `deck.config.js` → check `designSystem`

Before writing any slide JSX:

- If `designSystem === 'shadcn'` → use the **shadcn skeleton**
- If `designSystem` is missing or any value other than `'shadcn'` → use the **default skeleton**

Do not mix the two.

## Common imports

```jsx
import { BottomBar, Slide } from '@deckio/deck-engine'
import styles from './MySlide.module.css'
```

## Default skeleton (`designSystem` is NOT `'shadcn'`)

```jsx
import { BottomBar, Slide } from '@deckio/deck-engine'
import styles from './MySlide.module.css'

export default function MySlide({ index, project }) {
  return (
    <Slide index={index} className={styles.mySlide}>
      <div className="accent-bar" />
      <div className={`orb ${styles.orb1}`} />
      <div className={`orb ${styles.orb2}`} />

      <div className={`${styles.body} content-frame content-gutter`}>
        {/* slide content */}
      </div>

      <BottomBar text="Project Footer Text" />
    </Slide>
  )
}
```

Required order inside `<Slide>`:

1. `accent-bar`
2. `orb` elements
3. `content-frame content-gutter`
4. `BottomBar` last

## shadcn skeleton (`designSystem === 'shadcn'`)

```jsx
import { BottomBar, Slide } from '@deckio/deck-engine'
import styles from './MySlide.module.css'

export default function MySlide({ index, project }) {
  return (
    <Slide index={index} className={styles.mySlide}>
      <div className={`${styles.body} content-frame content-gutter`}>
        <div className={styles.overline}>
          <span className={styles.overlineDash} />
          <span className={styles.overlineText}>SECTION LABEL</span>
        </div>

        <h2 className={styles.title}>Slide Title</h2>
        <p className={styles.subtitle}>Supporting copy.</p>

        <div className={styles.cards}>
          <article className={styles.card}>
            <h3>Card title</h3>
            <p>Card body text.</p>
          </article>
        </div>
      </div>

      <BottomBar text="Project Footer Text" />
    </Slide>
  )
}
```

### shadcn / ReactBits import examples

```jsx
import BlurText from '@/components/ui/blur-text'
import ShinyText from '@/components/ui/shiny-text'
import DecryptedText from '@/components/ui/decrypted-text'
import SpotlightCard from '@/components/ui/spotlight-card'
import { Button } from '@/components/ui/button'
```

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
- **NEVER use `accent-bar` class in a shadcn project**
- **NEVER use `orb` class in a shadcn project**
- **NEVER use `var(--bg-deep)` in a shadcn project**
- **NEVER use `var(--surface)` in a shadcn project**
- **NEVER use `var(--text)` in a shadcn project**
- **NEVER use `var(--text-muted)` in a shadcn project**
