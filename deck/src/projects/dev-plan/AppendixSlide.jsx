import { BottomBar, Slide } from '@lopezleandro03/canvas-engine'
import styles from './AppendixSlide.module.css'

const sessions = [
  {
    number: 1,
    title: 'First Client Meeting',
    items: [
      'Active listening, asking discovery questions',
      'Assess current technical estate',
    ],
  },
  {
    number: 2,
    title: 'Business Envisioning',
    items: [
      'Explore different solutions',
      'Clarify business value of solutions',
      'Synthesize business and technical requirements',
    ],
  },
  {
    number: 3,
    title: 'Solution Envisioning',
    items: [
      'Technical deep dive (discussing one solution in depth)',
      'Address technical objections',
      'Whiteboarding or technical demonstration',
    ],
  },
]

export default function AppendixSlide() {
  return (
    <Slide index={6} className={styles.slide}>
      <div className="content-frame content-gutter">
        <div className={styles.content}>
          <p className={styles.eyebrow}>Appendix</p>
          <h2 className={styles.heading}>The Three TestFlight Sessions</h2>
          <p className={styles.subtitle}>Your Launchpad to Client Engagements</p>

          <div className={styles.columns}>
            {sessions.map(s => (
              <div key={s.number} className={styles.session}>
                <div className={styles.number}>{s.number}</div>
                <div className={styles.titlePill}>{s.title}</div>
                <div className={styles.body}>
                  <p className={styles.label}>Skills and objectives:</p>
                  <ul className={styles.list}>
                    {s.items.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomBar text="Aspire Development Plan · Dilruba Turan" />
    </Slide>
  )
}
