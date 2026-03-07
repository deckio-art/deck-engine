import { useState } from 'react'
import { BottomBar, Slide, useSlides } from '@lopezleandro03/canvas-engine'
import styles from './AppendixEmailSlide.module.css'

function getEmailHtml(custName) {
  return `<p>Hi team,</p>
<p>We're excited to extend an <b>exclusive invitation</b> to <b>${custName}</b> engineers for the <b>GitHub AI Adoption Series</b> — a hands-on, demo-first program designed to help your developers unlock the full potential of GitHub Copilot and agentic engineering.</p>
<p>This program is reserved for a <b>select group of strategic partners</b>. Your organization has been chosen because of your ambition to lead in AI-powered software development.</p>
<p>This isn't another webinar with slides. Every session is a <b>live coding demo</b> led by GitHub Solution Engineers &amp; Microsoft practitioners who build with AI every day.</p>
<ul>
<li>🎯 <b>What:</b> Bi-weekly, 1-hour demo sessions on focused Copilot &amp; AI topics</li>
<li>👥 <b>Who:</b> Your engineering teams — from individual contributors to tech leads</li>
<li>💡 <b>Why:</b> Move from "I have a license" to "I ship faster with AI" — measurable productivity gains</li>
<li>🛠️ <b>Format:</b> Live demos → Q&amp;A → your engineers share their wins</li>
</ul>
<p>Topics include <b>Agent Mode</b>, <b>spec-driven development</b>, <b>security workflows</b>, and <b>building AI agents with Copilot</b> — all demonstrated with real-world engineering challenges.</p>
<p>Spots are limited and this series won't be repeated. Forward this to your team leads and let's build the skill engineers need — together.</p>
<p>Looking forward to seeing ${custName} engineers there!<br><b>The GitHub &amp; Microsoft Team</b></p>`
}

function getEmailPlain(custName) {
  return `Hi team,

We're excited to extend an exclusive invitation to ${custName} engineers for the GitHub AI Adoption Series — a hands-on, demo-first program designed to help your developers unlock the full potential of GitHub Copilot and agentic engineering.

This program is reserved for a select group of strategic partners. Your organization has been chosen because of your ambition to lead in AI-powered software development.

This isn't another webinar with slides. Every session is a live coding demo led by GitHub Solution Engineers & Microsoft practitioners who build with AI every day.

🎯 What: Bi-weekly, 1-hour demo sessions on focused Copilot & AI topics
👥 Who: Your engineering teams — from individual contributors to tech leads
💡 Why: Move from "I have a license" to "I ship faster with AI" — measurable productivity gains
🛠️ Format: Live demos → Q&A → your engineers share their wins

Topics include Agent Mode, spec-driven development, security workflows, and building AI agents with Copilot — all demonstrated with real-world engineering challenges.

Spots are limited and this series won't be repeated. Forward this to your team leads and let's build the skill engineers need — together.

Looking forward to seeing ${custName} engineers there!
The GitHub & Microsoft Team`
}

export default function AppendixEmailSlide() {
  const { selectedCustomer } = useSlides()
  const custName = selectedCustomer?.name || '[Customer]'
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    const html = getEmailHtml(custName)
    const plain = getEmailPlain(custName)
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
      // fallback to plain text
      await navigator.clipboard.writeText(plain)
      setCopied(true)
      setTimeout(() => setCopied(false), 2500)
    }
  }

  return (
    <Slide index={20} className={styles.slide}>
      <div className="accent-bar" />

      <div className={`orb ${styles.orb1}`} />
      <div className={`orb ${styles.orb2}`} />

      <div className="content-frame content-gutter">
        <div className={styles.header}>
          <div className={styles.badge}>Appendix</div>
          <h2>Invitation Email Template</h2>
          <p className={styles.subtitle}>Ready-to-send copy for customer stakeholders</p>
        </div>

        <div className={styles.emailCard}>
          <div className={styles.emailHeader}>
            <div className={styles.emailField}>
              <span className={styles.emailLabel}>Subject:</span>
              <span className={styles.emailValue}>
                🚀 You're Invited — GitHub AI Adoption Series | Develop the Skill Engineers Need
              </span>
            </div>
          </div>

          <div className={styles.emailBody}>
            <p>Hi team,</p>

            <p>
              We're excited to extend an <strong>exclusive invitation</strong> to <strong>{custName}</strong> engineers for the{' '}
              <strong>GitHub AI Adoption Series</strong> — a hands-on, demo-first program designed to help your
              developers unlock the full potential of GitHub Copilot and agentic engineering.
            </p>

            <p>
              This program is reserved for a <strong>select group of strategic partners</strong>. Your organization
              has been chosen because of your ambition to lead in AI-powered software development.
            </p>

            <p>
              This isn't another webinar with slides. Every session is a <strong>live coding demo</strong> led by
              GitHub Solution Engineers & Microsoft practitioners who build with AI every day.
            </p>

            <div className={styles.highlights}>
              <div className={styles.highlightItem}>
                <span className={styles.highlightIcon}>🎯</span>
                <div>
                  <strong>What:</strong> Bi-weekly, 1-hour demo sessions on focused Copilot & AI topics
                </div>
              </div>
              <div className={styles.highlightItem}>
                <span className={styles.highlightIcon}>👥</span>
                <div>
                  <strong>Who:</strong> Your engineering teams — from individual contributors to tech leads
                </div>
              </div>
              <div className={styles.highlightItem}>
                <span className={styles.highlightIcon}>💡</span>
                <div>
                  <strong>Why:</strong> Move from "I have a license" to "I ship faster with AI" — measurable productivity gains
                </div>
              </div>
              <div className={styles.highlightItem}>
                <span className={styles.highlightIcon}>🛠️</span>
                <div>
                  <strong>Format:</strong> Live demos → Q&A → your engineers share their wins
                </div>
              </div>
            </div>

            <p>
              Topics include <strong>Agent Mode</strong>, <strong>spec-driven development</strong>,{' '}
              <strong>security workflows</strong>, and <strong>building AI agents with Copilot</strong> —
              all demonstrated with real-world engineering challenges.
            </p>

            <p>
              Spots are limited and this series won't be repeated. Forward this to your team leads and let's build the skill
              engineers need — together.
            </p>

            <p className={styles.emailSign}>
              Looking forward to seeing {custName} engineers there!<br />
              <span className={styles.emailSignName}>The GitHub & Microsoft Team</span>
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
