import { BottomBar, Slide } from '@lopezleandro03/canvas-engine'
import styles from './CoverSlide.module.css'

export default function CoverSlide() {
  return (
    <Slide index={0} className={styles.cover}>
      <div className="accent-bar" />
      <div className={`orb ${styles.orb1}`} />
      <div className={`orb ${styles.orb2}`} />
      <div className={`orb ${styles.orb3}`} />

      <div className={`${styles.content} content-frame content-gutter`}>

        <div className={styles.headline}>
          <p className={styles.eyebrow}>Developer Day 2026</p>
          <h1 className={styles.title}>
            From Code to Intent.<br />
            <span className={styles.highlight}>The Agentic Engineering Revolution.</span>
          </h1>
        </div>

        <div className={styles.presenter}>
          <span className={styles.presenterName}>Leandro Lopez</span>
          <span className={styles.presenterRole}>Sr. Solution Engineering Manager, Microsoft</span>
        </div>

      </div>

      <BottomBar text="Nordcloud Developer Day 2026" />
    </Slide>
  )
}
