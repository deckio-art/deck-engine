/**
 * Phase 1 Anticipatory Tests — Real shadcn/ui Components in Scaffolded Decks
 *
 * Issue: #13 — shadcn Phase 1: Ship real shadcn/ui + ReactBits components
 *
 * These tests validate the Phase 1 contract:
 *   - Real shadcn/ui components (button, card, badge, separator, alert)
 *     are pre-scaffolded in generated `src/components/ui/`
 *   - Component files follow shadcn patterns (forwardRef, cn(), cva)
 *   - Non-shadcn decks remain completely unaffected
 *   - package.json includes necessary dependencies
 *   - Full scaffold structure is correct end-to-end
 *
 * Written BEFORE implementation — tests WILL FAIL until Basher lands the changes.
 * That's correct TDD.
 */
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { mkdirSync, rmSync, existsSync, readFileSync, readdirSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { execSync } from 'child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkgRoot = join(__dirname, '..')
const fixturesDir = join(__dirname, 'fixtures-phase1')

// The five shadcn/ui primitives Phase 1 must pre-scaffold
const SHADCN_COMPONENTS = ['button', 'card', 'badge', 'separator', 'alert']

// ReactBits components that already exist (should persist after Phase 1)
const REACTBITS_COMPONENTS = ['aurora', 'blur-text', 'shiny-text', 'spotlight-card', 'decrypted-text']

/* ═══════════════════════════════════════════════════════════════════════════
   1. Scaffolder Template Files Exist
   ═══════════════════════════════════════════════════════════════════════════ */

describe('shadcn component templates exist in scaffolder', () => {
  const templatesDir = join(pkgRoot, 'templates', 'shadcn-ui')

  for (const name of SHADCN_COMPONENTS) {
    it(`templates/shadcn-ui/${name}.jsx exists`, () => {
      expect(existsSync(join(templatesDir, `${name}.jsx`))).toBe(true)
    })

    it(`templates/shadcn-ui/${name}.jsx is non-empty`, () => {
      const content = readFileSync(join(templatesDir, `${name}.jsx`), 'utf-8')
      expect(content.trim().length).toBeGreaterThan(0)
    })
  }

  it('ReactBits templates still exist in templates/react-bits/', () => {
    const reactBitsDir = join(pkgRoot, 'templates', 'react-bits')
    for (const name of REACTBITS_COMPONENTS) {
      const file = name === 'aurora' ? 'aurora.jsx' : `${name}.jsx`
      expect(existsSync(join(reactBitsDir, file))).toBe(true)
    }
  })
})

/* ═══════════════════════════════════════════════════════════════════════════
   2. Component File Integrity — shadcn patterns
   ═══════════════════════════════════════════════════════════════════════════ */

describe('shadcn component file integrity', () => {
  const templatesDir = join(pkgRoot, 'templates', 'shadcn-ui')

  describe('button.jsx', () => {
    let content

    beforeAll(() => {
      content = readFileSync(join(templatesDir, 'button.jsx'), 'utf-8')
    })

    it('imports cn utility from @/lib/utils', () => {
      expect(content).toMatch(/from\s+['"]@\/lib\/utils['"]/)
      expect(content).toMatch(/\bcn\b/)
    })

    it('imports React (or uses React via JSX transform)', () => {
      // shadcn components typically import React for forwardRef
      expect(content).toMatch(/import\s+.*React|import.*forwardRef|React\.forwardRef|forwardRef/)
    })

    it('imports cva (class-variance-authority) for variants', () => {
      expect(content).toContain('cva')
      expect(content).toMatch(/from\s+['"]class-variance-authority['"]/)
    })

    it('exports Button component', () => {
      expect(content).toMatch(/export\s+(?:const|function)\s+Button\b|export\s*\{[^}]*\bButton\b[^}]*\}|export\s+default/)
    })

    it('uses function component pattern (shadcn v4)', () => {
      expect(content).toMatch(/function\s+Button\b/)
    })

    it('uses cn() for className composition', () => {
      expect(content).toMatch(/cn\(/)
    })

    it('defines variant options (default, destructive, outline, secondary, ghost, link)', () => {
      expect(content).toContain('default')
      expect(content).toContain('destructive')
      expect(content).toContain('outline')
    })

    it('defines size options (default, sm, lg, icon)', () => {
      expect(content).toContain('sm')
      expect(content).toContain('lg')
    })
  })

  describe('card.jsx', () => {
    let content

    beforeAll(() => {
      content = readFileSync(join(templatesDir, 'card.jsx'), 'utf-8')
    })

    it('imports cn utility', () => {
      expect(content).toMatch(/\bcn\b/)
    })

    it('exports Card component', () => {
      expect(content).toMatch(/export\s+(?:const|function)\s+Card\b|export\s*\{[^}]*\bCard\b[^}]*\}/)
    })

    it('exports CardHeader', () => {
      expect(content).toMatch(/CardHeader/)
    })

    it('exports CardTitle', () => {
      expect(content).toMatch(/CardTitle/)
    })

    it('exports CardDescription', () => {
      expect(content).toMatch(/CardDescription/)
    })

    it('exports CardContent', () => {
      expect(content).toMatch(/CardContent/)
    })

    it('exports CardFooter', () => {
      expect(content).toMatch(/CardFooter/)
    })

    it('uses function component pattern (shadcn v4)', () => {
      expect(content).toMatch(/function\s+Card\b/)
    })
  })

  describe('badge.jsx', () => {
    let content

    beforeAll(() => {
      content = readFileSync(join(templatesDir, 'badge.jsx'), 'utf-8')
    })

    it('imports cn and cva', () => {
      expect(content).toMatch(/\bcn\b/)
      expect(content).toContain('cva')
    })

    it('exports Badge component', () => {
      expect(content).toMatch(/Badge/)
    })

    it('defines variant options (default, secondary, destructive, outline)', () => {
      expect(content).toContain('default')
      expect(content).toContain('secondary')
      expect(content).toContain('destructive')
      expect(content).toContain('outline')
    })
  })

  describe('separator.jsx', () => {
    let content

    beforeAll(() => {
      content = readFileSync(join(templatesDir, 'separator.jsx'), 'utf-8')
    })

    it('imports cn utility', () => {
      expect(content).toMatch(/\bcn\b/)
    })

    it('exports Separator component', () => {
      expect(content).toMatch(/Separator/)
    })

    it('supports horizontal and vertical orientation', () => {
      expect(content).toContain('horizontal')
      expect(content).toContain('vertical')
    })
  })

  describe('alert.jsx', () => {
    let content

    beforeAll(() => {
      content = readFileSync(join(templatesDir, 'alert.jsx'), 'utf-8')
    })

    it('imports cn and cva', () => {
      expect(content).toMatch(/\bcn\b/)
      expect(content).toContain('cva')
    })

    it('exports Alert component', () => {
      expect(content).toMatch(/Alert\b/)
    })

    it('exports AlertTitle', () => {
      expect(content).toMatch(/AlertTitle/)
    })

    it('exports AlertDescription', () => {
      expect(content).toMatch(/AlertDescription/)
    })

    it('defines variant options (default, destructive)', () => {
      expect(content).toContain('default')
      expect(content).toContain('destructive')
    })
  })

  describe('all components use consistent import paths', () => {
    for (const name of SHADCN_COMPONENTS) {
      it(`${name}.jsx imports cn from @/lib/utils`, () => {
        const content = readFileSync(join(templatesDir, `${name}.jsx`), 'utf-8')
        expect(content).toMatch(/@\/lib\/utils/)
      })
    }
  })
})

/* ═══════════════════════════════════════════════════════════════════════════
   3. packageJson includes lucide-react for shadcn components
   ═══════════════════════════════════════════════════════════════════════════ */

describe('packageJson shadcn dependencies for Phase 1', () => {
  let pkg

  beforeAll(async () => {
    const { packageJson } = await import(join(pkgRoot, 'utils.mjs'))
    pkg = JSON.parse(packageJson('test', undefined, { designSystem: 'shadcn' }))
  })

  it('includes lucide-react for shadcn icon support', () => {
    expect(pkg.dependencies).toHaveProperty('lucide-react')
  })

  it('still includes class-variance-authority', () => {
    expect(pkg.dependencies).toHaveProperty('class-variance-authority')
  })

  it('still includes clsx', () => {
    expect(pkg.dependencies).toHaveProperty('clsx')
  })

  it('still includes tailwind-merge', () => {
    expect(pkg.dependencies).toHaveProperty('tailwind-merge')
  })

  it('does NOT include lucide-react when designSystem is none', async () => {
    const { packageJson } = await import(join(pkgRoot, 'utils.mjs'))
    const nonShadcn = JSON.parse(packageJson('test', undefined, { designSystem: 'none' }))
    expect(nonShadcn.dependencies).not.toHaveProperty('lucide-react')
  })
})

/* ═══════════════════════════════════════════════════════════════════════════
   4. Non-shadcn Decks Unaffected
   ═══════════════════════════════════════════════════════════════════════════ */

describe('non-shadcn decks unaffected by Phase 1', () => {
  it('packageJson for dark theme has no shadcn deps', async () => {
    const { packageJson } = await import(join(pkgRoot, 'utils.mjs'))
    const pkg = JSON.parse(packageJson('dark-deck'))
    expect(pkg.dependencies).not.toHaveProperty('class-variance-authority')
    expect(pkg.dependencies).not.toHaveProperty('clsx')
    expect(pkg.dependencies).not.toHaveProperty('tailwind-merge')
    expect(pkg.dependencies).not.toHaveProperty('lucide-react')
    expect(pkg.dependencies).not.toHaveProperty('ogl')
    expect(pkg.dependencies).not.toHaveProperty('motion')
  })

  it('deckConfig for dark theme has no designSystem field', async () => {
    const { deckConfig } = await import(join(pkgRoot, 'utils.mjs'))
    const config = deckConfig('dark-deck', 'Title', 'Sub', '🌙', '#fff', 'dark', 'none')
    expect(config).not.toContain('designSystem')
  })

  it('deckConfig for light theme has no designSystem field', async () => {
    const { deckConfig } = await import(join(pkgRoot, 'utils.mjs'))
    const config = deckConfig('light-deck', 'Title', 'Sub', '☀️', '#000', 'light', 'none')
    expect(config).not.toContain('designSystem')
  })

  it('deckConfig for dark theme only imports 2 slides (not 4)', async () => {
    const { deckConfig } = await import(join(pkgRoot, 'utils.mjs'))
    const config = deckConfig('s', 'T', 'S', '📦', '#000', 'dark', 'none')
    expect(config).not.toContain('FeaturesSlide')
    expect(config).not.toContain('GettingStartedSlide')
    expect(config).toContain('CoverSlide')
    expect(config).toContain('ThankYouSlide')
  })

  it('viteConfig for none designSystem omits @ alias', async () => {
    const { viteConfig } = await import(join(pkgRoot, 'utils.mjs'))
    const config = viteConfig({ designSystem: 'none' })
    expect(config).not.toContain('resolve:')
    expect(config).not.toContain("'@':")
  })

  it('componentsJson is NOT called for non-shadcn decks (contract check)', async () => {
    // This is a contract test: we verify the function still outputs shadcn-specific JSON
    // so it would be wrong to include it in a non-shadcn deck
    const { componentsJson } = await import(join(pkgRoot, 'utils.mjs'))
    const json = JSON.parse(componentsJson())
    expect(json.$schema).toContain('shadcn')
  })
})

/* ═══════════════════════════════════════════════════════════════════════════
   5. Scaffolder Copies shadcn Components to Output
   
   Phase 1 means: when designSystem === 'shadcn', the scaffolder must
   copy button.jsx, card.jsx, badge.jsx, separator.jsx, alert.jsx
   into src/components/ui/ alongside the existing ReactBits components.
   
   We test this through the utils.mjs contract functions. The actual
   file-writing logic lives in index.mjs (tested via E2E).
   ═══════════════════════════════════════════════════════════════════════════ */

describe('scaffolder shadcn component output contract', () => {
  it('templates/shadcn-ui/ directory exists', () => {
    expect(existsSync(join(pkgRoot, 'templates', 'shadcn-ui'))).toBe(true)
  })

  it('contains exactly the 5 expected component files', () => {
    const dir = join(pkgRoot, 'templates', 'shadcn-ui')
    const files = readdirSync(dir).filter(f => f.endsWith('.jsx')).sort()
    expect(files).toEqual(
      SHADCN_COMPONENTS.map(c => `${c}.jsx`).sort()
    )
  })

  it('ReactBits components remain in templates/react-bits/', () => {
    const dir = join(pkgRoot, 'templates', 'react-bits')
    const files = readdirSync(dir).filter(f => f.endsWith('.jsx'))
    expect(files.length).toBeGreaterThanOrEqual(5)
    expect(files).toContain('blur-text.jsx')
    expect(files).toContain('spotlight-card.jsx')
    expect(files).toContain('aurora.jsx')
  })
})

/* ═══════════════════════════════════════════════════════════════════════════
   6. Updated Starter Slides Use Real Components
   
   Phase 1 starter slides should actually import and use the pre-scaffolded
   shadcn components (Button, Card, Badge, etc.) instead of only CSS-module
   bespoke styling.
   ═══════════════════════════════════════════════════════════════════════════ */

describe('starter slides use real shadcn components', () => {
  let coverSlide, featuresSlide, gettingStartedSlide, thankYouSlide

  beforeAll(async () => {
    const utils = await import(join(pkgRoot, 'utils.mjs'))
    coverSlide = utils.coverSlideJsxShadcn('Test Talk', 'A subtitle', 'test-talk')
    featuresSlide = utils.featuresSlideJsxShadcn('test-talk')
    gettingStartedSlide = utils.gettingStartedSlideJsxShadcn('test-talk')
    thankYouSlide = utils.thankYouSlideJsxShadcn('test-talk')
  })

  it('at least one starter slide imports from @/components/ui/button', () => {
    const allSlides = [coverSlide, featuresSlide, gettingStartedSlide, thankYouSlide]
    const anyImportsButton = allSlides.some(s => s.includes("@/components/ui/button"))
    expect(anyImportsButton).toBe(true)
  })

  it('at least one starter slide imports from @/components/ui/card', () => {
    const allSlides = [coverSlide, featuresSlide, gettingStartedSlide, thankYouSlide]
    const anyImportsCard = allSlides.some(s => s.includes("@/components/ui/card"))
    expect(anyImportsCard).toBe(true)
  })

  it('at least one starter slide imports from @/components/ui/badge', () => {
    const allSlides = [coverSlide, featuresSlide, gettingStartedSlide, thankYouSlide]
    const anyImportsBadge = allSlides.some(s => s.includes("@/components/ui/badge"))
    expect(anyImportsBadge).toBe(true)
  })

  it('starter slides still import ReactBits components', () => {
    const allSlides = [coverSlide, featuresSlide, gettingStartedSlide, thankYouSlide]
    const allText = allSlides.join('\n')
    // ReactBits components should still be present
    expect(allText).toContain('@/components/ui/blur-text')
  })

  it('starter slides still import from @deckio/deck-engine', () => {
    const allSlides = [coverSlide, featuresSlide, gettingStartedSlide, thankYouSlide]
    const allText = allSlides.join('\n')
    expect(allText).toContain('@deckio/deck-engine')
  })
})

/* ═══════════════════════════════════════════════════════════════════════════
   7. components.json Updated for Phase 1
   
   Verify the generated components.json still works for `npx shadcn add`
   after pre-scaffolding components.
   ═══════════════════════════════════════════════════════════════════════════ */

describe('components.json compatibility with pre-scaffolded components', () => {
  let json

  beforeAll(async () => {
    const { componentsJson } = await import(join(pkgRoot, 'utils.mjs'))
    json = JSON.parse(componentsJson())
  })

  it('aliases.ui points to @/components/ui where pre-scaffolded files live', () => {
    expect(json.aliases.ui).toBe('@/components/ui')
  })

  it('aliases.utils points to @/lib/utils where cn() lives', () => {
    expect(json.aliases.utils).toBe('@/lib/utils')
  })

  it('tsx is false (JSX project, components must be .jsx)', () => {
    expect(json.tsx).toBe(false)
  })

  it('rsc is false (no React Server Components)', () => {
    expect(json.rsc).toBe(false)
  })

  it('style is new-york', () => {
    expect(json.style).toBe('new-york')
  })

  it('ReactBits registry still configured for expansion', () => {
    expect(json.registries['@react-bits']).toBe('https://reactbits.dev/r/{name}.json')
  })
})

/* ═══════════════════════════════════════════════════════════════════════════
   8. Edge Cases
   ═══════════════════════════════════════════════════════════════════════════ */

describe('edge cases', () => {
  it('componentsJson is deterministic (no random values)', async () => {
    const { componentsJson } = await import(join(pkgRoot, 'utils.mjs'))
    const a = componentsJson()
    const b = componentsJson()
    expect(a).toBe(b)
  })

  it('cnUtility generates valid JS that imports the right packages', async () => {
    const { cnUtility } = await import(join(pkgRoot, 'utils.mjs'))
    const code = cnUtility()
    expect(code).toContain('import { clsx } from "clsx"')
    expect(code).toContain('import { twMerge } from "tailwind-merge"')
    expect(code).toContain('export function cn(')
  })

  it('packageJson shadcn deps have pinned minor versions (not latest)', async () => {
    const { packageJson } = await import(join(pkgRoot, 'utils.mjs'))
    const pkg = JSON.parse(packageJson('test', undefined, { designSystem: 'shadcn' }))
    const shadcnDeps = ['class-variance-authority', 'clsx', 'tailwind-merge']
    for (const dep of shadcnDeps) {
      const version = pkg.dependencies[dep]
      expect(version).toMatch(/^\^?\d/)
    }
  })

  it('shadcn component templates use .jsx extension (not .tsx)', () => {
    const templatesDir = join(pkgRoot, 'templates', 'shadcn-ui')
    if (existsSync(templatesDir)) {
      const files = readdirSync(templatesDir)
      const tsxFiles = files.filter(f => f.endsWith('.tsx'))
      expect(tsxFiles).toEqual([])
    }
  })

  it('shadcn component templates do NOT import from React namespace (JSX transform)', () => {
    // With the new JSX transform, components should not need `import React from "react"`
    // They may import specific hooks/utilities like forwardRef
    const templatesDir = join(pkgRoot, 'templates', 'shadcn-ui')
    if (existsSync(templatesDir)) {
      for (const name of SHADCN_COMPONENTS) {
        const file = join(templatesDir, `${name}.jsx`)
        if (existsSync(file)) {
          const content = readFileSync(file, 'utf-8')
          // Should not have `import React from 'react'` — the JSX transform handles it
          // BUT importing { forwardRef } from 'react' is fine
          expect(content).not.toMatch(/import\s+React\s+from\s+['"]react['"]/)
        }
      }
    }
  })

  it('deckConfig with designSystem shadcn + theme dark is valid combination', async () => {
    const { deckConfig } = await import(join(pkgRoot, 'utils.mjs'))
    const config = deckConfig('test', 'Test', 'Sub', '🎯', '#fff', 'dark', 'shadcn')
    expect(config).toContain("designSystem: 'shadcn'")
    expect(config).toContain("theme: 'dark'")
  })

  it('deckConfig with designSystem shadcn + theme light is valid combination', async () => {
    const { deckConfig } = await import(join(pkgRoot, 'utils.mjs'))
    const config = deckConfig('test', 'Test', 'Sub', '🎯', '#fff', 'light', 'shadcn')
    expect(config).toContain("designSystem: 'shadcn'")
    expect(config).toContain("theme: 'light'")
  })
})

/* ═══════════════════════════════════════════════════════════════════════════
   9. E2E Scaffold Structure Verification
   
   Simulate what the scaffolder writes when designSystem is shadcn,
   and verify the full output structure is correct. This tests the
   integration of ALL the utility functions together.
   ═══════════════════════════════════════════════════════════════════════════ */

describe('E2E scaffold structure for shadcn designSystem', () => {
  const projectDir = join(fixturesDir, 'shadcn-e2e')

  beforeAll(async () => {
    // Clean up any prior run
    rmSync(fixturesDir, { recursive: true, force: true })
    mkdirSync(projectDir, { recursive: true })

    const utils = await import(join(pkgRoot, 'utils.mjs'))

    // Simulate what index.mjs does for a shadcn project
    const { writeFileSync, copyFileSync } = await import('fs')

    const slug = 'test-shadcn'
    const title = 'Test Shadcn'
    const subtitle = 'A test deck'
    const icon = '🎨'
    const accent = '#6366f1'
    const theme = 'shadcn'
    const designSystem = 'shadcn'
    const appearance = 'dark'
    const aurora = { palette: 'ocean', colors: ['#0ea5e9', '#6366f1', '#8b5cf6'] }

    // Helper to write a file, creating parent dirs as needed
    function write(dir, relPath, content) {
      const full = join(dir, relPath)
      mkdirSync(dirname(full), { recursive: true })
      writeFileSync(full, content)
    }

    // Write core files
    write(projectDir, 'package.json', utils.packageJson(slug, 'file:../../deck-engine', { designSystem }))
    write(projectDir, 'vite.config.js', utils.viteConfig({ designSystem }))
    write(projectDir, 'src/index.css', utils.indexCss(theme))
    write(projectDir, 'src/main.jsx', utils.mainJsx(theme))
    write(projectDir, 'src/App.jsx', utils.appJsx({ designSystem, appearance }))
    write(projectDir, 'deck.config.js', utils.deckConfig(slug, title, subtitle, icon, accent, theme, designSystem, aurora, appearance))

    // shadcn slides
    write(projectDir, 'src/slides/CoverSlide.jsx', utils.coverSlideJsxShadcn(title, subtitle, slug))
    write(projectDir, 'src/slides/CoverSlide.module.css', utils.COVER_SLIDE_CSS_SHADCN)
    write(projectDir, 'src/slides/FeaturesSlide.jsx', utils.featuresSlideJsxShadcn(slug))
    write(projectDir, 'src/slides/FeaturesSlide.module.css', utils.FEATURES_SLIDE_CSS_SHADCN)
    write(projectDir, 'src/slides/GettingStartedSlide.jsx', utils.gettingStartedSlideJsxShadcn(slug))
    write(projectDir, 'src/slides/GettingStartedSlide.module.css', utils.GETTING_STARTED_SLIDE_CSS_SHADCN)
    write(projectDir, 'src/slides/ThankYouSlide.jsx', utils.thankYouSlideJsxShadcn(slug))
    write(projectDir, 'src/slides/ThankYouSlide.module.css', utils.THANK_YOU_SLIDE_CSS_SHADCN)

    // shadcn infrastructure
    write(projectDir, 'components.json', utils.componentsJson())
    write(projectDir, 'src/lib/utils.js', utils.cnUtility())
    write(projectDir, 'jsconfig.json', utils.jsConfig())
    write(projectDir, 'src/components/theme-provider.jsx', utils.themeProviderJsx())
    write(projectDir, '.vscode/mcp.json', utils.vscodeMcpConfig())

    // Copy ReactBits templates
    const reactBitsDir = join(pkgRoot, 'templates', 'react-bits')
    const uiDir = join(projectDir, 'src', 'components', 'ui')
    mkdirSync(uiDir, { recursive: true })
    for (const file of ['aurora.jsx', 'aurora.css', 'blur-text.jsx', 'shiny-text.jsx', 'spotlight-card.jsx', 'decrypted-text.jsx']) {
      if (existsSync(join(reactBitsDir, file))) {
        copyFileSync(join(reactBitsDir, file), join(uiDir, file))
      }
    }

    // Copy shadcn component templates (Phase 1 addition)
    const shadcnTemplatesDir = join(pkgRoot, 'templates', 'shadcn-ui')
    if (existsSync(shadcnTemplatesDir)) {
      for (const name of SHADCN_COMPONENTS) {
        const src = join(shadcnTemplatesDir, `${name}.jsx`)
        if (existsSync(src)) {
          copyFileSync(src, join(uiDir, `${name}.jsx`))
        }
      }
    }
  })

  afterAll(() => {
    rmSync(fixturesDir, { recursive: true, force: true })
  })

  // Core project files
  it('has package.json', () => {
    expect(existsSync(join(projectDir, 'package.json'))).toBe(true)
  })

  it('has vite.config.js with @ alias', () => {
    const content = readFileSync(join(projectDir, 'vite.config.js'), 'utf-8')
    expect(content).toContain("'@': path.resolve(__dirname, 'src')")
  })

  it('has deck.config.js with shadcn designSystem', () => {
    const content = readFileSync(join(projectDir, 'deck.config.js'), 'utf-8')
    expect(content).toContain("designSystem: 'shadcn'")
  })

  it('has components.json', () => {
    expect(existsSync(join(projectDir, 'components.json'))).toBe(true)
    const json = JSON.parse(readFileSync(join(projectDir, 'components.json'), 'utf-8'))
    expect(json.$schema).toContain('shadcn')
  })

  it('has jsconfig.json with @/* path mapping', () => {
    expect(existsSync(join(projectDir, 'jsconfig.json'))).toBe(true)
    const json = JSON.parse(readFileSync(join(projectDir, 'jsconfig.json'), 'utf-8'))
    expect(json.compilerOptions.paths['@/*']).toEqual(['./src/*'])
  })

  it('has src/lib/utils.js with cn()', () => {
    expect(existsSync(join(projectDir, 'src', 'lib', 'utils.js'))).toBe(true)
    const content = readFileSync(join(projectDir, 'src', 'lib', 'utils.js'), 'utf-8')
    expect(content).toContain('export function cn(')
  })

  // Four slides
  it('has all 4 starter slides', () => {
    for (const slide of ['CoverSlide', 'FeaturesSlide', 'GettingStartedSlide', 'ThankYouSlide']) {
      expect(existsSync(join(projectDir, 'src', 'slides', `${slide}.jsx`))).toBe(true)
      expect(existsSync(join(projectDir, 'src', 'slides', `${slide}.module.css`))).toBe(true)
    }
  })

  // ReactBits components
  it('has ReactBits components in src/components/ui/', () => {
    for (const comp of ['aurora.jsx', 'blur-text.jsx', 'shiny-text.jsx', 'spotlight-card.jsx', 'decrypted-text.jsx']) {
      expect(existsSync(join(projectDir, 'src', 'components', 'ui', comp))).toBe(true)
    }
  })

  // Phase 1: shadcn components
  for (const name of SHADCN_COMPONENTS) {
    it(`has shadcn ${name}.jsx in src/components/ui/`, () => {
      expect(existsSync(join(projectDir, 'src', 'components', 'ui', `${name}.jsx`))).toBe(true)
    })
  }

  // Theme provider
  it('has theme-provider.jsx', () => {
    expect(existsSync(join(projectDir, 'src', 'components', 'theme-provider.jsx'))).toBe(true)
  })

  // VS Code MCP config
  it('has .vscode/mcp.json', () => {
    expect(existsSync(join(projectDir, '.vscode', 'mcp.json'))).toBe(true)
  })

  // Package.json structure
  it('package.json has all required shadcn dependencies', () => {
    const pkg = JSON.parse(readFileSync(join(projectDir, 'package.json'), 'utf-8'))
    expect(pkg.dependencies).toHaveProperty('class-variance-authority')
    expect(pkg.dependencies).toHaveProperty('clsx')
    expect(pkg.dependencies).toHaveProperty('tailwind-merge')
    expect(pkg.dependencies).toHaveProperty('motion')
    expect(pkg.dependencies).toHaveProperty('ogl')
  })

  it('package.json has lucide-react for shadcn component icons', () => {
    const pkg = JSON.parse(readFileSync(join(projectDir, 'package.json'), 'utf-8'))
    expect(pkg.dependencies).toHaveProperty('lucide-react')
  })
})

/* ═══════════════════════════════════════════════════════════════════════════
   10. Non-shadcn E2E Scaffold — Regression Guard
   ═══════════════════════════════════════════════════════════════════════════ */

describe('E2E scaffold structure for dark theme (non-shadcn) — regression guard', () => {
  const projectDir = join(fixturesDir, 'dark-e2e')

  beforeAll(async () => {
    mkdirSync(projectDir, { recursive: true })

    const utils = await import(join(pkgRoot, 'utils.mjs'))
    const { writeFileSync } = await import('fs')

    function write(dir, relPath, content) {
      const full = join(dir, relPath)
      mkdirSync(dirname(full), { recursive: true })
      writeFileSync(full, content)
    }

    write(projectDir, 'package.json', utils.packageJson('dark-deck', 'file:../../deck-engine'))
    write(projectDir, 'vite.config.js', utils.viteConfig({ designSystem: 'none' }))
    write(projectDir, 'src/index.css', utils.indexCss('dark'))
    write(projectDir, 'src/main.jsx', utils.mainJsx('dark'))
    write(projectDir, 'src/App.jsx', utils.appJsx({ designSystem: 'none' }))
    write(projectDir, 'deck.config.js', utils.deckConfig('dark-deck', 'Dark Deck', 'Subtitle', '🌙', '#fff', 'dark', 'none'))
  })

  afterAll(() => {
    rmSync(fixturesDir, { recursive: true, force: true })
  })

  it('does NOT have components.json', () => {
    expect(existsSync(join(projectDir, 'components.json'))).toBe(false)
  })

  it('does NOT have jsconfig.json', () => {
    expect(existsSync(join(projectDir, 'jsconfig.json'))).toBe(false)
  })

  it('does NOT have src/components/ui/ directory', () => {
    expect(existsSync(join(projectDir, 'src', 'components', 'ui'))).toBe(false)
  })

  it('does NOT have src/lib/utils.js', () => {
    expect(existsSync(join(projectDir, 'src', 'lib', 'utils.js'))).toBe(false)
  })

  it('does NOT have theme-provider.jsx', () => {
    expect(existsSync(join(projectDir, 'src', 'components', 'theme-provider.jsx'))).toBe(false)
  })

  it('does NOT have .vscode/mcp.json', () => {
    expect(existsSync(join(projectDir, '.vscode', 'mcp.json'))).toBe(false)
  })

  it('vite.config.js has no @ alias', () => {
    const content = readFileSync(join(projectDir, 'vite.config.js'), 'utf-8')
    expect(content).not.toContain('resolve:')
    expect(content).not.toContain("'@':")
  })

  it('deck.config.js has no designSystem field', () => {
    const content = readFileSync(join(projectDir, 'deck.config.js'), 'utf-8')
    expect(content).not.toContain('designSystem')
  })

  it('package.json has no shadcn deps', () => {
    const pkg = JSON.parse(readFileSync(join(projectDir, 'package.json'), 'utf-8'))
    expect(pkg.dependencies).not.toHaveProperty('class-variance-authority')
    expect(pkg.dependencies).not.toHaveProperty('clsx')
    expect(pkg.dependencies).not.toHaveProperty('tailwind-merge')
    expect(pkg.dependencies).not.toHaveProperty('lucide-react')
    expect(pkg.dependencies).not.toHaveProperty('motion')
    expect(pkg.dependencies).not.toHaveProperty('ogl')
  })
})
