import { BottomBar, Slide } from '@lopezleandro03/canvas-engine'
import styles from './AVDOpportunitySlide.module.css'

const TOTAL_ACR = 200

const customers = [
  {
    name: 'Royal BAM',
    acr: 120,
    milestones: 4,
    dates: ['1 May 2026', '1 Sept 2026'],
    opportunity: 'GIS/AutoCAD AVD → New GPU Family',
    warning: 'B40 Private Preview requested Dec 2025 — no response received.',
    colorKey: 'orange',
  },
  {
    name: 'Heijmans',
    acr: 40,
    milestones: 2,
    dates: ['1 Sept 2026', '1 Dec 2026'],
    opportunity: 'New MACC | MCA-E Renewal',
    colorKey: 'purple',
  },
  {
    name: 'Hanab',
    acr: 30,
    milestones: 2,
    dates: ['1 May 2026', '1 Sept 2026'],
    opportunity: 'AutoDesk to Azure AVD',
    colorKey: 'cyan',
  },
  {
    name: 'Dura Vermeer',
    acr: 10,
    milestones: 1,
    dates: ['1 May 2026'],
    opportunity: 'AVD BIM Workplaces · Cegeka CSP',
    colorKey: 'green',
  },
]

const actions = [
  { status: 'done',    label: 'Royal BAM B40 Private Preview access submitted', date: 'Dec 2025' },
  { status: 'done',    label: 'Cegeka CSP escalation raised — France Central AVD capacity', date: 'Feb 2026' },
  { status: 'done',    label: 'Internal escalation filed for all 4 accounts via FastTrack', date: 'Feb 2026' },
  { status: 'done',    label: 'Customer communications sent acknowledging delays', date: 'Mar 2026' },
  { status: 'pending', label: 'AVD SKU roadmap clarification requested from product team', date: 'Awaiting' },
  { status: 'pending', label: 'Alternative SKU assessment in progress for Dura Vermeer', date: 'Awaiting' },
]

export default function AVDOpportunitySlide() {
  return (
    <Slide index={4} className={styles.slide}>
      <div className="accent-bar" />
      <div className={`orb ${styles.orb1}`} />
      <div className={`orb ${styles.orb2}`} />

      <div className={styles.body}>

        <div className={styles.header}>
          <span className={styles.eyebrow}>Critical Infrastructure · Construction Segment · Blocked Pipeline</span>
          <h2 className={styles.heading}>
            <span className={styles.highlight}>9 Milestones Blocked</span> · 200K ACR/month · Customer Trust Eroding
          </h2>
          <p className={styles.subtitle}>
            AVD SKU availability is blocking the pipeline for four construction &amp; infra customers — BIM, GIS, and AutoCAD workloads cannot migrate without GPU SKU clarity
          </p>
        </div>

        <div className={styles.impactBar}>
          {customers.map(c => (
            <div
              key={c.name}
              className={`${styles.impactSegment} ${styles[`seg${c.colorKey}`]}`}
              style={{ width: `${(c.acr / TOTAL_ACR) * 100}%` }}
              title={`${c.name}: ${c.acr}K ACR/mo`}
            >
              <span className={styles.segLabel}>{c.acr}K</span>
            </div>
          ))}
        </div>
        <div className={styles.impactLegend}>
          {customers.map(c => (
            <span key={c.name} className={`${styles.legendItem} ${styles[`leg${c.colorKey}`]}`}>
              <span className={styles.legendDot} />{c.name}
            </span>
          ))}
          <span className={styles.legendTotal}>= 200K ACR/mo blocked pipeline</span>
        </div>

        <div className={styles.main}>
          <div className={styles.cards}>
            {customers.map(c => (
              <div key={c.name} className={`${styles.card} ${styles[`card${c.colorKey}`]}`}>
                <div className={styles.cardTop}>
                  <span className={styles.customerName}>{c.name}</span>
                  <span className={`${styles.acrBadge} ${styles[`badge${c.colorKey}`]}`}>{c.acr}K ACR/mo</span>
                </div>

                <div className={styles.milestoneRow}>
                  <span className={styles.milestoneCount}>{c.milestones}</span>
                  <span className={styles.milestoneLabel}>milestone{c.milestones > 1 ? 's' : ''} blocked</span>
                </div>

                <div className={styles.dates}>
                  {c.dates.map(d => (
                    <span key={d} className={styles.dateChip}>{d}</span>
                  ))}
                </div>

                <p className={styles.opp}>{c.opportunity}</p>

                {c.warning && (
                  <div className={styles.warningBox}>
                    <span className={styles.warnIcon}>⚠</span>
                    <span>{c.warning}</span>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className={styles.actionsPanel}>
            <p className={styles.actionsTitle}>Actions Taken</p>
            <ul className={styles.actionsList}>
              {actions.map((a, i) => (
                <li key={i} className={`${styles.actionItem} ${styles[`action${a.status}`]}`}>
                  <span className={styles.actionDot} />
                  <span className={styles.actionText}>{a.label}</span>
                  <span className={styles.actionDate}>{a.date}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className={styles.cta}>
          <span className={styles.ctaIcon}>🎯</span>
          <p className={styles.ctaText}>
            We need <strong>1 person</strong> responsible for bringing SKU roadmap clarity to our Construction &amp; Infrastructure companies.
          </p>
          <span className={styles.ctaArrow}>ASK</span>
        </div>

      </div>

      <BottomBar text="dev-random" />
    </Slide>
  )
}
