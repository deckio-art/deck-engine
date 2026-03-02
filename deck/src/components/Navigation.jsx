import { useSlides } from '../context/SlideContext'
import styles from './Navigation.module.css'
import { useState, useEffect } from 'react'

const INTERNAL_PDF_URL = 'https://microsofteur-my.sharepoint.com/:b:/g/personal/leandrolopez_microsoft_com/IQDpJ-b0ZYXmS70YsLX0czeEAa0f7IrsLhRQ_gvF8NxLlsA?e=crsrXJ'

export default function Navigation() {
  const { current, totalSlides, go, goTo, selectedCustomer, project } = useSlides()
  const [hintVisible, setHintVisible] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setHintVisible(false), 5000)
    return () => clearTimeout(t)
  }, [])

  const progress = ((current + 1) / totalSlides) * 100

  // ── PDF link logic per project ──
  let showPdfLink = false
  let pdfUrl = null
  let pdfLabel = 'Deck PDF'

  if (project === 'ghcp') {
    const isInternal = current >= 1 && current <= 11
    const isCustomerSlide = current >= 12 && current <= 20
    showPdfLink = isInternal || isCustomerSlide
    pdfUrl = isInternal
      ? INTERNAL_PDF_URL
      : selectedCustomer
        ? `/exports/${selectedCustomer.name.toLowerCase().replace(/\s+/g, '-')}-slides.pdf`
        : null
    pdfLabel = isInternal
      ? 'Internal deck PDF'
      : selectedCustomer
        ? `${selectedCustomer.name} deck PDF`
        : 'Deck PDF'
  } else if (project) {
    // For any other project (dev-plan, etc.) always show the link
    showPdfLink = true
    pdfUrl = `/exports/${project}-slides.pdf`
    pdfLabel = `${project} deck PDF`
  }

  return (
    <>
      {/* Progress bar */}
      <div className={styles.progressTrack}>
        <div className={styles.progressFill} style={{ width: `${progress}%` }} />
      </div>

      {/* Home button */}
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

      {/* PDF link button */}
      {showPdfLink && pdfUrl && (
        <a
          className={styles.exportBtn}
          href={pdfUrl}
          target="_blank"
          rel="noopener noreferrer"
          title={pdfLabel}
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

      {/* Nav buttons */}
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

      {/* Keyboard hint */}
      {hintVisible && (
        <div className={styles.keyHint}>
          <span className={styles.kbd}>&larr;</span>
          <span className={styles.kbd}>&rarr;</span> or click arrows to navigate
        </div>
      )}
    </>
  )
}
