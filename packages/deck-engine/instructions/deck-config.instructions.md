---
description: "Use when editing deck.config.js to register slides or modify project configuration."
applyTo: "**/deck.config.js"
---

# deck.config.js Conventions

## First rule

`deck.config.js` is the source of truth for both:

- slide registration (`slides` array)
- design-system branching (`designSystem`)

## Structure

```js
import CoverSlide from './src/slides/CoverSlide.jsx'
import MySlide from './src/slides/MySlide.jsx'

export default {
  id: 'my-project',
  title: 'Project Title',
  subtitle: 'Tagline',
  description: 'Metadata',
  icon: '🚀',
  accent: '#7c3aed',
  order: 1,
  slides: [
    CoverSlide,
    MySlide,
  ],
}
```

## Registering a new slide

1. Add an import at the top: `import NewSlide from './src/slides/NewSlide.jsx'`
2. Insert the component in the `slides` array at the desired position
3. Indices are assigned by array position — do not manage them manually
4. Registration is the same for both design systems
5. Do **not** change existing `theme`, `designSystem`, or `aurora` fields when you are only registering a slide
