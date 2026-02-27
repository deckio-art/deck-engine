/*  ─────────────────────────────────────────────────
 *  SINGLE SOURCE OF TRUTH
 *  All customer data, pricing and assumptions live here.
 *  Every slide & dashboard reads from this module.
 *  ───────────────────────────────────────────────── */

// ── Global discount (0 = no discount, 0.1 = 10% off, etc.) ──
export const DISCOUNT = 0.00

// ── ACD (Annual Commitment Discount) ──
export const ACD_RATE = 0.25  // 25% discount when ACD is enabled

// ── Pricing ──
export const PRICE_BUSINESS   = 19   // $/dev/mo  — Copilot for Business
export const PRICE_ENTERPRISE = 39   // $/dev/mo  — Copilot Enterprise
export const PRU_OVERAGE_RATE = 0.04 // $/PRU beyond allowance
export const PRU_BIZ          = 300  // PRUs/mo included in Business
export const PRU_ENT          = 1000 // PRUs/mo included in Enterprise

// ── PRU overage assumptions ──
export const PRU_OVERAGE_BIZ_PCT   = 0.40 // % of users who exceed allowance (conservative)
export const PRU_OVERAGE_BIZ_EXTRA = 150  // avg extra PRUs per power user
export const PRU_OVERAGE_ENT_PCT   = 0.30 // % of users (stretch)
export const PRU_OVERAGE_ENT_EXTRA = 200  // avg extra PRUs per power user

// ── Penetration targets ──
export const TARGET_PENETRATION = 0.80 // 80%

// ── Customer data ──
export const customers = [
  { name: 'ING',      ghe: 15000, ghcp: 6000,  color: '#58a6ff', logo: 'https://logo.clearbit.com/ing.com' },
  { name: 'ASML',     ghe: 8201,  ghcp: 4532,  color: '#3fb950', logo: 'https://logo.clearbit.com/asml.com' },
  { name: 'Philips',  ghe: 8056,  ghcp: 4350,  color: '#d29922', logo: 'https://logo.clearbit.com/philips.com' },
  { name: 'Shell',    ghe: 4500,  ghcp: 2952,  color: '#bc8cff', logo: 'https://logo.clearbit.com/shell.com' },
  { name: 'Ahold',    ghe: 4122,  ghcp: 1750,  color: '#f778ba', logo: 'https://logo.clearbit.com/aholddelhaize.com' },
  { name: 'ABN Amro', ghe: 5148,  ghcp: 2905,  color: '#00a651', logo: 'https://logo.clearbit.com/abnamro.nl' },
  { name: 'Rabobank', ghe: 7469,  ghcp: 2799,  color: '#f97316', logo: 'https://logo.clearbit.com/rabobank.com' },
]

// ── Helper: apply discount ──
const d = (v) => v * (1 - DISCOUNT)

// ── Derived per-customer values ──
export const enrichedCustomers = customers.map(c => {
  const pen = c.ghcp / c.ghe
  const acr = c.ghcp * d(PRICE_BUSINESS)
  const at75 = Math.round(c.ghe * 0.75) * d(PRICE_BUSINESS)
  const at90 = Math.round(c.ghe * 0.90) * d(PRICE_BUSINESS)
  return { ...c, pen, acr, at75, at90 }
})

// ── Aggregates ──
export const totalGHE   = customers.reduce((s, c) => s + c.ghe, 0)
export const totalGHCP  = customers.reduce((s, c) => s + c.ghcp, 0)
export const avgPen     = totalGHCP / totalGHE
export const targetSeats = Math.round(totalGHE * TARGET_PENETRATION)

// ── Revenue scenarios (monthly, then annualized) ──
const bizPrice = d(PRICE_BUSINESS)
const entPrice = d(PRICE_ENTERPRISE)

// Monthly
export const moBase          = totalGHCP * bizPrice
export const moBase80        = targetSeats * bizPrice
export const moConservative  = moBase80 + targetSeats * PRU_OVERAGE_BIZ_PCT * PRU_OVERAGE_BIZ_EXTRA * PRU_OVERAGE_RATE
export const moBestCase      = targetSeats * entPrice
export const moStretch       = moBestCase + targetSeats * PRU_OVERAGE_ENT_PCT * PRU_OVERAGE_ENT_EXTRA * PRU_OVERAGE_RATE

// Current-base monthly (for vertical tab)
export const moBaseCurrent       = totalGHCP * bizPrice
export const moConservativeCur   = totalGHCP * bizPrice + totalGHCP * PRU_OVERAGE_BIZ_PCT * PRU_OVERAGE_BIZ_EXTRA * PRU_OVERAGE_RATE
export const moBestCaseCur       = totalGHCP * entPrice
export const moStretchCur        = moBestCaseCur + totalGHCP * PRU_OVERAGE_ENT_PCT * PRU_OVERAGE_ENT_EXTRA * PRU_OVERAGE_RATE

// Annualized
export const yrBase         = moBase * 12
export const yrBase80       = moBase80 * 12
export const yrConservative = moConservative * 12
export const yrBestCase     = moBestCase * 12
export const yrStretch      = moStretch * 12

// Deltas
export const deltaConMo   = moConservative - moBase80
export const deltaBestMo  = moBestCase - moBase80
export const deltaStrMo   = moStretch - moBase80
export const deltaConYr   = yrConservative - yrBase80
export const deltaBestYr  = yrBestCase - yrBase80
export const deltaStrYr   = yrStretch - yrBase80

// PRU overage deltas (vertical only)
export const pruOverageMoCur  = totalGHCP * PRU_OVERAGE_BIZ_PCT * PRU_OVERAGE_BIZ_EXTRA * PRU_OVERAGE_RATE
export const pruOverageMo80   = targetSeats * PRU_OVERAGE_BIZ_PCT * PRU_OVERAGE_BIZ_EXTRA * PRU_OVERAGE_RATE
export const pruOverageYr80   = pruOverageMo80 * 12

// Enterprise upgrade delta
export const entUpgradeYr80  = (targetSeats * entPrice - targetSeats * bizPrice) * 12

// Revenue multiplier
export const revenueMultiplier = yrStretch / yrBase

// ── Recompute all scenarios for a given total discount ──
export function computeScenarios(disc) {
  const bp = PRICE_BUSINESS * (1 - disc)
  const ep = PRICE_ENTERPRISE * (1 - disc)
  const ts = targetSeats
  const tc = totalGHCP

  const _moBase         = tc * bp
  const _moBase80       = ts * bp
  const _moConservative = _moBase80 + ts * PRU_OVERAGE_BIZ_PCT * PRU_OVERAGE_BIZ_EXTRA * PRU_OVERAGE_RATE
  const _moBestCase     = ts * ep
  const _moStretch      = _moBestCase + ts * PRU_OVERAGE_ENT_PCT * PRU_OVERAGE_ENT_EXTRA * PRU_OVERAGE_RATE

  const _moBaseCurrent     = tc * bp
  const _moConservativeCur = tc * bp + tc * PRU_OVERAGE_BIZ_PCT * PRU_OVERAGE_BIZ_EXTRA * PRU_OVERAGE_RATE
  const _moBestCaseCur     = tc * ep
  const _moStretchCur      = _moBestCaseCur + tc * PRU_OVERAGE_ENT_PCT * PRU_OVERAGE_ENT_EXTRA * PRU_OVERAGE_RATE

  const _yrBase         = _moBase * 12
  const _yrBase80       = _moBase80 * 12
  const _yrConservative = _moConservative * 12
  const _yrBestCase     = _moBestCase * 12
  const _yrStretch      = _moStretch * 12

  const _pruOverageYr80  = ts * PRU_OVERAGE_BIZ_PCT * PRU_OVERAGE_BIZ_EXTRA * PRU_OVERAGE_RATE * 12
  const _entUpgradeYr80  = (ts * ep - ts * bp) * 12

  return {
    moBaseCurrent: _moBaseCurrent, moBase80: _moBase80,
    moConservativeCur: _moConservativeCur, moConservative: _moConservative,
    moBestCaseCur: _moBestCaseCur, moBestCase: _moBestCase,
    moStretchCur: _moStretchCur, moStretch: _moStretch,
    yrBase: _yrBase, yrBase80: _yrBase80, yrConservative: _yrConservative,
    yrBestCase: _yrBestCase, yrStretch: _yrStretch,
    deltaConMo: _moConservative - _moBase80, deltaBestMo: _moBestCase - _moBase80,
    deltaStrMo: _moStretch - _moBase80,
    deltaConYr: _yrConservative - _yrBase80, deltaBestYr: _yrBestCase - _yrBase80,
    deltaStrYr: _yrStretch - _yrBase80,
    pruOverageYr80: _pruOverageYr80, entUpgradeYr80: _entUpgradeYr80,
    revenueMultiplier: _yrStretch / _yrBase,
  }
}

// ── Formatters ──
export const fmtK   = (v) => '$' + (v / 1000).toFixed(1) + 'K'
export const fmtM   = (v) => '$' + (v / 1e6).toFixed(1) + 'M'
export const fmtUSD = (v) => '$' + Math.round(v).toLocaleString('en-US')
export const fmtPct = (v) => Math.round(v * 100) + '%'

// ── Bar width helper (% of max) ──
export function barPct(val, max) {
  return Math.round((val / max) * 100) + '%'
}

// ── Dashboard-compatible data (for the iframe/HTML dashboard) ──
export const dashboardData = enrichedCustomers.map(c => ({
  name: c.name,
  ghe: c.ghe,
  ghcp: c.ghcp,
  acr: Math.round(c.acr),
  pen: Math.round(c.pen * 100),
  at75: c.at75,
  at90: c.at90,
  color: c.color,
  logo: c.logo,
}))

export const dashboardKPIs = {
  totalGHE,
  totalGHCP,
  avgPen: Math.round(avgPen * 100),
  totalACR: Math.round(enrichedCustomers.reduce((s, c) => s + c.acr, 0)),
  total75:  Math.round(enrichedCustomers.reduce((s, c) => s + c.at75, 0)),
  total90:  Math.round(enrichedCustomers.reduce((s, c) => s + c.at90, 0)),
  gapTo75:  Math.round(enrichedCustomers.reduce((s, c) => s + c.at75, 0) - enrichedCustomers.reduce((s, c) => s + c.acr, 0)),
  expansionPct: Math.round(((enrichedCustomers.reduce((s, c) => s + c.at90, 0) / enrichedCustomers.reduce((s, c) => s + c.acr, 0)) - 1) * 100),
}
