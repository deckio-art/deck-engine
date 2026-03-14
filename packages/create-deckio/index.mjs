#!/usr/bin/env node
/**
 * @deckio/create-deck-project — scaffold a new presentation project.
 *
 * Usage:
 *   npm create @deckio/deck-project my-talk
 *   npx @deckio/create-deck-project my-talk
 */
import { mkdirSync, writeFileSync, copyFileSync, existsSync, readdirSync } from 'fs'
import { join, resolve, dirname } from 'path'
import { exec } from 'child_process'
import { promisify } from 'util'
import { fileURLToPath } from 'url'
import * as clack from '@clack/prompts'
import { slugify, packageJson, deckConfig, indexCss, mainJsx, resolveEngineRef, viteConfig, componentsJson, cnUtility, jsConfig, COLOR_PRESETS, AURORA_PALETTES, auroraAccent, coverSlideJsxShadcn, COVER_SLIDE_CSS_SHADCN, featuresSlideJsxShadcn, FEATURES_SLIDE_CSS_SHADCN, gettingStartedSlideJsxShadcn, GETTING_STARTED_SLIDE_CSS_SHADCN, thankYouSlideJsxShadcn, THANK_YOU_SLIDE_CSS_SHADCN, themeProviderJsx, appJsx, vscodeMcpConfig, mcpGuide } from './utils.mjs'

const execAsync = promisify(exec)

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Resolve the engine source directory. In the monorepo it sits next to the
 * scaffolder; when published to npm it won't exist — callers must check.
 */
function resolveEngineRoot() {
  const monorepo = join(__dirname, '..', 'deck-engine')
  if (existsSync(join(monorepo, 'package.json'))) return monorepo
  return null
}

/**
 * Copy Copilot skills, instructions, and AGENTS.md from the engine source
 * into the new project. Runs before npm install so assets are available
 * immediately. init-project.mjs re-syncs after install (state.md, eyes, etc.).
 */
function copyEngineAssets(dir) {
  const engineRoot = resolveEngineRoot()
  if (!engineRoot) return

  // Skills
  const srcSkills = join(engineRoot, 'skills')
  if (existsSync(srcSkills)) {
    for (const entry of readdirSync(srcSkills, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue
      const skillFile = join(srcSkills, entry.name, 'SKILL.md')
      if (!existsSync(skillFile)) continue
      const destDir = join(dir, '.github', 'skills', entry.name)
      mkdirSync(destDir, { recursive: true })
      copyFileSync(skillFile, join(destDir, 'SKILL.md'))
    }
  }

  // Instructions
  const srcInstr = join(engineRoot, 'instructions')
  if (existsSync(srcInstr)) {
    const destInstr = join(dir, '.github', 'instructions')
    mkdirSync(destInstr, { recursive: true })
    for (const entry of readdirSync(srcInstr, { withFileTypes: true })) {
      if (!entry.isFile() || !entry.name.endsWith('.instructions.md')) continue
      copyFileSync(join(srcInstr, entry.name), join(destInstr, entry.name))
    }
  }

  // AGENTS.md
  const agentsSrc = join(engineRoot, 'instructions', 'AGENTS.md')
  if (existsSync(agentsSrc)) {
    copyFileSync(agentsSrc, join(dir, 'AGENTS.md'))
  }
}

/** True-color ANSI swatch block for a hex color */
function swatch(hex) {
  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) return ''
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `\x1b[48;2;${r};${g};${b}m  \x1b[0m`
}

function write(dir, relPath, content) {
  const full = join(dir, relPath)
  mkdirSync(join(full, '..'), { recursive: true })
  writeFileSync(full, content)
}

const INDEX_HTML = `\
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" type="image/png" href="/deckio.png" />
    <title>Deck</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`

function coverSlideJsx(title, subtitle, slug) {
  const highlight = title.split(' ').pop()
  const before = title.split(' ').slice(0, -1).join(' ')
  return `\
import { BottomBar, Slide } from '@deckio/deck-engine'
import styles from './CoverSlide.module.css'

export default function CoverSlide() {
  return (
    <Slide index={0} className={styles.cover}>
      <div className="accent-bar" />
      <div className={\`orb \${styles.orb1}\`} />
      <div className={\`orb \${styles.orb2}\`} />
      <div className={\`orb \${styles.orb3}\`} />

      <div className="content-frame content-gutter">
        <div className={styles.content}>
          <p className={styles.eyebrow}>${slug}</p>
          <h1>
            ${before ? `${before} ` : ''}<span className={styles.highlight}>${highlight}</span>
          </h1>
          <p className={styles.subtitle}>
            ${subtitle}
          </p>

          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Project</span>
              <span className={styles.metaValue}>${title}</span>
            </div>
            <div className={styles.metaDivider} />
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Date</span>
              <span className={styles.metaValue}>${new Date().getFullYear()}</span>
            </div>
          </div>
        </div>
      </div>

      <BottomBar text="${slug}" />
    </Slide>
  )
}
`
}

const COVER_SLIDE_CSS = `\
.cover {
  background: var(--background);
  padding: 0 0 44px 0;
}

.orb1 {
  width: 520px; height: 520px;
  top: -120px; right: -80px;
  background: radial-gradient(circle at 40% 40%, var(--accent), color-mix(in srgb, var(--green) 30%, transparent) 50%, transparent 70%);
}
.orb2 {
  width: 380px; height: 380px;
  bottom: -80px; right: 140px;
  background: radial-gradient(circle at 50% 50%, var(--purple-deep), color-mix(in srgb, var(--purple-deep) 30%, transparent) 60%, transparent 75%);
}
.orb3 {
  width: 260px; height: 260px;
  top: 60px; right: 280px;
  background: radial-gradient(circle at 50% 50%, var(--cyan), color-mix(in srgb, var(--cyan) 15%, transparent) 60%, transparent 75%);
}

.content {
  position: relative;
  z-index: 10;
  max-width: 700px;
}

.eyebrow {
  font-size: 13px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 2.5px;
  color: var(--accent);
  margin-bottom: 16px;
}

.content h1 {
  font-size: clamp(48px, 5.5vw, 80px);
  font-weight: 900;
  line-height: 1.05;
  letter-spacing: -2.5px;
  margin-bottom: 24px;
}

.highlight {
  background: linear-gradient(135deg, var(--accent), var(--cyan));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.subtitle {
  font-size: clamp(16px, 1.8vw, 20px);
  font-weight: 300;
  color: var(--muted-foreground);
  line-height: 1.65;
  margin-bottom: 48px;
  max-width: 580px;
}

.meta {
  display: inline-flex;
  align-items: center;
  gap: 24px;
  padding: 14px 28px;
  background: var(--surface-overlay);
  border: 1px solid var(--border);
  border-radius: 10px;
  backdrop-filter: blur(8px);
}

.metaItem {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.metaLabel {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1.2px;
  color: var(--muted-foreground);
}

.metaValue {
  font-size: 14px;
  font-weight: 600;
  color: var(--foreground);
}

.metaDivider {
  width: 1px;
  height: 32px;
  background: var(--border);
}
`

function agentsMd() {
  return `\
# Deck Project

This is a presentation deck built with \`@deckio/deck-engine\`.

## Purpose

Create and maintain slide-based presentations. Each project is a self-contained deck with its own theme, data, and slides.

## What to do

- Create, edit, and delete slides in \`src/slides/\`
- Manage project data in \`src/data/\`
- Register and reorder slides in \`deck.config.js\`

## What NOT to do

- Do not modify \`App.jsx\`, \`main.jsx\`, \`vite.config.js\`, \`package.json\`, or \`index.html\` — these are scaffolding files driven by the engine
- Do not modify anything in \`node_modules/\` or the engine itself
- Do not add dependencies without being asked

## Stack

- React 19, Vite, CSS Modules
- \`@deckio/deck-engine\` provides: \`Slide\`, \`BottomBar\`, \`Navigation\`, \`SlideProvider\`, \`useSlides\`, \`GenericThankYouSlide\`
- See \`.github/instructions/\` for detailed conventions on slide JSX, CSS modules, and deck.config.js
- See \`.github/skills/\` for step-by-step workflows (e.g., adding a slide)
`
}

const README = (designSystem = 'none') => {
  const shadcnSection = designSystem === 'shadcn' ? `
## Design System — Real shadcn/ui

This deck ships with **real [shadcn/ui](https://ui.shadcn.com) components** — not an imitation.
The source files live in your project and you own them completely. Modify, extend, or replace
any component to match your presentation's needs.

### Preinstalled components

| Component | Path | What it does |
|-----------|------|-------------|
| **Button** | \`src/components/ui/button.jsx\` | Variant-driven button (default, destructive, outline, secondary, ghost, link) |
| **Card** | \`src/components/ui/card.jsx\` | Flexible container (Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter) |
| **Badge** | \`src/components/ui/badge.jsx\` | Inline status / label badge with variants |
| **Separator** | \`src/components/ui/separator.jsx\` | Horizontal / vertical divider (Radix primitive) |
| **Alert** | \`src/components/ui/alert.jsx\` | Contextual alert with icon support (default, destructive) |

Plus **ReactBits** animation primitives: Aurora, BlurText, ShinyText, SpotlightCard, DecryptedText.

### Project structure

\`\`\`
src/
├── components/
│   ├── ui/              ← shadcn/ui + ReactBits components (yours to own)
│   └── presentation/    ← deck-specific wrappers (MetricCard, SectionBadge, etc.)
├── slides/              ← one file per slide
├── lib/
│   └── utils.js         ← cn() helper for class merging
└── App.jsx
deck.config.js           ← slide order, theme, metadata
components.json           ← shadcn CLI + ReactBits registry configuration
jsconfig.json             ← @/ path alias
.vscode/mcp.json          ← shadcn MCP server (pre-configured)
\`\`\`

## 🤖 Expanding Your Deck with AI (MCP)

This project is pre-configured for **MCP-powered component authoring** — the recommended way
to add new components to your deck. The shadcn MCP server is already wired into
\`.vscode/mcp.json\`. Just open this project in VS Code or GitHub Codespaces and start prompting.

### Adding shadcn/ui components

Ask Copilot to pull components from the official shadcn/ui registry:

| What you want | Example prompt |
|---------------|---------------|
| Add a single component | *"Add the Dialog component from shadcn"* |
| Add multiple at once | *"Add Sheet, Tooltip, and Tabs from shadcn"* |
| Explore what's available | *"What shadcn components would work for a pricing comparison slide?"* |
| Build with a component | *"Create a slide that uses the Accordion component to show FAQ items"* |
| Add form elements | *"Add Input, Select, and Textarea from shadcn for a feedback form slide"* |
| Add data display | *"Add the Table component from shadcn for a metrics comparison"* |

### Adding ReactBits components

The ReactBits registry is configured in \`components.json\` alongside shadcn. Ask for animations:

| What you want | Example prompt |
|---------------|---------------|
| Animated backgrounds | *"Add Hyperspeed from React Bits for a dramatic intro slide"* |
| Text effects | *"Show me all available text animations from React Bits"* |
| Card effects | *"Add a TiltCard from React Bits for interactive team member cards"* |
| Content transitions | *"Add AnimatedContent from React Bits for reveal-on-scroll sections"* |

### How the two registries coexist

Both registries are declared in \`components.json\`. The shadcn CLI resolves them by prefix:

- **No prefix** → shadcn/ui registry (e.g., \`npx shadcn@latest add dialog\`)
- **\`@react-bits/\` prefix** → ReactBits registry (e.g., \`npx shadcn@latest add @react-bits/code-block\`)

They share the same output directory (\`src/components/ui/\`) and the same \`@/\` alias.
No configuration conflicts — they were designed to work together.

### CLI fallback

If you prefer the terminal over AI prompts, the CLI works identically:

\`\`\`bash
# shadcn/ui components
npx shadcn@latest add dialog
npx shadcn@latest add sheet tooltip tabs

# ReactBits components
npx shadcn@latest add @react-bits/code-block
npx shadcn@latest add @react-bits/animated-content
\`\`\`

New components land in \`src/components/ui/\`. Import them in your slides:

\`\`\`jsx
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
\`\`\`

The \`@/\` alias maps to \`src/\` — configured in \`vite.config.js\` and \`jsconfig.json\`.

### Other editors

The MCP server is pre-configured for VS Code. For other editors:

\`\`\`bash
npx shadcn@latest mcp init --client <your-client>
\`\`\`

See \`MCP-GUIDE.md\` for the full MCP authoring reference.

` : ''
  return `\
# Built with [DECKIO](https://deckio.art)
${shadcnSection}
## How to edit this deck?

For a smooth ride, use \`Dev Containers\` locally or use \`GitHub Codespaces\`. That saves you from installing dependencies yourself. Once the container is up and running, the presentation starts in a simple browser session shared with GitHub Copilot and you can start editing.

If you want to run it directly on your machine:

\`\`\`bash
npm install
npm run dev
\`\`\`

Open http://localhost:5173 in your browser.

Typical flow after GitHub Copilot is ready and the presentation is visible in Simple Browser:

1. Ask GitHub Copilot to make the change you want.
2. Let GitHub Copilot update the deck files for you.
3. Review what changed.
4. Look at the presentation and see the result immediately in real time, thanks to hot reload.
5. If something feels off, ask GitHub Copilot to refine it and repeat.

## GitHub Copilot in VS Code

Do not make deck changes by editing code directly unless you really need to. This project is set up so GitHub Copilot in VS Code can do most of the work for you.

Use GitHub Copilot Chat in Agent mode and describe the change you want. You can choose the model you like, but we recommend frontier models, \`Claude Opus 4.6\` or \`GPT-5.3+\`, for the best experience.

The optimal flow is achieved with \`Claude Opus 4.6\` in fast mode.

## What Copilot already knows

This repo includes custom instructions and skills. Copilot already knows what files it should touch and what files it should leave alone.

Useful skills:

- \`deck-add-slide\` for creating a new slide and wiring it into \`deck.config.js\`
- \`deck-delete-slide\` for removing a slide cleanly
- \`deck-inspect\` for visually checking a rendered slide
- \`deck-validate-project\` for auditing the whole deck for consistency
- \`deck-sketch\` for turning a rough whiteboard idea into a real slide
- \`deck-generate-image\` for generating artwork or icons used in slides

## Prompt examples

Use prompts like these instead of editing files yourself:

- \`Add a slide that explains the rollout phases for strategic customers.\`
- \`Make this slide easier to scan and easier to present.\`
- \`Remove the speaker invite slide.\`
- \`Review this deck and fix anything that looks inconsistent or broken.\`
- \`Create a customer case study slide that fits the style of the rest of the presentation.\`
- \`Create a new slide based on my sketch.\`
- \`Inspect the current progress, tell me what looks off, and make visual improvements.\`

## GitHub Copilot CLI

Open GitHub Copilot CLI in this repo:

Do you prefer TUIs? This works with GitHub Copilot CLI too.

\`\`\`bash
gh copilot --yolo
\`\`\`
`
}

async function main() {
  const arg = process.argv[2]

  if (!arg || arg === '--help' || arg === '-h') {
    console.log(`
  Usage: npm create @deckio/deck-project <project-name>

  Examples:
    npm create @deckio/deck-project my-talk
    npm create @deckio/deck-project quarterly-review
    npx @deckio/create-deck-project cool-deck
`)
    process.exit(0)
  }

  const slug = slugify(arg)
  const dir = resolve(slug)

  // Guard: refuse to scaffold into a non-empty existing directory
  if (existsSync(dir)) {
    const entries = readdirSync(dir).filter((e) => e !== '.git')
    if (entries.length > 0) {
      if (process.stdin.isTTY) {
        const overwrite = await clack.confirm({
          message: `Directory "${slug}" already exists and is not empty. Continue anyway?`,
          initialValue: false,
        })
        if (!overwrite || clack.isCancel(overwrite)) {
          clack.cancel('Cancelled — directory left untouched.')
          process.exit(1)
        }
      } else {
        console.error(`Error: directory "${slug}" already exists and is not empty.`)
        process.exit(1)
      }
    }
  }

  const defaultTitle = slug.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())
  const isInteractive = process.stdin.isTTY

  let title, subtitle, accent, icon, theme, appearance, designSystem = 'none', aurora = null

  if (isInteractive) {
    clack.intro('✦ DECKIO — new deck')

    title = await clack.text({
      message: 'Title',
      placeholder: defaultTitle,
      defaultValue: defaultTitle,
    })
    if (clack.isCancel(title)) { clack.cancel('Cancelled.'); process.exit(0) }

    subtitle = await clack.text({
      message: 'Subtitle',
      placeholder: 'A presentation built with deck-engine',
      defaultValue: 'A presentation built with deck-engine',
    })
    if (clack.isCancel(subtitle)) { clack.cancel('Cancelled.'); process.exit(0) }

    icon = await clack.text({
      message: 'Icon',
      placeholder: '🎴',
      defaultValue: '🎴',
      hint: 'an emoji for your deck',
    })
    if (clack.isCancel(icon)) { clack.cancel('Cancelled.'); process.exit(0) }

    // Choose theme
    const chosenDesignSystem = await clack.select({
      message: 'Choose a theme',
      options: [
        { value: 'default', label: 'Default', hint: 'CSS custom properties' },
        { value: 'shadcn', label: 'shadcn/ui', hint: 'Tailwind + shadcn/ui' },
        { value: 'funky-punk', label: 'Funky Punk 🤘', hint: 'neon pink + lime + chaos' },
      ],
      initialValue: 'default',
    })
    if (clack.isCancel(chosenDesignSystem)) { clack.cancel('Cancelled.'); process.exit(0) }

    // Map funky-punk directly — skip appearance picker
    if (chosenDesignSystem === 'funky-punk') {
      theme = 'funky-punk'
      designSystem = 'none'
      appearance = 'dark'
    } else {
      // Choose appearance / theme
      appearance = await clack.select({
        message: 'Appearance',
        options: [
          { value: 'dark', label: 'Dark', hint: 'midnight' },
          { value: 'light', label: 'Light', hint: 'bright and airy' },
        ],
        initialValue: 'dark',
      })
      if (clack.isCancel(appearance)) { clack.cancel('Cancelled.'); process.exit(0) }

      // Map selections to theme + designSystem
      if (chosenDesignSystem === 'shadcn') {
        theme = 'shadcn'
        designSystem = 'shadcn'
      } else {
        theme = appearance // 'dark' or 'light'
        designSystem = 'none'
      }
    }

    // Color selection depends on design system
    if (designSystem === 'shadcn') {
      // Aurora palette picker — the palette IS the color identity for shadcn
      const paletteOptions = AURORA_PALETTES.map((p) => ({
        value: p.value,
        label: `${swatch(p.colors[0])}${swatch(p.colors[1])}${swatch(p.colors[2])} ${p.label}`,
        hint: p.hint,
      }))

      const chosenPalette = await clack.select({
        message: 'Aurora palette',
        options: paletteOptions,
        initialValue: 'ocean',
      })
      if (clack.isCancel(chosenPalette)) { clack.cancel('Cancelled.'); process.exit(0) }

      const palette = AURORA_PALETTES.find((p) => p.value === chosenPalette)
      aurora = { palette: palette.value, colors: palette.colors }
      // Derive accent from palette — no separate accent prompt
      accent = auroraAccent(palette.value)
    } else {
      // Default design system — accent color preset picker
      const colorOptions = [
        ...COLOR_PRESETS.map((c) => ({
          value: c.value,
          label: `${swatch(c.value)} ${c.label}`,
          hint: c.value,
        })),
        { value: '__custom', label: '✎ Custom hex', hint: 'enter your own' },
      ]

      accent = await clack.select({
        message: 'Accent color',
        options: colorOptions,
        initialValue: '#6366f1',
      })
      if (clack.isCancel(accent)) { clack.cancel('Cancelled.'); process.exit(0) }

      if (accent === '__custom') {
        accent = await clack.text({
          message: 'Hex color',
          placeholder: '#6366f1',
          defaultValue: '#6366f1',
          validate: (v) => /^#[0-9a-fA-F]{6}$/.test(v) ? undefined : 'Must be a valid hex color (e.g. #6366f1)',
        })
        if (clack.isCancel(accent)) { clack.cancel('Cancelled.'); process.exit(0) }
      }
    }
  } else {
    title = process.env.DECK_TITLE || defaultTitle
    subtitle = process.env.DECK_SUBTITLE || 'A presentation built with deck-engine'
    icon = process.env.DECK_ICON || '🎴'

    // New env vars: DECK_DESIGN_SYSTEM + DECK_APPEARANCE
    const envDesignSystem = process.env.DECK_DESIGN_SYSTEM
    const envAppearance = process.env.DECK_APPEARANCE || 'dark'

    if (envDesignSystem) {
      // New-style env vars
      if (envDesignSystem === 'shadcn') {
        theme = 'shadcn'
        designSystem = 'shadcn'
        appearance = envAppearance
      } else {
        theme = envAppearance // 'dark' or 'light'
        designSystem = 'none'
        appearance = envAppearance
      }
    } else {
      // Legacy fallback: DECK_THEME
      theme = process.env.DECK_THEME || 'dark'
      appearance = theme === 'shadcn' ? 'dark' : theme
      designSystem = theme === 'shadcn' ? 'shadcn' : 'none'
    }

    if (designSystem === 'shadcn') {
      // Aurora palette from env — derive accent from it
      const envPalette = process.env.DECK_AURORA_PALETTE || 'ocean'
      const palette = AURORA_PALETTES.find((p) => p.value === envPalette) || AURORA_PALETTES[0]
      aurora = { palette: palette.value, colors: palette.colors }
      accent = auroraAccent(palette.value)
    } else {
      // Default design system — accent from env
      accent = process.env.DECK_ACCENT || '#6366f1'
    }

    clack.log.info('Using defaults (non-interactive mode)')
  }

  const s = clack.spinner()

  s.start('Creating project files...')
  const engineRef = resolveEngineRef(dir)
  write(dir, 'package.json', packageJson(slug, engineRef, { designSystem }))
  write(dir, 'vite.config.js', viteConfig({ designSystem }))
  write(dir, 'index.html', INDEX_HTML)
  write(dir, 'src/index.css', indexCss(theme))
  write(dir, 'src/main.jsx', mainJsx(theme))
  write(dir, 'src/App.jsx', appJsx({ designSystem, appearance }))
  write(dir, 'src/data/.gitkeep', '')
  write(dir, 'src/slides/CoverSlide.jsx',
    designSystem === 'shadcn'
      ? coverSlideJsxShadcn(title, subtitle, slug)
      : coverSlideJsx(title, subtitle, slug))
  write(dir, 'src/slides/CoverSlide.module.css',
    designSystem === 'shadcn'
      ? COVER_SLIDE_CSS_SHADCN
      : COVER_SLIDE_CSS)
  write(dir, 'deck.config.js', deckConfig(slug, title, subtitle, icon, accent, theme, designSystem, aurora, appearance))

  // shadcn ThankYouSlide is a local file (editorial style); default uses engine's GenericThankYouSlide
  if (designSystem === 'shadcn') {
    write(dir, 'src/slides/FeaturesSlide.jsx', featuresSlideJsxShadcn(slug))
    write(dir, 'src/slides/FeaturesSlide.module.css', FEATURES_SLIDE_CSS_SHADCN)
    write(dir, 'src/slides/GettingStartedSlide.jsx', gettingStartedSlideJsxShadcn(slug))
    write(dir, 'src/slides/GettingStartedSlide.module.css', GETTING_STARTED_SLIDE_CSS_SHADCN)
    write(dir, 'src/slides/ThankYouSlide.jsx', thankYouSlideJsxShadcn(slug))
    write(dir, 'src/slides/ThankYouSlide.module.css', THANK_YOU_SLIDE_CSS_SHADCN)
  }
  write(dir, 'AGENTS.md', agentsMd())
  write(dir, 'README.md', README(designSystem))
  write(dir, '.gitignore', 'node_modules\ndist\n.vite\n')

  // shadcn-ready authoring files (setup contract, not bundled primitives)
  if (designSystem === 'shadcn') {
    write(dir, 'components.json', componentsJson())
    write(dir, 'src/lib/utils.js', cnUtility())
    write(dir, 'jsconfig.json', jsConfig())
    write(dir, 'src/components/theme-provider.jsx', themeProviderJsx())
    write(dir, '.vscode/mcp.json', vscodeMcpConfig())
    write(dir, 'MCP-GUIDE.md', mcpGuide())
    mkdirSync(join(dir, 'src', 'components', 'ui'), { recursive: true })

    // Pre-install real shadcn/ui components for out-of-the-box usage
    const shadcnUiDir = join(__dirname, 'templates', 'shadcn-ui')
    const uiDir = join(dir, 'src', 'components', 'ui')
    for (const file of ['button.jsx', 'card.jsx', 'badge.jsx', 'separator.jsx', 'alert.jsx']) {
      copyFileSync(join(shadcnUiDir, file), join(uiDir, file))
    }

    // Pre-install ReactBits components for out-of-the-box animations
    const reactBitsDir = join(__dirname, 'templates', 'react-bits')
    for (const file of ['aurora.jsx', 'aurora.css', 'blur-text.jsx', 'shiny-text.jsx', 'spotlight-card.jsx', 'decrypted-text.jsx']) {
      copyFileSync(join(reactBitsDir, file), join(uiDir, file))
    }

    // Deck-friendly wrapper components that compose shadcn primitives
    const presentationDir = join(__dirname, 'templates', 'presentation')
    const destPresentationDir = join(dir, 'src', 'components', 'presentation')
    mkdirSync(destPresentationDir, { recursive: true })
    for (const file of ['MetricCard.jsx', 'SectionBadge.jsx', 'CalloutAlert.jsx']) {
      copyFileSync(join(presentationDir, file), join(destPresentationDir, file))
    }
  }

  // Copy deckio.png to public/ for favicon and branding
  mkdirSync(join(dir, 'public'), { recursive: true })
  copyFileSync(join(__dirname, 'deckio.png'), join(dir, 'public', 'deckio.png'))

  // Copy Copilot skills + instructions from engine source (available pre-install)
  copyEngineAssets(dir)

  s.message('Installing dependencies...')
  let installOk = true
  try {
    await execAsync('npm install', { cwd: dir })
    s.message('Initializing engine skills & instructions...')
    try {
      const initScript = join(dir, 'node_modules', '@deckio', 'deck-engine', 'scripts', 'init-project.mjs')
      await execAsync(`node "${initScript}"`, { cwd: dir })
    } catch {
      clack.log.warn('Engine initialization skipped — run `npx deck-init` manually if needed')
    }
    s.stop('Project ready!')
  } catch {
    installOk = false
    s.stop('npm install failed — run it manually inside the project folder')
  }

  if (designSystem === 'shadcn') {
    clack.log.info(
      '🎨 Real shadcn/ui components preinstalled: Button, Card, Badge, Separator, Alert\n' +
      '   Plus ReactBits animations: Aurora, BlurText, ShinyText, SpotlightCard, DecryptedText\n' +
      '   Add more: npx shadcn@latest add [component]  •  AI: shadcn MCP pre-configured\n' +
      '   📖 See MCP-GUIDE.md for AI-powered component authoring prompts'
    )
  }

  if (installOk) {
    clack.outro(`✦ Ready! cd ${slug} && npm run dev`)
  } else {
    clack.outro(`⚠ cd ${slug} && npm install   (then npm run dev)`)
  }
}

main()