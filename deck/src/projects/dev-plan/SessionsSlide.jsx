import { BottomBar, Slide } from '@lopezleandro03/canvas-engine'
import styles from './SessionsSlide.module.css'

const pillars = [
  {
    icon: '🎯',
    title: 'On-the-Job Coaching',
    color: 'var(--purple)',
    tagline: 'Learn by doing, guided by experts',
    items: [
      'Shadow experienced SEs in real customer engagements',
      'Reverse-shadow sessions with feedback loops',
      'Weekly 1:1 coaching with dedicated coach',
      'Real-time guidance during live opportunities',
    ],
  },
  {
    icon: '🚀',
    title: 'Simulation & TestFlight',
    color: 'var(--accent)',
    tagline: 'Safe space to practise and iterate',
    items: [
      'Three simulated client sessions per run',
      'Realistic scenarios with panelist evaluation',
      'Progressive difficulty across runs',
      'Structured debrief and actionable feedback',
    ],
  },
  {
    icon: '⚡',
    title: 'Technical Upskilling',
    color: 'var(--green)',
    tagline: 'Build the skills of today and tomorrow',
    items: [
      'Azure & infrastructure certifications',
      'AI, Agentic Engineering & platform thinking',
      'Hands-on labs and proof-of-concept builds',
      'Industry credentials and deep-dive workshops',
    ],
  },
]

export default function SessionsSlide() {
  return (
    <Slide index={2} className={styles.slide}>
      <div className="accent-bar" />
      <div className={`${styles.content} content-frame content-gutter`}>
        <p className={styles.eyebrow}>Complementing Aspire</p>
        <h1 className={styles.title}>Growth Approach</h1>
        <p className={styles.subtitle}>
          Three reinforcing tracks that accelerate Dilruba's path from Aspire foundations to field-ready SE.
        </p>

        <div className={styles.cards}>
          {pillars.map((p, i) => (
            <div key={i} className={styles.card} style={{ '--session-color': p.color }}>
              <div className={styles.iconWrap}>{p.icon}</div>
              <h3 className={styles.cardTitle}>{p.title}</h3>
              <p className={styles.tagline}>{p.tagline}</p>
              <div className={styles.divider} />
              <ul className={styles.skills}>
                {p.items.map((item, j) => <li key={j}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
      </div>
      <BottomBar text="Aspire Development Plan · Dilruba Turan" />
    </Slide>
  )
}
