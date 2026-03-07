import styles from './ProjectPicker.module.css'
import { getProjects } from './utils/projectRegistry'

export default function ProjectPicker() {
  const projects = getProjects()

  const navigate = (id) => {
    window.location.hash = `#/${id}`
  }

  return (
    <div className={styles.picker}>
      <div className={styles.header}>
        <h1 className={styles.title}>Canvas</h1>
        <p className={styles.subtitle}>Select a project to open</p>
      </div>
      <div className={styles.grid}>
        {projects.map(p => (
          <button
            key={p.id}
            className={styles.card}
            onClick={() => navigate(p.id)}
            style={{ '--card-accent': p.accent }}
          >
            <div className={styles.cardIcon}>{p.icon}</div>
            <h2 className={styles.cardTitle}>{p.title}</h2>
            <p className={styles.cardSubtitle}>{p.subtitle}</p>
            <p className={styles.cardDesc}>{p.description}</p>
            <div className={styles.cardArrow}>→</div>
          </button>
        ))}
      </div>
      <p className={styles.footer}>Press a card to enter · Esc to return here</p>
    </div>
  )
}
