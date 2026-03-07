import { BottomBar, Slide } from '@lopezleandro03/canvas-engine'
import styles from './TurboPascalSlide.module.css'

export default function TurboPascalSlide({ index }) {
  return (
    <Slide index={index} className={styles.slide}>
      <div className="accent-bar" />
      <div className={`orb ${styles.orb1}`} />
      <div className={`orb ${styles.orb2}`} />

      <div className={styles.body}>
        <h2 className={styles.statement}>
          <span className={styles.highlight}>Turbo Pascal</span>
        </h2>
        <div className={styles.divider} />
        <p className={styles.sub}>Where it all began — the first taste of high-level programming.</p>
      </div>

      <BottomBar text="Nordcloud Developer Day 2026" />
    </Slide>
  )
}
