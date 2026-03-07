import { BottomBar, Slide } from '@lopezleandro03/canvas-engine'
import styles from './HourglassImageSlide.module.css'
import hourglassImg from '../../data/generated/hourglass.png'

export default function HourglassImageSlide({ index }) {
  return (
    <Slide index={index} className={styles.slide}>
      <div className="accent-bar" />
      <div className={`orb ${styles.orb1}`} />
      <div className={`orb ${styles.orb2}`} />

      <div className={styles.body}>
        <div className={styles.left}>
          <h2 className={styles.title}>
            The <span className={styles.highlight}>Agentic SDLC</span> Is an Hourglass
          </h2>
          <div className={styles.zones}>
            <div className={styles.zone}>
              <span className={styles.zoneLabel} data-color="cyan">Top</span>
              <span className={styles.zoneTitle}>What to Build</span>
              <span className={styles.zoneDesc}>Intent &amp; Discovery — the new heavyweight. Be very clear on what you want.</span>
            </div>
            <div className={styles.zone}>
              <span className={styles.zoneLabel} data-color="gold">Middle</span>
              <span className={styles.zoneTitle}>Building It Fast</span>
              <span className={styles.zoneDesc}>AI Agents execute at speed. The bridge is tiny — we just watch.</span>
            </div>
            <div className={styles.zone}>
              <span className={styles.zoneLabel} data-color="green">Bottom</span>
              <span className={styles.zoneTitle}>Checking It's Right</span>
              <span className={styles.zoneDesc}>Smart tools verify safety, quality and correctness at scale.</span>
            </div>
          </div>
        </div>

        <div className={styles.right}>
          <img src={hourglassImg} alt="Agentic SDLC Hourglass" className={styles.img} />
        </div>
      </div>

      <BottomBar text="Nordcloud Developer Day 2026" />
    </Slide>
  )
}
