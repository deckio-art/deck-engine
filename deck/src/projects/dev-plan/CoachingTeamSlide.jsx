import { BottomBar, Slide } from '@lopezleandro03/canvas-engine'
import styles from './CoachingTeamSlide.module.css'

import paulImg from '../../data/coaches/Paul.png'
import marcoImg from '../../data/coaches/Marco.png'
import bramImg from '../../data/coaches/Bram.png'
import leandroImg from '../../data/governance/leandro.png'

const manager = [
  {
    name: 'Leandro Lopez',
    title: 'Microsoft Solution Engineering Manager',
    programRole: 'Manager',
    img: leandroImg,
    accent: 'blue',
  },
]

const coaches = [
  {
    name: 'Paul Verboon',
    title: 'Microsoft Infra Solution Engineer',
    programRole: 'Coach',
    img: paulImg,
    accent: 'purple',
  },
]

const support = [
  {
    name: 'Marco Cancillo',
    title: 'Microsoft Infra Solution Engineer',
    programRole: 'Customer Work Support',
    img: marcoImg,
    accent: 'green',
  },
  {
    name: 'Bram Boer',
    title: 'Microsoft Infra Solution Engineer',
    programRole: 'Customer Work Support',
    img: bramImg,
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

export default function CoachingTeamSlide() {
  return (
    <Slide index={4} className={styles.slide}>
      <div className="accent-bar" />
      <div className="grid-dots" style={{ right: 40, top: 100 }} />

      <div className="content-frame content-gutter">
        <div className={styles.header}>
          <h2>Coaching Team</h2>
        </div>
        <p className={styles.subtitle}>
          A dedicated coaching team supporting Dilruba's growth across skills, business acumen, and technical excellence.
        </p>

        <h3 className={styles.tierLabel}>Manager &amp; Coach</h3>
        <div className={`${styles.cardGrid} ${styles.gridTwo}`}>
          {[...manager, ...coaches].map((m) => <TeamCard key={m.name} m={m} />)}
        </div>

        <h3 className={styles.tierLabel}>Customer Work Support</h3>
        <div className={`${styles.cardGrid} ${styles.gridTwo}`}>
          {support.map((m) => <TeamCard key={m.name} m={m} />)}
        </div>
      </div>

      <BottomBar text="Aspire Development Plan · Dilruba Turan" />
    </Slide>
  )
}
