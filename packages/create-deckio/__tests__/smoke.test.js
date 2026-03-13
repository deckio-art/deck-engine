import { describe, it, expect } from 'vitest'
import { existsSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkgRoot = join(__dirname, '..')

describe('create-deckio package', () => {
  it('has a valid package.json with bin entry', async () => {
    const pkg = (await import(join(pkgRoot, 'package.json'), { with: { type: 'json' } })).default
    expect(pkg.bin).toBeDefined()
    expect(pkg.bin['create-deck-project']).toBe('index.mjs')
  })

  it('entry point file exists on disk', () => {
    expect(existsSync(join(pkgRoot, 'index.mjs'))).toBe(true)
  })

  it('utils module exports are importable', async () => {
    const utils = await import(join(pkgRoot, 'utils.mjs'))
    expect(typeof utils.slugify).toBe('function')
    expect(typeof utils.packageJson).toBe('function')
    expect(typeof utils.deckConfig).toBe('function')
  })

  it('deckio.png branding asset exists', () => {
    expect(existsSync(join(pkgRoot, 'deckio.png'))).toBe(true)
  })
})
