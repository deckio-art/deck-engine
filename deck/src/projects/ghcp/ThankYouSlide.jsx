import { BottomBar, Slide } from '@lopezleandro03/canvas-engine'
import styles from './ThankYouSlide.module.css'

export default function ThankYouSlide({ index = 10 }) {
  return (
    <Slide index={index} className={styles.thankYou}>
      <div className="accent-bar" />

      {/* Ambient glow orbs */}
      <div className={`${styles.glow} ${styles.glow1}`} />
      <div className={`${styles.glow} ${styles.glow2}`} />
      <div className={`${styles.glow} ${styles.glow3}`} />

      {/* Speed streaks */}
      {[1,2,3,4,5,6,7,8].map(i => (
        <div key={i} className={`${styles.streak} ${styles[`streak${i}`]}`} />
      ))}

      <div className="content-frame content-gutter">
        {/* Logos */}
        <div className={styles.logos}>
          <div className={styles.logoGithub}>
            <svg width="48" height="48" viewBox="0 0 16 16" fill="white">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </div>
          <span className={styles.plus}>+</span>
          <div className={styles.logoMs}>
            <svg width="36" height="36" viewBox="0 0 23 23">
              <rect x="0" y="0" width="11" height="11" fill="#f25022" />
              <rect x="12" y="0" width="11" height="11" fill="#7fba00" />
              <rect x="0" y="12" width="11" height="11" fill="#00a4ef" />
              <rect x="12" y="12" width="11" height="11" fill="#ffb900" />
            </svg>
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <h2 className={styles.title}>Thank You</h2>
          <p className={styles.subtitle}>Let&rsquo;s accelerate AI impact &mdash; together.</p>
          <div className={styles.divider} />
          <p className={styles.tagline}>GitHub Copilot &bull; AI Activation Series 2025</p>
        </div>
      </div>

      <BottomBar />
    </Slide>
  )
}
