import { BottomBar, Slide } from '@lopezleandro03/canvas-engine'
import styles from './CoverSlide.module.css'
import { customers } from '../../data/opportunity'

import logoING from '../../data/logos/ing.png'
import logoASML from '../../data/logos/asml.png'
import logoPhilips from '../../data/logos/philips.png'
import logoShell from '../../data/logos/shell.png'
import logoAhold from '../../data/logos/ahold.png'
import logoABNAmro from '../../data/logos/abnamro.png'
import logoRabobank from '../../data/logos/rabobank.svg'

const localLogos = {
  ING: logoING,
  ASML: logoASML,
  Philips: logoPhilips,
  Shell: logoShell,
  Ahold: logoAhold,
  'ABN Amro': logoABNAmro,
  Rabobank: logoRabobank,
}

export default function CoverSlide() {
  return (
    <Slide index={1} className={styles.cover}>
      {/* Decorative elements */}
      <div className="accent-bar" />
      <div className={`orb ${styles.orb1}`} />
      <div className={`orb ${styles.orb2}`} />
      <div className={`orb ${styles.orb3}`} />
      <div className={`orb ${styles.orb4}`} />
      <div className="grid-dots" style={{ right: 40, top: '45%' }} />

      {/* Connector lines SVG */}
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
          <h1>GitHub <span className={styles.highlight}>AI</span> Activation Series</h1>
          <p className={styles.subtitle}>Increasing utilization and adoption</p>
          <div className={styles.presenters}>
            <svg width="18" height="18" viewBox="0 0 16 16" fill="currentColor" opacity="0.8">
              <path d="M10.5 5a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0zm.514 2.63a4 4 0 10-6.028 0A4.002 4.002 0 001 11.5V13a2 2 0 002 2h10a2 2 0 002-2v-1.5a4.002 4.002 0 00-3.986-3.87z" />
            </svg>
            Eric Laan &amp; Leandro Lopez
          </div>

          <div className={styles.logoStrip}>
            {customers.map(c => (
              <div key={c.name} className={styles.logoItem}>
                <img src={localLogos[c.name] || c.logo} alt={c.name} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomBar />
    </Slide>
  )
}
