import { BottomBar, Slide } from '@lopezleandro03/canvas-engine'
import styles from './CoverSlide.module.css'

export default function CoverSlide() {
  return (
    <Slide index={0} className={styles.cover}>
      {/* Decorative elements */}
      <div className="accent-bar" />
      <div className={`orb ${styles.orb1}`} />
      <div className={`orb ${styles.orb2}`} />
      <div className={`orb ${styles.orb3}`} />

      <svg className={styles.connectorSvg} viewBox="0 0 300 300" fill="none" stroke="rgba(139,148,158,0.4)" strokeWidth="1.2">
        <path d="M20,280 Q80,200 140,180 T260,60" />
        <circle cx="140" cy="180" r="4" fill="none" stroke="rgba(63,185,80,0.6)" strokeWidth="1.5" />
        <circle cx="200" cy="120" r="3" fill="none" stroke="rgba(88,166,255,0.6)" strokeWidth="1.5" />
        <circle cx="260" cy="60" r="5" fill="none" stroke="rgba(86,212,221,0.6)" strokeWidth="1.5" />
      </svg>

      <div className="content-frame content-gutter">
        <div className={styles.content}>
          <p className={styles.eyebrow}>dev-random</p>
          <h1>
            Random <span className={styles.highlight}>Slides</span>
          </h1>
          <p className={styles.subtitle}>
            A techy sandbox for random slide experiments,
            prototypes, and one-off decks — built to ship fast.
          </p>

          <div className={styles.meta}>
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Project</span>
              <span className={styles.metaValue}>dev-random</span>
            </div>
            <div className={styles.metaDivider} />
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Date</span>
              <span className={styles.metaValue}>2026</span>
            </div>
            <div className={styles.metaDivider} />
            <div className={styles.metaItem}>
              <span className={styles.metaLabel}>Presenter</span>
              <span className={styles.metaValue}>Leandro Lopez</span>
            </div>
          </div>
        </div>
      </div>

      <BottomBar text="dev-random" />
    </Slide>
  )
}
