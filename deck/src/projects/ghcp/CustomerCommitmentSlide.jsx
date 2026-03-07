import { BottomBar, Slide } from '@lopezleandro03/canvas-engine'
import styles from './CustomerCommitmentSlide.module.css'

const msProvides = [
  'Speakers and demos',
  'Topic curation',
  'Best practices and roadmap context',
]

const customerCommits = [
  'Internal organization & promotion',
  'Named moderators / champions',
  'Minimum attendance target (200+)',
  'Community engagement & follow-up',
]

export default function CustomerCommitmentSlide() {
  return (
    <Slide index={17} className={styles.commitment}>
      <div className="accent-bar" />
      {/* Decorative orbs */}
      <div className={`orb ${styles.orb1}`} />
      <div className={`orb ${styles.orb2}`} />
      <div className={`orb ${styles.orb3}`} />

      <div className={`${styles.body} content-frame content-gutter`}>
        <div className={styles.header}>
          <h2 className={styles.title}>This is a joint commitment</h2>
          <p className={styles.subtitle}>The success of the series depends on strong customer ownership</p>
        </div>

        <div className={styles.columns}>
          {/* Left: Microsoft & GitHub */}
          <div className={styles.column}>
            <h3 className={styles.colTitle}>Microsoft &amp; GitHub provide</h3>
            <div className={`${styles.card} ${styles.cardPurple}`}>
              <div className={styles.cardGlow} />
              <ul>
                {msProvides.map((item, i) => (
                  <li key={i}>
                    <span className={styles.bullet}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10" opacity="0.3" /><path d="M8 12l3 3 5-5" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Right: Customer */}
          <div className={styles.column}>
            <h3 className={`${styles.colTitle} ${styles.colTitleGreen}`}>Customer commits to</h3>
            <div className={`${styles.card} ${styles.cardGreen}`}>
              <div className={styles.cardGlow} />
              <ul>
                {customerCommits.map((item, i) => (
                  <li key={i}>
                    <span className={`${styles.bullet} ${styles.bulletGreen}`}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="3" width="18" height="18" rx="4" opacity="0.3" /><path d="M8 12l3 3 5-5" />
                      </svg>
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      <BottomBar />
    </Slide>
  )
}
