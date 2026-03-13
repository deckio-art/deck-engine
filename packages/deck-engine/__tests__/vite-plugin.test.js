import { describe, it, expect } from 'vitest'
import { deckPlugin, deckPlugins, tailwindPlugin } from '../vite.js'

describe('deckPlugin', () => {
  it('returns a valid Vite plugin object', () => {
    const plugin = deckPlugin()
    expect(plugin).toBeDefined()
    expect(plugin.name).toBe('deck-engine')
    expect(plugin.enforce).toBe('pre')
    expect(typeof plugin.config).toBe('function')
  })

  it('dedupes react and react-dom in resolve config', () => {
    const plugin = deckPlugin()
    const config = plugin.config()

    expect(config.resolve.dedupe).toContain('react')
    expect(config.resolve.dedupe).toContain('react-dom')
  })

  it('dedupe array contains exactly react and react-dom', () => {
    const plugin = deckPlugin()
    const { dedupe } = plugin.config().resolve

    expect(dedupe).toHaveLength(2)
    expect(dedupe).toContain('react')
    expect(dedupe).toContain('react-dom')
  })

  it('returns a fresh config object on each call', () => {
    const plugin = deckPlugin()
    const config1 = plugin.config()
    const config2 = plugin.config()

    expect(config1).toEqual(config2)
    expect(config1).not.toBe(config2) // distinct object refs
  })

  it('default export matches named export', async () => {
    const mod = await import('../vite.js')
    expect(mod.default).toBe(mod.deckPlugin)
  })

  it('each call to deckPlugin returns an independent plugin', () => {
    const p1 = deckPlugin()
    const p2 = deckPlugin()

    expect(p1).not.toBe(p2)
    expect(p1.name).toBe(p2.name)
  })

  it('accepts an options object with theme', () => {
    const plugin = deckPlugin({ theme: 'shadcn' })
    expect(plugin.name).toBe('deck-engine')
  })
})

describe('deckPlugins', () => {
  it('returns an array starting with deck-engine followed by tailwindcss plugins', () => {
    const plugins = deckPlugins()
    expect(Array.isArray(plugins)).toBe(true)
    expect(plugins.length).toBeGreaterThanOrEqual(2)
    expect(plugins[0].name).toBe('deck-engine')
    // Remaining plugins are from @tailwindcss/vite
    const twPlugins = plugins.slice(1)
    expect(twPlugins.length).toBeGreaterThan(0)
    for (const p of twPlugins) {
      expect(p.name).toMatch(/^@tailwindcss\/vite/)
    }
  })

  it('passes theme option through to deckPlugin', () => {
    const plugins = deckPlugins({ theme: 'light' })
    expect(plugins[0].name).toBe('deck-engine')
  })

  it('works with no options', () => {
    const plugins = deckPlugins()
    expect(plugins[0].name).toBe('deck-engine')
  })
})

describe('tailwindPlugin', () => {
  it('returns tailwindcss vite plugin(s)', () => {
    const result = tailwindPlugin()
    // @tailwindcss/vite returns an array of sub-plugins
    const plugins = Array.isArray(result) ? result : [result]
    expect(plugins.length).toBeGreaterThan(0)
    for (const p of plugins) {
      expect(p.name).toMatch(/tailwindcss|@tailwindcss/)
    }
  })
})
