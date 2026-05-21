import { describe, it, expect } from 'vitest'
import { chmodSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'fs'
import { execFileSync } from 'child_process'
import { tmpdir } from 'os'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const pkgRoot = join(__dirname, '..')

function makeTempWithNpmShim() {
  const tempRoot = mkdtempSync(join(tmpdir(), 'create-deckio-gitignore-'))
  const binDir = join(tempRoot, 'bin')
  mkdirSync(binDir, { recursive: true })
  if (process.platform === 'win32') {
    writeFileSync(join(binDir, 'npm.cmd'), '@echo off\r\nexit /b 0\r\n')
  } else {
    const npmShim = join(binDir, 'npm')
    writeFileSync(npmShim, '#!/bin/sh\nexit 0\n')
    chmodSync(npmShim, 0o755)
  }
  const PATH = `${binDir}${process.platform === 'win32' ? ';' : ':'}${process.env.PATH || ''}`
  return { tempRoot, PATH }
}

describe('scaffolded .gitignore security defaults', () => {
  it('includes crash artifacts, env files, and OS noise in the scaffolded .gitignore', () => {
    const { tempRoot, PATH } = makeTempWithNpmShim()
    const projectName = 'gitignore-defaults-test'
    try {
      execFileSync(
        process.execPath,
        [join(pkgRoot, 'index.mjs'), projectName, '--theme', 'midnight', '--no-install'],
        { cwd: tempRoot, stdio: 'pipe', env: { ...process.env, PATH } },
      )
      const gitignore = readFileSync(join(tempRoot, projectName, '.gitignore'), 'utf-8')

      // Original entries still present.
      expect(gitignore).toMatch(/^node_modules$/m)
      expect(gitignore).toMatch(/^dist$/m)
      expect(gitignore).toMatch(/^\.vite$/m)

      // Env files (token-bearing).
      expect(gitignore).toMatch(/^\.env$/m)
      expect(gitignore).toMatch(/^\.env\.local$/m)

      // Crash artifacts \u2014 the core-dump leak vector.
      expect(gitignore).toMatch(/^core$/m)
      expect(gitignore).toMatch(/^core\.\*$/m)
      expect(gitignore).toMatch(/^\*\.core$/m)
      expect(gitignore).toMatch(/^\*\.dmp$/m)
      expect(gitignore).toMatch(/^\*\.mdmp$/m)
      expect(gitignore).toMatch(/^\*\.hprof$/m)
      expect(gitignore).toMatch(/^\*\.heap$/m)
      expect(gitignore).toMatch(/^\*\.heapsnapshot$/m)

      // OS / editor noise.
      expect(gitignore).toMatch(/^\.DS_Store$/m)
      expect(gitignore).toMatch(/^Thumbs\.db$/m)
    } finally {
      rmSync(tempRoot, { recursive: true, force: true })
    }
  }, 30000)
})
