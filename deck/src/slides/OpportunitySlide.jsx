import { useState, useMemo } from 'react'
import Slide from '../components/Slide'
import BottomBar from '../components/BottomBar'
import styles from './OpportunitySlide.module.css'
import {
  customers, DISCOUNT, ACD_RATE,
  PRICE_BUSINESS, PRICE_ENTERPRISE, PRU_OVERAGE_RATE,
  PRU_BIZ, PRU_ENT,
  PRU_OVERAGE_BIZ_PCT, PRU_OVERAGE_BIZ_EXTRA,
  PRU_OVERAGE_ENT_PCT, PRU_OVERAGE_ENT_EXTRA,
  TARGET_PENETRATION,
  totalGHCP, targetSeats,
  fmtK, fmtM, fmtPct, barPct, avgPen,
  computeScenarios,
} from '../data/opportunity'

const tabs = [
  { id: 'horizontal', label: 'Horizontal Expansion', icon: '↔' },
  { id: 'vertical',   label: 'Vertical Expansion',   icon: '↕' },
  { id: 'total',      label: 'Total Opportunity',     icon: '⊕' },
]

const arpuMultiplier = (PRICE_ENTERPRISE / PRICE_BUSINESS).toFixed(0)
const discountLabel = DISCOUNT > 0 ? ` (${Math.round(DISCOUNT * 100)}% discount applied)` : ''
const seatsK = (v) => (v / 1000).toFixed(0) + 'K'
const tgtPctLabel = Math.round(TARGET_PENETRATION * 100) + '%'

export default function OpportunitySlide() {
  const [active, setActive] = useState('horizontal')
  const [acdEnabled, setAcdEnabled] = useState(false)

  const totalDiscount = DISCOUNT + (acdEnabled ? ACD_RATE : 0)
  const s = useMemo(() => computeScenarios(totalDiscount), [totalDiscount])

  const discountLabel = totalDiscount > 0 ? ` (${Math.round(totalDiscount * 100)}% discount applied${acdEnabled ? ' incl. ACD' : ''})` : ''

  return (
    <Slide index={3} className={styles.opportunity}>
      <div className="accent-bar" />

      <div className={`${styles.topRow} content-frame content-gutter`}>
        <div className={styles.header}>
          <h2>Pilot Opportunity <span className={styles.dim}>&mdash; {customers.length} Strategic Customers</span></h2>
          <div className={styles.tag}>Live Dashboard</div>
          <button
            className={`${styles.acdToggle} ${acdEnabled ? styles.acdActive : ''}`}
            onClick={(e) => { e.stopPropagation(); setAcdEnabled(v => !v) }}
            title={acdEnabled ? 'Disable ACD (25% discount)' : 'Enable ACD (25% discount)'}
          >
            ACD {acdEnabled ? 'ON' : 'OFF'}
          </button>
          {totalDiscount > 0 && <div className={styles.discountBadge}>{Math.round(totalDiscount * 100)}% discount{acdEnabled ? ' (ACD)' : ''}</div>}
        </div>

        <div className={styles.tabs}>
          {tabs.map(t => (
            <button
              key={t.id}
              className={`${styles.tab} ${active === t.id ? styles.tabActive : ''}`}
              onClick={(e) => { e.stopPropagation(); setActive(t.id) }}
            >
              <span className={styles.tabIcon}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {active === 'horizontal' && (
        <div className={`${styles.horizontalPanel} content-frame content-gutter`}>
          <div className={styles.iframeWrap}>
            <iframe src="/ghcp-opportunity.html" loading="eager" title="Opportunity Dashboard" />
          </div>
        </div>
      )}

      {active === 'vertical' && (
        <div className={`${styles.vertical} content-frame content-gutter`}>
          <p className={styles.vertDesc}>
            Beyond seat growth — increasing ARPU from <strong>${PRICE_BUSINESS}</strong> to <strong>${PRICE_ENTERPRISE}</strong>/dev/mo
            via plan upgrades and Premium Request Unit (PRU) overage consumption.{discountLabel}
          </p>

          {/* ── Plan comparison cards ── */}
          <div className={styles.plans}>
            <div className={`${styles.planCard} ${styles.planBiz}`}>
              <div className={styles.planBadge}>Current</div>
              <h4>Copilot for Business</h4>
              <div className={styles.planPrice}><span>${PRICE_BUSINESS}</span>/dev/mo</div>
              <ul>
                <li><strong>{PRU_BIZ.toLocaleString()}</strong> PRUs / month included</li>
                <li>IDE code completions &amp; chat</li>
                <li>CLI &amp; mobile support</li>
              </ul>
            </div>
            <div className={styles.planArrow}>
              <div className={styles.arrowLine} />
              <div className={styles.arrowLabel}>{arpuMultiplier}× ARPU</div>
            </div>
            <div className={`${styles.planCard} ${styles.planEnt}`}>
              <div className={styles.planBadge}>Target</div>
              <h4>Copilot Enterprise</h4>
              <div className={styles.planPrice}><span>${PRICE_ENTERPRISE}</span>/dev/mo</div>
              <ul>
                <li><strong>{PRU_ENT.toLocaleString()}</strong> PRUs / month included</li>
                <li>Knowledge bases &amp; org context</li>
                <li>Fine-tuned models &amp; guardrails</li>
              </ul>
            </div>
            <div className={`${styles.planCard} ${styles.planPayg}`}>
              <div className={styles.planBadge}>Either plan</div>
              <h4>Pay-as-you-go PRUs</h4>
              <div className={styles.planPrice}><span>${PRU_OVERAGE_RATE}</span>/PRU overage</div>
              <ul>
                <li>After {PRU_BIZ} (Biz) or {PRU_ENT.toLocaleString()} (Ent) allowance</li>
                <li>Agent mode, multi-model, MCP</li>
                <li>Scales with power users</li>
              </ul>
            </div>
          </div>

          {/* ── Revenue impact table ── */}
          <div className={styles.impactSection}>
            <h4 className={styles.impactTitle}>Revenue Impact Model</h4>
            <p className={styles.impactDesc}>Across {totalGHCP.toLocaleString()} current Copilot seats · projections at {tgtPctLabel} target ({targetSeats.toLocaleString()} seats)</p>
            <table className={styles.impactTable}>
              <thead>
                <tr>
                  <th>Scenario</th>
                  <th>Current seats ({seatsK(totalGHCP)})</th>
                  <th>@ {tgtPctLabel} target ({seatsK(targetSeats)})</th>
                  <th>Uplift vs baseline</th>
                </tr>
              </thead>
              <tbody>
                <tr className={styles.rowBase}>
                  <td>
                    <span className={styles.dot} style={{background: 'var(--accent)'}} />
                    Baseline — all Business
                  </td>
                  <td>{fmtK(s.moBaseCurrent)} <span>/mo</span></td>
                  <td>{fmtK(s.moBase80)} <span>/mo</span></td>
                  <td className={styles.muted}>—</td>
                </tr>
                <tr className={styles.rowCon}>
                  <td>
                    <span className={styles.dot} style={{background: 'var(--orange)'}} />
                    Conservative — Biz + PRU overage
                    <span className={styles.assumption}>{Math.round(PRU_OVERAGE_BIZ_PCT * 100)}% users avg {PRU_OVERAGE_BIZ_EXTRA} extra PRUs</span>
                  </td>
                  <td>{fmtK(s.moConservativeCur)} <span>/mo</span></td>
                  <td>{fmtK(s.moConservative)} <span>/mo</span></td>
                  <td className={styles.up}>+{fmtK(s.deltaConMo)}/mo · <strong>+{fmtM(s.deltaConYr)}/yr</strong></td>
                </tr>
                <tr className={styles.rowBest}>
                  <td>
                    <span className={styles.dot} style={{background: 'var(--green)'}} />
                    Best case — all Enterprise
                  </td>
                  <td>{fmtK(s.moBestCaseCur)} <span>/mo</span></td>
                  <td>{fmtK(s.moBestCase)} <span>/mo</span></td>
                  <td className={styles.up}>+{fmtK(s.deltaBestMo)}/mo · <strong>+{fmtM(s.deltaBestYr)}/yr</strong></td>
                </tr>
                <tr className={styles.rowStretch}>
                  <td>
                    <span className={styles.dot} style={{background: 'var(--purple)'}} />
                    Stretch — Enterprise + PRU overage
                    <span className={styles.assumption}>{Math.round(PRU_OVERAGE_ENT_PCT * 100)}% users avg {PRU_OVERAGE_ENT_EXTRA} extra PRUs</span>
                  </td>
                  <td>{fmtK(s.moStretchCur)} <span>/mo</span></td>
                  <td>{fmtK(s.moStretch)} <span>/mo</span></td>
                  <td className={styles.up}>+{fmtK(s.deltaStrMo)}/mo · <strong>+{fmtM(s.deltaStrYr)}/yr</strong></td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ── Visual bar ── */}
          <div className={styles.barSection}>
            <div className={styles.barRow}>
              <span className={styles.barLabel}>Baseline</span>
              <div className={styles.barTrack}>
                <div className={styles.barFill} style={{width: barPct(s.yrBase80, s.yrStretch), background: 'var(--accent)'}} />
              </div>
              <span className={styles.barVal}>{fmtM(s.yrBase80)}/yr</span>
            </div>
            <div className={styles.barRow}>
              <span className={styles.barLabel}>Conservative</span>
              <div className={styles.barTrack}>
                <div className={styles.barFill} style={{width: barPct(s.yrConservative, s.yrStretch), background: 'var(--orange)'}} />
              </div>
              <span className={styles.barVal}>{fmtM(s.yrConservative)}/yr</span>
            </div>
            <div className={styles.barRow}>
              <span className={styles.barLabel}>Best case</span>
              <div className={styles.barTrack}>
                <div className={styles.barFill} style={{width: barPct(s.yrBestCase, s.yrStretch), background: 'var(--green)'}} />
              </div>
              <span className={styles.barVal}>{fmtM(s.yrBestCase)}/yr</span>
            </div>
            <div className={styles.barRow}>
              <span className={styles.barLabel}>Stretch</span>
              <div className={styles.barTrack}>
                <div className={styles.barFill} style={{width: '100%', background: 'linear-gradient(90deg, var(--purple), var(--pink))'}} />
              </div>
              <span className={styles.barVal}>{fmtM(s.yrStretch)}/yr</span>
            </div>
          </div>
        </div>
      )}

      {active === 'total' && (
        <div className={`${styles.vertical} content-frame content-gutter`}>
          <p className={styles.vertDesc}>
            Combined view — <strong>horizontal</strong> seat adoption to {tgtPctLabel}
            + <strong>vertical</strong> ARPU expansion across {customers.length} strategic accounts.{discountLabel}
          </p>

          {/* ── Summary KPIs ── */}
          <div className={styles.totalKpis}>
            <div className={styles.totalKpi}>
              <div className={styles.totalKpiLabel}>Current State</div>
              <div className={styles.totalKpiVal}>{fmtM(s.yrBase)}<span>/yr</span></div>
              <div className={styles.totalKpiSub}>{seatsK(totalGHCP)} seats × ${PRICE_BUSINESS} (Business)</div>
            </div>
            <div className={`${styles.totalKpi} ${styles.totalKpiWarn}`}>
              <div className={styles.totalKpiLabel}>Conservative</div>
              <div className={styles.totalKpiVal}>{fmtM(s.yrConservative)}<span>/yr</span></div>
              <div className={styles.totalKpiSub}>{seatsK(targetSeats)} seats × ${PRICE_BUSINESS} + PRU overage</div>
            </div>
            <div className={`${styles.totalKpi} ${styles.totalKpiBest}`}>
              <div className={styles.totalKpiLabel}>Best Case</div>
              <div className={styles.totalKpiVal}>{fmtM(s.yrBestCase)}<span>/yr</span></div>
              <div className={styles.totalKpiSub}>{seatsK(targetSeats)} seats × ${PRICE_ENTERPRISE} (Enterprise)</div>
            </div>
            <div className={`${styles.totalKpi} ${styles.totalKpiStretch}`}>
              <div className={styles.totalKpiLabel}>Stretch</div>
              <div className={styles.totalKpiVal}>{fmtM(s.yrStretch)}<span>/yr</span></div>
              <div className={styles.totalKpiSub}>{seatsK(targetSeats)} seats × ${PRICE_ENTERPRISE} + PRU overage</div>
            </div>
          </div>

          {/* ── Waterfall breakdown ── */}
          <div className={styles.impactSection}>
            <h4 className={styles.impactTitle}>Opportunity Breakdown</h4>
            <p className={styles.impactDesc}>How each lever contributes to total annualized revenue</p>
            <table className={styles.impactTable}>
              <thead>
                <tr>
                  <th>Lever</th>
                  <th>Current</th>
                  <th>Conservative</th>
                  <th>Best Case</th>
                  <th>Stretch</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <span className={styles.dot} style={{background: 'var(--accent)'}} />
                    ↔ Horizontal — Seat Adoption
                    <span className={styles.assumption}>{seatsK(totalGHCP)} → {seatsK(targetSeats)} seats ({fmtPct(avgPen)} → {tgtPctLabel})</span>
                  </td>
                  <td>{fmtM(s.yrBase)}</td>
                  <td>{fmtM(s.yrBase80)}</td>
                  <td>{fmtM(s.yrBase80)}</td>
                  <td>{fmtM(s.yrBase80)}</td>
                </tr>
                <tr>
                  <td>
                    <span className={styles.dot} style={{background: 'var(--green)'}} />
                    ↕ Vertical — Plan Upgrade
                    <span className={styles.assumption}>${PRICE_BUSINESS} → ${PRICE_ENTERPRISE} per seat</span>
                  </td>
                  <td className={styles.muted}>—</td>
                  <td className={styles.muted}>—</td>
                  <td className={styles.up}>+{fmtM(s.entUpgradeYr80)}</td>
                  <td className={styles.up}>+{fmtM(s.entUpgradeYr80)}</td>
                </tr>
                <tr>
                  <td>
                    <span className={styles.dot} style={{background: 'var(--orange)'}} />
                    ↕ Vertical — PRU Overage
                    <span className={styles.assumption}>${PRU_OVERAGE_RATE}/PRU beyond allowance</span>
                  </td>
                  <td className={styles.muted}>—</td>
                  <td className={styles.up}>+{fmtM(s.pruOverageYr80)}</td>
                  <td className={styles.muted}>—</td>
                  <td className={styles.up}>+{fmtM(s.pruOverageYr80)}</td>
                </tr>
                <tr className={styles.rowStretch} style={{fontWeight: 700}}>
                  <td><strong>Total Annualized Revenue</strong></td>
                  <td>{fmtM(s.yrBase)}</td>
                  <td style={{color: 'var(--orange)'}}>{fmtM(s.yrConservative)}</td>
                  <td style={{color: 'var(--green)'}}>{fmtM(s.yrBestCase)}</td>
                  <td style={{color: 'var(--purple)'}}>{fmtM(s.yrStretch)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* ── Visual stacked bars ── */}
          <div className={styles.totalBars}>
            <div className={styles.totalBarRow}>
              <span className={styles.barLabel}>Current</span>
              <div className={styles.barTrack}>
                <div className={styles.barSegment} style={{width: barPct(s.yrBase, s.yrStretch), background: 'var(--accent)'}} title={`Horizontal: ${fmtM(s.yrBase)}`} />
              </div>
              <span className={styles.barVal}>{fmtM(s.yrBase)}</span>
            </div>
            <div className={styles.totalBarRow}>
              <span className={styles.barLabel}>Conservative</span>
              <div className={styles.barTrack}>
                <div className={styles.barSegment} style={{width: barPct(s.yrBase80, s.yrStretch), background: 'var(--accent)'}} title={`Horizontal: ${fmtM(s.yrBase80)}`} />
                <div className={styles.barSegment} style={{width: barPct(s.pruOverageYr80, s.yrStretch), background: 'var(--orange)'}} title={`PRU overage: ${fmtM(s.pruOverageYr80)}`} />
              </div>
              <span className={styles.barVal}>{fmtM(s.yrConservative)}</span>
            </div>
            <div className={styles.totalBarRow}>
              <span className={styles.barLabel}>Best Case</span>
              <div className={styles.barTrack}>
                <div className={styles.barSegment} style={{width: barPct(s.yrBase80, s.yrStretch), background: 'var(--accent)'}} title={`Horizontal: ${fmtM(s.yrBase80)}`} />
                <div className={styles.barSegment} style={{width: barPct(s.entUpgradeYr80, s.yrStretch), background: 'var(--green)'}} title={`Enterprise upgrade: ${fmtM(s.entUpgradeYr80)}`} />
              </div>
              <span className={styles.barVal}>{fmtM(s.yrBestCase)}</span>
            </div>
            <div className={styles.totalBarRow}>
              <span className={styles.barLabel}>Stretch</span>
              <div className={styles.barTrack}>
                <div className={styles.barSegment} style={{width: barPct(s.yrBase80, s.yrStretch), background: 'var(--accent)'}} title={`Horizontal: ${fmtM(s.yrBase80)}`} />
                <div className={styles.barSegment} style={{width: barPct(s.entUpgradeYr80, s.yrStretch), background: 'var(--green)'}} title={`Enterprise upgrade: ${fmtM(s.entUpgradeYr80)}`} />
                <div className={styles.barSegment} style={{width: barPct(s.pruOverageYr80, s.yrStretch), background: 'linear-gradient(90deg, var(--orange), var(--pink))'}} title={`PRU overage: ${fmtM(s.pruOverageYr80)}`} />
              </div>
              <span className={styles.barVal}>{fmtM(s.yrStretch)}</span>
            </div>
            <div className={styles.totalLegend}>
              <span><span className={styles.legendDot} style={{background: 'var(--accent)'}} /> Seat Adoption</span>
              <span><span className={styles.legendDot} style={{background: 'var(--green)'}} /> Enterprise Upgrade</span>
              <span><span className={styles.legendDot} style={{background: 'var(--orange)'}} /> PRU Overage</span>
            </div>
          </div>

          <p className={styles.totalFootnote}>
            From <strong>{fmtM(s.yrBase)}</strong> today to up to <strong>{fmtM(s.yrStretch)}</strong> — a <strong>{s.revenueMultiplier.toFixed(1)}×</strong> revenue multiplier across {customers.length} accounts.
          </p>
        </div>
      )}

      <BottomBar />
    </Slide>
  )
}
