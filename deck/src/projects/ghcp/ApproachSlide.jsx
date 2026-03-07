import { BottomBar, Slide } from '@lopezleandro03/canvas-engine'
import styles from './ApproachSlide.module.css'

export default function ApproachSlide({ index = 7 }) {
  return (
    <Slide index={index} className={styles.approach}>
      <div className="accent-bar" />

      <div className="content-frame content-gutter">
        <div className={styles.header}>
          <h2>Approach</h2>
          <p className={styles.subtitle}>
            Bi-weekly, demo-first expert series — <strong>Microsoft + GitHub deliver content</strong>, customers drive internal engagement.
          </p>
        </div>

        <div className={styles.body}>
          {/* ── Left: Cadence + Format overview ── */}
          <div className={styles.left}>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={`${styles.cardIcon} ${styles.cardIconBlue}`}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><path d="M16 2v4M8 2v4M3 10h18" /></svg>
                </div>
                <h3>Cadence</h3>
              </div>
              <div className={styles.cadenceGrid}>
                <div className={styles.cadenceItem}>
                  <span className={styles.cadenceNum}>2×</span>
                  <span className={styles.cadenceLabel}>per month</span>
                </div>
                <div className={styles.cadenceItem}>
                  <span className={styles.cadenceNum}>1hr</span>
                  <span className={styles.cadenceLabel}>per session</span>
                </div>
                <div className={styles.cadenceItem}>
                  <span className={styles.cadenceNum}>200+</span>
                  <span className={styles.cadenceLabel}>min attendees</span>
                </div>
              </div>
              <ul className={styles.bulletList}>
                <li>Specific topic + live demo each session — <strong>no slide decks</strong></li>
                <li>Customer manages audience &amp; promotion; <strong>Microsoft &amp; GitHub provide speakers &amp; content</strong></li>
                <li>Rotating speakers: GitHub SEs/CSAs, Microsoft GBBs, Dev Advocates</li>
              </ul>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={`${styles.cardIcon} ${styles.cardIconPurple}`}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                </div>
                <h3>Format</h3>
              </div>
              <ul className={styles.bulletList}>
                <li>Customer champion opens &amp; provides internal context</li>
                <li><strong>Demo-led sessions</strong> — hands-on Agentic Engineering skills showing how GitHub &amp; Microsoft engineers build with AI and how to use latest features</li>
                <li><strong>Live expert panel</strong> — GitHub &amp; Microsoft engineers join the chat alongside the presenter to answer questions and clear doubts in real time</li>
              </ul>
            </div>
          </div>

          {/* ── Right: Session agenda table ── */}
          <div className={styles.right}>
            <div className={`${styles.card} ${styles.cardFull}`}>
              <div className={styles.cardHeader}>
                <div className={`${styles.cardIcon} ${styles.cardIconGreen}`}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 20V10M18 20V4M6 20v-4" /></svg>
                </div>
                <h3>Session Agenda</h3>
              </div>

              <div className={styles.agendaRows}>
                <div className={styles.agendaRow}>
                  <div className={styles.agendaTime}>
                    <span className={styles.agendaDuration}>30–40</span>
                    <span className={styles.agendaUnit}>min</span>
                  </div>
                  <div className={styles.agendaBar} style={{background: 'var(--accent)'}} />
                  <div className={styles.agendaContent}>
                    <h4>Hands-on Demo</h4>
                    <p>GitHub/Microsoft live demo on focused topic — drive feature adoption</p>
                    <span className={styles.agendaSpeaker}>GitHub / Microsoft</span>
                  </div>
                </div>

                <div className={styles.agendaRow}>
                  <div className={styles.agendaTime}>
                    <span className={styles.agendaDuration}>10</span>
                    <span className={styles.agendaUnit}>min</span>
                  </div>
                  <div className={styles.agendaBar} style={{background: 'var(--purple)'}} />
                  <div className={styles.agendaContent}>
                    <h4>Live Q&amp;A</h4>
                    <p>Open floor — adoption blockers, roadmap, best practices</p>
                    <span className={styles.agendaSpeaker}>GitHub / Microsoft + Customer</span>
                  </div>
                </div>

                <div className={styles.agendaRow}>
                  <div className={styles.agendaTime}>
                    <span className={styles.agendaDuration}>10–20</span>
                    <span className={styles.agendaUnit}>min</span>
                  </div>
                  <div className={styles.agendaBar} style={{background: 'var(--green)'}} />
                  <div className={styles.agendaContent}>
                    <h4>Customer Engineer Demo</h4>
                    <p>Create opportunity for customer engineers to share best practices &amp; skills and create FOMO</p>
                    <span className={styles.agendaSpeaker}>Customer</span>
                  </div>
                </div>
              </div>

              <div className={styles.agendaFooter}>
                <span className={styles.agendaKey}><span style={{background: 'var(--accent)'}} /> GitHub / Microsoft</span>
                <span className={styles.agendaKey}><span style={{background: 'var(--purple)'}} /> Joint</span>
                <span className={styles.agendaKey}><span style={{background: 'var(--green)'}} /> Customer-led</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomBar />
    </Slide>
  )
}
