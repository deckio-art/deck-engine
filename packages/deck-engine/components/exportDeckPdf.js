/**
 * Export deck slides to PDF - direct download, no dialogs.
 *
 * Uses modern-screenshot for browser-native rendering and jsPDF with physical
 * page units so exported files open at standard slide/paper sizes.
 */
import {
  buildExportFileName,
  captureSlidePng,
  getLayoutPageFormat,
  getPdfOrientation,
  getSlideBackground,
  resolveExportOptions,
  settleExportFrame,
  waitForPaint,
  withExportMode,
} from './exportDeckService.js'

export async function exportDeckPdf({
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

  const [{ domToCanvas }, { jsPDF }] = await Promise.all([
    import('modern-screenshot'),
    import('jspdf'),
  ])

  const { layout, quality, fit } = resolveExportOptions(exportOptions)
  const bg = getSlideBackground()
  const orientation = getPdfOrientation(layout)
  const pageFormat = getLayoutPageFormat(layout)

  const pdf = new jsPDF({
    orientation,
    unit: 'in',
    format: pageFormat,
    compress: true,
  })

  await withExportMode('pdf', async () => {
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

        if (i > 0) pdf.addPage(pageFormat, orientation)
        pdf.addImage(dataUrl, 'PNG', 0, 0, layout.widthIn, layout.heightIn, undefined, 'FAST')
      }
    } finally {
      goTo(current)
      await waitForPaint()
    }
  })

  const blob = pdf.output('blob')
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = buildExportFileName({ project, selectedCustomer, extension: 'pdf' })
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 1000)

  return { fileName: a.download, layout: layout.id }
}
