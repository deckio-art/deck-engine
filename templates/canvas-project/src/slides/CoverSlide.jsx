import { BottomBar, Slide } from '@lopezleandro03/canvas-engine'
import styles from './CoverSlide.module.css'

export default function CoverSlide({ index = 0, subtitle, title }) {
  return (
    <Slide index={index} className={styles.cover}>
      <div className="accent-bar" />
      <div className={`orb ${styles.orbPrimary}`} />
      <div className={`orb ${styles.orbSecondary}`} />
      <div className="grid-dots" style={{ right: 72, top: '22%' }} />

      <div className="content-frame content-gutter">
        <div className={styles.content}>
          <span className={styles.kicker}>Canvas project template</span>
          <h1>{title}</h1>
          <p className={styles.subtitle}>{subtitle}</p>

          <div className={styles.card}>
            <div>
              <span className={styles.label}>Start here</span>
              <p>Replace this slide with your project cover, then add more entries to the `slides` array in `canvas.config.js`.</p>
            </div>
            <div className={styles.metric}>
              <strong>2</strong>
              <span>sample slides included</span>
            </div>
          </div>
        </div>
      </div>

      <BottomBar text="Canvas project template" />
    </Slide>
  )
}
