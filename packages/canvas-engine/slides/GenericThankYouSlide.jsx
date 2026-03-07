import Slide from '../components/Slide'
import BottomBar from '../components/BottomBar'
import styles from './ThankYouSlide.module.css'

export default function GenericThankYouSlide({ index = 10, subtitle, tagline, footerText }) {
  return (
    <Slide index={index} className={styles.thankYou}>
      <div className="accent-bar" />

      <div className={`${styles.glow} ${styles.glow1}`} />
      <div className={`${styles.glow} ${styles.glow2}`} />
      <div className={`${styles.glow} ${styles.glow3}`} />

      {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
        <div key={i} className={`${styles.streak} ${styles[`streak${i}`]}`} />
      ))}

      <div className="content-frame content-gutter">
        <div className={styles.content}>
          <h2 className={styles.title}>Thank You</h2>
          <p className={styles.subtitle}>
            {subtitle || <>Let&rsquo;s build something great &mdash; together.</>}
          </p>
          <div className={styles.divider} />
          {tagline && <p className={styles.tagline}>{tagline}</p>}
        </div>
      </div>

      <BottomBar text={footerText} />
    </Slide>
  )
}
