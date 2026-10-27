import { describe, expect, it } from 'vitest'
import { readFileSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const engineRoot = join(__dirname, '..')

function readEngineFile(...parts) {
  return readFileSync(join(engineRoot, ...parts), 'utf-8')
}

describe('export wiring', () => {
  it('routes PDF and PowerPoint through the shared export service', () => {
    const pdf = readEngineFile('components', 'exportDeckPdf.js')
    const pptx = readEngineFile('components', 'exportDeckPptx.js')

    expect(pdf).toContain("from './exportDeckService.js'")
    expect(pdf).toContain('unit: \'in\'')
    expect(pdf).toContain('getLayoutPageFormat(layout)')
    expect(pdf).toContain('captureSlidePng({')

    expect(pptx).toContain("from './exportDeckService.js'")
    expect(pptx).toContain('pptx.defineLayout({ name: layout.id')
    expect(pptx).toContain('w: layout.widthIn')
    expect(pptx).toContain('captureSlidePng({')
  })

  it('exposes size, fit, and quality controls from Navigation', () => {
    const source = readEngineFile('components', 'Navigation.jsx')

    expect(source).toContain('EXPORT_LAYOUTS')
    expect(source).toContain('EXPORT_FITS')
    expect(source).toContain('EXPORT_QUALITIES')
    expect(source).toContain('Export deck options')
    expect(source).toContain('exportOptions')
  })

  it('has export-mode CSS for fixed stage sizing and hidden editor chrome', () => {
    const source = readEngineFile('styles', 'global.css')

    expect(source).toContain('html[data-export-mode="capture"]')
    expect(source).toContain('--deckio-export-width')
    expect(source).toContain('--deckio-export-fit-scale')
    expect(source).toContain('.deckio-editable')
    expect(source).toContain('[data-deckio-export-ignore="true"]')
  })

  it('reveals progressive-disclosure steps without changing badge sizing', () => {
    const source = readEngineFile('styles', 'global.css')

    expect(source).toContain('.deck-steps-step')
    expect(source).not.toContain('html[data-export-mode="capture"] [class*="badge" i]')
    expect(source).not.toContain('html[data-export-mode="capture"] [data-slot="badge"]')
  })

  it('preserves gradient-clipped text when rasterizing each slide', () => {
    const service = readEngineFile('components', 'exportDeckService.js')

    expect(service).not.toContain('neutralizeClippedText(slide')
    expect(service).toContain('domToCanvas(slide')
  })

  it('preserves editable backgrounds and gradient-clipped text on export', () => {
    const source = readEngineFile('styles', 'global.css')

    expect(source).not.toContain('background-color: transparent !important')
    expect(source).not.toContain('background: transparent !important')
  })

  it('forces every disclosure step visible during export via the engine hook', () => {
    const steps = readEngineFile('slides', 'GenericStepsSlide.jsx')
    const hook = readEngineFile('context', 'useDisclosure.js')
    const index = readEngineFile('index.js')

    // The blessed steps slide builds on the shared disclosure hook...
    expect(steps).toContain('useDisclosure')
    expect(steps).toContain('effectiveVisible')
    // ...which reveals every step while a capture is running.
    expect(hook).toContain('useIsExporting')
    expect(hook).toContain('exporting ? safeTotal')
    expect(index).toContain('useDisclosure')
    expect(index).toContain('useIsExporting')
  })

  it('drives hand-rolled disclosure slides to their final state during capture', () => {
    const service = readEngineFile('components', 'exportDeckService.js')
    const slideContext = readEngineFile('context', 'SlideContext.jsx')

    // Export pump: synthesize forward keys until the slide stops mutating.
    expect(service).toContain('revealDisclosureSteps(slide)')
    expect(service).toContain("key: 'ArrowRight'")
    // Navigation is suppressed during capture so an overshoot press past the
    // last step is a harmless no-op instead of advancing to the next slide.
    expect(slideContext).toContain('if (isExportingNow()) return')
  })

  it('settles finite reveals and restores the original animation playback', () => {
    const service = readEngineFile('components', 'exportDeckService.js')

    expect(service).toContain('getAnimations?.({ subtree: true })')
    expect(service).toContain('Number.isFinite(endTime)')
    expect(service).toContain('animation.pause()')
    expect(service).toContain('animation.currentTime = currentTime')
    expect(service).toContain('restores.push(pauseAnimations(slide))')
  })
})
