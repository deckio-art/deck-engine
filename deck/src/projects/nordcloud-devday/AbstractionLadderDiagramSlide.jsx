import { useState, useEffect } from 'react'
import { BottomBar, Slide, useSlides } from '@lopezleandro03/canvas-engine'
import styles from './AbstractionLadderDiagramSlide.module.css'

const tiers = [
  {
    era: '2020s',
    role: 'Agentic Engineers',
    abstraction: 'Human Intent\n(Natural Language)',
    exampleLabel: 'Specifications',
    example: '"summarize product\nby category"',
    bridge: 'LLMs',
  },
  {
    era: '1960s',
    role: 'Software Engineers',
    abstraction: 'Higher level\nprogramming languages',
    exampleLabel: 'Source code',
    example: 'X = Y+Z\nDO 10 I = 1, 100',
    bridge: 'Compilers',
  },
  {
    era: '1950s',
    role: 'Machine Operators',
    abstraction: 'Machine Code\n(Assembly)',
    exampleLabel: 'Raw instructions',
    example: 'MOV AX, BX\nADD AX, 2',
    bridge: null,
  },
]

// Reveal order (bottom-up): Machine(2), Software(1), Agentic(0), Arrow
// tier i is visible when step >= (tiers.length - i)
const STEPS = tiers.length // reveal bottom-up: Machine(2), Software(1), Agentic(0)

export default function AbstractionLadderDiagramSlide({ index }) {
  const { current } = useSlides()
  const [step, setStep] = useState(0)
  const isActive = current === index

  useEffect(() => {
    if (!isActive) setStep(0)
  }, [isActive])

  useEffect(() => {
    if (!isActive) return
    const handler = (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown' || e.key === 'Enter') {
        if (step < STEPS) {
          e.preventDefault()
          e.stopPropagation()
          setStep(s => s + 1)
        }
      }
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') {
        if (step > 0) {
          e.preventDefault()
          e.stopPropagation()
          setStep(s => s - 1)
        }
      }
    }
    document.addEventListener('keydown', handler, true)
    return () => document.removeEventListener('keydown', handler, true)
  }, [isActive, step])

  const tierVisible = (i) => step >= (tiers.length - i)

  return (
    <Slide index={index} className={styles.slide}>
      <div className="accent-bar" />
      <div className={`orb ${styles.orb1}`} />
      <div className={`orb ${styles.orb2}`} />

      <div className={styles.body}>
        <div className={styles.ladder}>
          {tiers.map((tier, i) => (
            <div key={i} className={styles.tierGroup}>
              <div className={`${styles.tier} ${tierVisible(i) ? styles.visible : styles.hidden}`}>
                {/* Left: role + era */}
                <div className={styles.role}>
                  <span className={styles.roleName}>{tier.role}</span>
                  <span className={styles.roleEra}>{tier.era}</span>
                </div>

                {/* Center: abstraction level */}
                <div className={styles.center}>
                  {tier.abstraction.split('\n').map((line, j) => (
                    <span key={j}>{line}</span>
                  ))}
                </div>

                {/* Right: code example */}
                <div className={styles.example}>
                  <span className={styles.exampleLabel}>{tier.exampleLabel}</span>
                  <code className={styles.exampleCode}>
                    {tier.example.split('\n').map((line, j) => (
                      <span key={j}>{line}</span>
                    ))}
                  </code>
                </div>
              </div>

              {tier.bridge && (
                <div className={`${styles.bridge} ${tierVisible(i) ? styles.visible : styles.hidden}`}>
                  <div className={styles.bridgeLine} />
                  <div className={styles.bridgePill}>{tier.bridge}</div>
                  <div className={styles.bridgeLine} />
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Right arrow — always visible */}
        <div className={styles.arrow}>
          <div className={styles.arrowHead}>↑</div>
          <div className={styles.arrowLine} />
          <span className={styles.arrowLabel}>Abstraction &amp;<br />Productivity</span>
        </div>
      </div>

      <BottomBar text="Nordcloud Developer Day 2026" />
    </Slide>
  )
}
