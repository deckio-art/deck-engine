const DEFAULT_PAGE_WIDTH = 1920
const DEFAULT_PAGE_HEIGHT = 1080
const EXPORT_TRANSITION_MS = 750

function wait(ms) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

async function waitForPaint() {
  await new Promise((resolve) => requestAnimationFrame(() => resolve()))
  await new Promise((resolve) => requestAnimationFrame(() => resolve()))
}

async function waitForFonts() {
  if (document.fonts?.ready) {
    await document.fonts.ready
  }
}

function sanitizeFileName(value) {
  return String(value || 'deck')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'deck'
}

function getDeckElement() {
  return document.querySelector('.deck')
}

function getSlideNodes(deckElement) {
  return Array.from(deckElement?.querySelectorAll('.slide') || [])
}

function getExportFileName({ project, selectedCustomer }) {
  const baseName = selectedCustomer
    ? `${selectedCustomer} ${document.title || project || 'deck'}`
    : document.title || project || 'deck'

  return `${sanitizeFileName(baseName)}.pdf`
}

function triggerDownload(blob, fileName) {
  const blobUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = blobUrl
  link.download = fileName
  document.body.append(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(blobUrl), 1000)
}

export async function exportDeckPdf({
  current,
  goTo,
  project,
  selectedCustomer,
  totalSlides,
  onProgress,
}) {
  const deckElement = getDeckElement()
  const slideNodes = getSlideNodes(deckElement)

  if (!deckElement || slideNodes.length === 0) {
    throw new Error('No slides found to export')
  }

  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
    import('html2canvas'),
    import('jspdf'),
  ])

  const pageWidth = deckElement.clientWidth || DEFAULT_PAGE_WIDTH
  const pageHeight = deckElement.clientHeight || DEFAULT_PAGE_HEIGHT
  const backgroundColor = getComputedStyle(document.documentElement)
    .getPropertyValue('--bg-deep')
    .trim() || '#080b10'
  const scale = Math.min(window.devicePixelRatio || 1, 2)
  const pdf = new jsPDF({
    orientation: 'landscape',
    unit: 'px',
    format: [DEFAULT_PAGE_WIDTH, DEFAULT_PAGE_HEIGHT],
    compress: true,
    hotfixes: ['px_scaling'],
  })

  await waitForFonts()

  try {
    for (let index = 0; index < totalSlides; index += 1) {
      onProgress?.({ current: index + 1, total: totalSlides })
      goTo(index)
      await waitForPaint()
      await wait(EXPORT_TRANSITION_MS)

      const activeSlide = document.querySelector('.slide.active') || slideNodes[index]
      if (!activeSlide) {
        throw new Error(`Slide ${index + 1} could not be rendered`)
      }

      const canvas = await html2canvas(activeSlide, {
        backgroundColor,
        useCORS: true,
        allowTaint: true,
        logging: false,
        scale,
        width: pageWidth,
        height: pageHeight,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
      })

      const imageData = canvas.toDataURL('image/png')
      if (index > 0) {
        pdf.addPage([DEFAULT_PAGE_WIDTH, DEFAULT_PAGE_HEIGHT], 'landscape')
      }

      pdf.addImage(imageData, 'PNG', 0, 0, DEFAULT_PAGE_WIDTH, DEFAULT_PAGE_HEIGHT, undefined, 'FAST')
    }
  } finally {
    goTo(current)
    await waitForPaint()
  }

  const blob = pdf.output('blob')
  const fileName = getExportFileName({ project, selectedCustomer })
  triggerDownload(blob, fileName)

  return { fileName }
}