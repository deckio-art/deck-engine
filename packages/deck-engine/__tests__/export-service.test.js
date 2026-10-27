import { describe, expect, it, afterEach, vi } from 'vitest'
import {
  DEFAULT_EXPORT_OPTIONS,
  EXPORT_FITS,
  EXPORT_LAYOUTS,
  EXPORT_QUALITIES,
  buildExportFileName,
  getLayoutPageFormat,
  getPdfOrientation,
  neutralizeClippedText,
  normalizeHexColor,
  parseFirstGradientColor,
  resolveExportOptions,
  sanitizeFilePart,
  waitForAssets,
} from '../components/exportDeckService.js'

describe('exportDeckService presets', () => {
  afterEach(() => {
    delete globalThis.document
    vi.useRealTimers()
  })

  it('defaults to the common PowerPoint widescreen layout with high quality and auto fit', () => {
    const options = resolveExportOptions()

    expect(DEFAULT_EXPORT_OPTIONS).toEqual({
      layout: 'widescreen-16-9',
      quality: 'high',
      fit: 'auto',
    })
    expect(options.layout).toMatchObject({
      id: 'widescreen-16-9',
      widthIn: 13.333333,
      heightIn: 7.5,
      pixelWidth: 1920,
      pixelHeight: 1080,
    })
    expect(options.quality.scale).toBe(2)
    expect(options.fit.id).toBe('auto')
  })

  it('offers a small set of standard export sizes', () => {
    expect(EXPORT_LAYOUTS.map((layout) => layout.id)).toEqual([
      'widescreen-16-9',
      'standard-4-3',
      'a4-landscape',
      'letter-landscape',
    ])
  })

  it('offers explicit quality and fit controls', () => {
    expect(EXPORT_QUALITIES.map((quality) => [quality.id, quality.scale])).toEqual([
      ['high', 2],
      ['standard', 1],
    ])
    expect(EXPORT_FITS.map((fit) => fit.id)).toEqual(['auto', '1.2', '1', '0.9', '0.8'])
  })

  it('falls back safely when persisted or caller-provided options are stale', () => {
    const options = resolveExportOptions({
      layout: 'deleted-layout',
      quality: 'deleted-quality',
      fit: 'deleted-fit',
    })

    expect(options.layout.id).toBe(DEFAULT_EXPORT_OPTIONS.layout)
    expect(options.quality.id).toBe(DEFAULT_EXPORT_OPTIONS.quality)
    expect(options.fit.id).toBe(DEFAULT_EXPORT_OPTIONS.fit)
  })

  it('uses physical page dimensions for PDF and PPTX consumers', () => {
    const { layout } = resolveExportOptions({ layout: 'a4-landscape' })

    expect(getPdfOrientation(layout)).toBe('landscape')
    expect(getLayoutPageFormat(layout)).toEqual([11.6929, 8.2677])
  })

  it('normalizes background colors for PowerPoint', () => {
    expect(normalizeHexColor('#abc')).toBe('AABBCC')
    expect(normalizeHexColor('123456')).toBe('123456')
    expect(normalizeHexColor('rgb(171, 205, 239)')).toBe('ABCDEF')
    expect(normalizeHexColor('rgb(100% 0% 50%)')).toBe('FF0080')
    expect(normalizeHexColor('not-a-color')).toBe('080B10')
  })

  it('builds stable file names for selected customers', () => {
    globalThis.document = { title: 'Quarterly Review' }

    expect(sanitizeFilePart('  Hello, Deck.io!  ')).toBe('hello-deck-io')
    expect(buildExportFileName({
      selectedCustomer: 'Contoso Ltd.',
      project: 'ignored',
      extension: 'pptx',
    })).toBe('contoso-ltd-quarterly-review.pptx')
  })

})

function makeImage({ complete = false, naturalWidth = 0, loading, decode = vi.fn().mockResolvedValue() } = {}) {
  const attributes = new Map([['src', '/image.png']])
  if (loading) attributes.set('loading', loading)
  const img = Object.assign(new EventTarget(), {
    complete,
    naturalWidth,
    decode,
    alt: 'Slide image',
    closest: () => null,
    getAttribute: (name) => attributes.get(name) ?? null,
    setAttribute: (name, value) => attributes.set(name, value),
    removeAttribute: (name) => attributes.delete(name),
  })
  Object.defineProperty(img, 'loading', {
    get: () => attributes.get('loading'),
    set: (value) => attributes.set('loading', value),
  })
  return img
}

describe('export asset readiness', () => {
  afterEach(() => {
    delete globalThis.document
    vi.useRealTimers()
  })

  it('rejects an already broken image rather than hanging or exporting an empty placeholder', async () => {
    globalThis.document = {}
    await expect(waitForAssets({
      querySelectorAll: () => [makeImage({ complete: true })],
    })).rejects.toThrow('Could not load image "Slide image"')
  })

  it('loads lazy images, awaits decoding, and restores their loading attribute', async () => {
    globalThis.document = {}
    let decoded
    const img = makeImage({
      naturalWidth: 100,
      loading: 'lazy',
      decode: vi.fn(() => new Promise((resolve) => { decoded = resolve })),
    })
    const ready = waitForAssets({ querySelectorAll: () => [img] })
    expect(img.loading).toBe('eager')
    img.dispatchEvent(new Event('load'))
    expect(img.decode).toHaveBeenCalledOnce()
    decoded()
    await ready
    expect(img.loading).toBe('lazy')
  })

  it('bounds image waits and removes event listeners even if the request never finishes', async () => {
    vi.useFakeTimers()
    globalThis.document = {}
    const img = makeImage({ loading: 'lazy' })
    const remove = vi.spyOn(img, 'removeEventListener')
    const failed = expect(waitForAssets({
      querySelectorAll: () => [img],
    }, { timeout: 50 })).rejects.toThrow('Timed out loading image')
    await vi.advanceTimersByTimeAsync(50)
    await failed
    expect(img.loading).toBe('lazy')
    expect(remove).toHaveBeenCalledWith('load', expect.any(Function))
    expect(remove).toHaveBeenCalledWith('error', expect.any(Function))
    expect(vi.getTimerCount()).toBe(0)
  })

  it('cancels the other image waits when one asset fails', async () => {
    vi.useFakeTimers()
    globalThis.document = {}
    const broken = makeImage({ complete: true })
    const pending = makeImage({ loading: 'lazy' })
    await expect(waitForAssets({
      querySelectorAll: () => [broken, pending],
    })).rejects.toThrow('Could not load image')
    expect(pending.loading).toBe('lazy')
    expect(vi.getTimerCount()).toBe(0)
  })

  it('bounds font readiness as well as image requests', async () => {
    vi.useFakeTimers()
    globalThis.document = { fonts: { ready: new Promise(() => {}) } }
    const failed = expect(waitForAssets({
      querySelectorAll: () => [],
    }, { timeout: 50 })).rejects.toThrow('Timed out loading slide fonts')
    await vi.advanceTimersByTimeAsync(50)
    await failed
    expect(vi.getTimerCount()).toBe(0)
  })

  it('ignores assets belonging to editor chrome explicitly excluded from export', async () => {
    globalThis.document = {}
    const ignored = makeImage({ complete: true })
    ignored.closest = () => ({})
    await expect(waitForAssets({
      querySelectorAll: () => [ignored],
    })).resolves.toBeUndefined()
  })
})

describe('parseFirstGradientColor', () => {
  it('pulls the first solid color out of a gradient for flattening clipped text', () => {
    expect(parseFirstGradientColor('linear-gradient(135deg, rgb(99, 102, 241), rgb(0, 0, 0))'))
      .toBe('rgb(99, 102, 241)')
    expect(parseFirstGradientColor('linear-gradient(90deg, rgba(16, 185, 129, 0.8) 0%, #000 100%)'))
      .toBe('rgba(16, 185, 129, 0.8)')
    expect(parseFirstGradientColor('radial-gradient(hsl(280, 90%, 60%), hsl(0, 0%, 0%))'))
      .toBe('hsl(280, 90%, 60%)')
    expect(parseFirstGradientColor('linear-gradient(#6366f1, #000000)')).toBe('#6366f1')
  })

  it('returns null when there is no usable color to flatten to', () => {
    expect(parseFirstGradientColor('none')).toBeNull()
    expect(parseFirstGradientColor('')).toBeNull()
    expect(parseFirstGradientColor(undefined)).toBeNull()
    expect(parseFirstGradientColor('url(image.png)')).toBeNull()
  })
})

describe('neutralizeClippedText', () => {
  const originalGetComputedStyle = globalThis.getComputedStyle
  const originalElement = globalThis.Element

  afterEach(() => {
    globalThis.getComputedStyle = originalGetComputedStyle
    globalThis.Element = originalElement
  })

  class FakeElement {
    constructor(computed) {
      this.style = {}
      this.__computed = computed
      this.children = []
    }
    querySelectorAll() {
      return this.children
    }
  }

  function install() {
    globalThis.Element = FakeElement
    globalThis.getComputedStyle = (el) => el.__computed
  }

  it('flattens gradient-clipped text to a solid color and restores afterward', () => {
    install()
    const clipped = new FakeElement({
      webkitBackgroundClip: 'text',
      backgroundClip: 'text',
      backgroundImage: 'linear-gradient(135deg, rgb(99, 102, 241), rgb(0, 0, 0))',
    })

    const restore = neutralizeClippedText(clipped, '#ffffff')

    expect(clipped.style.backgroundImage).toBe('none')
    expect(clipped.style.webkitTextFillColor).toBe('rgb(99, 102, 241)')
    expect(clipped.style.color).toBe('rgb(99, 102, 241)')

    restore()
    expect(clipped.style.backgroundImage).toBeUndefined()
    expect(clipped.style.webkitTextFillColor).toBeUndefined()
  })

  it('falls back to the provided color when no gradient color can be parsed', () => {
    install()
    const clipped = new FakeElement({
      webkitBackgroundClip: 'text',
      backgroundImage: 'none',
    })

    neutralizeClippedText(clipped, '#facc15')
    expect(clipped.style.webkitTextFillColor).toBe('#facc15')
    expect(clipped.style.color).toBe('#facc15')
  })

  it('leaves ordinary text untouched', () => {
    install()
    const plain = new FakeElement({
      webkitBackgroundClip: 'border-box',
      backgroundImage: 'none',
    })

    const restore = neutralizeClippedText(plain, '#ffffff')
    expect(plain.style).toEqual({})
    restore()
    expect(plain.style).toEqual({})
  })

  it('is a safe no-op when getComputedStyle is unavailable', () => {
    delete globalThis.getComputedStyle
    expect(() => neutralizeClippedText({}, '#ffffff')()).not.toThrow()
  })
})
