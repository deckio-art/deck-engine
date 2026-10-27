import { test, expect } from '@playwright/test'
import { createServer } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'
import { readFile, writeFile } from 'node:fs/promises'
import { PNG } from 'pngjs'
import pixelmatch from 'pixelmatch'
import JSZip from 'jszip'

let server
let url

test.beforeAll(async () => {
  server = await createServer({
    root: fileURLToPath(new URL('../..', import.meta.url)),
    configFile: false,
    esbuild: { jsx: 'automatic' },
    optimizeDeps: { include: ['react', 'react-dom/client', 'react/jsx-runtime'] },
    plugins: tailwindcss(),
    server: { host: '127.0.0.1', port: 0 },
    logLevel: 'error',
  })
  await server.listen()
  url = `${server.resolvedUrls.local[0]}__tests__/browser/fixture.html`
})

test.afterAll(async () => {
  await server?.close()
})

test.beforeEach(async ({ page }) => {
  await page.route('https://fonts.googleapis.com/**', (route) => route.fulfill({ contentType: 'text/css', body: '' }))
  await page.goto(url)
  await page.waitForFunction(() => window.exportFixture)
  await expect(page.locator('.slide.active')).toHaveCSS('font-family', /Inter Variable/)
  await page.evaluate(() => document.fonts.ready)
})

async function compareCapture(reference, captured, testInfo, name = 'capture') {
  const expected = PNG.sync.read(reference)
  const actual = PNG.sync.read(captured)
  expect([actual.width, actual.height]).toEqual([expected.width, expected.height])
  const diff = new PNG({ width: actual.width, height: actual.height })
  // Ignore rasterizer-specific antialiasing, not layout or colour differences.
  const changed = pixelmatch(expected.data, actual.data, diff.data, actual.width, actual.height, { threshold: 0.1 })
  await writeFile(testInfo.outputPath(`${name}-reference.png`), reference)
  await writeFile(testInfo.outputPath(`${name}.png`), captured)
  await writeFile(testInfo.outputPath(`${name}-diff.png`), PNG.sync.write(diff))
  expect(changed / (actual.width * actual.height)).toBeLessThan(0.002)
}

test('capture preserves badges, gradients, colours, fonts, SVG, images and canvas', async ({ page }, testInfo) => {
  const reference = await page.locator('.slide.active').screenshot({ animations: 'disabled' })
  const captured = await page.evaluate(() => window.exportFixture.capture())
  const png = Buffer.from(captured.split(',')[1], 'base64')
  await compareCapture(reference, png, testInfo)

  const regions = await page.locator('.slide.active').locator('[data-slot="badge"], .custom-badge, h1, .card').evaluateAll((nodes) => nodes.map((node) => {
    const { x, y, width, height } = node.getBoundingClientRect()
    return { x: Math.floor(x), y: Math.floor(y), width: Math.ceil(width), height: Math.ceil(height) }
  }))
  const expected = PNG.sync.read(reference)
  const actual = PNG.sync.read(png)
  for (const [index, region] of regions.entries()) {
    const crop = (source) => {
      const target = new PNG({ width: region.width, height: region.height })
      PNG.bitblt(source, target, region.x, region.y, region.width, region.height, 0, 0)
      return PNG.sync.write(target)
    }
    await compareCapture(crop(expected), crop(actual), testInfo, `detail-${index}`)
  }
})

test('preserves a slide background independently of the theme backdrop', async ({ page }, testInfo) => {
  await page.evaluate(() => {
    document.documentElement.style.setProperty('--background', '#101827')
    document.querySelector('.slide.active').style.background = 'linear-gradient(120deg, #f8fafc, #e0e7ff)'
  })
  const reference = await page.locator('.slide.active').screenshot({ animations: 'disabled' })
  const captured = await page.evaluate(() => window.exportFixture.capture({ backgroundColor: '#101827' }))
  await compareCapture(reference, Buffer.from(captured.split(',')[1], 'base64'), testInfo)
})

for (const [layout, width, height] of [
  ['widescreen-16-9', 1920, 1080],
  ['standard-4-3', 1600, 1200],
  ['a4-landscape', 1920, 1358],
  ['letter-landscape', 1650, 1275],
]) {
  test(`captures ${layout} at the requested high resolution and restores the stage`, async ({ page }) => {
    const result = await page.evaluate(async (layout) => {
      const nodes = [document.documentElement, document.body, document.getElementById('root'), document.querySelector('.deck'), ...document.querySelectorAll('.slide, .slide *')]
      const before = nodes.map((node) => node.style.cssText)
      const image = new Image()
      image.src = await window.exportFixture.capture({ layout, quality: 'high' })
      await image.decode()
      return { width: image.naturalWidth, height: image.naturalHeight, before, after: nodes.map((node) => node.style.cssText), mode: document.documentElement.getAttribute('data-export-mode') }
    }, layout)
    expect([result.width, result.height]).toEqual([width * 2, height * 2])
    expect(result.after).toEqual(result.before)
    expect(result.mode).toBeNull()
  })
}

test('restores styles and export attributes after capture fails', async ({ page }) => {
  const result = await page.evaluate(async () => {
    document.documentElement.style.setProperty('--deckio-export-fit-scale', '0.9', 'important')
    document.querySelector('.slide.active').style.setProperty('font-kerning', 'none', 'important')
    const nodes = [document.documentElement, document.body, document.getElementById('root'), document.querySelector('.deck'), ...document.querySelectorAll('.slide, .slide *')]
    const before = nodes.map((node) => node.style.cssText)
    let message
    try { await window.exportFixture.capture({ fail: true }) } catch (error) { message = error.message }
    return { message, before, after: nodes.map((node) => node.style.cssText), mode: document.documentElement.getAttribute('data-export-mode') }
  })
  expect(result.message).toBe('Capture failed')
  expect(result.after).toEqual(result.before)
  expect(result.mode).toBeNull()
})

for (const playbackRate of [1, -1]) {
  test(`captures the final reveal frame at playback rate ${playbackRate} and restores playback`, async ({ page }) => {
    const result = await page.evaluate(async (playbackRate) => {
      const node = document.querySelector('.slide.active h1')
      const frames = playbackRate < 0 ? [{ opacity: 1 }, { opacity: 0 }] : [{ opacity: 0 }, { opacity: 1 }]
      const animation = node.animate(frames, { duration: 10_000, fill: 'both' })
      animation.pause()
      animation.playbackRate = playbackRate
      animation.currentTime = 500
      const captured = await window.exportFixture.capture()
      const restored = { currentTime: animation.currentTime, playState: animation.playState, playbackRate: animation.playbackRate }
      animation.cancel()
      const expected = await window.exportFixture.capture()
      return { captured, expected, restored }
    }, playbackRate)
    expect(result.captured).toBe(result.expected)
    expect(result.restored).toEqual({ currentTime: 500, playState: 'paused', playbackRate })
  })
}

test('freezes infinite loops at their current frame without resuming paused playback', async ({ page }, testInfo) => {
  await page.evaluate(() => {
    const node = document.querySelector('.slide.active h1')
    window.fixtureAnimation = node.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 1_000, iterations: Infinity, fill: 'both' })
    window.fixtureAnimation.pause()
    window.fixtureAnimation.currentTime = 500
  })
  const reference = await page.locator('.slide.active').screenshot({ animations: 'allow' })
  const captured = await page.evaluate(() => window.exportFixture.capture())
  await compareCapture(reference, Buffer.from(captured.split(',')[1], 'base64'), testInfo)
  expect(await page.evaluate(() => ({
    currentTime: window.fixtureAnimation.currentTime,
    playState: window.fixtureAnimation.playState,
  }))).toEqual({ currentTime: 500, playState: 'paused' })
})

test('reveals hand-rolled disclosure before fitting and capturing', async ({ page }, testInfo) => {
  const reference = await page.locator('.slide.active').screenshot({ animations: 'disabled' })
  await page.evaluate(() => {
    const rows = [...document.querySelectorAll('.slide.active .cards')]
    rows.forEach((row) => { row.style.display = 'none' })
    let visible = 0
    document.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowRight' && visible < rows.length) rows[visible++].style.removeProperty('display')
    })
  })
  const captured = await page.evaluate(() => window.exportFixture.capture())
  await compareCapture(reference, Buffer.from(captured.split(',')[1], 'base64'), testInfo)
})

test('reports broken images rather than returning an incomplete slide', async ({ page }) => {
  await page.evaluate(() => {
    const img = document.createElement('img')
    img.src = '/missing-export-image.png'
    img.alt = 'Customer logo'
    document.querySelector('.slide.active').append(img)
  })
  const message = await page.evaluate(() => window.exportFixture.capture().catch((error) => error.message))
  expect(message).toContain('Could not load image "Customer logo"')
  expect(await page.locator('html').getAttribute('data-export-mode')).toBeNull()
})

test('reports background assets that could not be embedded', async ({ page }) => {
  await page.evaluate(() => {
    document.querySelector('.radial').style.backgroundImage = 'url("/missing-export-background.png")'
  })
  const message = await page.evaluate(() => window.exportFixture.capture().catch((error) => error.message))
  expect(message).toContain('Could not embed export asset')
  expect(message).toContain('missing-export-background.png')
})

test('embeds CSS image variables without rejecting unused image variables or cursors', async ({ page }, testInfo) => {
  await page.evaluate(() => {
    const card = document.querySelector('.slide.active .radial')
    card.style.setProperty('--illustration', 'url("./illustration.svg")')
    card.style.setProperty('--unused-image', 'url("/not-used.png")')
    card.style.backgroundImage = 'var(--illustration)'
    card.style.cursor = 'url("/custom-cursor.png"), auto'
  })
  await page.locator('.slide.active img').evaluate((image) => image.decode())
  const reference = await page.locator('.slide.active').screenshot({ animations: 'disabled' })
  const captured = await page.evaluate(() => window.exportFixture.capture())
  await compareCapture(reference, Buffer.from(captured.split(',')[1], 'base64'), testInfo)
})

test('shows an actionable asset error in the export UI', async ({ page }) => {
  await page.evaluate(async () => {
    const img = document.createElement('img')
    img.src = '/missing-logo.png'
    img.alt = 'Customer logo'
    document.querySelector('.slide.active').append(img)
    await window.exportFixture.mountNavigation()
  })
  await page.getByTitle('Export deck', { exact: true }).click()
  await page.getByRole('dialog', { name: 'Export deck options' }).getByRole('button', { name: /PDF/ }).click()
  await expect(page.getByRole('alert')).toContainText('Could not load image "Customer logo"')
})

test('excludes editor chrome without stripping slide content', async ({ page }, testInfo) => {
  const reference = await page.locator('.slide.active').screenshot({ animations: 'disabled' })
  await page.evaluate(() => {
    const ignored = document.createElement('div')
    ignored.dataset.deckioExportIgnore = 'true'
    ignored.style.cssText = 'position: absolute; inset: 0; background: red'
    document.querySelector('.slide.active').append(ignored)
  })
  const captured = await page.evaluate(() => window.exportFixture.capture())
  await compareCapture(reference, Buffer.from(captured.split(',')[1], 'base64'), testInfo)
})

for (const format of ['pdf', 'pptx']) {
  test(`${format} failures restore the original slide and identify the failed page`, async ({ page }) => {
    const message = await page.evaluate(async (format) => {
      window.exportFixture.goTo(1)
      const img = document.createElement('img')
      img.src = '/missing-logo.png'
      img.alt = 'Customer logo'
      document.querySelector('.slide[data-slide="0"]').append(img)
      return window.exportFixture.export(format).catch((error) => error.message)
    }, format)
    expect(message).toContain('Slide 1: Could not load image "Customer logo"')
    expect(await page.locator('.slide.active').getAttribute('data-slide')).toBe('1')
    expect(await page.locator('html').getAttribute('data-export-mode')).toBeNull()
  })

  test(`${format} download contains the same rendered slides in order`, async ({ page }, testInfo) => {
    const references = []
    for (const index of [0, 1]) {
      await page.evaluate((index) => window.exportFixture.goTo(index), index)
      references.push(await page.locator('.slide.active').screenshot({ animations: 'disabled' }))
    }
    const downloadReady = page.waitForEvent('download')
    const result = await page.evaluate((format) => window.exportFixture.export(format), format)
    const download = await downloadReady
    expect(download.suggestedFilename()).toMatch(new RegExp(`\\.${format}$`))
    const file = testInfo.outputPath(`deck.${format}`)
    await download.saveAs(file)
    expect(result.layout).toBe('widescreen-16-9')
    expect(await page.locator('.slide.active').getAttribute('data-slide')).toBe('1')
    expect(await page.locator('html').getAttribute('data-export-mode')).toBeNull()
    const bytes = await readFile(file)
    if (format === 'pptx') {
      const zip = await JSZip.loadAsync(bytes)
      expect(Object.keys(zip.files).filter((name) => /^ppt\/slides\/slide\d+\.xml$/.test(name))).toHaveLength(2)
      expect(await zip.file('ppt/presentation.xml').async('string')).toContain('cx="12192000" cy="6858000"')
      const images = Object.keys(zip.files).filter((name) => /^ppt\/media\/.*\.png$/.test(name))
      expect(images).toHaveLength(2)
      for (const [index, name] of images.entries()) {
        await compareCapture(references[index], await zip.file(name).async('nodebuffer'), testInfo, `pptx-slide-${index + 1}`)
      }
    } else {
      const rendered = await page.evaluate((bytes) => window.exportFixture.renderPdf(bytes), Array.from(bytes))
      expect(rendered.pages).toBe(2)
      expect(rendered.width).toBeCloseTo(960, 2)
      expect(rendered.height).toBeCloseTo(540, 2)
      for (const [index, image] of rendered.images.entries()) {
        await compareCapture(references[index], Buffer.from(image.split(',')[1], 'base64'), testInfo, `pdf-page-${index + 1}`)
      }
    }
  })
}
