import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react'

/*  ╔══════════════════════════════════════════════════════════════╗
 *  ║                                                              ║
 *  ║   ▂▃▅▇█  S L I D E   C O N T E X T  █▇▅▃▂                  ║
 *  ║                                                              ║
 *  ║   Central state for slide navigation, persistence,           ║
 *  ║   keyboard / touch input, and customer selection.            ║
 *  ║                                                              ║
 *  ╚══════════════════════════════════════════════════════════════╝  */

const SlideContext = createContext()

/*  ┌─────────────────────────────────────────────────────────────┐
 *  │  ◆  H E L P E R S                                          │
 *  └─────────────────────────────────────────────────────────────┘  */

/**
 * Recover the last-viewed slide from sessionStorage.
 * Survives Vite HMR so you stay on the same slide during dev.
 *
 *   sessionStorage key format:  slide:<project>
 *   returns 0 when nothing stored or value is out of range.
 */
function getStoredSlide(project, totalSlides) {
  try {
    const idx = parseInt(sessionStorage.getItem(`slide:${project}`), 10)
    return Number.isFinite(idx) && idx >= 0 && idx < totalSlides ? idx : 0
  } catch {
    return 0
  }
}

/*  ╭──────────────────────────────────────────────────────────────╮
 *  │  ◈  P R O V I D E R                                         │
 *  ╰──────────────────────────────────────────────────────────────╯  */

export function SlideProvider({ children, totalSlides, project, slides }) {
  const [current, setCurrent] = useState(() =>
    getStoredSlide(project, totalSlides),
  )
  const [selectedCustomer, setSelectedCustomer] = useState(null)

  /*  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░
   *  ░  Persist slide index  ─  HMR keeps position  ░
   *  ░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░░  */

  useEffect(() => {
    try {
      sessionStorage.setItem(`slide:${project}`, current)
    } catch {
      /* storage full / unavailable – ignore */
    }

    // Notify parent frame (e.g. deck-launcher) of the current slide
    if (window.parent !== window) {
      const component = slides?.[current]
      window.parent.postMessage({
        type: 'deck:slide',
        project,
        slideIndex: current,
        slideName: component?.displayName || component?.name || null,
        totalSlides,
      }, '*')
    }
  }, [current, project, totalSlides, slides])

  /*  ▸ ▸ ▸  Navigation helpers  ◂ ◂ ◂  */

  const go = useCallback(
    (dir) => {
      setCurrent((prev) => {
        const next = prev + dir
        return next < 0 || next >= totalSlides ? prev : next
      })
    },
    [totalSlides],
  )

  const goTo = useCallback(
    (idx) => {
      if (idx >= 0 && idx < totalSlides) setCurrent(idx)
    },
    [totalSlides],
  )

  /*  ⌨ ─────────────────────────────────────────────────────
   *  │  Keyboard  →  ←  Space  PageDown  PageUp  Enter    │
   *  ───────────────────────────────────────────────── ⌨  */

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown' || e.key === 'Enter') {
        e.preventDefault()
        go(1)
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        e.preventDefault()
        go(-1)
      }
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [go])

  /*  👆 ─────────────────────────────────
   *  │  Touch / swipe  (threshold 50px) │
   *  ───────────────────────────── 👆   */

  useEffect(() => {
    let touchX = 0

    const onStart = (e) => {
      touchX = e.changedTouches[0].screenX
    }
    const onEnd = (e) => {
      const diff = touchX - e.changedTouches[0].screenX
      if (Math.abs(diff) > 50) go(diff > 0 ? 1 : -1)
    }

    document.addEventListener('touchstart', onStart)
    document.addEventListener('touchend', onEnd)
    return () => {
      document.removeEventListener('touchstart', onStart)
      document.removeEventListener('touchend', onEnd)
    }
  }, [go])

  /*  ◇─────────────── render ───────────────◇  */

  return (
    <SlideContext.Provider
      value={{
        current,
        totalSlides,
        go,
        goTo,
        selectedCustomer,
        setSelectedCustomer,
        project,
      }}
    >
      {children}
    </SlideContext.Provider>
  )
}

/*  ┌─────────────────────────────────────────────────────────────┐
 *  │  ◆  H O O K                                                │
 *  └─────────────────────────────────────────────────────────────┘  */

export function useSlides() {
  return useContext(SlideContext)
}
