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
 *
 * The plugin also integrates Tailwind CSS v4 via @tailwindcss/vite
 * and injects the selected theme CSS from deck.config.js.
 */
import tailwindcss from '@tailwindcss/vite'
import { resolveTheme, getAvailableThemes, DEFAULT_THEME, BUILTIN_THEMES } from './themes/theme-loader.js'

// Re-export theme utilities for Node.js consumers
export { resolveTheme, getAvailableThemes, DEFAULT_THEME, BUILTIN_THEMES }

/**
 * @param {object} [options]
 * @param {string} [options.theme] - Theme name or path. Defaults to "dark".
 */
export function deckPlugin(options = {}) {
  const themePath = resolveTheme(options.theme)

  return {
    name: 'deck-engine',
    enforce: 'pre',
    config() {
      return {
        resolve: {
          dedupe: ['react', 'react-dom'],
        },
        // Tailwind CSS v4 is added via the companion tailwindPlugin()
      }
    },
  }
}

/**
 * Returns an array of Vite plugins for a deck-engine project:
 * - deckPlugin (react dedup + theme injection)
 * - @tailwindcss/vite plugins (Tailwind CSS v4 processing)
 *
 * Use this in vite.config.js when you want the full setup in one call.
 *
 * @param {object} [options]
 * @param {string} [options.theme] - Theme name or path.
 */
export function deckPlugins(options = {}) {
  return [
    deckPlugin(options),
    ...tailwindcss(),
  ]
}

/**
 * Returns the @tailwindcss/vite plugin for projects that want
 * to compose their own plugin array.
 */
export function tailwindPlugin() {
  return tailwindcss()
}

export default deckPlugin
