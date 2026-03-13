import { describe, it, expect } from 'vitest'
import { existsSync, readFileSync, statSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'
import { resolveTheme, getAvailableThemes, DEFAULT_THEME, BUILTIN_THEMES } from '../themes/theme-loader.js'

const __dirname = dirname(fileURLToPath(import.meta.url))
const themesDir = join(__dirname, '..', 'themes')

describe('theme-loader', () => {
  describe('resolveTheme', () => {
    it('defaults to dark theme when called with no args', () => {
      const path = resolveTheme()
      expect(path).toContain('dark.css')
      expect(existsSync(path)).toBe(true)
    })

    it('defaults to dark theme for null/undefined', () => {
      expect(resolveTheme(null)).toContain('dark.css')
      expect(resolveTheme(undefined)).toContain('dark.css')
    })

    it('defaults to dark theme for empty string', () => {
      const path = resolveTheme('')
      expect(path).toContain('dark.css')
      expect(existsSync(path)).toBe(true)
    })

    it('resolves "dark" to an existing CSS path', () => {
      const path = resolveTheme('dark')
      expect(path).toContain('dark.css')
      expect(existsSync(path)).toBe(true)
    })

    it('resolves "light" to an existing CSS path', () => {
      const path = resolveTheme('light')
      expect(path).toContain('light.css')
      expect(existsSync(path)).toBe(true)
    })

    it('resolves "shadcn" to an existing CSS path', () => {
      const path = resolveTheme('shadcn')
      expect(path).toContain('shadcn.css')
      expect(existsSync(path)).toBe(true)
    })

    it('resolves built-in theme names to CSS files', () => {
      for (const name of BUILTIN_THEMES) {
        const path = resolveTheme(name)
        expect(path).toContain(`${name}.css`)
        expect(existsSync(path)).toBe(true)
      }
    })

    it('unknown theme returns a path (no runtime validation)', () => {
      const path = resolveTheme('nonexistent')
      expect(path).toContain('nonexistent.css')
      // The file won't exist — theme-loader doesn't validate existence
      expect(existsSync(path)).toBe(false)
    })

    it('treats .css extension as custom path', () => {
      const path = resolveTheme('/custom/my-theme.css')
      expect(path).toBe('/custom/my-theme.css')
    })

    it('resolves relative .css path from cwd', () => {
      const path = resolveTheme('./my-local-theme.css')
      expect(path).toContain('my-local-theme.css')
      // Should be absolute after resolve()
      expect(path).toMatch(/^\//)
    })
  })

  describe('getAvailableThemes', () => {
    it('returns an array of theme names', () => {
      const themes = getAvailableThemes()
      expect(Array.isArray(themes)).toBe(true)
      expect(themes.length).toBeGreaterThanOrEqual(3)
    })

    it('includes all built-in themes', () => {
      const themes = getAvailableThemes()
      for (const name of BUILTIN_THEMES) {
        expect(themes).toContain(name)
      }
    })

    it('does not include file extensions', () => {
      const themes = getAvailableThemes()
      for (const name of themes) {
        expect(name).not.toContain('.css')
      }
    })

    it('does not include non-CSS files like theme-loader.js', () => {
      const themes = getAvailableThemes()
      expect(themes).not.toContain('theme-loader')
    })
  })

  describe('constants', () => {
    it('DEFAULT_THEME is dark', () => {
      expect(DEFAULT_THEME).toBe('dark')
    })

    it('BUILTIN_THEMES contains dark, light, shadcn', () => {
      expect(BUILTIN_THEMES).toEqual(['dark', 'light', 'shadcn'])
    })
  })
})

describe('theme CSS file structure', () => {
  const REQUIRED_TOKENS = ['--background', '--foreground', '--primary']

  for (const theme of BUILTIN_THEMES) {
    describe(`${theme}.css`, () => {
      const filePath = join(themesDir, `${theme}.css`)

      it('file exists', () => {
        expect(existsSync(filePath)).toBe(true)
      })

      it('file is non-empty', () => {
        const stat = statSync(filePath)
        expect(stat.size).toBeGreaterThan(0)
      })

      it('contains a :root block', () => {
        const content = readFileSync(filePath, 'utf-8')
        expect(content).toContain(':root')
      })

      it('imports tailwindcss', () => {
        const content = readFileSync(filePath, 'utf-8')
        expect(content).toContain('@import "tailwindcss"')
      })

      it('contains @theme inline bridge', () => {
        const content = readFileSync(filePath, 'utf-8')
        expect(content).toContain('@theme inline')
      })

      for (const token of REQUIRED_TOKENS) {
        it(`defines ${token} token`, () => {
          const content = readFileSync(filePath, 'utf-8')
          expect(content).toContain(`${token}:`)
        })
      }

      it('has balanced braces (smoke parse)', () => {
        const content = readFileSync(filePath, 'utf-8')
        const opens = (content.match(/\{/g) || []).length
        const closes = (content.match(/\}/g) || []).length
        expect(opens).toBe(closes)
      })
    })
  }
})

describe('shadcn.css dark mode', () => {
  it('contains a .dark block', () => {
    const filePath = resolveTheme('shadcn')
    const content = readFileSync(filePath, 'utf-8')
    expect(content).toContain('.dark {')
  })

  it('dark block overrides --background to dark value', () => {
    const filePath = resolveTheme('shadcn')
    const content = readFileSync(filePath, 'utf-8')
    const darkBlock = content.slice(content.indexOf('.dark {'))
    expect(darkBlock).toContain('--background:')
    expect(darkBlock).toContain('oklch(0.145 0 0)')
  })

  it('dark block overrides --foreground to light value', () => {
    const filePath = resolveTheme('shadcn')
    const content = readFileSync(filePath, 'utf-8')
    const darkBlock = content.slice(content.indexOf('.dark {'))
    expect(darkBlock).toContain('--foreground:')
    expect(darkBlock).toContain('oklch(0.985 0 0)')
  })

  it('light :root has color-scheme: light', () => {
    const filePath = resolveTheme('shadcn')
    const content = readFileSync(filePath, 'utf-8')
    expect(content).toContain('color-scheme: light')
  })

  it('dark block has color-scheme: dark', () => {
    const filePath = resolveTheme('shadcn')
    const content = readFileSync(filePath, 'utf-8')
    expect(content).toContain('color-scheme: dark')
  })
})
