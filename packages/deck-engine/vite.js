/**
 * Vite plugin for deck-engine projects.
 *
 * The main entry (@deckio/deck-engine) is pre-bundled by Vite
 * into a single module so SlideContext, SlideProvider, useSlides, Slide,
 * Navigation, and BottomBar all share one React context instance.
 *
 * Sub-path exports (e.g. slides/GenericThankYouSlide) are served as raw
 * source and import from the package name (not relative paths) so they
 * also resolve to the pre-bundled context singleton.
 */
export function deckPlugin() {
  return {
    name: 'deck-engine',
    enforce: 'pre',
    config() {
      return {
        resolve: {
          dedupe: ['react', 'react-dom'],
        },
      }
    },
  }
}

export default deckPlugin
