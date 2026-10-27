const SETTLE_MS = 600
const ASSET_TIMEOUT_MS = 30_000
const EXPORT_IGNORE_SELECTOR = [
  '.slide-overflow-warn',
  '.deckio-editable-status',
  '.deckio-inline-edit-toast-root',
  '[data-export-ignore="true"]',
  '[data-deckio-export-ignore="true"]',
].join(', ')

export const EXPORT_LAYOUTS = Object.freeze([
  {
    id: 'widescreen-16-9',
    label: 'Widescreen 16:9',
    hint: 'PowerPoint default',
    widthIn: 13.333333,
    heightIn: 7.5,
    pixelWidth: 1920,
    pixelHeight: 1080,
  },
  {
    id: 'standard-4-3',
    label: 'Standard 4:3',
    hint: 'Classic projector',
    widthIn: 10,
    heightIn: 7.5,
    pixelWidth: 1600,
    pixelHeight: 1200,
  },
  {
    id: 'a4-landscape',
    label: 'A4 landscape',
    hint: 'PDF handout',
    widthIn: 11.6929,
    heightIn: 8.2677,
    pixelWidth: 1920,
    pixelHeight: 1358,
  },
  {
    id: 'letter-landscape',
    label: 'Letter landscape',
    hint: 'US handout',
    widthIn: 11,
    heightIn: 8.5,
    pixelWidth: 1650,
    pixelHeight: 1275,
  },
])

export const EXPORT_QUALITIES = Object.freeze([
  { id: 'high', label: 'High', hint: '2x pixels', scale: 2 },
  { id: 'standard', label: 'Standard', hint: 'smaller file', scale: 1 },
])

export const EXPORT_FITS = Object.freeze([
  { id: 'auto', label: 'Auto fit', hint: 'shrinks busy slides only' },
  { id: '1.2', label: '120%', hint: 'zoomed in', scale: 1.2 },
  { id: '1', label: '100%', hint: 'source size', scale: 1 },
  { id: '0.9', label: '90%', hint: 'slightly tighter', scale: 0.9 },
  { id: '0.8', label: '80%', hint: 'busy slides', scale: 0.8 },
])

export const DEFAULT_EXPORT_OPTIONS = Object.freeze({
  layout: 'widescreen-16-9',
  quality: 'high',
  fit: 'auto',
})

const AUTO_FIT_SCALES = Object.freeze([1, 0.95, 0.9, 0.85, 0.8])

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

const TRANSPARENT_RE = /^(transparent|rgba?\(\s*0\s*,\s*0\s*,\s*0\s*,\s*0\s*\))$/i

/**
 * Pull the first concrete color out of a computed `background-image` gradient.
 *
 * Gradient-clipped text (`background: linear-gradient(...)` +
 * `-webkit-background-clip: text` + transparent fill) is a very common way to
 * paint headline text. The legacy `neutralizeClippedText` fallback uses the
 * first stop as its closest single-color approximation.
 *
 * Returns a CSS color string (e.g. `rgb(99, 102, 241)` or `#6366f1`) or null.
 */
export function parseFirstGradientColor(backgroundImage) {
  if (!backgroundImage || backgroundImage === 'none') return null
  const match = backgroundImage.match(
    /rgba?\([^)]*\)|hsla?\([^)]*\)|#[0-9a-fA-F]{3,8}\b/,
  )
  return match ? match[0] : null
}

function isClippedText(styles) {
  const clip = styles.webkitBackgroundClip || styles.backgroundClip || ''
  return /text/i.test(clip)
}

/**
 * Legacy solid-color fallback for callers that explicitly request it.
 * Shared PDF/PPTX capture preserves the authored gradient instead.
 */
export function neutralizeClippedText(root, fallbackColor = '#ffffff') {
  if (!root || typeof getComputedStyle !== 'function') return () => {}

  const elements = [root, ...root.querySelectorAll('*')]
  const restores = []

  for (const el of elements) {
    if (!(el instanceof Element)) continue
    const styles = getComputedStyle(el)
    if (!isClippedText(styles)) continue

    const ownColor = TRANSPARENT_RE.test(styles.color) ? null : styles.color
    const color = parseFirstGradientColor(styles.backgroundImage)
      || ownColor
      || fallbackColor

    const style = el.style
    const prev = {
      backgroundImage: style.backgroundImage,
      webkitBackgroundClip: style.webkitBackgroundClip,
      backgroundClip: style.backgroundClip,
      webkitTextFillColor: style.webkitTextFillColor,
      color: style.color,
    }
    restores.push(() => Object.assign(style, prev))

    style.backgroundImage = 'none'
    style.webkitBackgroundClip = 'border-box'
    style.backgroundClip = 'border-box'
    style.webkitTextFillColor = color
    style.color = color
  }

  return () => {
    for (let i = restores.length - 1; i >= 0; i--) restores[i]()
  }
}

function byId(items, id, fallbackId) {
  return items.find((item) => item.id === id)
    || items.find((item) => item.id === fallbackId)
    || items[0]
}

export function resolveExportOptions(options = {}) {
  const layout = byId(EXPORT_LAYOUTS, options.layout, DEFAULT_EXPORT_OPTIONS.layout)
  const quality = byId(EXPORT_QUALITIES, options.quality, DEFAULT_EXPORT_OPTIONS.quality)
  const fit = byId(EXPORT_FITS, options.fit, DEFAULT_EXPORT_OPTIONS.fit)
  return { layout, quality, fit }
}

export function getPdfOrientation(layout) {
  return layout.widthIn >= layout.heightIn ? 'landscape' : 'portrait'
}

export function getLayoutPageFormat(layout) {
  return [layout.widthIn, layout.heightIn]
}

export function getSlideBackground() {
  const styles = getComputedStyle(document.documentElement)
  return styles.backgroundColor && styles.backgroundColor !== 'rgba(0, 0, 0, 0)'
    ? styles.backgroundColor
    : styles.getPropertyValue('--background').trim() || '#080b10'
}

export function normalizeHexColor(value, fallback = '080B10') {
  const raw = String(value || '').trim()
  const short = raw.match(/^#?([0-9a-f]{3})$/i)
  if (short) {
    return short[1].split('').map((c) => c + c).join('').toUpperCase()
  }
  const long = raw.match(/^#?([0-9a-f]{6})$/i)
  if (long) return long[1].toUpperCase()
  const rgb = raw.match(/^rgba?\(\s*([\d.]+%?)[,\s]+([\d.]+%?)[,\s]+([\d.]+%?)(?:\s*[,/]\s*[\d.]+%?)?\s*\)$/i)
  return rgb ? rgb.slice(1).map((part) => {
    const value = part.endsWith('%') ? Number.parseFloat(part) / 100 * 255 : Number.parseFloat(part)
    return Math.max(0, Math.min(255, Math.round(value))).toString(16).padStart(2, '0')
  }).join('').toUpperCase() : fallback
}

export function sanitizeFilePart(v) {
  return String(v || 'deck').trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'deck'
}

export function buildExportFileName({ project, selectedCustomer, extension }) {
  const base = selectedCustomer
    ? `${selectedCustomer} ${document.title || project || 'deck'}`
    : document.title || project || 'deck'
  return `${sanitizeFilePart(base)}.${extension}`
}

export async function waitForPaint() {
  await new Promise((r) => requestAnimationFrame(() => r()))
  await new Promise((r) => requestAnimationFrame(() => r()))
}

export async function settleExportFrame() {
  await waitForPaint()
  await wait(SETTLE_MS)
}

async function withAssetTimeout(promise, timeout, message) {
  let timer
  try {
    return await Promise.race([
      promise,
      new Promise((_, reject) => {
        timer = setTimeout(() => reject(new Error(message)), timeout)
      }),
    ])
  } finally {
    clearTimeout(timer)
  }
}

function waitForImage(img, timeout, signal) {
  const source = img.currentSrc || img.getAttribute('src') || img.getAttribute('srcset')
  if (!source) return Promise.resolve()
  const label = img.alt || source.slice(0, 160)

  return new Promise((resolve, reject) => {
    const loading = img.getAttribute('loading')
    let decoding = false
    let finished = false
    const done = (error) => {
      if (finished) return
      finished = true
      clearTimeout(timer)
      img.removeEventListener('load', loaded)
      img.removeEventListener('error', failed)
      signal.removeEventListener('abort', aborted)
      if (loading === null) img.removeAttribute('loading')
      else img.setAttribute('loading', loading)
      if (error) reject(error)
      else resolve()
    }
    const failed = () => done(new Error(`Could not load image "${label}". Check its URL and try exporting again.`))
    const aborted = () => done(new Error('Export asset loading cancelled.'))
    const loaded = async () => {
      if (decoding) return
      decoding = true
      if (!img.naturalWidth) return failed()
      try {
        await img.decode?.()
        done()
      } catch {
        failed()
      }
    }
    const timer = setTimeout(() => done(new Error(`Timed out loading image "${label}". Try exporting again when it has loaded.`)), timeout)
    img.addEventListener('load', loaded, { once: true })
    img.addEventListener('error', failed, { once: true })
    signal.addEventListener('abort', aborted, { once: true })
    img.loading = 'eager'
    if (img.complete) loaded()
  })
}

export async function waitForAssets(root, { timeout = ASSET_TIMEOUT_MS } = {}) {
  const ownerDocument = root?.ownerDocument || document
  if (ownerDocument.fonts?.ready) {
    await withAssetTimeout(ownerDocument.fonts.ready, timeout, 'Timed out loading slide fonts. Try exporting again when they have loaded.')
  }
  const images = Array.from(root?.querySelectorAll('img') || [])
    .filter((img) => !img.closest(EXPORT_IGNORE_SELECTOR))
  const controller = new AbortController()
  try {
    await Promise.all(images.map((img) => waitForImage(img, timeout, controller.signal)))
  } finally {
    controller.abort()
  }
}

export async function withExportMode(format, run) {
  const html = document.documentElement
  const prevMode = html.getAttribute('data-export-mode')
  const prevFormat = html.getAttribute('data-export-format')
  const prevWidth = html.style.getPropertyValue('--deckio-export-width')
  const prevHeight = html.style.getPropertyValue('--deckio-export-height')
  const prevFit = html.style.getPropertyValue('--deckio-export-fit-scale')
  const priorities = ['--deckio-export-width', '--deckio-export-height', '--deckio-export-fit-scale']
    .map((name) => html.style.getPropertyPriority(name))

  html.setAttribute('data-export-mode', 'capture')
  html.setAttribute('data-export-format', format)

  try {
    return await run()
  } finally {
    if (prevMode === null) html.removeAttribute('data-export-mode')
    else html.setAttribute('data-export-mode', prevMode)

    if (prevFormat === null) html.removeAttribute('data-export-format')
    else html.setAttribute('data-export-format', prevFormat)

    restoreCssVar(html, '--deckio-export-width', prevWidth, priorities[0])
    restoreCssVar(html, '--deckio-export-height', prevHeight, priorities[1])
    restoreCssVar(html, '--deckio-export-fit-scale', prevFit, priorities[2])
  }
}

function restoreCssVar(el, name, value, priority) {
  if (value) el.style.setProperty(name, value, priority)
  else el.style.removeProperty(name)
}

function saveInlineStyles(el, props) {
  if (!el) return () => {}
  const previous = props.map((prop) => {
    const name = prop.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`)
    return [name, el.style.getPropertyValue(name), el.style.getPropertyPriority(name)]
  })
  return () => {
    previous.forEach(([name, value, priority]) => {
      restoreCssVar(el, name, value, priority)
    })
  }
}

function applyStyles(el, styles) {
  if (!el) return
  Object.assign(el.style, styles)
}

function prepareExportStage(deck, slide, layout) {
  const html = document.documentElement
  const body = document.body
  const root = document.getElementById('root')
  const size = {
    width: `${layout.pixelWidth}px`,
    height: `${layout.pixelHeight}px`,
  }
  const restores = [
    saveInlineStyles(html, [
      'width', 'height', 'overflow',
      '--deckio-export-width', '--deckio-export-height', '--deckio-export-fit-scale',
    ]),
    saveInlineStyles(body, ['width', 'height', 'overflow']),
    saveInlineStyles(root, ['width', 'height', 'overflow']),
    saveInlineStyles(deck, ['width', 'height', 'overflow', 'position']),
    saveInlineStyles(slide, [
      'width',
      'height',
      'position',
      'inset',
      'left',
      'top',
      'opacity',
      'visibility',
      'pointerEvents',
      'transform',
      'transition',
      'maxWidth',
      'maxHeight',
      'boxSizing',
    ]),
  ]

  html.style.setProperty('--deckio-export-width', size.width)
  html.style.setProperty('--deckio-export-height', size.height)

  applyStyles(html, { ...size, overflow: 'hidden' })
  applyStyles(body, { ...size, overflow: 'hidden' })
  applyStyles(root, { ...size, overflow: 'hidden' })
  applyStyles(deck, { ...size, overflow: 'hidden', position: 'relative' })
  applyStyles(slide, {
    ...size,
    position: 'relative',
    inset: 'auto',
    left: '0',
    top: '0',
    opacity: '1',
    visibility: 'visible',
    pointerEvents: 'auto',
    transform: 'none',
    transition: 'none',
    maxWidth: 'none',
    maxHeight: 'none',
    boxSizing: 'border-box',
  })

  return () => {
    for (let i = restores.length - 1; i >= 0; i--) restores[i]()
  }
}

function isMeasurableSlideChild(child) {
  if (!(child instanceof Element)) return false
  if (child.matches('.slide-overflow-warn, [data-export-ignore="true"]')) return false
  const styles = getComputedStyle(child)
  if (styles.display === 'none' || styles.visibility === 'hidden') return false
  if (styles.position === 'absolute' || styles.position === 'fixed') return false
  return true
}

export function hasSlideOverflow(slide, tolerance = 2) {
  const slideRect = slide.getBoundingClientRect()
  return Array.from(slide.children).some((child) => {
    if (!isMeasurableSlideChild(child)) return false
    const rect = child.getBoundingClientRect()
    return rect.left < slideRect.left - tolerance
      || rect.top < slideRect.top - tolerance
      || rect.right > slideRect.right + tolerance
      || rect.bottom > slideRect.bottom + tolerance
  })
}

export async function resolveFitScale(slide, fit) {
  if (fit?.id !== 'auto') return fit?.scale || 1

  const html = document.documentElement
  for (const scale of AUTO_FIT_SCALES) {
    html.style.setProperty('--deckio-export-fit-scale', String(scale))
    await waitForPaint()
    if (!hasSlideOverflow(slide)) return scale
  }
  return AUTO_FIT_SCALES[AUTO_FIT_SCALES.length - 1]
}

export function pauseAnimations(slide) {
  const undo = []
  let animations = []
  try {
    animations = slide.getAnimations?.({ subtree: true }) || []
  } catch {
    animations = []
  }
  for (const animation of animations) {
    if (animation.playState === 'finished' || animation.playState === 'idle') continue
    const { currentTime, playState } = animation
    const endTime = animation.effect?.getComputedTiming().endTime
    animation.pause()
    if (Number.isFinite(endTime)) animation.currentTime = animation.playbackRate < 0 ? 0 : endTime
    undo.push(() => {
      animation.currentTime = currentTime
      if (playState === 'running') animation.play()
    })
  }
  const pause = (el) => {
    const restore = saveInlineStyles(el, ['animationPlayState'])
    el.style.setProperty('animation-play-state', 'paused', 'important')
    undo.push(restore)
  }
  pause(slide)
  slide.querySelectorAll('*').forEach(pause)
  return () => { for (let i = undo.length - 1; i >= 0; i--) undo[i]() }
}

// Upper bound on synthesized forward-key presses while flushing a slide's
// progressive disclosure. Comfortably above any realistic step count; the loop
// also stops early the moment a press no longer mutates the slide.
const MAX_DISCLOSURE_STEPS = 40

/**
 * Drive a slide's progressive disclosure to its final, fully-revealed state.
 *
 * Slides built with the engine's `useDisclosure` hook already reveal everything
 * during export (they observe `useIsExporting`). But decks may contain
 * hand-rolled slides that keep their own step state and only advance on forward
 * keys. For those we synthesize forward-key presses (→) until the slide stops
 * changing, so the capture shows the final composition rather than step 0.
 *
 * This is safe because keyboard navigation is suppressed while exporting
 * (SlideContext ignores keys when `isExportingNow()`), so an "overshoot" press
 * past the last step cannot advance to the next slide — it is simply a no-op,
 * which the mutation check below detects to end the loop.
 */
export async function revealDisclosureSteps(slide) {
  if (!slide
    || typeof MutationObserver !== 'function'
    || typeof KeyboardEvent !== 'function') return

  let mutated = false
  const observer = new MutationObserver(() => { mutated = true })
  observer.observe(slide, { subtree: true, childList: true, attributes: true, characterData: true })

  try {
    for (let i = 0; i < MAX_DISCLOSURE_STEPS; i++) {
      mutated = false
      const target = document.activeElement || document.body || document
      target.dispatchEvent(new KeyboardEvent('keydown', {
        key: 'ArrowRight',
        code: 'ArrowRight',
        bubbles: true,
        cancelable: true,
        composed: true,
      }))
      await waitForPaint()
      if (!mutated) break
    }
  } finally {
    observer.disconnect()
  }
}

function preserveTextMetrics(slide) {
  const metrics = [slide, ...slide.querySelectorAll('*')]
    .map((el) => [el, getComputedStyle(el).fontKerning])
  const restores = metrics.map(([el, kerning]) => {
    const restore = saveInlineStyles(el, ['fontKerning'])
    // modern-screenshot otherwise changes Chrome's default "auto" to "normal",
    // which changes glyph widths and can wrap an exactly fitted badge.
    el.style.setProperty('font-kerning', kerning, 'important')
    return restore
  })
  return () => restores.forEach((restore) => restore())
}

function assertEmbeddedAssets(svg) {
  const urls = []
  const collect = (style) => {
    for (const property of [
      'background-image', 'border-image-source', '-webkit-border-image',
      'mask-image', '-webkit-mask-image', 'list-style-image',
      'fill', 'stroke', 'filter', 'clip-path', 'content', 'src',
    ]) {
      for (const match of style.getPropertyValue(property).matchAll(/url\(\s*(['"]?)(.*?)\1\s*\)/g)) urls.push(match[2])
    }
  }
  const collectRules = (rules) => {
    for (const rule of rules) {
      if (rule.style) collect(rule.style)
      if (rule.cssRules) collectRules(rule.cssRules)
    }
  }
  for (const node of svg.querySelectorAll('[style], style')) {
    if (node.tagName.toLowerCase() === 'style') {
      const sheet = new CSSStyleSheet()
      sheet.replaceSync(node.textContent)
      collectRules(sheet.cssRules)
    } else {
      collect(node.style)
    }
  }
  for (const node of svg.querySelectorAll('img, image')) {
    urls.push(node.getAttribute('src') || node.getAttribute('href') || node.getAttribute('xlink:href') || '')
  }
  const external = urls.find((url) => url && !url.startsWith('#') && !url.startsWith('data:'))
  if (external) {
    throw new Error(`Could not embed export asset "${external.slice(0, 160)}". Check that images and fonts allow cross-origin access.`)
  }
}

export async function captureSlidePng({
  domToCanvas,
  deck,
  slide,
  layout,
  quality,
  fit,
  backgroundColor,
}) {
  const restores = [prepareExportStage(deck, slide, layout)]

  try {
    await waitForPaint()
    await revealDisclosureSteps(slide)
    await waitForAssets(slide)
    restores.push(pauseAnimations(slide))
    restores.push(preserveTextMetrics(slide))
    await waitForPaint()
    const fitScale = await resolveFitScale(slide, fit)
    document.documentElement.style.setProperty('--deckio-export-fit-scale', String(fitScale))
    await waitForPaint()
    const canvas = await domToCanvas(slide, {
      width: layout.pixelWidth,
      height: layout.pixelHeight,
      scale: quality.scale,
      timeout: ASSET_TIMEOUT_MS,
      filter: (node) => !(node instanceof Element && node.matches(EXPORT_IGNORE_SELECTOR)),
      fetch: { placeholderImage: '' },
      onCreateForeignObjectSvg: assertEmbeddedAssets,
      style: {
        position: 'relative',
        inset: 'auto',
        left: '0',
        top: '0',
        width: `${layout.pixelWidth}px`,
        height: `${layout.pixelHeight}px`,
        maxWidth: 'none',
        maxHeight: 'none',
        boxSizing: 'border-box',
        opacity: '1',
        visibility: 'visible',
        transform: 'none',
        transition: 'none',
      },
    })
    if (canvas.width !== layout.pixelWidth * quality.scale || canvas.height !== layout.pixelHeight * quality.scale) {
      throw new Error('The browser could not capture this slide at the requested size. Try Standard quality.')
    }
    const context = canvas.getContext('2d')
    if (!context) throw new Error('The browser could not create an export image.')
    // Paint behind the capture, never over a slide's own background or gradient.
    context.save()
    context.globalCompositeOperation = 'destination-over'
    context.fillStyle = backgroundColor
    context.fillRect(0, 0, canvas.width, canvas.height)
    context.restore()
    const png = canvas.toDataURL('image/png')
    canvas.width = 0
    canvas.height = 0
    if (!png.startsWith('data:image/png;base64,')) throw new Error('The browser returned an empty export image. Try Standard quality.')
    return png
  } finally {
    for (let i = restores.length - 1; i >= 0; i--) restores[i]()
  }
}
