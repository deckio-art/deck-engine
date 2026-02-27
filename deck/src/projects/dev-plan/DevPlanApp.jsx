import { SlideProvider } from '../../context/SlideContext'
import Navigation from '../../components/Navigation'
import Slide from '../../components/Slide'
import BottomBar from '../../components/BottomBar'
import styles from './DevPlanPlaceholder.module.css'

const TOTAL = 1

export default function DevPlanApp() {
  return (
    <SlideProvider totalSlides={TOTAL}>
      <Navigation />
      <div className="deck">
        <Slide index={0} className={styles.placeholder}>
          <div className="accent-bar" />
          <div className={`${styles.content} content-frame content-gutter`}>
            <div className={styles.icon}>🌱</div>
            <h1 className={styles.title}>Development Plan</h1>
            <h2 className={styles.subtitle}>Dilruba Turan — Aspire</h2>
            <p className={styles.desc}>
              This deck is under construction. Slides will be added one at a time.
            </p>
            <button className={styles.back} onClick={() => { window.location.hash = '' }}>
              ← Back to Canvas
            </button>
          </div>
          <BottomBar />
        </Slide>
      </div>
    </SlideProvider>
  )
}
