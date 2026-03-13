/**
 * Pure utility functions for the deck project scaffolder.
 *
 * Extracted so they can be unit-tested independently of the
 * interactive CLI entry point.
 */
import { readFileSync, existsSync } from 'fs'
import { join, dirname, relative } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

/**
 * Resolve the @deckio/deck-engine dependency reference for generated projects.
 *
 * Local dev (monorepo):  file: protocol pointing to the engine package
 * npm-installed:         ^version from the engine's package.json
 */
export function resolveEngineRef(projectDir) {
  const enginePkgPath = join(__dirname, '..', 'deck-engine', 'package.json')

  try {
    if (existsSync(enginePkgPath)) {
      const enginePkg = JSON.parse(readFileSync(enginePkgPath, 'utf-8'))
      if (enginePkg.name === '@deckio/deck-engine') {
        // In local dev, use file: protocol so npm install never hits the registry
        if (projectDir) {
          const engineDir = join(__dirname, '..', 'deck-engine')
          return `file:${relative(projectDir, engineDir)}`
        }
        return `^${enginePkg.version}`
      }
    }
  } catch { /* fall through to fallback */ }

  // Fallback: latest known published version (npm-installed scaffolder)
  return '^1.8.2'
}

export function slugify(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

export function packageJson(name, engineRef, { designSystem = 'none' } = {}) {
  if (!engineRef) engineRef = resolveEngineRef()
  const deps = {
    '@deckio/deck-engine': engineRef,
    react: '^19.1.0',
    'react-dom': '^19.1.0',
  }
  if (designSystem === 'shadcn') {
    deps['class-variance-authority'] = '^0.7.1'
    deps['clsx'] = '^2.1.1'
    deps['tailwind-merge'] = '^3.3.0'
  }
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
    dependencies: deps,
    devDependencies: {
      '@tailwindcss/vite': '^4.1.0',
      '@vitejs/plugin-react': '^4.4.1',
      tailwindcss: '^4.1.0',
      vite: '^6.3.5',
    },
  }, null, 2) + '\n'
}

export function mainJsx(theme = 'dark') {
  return `\
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@deckio/deck-engine/styles/global.css'
import '@deckio/deck-engine/themes/${theme}.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
`
}

export function deckConfig(slug, title, subtitle, icon, accent, theme = 'dark', designSystem = 'none') {
  const esc = (s) => s.replace(/'/g, "\\'")
  const dsLine = designSystem !== 'none' ? `\n  designSystem: '${esc(designSystem)}',` : ''

  if (designSystem === 'shadcn') {
    return `\
import CoverSlide from './src/slides/CoverSlide.jsx'
import FeaturesSlide from './src/slides/FeaturesSlide.jsx'
import GettingStartedSlide from './src/slides/GettingStartedSlide.jsx'
import ThankYouSlide from './src/slides/ThankYouSlide.jsx'

export default {
  id: '${esc(slug)}',
  title: '${esc(title)}',
  subtitle: '${esc(subtitle)}',
  description: '${esc(subtitle)}',
  icon: '${esc(icon)}',
  accent: '${esc(accent)}',
  theme: '${esc(theme)}',${dsLine}
  order: 1,
  slides: [
    CoverSlide,
    FeaturesSlide,
    GettingStartedSlide,
    ThankYouSlide,
  ],
}
`
  }

  const tyImport = "import { GenericThankYouSlide as ThankYouSlide } from '@deckio/deck-engine'"
  return `\
import CoverSlide from './src/slides/CoverSlide.jsx'
${tyImport}

export default {
  id: '${esc(slug)}',
  title: '${esc(title)}',
  subtitle: '${esc(subtitle)}',
  description: '${esc(subtitle)}',
  icon: '${esc(icon)}',
  accent: '${esc(accent)}',
  theme: '${esc(theme)}',${dsLine}
  order: 1,
  slides: [
    CoverSlide,
    ThankYouSlide,
  ],
}
`
}

export function viteConfig({ designSystem = 'none' } = {}) {
  const aliasImport = designSystem === 'shadcn' ? "import path from 'path'\nimport { fileURLToPath } from 'url'\n\nconst __dirname = path.dirname(fileURLToPath(import.meta.url))\n\n" : ''
  const aliasBlock = designSystem === 'shadcn' ? `\n  resolve: {\n    alias: {\n      '@': path.resolve(__dirname, 'src'),\n    },\n  },` : ''
  // Allow Vite to serve files from parent dirs (needed for file: protocol refs in local dev)
  const serverBlock = `\n  server: {\n    fs: {\n      allow: ['..', '../..'],\n    },\n  },`
  return `\
${aliasImport}import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { deckPlugin, tailwindPlugin } from '@deckio/deck-engine/vite'

export default defineConfig({
  plugins: [
    react({
      include: [/\\.[jt]sx?$/, /node_modules\\/@deckio\\/deck-engine\\/.+\\.jsx$/],
    }),
    deckPlugin(),
    tailwindPlugin(),
  ],${aliasBlock}${serverBlock}
})
`
}

export function componentsJson() {
  return JSON.stringify({
    $schema: 'https://ui.shadcn.com/schema.json',
    style: 'new-york',
    rsc: false,
    tsx: false,
    tailwind: {
      config: '',
      css: 'src/index.css',
      baseColor: 'neutral',
      cssVariables: true,
      prefix: '',
    },
    aliases: {
      components: '@/components',
      utils: '@/lib/utils',
      ui: '@/components/ui',
    },
    registries: {
      '@react-bits': 'https://reactbits.dev/r/{name}.json',
    },
  }, null, 2) + '\n'
}

export function cnUtility() {
  return `\
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
`
}

export const COLOR_PRESETS = [
  { value: '#6366f1', label: 'Indigo' },
  { value: '#10b981', label: 'Emerald' },
  { value: '#f43f5e', label: 'Rose' },
  { value: '#f59e0b', label: 'Amber' },
  { value: '#06b6d4', label: 'Cyan' },
  { value: '#8b5cf6', label: 'Violet' },
  { value: '#f97316', label: 'Orange' },
  { value: '#3b82f6', label: 'Blue' },
]

export function jsConfig() {
  return JSON.stringify({
    compilerOptions: {
      baseUrl: '.',
      paths: {
        '@/*': ['./src/*'],
      },
    },
  }, null, 2) + '\n'
}

/* ═══════════════════════════════════════════════════════════════════════════
   shadcn-specific Starter Slide Templates
   
   When designSystem is "shadcn", these replace the default dark-theme
   starter slides with a clean, editorial aesthetic that matches shadcn.com.
   ═══════════════════════════════════════════════════════════════════════════ */

export function coverSlideJsxShadcn(title, subtitle, slug) {
  const highlight = title.split(' ').pop()
  const before = title.split(' ').slice(0, -1).join(' ')
  return `\
// 💡 Add animated components: npx shadcn add @react-bits/animated-content
import { BottomBar, Slide } from '@deckio/deck-engine'
import styles from './CoverSlide.module.css'

export default function CoverSlide() {
  return (
    <Slide index={0} className={styles.cover}>
      <div className={styles.gridBg} />
      <div className={styles.accentGlow} />
      <div className={styles.accentLine} />

      <div className="content-frame content-gutter">
        <div className={styles.content}>
          <div className={styles.badge}>
            <span className={styles.badgeDot} />
            <span>${slug}</span>
          </div>

          <h1 className={styles.title}>
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

          <div className={styles.decorStrip}>
            <span className={styles.decorBlock} />
            <span className={styles.decorBlock} />
            <span className={styles.decorBlock} />
          </div>
        </div>
      </div>

      <BottomBar text="${slug}" />
    </Slide>
  )
}
`
}

export const COVER_SLIDE_CSS_SHADCN = `\
.cover {
  background: var(--background);
  padding: 0 0 44px 0;
  position: relative;
  overflow: hidden;
}

/* Dot grid background — fills the lower half with texture */
.gridBg {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, var(--border) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: linear-gradient(to bottom, transparent 15%, rgba(0,0,0,0.04) 40%, rgba(0,0,0,0.08) 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 15%, rgba(0,0,0,0.04) 40%, rgba(0,0,0,0.08) 100%);
  pointer-events: none;
}

/* Soft accent glow — anchored bottom-right */
.accentGlow {
  position: absolute;
  bottom: -120px;
  right: -60px;
  width: 480px;
  height: 480px;
  border-radius: 50%;
  background: radial-gradient(circle at center, var(--accent), transparent 70%);
  opacity: 0.07;
  pointer-events: none;
  animation: glow-breathe 6s ease-in-out infinite;
}

@keyframes glow-breathe {
  0%, 100% { opacity: 0.07; transform: scale(1); }
  50% { opacity: 0.12; transform: scale(1.05); }
}

/* Accent top shimmer line */
.accentLine {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--accent) 30%,
    var(--foreground) 50%,
    var(--accent) 70%,
    transparent
  );
  opacity: 0.5;
}
.accentLine::after {
  content: '';
  position: absolute;
  top: 0;
  left: -60%;
  width: 60%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    var(--accent) 50%,
    transparent
  );
  animation: shimmer 3.5s ease-in-out infinite;
}

@keyframes shimmer {
  0% { left: -60%; opacity: 0; }
  20% { opacity: 0.8; }
  100% { left: 100%; opacity: 0; }
}

/* Content layout */
.content {
  position: relative;
  z-index: 10;
  max-width: 720px;
  display: flex;
  flex-direction: column;
  gap: 0;
}

/* Badge / eyebrow */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 1.5px;
  text-transform: uppercase;
  color: var(--muted-foreground);
  padding: 6px 14px;
  border: 1px solid var(--border);
  border-radius: 100px;
  width: fit-content;
  margin-bottom: 32px;
  background: var(--secondary);
}

.badgeDot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--accent);
  box-shadow: 0 0 6px var(--accent);
  animation: pulse 2.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.85); }
}

/* Title */
.title {
  font-size: clamp(48px, 5.5vw, 76px);
  font-weight: 800;
  line-height: 1.05;
  letter-spacing: -2.5px;
  color: var(--foreground);
  margin-bottom: 24px;
}

.highlight {
  background: linear-gradient(
    135deg,
    var(--foreground) 0%,
    var(--accent) 50%,
    var(--foreground) 100%
  );
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: gradient-shift 5s ease infinite;
}

@keyframes gradient-shift {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

/* Subtitle */
.subtitle {
  font-size: clamp(16px, 1.8vw, 20px);
  font-weight: 400;
  color: var(--muted-foreground);
  line-height: 1.7;
  margin-bottom: 40px;
  max-width: 560px;
}

/* Metadata bar */
.meta {
  display: inline-flex;
  align-items: center;
  gap: 24px;
  padding: 16px 24px;
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  margin-bottom: 32px;
}

.metaItem {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.metaLabel {
  font-size: 11px;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 1.5px;
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

/* Decorative accent blocks — visual rhythm in the lower zone */
.decorStrip {
  display: flex;
  gap: 8px;
}

.decorBlock {
  width: 32px;
  height: 4px;
  border-radius: 2px;
  background: var(--accent);
  opacity: 0.25;
}
.decorBlock:first-child {
  width: 48px;
  opacity: 0.45;
}
.decorBlock:last-child {
  width: 20px;
  opacity: 0.15;
}
`

export function featuresSlideJsxShadcn(slug) {
  return `\
// 💡 npx shadcn add @react-bits/animated-content
import { BottomBar, Slide } from '@deckio/deck-engine'
import styles from './FeaturesSlide.module.css'

export default function FeaturesSlide() {
  return (
    <Slide index={1} className={styles.slide}>
      <div className={styles.gridBg} />

      <div className="content-frame content-gutter">
        <div className={styles.content}>
          <p className={styles.eyebrow}>Capabilities</p>
          <h2 className={styles.title}>What You Can Build</h2>

          <div className={styles.cards}>
            <div className={styles.card} style={{ animationDelay: '0s' }}>
              <div className={styles.cardIcon}>\u{1F9E9}</div>
              <h3 className={styles.cardTitle}>shadcn Components</h3>
              <p className={styles.cardDesc}>
                Button, Card, Dialog \\u2014 add any component with one command.
              </p>
              <code className={styles.cardHint}>npx shadcn add button</code>
            </div>

            <div className={styles.card} style={{ animationDelay: '0.15s' }}>
              <div className={styles.cardIcon}>\\u2728</div>
              <h3 className={styles.cardTitle}>CSS Animations</h3>
              <p className={styles.cardDesc}>
                Smooth transitions, staggered reveals, hover effects \\u2014 pure CSS.
              </p>
              <code className={styles.cardHint}>@react-bits/animated-content</code>
            </div>

            <div className={styles.card} style={{ animationDelay: '0.3s' }}>
              <div className={styles.cardIcon}>\u{1F3A8}</div>
              <h3 className={styles.cardTitle}>Theme System</h3>
              <p className={styles.cardDesc}>
                Light, dark, system. One toggle switches everything.
              </p>
              <code className={styles.cardHint}>Built-in mode toggle</code>
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

export const FEATURES_SLIDE_CSS_SHADCN = `\
.slide {
  background: var(--background);
  padding: 0 0 44px 0;
  position: relative;
  overflow: hidden;
}

.gridBg {
  position: absolute;
  inset: 0;
  background-image: radial-gradient(circle, var(--border) 1px, transparent 1px);
  background-size: 32px 32px;
  mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.03) 50%, rgba(0,0,0,0.06) 100%);
  -webkit-mask-image: linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.03) 50%, rgba(0,0,0,0.06) 100%);
  pointer-events: none;
}

.content {
  position: relative;
  z-index: 10;
}

.eyebrow {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 12px;
}

.title {
  font-size: clamp(32px, 4vw, 52px);
  font-weight: 800;
  letter-spacing: -1.5px;
  color: var(--foreground);
  margin-bottom: 48px;
  line-height: 1.1;
}

.cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 28px 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  animation: card-in 0.6s ease both;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.card:hover {
  border-color: var(--accent);
  box-shadow: 0 0 0 1px var(--accent);
}

@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cardIcon {
  font-size: 28px;
  line-height: 1;
}

.cardTitle {
  font-size: 18px;
  font-weight: 700;
  color: var(--foreground);
  letter-spacing: -0.3px;
}

.cardDesc {
  font-size: 14px;
  color: var(--muted-foreground);
  line-height: 1.55;
}

.cardHint {
  font-size: 12px;
  font-family: var(--font-mono, ui-monospace, monospace);
  color: var(--accent);
  background: var(--secondary);
  padding: 4px 10px;
  border-radius: calc(var(--radius) * 0.6);
  width: fit-content;
  margin-top: auto;
}
`

export function gettingStartedSlideJsxShadcn(slug) {
  return `\
// 💡 npx shadcn add @react-bits/code-block
import { BottomBar, Slide } from '@deckio/deck-engine'
import styles from './GettingStartedSlide.module.css'

export default function GettingStartedSlide() {
  return (
    <Slide index={2} className={styles.slide}>
      <div className="content-frame content-gutter">
        <div className={styles.content}>
          <p className={styles.eyebrow}>Workflow</p>
          <h2 className={styles.title}>Getting Started</h2>

          <div className={styles.steps}>
            <div className={styles.step} style={{ animationDelay: '0s' }}>
              <div className={styles.stepNumber}>1</div>
              <div className={styles.stepBody}>
                <h3 className={styles.stepTitle}>Add Components</h3>
                <div className={styles.codeBlock}>
                  <span className={styles.codeDim}>$</span> npx shadcn add button
                </div>
              </div>
            </div>

            <div className={styles.stepConnector} />

            <div className={styles.step} style={{ animationDelay: '0.2s' }}>
              <div className={styles.stepNumber}>2</div>
              <div className={styles.stepBody}>
                <h3 className={styles.stepTitle}>Use in Slides</h3>
                <div className={styles.codeBlock}>
                  <span className={styles.codeKeyword}>import</span> {"{"} Button {"}"} <span className={styles.codeKeyword}>from</span> <span className={styles.codeString}>'@/components/ui/button'</span>
                </div>
              </div>
            </div>

            <div className={styles.stepConnector} />

            <div className={styles.step} style={{ animationDelay: '0.4s' }}>
              <div className={styles.stepNumber}>3</div>
              <div className={styles.stepBody}>
                <h3 className={styles.stepTitle}>Present</h3>
                <div className={styles.codeBlock}>
                  <span className={styles.codeDim}>$</span> npm run dev
                </div>
              </div>
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

export const GETTING_STARTED_SLIDE_CSS_SHADCN = `\
.slide {
  background: var(--background);
  padding: 0 0 44px 0;
  position: relative;
  overflow: hidden;
}

.content {
  position: relative;
  z-index: 10;
  max-width: 680px;
}

.eyebrow {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 2px;
  text-transform: uppercase;
  color: var(--accent);
  margin-bottom: 12px;
}

.title {
  font-size: clamp(32px, 4vw, 52px);
  font-weight: 800;
  letter-spacing: -1.5px;
  color: var(--foreground);
  margin-bottom: 48px;
  line-height: 1.1;
}

.steps {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.step {
  display: flex;
  gap: 20px;
  align-items: flex-start;
  animation: step-in 0.5s ease both;
}

@keyframes step-in {
  from {
    opacity: 0;
    transform: translateX(-12px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.stepNumber {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: var(--background);
  background: var(--accent);
}

.stepBody {
  flex: 1;
}

.stepTitle {
  font-size: 18px;
  font-weight: 700;
  color: var(--foreground);
  margin-bottom: 10px;
  letter-spacing: -0.2px;
}

.stepConnector {
  width: 2px;
  height: 24px;
  margin-left: 17px;
  background: var(--border);
}

.codeBlock {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 14px;
  color: var(--foreground);
  background: var(--secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 12px 16px;
  line-height: 1.5;
}

.codeDim {
  color: var(--muted-foreground);
  margin-right: 8px;
}

.codeKeyword {
  color: var(--accent);
}

.codeString {
  color: var(--muted-foreground);
}
`


export function thankYouSlideJsxShadcn(slug, slideIndex = 3) {
  return `\
// 💡 Add animated components: npx shadcn add @react-bits/animated-content
import { BottomBar, Slide } from '@deckio/deck-engine'
import styles from './ThankYouSlide.module.css'

export default function ThankYouSlide() {
  return (
    <Slide index={${slideIndex}} className={styles.slide}>
      <div className={styles.topLine} />

      <div className="content-frame content-gutter">
        <div className={styles.content}>
          <h2 className={styles.title}>Thank You</h2>
          <div className={styles.divider} />
          <p className={styles.subtitle}>
            Let\\u2019s build something great \\u2014 together.
          </p>
        </div>
      </div>

      <BottomBar text="${slug}" />
    </Slide>
  )
}
`
}

/* ═══════════════════════════════════════════════════════════════════════════
   Dark / Light Mode Components (shadcn design system only)

   Generated into scaffolded projects when designSystem is "shadcn".
   Uses .dark class on <html> + CSS variables — the standard shadcn pattern.
   ═══════════════════════════════════════════════════════════════════════════ */

export function themeProviderJsx() {
  return `\
import { createContext, useContext, useEffect, useState } from 'react'

const ThemeProviderContext = createContext({
  theme: 'light',
  setTheme: () => null,
})

export function ThemeProvider({
  children,
  defaultTheme = 'light',
  storageKey = 'deckio-ui-theme',
}) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(storageKey) || defaultTheme,
  )

  useEffect(() => {
    const root = document.documentElement
    root.classList.remove('light', 'dark')

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
        .matches
        ? 'dark'
        : 'light'
      root.classList.add(systemTheme)
      return
    }

    root.classList.add(theme)
  }, [theme])

  const value = {
    theme,
    setTheme: (t) => {
      localStorage.setItem(storageKey, t)
      setTheme(t)
    },
  }

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  )
}

export function useTheme() {
  return useContext(ThemeProviderContext)
}
`
}

export function modeToggleJsx() {
  return `\
import { useTheme } from './theme-provider'

const MODES = ['light', 'dark', 'system']

export function ModeToggle() {
  const { theme, setTheme } = useTheme()

  function cycle() {
    const idx = MODES.indexOf(theme)
    setTheme(MODES[(idx + 1) % MODES.length])
  }

  const label =
    theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System'

  return (
    <button
      onClick={cycle}
      title={\`Theme: \${label}. Click to switch.\`}
      aria-label={\`Current theme: \${label}\`}
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        zIndex: 9999,
        background: 'var(--secondary)',
        border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        padding: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'var(--foreground)',
        opacity: 0.7,
        transition: 'opacity 0.2s',
      }}
      onMouseEnter={(e) => (e.currentTarget.style.opacity = '1')}
      onMouseLeave={(e) => (e.currentTarget.style.opacity = '0.7')}
    >
      {theme === 'dark' ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
        </svg>
      ) : theme === 'light' ? (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="5" />
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </svg>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      )}
    </button>
  )
}
`
}

export function appJsx({ designSystem = 'none' } = {}) {
  if (designSystem === 'shadcn') {
    return `\
import { useEffect } from 'react'
import { Navigation, SlideProvider } from '@deckio/deck-engine'
import { ThemeProvider } from './components/theme-provider'
import { ModeToggle } from './components/mode-toggle'
import project from '../deck.config.js'

export default function App() {
  const { accent, id, slides, theme, title } = project

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accent)
    document.title = title
  }, [accent, title])

  return (
    <ThemeProvider defaultTheme="light">
      <SlideProvider totalSlides={slides.length} project={id} slides={slides} theme={theme}>
        <Navigation />
        <div className="deck" data-project-id={id}>
          {slides.map((SlideComponent, index) => (
            <SlideComponent key={\`\${id}-slide-\${index}\`} index={index} project={project} />
          ))}
        </div>
        <ModeToggle />
      </SlideProvider>
    </ThemeProvider>
  )
}
`
  }

  return `\
import { useEffect } from 'react'
import { Navigation, SlideProvider } from '@deckio/deck-engine'
import project from '../deck.config.js'

export default function App() {
  const { accent, id, slides, theme, title } = project

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accent)
    document.title = title
  }, [accent, title])

  return (
    <SlideProvider totalSlides={slides.length} project={id} slides={slides} theme={theme}>
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
}

export const THANK_YOU_SLIDE_CSS_SHADCN = `\
.slide {
  background: var(--background);
  padding: 0 0 44px 0;
  position: relative;
  overflow: hidden;
}

/* Subtle top accent line */
.topLine {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--border) 20%,
    var(--foreground) 50%,
    var(--border) 80%,
    transparent
  );
  opacity: 0.4;
}

.content {
  position: relative;
  z-index: 2;
  max-width: 720px;
}

.title {
  font-size: clamp(48px, 6vw, 72px);
  font-weight: 800;
  letter-spacing: -2px;
  line-height: 1.1;
  background: linear-gradient(
    135deg,
    var(--foreground) 0%,
    var(--muted-foreground) 40%,
    var(--foreground) 60%,
    var(--muted-foreground) 100%
  );
  background-size: 200% 200%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: ty-gradient 5s ease infinite;
  margin-bottom: 24px;
}

@keyframes ty-gradient {
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
}

.divider {
  width: 48px;
  height: 2px;
  background: var(--border);
  margin-bottom: 24px;
  border-radius: 1px;
}

.subtitle {
  font-size: clamp(16px, 1.8vw, 20px);
  font-weight: 400;
  color: var(--muted-foreground);
  letter-spacing: 0.3px;
  line-height: 1.6;
}
`
