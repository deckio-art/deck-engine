import styles from './BottomBar.module.css'

export default function BottomBar({ text }) {
  return (
    <div className={styles.bar}>
      <span>{text || <>GitHub Copilot &nbsp;&middot;&nbsp; Reimagine Software Development</>}</span>
    </div>
  )
}
