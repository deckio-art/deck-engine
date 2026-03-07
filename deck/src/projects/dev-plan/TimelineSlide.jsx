import { BottomBar, Slide } from '@lopezleandro03/canvas-engine'
import styles from './TimelineSlide.module.css'

const sessions = [
  { num: 1, title: 'First Client Meeting', color: 'var(--purple)' },
  { num: 2, title: 'Business Envisioning', color: 'var(--pink)' },
  { num: 3, title: 'Solution Envisioning', color: 'var(--accent)' },
]

function TestFlightRun({ run, label, tagline }) {
  return (
    <div className={styles.run}>
      <div className={styles.runHeader}>
        <div className={styles.runBadge}>
          <span className={styles.runIcon}>🚀</span>
          TestFlight {run}
        </div>
        <span className={styles.runLabel}>{label}</span>
      </div>
      <p className={styles.runTagline}>{tagline}</p>
      <div className={styles.sessions}>
        {sessions.map(s => (
          <div key={s.num} className={styles.session} style={{ '--session-color': s.color }}>
            <div className={styles.sessionNum}>{s.num}</div>
            <h4 className={styles.sessionTitle}>{s.title}</h4>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TimelineSlide() {
  return (
    <Slide index={3} className={styles.slide}>
      <div className="accent-bar" />
      <div className={`${styles.content} content-frame content-gutter`}>
        <h1 className={styles.title}>Timeline</h1>

        <div className={styles.timeline}>
          <div className={styles.track}>
            {/* ── Brand Building band ── */}
            <div className={styles.brandBand}>
              <div className={styles.brandLabel}>⭐ Brand Building</div>
              <div className={styles.brandItems}>
                <div className={styles.brandItem}>
                  <span className={styles.brandDot} />
                  Build credibility with account teams
                </div>
                <div className={styles.brandItem}>
                  <span className={styles.brandDot} />
                  Become the go-to SE for your pod
                </div>
              </div>
            </div>

            {/* ── Hard Skills band (spans full width, above the main grid) ── */}
            <div className={styles.hardSkills}>
              <div className={styles.hardLabel}>📚 Hard Skills</div>
              <div className={styles.hardItems}>
                <div className={styles.hardItem}>
                  <svg className={styles.hardLogo} viewBox="0 0 23 23" fill="#fff">
                    <path d="M0 0h11v11H0zM12 0h11v11H12zM0 12h11v11H0zM12 12h11v11H12z"/>
                  </svg>
                  AZ-305 Azure Solutions Architect Expert
                </div>
                <div className={styles.hardItem}>
                  <svg className={styles.hardLogo} viewBox="0 0 16 16" fill="#fff">
                    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
                  </svg>
                  GitHub Copilot Certification
                </div>
                <div className={styles.hardItem}>
                  <svg className={styles.hardLogo} viewBox="0 0 64 64" fill="#7B42BC">
                    <path d="M32.7 0L0 18.9v25.2L14 52V27.5L32.7 17l18.7 10.5V52l14-7.9V18.9z"/>
                    <path d="M32.7 64l18.7-10.5V29l-18.7 10.5z"/>
                    <path d="M14 52l18.7 10.5V39.5L14 29z" opacity=".6"/>
                  </svg>
                  IaC Fundamentals
                </div>
                <div className={styles.hardItem}>
                  <svg className={styles.hardLogo} viewBox="0 0 722 702" fill="#326CE5">
                    <path d="M358.986 0c-12.07 0-23.396 3.722-33.68 10.403l-271.2 156.558c-20.148 11.948-33.68 34.396-33.68 58.1v313.116c0 23.704 13.148 46.152 33.68 58.1L325.306 752.64c10.284 6.68 21.61 10.402 33.68 10.402s23.396-3.722 33.68-10.403l271.2-156.558c20.148-11.948 33.68-34.396 33.68-58.1V225.06c0-23.704-13.148-46.152-33.68-58.1L392.666 10.403C382.382 3.722 371.056 0 358.986 0z" opacity=".3"/>
                    <path d="M361 51l-266 153.5V511L361 664.5 627 511V204.5z" fill="#326CE5"/>
                    <path d="M361 131c-5.3 0-9.6 3.6-10.8 8.5l-15.3 59.7c-11 2.2-21.5 5.7-31.3 10.4l-51.3-35.2c-4.4-3-10.3-2.6-14.2 1.3l-.3.3c-3.9 3.9-4.3 9.8-1.3 14.2l35.2 51.3c-4.7 9.8-8.2 20.3-10.4 31.3l-59.7 15.3c-4.9 1.2-8.5 5.5-8.5 10.8v.4c0 5.3 3.6 9.6 8.5 10.8l59.7 15.3c2.2 11 5.7 21.5 10.4 31.3l-35.2 51.3c-3 4.4-2.6 10.3 1.3 14.2l.3.3c3.9 3.9 9.8 4.3 14.2 1.3l51.3-35.2c9.8 4.7 20.3 8.2 31.3 10.4l15.3 59.7c1.2 4.9 5.5 8.5 10.8 8.5h.4c5.3 0 9.6-3.6 10.8-8.5l15.3-59.7c11-2.2 21.5-5.7 31.3-10.4l51.3 35.2c4.4 3 10.3 2.6 14.2-1.3l.3-.3c3.9-3.9 4.3-9.8 1.3-14.2l-35.2-51.3c4.7-9.8 8.2-20.3 10.4-31.3l59.7-15.3c4.9-1.2 8.5-5.5 8.5-10.8v-.4c0-5.3-3.6-9.6-8.5-10.8l-59.7-15.3c-2.2-11-5.7-21.5-10.4-31.3l35.2-51.3c3-4.4 2.6-10.3-1.3-14.2l-.3-.3c-3.9-3.9-9.8-4.3-14.2-1.3l-51.3 35.2c-9.8-4.7-20.3-8.2-31.3-10.4l-15.3-59.7c-1.2-4.9-5.5-8.5-10.8-8.5zm.2 167c34.8 0 63 28.2 63 63s-28.2 63-63 63-63-28.2-63-63 28.2-63 63-63z" fill="#fff"/>
                  </svg>
                  CNCF Kubernetes and Cloud Native Associate
                </div>
              </div>
            </div>

            {/* ── Buddy & Aspire Program band ── */}
            <div className={styles.buddyBand}>
              <div className={styles.buddyLabel}>🤝 Buddy &amp; Aspire Program</div>
              <div className={styles.buddyItems}>
                <div className={styles.buddyItem}>
                  <span className={styles.buddyAvatar}>P</span>
                  <div className={styles.buddyInfo}>
                    <span className={styles.buddyName}>Paul</span>
                    <span className={styles.buddyRole}>Primary Buddy &amp; Coach</span>
                  </div>
                </div>
                <div className={styles.buddyItem}>
                  <span className={styles.buddyDot} />
                  Bi-weekly 1:1 check-ins
                </div>
                <div className={styles.buddyItem}>
                  <span className={styles.buddyDot} />
                  Aspire cohort sessions
                </div>
                <div className={styles.buddyItem}>
                  <span className={styles.buddyDot} />
                  On-demand pairing &amp; guidance
                </div>
              </div>
            </div>

            {/* ── 4-column grid aligned to months ── */}
            <div className={styles.gridWrapper}>
              {/* Connect line at mid-April */}
              <div className={styles.connectLine}>
                <div className={styles.connectDash} />
                <span className={styles.connectLabel}>Connect</span>
                <div className={styles.connectDash} />
              </div>

              <div className={styles.grid}>
              {/* March: TestFlight 1 */}
              <div className={styles.col}>
                <TestFlightRun
                  run={1}
                  label="Foundation"
                  tagline="Reverse-shadowed by experienced SEs and SSPs in real-world customer simulations"
                />
              </div>

              {/* April: TestFlight 2 */}
              <div className={styles.col}>
                <TestFlightRun
                  run={2}
                  label="Confidence"
                  tagline="Reverse-shadowed by experienced SEs and SSPs in real-world customer simulations"
                />
              </div>

              {/* May–June: Retrospective focus */}
              <div className={`${styles.col} ${styles.colSpan2}`}>
                <div className={styles.retroCard}>
                  <div className={styles.retroIcon}>🔄</div>
                  <div className={styles.retroContent}>
                    <span className={styles.retroTitle}>TestFlight Retrospective</span>
                    <span className={styles.retroDesc}>Focus on addressing areas for improvement identified during TestFlight cycles</span>
                  </div>
                </div>
              </div>
              </div>

            {/* Shadow + Real Work row (aligned) */}
            <div className={styles.shadowRow}>
              <div className={styles.shadowLayer}>
                <div className={styles.shadowContent}>
                  <span className={styles.shadowTitle}>Pod Infra Milestones Owner</span>
                  <span className={styles.shadowHighlight}>Pulls in Sr. SEs for execution &amp; depth</span>
                  <span className={styles.shadowSub}>Owns milestones · Drives outcomes · They deliver the depth</span>
                </div>
              </div>
              <div className={`${styles.colSpan2} ${styles.realWrap}`}>
                <div className={styles.realCard}>
                  <div className={styles.realContent}>
                    <span className={styles.realTitle}>Pod Infra Milestones Owner</span>
                    <span className={styles.realHighlight}>Delivers the depth herself</span>
                    <span className={styles.realSub}>Owns milestones · Drives outcomes · Sr. SEs for strategic support</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Autonomy spectrum */}
            <div className={styles.spectrum}>
              <span className={styles.spectrumLabel}>Guided</span>
              <div className={styles.spectrumBar} />
              <span className={styles.spectrumLabel}>Autonomous</span>
            </div>
            </div>

            {/* ── Month timeline bar ── */}
            <div className={styles.monthBar}>
              <div className={styles.monthLine} />
              {['March', 'April', 'May', 'June'].map((m, i) => (
                <div key={m} className={styles.monthMark} style={{ left: `${i * 25}%` }}>
                  <div className={styles.monthDot} />
                  <span className={styles.monthName}>{m}</span>
                </div>
              ))}
              <div className={styles.monthArrowEnd}>→</div>
            </div>

            {/* ── X axis ── */}
            <div className={styles.axisX}>
              <span className={styles.axisLabel}>Skills &amp; Experience</span>
              <span className={styles.axisArrow}>→</span>
            </div>
          </div>
        </div>

        <p className={styles.footnote}>
          * Each TestFlight run consists of 3 real-world customer simulations reverse-shadowed by experienced SEs and SSPs
        </p>
      </div>
      <BottomBar text="Aspire Development Plan · Dilruba Turan" />
    </Slide>
  )
}
