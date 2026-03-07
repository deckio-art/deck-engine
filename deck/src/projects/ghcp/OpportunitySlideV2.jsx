import { useState, useRef, useCallback } from 'react'
import { BottomBar, Slide } from '@lopezleandro03/canvas-engine'
import styles from './OpportunitySlideV2.module.css'
import {
  customers, DISCOUNT, ACD_RATE,
  PRICE_BUSINESS, PRICE_ENTERPRISE,
  PRU_OVERAGE_RATE, PRU_BIZ, PRU_ENT,
  fmtM, fmtK, fmtPct,
} from '../../data/opportunity'

// Local logos for reliability
import logoING from '../../data/logos/ing.png'
import logoASML from '../../data/logos/asml.png'
import logoPhilips from '../../data/logos/philips.png'
import logoShell from '../../data/logos/shell.png'
import logoAhold from '../../data/logos/ahold.png'
import logoABNAmro from '../../data/logos/abnamro.png'
import logoRabobank from '../../data/logos/rabobank.svg'

const localLogos = { ING: logoING, ASML: logoASML, Philips: logoPhilips, Shell: logoShell, Ahold: logoAhold, 'ABN Amro': logoABNAmro, Rabobank: logoRabobank }

// Smart format: use K for <1M, M for >=1M
const fmtSmart = v => Math.abs(v) >= 1e6 ? fmtM(v) : fmtK(v)

/* ──────────────────────────────────────────────────
 *  Interactive Quadrant Landscape
 *  X = Copilot penetration  (ghcp / ghe)  → seats → revenue
 *  Y = PRU usage per user/month           → overage → revenue
 *  Drag customers to explore $$$ impact.
 * ────────────────────────────────────────────────── */

// Discount helper: takes total discount rate
const applyDiscount = (v, disc) => v * (1 - disc)

// Axis bounds
const PEN_MIN = 0.20, PEN_MAX = 0.95
const PRU_MIN = 0, PRU_MAX = 1600
const PEN_MID = 0.50, PRU_MID = PRU_ENT

// Enterprise breakeven: where Business + overage = Enterprise flat price
// $19 + (PRU-300)×$0.04 = $39  →  PRU = 300 + ($39-$19)/$0.04 = 800
function calcBreakeven(disc) {
  const discountedRate = PRU_OVERAGE_RATE * (1 - disc)
  return PRU_BIZ + (applyDiscount(PRICE_ENTERPRISE, disc) - applyDiscount(PRICE_BUSINESS, disc)) / discountedRate
}

// Map value → chart %
function valToX(pen) { return Math.max(1, Math.min(99, ((pen - PEN_MIN) / (PEN_MAX - PEN_MIN)) * 100)) }
function valToY(pru) { return Math.max(1, Math.min(99, 100 - ((pru - PRU_MIN) / (PRU_MAX - PRU_MIN)) * 100)) }
// Map chart % → value
function xToVal(pct) { return PEN_MIN + (pct / 100) * (PEN_MAX - PEN_MIN) }
function yToVal(pct) { return PRU_MIN + ((100 - pct) / 100) * (PRU_MAX - PRU_MIN) }

// Revenue calculator for a single customer given pen & pru
function calcRevenue(c, pen, pru, disc) {
  const seats = Math.round(c.ghe * pen)
  const isEnt = pru >= PRU_ENT
  const planPrice = isEnt ? applyDiscount(PRICE_ENTERPRISE, disc) : applyDiscount(PRICE_BUSINESS, disc)
  const overageRate = PRU_OVERAGE_RATE * (1 - disc)
  const allowance = isEnt ? PRU_ENT : PRU_BIZ
  const overagePru = Math.max(0, pru - allowance)
  const overagePerSeat = overagePru * overageRate
  return {
    seats,
    plan: isEnt ? 'Enterprise' : 'Business',
    planPrice,
    overageRate,
    allowance,
    overagePru,
    overagePerSeat,
    monthly: seats * (planPrice + overagePerSeat),
    annual: seats * (planPrice + overagePerSeat) * 12,
  }
}

// initial current PRU usage per user/month (near zero — basic completions)
const initPru = { ING: 80, ASML: 50, Philips: 60, Shell: 35, Ahold: 25, 'ABN Amro': 40, Rabobank: 45 }

// ── Scenario presets ──
const SCENARIOS = [
  {
    id: 'base',
    name: 'Baseline',
    tag: 'Current',
    desc: 'Current adoption',
    positions: () => customers.map(c => ({
      pen: c.ghcp / c.ghe,
      pru: initPru[c.name] || 50,
    })),
  },
  {
    id: 'seats',
    name: '80% Seats',
    tag: 'Likely',
    desc: 'Adoption, no PRU',
    positions: () => customers.map(c => ({
      pen: 0.80,
      pru: initPru[c.name] || 50,
    })),
  },
  {
    id: 'seats-pru',
    name: '80% + PRU',
    tag: 'Best case',
    desc: 'Adoption + PRU overage',
    positions: () => customers.map(() => ({
      pen: 0.80,
      pru: 500,
    })),
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    tag: 'Ambitious',
    desc: '85% seats + Enterprise PRU',
    positions: () => customers.map(() => ({
      pen: 0.85,
      pru: 1100,
    })),
  },
  {
    id: 'max',
    name: 'Full Potential',
    tag: 'Stretch',
    desc: '90% seats + heavy PRU',
    positions: () => customers.map(() => ({
      pen: 0.90,
      pru: 1400,
    })),
  },
]

function buildFromScenario(scenario) {
  const presets = scenario.positions()
  return customers.map((c, i) => ({
    ...c,
    pen: presets[i].pen,
    pru: presets[i].pru,
    localLogo: localLogos[c.name] || c.logo,
  }))
}

function buildInitial() {
  return buildFromScenario(SCENARIOS[0])
}

export default function OpportunitySlideV2({ index = 4 }) {
  const [positions, setPositions] = useState(buildInitial)
  const [activeScenario, setActiveScenario] = useState('base')
  const [yearly, setYearly] = useState(false)
  const [acdEnabled, setAcdEnabled] = useState(false)
  const [dragging, setDragging] = useState(null)
  const chartRef = useRef(null)
  const dragIdx = useRef(null)

  const totalDiscount = DISCOUNT + (acdEnabled ? ACD_RATE : 0)
  const PRU_BREAKEVEN = calcBreakeven(totalDiscount)

  const applyScenario = useCallback((s) => {
    setActiveScenario(s.id)
    setPositions(buildFromScenario(s))
  }, [])

  // ── Pointer handlers ──
  const onPointerDown = useCallback((e, idx) => {
    e.preventDefault()
    e.stopPropagation()
    dragIdx.current = idx
    setDragging(idx)
    // Capture on the chart so onPointerMove keeps firing even outside bounds
    chartRef.current?.setPointerCapture?.(e.pointerId)
  }, [])

  const onPointerMove = useCallback((e) => {
    if (dragIdx.current === null) return
    const chart = chartRef.current
    if (!chart) return
    const rect = chart.getBoundingClientRect()
    const xPct = Math.max(1, Math.min(99, ((e.clientX - rect.left) / rect.width) * 100))
    const yPct = Math.max(1, Math.min(99, ((e.clientY - rect.top) / rect.height) * 100))
    const pen = xToVal(xPct)
    const pru = yToVal(yPct)
    setActiveScenario(null) // user is now in custom drag mode
    setPositions(prev => prev.map((p, i) => i === dragIdx.current ? { ...p, pen, pru } : p))
  }, [])

  const onPointerUp = useCallback((e) => {
    if (dragIdx.current !== null) {
      chartRef.current?.releasePointerCapture?.(e?.pointerId)
    }
    dragIdx.current = null
    setDragging(null)
  }, [])

  // ── Compute revenues ──
  const period = yearly ? 'annual' : 'monthly'
  const periodLabel = yearly ? '/yr' : '/mo'
  const computed = positions.map(c => {
    const base = calcRevenue(c, c.ghcp / c.ghe, initPru[c.name] || 50, totalDiscount)
    const current = calcRevenue(c, c.pen, c.pru, totalDiscount)
    const delta = current[period] - base[period]
    return { ...c, base, current, delta }
  })

  const totalBase = computed.reduce((s, c) => s + c.base[period], 0)
  const totalCurrent = computed.reduce((s, c) => s + c.current[period], 0)
  const totalDelta = totalCurrent - totalBase
  const totalSeats = computed.reduce((s, c) => s + c.current.seats, 0)
  const totalBaseSeats = computed.reduce((s, c) => s + c.base.seats, 0)
  const seatsDelta = totalSeats - totalBaseSeats

  return (
    <Slide index={index} className={styles.slide}>
      <div className="accent-bar" />

      <div className={`${styles.wrapper} content-frame content-gutter`}>
        {/* ── Header ── */}
        <div className={styles.headerRow}>
          <div className={styles.headerText}>
            <h2>Expansion Simulator</h2>
            <p className={styles.subtitle}>
              Drag customers to model seat &amp; PRU expansion revenue
            </p>
          </div>
          <div className={styles.scenarioBox}>
            <div className={styles.scenarioBoxHeader}>Scenarios</div>
            <div className={styles.scenarioBar}>
              {SCENARIOS.map(s => (
                <button
                  key={s.id}
                  className={`${styles.scenarioBtn} ${activeScenario === s.id ? styles.scenarioActive : ''}`}
                  onClick={(e) => { e.stopPropagation(); applyScenario(s) }}
                  title={s.desc}
                >
                  <span className={styles.scenarioBtnName}>{s.name}</span>
                  <span className={styles.scenarioBtnTag}>{s.tag}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Body ── */}
        <div className={styles.body}>

          {/* ── Chart ── */}
          <div className={styles.chartArea}>
            <div className={styles.yAxis}><span>PRUs / developer / month</span></div>
            <div className={styles.xAxis}><span>Copilot Penetration (%)</span></div>

            <div
              className={styles.chart}
              ref={chartRef}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerLeave={onPointerUp}
            >
              {/* Quadrant fills */}
              <div className={`${styles.q} ${styles.qTL}`}><span>⚡ Power Users</span></div>
              <div className={`${styles.q} ${styles.qTR}`}><span>🚀 Frontier</span></div>
              <div className={`${styles.q} ${styles.qBL}`}><span>🐢 Laggards</span></div>
              <div className={`${styles.q} ${styles.qBR}`}><span>📊 Seat Leaders</span></div>

              {/* Crosshairs */}
              <div className={styles.crossH} style={{ top: `${valToY(PRU_MID)}%` }} />
              <div className={styles.crossV} style={{ left: `${valToX(PEN_MID)}%` }} />

              {/* Overage zone */}
              <div className={styles.overageZone} style={{ height: `${valToY(PRU_ENT)}%` }} />
              <div className={styles.overageLabel} style={{ top: `${valToY(PRU_MAX - 80)}%` }}>
                Overage zone · ${(PRU_OVERAGE_RATE * (1 - totalDiscount)).toFixed(2)}/PRU
              </div>

              {/* Allowance lines */}
              <div className={styles.allowanceLine} style={{ top: `${valToY(PRU_BIZ)}%` }}>
                <span className={styles.allowanceTag}>GHCP for Business ({PRU_BIZ} PRU)</span>
              </div>
              <div className={styles.allowanceLine} style={{ top: `${valToY(PRU_ENT)}%` }}>
                <span className={styles.allowanceTag}>GitHub Copilot for Enterprise ({PRU_ENT.toLocaleString()} PRU)</span>
              </div>

              {/* Enterprise breakeven line */}
              <div className={styles.breakevenLine} style={{ top: `${valToY(PRU_BREAKEVEN)}%` }}>
                <span className={styles.breakevenTag}>Enterprise breakeven ({PRU_BREAKEVEN} PRU)</span>
              </div>

              {/* Upgrade zone: between breakeven and Enterprise — shaded */}
              <div
                className={styles.upgradeZone}
                style={{
                  top: `${valToY(PRU_ENT)}%`,
                  height: `${valToY(PRU_BREAKEVEN) - valToY(PRU_ENT)}%`,
                }}
              />
              <div className={styles.upgradeZoneLabel} style={{ top: `${(valToY(PRU_ENT) + valToY(PRU_BREAKEVEN)) / 2}%` }}>
                Upgrade saves $$$
              </div>

              {/* X ticks */}
              {[0.30, 0.40, 0.50, 0.60, 0.70, 0.80, 0.90].map(v => (
                <span key={v} className={styles.xTick} style={{ left: `${valToX(v)}%` }}>{Math.round(v * 100)}%</span>
              ))}
              {/* Y ticks */}
              {[0, 400, 800, 1200].map(v => (
                <span key={v} className={styles.yTick} style={{ top: `${valToY(v)}%` }}>{v.toLocaleString()}</span>
              ))}

              {/* Origin anchors (ghost) */}
              {computed.map(c => {
                const origPen = c.ghcp / c.ghe
                const origPru = initPru[c.name] || 50
                const moved = Math.abs(c.pen - origPen) > 0.01 || Math.abs(c.pru - origPru) > 5
                if (!moved) return null
                return (
                  <div
                    key={`o-${c.name}`}
                    className={styles.origin}
                    style={{ left: `${valToX(origPen)}%`, top: `${valToY(origPru)}%` }}
                  >
                    <img src={c.localLogo} alt="" className={styles.originLogo} onError={e => { e.target.style.display = 'none' }} />
                  </div>
                )
              })}

              {/* SVG connecting lines from origin to current */}
              <svg className={styles.arrowSvg} viewBox="0 0 100 100" preserveAspectRatio="none">
                <defs>
                  <marker id="ah" markerWidth="6" markerHeight="5" refX="5" refY="2.5" orient="auto">
                    <polygon points="0 0, 6 2.5, 0 5" fill="rgba(255,255,255,0.4)" />
                  </marker>
                </defs>
                {computed.map(c => {
                  const origPen = c.ghcp / c.ghe
                  const origPru = initPru[c.name] || 50
                  const moved = Math.abs(c.pen - origPen) > 0.01 || Math.abs(c.pru - origPru) > 5
                  if (!moved) return null
                  const x1 = valToX(origPen), y1 = valToY(origPru)
                  const x2 = valToX(c.pen), y2 = valToY(c.pru)
                  return (
                    <line key={c.name} x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke="rgba(255,255,255,0.15)" strokeWidth="0.3"
                      strokeDasharray="1.5 1" markerEnd="url(#ah)"
                      vectorEffect="non-scaling-stroke" />
                  )
                })}
              </svg>

              {/* Delta badges on lines */}
              {computed.map(c => {
                const origPen = c.ghcp / c.ghe
                const origPru = initPru[c.name] || 50
                const moved = Math.abs(c.pen - origPen) > 0.01 || Math.abs(c.pru - origPru) > 5
                if (!moved || Math.abs(c.delta) < (yearly ? 1000 : 100)) return null
                const mx = (valToX(origPen) + valToX(c.pen)) / 2
                const my = (valToY(origPru) + valToY(c.pru)) / 2
                return (
                  <div key={`d-${c.name}`} className={styles.deltaBadge}
                    style={{ left: `${mx}%`, top: `${my}%` }}>
                    {c.delta >= 0 ? '+' : ''}{fmtSmart(c.delta)}
                  </div>
                )
              })}

              {/* Draggable bubbles (logo only) */}
              {computed.map((c, i) => (
                <div
                  key={c.name}
                  className={`${styles.bubble} ${dragging === i ? styles.bubbleDrag : ''}`}
                  style={{
                    left: `${valToX(c.pen)}%`,
                    top: `${valToY(c.pru)}%`,
                    '--c': c.color,
                  }}
                  onPointerDown={(e) => onPointerDown(e, i)}
                  title={`${c.name}\n${fmtPct(c.pen)} pen · ${Math.round(c.pru)} PRU/mo\n${c.current.seats.toLocaleString()} seats · ${c.current.plan}\n${fmtSmart(c.current[period])}${periodLabel}`}
                >
                  <img
                    src={c.localLogo}
                    alt={c.name}
                    className={styles.bubbleLogo}
                    draggable={false}
                    onError={e => { e.target.style.display = 'none' }}
                  />
                  <span className={styles.bubbleVal}>{c.name} · {fmtPct(c.pen)}</span>
                </div>
              ))}
            </div>
          </div>

          {/* ── Revenue Panel ── */}
          <div className={styles.revPanel}>
            <div className={styles.revHeader}>
              <div className={styles.revHeaderTop}>
                <h3>Live Revenue</h3>
                <div className={styles.revToggles}>
                  <button
                    className={`${styles.acdToggle} ${acdEnabled ? styles.acdActive : ''}`}
                    onClick={(e) => { e.stopPropagation(); setAcdEnabled(v => !v) }}
                    title={acdEnabled ? 'Disable ACD (25% discount)' : 'Enable ACD (25% discount)'}
                  >
                    ACD {acdEnabled ? 'ON' : 'OFF'}
                  </button>
                  <button
                    className={styles.periodToggle}
                    onClick={(e) => { e.stopPropagation(); setYearly(v => !v) }}
                    title={yearly ? 'Switch to monthly' : 'Switch to yearly'}
                  >
                    <span className={!yearly ? styles.periodActive : ''}>Mo</span>
                    <span className={yearly ? styles.periodActive : ''}>Yr</span>
                  </button>
                </div>
              </div>
              <p className={styles.revSubtitle}>
                {activeScenario
                  ? SCENARIOS.find(s => s.id === activeScenario)?.desc || 'Custom'
                  : 'Custom (dragged)'}
              </p>
              {totalDiscount > 0 && (
                <div className={styles.discountBadge}>
                  {Math.round(totalDiscount * 100)}% discount applied{acdEnabled ? ' (incl. ACD)' : ''}
                </div>
              )}
            </div>

            <div className={styles.revList}>
              {computed.map(c => {
                const isUp = c.delta > 0
                const isDown = c.delta < 0
                return (
                  <div key={c.name} className={styles.revRow}>
                    <div className={styles.revTop}>
                      <img src={c.localLogo} alt={c.name} className={styles.revLogo}
                        onError={e => { e.target.style.display = 'none' }} />
                      <div className={styles.revInfo}>
                        <div className={styles.revName}>{c.name}</div>
                        <div className={styles.revMeta}>
                          {fmtPct(c.pen)} pen · {Math.round(c.pru)} PRU · {c.current.seats.toLocaleString()} seats
                        </div>
                      </div>
                    </div>
                    <div className={styles.revBottom}>
                      <div className={styles.revBreakdown}>
                        <span className={styles.revPlan}>{c.current.plan} ${c.current.planPrice}/mo</span>
                        {c.current.overagePru > 0 && (
                          <span className={styles.revOverage}>
                            +{Math.round(c.current.overagePru)} PRU × ${c.current.overageRate.toFixed(2)}
                          </span>
                        )}
                        {c.current.plan === 'Business' && c.pru >= PRU_BREAKEVEN && (
                          <span className={styles.revUpgradeHint}>↑ Enterprise saves ${((c.pru - PRU_BIZ) * PRU_OVERAGE_RATE * (1 - totalDiscount) - (applyDiscount(PRICE_ENTERPRISE, totalDiscount) - applyDiscount(PRICE_BUSINESS, totalDiscount))).toFixed(0)}/seat/mo</span>
                        )}
                      </div>
                      <div className={styles.revAmounts}>
                        <span className={styles.revAnnual}>{fmtSmart(c.current[period])}<small>{periodLabel}</small></span>
                        {Math.abs(c.delta) > (yearly ? 1000 : 100) && (
                          <span className={`${styles.revDelta} ${isUp ? styles.revUp : ''} ${isDown ? styles.revDown : ''}`}>
                            {isUp ? '+' : ''}{fmtSmart(c.delta)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className={styles.revTotal}>
              <div className={styles.revTotalSeats}>
                {totalSeats.toLocaleString()} seats
                {seatsDelta !== 0 && (
                  <span className={seatsDelta > 0 ? styles.revUp : styles.revDown}>
                    {' '}{seatsDelta > 0 ? '+' : ''}{seatsDelta.toLocaleString()}
                  </span>
                )}
              </div>
              <div className={styles.revTotalLabel}>Total {yearly ? 'Annual' : 'Monthly'} Revenue</div>
              <div className={styles.revTotalVal}>{fmtSmart(totalCurrent)}<small>{periodLabel}</small></div>
              {Math.abs(totalDelta) > (yearly ? 1000 : 100) && (
                <div className={`${styles.revTotalDelta} ${totalDelta >= 0 ? styles.revUp : styles.revDown}`}>
                  {totalDelta >= 0 ? '+' : ''}{fmtSmart(totalDelta)} vs baseline
                </div>
              )}
              <div className={styles.revBaseline}>Baseline: {fmtSmart(totalBase)}{periodLabel}</div>
              {totalCurrent > totalBase && (
                <div className={styles.revMultiplier}>{(totalCurrent / totalBase).toFixed(1)}× multiplier</div>
              )}
            </div>
          </div>
        </div>
      </div>

      <BottomBar />
    </Slide>
  )
}
