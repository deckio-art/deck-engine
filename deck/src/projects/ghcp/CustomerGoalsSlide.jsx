import { BottomBar, Slide } from '@lopezleandro03/canvas-engine'
import styles from './CustomerGoalsSlide.module.css'

const goals = [
  {
    title: 'Build the Skill of the Future',
    description: 'Develop Agentic Engineering capabilities and maximize the value you get from GitHub',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    accent: 'accent',
  },
  {
    title: 'Create a structured engagement model',
    description: 'Replace scattered requests with a predictable series',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4" /><path d="M8 2v4" /><path d="M3 10h18" />
      </svg>
    ),
    accent: 'purple',
  },
  {
    title: 'Build an internal GitHub AI community',
    description: 'Increase momentum, reuse, and peer learning and help build your internal GitHub AI community',
    icon: (
      <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
    accent: 'green',
  },
]

export default function CustomerGoalsSlide() {
  return (
    <Slide index={14} className={styles.goals}>
      <div className="accent-bar" />
      {/* Decorative orbs */}
      <div className={`orb ${styles.orb1}`} />
      <div className={`orb ${styles.orb2}`} />
      <div className={`orb ${styles.orb3}`} />

      <div className={`${styles.body} content-frame content-gutter`}>
        <div className={styles.header}>
          <h2 className={styles.title}>Three clear goals</h2>
          <p className={styles.subtitle}>Program Intent (Why this series exists)</p>
        </div>

        <div className={styles.cards}>
          {goals.map((g, i) => (
            <div key={i} className={`${styles.card} ${styles[`card${g.accent.charAt(0).toUpperCase() + g.accent.slice(1)}`]}`}>
              <div className={styles.cardGlow} />
              <div className={`${styles.cardIcon} ${styles[`icon${g.accent.charAt(0).toUpperCase() + g.accent.slice(1)}`]}`}>
                {g.icon}
              </div>
              <h3 className={styles.cardTitle}>{g.title}</h3>
              <p className={styles.cardDesc}>{g.description}</p>
            </div>
          ))}
        </div>
      </div>

      <BottomBar />
    </Slide>
  )
}
