import { BottomBar, Slide } from '@lopezleandro03/canvas-engine'
import andrejImg from '../../data/images/andrej.png'
import styles from './VibeCodingSlide.module.css'

export default function VibeCodingSlide({ index }) {
  return (
    <Slide index={index} className={styles.slide}>
      <div className="accent-bar" />
      <div className={`orb ${styles.orb1}`} />
      <div className={`orb ${styles.orb2}`} />

      <div className={styles.body}>

        {/* Left: context */}
        <div className={styles.left}>
          <span className={styles.eyebrow}>Andrej Karpathy · Feb 2025</span>
          <h2 className={styles.title}>
            "vibe<br />coding"
          </h2>
          <p className={styles.description}>
            A new paradigm where developers fully embrace AI — describing intent in natural language, accepting all suggestions, and iterating without reading the diffs.
          </p>
          <div className={styles.tagline}>
            The moment the industry named what developers were already doing.
          </div>
        </div>

        {/* Right: tweet screenshot */}
        <div className={styles.right}>
          <img src={andrejImg} alt="Andrej Karpathy vibe coding tweet" className={styles.tweet} />
        </div>

      </div>

      <BottomBar text="Nordcloud Developer Day 2026" />
    </Slide>
  )
}
