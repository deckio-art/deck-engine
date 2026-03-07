import { BottomBar, Slide } from '@lopezleandro03/canvas-engine'
import styles from './CustomerNextStepsSlide.module.css'

const steps = [
  'Commit to the Adoption Series',
  'Nominate sponsor, owner, and moderators',
  'Confirm audience and cadence',
  'Kick off the pilot',
]

export default function CustomerNextStepsSlide() {
  return (
    <Slide index={18} className={styles.nextSteps}>
      <div className="accent-bar" />
      {/* Decorative orbs */}
      <div className={`orb ${styles.orb1}`} />
      <div className={`orb ${styles.orb2}`} />
      <div className={`orb ${styles.orb3}`} />

      <div className={`${styles.body} content-frame content-gutter`}>
        <div className={styles.header}>
          <h2 className={styles.title}>What we&rsquo;re asking you to decide</h2>
          <p className={styles.subtitle}>Decision &amp; Next Steps</p>
        </div>

        <div className={styles.card}>
          <div className={styles.cardGlow} />
          <ul className={styles.stepList}>
            {steps.map((step, i) => (
              <li key={i} className={styles.step}>
                <span className={styles.stepNum}>{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
          <div className={styles.divider} />
          <p className={styles.timeline}>
            <strong>Timeline:</strong> Late March &ndash; End of June 2026 &nbsp;|&nbsp; 7 exclusive customers
          </p>
          <p className={styles.tagline}>
            Together, we turn GitHub AI into daily engineering practice&mdash;not just a license.
          </p>
        </div>
      </div>

      <BottomBar />
    </Slide>
  )
}
