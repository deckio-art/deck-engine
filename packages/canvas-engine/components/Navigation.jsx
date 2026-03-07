import { useSlides } from '../context/SlideContext'
import styles from './Navigation.module.css'
import { useState, useEffect, useRef } from 'react'

function resolveProp(value, context) {
  return typeof value === 'function' ? value(context) : value
}

export default function Navigation({ pdfPath = null, pdfLabel = 'Deck PDF' }) {
  const { current, totalSlides, go, goTo, selectedCustomer, project } = useSlides()
  const [hintVisible, setHintVisible] = useState(true)
  const [idle, setIdle] = useState(false)
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
    resetIdle()
    window.addEventListener('mousemove', resetIdle)
    window.addEventListener('mousedown', resetIdle)
    return () => {
      window.removeEventListener('mousemove', resetIdle)
      window.removeEventListener('mousedown', resetIdle)
      clearTimeout(timerRef.current)
    }
  }, [])

  const progress = ((current + 1) / totalSlides) * 100
  const navigationState = { current, totalSlides, selectedCustomer, project }
  const resolvedPdfPath = resolveProp(pdfPath, navigationState)
  const resolvedPdfLabel = resolveProp(pdfLabel, navigationState) || 'Deck PDF'

  return (
    <div className={`${styles.navWrapper} ${idle ? styles.navHidden : ''}`}>
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>

      {current !== 0 && (
        <button
          className={styles.homeBtn}
          onClick={() => goTo(0)}
          title="Back to home"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 12l9-9 9 9" />
            <path d="M9 21V9h6v12" />
          </svg>
        </button>
      )}

      {resolvedPdfPath && (
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
      )}

      <button
        className={`${styles.navBtn} ${styles.prev}`}
        disabled={current === 0}
        onClick={() => go(-1)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <polyline points="15 18 9 12 15 6" />
        </svg>
      </button>
      <button
        className={`${styles.navBtn} ${styles.next}`}
        disabled={current === totalSlides - 1}
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
