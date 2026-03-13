/**
 * Export deck slides to PDF — direct download, no dialogs.
 *
 * Uses modern-screenshot (SVG foreignObject) + jspdf.
 * The browser's own renderer handles all CSS natively:
 *   - background-clip: text  ✅  (explicit fix in modern-screenshot)
 *   - filter: blur()         ✅  (native foreignObject rendering)
 *   - gradients, shadows     ✅
 *   - animations             paused before capture
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
  return `${sanitize(base)}.pdf`
}

/**
 * Pause animations on a slide for deterministic capture. Returns restore fn.
 */
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

export async function exportDeckPdf({
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

  // Dynamic imports — tree-shaken, only loaded on export
  const [{ domToPng }, { jsPDF }] = await Promise.all([
    import('modern-screenshot'),
    import('jspdf'),
  ])

  const bg = getComputedStyle(document.documentElement)
    .getPropertyValue('--background').trim() || '#080b10'
  const scale = Math.min(window.devicePixelRatio || 1, 2)

  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [PAGE_W, PAGE_H],
    compress: true,
    hotfixes: ['px_scaling'],
  })

  if (document.fonts?.ready) await document.fonts.ready

  // Force deck to canonical PDF dimensions so slides render at exactly
  // PAGE_W × PAGE_H regardless of the current viewport size.
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
            // Ensure the captured element is visible and static
            opacity: '1',
            transform: 'none',
            transition: 'none',
          },
        })
      } finally {
        restore()
      }

      if (i > 0) pdf.addPage([PAGE_W, PAGE_H], 'landscape')
      pdf.addImage(dataUrl, 'PNG', 0, 0, PAGE_W, PAGE_H, undefined, 'FAST')
    }
  } finally {
    deck.style.cssText = origDeckCss
    goTo(current)
    await waitForPaint()
  }

  // Direct download — no dialog
  const blob = pdf.output('blob')
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = buildFileName({ project, selectedCustomer })
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)

  return { fileName: a.download }
}
