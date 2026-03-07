import { BottomBar, Slide } from '@lopezleandro03/canvas-engine'
import speakers from '../../data/speakers'
import styles from './PresentersSlide.module.css'

function SpeakerCard({ speaker }) {
  return (
    <div className={styles.card}>
      <div className={styles.photo}>
        <div className={`${styles.photoBg} ${styles[`photoBg${speaker.bgIndex}`]}`} />
        {speaker.photo ? (
          <img
            src={speaker.photo}
            alt={speaker.name}
            className={styles.avatarImg}
          />
        ) : (
          <div className={`${styles.avatar} ${styles[`avatar${speaker.avatarColor}`]}`}>
            {speaker.initials}
          </div>
        )}
      </div>
      <div className={styles.body}>
        <div className={styles.name}>{speaker.name}</div>
        <div className={styles.title}>{speaker.title}</div>
        <div className={styles.topic}>
          <strong>{speaker.topic}</strong> — {speaker.desc}
        </div>
        <div className={`${styles.org} ${styles[`org${speaker.orgClass}`]}`}>
          {speaker.icon}
          {speaker.org}
        </div>
      </div>
    </div>
  )
}

export default function PresentersSlide({ index = 8 }) {
  return (
    <Slide index={index} className={styles.presenters}>
      <div className="accent-bar" />
      <div className="grid-dots" style={{ right: 30, bottom: 80 }} />

      <div className="content-frame content-gutter">
        <div className={styles.header}>
          <h2>Presenters &amp; Topics</h2>
          <div className={styles.badge}>From Engineers, to Engineers</div>
        </div>

        <div className={styles.heroCallout}>
          <div className={styles.heroIcon}>🚀</div>
          <div className={styles.heroText}>
            <strong>These are not typical presenters.</strong> They already live in the AI-first coding world your teams are moving toward.
            Every speaker was chosen because they are <em>ahead of the curve</em>&nbsp;&mdash; building, shipping, and scaling with Copilot daily.
            Their job on this stage: make that future feel <em>achievable</em> for your engineers, starting today.
            This is our initial lineup. Over time we're adding new speakers bringing fresh insights and innovative ways of working with AI.
          </div>
        </div>

        <div className={styles.grid}>
          {speakers.map((s, i) => <SpeakerCard key={i} speaker={s} />)}
        </div>
      </div>

      <BottomBar />
    </Slide>
  )
}
