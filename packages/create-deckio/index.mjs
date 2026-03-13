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
import { slugify, packageJson, deckConfig, mainJsx, resolveEngineRef, viteConfig, componentsJson, cnUtility, jsConfig, COLOR_PRESETS, AURORA_PALETTES, auroraAccent, coverSlideJsxShadcn, COVER_SLIDE_CSS_SHADCN, featuresSlideJsxShadcn, FEATURES_SLIDE_CSS_SHADCN, gettingStartedSlideJsxShadcn, GETTING_STARTED_SLIDE_CSS_SHADCN, thankYouSlideJsxShadcn, THANK_YOU_SLIDE_CSS_SHADCN, themeProviderJsx, appJsx, vscodeMcpConfig } from './utils.mjs'

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
## shadcn/ui Components

This project is set up with [shadcn/ui](https://ui.shadcn.com). Add components with:

\`\`\`bash
npx shadcn@latest add button
npx shadcn@latest add card
npx shadcn@latest add dialog
\`\`\`

Components are installed to \`src/components/ui/\`. Import them in your slides:

\`\`\`jsx
import { Button } from '@/components/ui/button'
\`\`\`

The \`@/\` alias maps to \`src/\` — configured in \`vite.config.js\`.

## 🤖 AI-Powered Component Discovery

This project comes with the shadcn MCP server pre-configured for VS Code.
Open the project in VS Code and try prompts like:

- "Show me all available backgrounds from React Bits"
- "Add the Aurora background from React Bits"
- "Add a fade-in animation using React Bits"

For other editors, run: \`npx shadcn@latest mcp init --client <your-client>\`

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

    // Choose design system
    const chosenDesignSystem = await clack.select({
      message: 'Design system',
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

  // shadcn/ui design system files
  if (designSystem === 'shadcn') {
    write(dir, 'components.json', componentsJson())
    write(dir, 'src/lib/utils.js', cnUtility())
    write(dir, 'jsconfig.json', jsConfig())
    write(dir, 'src/components/theme-provider.jsx', themeProviderJsx())
    write(dir, '.vscode/mcp.json', vscodeMcpConfig())
    mkdirSync(join(dir, 'src', 'components', 'ui'), { recursive: true })

    // Pre-install ReactBits components for out-of-the-box animations
    const reactBitsDir = join(__dirname, 'templates', 'react-bits')
    const uiDir = join(dir, 'src', 'components', 'ui')
    for (const file of ['aurora.jsx', 'aurora.css', 'blur-text.jsx', 'shiny-text.jsx', 'spotlight-card.jsx', 'decrypted-text.jsx']) {
      copyFileSync(join(reactBitsDir, file), join(uiDir, file))
    }
  }

  // Copy deckio.png to public/ for favicon and branding
  mkdirSync(join(dir, 'public'), { recursive: true })
  copyFileSync(join(__dirname, 'deckio.png'), join(dir, 'public', 'deckio.png'))

  // Copy Copilot skills + instructions from engine source (available pre-install)
  copyEngineAssets(dir)

  s.message('Installing dependencies...')
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
    s.stop('npm install failed — run it manually inside the project folder')
  }


  if (designSystem === 'shadcn') {
    clack.log.info('🤖 shadcn MCP server pre-configured — use AI to browse & add components')
  }

  clack.outro(`✦ Ready! cd ${slug} && npm run dev`)
}

main()