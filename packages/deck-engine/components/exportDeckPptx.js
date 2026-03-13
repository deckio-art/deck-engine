/**
 * Export deck slides to PowerPoint (.pptx) — direct download, no dialogs.
 *
 * Uses modern-screenshot (SVG foreignObject) + PptxGenJS.
 * Each slide is captured as a full-bleed image placed on a 10×5.625″ slide (16:9).
 */

const PAGE_W = 1920
const PAGE_H = 1080
const SETTLE_MS = 600

const wait = (ms) => new Promise((r) => setTimeout(r, ms))

async function waitForPaint() {
  await new Promise((r) => requestAnimationFrame(() => r()))
  await new Promise((r) => requestAnimationFrame(() => r()))
}

function sanitize(v) {
  return String(v || 'deck').trim().toLowerCase()
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'deck'
}

function buildFileName({ project, selectedCustomer }) {
  const base = selectedCustomer
    ? `${selectedCustomer} ${document.title || project || 'deck'}`
    : document.title || project || 'deck'
  return `${sanitize(base)}.pptx`
}

function pauseAnimations(slide) {
  const undo = []
  const pause = (el) => {
    const orig = el.style.animationPlayState
    el.style.animationPlayState = 'paused'
    undo.push(() => { el.style.animationPlayState = orig })
  }
  pause(slide)
  slide.querySelectorAll('*').forEach(pause)
  return () => { for (let i = undo.length - 1; i >= 0; i--) undo[i]() }
}

export async function exportDeckPptx({
  current,
  goTo,
  project,
  selectedCustomer,
  totalSlides,
  onProgress,
}) {
  const deck = document.querySelector('.deck')
  const slides = Array.from(deck?.querySelectorAll('.slide') || [])
  if (!deck || slides.length === 0) throw new Error('No slides found')

  const [{ domToPng }, PptxGenJS] = await Promise.all([
    import('modern-screenshot'),
    import('pptxgenjs'),
  ])
  const Pptx = PptxGenJS.default || PptxGenJS

  const bg = getComputedStyle(document.documentElement)
    .getPropertyValue('--background').trim() || '#080b10'
  const scale = Math.min(window.devicePixelRatio || 1, 2)

  const pptx = new Pptx()
  pptx.defineLayout({ name: 'WIDE', width: 10, height: 5.625 })
  pptx.layout = 'WIDE'

  if (document.fonts?.ready) await document.fonts.ready

  const origDeckCss = deck.style.cssText
  deck.style.width = `${PAGE_W}px`
  deck.style.height = `${PAGE_H}px`
  await waitForPaint()
  await wait(SETTLE_MS)

  try {
    for (let i = 0; i < totalSlides; i++) {
      onProgress?.({ current: i + 1, total: totalSlides })
      goTo(i)
      await waitForPaint()
      await wait(SETTLE_MS)

      const active = document.querySelector('.slide.active') || slides[i]
      if (!active) throw new Error(`Slide ${i + 1} not found`)

      const restore = pauseAnimations(active)
      await waitForPaint()

      let dataUrl
      try {
        dataUrl = await domToPng(active, {
          width: PAGE_W,
          height: PAGE_H,
          backgroundColor: bg,
          scale,
          style: {
            opacity: '1',
            transform: 'none',
            transition: 'none',
          },
        })
      } finally {
        restore()
      }

      const slide = pptx.addSlide()
      slide.background = { color: bg.replace('#', '') }
      slide.addImage({
        data: dataUrl,
        x: 0,
        y: 0,
        w: '100%',
        h: '100%',
      })
    }
  } finally {
    deck.style.cssText = origDeckCss
    goTo(current)
    await waitForPaint()
  }

  const fileName = buildFileName({ project, selectedCustomer })
  await pptx.writeFile({ fileName })

  return { fileName }
}
