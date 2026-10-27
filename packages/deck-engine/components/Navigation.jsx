import { useSlides } from '../context/SlideContext'
import styles from './Navigation.module.css'
import { useState, useEffect, useRef } from 'react'
import { exportDeckPdf } from './exportDeckPdf.js'
import { exportDeckPptx } from './exportDeckPptx.js'
import SlideEditTools from './SlideEditTools.jsx'
import {
  DEFAULT_EXPORT_OPTIONS,
  EXPORT_FITS,
  EXPORT_LAYOUTS,
  EXPORT_QUALITIES,
} from './exportDeckService.js'

function resolveProp(value, context) {
  return typeof value === 'function' ? value(context) : value
}

// Standalone = not embedded in the launcher iframe. The launcher provides its
// own presentation/fullscreen chrome, so the deck only offers a fullscreen
// button when shown on its own.
const IS_STANDALONE =
  typeof window === 'undefined' ? true : (() => {
    try {
      return window.self === window.top
    } catch {
      return false
    }
  })()

function toggleFullscreen() {
  try {
    if (document.fullscreenElement) {
      document.exitFullscreen?.()
    } else {
      document.documentElement.requestFullscreen?.()
    }
  } catch (error) {
    console.debug('Fullscreen toggle was not allowed', error)
  }
}

export default function Navigation({ pdfPath = null, pdfLabel = 'Deck PDF' }) {
  const { current, totalSlides, go, goTo, selectedCustomer, project, progress, atStart, atEnd, firstVisibleIndex, isFullscreen } = useSlides()
  const [hintVisible, setHintVisible] = useState(true)
  const [idle, setIdle] = useState(false)
  const [isExporting, setIsExporting] = useState(false)
  const [exportStatus, setExportStatus] = useState('PDF')
  const [exportMenuOpen, setExportMenuOpen] = useState(false)
  const [exportError, setExportError] = useState(null)
  const [exportOptions, setExportOptions] = useState(DEFAULT_EXPORT_OPTIONS)
  const [navHasFocus, setNavHasFocus] = useState(false)
  const exportMenuRef = useRef(null)
  const navRef = useRef(null)
  const timerRef = useRef(null)

  useEffect(() => {
    const t = setTimeout(() => setHintVisible(false), 5000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const resetIdle = () => {
      setIdle(false)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setIdle(true), 2000)
    }
    const handleFocusIn = (e) => {
      if (navRef.current?.contains(e.target)) setNavHasFocus(true)
      resetIdle()
    }
    const handleFocusOut = () => {
      window.setTimeout(() => {
        setNavHasFocus(Boolean(navRef.current?.contains(document.activeElement)))
      }, 0)
    }

    resetIdle()
    window.addEventListener('mousemove', resetIdle)
    window.addEventListener('mousedown', resetIdle)
    window.addEventListener('keydown', resetIdle)
    window.addEventListener('focusin', handleFocusIn)
    window.addEventListener('focusout', handleFocusOut)
    return () => {
      window.removeEventListener('mousemove', resetIdle)
      window.removeEventListener('mousedown', resetIdle)
      window.removeEventListener('keydown', resetIdle)
      window.removeEventListener('focusin', handleFocusIn)
      window.removeEventListener('focusout', handleFocusOut)
      clearTimeout(timerRef.current)
    }
  }, [])

  // Close export menu when clicking outside
  useEffect(() => {
    if (!exportMenuOpen) return
    const handleClickOutside = (e) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(e.target)) {
        setExportMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [exportMenuOpen])

  const progressPercent = typeof progress === 'number' ? progress : ((current + 1) / totalSlides) * 100
  const navigationState = { current, totalSlides, selectedCustomer, project }
  const resolvedPdfPath = resolveProp(pdfPath, navigationState)
  const resolvedPdfLabel = resolveProp(pdfLabel, navigationState) || 'Deck PDF'

  function updateExportOption(key, value) {
    setExportOptions((prev) => ({ ...prev, [key]: value }))
  }

  async function handleExport(format) {
    if (isExporting) return
    setExportMenuOpen(false)
    setIsExporting(true)
    setExportStatus('Preparing')

    const exportFn = format === 'pptx' ? exportDeckPptx : exportDeckPdf
    const label = format === 'pptx' ? 'PPTX' : 'PDF'

    try {
      await exportFn({
        current,
        goTo,
        project,
        selectedCustomer,
        totalSlides,
        onProgress: ({ current: slideNumber, total }) => {
          setExportStatus(`${slideNumber}/${total}`)
        },
        exportOptions,
      })
      setExportStatus('Done')
      setExportError(null)
    } catch (error) {
      console.error(`${label} export failed`, error)
      setExportError({ format, message: error?.message || `${label} export failed` })
      setExportStatus('PDF')
    } finally {
      window.setTimeout(() => {
        setIsExporting(false)
        setExportStatus('PDF')
      }, 1200)
    }
  }

  return (
    <div ref={navRef} className={`${styles.navWrapper} ${idle && !navHasFocus ? styles.navHidden : ''}`}>
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${progressPercent}%` }} />
      </div>

      {current !== firstVisibleIndex && (
        <button
          className={styles.homeBtn}
          onClick={() => goTo(firstVisibleIndex)}
          title="Back to home"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12l9-9 9 9" />
            <path d="M9 21V9h6v12" />
          </svg>
        </button>
      )}

      <div className={styles.exportGroup} ref={exportMenuRef}>
        <SlideEditTools
          buttonClassName={styles.exportBtn}
          activeClassName={styles.editToolActive}
          dangerClassName={styles.editToolDanger}
        />
        {IS_STANDALONE && (
          <button
            className={styles.exportBtn}
            type="button"
            onClick={toggleFullscreen}
            title={isFullscreen ? 'Exit fullscreen' : 'Present fullscreen (hides hidden slides)'}
            aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3v3a2 2 0 0 1-2 2H3" />
                <path d="M21 8h-3a2 2 0 0 1-2-2V3" />
                <path d="M3 16h3a2 2 0 0 1 2 2v3" />
                <path d="M16 21v-3a2 2 0 0 1 2-2h3" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M8 3H5a2 2 0 0 0-2 2v3" />
                <path d="M21 8V5a2 2 0 0 0-2-2h-3" />
                <path d="M3 16v3a2 2 0 0 0 2 2h3" />
                <path d="M16 21h3a2 2 0 0 0 2-2v-3" />
              </svg>
            )}
          </button>
        )}
        {resolvedPdfPath ? (
          <a
            className={styles.exportBtn}
            href={resolvedPdfPath}
            target="_blank"
            rel="noopener noreferrer"
            title={resolvedPdfLabel}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <line x1="16" y1="13" x2="8" y2="13" />
              <line x1="16" y1="17" x2="8" y2="17" />
              <polyline points="10 9 9 9 8 9" />
            </svg>
            <span className={styles.exportLabel}>PDF</span>
          </a>
        ) : (
          <button
            className={`${styles.exportBtn} ${isExporting ? styles.exportBtnBusy : ''}`}
            type="button"
            onClick={() => isExporting ? null : setExportMenuOpen(!exportMenuOpen)}
            disabled={isExporting}
            title={isExporting ? 'Exporting...' : 'Export deck'}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
              <path d="M12 12v6" />
              <path d="M9 15l3 3 3-3" />
              <path d="M8 10h8" />
            </svg>
            <span className={styles.exportLabel}>{isExporting ? exportStatus : '⬇'}</span>
          </button>
        )}

        {exportError && !resolvedPdfPath && (
          <div className={styles.exportError} role="alert">
            <span>Export failed: {exportError.message} </span>
            <button type="button" onClick={() => handleExport(exportError.format)} disabled={isExporting}>Retry</button>
            <button type="button" className={styles.exportErrorDismiss} onClick={() => setExportError(null)} aria-label="Dismiss export error">×</button>
          </div>
        )}

        {exportMenuOpen && !isExporting && (
          <div className={styles.exportMenu} role="dialog" aria-label="Export deck options">
            <div className={styles.exportMenuHeader}>
              <span className={styles.exportMenuTitle}>Export deck</span>
              <span className={styles.exportMenuHint}>Widescreen is the PowerPoint default</span>
            </div>

            <label className={styles.exportField}>
              <span>Size</span>
              <select
                value={exportOptions.layout}
                onChange={(event) => updateExportOption('layout', event.target.value)}
              >
                {EXPORT_LAYOUTS.map((layout) => (
                  <option key={layout.id} value={layout.id}>
                    {layout.label} - {layout.hint}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.exportField}>
              <span>Fit</span>
              <select
                value={exportOptions.fit}
                onChange={(event) => updateExportOption('fit', event.target.value)}
              >
                {EXPORT_FITS.map((fit) => (
                  <option key={fit.id} value={fit.id}>
                    {fit.label} - {fit.hint}
                  </option>
                ))}
              </select>
            </label>

            <label className={styles.exportField}>
              <span>Quality</span>
              <select
                value={exportOptions.quality}
                onChange={(event) => updateExportOption('quality', event.target.value)}
              >
                {EXPORT_QUALITIES.map((quality) => (
                  <option key={quality.id} value={quality.id}>
                    {quality.label} - {quality.hint}
                  </option>
                ))}
              </select>
            </label>

            <div className={styles.exportActions}>
              <button className={styles.exportMenuItem} onClick={() => handleExport('pdf')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                  <polyline points="14 2 14 8 20 8" />
                </svg>
                PDF
              </button>
              <button className={styles.exportMenuItem} onClick={() => handleExport('pptx')}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <path d="M8 21h8" />
                  <path d="M12 17v4" />
                </svg>
                PowerPoint
              </button>
            </div>
          </div>
        )}
      </div>

      <button
        className={`${styles.navBtn} ${styles.prev}`}
        disabled={atStart}
        onClick={() => go(-1)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        className={`${styles.navBtn} ${styles.next}`}
        disabled={atEnd}
        onClick={() => go(1)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="9 6 15 12 9 18" />
        </svg>
      </button>

      {hintVisible && (
        <div className={styles.keyHint}>
          <span className={styles.kbd}>&larr;</span>
          <span className={styles.kbd}>&rarr;</span> or click arrows to navigate
        </div>
      )}
    </div>
  )
}
