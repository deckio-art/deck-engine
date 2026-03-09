#!/usr/bin/env node
/**
 * @deckio/create-deck-project — scaffold a new presentation project.
 *
 * Usage:
 *   npm create @deckio/deck-project my-talk
 *   npx @deckio/create-deck-project my-talk
 */
import { mkdirSync, writeFileSync } from 'fs'
import { join, resolve } from 'path'
import { execSync } from 'child_process'
import { createInterface } from 'readline'

function ask(rl, question, fallback) {
  return new Promise((res) => {
    rl.question(`${question} ${fallback ? `(${fallback}) ` : ''}`, (answer) => {
      res(answer.trim() || fallback || '')
    })
  })
}

function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function write(dir, relPath, content) {
  const full = join(dir, relPath)
  mkdirSync(join(full, '..'), { recursive: true })
  writeFileSync(full, content)
}

function packageJson(name) {
  return JSON.stringify({
    name: `deck-project-${name}`,
    version: '0.1.0',
    private: true,
    type: 'module',
    scripts: {
      dev: 'vite',
      build: 'vite build',
      preview: 'vite preview',
    },
    dependencies: {
      '@deckio/deck-engine': '^1.7.7',
      react: '^19.1.0',
      'react-dom': '^19.1.0',
    },
    devDependencies: {
      '@vitejs/plugin-react': '^4.4.1',
      vite: '^6.3.5',
    },
  }, null, 2) + '\n'
}

const VITE_CONFIG = `\
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { deckPlugin } from '@deckio/deck-engine/vite'

export default defineConfig({
  plugins: [
    react({
      include: [/\\.[jt]sx?$/, /node_modules\\/@deckio\\/deck-engine\\/.+\\.jsx$/],
    }),
    deckPlugin(),
  ],
})
`

const INDEX_HTML = `\
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Deck</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
`

const MAIN_JSX = `\
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@deckio/deck-engine/styles/global.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
`

const APP_JSX = `\
import { useEffect } from 'react'
import { Navigation, SlideProvider } from '@deckio/deck-engine'
import project from '../deck.config.js'

export default function App() {
  const { accent, id, slides, title } = project

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accent)
    document.title = title
  }, [accent, title])

  return (
    <SlideProvider totalSlides={slides.length} project={id} slides={slides}>
      <Navigation />
      <div className="deck" data-project-id={id}>
        {slides.map((SlideComponent, index) => (
          <SlideComponent key={\`\${id}-slide-\${index}\`} index={index} project={project} />
        ))}
      </div>
    </SlideProvider>
  )
}
`

function deckConfig(slug, title, subtitle, icon, accent) {
  const esc = (s) => s.replace(/'/g, "\\'")
  return `\
import CoverSlide from './src/slides/CoverSlide.jsx'
import { GenericThankYouSlide as ThankYouSlide } from '@deckio/deck-engine'

export default {
  id: '${esc(slug)}',
  title: '${esc(title)}',
  subtitle: '${esc(subtitle)}',
  description: '${esc(subtitle)}',
  icon: '${esc(icon)}',
  accent: '${esc(accent)}',
  order: 1,
  slides: [
    CoverSlide,
    ThankYouSlide,
  ],
}
`
}

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
  background: var(--bg-deep);
  flex-direction: column;
  justify-content: center;
  padding: 0 0 44px 0;
}

.orb1 {
  width: 520px; height: 520px;
  top: -120px; right: -80px;
  background: radial-gradient(circle at 40% 40%, var(--accent), rgba(63,185,80,0.3) 50%, transparent 70%);
}
.orb2 {
  width: 380px; height: 380px;
  bottom: -80px; right: 140px;
  background: radial-gradient(circle at 50% 50%, var(--purple-deep), rgba(110,64,201,0.3) 60%, transparent 75%);
}
.orb3 {
  width: 260px; height: 260px;
  top: 60px; right: 280px;
  background: radial-gradient(circle at 50% 50%, var(--cyan), rgba(86,212,221,0.15) 60%, transparent 75%);
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
  color: var(--text-muted);
  line-height: 1.65;
  margin-bottom: 48px;
  max-width: 580px;
}

.meta {
  display: inline-flex;
  align-items: center;
  gap: 24px;
  padding: 14px 28px;
  background: rgba(22, 27, 34, 0.8);
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
  color: var(--text-muted);
}

.metaValue {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
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

const README = () => `\
# Built with [Deckio](https://deckio.art)

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

  let title, subtitle, accent, icon

  console.log()
  console.log(`  🎴 Creating deck project: ${slug}`)
  console.log()

  if (isInteractive) {
    const rl = createInterface({ input: process.stdin, output: process.stdout })
    title = await ask(rl, '  Title:', defaultTitle)
    subtitle = await ask(rl, '  Subtitle:', 'A presentation built with deck-engine')
    accent = await ask(rl, '  Accent color:', '#3fb950')
    icon = await ask(rl, '  Icon emoji:', '🎴')
    rl.close()
  } else {
    title = process.env.DECK_TITLE || defaultTitle
    subtitle = process.env.DECK_SUBTITLE || 'A presentation built with deck-engine'
    accent = process.env.DECK_ACCENT || '#3fb950'
    icon = process.env.DECK_ICON || '🎴'
    console.log('  Using defaults (non-interactive mode)')
  }
  console.log()

  write(dir, 'package.json', packageJson(slug))
  write(dir, 'vite.config.js', VITE_CONFIG)
  write(dir, 'index.html', INDEX_HTML)
  write(dir, 'src/main.jsx', MAIN_JSX)
  write(dir, 'src/App.jsx', APP_JSX)
  write(dir, 'src/data/.gitkeep', '')
  write(dir, 'src/slides/CoverSlide.jsx', coverSlideJsx(title, subtitle, slug))
  write(dir, 'src/slides/CoverSlide.module.css', COVER_SLIDE_CSS)
  write(dir, 'deck.config.js', deckConfig(slug, title, subtitle, icon, accent))
  write(dir, 'AGENTS.md', agentsMd())
  write(dir, 'README.md', README())
  write(dir, '.gitignore', 'node_modules\ndist\n.vite\n')

  console.log('  📁 Project scaffolded!')
  console.log()

  console.log('  📦 Installing dependencies...')
  console.log()
  try {
    execSync('npm install', { cwd: dir, stdio: 'inherit' })
  } catch {
    console.log()
    console.log('  ⚠️  npm install failed — run it manually inside the project folder.')
  }

  console.log()
  console.log('  🔧 Initializing engine skills & instructions...')
  try {
    const initScript = join(dir, 'node_modules', '@deckio', 'deck-engine', 'scripts', 'init-project.mjs')
    execSync(`node "${initScript}"`, { cwd: dir, stdio: 'inherit' })
  } catch {
    console.log('  ⚠️  Could not run init-project — run it manually: npx deck-init')
  }

  console.log()
  console.log('  ✅ Done! Your deck is ready.')
  console.log()
  console.log('  Next steps:')
  console.log(`    cd ${slug}`)
  console.log('    npm run dev')
  console.log()
  console.log('  Open http://localhost:5173 and start adding slides!')
  console.log()
}

main()