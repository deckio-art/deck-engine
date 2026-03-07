#!/usr/bin/env node
/**
 * Export slides to PDF using Puppeteer + embedded Vite dev server.
 *
 * For project exports (--project), the script spins up its own Vite dev
 * server so no separate `npm run dev` is needed.
 *
 * Usage:
 *   node scripts/export-pdf.mjs --project dev-plan
 *   node scripts/export-pdf.mjs                              # ghcp slides (needs running dev server)
 *   node scripts/export-pdf.mjs --customer --customer-name Rabobank --from 12 --to 19
 *   node scripts/export-pdf.mjs --internal --from 2 --to 10
 */
import puppeteer from 'puppeteer'
import { existsSync, mkdirSync } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createServer } from 'vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.resolve(__dirname, '..')
const outDir = path.resolve(root, 'exports')

// ── Parse CLI args ──
const args = process.argv.slice(2)
const flag = (name) => args.includes(`--${name}`)
function getArg(name, fallback) {
  const idx = args.indexOf(`--${name}`)
  return idx !== -1 && args[idx + 1] ? Number(args[idx + 1]) : fallback
}
function getStringArg(name, fallback) {
  const idx = args.indexOf(`--${name}`)
  return idx !== -1 && args[idx + 1] ? args[idx + 1] : fallback
}

const PORT = getArg('port', 5173)
const FROM = getArg('from', null)
const TO = getArg('to', null)
const CUSTOMER_NAME = getStringArg('customer-name', null)
const PROJECT = getStringArg('project', null)
const isCustomer = flag('customer')
const slug = (s) => s.toLowerCase().replace(/\s+/g, '-')
const outFile = PROJECT
  ? (CUSTOMER_NAME
    ? `${slug(CUSTOMER_NAME)}-slides.pdf`
    : `${PROJECT}-slides.pdf`)
  : isCustomer
    ? `${slug(CUSTOMER_NAME || 'customer')}-slides.pdf`
    : flag('internal') ? 'internal-slides.pdf' : 'slides.pdf'

if (!existsSync(outDir)) mkdirSync(outDir, { recursive: true })

// ────────────────────────────────────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────────────────────────────────────

/** Hide navigation chrome so it doesn't appear in screenshots. */
async function hideNav(page) {
  await page.evaluate(() => {
    document.querySelectorAll(
      '[class*="nav"], [class*="Nav"], [class*="progress"], ' +
      '[class*="Progress"], [class*="hint"], [class*="Hint"]'
    ).forEach(el => {
      if (el.tagName !== 'BODY' && el.tagName !== 'HTML')
        el.style.display = 'none'
    })
  })
}

/** Navigate back to slide 0 then forward to `targetIdx`. */
async function goToSlide(page, targetIdx, totalSlides) {
  for (let i = 0; i < totalSlides; i++) {
    await page.keyboard.press('ArrowLeft')
    await sleep(50)
  }
  for (let i = 0; i < targetIdx; i++) {
    await page.keyboard.press('ArrowRight')
    await sleep(100)
  }
  await sleep(800)
}

/** Capture slides fromIdx..toIdx and return an array of PNG buffers. */
async function captureSlides(page, fromIdx, toIdx, totalSlides) {
  await goToSlide(page, fromIdx, totalSlides)
  const shots = []
  for (let i = fromIdx; i <= toIdx; i++) {
    console.log(`  📸 Slide ${i + 1}/${totalSlides}`)
    await sleep(400)
    shots.push(await page.screenshot({ type: 'png', encoding: 'binary' }))
    if (i < toIdx) { await page.keyboard.press('ArrowRight'); await sleep(700) }
  }
  return shots
}

/** Build a PDF from an array of PNG buffers. */
async function buildPDF(browser, screenshots, pdfPath) {
  const pdfPage = await browser.newPage()
  await pdfPage.setViewport({ width: 1920, height: 1080 })

  const imgTags = screenshots.map(buf => {
    const b64 = Buffer.from(buf).toString('base64')
    return `<div class="page"><img src="data:image/png;base64,${b64}" /></div>`
  }).join('\n')

  await pdfPage.setContent(`<!DOCTYPE html>
<html><head><style>
  *{margin:0;padding:0;box-sizing:border-box}
  html,body{width:1920px;overflow:hidden}
  @page{size:1920px 1080px;margin:0}
  .page{width:1920px;height:1080px;page-break-after:always;page-break-inside:avoid;overflow:hidden}
  .page:last-child{page-break-after:avoid}
  .page img{display:block;width:1920px;height:1080px;object-fit:fill}
</style></head><body>${imgTags}</body></html>`, { waitUntil: 'load' })

  await pdfPage.pdf({
    path: pdfPath,
    width: '1920px',
    height: '1080px',
    printBackground: true,
    preferCSSPageSize: true,
    margin: { top: '0px', right: '0px', bottom: '0px', left: '0px' },
  })
  await pdfPage.close()
}

const sleep = ms => new Promise(r => setTimeout(r, ms))

// ────────────────────────────────────────────────────────────────────────────
// Project export  (--project flag)
// Spins up its own Vite server — no separate dev server needed.
// ────────────────────────────────────────────────────────────────────────────

async function exportProjectPDF() {
  console.log(`\n📂 Exporting project: ${PROJECT}`)

  // Start an embedded Vite dev server on a random free port
  const server = await createServer({
    root,
    configFile: path.join(root, 'vite.config.js'),
    server: { port: 0, strictPort: false, host: '127.0.0.1' },
    logLevel: 'silent',
  })
  await server.listen()
  const addr = server.httpServer.address()
  const base = `http://127.0.0.1:${addr.port}`
  console.log(`  Vite server listening on ${base}`)

  // Give the server a moment to fully stabilise
  await sleep(2000)

  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })
  const page = await browser.newPage()
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 })

  // Load project page with retries
  const url = `${base}/#/${PROJECT}`
  console.log(`⏳ Loading ${url}`)
  let loaded = false
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })
      loaded = true
      break
    } catch (err) {
      console.log(`  Attempt ${attempt}/3 failed: ${err.message}`)
      await sleep(2000)
    }
  }
  if (!loaded) throw new Error('Could not load the Vite dev server after 3 attempts')
  await page.goto(url, { waitUntil: 'networkidle0', timeout: 30000 })

  // Wait for slides to render
  await page.waitForFunction(
    () => document.querySelectorAll('.slide').length > 0,
    { timeout: 15000 }
  )
  await sleep(1500) // let CSS transitions & fonts settle

  await hideNav(page)

  // Customer selection within project mode
  if (CUSTOMER_NAME) {
    console.log(`👤 Selecting customer: ${CUSTOMER_NAME}`)
    const clicked = await page.evaluate(() => {
      const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Customer Facing'))
      if (btn) { btn.click(); return true }
      return false
    })
    if (!clicked) { console.error('❌ "Customer Facing" button not found'); await browser.close(); await server.close(); process.exit(1) }
    await sleep(800)

    const picked = await page.evaluate(name => {
      const btn = [...document.querySelectorAll('button')].find(b => b.textContent.trim().includes(name))
      if (btn) { btn.click(); return true }
      return false
    }, CUSTOMER_NAME)
    if (!picked) { console.error(`❌ Customer "${CUSTOMER_NAME}" not found`); await browser.close(); await server.close(); process.exit(1) }
    await sleep(1000)
    console.log('✅ Customer selected')
    await hideNav(page)
  }

  const totalSlides = await page.evaluate(() => document.querySelectorAll('.slide').length)
  const fromIdx = FROM ? FROM - 1 : 0
  const toIdx = TO ? TO - 1 : totalSlides - 1
  console.log(`📊 ${totalSlides} slides — exporting ${fromIdx + 1}–${toIdx + 1}`)

  const screenshots = await captureSlides(page, fromIdx, toIdx, totalSlides)

  const pdfPath = path.join(outDir, outFile)
  await buildPDF(browser, screenshots, pdfPath)

  await browser.close()
  await server.close()
  console.log(`\n✅ PDF saved to ${pdfPath}`)
}

// ────────────────────────────────────────────────────────────────────────────
// Default export  (ghcp / customer — requires running dev server)
// ────────────────────────────────────────────────────────────────────────────

async function exportDevServerPDF() {
  const BASE = `http://localhost:${PORT}`
  console.log(`\n⏳ Connecting to dev server at ${BASE}`)

  const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] })
  const page = await browser.newPage()
  await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 2 })

  await page.goto(`${BASE}/#/ghcp`, { waitUntil: 'networkidle0', timeout: 30000 })
  await page.waitForSelector('.slide.active', { timeout: 10000 })

  // Customer selection
  if (isCustomer && CUSTOMER_NAME) {
    console.log(`👤 Selecting customer: ${CUSTOMER_NAME}`)
    const clicked = await page.evaluate(() => {
      const btn = [...document.querySelectorAll('button')].find(b => b.textContent.includes('Customer Facing'))
      if (btn) { btn.click(); return true }
      return false
    })
    if (!clicked) { console.error('❌ "Customer Facing" button not found'); await browser.close(); process.exit(1) }
    await sleep(800)

    const picked = await page.evaluate(name => {
      const btn = [...document.querySelectorAll('button')].find(b => b.textContent.trim().includes(name))
      if (btn) { btn.click(); return true }
      return false
    }, CUSTOMER_NAME)
    if (!picked) { console.error(`❌ Customer "${CUSTOMER_NAME}" not found`); await browser.close(); process.exit(1) }
    await sleep(1000)
    console.log('✅ Customer selected')
  }

  await hideNav(page)

  const totalSlides = await page.evaluate(() => document.querySelectorAll('.slide').length)
  const fromIdx = FROM ? FROM - 1 : 0
  const toIdx = TO ? TO - 1 : totalSlides - 1
  console.log(`📊 ${totalSlides} slides — exporting ${fromIdx + 1}–${toIdx + 1}`)

  const screenshots = await captureSlides(page, fromIdx, toIdx, totalSlides)

  const pdfPath = path.join(outDir, outFile)
  await buildPDF(browser, screenshots, pdfPath)

  await browser.close()
  console.log(`\n✅ PDF saved to ${pdfPath}`)
}

// ── Main ──
const run = PROJECT ? exportProjectPDF : exportDevServerPDF
run().catch(err => { console.error('❌ Export failed:', err.message); process.exit(1) })
