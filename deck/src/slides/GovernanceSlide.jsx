import Slide from '../components/Slide'
import BottomBar from '../components/BottomBar'
import styles from './GovernanceSlide.module.css'

import leandroImg from '../data/governance/leandro.png'
import marcelImg from '../data/governance/marcel.png'
import stefanieImg from '../data/governance/stefanie.png'
import ericImg from '../data/governance/eric.png'

const team = [
  {
    name: 'Leandro Lopez',
    title: 'Microsoft Solution Engineering Manager',
    programRole: 'Program Owner',
    img: leandroImg,
    accent: 'blue',
  },
  {
    name: 'Marcel Van Ingen',
    title: 'Microsoft Customer Success Unit Manager',
    programRole: 'Execution',
    img: marcelImg,
    accent: 'green',
  },
  {
    name: 'Stefanie Stavri',
    title: 'GitHub Regional Sales Director',
    programRole: 'Speaker Curation',
    img: stefanieImg,
    accent: 'purple',
  },
  {
    name: 'Eric Laan',
    title: 'Microsoft ING CAIP Lead',
    programRole: 'Customer-Zero & Program Co-Owner',
    img: ericImg,
    accent: 'orange',
  },
]

export default function GovernanceSlide() {
  return (
    <Slide index={8} className={styles.governance}>
      <div className="accent-bar" />
      <div className="grid-dots" style={{ right: 40, top: 100 }} />

      <div className="content-frame content-gutter">
        <div className={styles.header}>
          <h2>Governance</h2>
        </div>
        <p className={styles.subtitle}>
          A focused leadership team with clear accountability drives smooth, scalable program execution.
        </p>

        <div className={styles.cardGrid}>
          {team.map((m) => (
            <div key={m.name} className={`${styles.card} ${styles[m.accent]}`}>
              <div className={styles.avatarWrap}>
                <img src={m.img} alt={m.name} className={styles.avatar} />
              </div>
              <div className={styles.cardBody}>
                <h3 className={styles.name}>{m.name}</h3>
                <p className={styles.title}>{m.title}</p>
                <span className={`${styles.roleBadge} ${styles[`badge${m.accent}`]}`}>
                  {m.programRole}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomBar />
    </Slide>
  )
}
