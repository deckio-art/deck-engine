#!/usr/bin/env node
/**
 * Capture a screenshot of the canvas app via headless Edge.
 *
 * Usage:
 *   node scripts/capture-screen.mjs                                # project + port from state.md
 *   node scripts/capture-screen.mjs --project dev-plan             # specific project
 *   node scripts/capture-screen.mjs --slide 3                      # specific slide (1-based)
 *   node scripts/capture-screen.mjs --project dev-plan --slide 2 --label "cover-check"
 */
import puppeteer from 'puppeteer-core'
import { existsSync, mkdirSync, readFileSync } from 'fs'
import path from 'path'

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const sleep = ms => new Promise(r => setTimeout(r, ms))
const args = process.argv.slice(2)
const arg = (name, fb) => {
  const i = args.indexOf(`--${name}`)
  return i !== -1 && args[i + 1] ? args[i + 1] : fb
}
const numArg = (name, fb) => {
  const v = arg(name, null)
  return v != null ? Number(v) : fb
}

const root = path.resolve(arg('root', process.cwd()))
const eyesDir = path.join(root, '.github', 'eyes')
const stateFile = path.join(root, '.github', 'memory', 'state.md')

const state = readState()
const PROJECT = arg('project', state.project || null)
const PORT = arg('port', state.port || '5175')
const SLIDE = numArg('slide', null)
const LABEL = arg('label', null)
const URL = `http://localhost:${PORT}/#/${PROJECT}`

if (!PROJECT) {
  console.error('❌ No project. Use --project <id> or set it in .github/memory/state.md')
  process.exit(1)
}

function readState() {
  if (!existsSync(stateFile)) return {}
  const c = readFileSync(stateFile, 'utf-8')
  return {
    project: c.match(/^project:\s*(.+)$/m)?.[1]?.trim() || '',
    port: c.match(/^port:\s*(\d+)$/m)?.[1]?.trim() || '5175',
  }
}

async function main() {
  mkdirSync(eyesDir, { recursive: true })
  console.log(`👁️  ${PROJECT}  ${URL}${SLIDE ? `  slide ${SLIDE}` : ''}`)

  try {
    const response = await fetch(`http://localhost:${PORT}`, { signal: AbortSignal.timeout(3000) })
    if (!response.ok) throw new Error('Dev server unavailable')
  } catch {
    console.error(`❌ Dev server not reachable on port ${PORT}`)
    process.exit(1)
  }

  const browser = await puppeteer.launch({
    executablePath: EDGE,
    headless: 'new',
    args: ['--no-sandbox', '--disable-gpu', '--disable-dev-shm-usage'],
    defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 2 },
  })

  const page = await browser.newPage()
  await page.goto(URL, { waitUntil: 'domcontentloaded', timeout: 15000 })
  await page.waitForFunction(() => document.querySelectorAll('.slide').length > 0, { timeout: 10000 })
  await sleep(1500)

  if (SLIDE && SLIDE > 1) {
    const total = await page.evaluate(() => document.querySelectorAll('.slide').length)
    for (let i = 0; i < total; i++) {
      await page.keyboard.press('ArrowLeft')
      await sleep(50)
    }
    for (let i = 0; i < SLIDE - 1; i++) {
      await page.keyboard.press('ArrowRight')
      await sleep(100)
    }
    await sleep(800)
  }

  await page.evaluate(() => {
    document.querySelectorAll('[class*="nav"],[class*="Nav"],[class*="progress"],[class*="Progress"],[class*="hint"],[class*="Hint"],[class*="bottomBar"],[class*="BottomBar"]')
      .forEach(el => {
        if (el.tagName !== 'BODY' && el.tagName !== 'HTML') el.style.display = 'none'
      })
  })
  await sleep(300)

  const ts = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19)
  const name = [PROJECT, SLIDE && `slide${SLIDE}`, LABEL, ts].filter(Boolean).join('-') + '.png'
  const filepath = path.join(eyesDir, name)
  await page.screenshot({ path: filepath, type: 'png' })
  await browser.close()

  const rel = path.relative(root, filepath).replace(/\\/g, '/')
  console.log(`📸 ${rel}`)
}

main().catch(err => {
  console.error('❌', err?.message || err)
  process.exit(1)
})
