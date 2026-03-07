import { BottomBar, Slide, useSlides } from '@lopezleandro03/canvas-engine'
import styles from './SpecificationSlide.module.css'

export default function SpecificationSlide({ index }) {
  const { current } = useSlides()
  const isActive = current === index

  return (
    <Slide index={index} className={styles.slide}>
      <div className="accent-bar" />
      <div className={`orb ${styles.orb1}`} />
      <div className={`orb ${styles.orb2}`} />

      <div className={styles.body}>
        <h2 className={styles.statement}>
          A written <span className={styles.highlight}>Specification</span>
          <br />aligns humans
        </h2>
        <div className={styles.divider} />
        <p className={styles.sub}>Intent is the new source code.</p>
      </div>

      <BottomBar text="Nordcloud Developer Day 2026" />
    </Slide>
  )
}
