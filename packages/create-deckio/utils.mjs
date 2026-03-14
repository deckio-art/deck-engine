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
  return 'latest'
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
    deps['lucide-react'] = '^0.511.0'
    deps['motion'] = '^12.23.12'
    deps['ogl'] = '^1.0.11'
    deps['radix-ui'] = '^1.4.2'
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

export function indexCss(theme = 'dark') {
  return `\
@import '@deckio/deck-engine/styles/global.css';
@import '@deckio/deck-engine/themes/${theme}.css';
`
}

export function mainJsx(theme = 'dark') {
  return `\
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
`
}

export function deckConfig(slug, title, subtitle, icon, accent, theme = 'dark', designSystem = 'none', aurora = null, appearance = 'dark') {
  const esc = (s) => s.replace(/'/g, "\\'")
  const dsLine = designSystem !== 'none' ? `\n  designSystem: '${esc(designSystem)}',` : ''
  const appearanceLine = `\n  appearance: '${esc(appearance)}',`
  const auroraBlock = aurora ? `\n  aurora: {\n    palette: '${esc(aurora.palette)}',\n    colors: ${JSON.stringify(aurora.colors)},\n  },` : ''

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
  theme: '${esc(theme)}',${dsLine}${appearanceLine}${auroraBlock}
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
  theme: '${esc(theme)}',${dsLine}${appearanceLine}
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

export function vscodeMcpConfig() {
  return JSON.stringify({
    servers: {
      shadcn: {
        command: 'npx',
        args: ['-y', 'shadcn@latest', 'mcp'],
        env: {},
      },
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

export const AURORA_PALETTES = [
  { value: 'ocean',   label: 'Ocean',   hint: 'blue, indigo, violet',    colors: ['#0ea5e9', '#6366f1', '#8b5cf6'] },
  { value: 'sunset',  label: 'Sunset',  hint: 'orange, red, pink',      colors: ['#f97316', '#ef4444', '#ec4899'] },
  { value: 'forest',  label: 'Forest',  hint: 'green, cyan, blue',      colors: ['#10b981', '#06b6d4', '#3b82f6'] },
  { value: 'nebula',  label: 'Nebula',  hint: 'purple, pink, rose',     colors: ['#8b5cf6', '#ec4899', '#f43f5e'] },
  { value: 'arctic',  label: 'Arctic',  hint: 'cyan, blue, indigo',     colors: ['#06b6d4', '#3b82f6', '#6366f1'] },
  { value: 'minimal', label: 'Minimal', hint: 'neutral zinc',           colors: ['#71717a', '#a1a1aa', '#d4d4d8'] },
]

/** Derive accent color from aurora palette — first color of the palette */
export const AURORA_ACCENT_MAP = {
  ocean:   '#0ea5e9',
  sunset:  '#f97316',
  forest:  '#10b981',
  nebula:  '#8b5cf6',
  arctic:  '#06b6d4',
  minimal: '#71717a',
}

/** Get the accent color for a given aurora palette name */
export function auroraAccent(paletteName) {
  return AURORA_ACCENT_MAP[paletteName] || AURORA_ACCENT_MAP.ocean
}

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
   shadcn-ready Starter Slide Templates
   
   When designSystem is "shadcn", these replace the default dark-theme
   starter slides with a cleaner editorial contract. They showcase the real
   setup we scaffold today: theme tokens, ReactBits accents, and optional
   shadcn CLI expansion — not preinstalled official primitives.
   ═══════════════════════════════════════════════════════════════════════════ */

export function coverSlideJsxShadcn(title, subtitle, slug) {
  return `\
import { BottomBar, Slide } from '@deckio/deck-engine'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import BlurText from '@/components/ui/blur-text'
import ShinyText from '@/components/ui/shiny-text'
import styles from './CoverSlide.module.css'

export default function CoverSlide() {
  return (
    <Slide index={0} className={styles.cover}>
      <div className="content-frame content-gutter">
        <div className={styles.layout}>
          <div className={styles.main}>
            <div className={styles.overline}>
              <Badge variant="outline" className={styles.overlineBadge}>
                <ShinyText
                  text="${slug}"
                  speed={3}
                  color="currentColor"
                  shineColor="var(--accent)"
                  className={styles.overlineText}
                />
              </Badge>
            </div>

            <BlurText
              text="${title}"
              className={styles.title}
              delay={120}
              animateBy="words"
              direction="top"
              stepDuration={0.5}
            />

            <BlurText
              text="${subtitle}"
              className={styles.subtitle}
              delay={40}
              animateBy="words"
              direction="bottom"
              stepDuration={0.4}
            />
          </div>

          <div className={styles.aside}>
            <Card className={styles.metaCard}>
              <CardContent className={styles.metaContent}>
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Project</span>
                  <span className={styles.metaValue}>${title}</span>
                </div>
                <Separator />
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Date</span>
                  <span className={styles.metaValue}>${new Date().getFullYear()}</span>
                </div>
                <Separator />
                <div className={styles.metaRow}>
                  <span className={styles.metaLabel}>Stack</span>
                  <span className={styles.metaValue}>React + DECKIO</span>
                </div>
              </CardContent>
            </Card>
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
  background: color-mix(in oklch, var(--background) 85%, transparent);
  padding: 0 0 44px 0;
  overflow: hidden;
}

/* Two-column asymmetric layout */
.layout {
  position: relative;
  z-index: 10;
  display: grid;
  grid-template-columns: 1.4fr 1fr;
  gap: 64px;
  align-items: center;
  min-height: 0;
}

.main {
  display: flex;
  flex-direction: column;
}

/* Overline with Badge */
.overline {
  margin-bottom: 28px;
}

.overlineBadge {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 3px;
  text-transform: uppercase;
  padding: 4px 14px;
}

/* Title — large editorial type (BlurText renders a <p>) */
.title {
  font-size: clamp(44px, 5vw, 72px);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -2.5px;
  color: var(--foreground);
  margin-bottom: 24px;
}

/* Overline text — matches ShinyText inline span */
.overlineText {
  font-size: 13px;
  font-weight: 500;
  letter-spacing: 3px;
  text-transform: uppercase;
}

/* Subtitle */
.subtitle {
  font-size: clamp(16px, 1.6vw, 19px);
  font-weight: 400;
  color: var(--muted-foreground);
  line-height: 1.7;
  max-width: 480px;
}

/* Aside card — vertical metadata using real Card + Separator */
.aside {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.metaCard {
  min-width: 220px;
  animation: card-enter 0.7s ease both;
}

@keyframes card-enter {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.metaContent {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.metaRow {
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
`

export function featuresSlideJsxShadcn(slug) {
  return `\
import { BottomBar, Slide } from '@deckio/deck-engine'
import { Badge } from '@/components/ui/badge'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import SpotlightCard from '@/components/ui/spotlight-card'
import styles from './FeaturesSlide.module.css'

const features = [
  {
    icon: '🧩',
    title: 'shadcn Ready',
    badge: 'UI',
    desc: 'Real shadcn/ui components pre-installed — Button, Card, Badge, Separator, and Alert. Add more with the CLI.',
    code: 'npx shadcn@latest add dialog sheet tabs',
    delay: '0s',
  },
  {
    icon: '✨',
    title: 'ReactBits Animations',
    badge: 'Motion',
    desc: 'BlurText, SpotlightCard, DecryptedText — hover these cards to see the spotlight effect live.',
    code: '@react-bits/spotlight-card',
    delay: '0.12s',
  },
  {
    icon: '🎨',
    title: 'Theme System',
    badge: 'Design',
    desc: 'Choose light or dark appearance during scaffolding. Set once, consistent everywhere.',
    code: 'Appearance via ThemeProvider',
    delay: '0.24s',
  },
  {
    icon: '📦',
    title: 'Export Anywhere',
    badge: 'Build',
    desc: 'Export to PDF, capture screenshots, or deploy as a static site. Your slides, your way.',
    code: 'npm run build',
    delay: '0.36s',
  },
]

export default function FeaturesSlide() {
  return (
    <Slide index={1} className={styles.slide}>
      <div className="content-frame content-gutter">
        <div className={styles.content}>
          <div className={styles.header}>
            <Badge variant="outline" className={styles.eyebrow}>Capabilities</Badge>
            <h2 className={styles.title}>What You Can Build</h2>
            <p className={styles.lead}>
              Everything you need to create polished, interactive presentations.
            </p>
          </div>

          <div className={styles.grid}>
            {features.map((f, i) => (
              <SpotlightCard
                key={i}
                className={styles.spotCard}
                spotlightColor="color-mix(in srgb, var(--accent) 25%, transparent)"
                style={{ animationDelay: f.delay }}
              >
                <div className={styles.cardHeader}>
                  <span className={styles.cardIcon}>{f.icon}</span>
                  <h3 className={styles.cardTitle}>{f.title}</h3>
                  <Badge variant="secondary" className={styles.cardBadge}>{f.badge}</Badge>
                </div>
                <p className={styles.cardDesc}>{f.desc}</p>
                <code className={styles.cardCode}>{f.code}</code>
              </SpotlightCard>
            ))}
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
  background: color-mix(in oklch, var(--background) 85%, transparent);
  padding: 0 0 44px 0;
  overflow: hidden;
}

.content {
  position: relative;
  z-index: 10;
}

.header {
  margin-bottom: 48px;
}

.eyebrow {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.title {
  font-size: clamp(32px, 3.5vw, 48px);
  font-weight: 800;
  letter-spacing: -1.5px;
  color: var(--foreground);
  margin-bottom: 12px;
  line-height: 1.1;
}

.lead {
  font-size: 16px;
  color: var(--muted-foreground);
  line-height: 1.6;
  max-width: 420px;
}

/* 2-column card grid — better for projection readability */
.grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

/* SpotlightCard wrapper — override defaults for theme tokens */
.spotCard {
  background: var(--card) !important;
  border-color: var(--border) !important;
  border-radius: var(--radius) !important;
  padding: 28px !important;
  display: flex;
  flex-direction: column;
  gap: 14px;
  animation: card-in 0.5s ease both;
  transition: border-color 0.25s, box-shadow 0.25s;
}

@keyframes card-in {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cardHeader {
  display: flex;
  align-items: center;
  gap: 12px;
}

.cardIcon {
  font-size: 24px;
  line-height: 1;
}

.cardTitle {
  font-size: 17px;
  font-weight: 700;
  color: var(--foreground);
  letter-spacing: -0.3px;
}

.cardBadge {
  margin-left: auto;
}

.cardDesc {
  font-size: 14px;
  color: var(--muted-foreground);
  line-height: 1.6;
}

.cardCode {
  font-size: 12px;
  font-family: var(--font-mono, ui-monospace, monospace);
  color: var(--accent);
  background: var(--secondary);
  border: 1px solid var(--border);
  padding: 6px 12px;
  border-radius: calc(var(--radius) * 0.6);
  width: fit-content;
  margin-top: auto;
}
`

export function gettingStartedSlideJsxShadcn(slug) {
  return `\
import { BottomBar, Slide } from '@deckio/deck-engine'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'
import { Separator } from '@/components/ui/separator'
import { Lightbulb } from 'lucide-react'
import styles from './GettingStartedSlide.module.css'

export default function GettingStartedSlide() {
  return (
    <Slide index={2} className={styles.slide}>
      <div className="content-frame content-gutter">
        <div className={styles.content}>
          <div className={styles.header}>
            <Badge variant="outline" className={styles.eyebrow}>Workflow</Badge>
            <h2 className={styles.title}>Getting Started</h2>
          </div>

          <div className={styles.timeline}>
            <div className={styles.step} style={{ animationDelay: '0s' }}>
              <div className={styles.stepIndicator}>
                <Badge className={styles.stepBadge}>1</Badge>
                <Separator className={styles.stepLine} />
              </div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Inspect</h3>
                <div className={styles.codeBlock}>
                  <div className={styles.codeDots}>
                    <span /><span /><span />
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeDim}>$</span> cat components.json && ls src/components/ui
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.step} style={{ animationDelay: '0.15s' }}>
              <div className={styles.stepIndicator}>
                <Badge className={styles.stepBadge}>2</Badge>
                <Separator className={styles.stepLine} />
              </div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Expand</h3>
                <div className={styles.codeBlock}>
                  <div className={styles.codeDots}>
                    <span /><span /><span />
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeDim}>$</span> npx shadcn@latest add dialog sheet tabs
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.step} style={{ animationDelay: '0.3s' }}>
              <div className={styles.stepIndicator}>
                <Badge className={styles.stepBadge}>3</Badge>
              </div>
              <div className={styles.stepContent}>
                <h3 className={styles.stepTitle}>Compose</h3>
                <div className={styles.codeBlock}>
                  <div className={styles.codeDots}>
                    <span /><span /><span />
                  </div>
                  <div className={styles.codeLine}>
                    <span className={styles.codeKeyword}>import</span> {"{"} Button {"}"} <span className={styles.codeKeyword}>from</span> <span className={styles.codeString}>'@/components/ui/button'</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Alert className={styles.tip}>
            <Lightbulb />
            <AlertTitle>Pro tip</AlertTitle>
            <AlertDescription>
              Use the shadcn MCP server in VS Code for AI-assisted component expansion.
            </AlertDescription>
          </Alert>
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
  background: color-mix(in oklch, var(--background) 85%, transparent);
  padding: 0 0 44px 0;
  overflow: hidden;
}

.content {
  position: relative;
  z-index: 10;
}

.header {
  margin-bottom: 48px;
}

.eyebrow {
  font-size: 12px;
  font-weight: 500;
  letter-spacing: 2.5px;
  text-transform: uppercase;
  margin-bottom: 16px;
}

.title {
  font-size: clamp(32px, 3.5vw, 48px);
  font-weight: 800;
  letter-spacing: -1.5px;
  color: var(--foreground);
  line-height: 1.1;
}

/* Horizontal timeline layout */
.timeline {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 32px;
}

.step {
  display: flex;
  flex-direction: column;
  gap: 20px;
  animation: step-in 0.5s ease both;
}

@keyframes step-in {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stepIndicator {
  display: flex;
  align-items: center;
  gap: 12px;
}

.stepBadge {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  padding: 0;
}

.stepLine {
  flex: 1;
}

.stepContent {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.stepTitle {
  font-size: 18px;
  font-weight: 700;
  color: var(--foreground);
  letter-spacing: -0.2px;
}

/* Code editor block */
.codeBlock {
  font-family: var(--font-mono, ui-monospace, monospace);
  font-size: 13px;
  color: var(--foreground);
  background: var(--secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
}

.codeDots {
  display: flex;
  gap: 6px;
  padding: 10px 14px 0;
}
.codeDots span {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--border);
}

.codeLine {
  padding: 10px 14px 14px;
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

/* Pro-tip alert */
.tip {
  animation: step-in 0.5s ease 0.45s both;
}
`


export function thankYouSlideJsxShadcn(slug, slideIndex = 3) {
  return `\
import { BottomBar, Slide } from '@deckio/deck-engine'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import DecryptedText from '@/components/ui/decrypted-text'
import ShinyText from '@/components/ui/shiny-text'
import { Github, AtSign } from 'lucide-react'
import styles from './ThankYouSlide.module.css'

export default function ThankYouSlide() {
  return (
    <Slide index={${slideIndex}} className={styles.slide}>
      <div className="content-frame content-gutter">
        <div className={styles.content}>
          <Separator className={styles.accentDash} />
          <h2 className={styles.title}>
            <DecryptedText
              text="Thank You"
              animateOn="view"
              speed={60}
              maxIterations={20}
              sequential
              revealDirection="center"
              characters="ABCDEFGHIJKLMNOPQRSTUVWXYZ"
              className={styles.decryptedChar}
              encryptedClassName={styles.encryptedChar}
            />
          </h2>
          <p className={styles.subtitle}>
            <ShinyText
              text="Let's build something great — together."
              speed={4}
              color="var(--muted-foreground)"
              shineColor="var(--foreground)"
              className={styles.shinySubtitle}
            />
          </p>
          <div className={styles.links}>
            <Button variant="ghost" size="sm">
              <Github />
              github.com
            </Button>
            <Button variant="ghost" size="sm">
              <AtSign />
              yourhandle
            </Button>
          </div>
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

export function appJsx({ designSystem = 'none', appearance = 'dark' } = {}) {
  if (designSystem === 'shadcn') {
    const defaultTheme = appearance === 'light' ? 'light' : 'dark'
    return `\
import { useEffect } from 'react'
import { Navigation, SlideProvider } from '@deckio/deck-engine'
import { ThemeProvider } from './components/theme-provider'
import Aurora from '@/components/ui/aurora'
import project from '../deck.config.js'

export default function App() {
  const { accent, id, slides, theme, title } = project
  const auroraColors = project.aurora?.colors ?? ['#0ea5e9', '#6366f1', '#8b5cf6']

  useEffect(() => {
    document.documentElement.style.setProperty('--accent', accent)
    document.title = title
  }, [accent, title])

  return (
    <ThemeProvider defaultTheme="${defaultTheme}">
      <div style={{ position: 'relative', width: '100%', height: '100%' }}>
        <div style={{ position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none' }}>
          <Aurora colorStops={auroraColors} amplitude={1.0} blend={0.5} speed={0.6} />
        </div>
        <div style={{ position: 'relative', zIndex: 1, height: '100%' }}>
          <SlideProvider totalSlides={slides.length} project={id} slides={slides} theme={theme}>
            <Navigation />
            <div className="deck" data-project-id={id}>
              {slides.map((SlideComponent, index) => (
                <SlideComponent key={\`\${id}-slide-\${index}\`} index={index} project={project} />
              ))}
            </div>
          </SlideProvider>
        </div>
      </div>
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
  background: color-mix(in oklch, var(--background) 85%, transparent);
  padding: 0 0 44px 0;
  overflow: hidden;
}

.content {
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.accentDash {
  width: 40px;
  height: 3px !important;
  background: var(--accent);
  border-radius: 2px;
  margin-bottom: 32px;
  animation: dash-in 0.6s ease both;
}

@keyframes dash-in {
  from {
    opacity: 0;
    width: 0;
  }
  to {
    opacity: 1;
    width: 40px;
  }
}

.title {
  font-size: clamp(56px, 7vw, 96px);
  font-weight: 800;
  letter-spacing: -3px;
  line-height: 1.05;
  color: var(--foreground);
  margin-bottom: 20px;
}

.subtitle {
  font-size: clamp(16px, 1.8vw, 20px);
  font-weight: 400;
  color: var(--muted-foreground);
  letter-spacing: 0.3px;
  line-height: 1.6;
  margin-bottom: 36px;
}

.shinySubtitle {
  font-size: clamp(16px, 1.8vw, 20px);
  font-weight: 400;
  letter-spacing: 0.3px;
  line-height: 1.6;
}

/* DecryptedText character styles */
.decryptedChar {
  color: var(--foreground);
}

.encryptedChar {
  color: var(--accent);
  opacity: 0.7;
}

.links {
  display: flex;
  align-items: center;
  gap: 8px;
  animation: links-in 0.7s ease both 0.3s;
}

@keyframes links-in {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
`
