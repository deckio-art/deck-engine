import { BottomBar, Slide } from '@lopezleandro03/canvas-engine'
import styles from './CoachingTeamSlide.module.css'

import elianeImg from '../../data/coaches/Eliane.png'
import emelImg from '../../data/coaches/Emel.png'
import aramImg from '../../data/coaches/Aram.png'
import ivoImg from '../../data/coaches/Ivo.png'

const run1 = [
  {
    name: 'Eliane',
    title: 'Microsoft Solution Specialist',
    programRole: 'Panelist',
    img: elianeImg,
    accent: 'purple',
  },
  {
    name: 'Emel Mendoza',
    title: 'Microsoft Infra Solution Engineer',
    programRole: 'Panelist',
    img: emelImg,
    accent: 'blue',
  },
]

const run2 = [
  {
    name: 'Aram Smith',
    title: 'Microsoft Infra Solution Engineer',
    programRole: 'Panelist',
    img: aramImg,
    accent: 'green',
  },
  {
    name: 'Ivo',
    title: 'Microsoft Solution Specialist',
    programRole: 'Panelist',
    img: ivoImg,
    accent: 'orange',
  },
]

function TeamCard({ m }) {
  return (
    <div className={`${styles.card} ${styles[m.accent]}`}>
      <div className={styles.avatarWrap}>
        {m.img ? (
          <img src={m.img} alt={m.name} className={styles.avatar} />
        ) : (
          <div className={`${styles.initialsAvatar} ${styles[`initials${m.accent}`]}`}>
            {m.initials}
          </div>
        )}
      </div>
      <div className={styles.cardBody}>
        <h3 className={styles.name}>{m.name}</h3>
        <p className={styles.title}>{m.title}</p>
        <span className={`${styles.roleBadge} ${styles[`badge${m.accent}`]}`}>
          {m.programRole}
        </span>
      </div>
    </div>
  )
}

export default function TestFlightTeamSlide() {
  return (
    <Slide index={5} className={styles.slide}>
      <div className="accent-bar" />
      <div className="grid-dots" style={{ right: 40, top: 100 }} />

      <div className="content-frame content-gutter">
        <div className={styles.header}>
          <h2>TestFlight Team</h2>
        </div>
        <p className={styles.subtitle}>
          The panelists joining each TestFlight run across all three sessions to challenge, guide, and evaluate.
        </p>

        <div className={styles.runRow}>
          <div>
            <h3 className={styles.tierLabel}>Run 1 — Panelists</h3>
            <div className={`${styles.cardGrid} ${styles.gridTwo}`} style={{ maxWidth: 'none' }}>
              {run1.map((m) => <TeamCard key={m.name} m={m} />)}
            </div>
          </div>
          <div>
            <h3 className={styles.tierLabel}>Use Case</h3>
            <div className={styles.useCaseCard}>
              <h4 className={styles.useCaseTitle}>Platform Transition Following AVS 36 Retirement</h4>
              <span className={styles.useCaseCustomer}>NorthGrid Energy Services</span>
              <p className={styles.useCaseDesc}>
                A national power grid provider must migrate off AVS 36 after Microsoft announced end‑of‑sale.
                Customers are frustrated and evaluating competitive options.
                Navigate complex conversations around migration readiness, costs, technical maturity,
                and long‑term platform viability with IT leaders, cloud architects, and financial stakeholders.
              </p>
            </div>
          </div>
        </div>

        <div className={styles.runRow}>
          <div>
            <h3 className={styles.tierLabel}>Run 2 — Panelists</h3>
            <div className={`${styles.cardGrid} ${styles.gridTwo}`} style={{ maxWidth: 'none' }}>
              {run2.map((m) => <TeamCard key={m.name} m={m} />)}
            </div>
          </div>
          <div>
            <h3 className={styles.tierLabel}>Use Case</h3>
            <div className={styles.useCaseCard}>
              <h4 className={styles.useCaseTitle}>TBD</h4>
              <span className={styles.useCaseCustomer}>TBD</span>
              <p className={styles.useCaseDesc}>
                Use case to be defined.
              </p>
            </div>
          </div>
        </div>
      </div>

      <BottomBar text="Aspire Development Plan · Dilruba Turan" />
    </Slide>
  )
}
