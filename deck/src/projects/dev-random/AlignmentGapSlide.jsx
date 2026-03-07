import { useRef, useEffect, useState } from 'react'
import { BottomBar, Slide } from '@lopezleandro03/canvas-engine'
import styles from './AlignmentGapSlide.module.css'

const analytics = ['Microsoft Fabric', 'Power BI', 'Real-Time Intelligence', 'Synapse', 'Databricks']
const transactional = ['Azure SQL DB', 'Azure SQL MI', 'SQL Server', 'Cosmos DB', 'SQL DB in Fabric']
const oss = ['PostgreSQL', 'MySQL', 'DocumentDB']
const appsProducts = ['App Service', 'Functions', 'Container Apps', 'API Management', 'GitHub', 'Azure AI Foundry']

export default function AlignmentGapSlide({ index }) {
  const diagramRef = useRef(null)
  const appOwnerRef = useRef(null)
  const txProductsRef = useRef(null)
  const [line, setLine] = useState(null)

  useEffect(() => {
    const update = () => {
      if (!diagramRef.current || !appOwnerRef.current || !txProductsRef.current) return
      const base = diagramRef.current.getBoundingClientRect()
      const from = appOwnerRef.current.getBoundingClientRect()
      const to = txProductsRef.current.getBoundingClientRect()
      setLine({
        x1: from.left + from.width / 2 - base.left,
        y1: from.bottom - base.top,
        x2: to.left + to.width / 2 - base.left,
        y2: to.top - base.top,
      })
    }
    update()
    window.addEventListener('resize', update)
    const timer = setTimeout(update, 100)
    return () => { window.removeEventListener('resize', update); clearTimeout(timer) }
  }, [])

  const personIcon = (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>
  )

  return (
    <Slide index={index} className={styles.slide}>
      <div className={styles.wrapper}>

        <div className={styles.header}>
          <h2>The Broken Link</h2>
          <p>Application &amp; Transactional Systems Owners rely on transactional databases — but Solution Engineer Apps are not incentivised on data workloads</p>
        </div>

        <div className={styles.diagram} ref={diagramRef}>
          <div className={styles.grid}>

            {/* ── Row 1: Customer Stakeholders ── */}
            <div className={styles.label}><span className={styles.labelText}>Customer Stakeholders</span></div>
            <div className={styles.stakeholderData}>
              <div className={`${styles.card} ${styles.cardBlue}`}>
                <div className={`${styles.cardIcon} ${styles.cardIconBlue}`}>{personIcon}</div>
                Data &amp; Analytics Platform Owners
              </div>
            </div>
            <div className={styles.stakeholderApps} ref={appOwnerRef}>
              <div className={`${styles.card} ${styles.cardPurple}`}>
                <div className={`${styles.cardIcon} ${styles.cardIconPurple}`}>{personIcon}</div>
                Application &amp; Transactional Systems Owners
              </div>
            </div>
            <div />

            {/* ── Row 2: Connectors (relationship ownership) ── */}
            <div className={styles.label}><span className={`${styles.labelText} ${styles.ownershipLabel}`}>Relationship</span></div>
            <div className={styles.connectorCell}>
              <div className={styles.arrow}>
                <div className={`${styles.arrowTipUp} ${styles.arrowTipUpBlue}`} />
                <div className={`${styles.arrowStem} ${styles.arrowStemBlue}`} />
                <span className={styles.arrowTagOwnership}>Owns relationship</span>
              </div>
            </div>
            <div className={styles.connectorCell}>
              <div className={styles.arrow}>
                <div className={`${styles.arrowTipUp} ${styles.arrowTipUpPurple}`} />
                <div className={`${styles.arrowStem} ${styles.arrowStemPurple}`} />
                <span className={styles.arrowTagOwnership}>Owns relationship</span>
              </div>
            </div>
            <div />

            {/* ── Row 3: Solution Engineers ── */}
            <div className={styles.label}><span className={styles.labelText}>Solution Engineers</span></div>
            <div className={styles.seData}>
              <div className={`${styles.seCard} ${styles.seCardBlue}`}>
                <div className={`${styles.seIcon} ${styles.seIconBlue}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 20V10M18 20V4M6 20v-4" /></svg>
                </div>
                Solution Engineer Data
              </div>
            </div>
            <div className={styles.seApps}>
              <div className={`${styles.seCard} ${styles.seCardPurple}`}>
                <div className={`${styles.seIcon} ${styles.seIconPurple}`}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8M12 17v4" /></svg>
                </div>
                Solution Engineer Apps
              </div>
              <span className={styles.noIncentive}>⚠ Not incentivised on data</span>
            </div>
            <div />

            {/* ── Row 4: Connectors (incentives) ── */}
            <div className={styles.label}><span className={`${styles.labelText} ${styles.incentiveLabel}`}>Incentives</span></div>
            <div className={styles.connectorCell}>
              <div className={styles.arrow}>
                <span className={styles.arrowTag}>✔ Incentivised</span>
                <div className={`${styles.arrowStem} ${styles.arrowStemBlue}`} />
                <div className={`${styles.arrowTip} ${styles.arrowTipBlue}`} />
              </div>
            </div>
            <div className={styles.connectorCell}>
              <div className={styles.arrow}>
                <span className={styles.arrowTag}>✔ Incentivised</span>
                <div className={`${styles.arrowStem} ${styles.arrowStemPurple}`} />
                <div className={`${styles.arrowTip} ${styles.arrowTipPurple}`} />
              </div>
            </div>
            <div />

            {/* ── Row 5: Products ── */}
            <div className={styles.label}><span className={styles.labelText}>Products</span></div>
            <div className={styles.productsArea} ref={txProductsRef}>
              <div className={styles.productsRow}>
                {analytics.map(p => <span key={p} className={`${styles.chip} ${styles.chipAnalytics}`}>{p}</span>)}
              </div>
              <div className={styles.productsRow}>
                {transactional.map(p => <span key={p} className={`${styles.chip} ${styles.chipTransactional}`}>{p}</span>)}
              </div>
              <div className={styles.productsRow}>
                {oss.map(p => <span key={p} className={`${styles.chip} ${styles.chipOss}`}>{p}</span>)}
              </div>
            </div>
            <div className={styles.appsProductsArea}>
              <div className={styles.productsRow}>
                {appsProducts.map(p => <span key={p} className={`${styles.chip} ${styles.chipApps}`}>{p}</span>)}
              </div>
            </div>
            <div />

            {/* ── Row 6: Legend ── */}
            <div className={styles.legendRow}>
              <span className={styles.legendItem}><span className={styles.legendDot} style={{background:'#0550ae'}} /> Analytics / Fabric</span>
              <span className={styles.legendItem}><span className={styles.legendDot} style={{background:'#9a6700'}} /> Transactional SQL</span>
              <span className={styles.legendItem}><span className={styles.legendDot} style={{background:'#1a7f37'}} /> Open-Source DBs</span>
              <span className={styles.legendItem}><span className={styles.legendDot} style={{background:'#6639ba'}} /> App Platform</span>
              <span className={styles.legendItem}><span className={styles.legendDot} style={{background:'#cf222e'}} /> Broken Link</span>
            </div>

          </div>

          {/* ── SVG cross-link: App Owners → Transactional Products ── */}
          {line && (
            <svg className={styles.svgOverlay} xmlns="http://www.w3.org/2000/svg">
              <defs>
                <marker id="redArrow" markerWidth="8" markerHeight="6" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L8,3 L0,6" fill="rgba(207,34,46,0.7)" />
                </marker>
              </defs>
              <line
                x1={line.x1} y1={line.y1 + 4}
                x2={line.x2 + 80} y2={line.y2 - 4}
                stroke="rgba(207,34,46,0.35)"
                strokeWidth="2"
                strokeDasharray="8 5"
                markerEnd="url(#redArrow)"
              />
              <text
                x={(line.x1 + line.x2 + 80) / 2 - 40}
                y={(line.y1 + line.y2) / 2 - 10}
                fill="#cf222e"
                fontSize="11"
                fontWeight="600"
                fontFamily="Segoe UI, system-ui"
                textAnchor="middle"
              >
                owns these DBs
              </text>
            </svg>
          )}
        </div>

      </div>
    </Slide>
  )
}
