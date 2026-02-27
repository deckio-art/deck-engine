import { useState } from 'react'
import Slide from '../components/Slide'
import BottomBar from '../components/BottomBar'
import styles from './SpeakerInviteSlide.module.css'

function getEmailHtml() {
  return `<p>Hi [Name],</p>
<p>I'm reaching out because you're exactly the kind of engineer we want on stage.</p>
<p>We're launching the <b>GitHub AI Adoption Series</b> — an exclusive, demo-first program for our top strategic enterprise customers in the Netherlands. We're hand-picking a small group of exceptional speakers from GitHub and Microsoft Engineering, and <b>your name came up immediately</b>.</p>
<p><b>Why you?</b> You're already living in the AI-first engineering world our customers are trying to reach. You don't just talk about Copilot — you ship with it. That authenticity is exactly what makes this program different from every other webinar out there.</p>
<p><b>What we're asking:</b></p>
<ul>
<li>🎤 <b>One 30–40 minute live demo</b> on [Topic] — no slides, just you and your IDE</li>
<li>📅 <b>Bi-weekly cadence</b>, 1-hour sessions — you'd present once (or more if you want to come back)</li>
<li>👥 <b>Audience:</b> 200+ engineers from companies like ING, ASML, Shell, Philips, ABN Amro, Rabobank</li>
<li>🌟 <b>Recognition:</b> Featured speaker profile, cross-published content, and direct visibility with enterprise engineering leaders</li>
</ul>
<p>This isn't a generic ask. The lineup is intentionally small and curated — every speaker is someone who's <b>ahead of the curve</b>. Being part of this series is a chance to shape how the next generation of enterprise engineers works with AI.</p>
<p>We'll handle all the logistics, audience management, and promotion. All we need from you is the demo you'd probably give at a team brown bag — just to a much bigger room.</p>
<p>Can we find 15 minutes to chat this week?</p>
<p>Cheers,<br><b>[Your Name]</b><br>GitHub / Microsoft</p>`
}

function getEmailPlain() {
  return `Hi [Name],

I'm reaching out because you're exactly the kind of engineer we want on stage.

We're launching the GitHub AI Adoption Series — an exclusive, demo-first program for our top strategic enterprise customers in the Netherlands. We're hand-picking a small group of exceptional speakers from GitHub and Microsoft Engineering, and your name came up immediately.

Why you? You're already living in the AI-first engineering world our customers are trying to reach. You don't just talk about Copilot — you ship with it. That authenticity is exactly what makes this program different from every other webinar out there.

What we're asking:

🎤 One 30–40 minute live demo on [Topic] — no slides, just you and your IDE
📅 Bi-weekly cadence, 1-hour sessions — you'd present once (or more if you want to come back)
👥 Audience: 200+ engineers from companies like ING, ASML, Shell, Philips, ABN Amro, Rabobank
🌟 Recognition: Featured speaker profile, cross-published content, and direct visibility with enterprise engineering leaders

This isn't a generic ask. The lineup is intentionally small and curated — every speaker is someone who's ahead of the curve. Being part of this series is a chance to shape how the next generation of enterprise engineers works with AI.

We'll handle all the logistics, audience management, and promotion. All we need from you is the demo you'd probably give at a team brown bag — just to a much bigger room.

Can we find 15 minutes to chat this week?

Cheers,
[Your Name]
GitHub / Microsoft`
}

export default function SpeakerInviteSlide() {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const html = getEmailHtml()
    const plain = getEmailPlain()
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/html': new Blob([html], { type: 'text/html' }),
          'text/plain': new Blob([plain], { type: 'text/plain' }),
        })
      ])
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    } catch {
      await navigator.clipboard.writeText(plain)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <Slide index={10} className={styles.slide}>
      <div className="accent-bar" />

      <div className={`orb ${styles.orb1}`} />
      <div className={`orb ${styles.orb2}`} />

      <div className="content-frame content-gutter">
        <div className={styles.header}>
          <div className={styles.badge}>Appendix</div>
          <h2>Speaker Invitation Email</h2>
          <p className={styles.subtitle}>Recruit your expert lineup — exclusivity & recognition built in</p>
        </div>

        <div className={styles.emailCard}>
          <div className={styles.emailHeader}>
            <div className={styles.emailField}>
              <span className={styles.emailLabel}>Subject:</span>
              <span className={styles.emailValue}>
                🎤 Hand-picked: We want you on stage for the GitHub AI Adoption Series
              </span>
            </div>
          </div>

          <div className={styles.emailBody}>
            <p>Hi [Name],</p>

            <p>
              I'm reaching out because you're exactly the kind of engineer we want on stage.
            </p>

            <p>
              We're launching the <strong>GitHub AI Adoption Series</strong> — an exclusive, demo-first
              program for our top strategic enterprise customers in the Netherlands. We're hand-picking
              a small group of exceptional speakers from GitHub and Microsoft Engineering, and{' '}
              <strong>your name came up immediately</strong>.
            </p>

            <p>
              <strong>Why you?</strong> You're already living in the AI-first engineering world our
              customers are trying to reach. You don't just talk about Copilot — you ship with it.
              That authenticity is exactly what makes this program different.
            </p>

            <div className={styles.highlights}>
              <div className={styles.highlightItem}>
                <span className={styles.highlightIcon}>🎤</span>
                <div>
                  <strong>Ask:</strong> One 30–40 min live demo on [Topic] — no slides, just you and your IDE
                </div>
              </div>
              <div className={styles.highlightItem}>
                <span className={styles.highlightIcon}>👥</span>
                <div>
                  <strong>Audience:</strong> 200+ engineers from ING, ASML, Shell, Philips, Rabobank
                </div>
              </div>
              <div className={styles.highlightItem}>
                <span className={styles.highlightIcon}>🌟</span>
                <div>
                  <strong>Recognition:</strong> Featured speaker profile, cross-published content & visibility with enterprise leaders
                </div>
              </div>
              <div className={styles.highlightItem}>
                <span className={styles.highlightIcon}>🏆</span>
                <div>
                  <strong>Exclusive:</strong> Curated lineup — every speaker is someone who's ahead of the curve
                </div>
              </div>
            </div>

            <p>
              This isn't a generic ask. The lineup is intentionally small and curated — being part
              of this series is a chance to <strong>shape how the next generation of enterprise
              engineers works with AI</strong>.
            </p>

            <p>
              We handle all logistics, audience & promotion. All we need is the demo you'd give
              at a team brown bag — just to a much bigger room.
            </p>

            <p className={styles.emailSign}>
              Can we find 15 minutes to chat this week?<br />
              <span className={styles.emailSignName}>Cheers, [Your Name]</span>
            </p>
          </div>

          <div className={styles.emailFooter}>
            <button className={`${styles.copyBtn} ${copied ? styles.copyBtnDone : ''}`} onClick={handleCopy}>
              {copied ? '✅ Copied — paste into Outlook!' : '📋 Copy email to clipboard'}
            </button>
            <span className={styles.copyHint}>Copies as rich HTML — paste directly into Outlook, Gmail, or Teams</span>
          </div>
        </div>
      </div>

      <BottomBar />
    </Slide>
  )
}
