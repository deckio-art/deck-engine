import { BottomBar, Slide } from '@lopezleandro03/canvas-engine'
import styles from './IntentSlide.module.css'

export default function IntentSlide() {
  return (
    <Slide index={5} className={styles.intent}>
      <div className="accent-bar" />

      <div className="content-frame content-gutter">
        <div className={styles.header}>
          <h2>Intent</h2>
          <p className={styles.subtitle}>Drive AI adoption through structured engagement, measurable outcomes, and community.</p>
        </div>

        {/* ── Three strategic pillars ── */}
        <div className={styles.pillars}>
          <div className={styles.pillar}>
            <div className={`${styles.pillarGlow} ${styles.glowBlue}`} />
            <div className={styles.pillarIcon}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
              </svg>
            </div>
            <h3>Teach the<br />New Dev Skill</h3>
            <p>Spec-driven development &amp; agentic engineering — devs must learn to <strong>lead autonomous agent fleets</strong>. The skill that turns every license into real AI consumption.</p>
            <div className={styles.pillarStat}>
              <span className={styles.statNum}>3.2×</span>
              <span className={styles.statLabel}>revenue multiplier target</span>
            </div>
          </div>

          <div className={styles.pillar}>
            <div className={`${styles.pillarGlow} ${styles.glowPurple}`} />
            <div className={`${styles.pillarIcon} ${styles.pillarIconPurple}`}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
              </svg>
            </div>
            <h3>Structure<br />Customer Engagement</h3>
            <p>Replace ad-hoc requests with a <strong>recurring expert-led series</strong> — Microsoft + GitHub engineers co-delivering.</p>
            <div className={styles.pillarStat}>
              <span className={styles.statNum}>400+</span>
              <span className={styles.statLabel}>participants per session</span>
            </div>
          </div>

          <div className={styles.pillar}>
            <div className={`${styles.pillarGlow} ${styles.glowGreen}`} />
            <div className={`${styles.pillarIcon} ${styles.pillarIconGreen}`}>
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
              </svg>
            </div>
            <h3>Build<br />Community Flywheel</h3>
            <p>Customer community centered on GitHub AI — peer learning drives adoption faster than any sales motion.</p>
            <div className={styles.pillarStat}>
              <span className={styles.statNum}>7</span>
              <span className={styles.statLabel}>exclusive customers seeding it</span>
            </div>
          </div>
        </div>

        {/* ── Execution & Measurement ── */}
        <div className={styles.lower}>
          {/* Left: execution flow */}
          <div className={styles.execFlow}>
            <div className={styles.execStep}>
              <div className={styles.execNum}>1</div>
              <div>
                <h4>Segment</h4>
                <p>High-activity accounts get dedicated sessions; others join shared cohorts.</p>
              </div>
            </div>
            <div className={styles.execConnector} />
            <div className={styles.execStep}>
              <div className={`${styles.execNum} ${styles.execNumPurple}`}>2</div>
              <div>
                <h4>Pilot</h4>
                <p>7 exclusive accounts — with STU, CSU &amp; account accountability.</p>
              </div>
            </div>
            <div className={styles.execConnector} />
            <div className={styles.execStep}>
              <div className={`${styles.execNum} ${styles.execNumGreen}`}>3</div>
              <div>
                <h4>Measure</h4>
                <p>3-metric scorecard per customer. Lightweight, consistent, actionable.</p>
              </div>
            </div>
          </div>

          {/* Right: metrics scorecard */}
          <div className={styles.scorecard}>
            <div className={styles.scorecardHeader}>Success Scorecard</div>
            <div className={styles.metricCards}>
              <div className={styles.metricCard}>
                <div className={styles.metricIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" /></svg>
                </div>
                <div className={styles.metricName}>Active Copilot Users</div>
                <div className={styles.metricTag}>Adoption</div>
              </div>
              <div className={`${styles.metricCard} ${styles.metricCardPurple}`}>
                <div className={styles.metricIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                </div>
                <div className={styles.metricName}>Usage Delta <span>(pre/post)</span></div>
                <div className={styles.metricTag}>Consumption</div>
              </div>
              <div className={`${styles.metricCard} ${styles.metricCardGreen}`}>
                <div className={styles.metricIcon}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                </div>
                <div className={styles.metricName}>Attendance → Replays</div>
                <div className={styles.metricTag}>Reach</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomBar />
    </Slide>
  )
}
