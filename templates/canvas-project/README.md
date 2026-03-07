# Canvas Project

A slide deck built on the [Canvas engine](https://github.com/lopezleandro03/github-ai-adoption-program).

## Quick start — Codespaces (recommended)

1. Click **Code → Codespaces → New codespace** on this repo
2. Wait ~30 seconds — dependencies install and dev server starts automatically
3. A browser preview opens with your slides. **Edit any file in `src/slides/` and see changes instantly.**

## Quick start — Local

```bash
git clone <this-repo-url>
cd <project-folder>
npm install
npm run dev
```

Open http://localhost:5173 — edit slides, see live hot-reload.

## Project structure

```
src/
  slides/           ← Your slide components (one .jsx + .module.css per slide)
    CoverSlide.jsx
    ...
  App.jsx           ← App shell (auto-renders slides from canvas.config.js)
  main.jsx          ← Entry point
canvas.config.js    ← Project metadata: id, title, icon, slide list
vite.config.js      ← Vite + Canvas engine plugin
.devcontainer/      ← Codespaces configuration
.npmrc              ← Points to GitHub Packages for the engine
```

## Creating a slide

Every slide follows this pattern:

```jsx
import { BottomBar, Slide } from '@lopezleandro03/canvas-engine'
import styles from './MySlide.module.css'

export default function MySlide({ index }) {
  return (
    <Slide index={index} className={styles.mySlide}>
      <div className="accent-bar" />
      <div className="content-frame content-gutter">
        <h1>Hello</h1>
      </div>
      <BottomBar />
    </Slide>
  )
}
```

Then add it to the `slides` array in `canvas.config.js`.

## Available engine exports

```js
// Core components
import { Slide, SlideProvider, Navigation, BottomBar, useSlides } from '@lopezleandro03/canvas-engine'

// Shared slides
import GenericThankYouSlide from '@lopezleandro03/canvas-engine/slides/GenericThankYouSlide'

// Global styles (imported once in main.jsx)
import '@lopezleandro03/canvas-engine/styles/global.css'

// Vite plugin (used in vite.config.js)
import { canvasPlugin } from '@lopezleandro03/canvas-engine/vite'
```

## CSS conventions

- Background: `var(--bg-deep)` or `var(--bg)`
- Accent color: `var(--accent)` (set per-project in `canvas.config.js`)
- Content width: use `content-frame content-gutter` classes
- Decorations: `accent-bar`, `orb`, `grid-dots` classes
- Bottom bar height: 44px (always add `<BottomBar />`)

