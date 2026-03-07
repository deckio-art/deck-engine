import { useState, useEffect } from 'react'
import { BottomBar, Slide, useSlides } from '@lopezleandro03/canvas-engine'
import styles from './AgenticEvolutionSlide.module.css'

const generations = [
  {
    gen: 'Gen 1',
    tagline: 'Human works,\nAI suggests',
    detail: 'Copilot completions, inline hints',
    state: 'past',
  },
  {
    gen: 'Gen 2',
    tagline: 'Human asks,\nAI answers',
    detail: 'Chat, Q&A, prompt-driven output',
    state: 'past',
  },
  {
    gen: 'Gen 3',
    tagline: 'Humans and\nAI collaborate',
    detail: 'Agents plan, execute & iterate autonomously',
    state: 'now',
  },
]

const STEPS = generations.length

export default function AgenticEvolutionSlide({ index }) {
  const { current } = useSlides()
  const [step, setStep] = useState(0)
  const isActive = current === index

  // Reset step when slide is left
  useEffect(() => {
    if (!isActive) setStep(0)
  }, [isActive])

  // Intercept keyboard in capture phase so we consume the event before SlideContext
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

  return (
    <Slide index={index} className={styles.slide}>
      <div className="accent-bar" />
      <div className={`orb ${styles.orb1}`} />
      <div className={`orb ${styles.orb2}`} />

      <div className={styles.body}>

        <div className={styles.header}>
          <span className={styles.eyebrow}>Agentic AI · Developer Experience</span>
          <h2 className={styles.title}>Evolution of <span className={styles.highlight}>Agentic Workflows</span></h2>
        </div>

        <div className={styles.timeline}>
          {/* No standalone line — connecting segments drawn via CSS ::after */}

          {generations.map((g, i) => (
            <div
              key={g.gen}
              className={`${styles.stop} ${styles[g.state]} ${i < step ? styles.visible : styles.hidden}`}
            >
              {/* Connecting line from previous stop — appears with this bubble */}
              {i > 0 && (
                <div className={`${styles.lineSegment} ${i < step ? styles.visible : styles.hidden}`} data-seg={i} />
              )}
              <div className={styles.pill}>
                <span className={styles.genLabel}>{g.gen}</span>
                {g.state === 'now' && <span className={styles.nowBadge}>Now</span>}
              </div>
              <div className={styles.connector} />
              <div className={styles.label}>
                {g.tagline.split('\n').map((line, j) => (
                  <span key={j} className={styles.taglineLine}>{line}</span>
                ))}
                <span className={styles.detail}>{g.detail}</span>
              </div>
            </div>
          ))}
        </div>

      </div>

      <BottomBar text="Nordcloud Developer Day 2026" />
    </Slide>
  )
}
