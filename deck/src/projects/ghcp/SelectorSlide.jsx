import { useState } from 'react'
import { Slide, useSlides } from '@lopezleandro03/canvas-engine'
import { customers } from '../../data/opportunity'
import styles from './SelectorSlide.module.css'

import logoING from '../../data/logos/ing.png'
import logoASML from '../../data/logos/asml.png'
import logoPhilips from '../../data/logos/philips.png'
import logoShell from '../../data/logos/shell.png'
import logoAhold from '../../data/logos/ahold.png'
import logoABNAmro from '../../data/logos/abnamro.png'
import logoRabobank from '../../data/logos/rabobank.svg'

const localLogos = { ING: logoING, ASML: logoASML, Philips: logoPhilips, Shell: logoShell, Ahold: logoAhold, 'ABN Amro': logoABNAmro, Rabobank: logoRabobank }

export default function SelectorSlide() {
  const { goTo, setSelectedCustomer } = useSlides()
  const [picking, setPicking] = useState(false)

  const handlePickCustomer = (c) => {
    setSelectedCustomer(c)
    setPicking(false)
    goTo(12)
  }

  return (
    <Slide index={0} className={styles.selector}>
      <div className="accent-bar" />
      {/* Ambient orbs */}
      <div className={`orb ${styles.orb1}`} />
      <div className={`orb ${styles.orb2}`} />

      <div className={styles.center}>
        <div className={styles.badge}>Select Deck</div>
        <h1 className={styles.title}>GitHub <span>AI</span> Adoption Series</h1>
        <p className={styles.subtitle}>Choose the presentation track</p>

        {!picking ? (
          <div className={styles.cards}>
            <button className={styles.card} onClick={() => goTo(1)}>
              <div className={`${styles.cardGlow} ${styles.glowPurple}`} />
              <div className={styles.cardIcon}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="3" width="20" height="14" rx="2" /><path d="M8 21h8" /><path d="M12 17v4" />
                </svg>
              </div>
              <h2>Internal</h2>
              <p>Strategy, opportunity analysis, governance &amp; execution plan for Microsoft &amp; GitHub teams.</p>
              <div className={styles.cardArrow}>→</div>
            </button>

            <button className={styles.card} onClick={(e) => { e.stopPropagation(); setPicking(true) }}>
              <div className={`${styles.cardGlow} ${styles.glowCyan}`} />
              <div className={`${styles.cardIcon} ${styles.cardIconCyan}`}>
                <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" />
                </svg>
              </div>
              <h2>Customer Facing</h2>
              <p>AI adoption series overview, engagement model &amp; value proposition for customer stakeholders.</p>
              <div className={styles.cardArrow}>→</div>
            </button>
          </div>
        ) : (
          <div className={styles.pickerWrap}>
            <p className={styles.pickerLabel}>Select the customer</p>
            <div className={styles.picker}>
              {customers.map(c => (
                <button
                  key={c.name}
                  className={styles.pickerItem}
                  onClick={(e) => { e.stopPropagation(); handlePickCustomer(c) }}
                >
                  <img src={localLogos[c.name] || c.logo} alt={c.name} className={styles.pickerLogo} />
                  <span>{c.name}</span>
                </button>
              ))}
            </div>
            <button className={styles.pickerBack} onClick={(e) => { e.stopPropagation(); setPicking(false) }}>
              ← Back
            </button>
          </div>
        )}
      </div>
    </Slide>
  )
}
