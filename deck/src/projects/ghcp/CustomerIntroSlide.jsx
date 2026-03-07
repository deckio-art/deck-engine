import { BottomBar, Slide } from '@lopezleandro03/canvas-engine'
import styles from './CustomerIntroSlide.module.css'

export default function CustomerIntroSlide() {
  return (
    <Slide index={13} className={styles.intro}>
      <div className="accent-bar" />
      {/* Decorative orbs */}
      <div className={`orb ${styles.orb1}`} />
      <div className={`orb ${styles.orb2}`} />
      <div className={`orb ${styles.orb3}`} />

      <div className={`${styles.body} content-frame content-gutter`}>
        <h2 className={styles.title}>
          Driving sustained Copilot &amp; AI usage across your engineering organization
        </h2>

        <div className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <p>
              Joint initiative between <strong>Customer × Microsoft × GitHub</strong>
            </p>
          </div>

          <div className={`${styles.card} ${styles.cardCyan}`}>
            <div className={`${styles.cardIcon} ${styles.cardIconCyan}`}>
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </div>
            <p>
              Focused on <strong>adoption &amp; engineering impact</strong>
            </p>
          </div>
        </div>
      </div>

      <BottomBar />
    </Slide>
  )
}
