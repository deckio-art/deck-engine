import { BottomBar, Slide, useSlides } from '@lopezleandro03/canvas-engine'
import styles from './AgendaSlide.module.css'

const items = [
  { num: 1, title: 'Opportunity', desc: 'The revenue landscape — seats, penetration, and ACR expansion across accounts.', target: 2 },
  { num: 2, title: 'Intent', desc: 'Why this series exists — driving consumption, managing inquiries, building community.', target: 3 },
  { num: 3, title: 'Approach', desc: 'The engagement model, cadence, and how we\'ll measure progress together.', target: 4 },
  { num: 4, title: 'Presenters & Topics', desc: 'Who\'s presenting what — deep dives, demos, and hands-on sessions.', target: 5 },
  { num: 5, title: 'Governance', desc: 'Lightweight governance with clear owners and industry pool leads.', target: 6 },
]

export default function AgendaSlide() {
  const { goTo } = useSlides()

  return (
    <Slide index={2} className={styles.agenda}>
      <div className="accent-bar" />

      <div className={`${styles.layout} content-frame content-gutter`}>
        {/* Left panel */}
        <div className={styles.left}>
          <div className={`orb ${styles.orbA}`} />
          <div className={`orb ${styles.orbB}`} />
          <div className={`orb ${styles.orbC}`} />
          <div className="grid-dots" style={{ bottom: 40, right: 0 }} />

          <svg className={styles.circuitSvg} viewBox="0 0 120 120" fill="none" stroke="rgba(139,148,158,0.5)" strokeWidth="1.2">
            <path d="M10,60 H50 Q60,60 60,50 V20" />
            <path d="M60,20 Q60,10 70,10 H110" />
            <circle cx="10" cy="60" r="3" fill="rgba(86,212,221,0.6)" stroke="none" />
            <circle cx="110" cy="10" r="3" fill="rgba(188,140,255,0.6)" stroke="none" />
            <path d="M50,60 Q60,60 60,70 V100" />
            <circle cx="60" cy="100" r="3" fill="rgba(88,166,255,0.6)" stroke="none" />
          </svg>

          <h2>Table <span className={styles.muted}>of</span><br />Contents</h2>
        </div>

        {/* Right panel */}
        <div className={styles.right}>
          <div className="grid-dots" style={{ top: 20, right: 20 }} />

          <div className={styles.card}>
            {items.map(item => (
              <div
                key={item.num}
                className={styles.item}
                onClick={() => goTo(item.target)}
                style={{ cursor: 'pointer' }}
              >
                <div className={styles.num}>{item.num}</div>
                <div className={styles.text}>
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomBar />
    </Slide>
  )
}
