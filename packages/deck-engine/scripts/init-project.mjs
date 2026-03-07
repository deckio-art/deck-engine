#!/usr/bin/env node
/**
 * deck-engine init — provisions Copilot skills and state into a deck project.
 *
 * Copies .github/skills/ from the engine package and bootstraps
 * .github/memory/state.md with project metadata from deck.config.js.
 *
 * Usage:
 *   node node_modules/@deckio/deck-engine/scripts/init-project.mjs
 *   npx deck-init   (if bin is configured)
 *
 * Idempotent — safe to re-run. Updates skills, preserves state.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync, readdirSync, copyFileSync, rmSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const engineRoot = join(__dirname, '..')
const projectRoot = process.cwd()

// ── Discover project metadata from deck.config.js ──

function readProjectMeta() {
  const configPath = join(projectRoot, 'deck.config.js')
  if (!existsSync(configPath)) {
    console.error('❌ No deck.config.js found in', projectRoot)
    process.exit(1)
  }
  const content = readFileSync(configPath, 'utf-8')
  const str = (key) => {
    const m = content.match(new RegExp(`${key}:\\s*['"\`]([^'"\`]+)['"\`]`))
    return m ? m[1] : null
  }
  return {
    id: str('id') || 'unknown',
    title: str('title') || 'Deck Project',
  }
}

// ── Copy skills ──

function copySkills() {
  const srcSkills = join(engineRoot, 'skills')
  if (!existsSync(srcSkills)) {
    console.warn('⚠️  No skills directory in engine package')
    return 0
  }

  const destSkills = join(projectRoot, '.github', 'skills')
  let count = 0

  // Collect engine skill names to detect stale skills
  const engineSkillNames = new Set()
  for (const entry of readdirSync(srcSkills, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue
    const skillFile = join(srcSkills, entry.name, 'SKILL.md')
    if (!existsSync(skillFile)) continue
    engineSkillNames.add(entry.name)

    const destDir = join(destSkills, entry.name)
    mkdirSync(destDir, { recursive: true })
    copyFileSync(skillFile, join(destDir, 'SKILL.md'))
    count++
  }

  // Remove stale skills no longer in the engine
  if (existsSync(destSkills)) {
    for (const entry of readdirSync(destSkills, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue
      if (!engineSkillNames.has(entry.name)) {
        rmSync(join(destSkills, entry.name), { recursive: true, force: true })
        console.log(`   Removed stale skill: ${entry.name}`)
      }
    }
  }

  return count
}

// ── Copy instructions ──

function copyInstructions() {
  const srcInstructions = join(engineRoot, 'instructions')
  if (!existsSync(srcInstructions)) {
    console.warn('⚠️  No instructions directory in engine package')
    return 0
  }

  const destInstructions = join(projectRoot, '.github', 'instructions')
  mkdirSync(destInstructions, { recursive: true })
  let count = 0

  // Collect engine instruction names to detect stale instructions
  const engineInstrNames = new Set()
  for (const entry of readdirSync(srcInstructions, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.instructions.md')) continue
    engineInstrNames.add(entry.name)
    copyFileSync(
      join(srcInstructions, entry.name),
      join(destInstructions, entry.name)
    )
    count++
  }

  // Remove stale instructions no longer in the engine
  for (const entry of readdirSync(destInstructions, { withFileTypes: true })) {
    if (!entry.isFile() || !entry.name.endsWith('.instructions.md')) continue
    if (!engineInstrNames.has(entry.name)) {
      rmSync(join(destInstructions, entry.name), { force: true })
      console.log(`   Removed stale instruction: ${entry.name}`)
    }
  }

  return count
}

// ── Copy AGENTS.md ──

function copyAgentsMd() {
  const src = join(engineRoot, 'instructions', 'AGENTS.md')
  if (!existsSync(src)) return false
  copyFileSync(src, join(projectRoot, 'AGENTS.md'))
  return true
}

// ── Bootstrap state.md ──

function bootstrapState(meta) {
  const stateDir = join(projectRoot, '.github', 'memory')
  const statePath = join(stateDir, 'state.md')

  // Don't overwrite existing state (preserves user's port/url config)
  if (existsSync(statePath)) {
    console.log('   state.md already exists — preserved')
    return
  }

  mkdirSync(stateDir, { recursive: true })
  const content = `# Deck State

## Project
id: ${meta.id}
title: ${meta.title}

## Dev Server
port: 5173
url: http://localhost:5173/
`
  writeFileSync(statePath, content, 'utf-8')
  console.log('   Created .github/memory/state.md')
}

// ── Create eyes directory ──

function createEyesDir() {
  const eyesDir = join(projectRoot, '.github', 'eyes')
  mkdirSync(eyesDir, { recursive: true })

  // Add to .gitignore if not already there
  const gitignorePath = join(projectRoot, '.gitignore')
  if (existsSync(gitignorePath)) {
    const gitignore = readFileSync(gitignorePath, 'utf-8')
    if (!gitignore.includes('.github/eyes')) {
      writeFileSync(gitignorePath, gitignore.trimEnd() + '\n.github/eyes/\n', 'utf-8')
      console.log('   Added .github/eyes/ to .gitignore')
    }
  }
}

// ── Main ──

const meta = readProjectMeta()
console.log(`\n🎯 Initializing deck project: ${meta.title} (${meta.id})`)

const skillCount = copySkills()
console.log(`   Copied ${skillCount} Copilot skills to .github/skills/`)

const instrCount = copyInstructions()
console.log(`   Copied ${instrCount} Copilot instructions to .github/instructions/`)

const agentsCopied = copyAgentsMd()
if (agentsCopied) console.log('   Copied AGENTS.md to project root')

bootstrapState(meta)
createEyesDir()

console.log(`\n✅ Done. Run \`copilot --yolo\` to start editing with Copilot skills.\n`)
