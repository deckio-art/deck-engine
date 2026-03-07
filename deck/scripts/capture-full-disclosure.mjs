import puppeteer from 'puppeteer-core'

const EDGE = 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe'
const sleep = ms => new Promise(r => setTimeout(r, ms))

const b = await puppeteer.launch({
  executablePath: EDGE, headless: 'new',
  args: ['--no-sandbox'],
  defaultViewport: { width: 1920, height: 1080, deviceScaleFactor: 2 }
})
const page = await b.newPage()
await page.setCacheEnabled(false)
await page.goto('http://localhost:5175/#/nordcloud-devday', { waitUntil: 'networkidle0', timeout: 15000 })
await sleep(1500)

// Slide 2 + reveal all 3 gens = 4 presses
for (let i = 0; i < 4; i++) { await page.keyboard.press('ArrowRight'); await sleep(200) }
await sleep(800)

await page.evaluate(() => {
  document.querySelectorAll('[class*="nav"],[class*="Nav"],[class*="progress"],[class*="Progress"],[class*="hint"],[class*="bottomBar"],[class*="BottomBar"]')
    .forEach(el => { if (el.tagName !== 'BODY' && el.tagName !== 'HTML') el.style.display = 'none' })
})
await sleep(300)

await page.screenshot({ path: `C:\\code\\canvas\\.github\\eyes\\nordcloud-devday-agentic-full-${Date.now()}.png`, type: 'png' })
await b.close()
const ts = Date.now()
console.log(`done: nordcloud-devday-agentic-full-${ts}.png`)
