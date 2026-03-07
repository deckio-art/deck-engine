import { BottomBar, Slide, useSlides } from '@lopezleandro03/canvas-engine'
import styles from './CustomerCoverSlide.module.css'

import logoING from '../../data/logos/ing.png'
import logoASML from '../../data/logos/asml.png'
import logoPhilips from '../../data/logos/philips.png'
import logoShell from '../../data/logos/shell.png'
import logoAhold from '../../data/logos/ahold.png'
import logoABNAmro from '../../data/logos/abnamro.png'
import logoRabobank from '../../data/logos/rabobank.svg'

const localLogos = { ING: logoING, ASML: logoASML, Philips: logoPhilips, Shell: logoShell, Ahold: logoAhold, 'ABN Amro': logoABNAmro, Rabobank: logoRabobank }

export default function CustomerCoverSlide() {
  const { selectedCustomer } = useSlides()
  const custLogo = selectedCustomer ? (localLogos[selectedCustomer.name] || selectedCustomer.logo) : null

  return (
    <Slide index={12} className={styles.cover}>
      {/* Accent bar */}
      <div className="accent-bar" />

      {/* Decorative orbs */}
      <div className={`orb ${styles.orb1}`} />
      <div className={`orb ${styles.orb2}`} />
      <div className={`orb ${styles.orb3}`} />
      <div className={`orb ${styles.orb4}`} />

      {/* Grid dots */}
      <div className={styles.gridOverlay} />

      {/* Connector lines */}
      <svg className={styles.connectorSvg} viewBox="0 0 300 300" fill="none" stroke="rgba(139,148,158,0.4)" strokeWidth="1.2">
        <path d="M20,280 Q80,200 140,180 T260,60" />
        <circle cx="140" cy="180" r="4" fill="none" stroke="rgba(88,166,255,0.6)" strokeWidth="1.5" />
        <circle cx="200" cy="120" r="3" fill="none" stroke="rgba(188,140,255,0.6)" strokeWidth="1.5" />
        <circle cx="260" cy="60" r="5" fill="none" stroke="rgba(86,212,221,0.6)" strokeWidth="1.5" />
        <line x1="260" y1="60" x2="290" y2="30" />
        <circle cx="290" cy="30" r="3" fill="none" stroke="rgba(247,120,186,0.6)" strokeWidth="1.5" />
      </svg>

      <div className="content-frame content-gutter">
        <div className={styles.content}>
          {/* Logo strip: GitHub + Microsoft + Customer */}
          <div className={styles.logos}>
            <div className={styles.logoBox}>
              <svg width="40" height="40" viewBox="0 0 16 16" fill="white">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
            </div>
            <span className={styles.logoDivider}>×</span>
            <div className={styles.logoBox}>
              <svg width="32" height="32" viewBox="0 0 23 23">
                <rect x="0" y="0" width="11" height="11" fill="#f25022" />
                <rect x="12" y="0" width="11" height="11" fill="#7fba00" />
                <rect x="0" y="12" width="11" height="11" fill="#00a4ef" />
                <rect x="12" y="12" width="11" height="11" fill="#ffb900" />
              </svg>
            </div>
            {custLogo && (
              <>
                <span className={styles.logoDivider}>×</span>
                <div className={styles.logoBox}>
                  <img src={custLogo} alt={selectedCustomer.name} className={styles.custImg} />
                </div>
              </>
            )}
          </div>

          <h1>GitHub <span className={styles.highlight}>AI</span> Adoption Series</h1>
          <p className={styles.subtitle}>
            Driving sustained Copilot &amp; AI usage across your engineering organization
          </p>
        </div>
      </div>

      <BottomBar />
    </Slide>
  )
}
