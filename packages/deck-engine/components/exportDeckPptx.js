/**
 * Export deck slides to PowerPoint (.pptx) - direct download, no dialogs.
 *
 * Uses the same shared capture path as PDF, then places each capture
 * full-bleed on a standard PptxGenJS layout.
 */
import {
  buildExportFileName,
  captureSlidePng,
  getSlideBackground,
  normalizeHexColor,
  resolveExportOptions,
  settleExportFrame,
  waitForPaint,
  withExportMode,
} from './exportDeckService.js'

export async function exportDeckPptx({
  current,
  goTo,
  project,
  selectedCustomer,
  totalSlides,
  onProgress,
  exportOptions,
}) {
  const deck = document.querySelector('.deck')
  const slides = Array.from(deck?.querySelectorAll('.slide') || [])
  if (!deck || slides.length === 0) throw new Error('No slides found')

  const [{ domToCanvas }, PptxGenJS] = await Promise.all([
    import('modern-screenshot'),
    import('pptxgenjs'),
  ])
  const Pptx = PptxGenJS.default || PptxGenJS

  const { layout, quality, fit } = resolveExportOptions(exportOptions)
  const bg = getSlideBackground()

  const pptx = new Pptx()
  pptx.defineLayout({ name: layout.id, width: layout.widthIn, height: layout.heightIn })
  pptx.layout = layout.id

  await withExportMode('pptx', async () => {
    await settleExportFrame()

    try {
      for (let i = 0; i < totalSlides; i++) {
        onProgress?.({ current: i + 1, total: totalSlides })
        goTo(i)
        await waitForPaint()
        await settleExportFrame()

        const active = deck.querySelector('.slide.active') || slides[i]
        if (!active) throw new Error(`Slide ${i + 1} not found`)

        const dataUrl = await captureSlidePng({
          domToCanvas,
          deck,
          slide: active,
          layout,
          quality,
          fit,
          backgroundColor: bg,
        }).catch((error) => { throw new Error(`Slide ${i + 1}: ${error.message}`, { cause: error }) })

        const slide = pptx.addSlide()
        slide.background = { color: normalizeHexColor(bg) }
        slide.addImage({
          data: dataUrl,
          x: 0,
          y: 0,
          w: layout.widthIn,
          h: layout.heightIn,
        })
      }
    } finally {
      goTo(current)
      await waitForPaint()
    }
  })

  const fileName = buildExportFileName({ project, selectedCustomer, extension: 'pptx' })
  await pptx.writeFile({ fileName })

  return { fileName, layout: layout.id }
}
