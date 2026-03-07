import { BottomBar, Slide } from '@lopezleandro03/canvas-engine'
import styles from './ScopeSlide.module.css'

export default function ScopeSlide() {
  return (
    <Slide index={6} className={styles.scope}>
      <div className="accent-bar" />

      <div className="content-frame content-gutter">
        <div className={styles.header}>
          <h2>Scope</h2>
          <p className={styles.subtitle}>What are we focusing on?</p>
        </div>

        <div className={styles.body}>
          {/* ── Left column: In Scope ── */}
          <div className={styles.left}>
            {/* SKU card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={`${styles.cardIcon} ${styles.cardIconBlue}`}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><circle cx="12" cy="12" r="6" /><circle cx="12" cy="12" r="2" /></svg>
                </div>
                <div>
                  <h3>AI Adoption for GitHub Copilot</h3>
                  <span className={styles.cardTag}>In scope</span>
                </div>
              </div>

              <p className={styles.sectionLabel}>This influences three SKUs:</p>
              <div className={styles.skuGrid}>
                <div className={styles.skuCard}>
                  <div className={styles.skuIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="9" cy="7" r="4" /><path d="M23 21v-2a4 4 0 00-3-3.87" /><path d="M16 3.13a4 4 0 010 7.75" /></svg>
                  </div>
                  <div className={styles.skuInfo}>
                    <span className={styles.skuName}>GHCP Seats</span>
                    <span className={styles.skuDetail}>Business · Enterprise</span>
                  </div>
                  <div className={styles.skuPrices}>
                    <span className={styles.priceTag}>$19</span>
                    <span className={styles.priceTag}>$39</span>
                  </div>
                </div>

                <div className={styles.skuCard}>
                  <div className={styles.skuIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>
                  </div>
                  <div className={styles.skuInfo}>
                    <span className={styles.skuName}>PRUs</span>
                    <span className={styles.skuDetail}>Premium request units</span>
                  </div>
                </div>

                <div className={styles.skuCard}>
                  <div className={styles.skuIcon}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" /></svg>
                  </div>
                  <div className={styles.skuInfo}>
                    <span className={styles.skuName}>GitHub Action minutes</span>
                    <span className={styles.skuDetail}>CI/CD compute</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Expansion card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={`${styles.cardIcon} ${styles.cardIconPurple}`}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" /><circle cx="8.5" cy="7" r="4" /><line x1="20" y1="8" x2="20" y2="14" /><line x1="23" y1="11" x2="17" y2="11" /></svg>
                </div>
                <h3>Two types of upselling</h3>
              </div>

              <div className={styles.expansionRows}>
                <div className={`${styles.expansionRow} ${styles.expansionHoriz}`}>
                  <div className={styles.expansionBar} style={{background: 'var(--accent)'}} />
                  <div className={styles.expansionContent}>
                    <h4>Horizontal expansion</h4>
                    <p>More seats — grow the installed base across teams and orgs</p>
                  </div>
                  <div className={styles.expansionBadge}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
                  </div>
                </div>
                <div className={`${styles.expansionRow} ${styles.expansionVert}`}>
                  <div className={styles.expansionBar} style={{background: 'var(--purple)'}} />
                  <div className={styles.expansionContent}>
                    <h4>Vertical expansion</h4>
                    <p>More usage — PRUs &amp; GitHub Action minutes per existing seat</p>
                  </div>
                  <div className={`${styles.expansionBadge} ${styles.expansionBadgePurple}`}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="12" y1="19" x2="12" y2="5" /><polyline points="5 12 12 5 19 12" /></svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Right column: Out of Scope ── */}
          <div className={styles.right}>
            <div className={`${styles.card} ${styles.cardMuted}`}>
              <div className={styles.cardHeader}>
                <div className={`${styles.cardIcon} ${styles.cardIconMuted}`}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><line x1="4.93" y1="4.93" x2="19.07" y2="19.07" /></svg>
                </div>
                <div>
                  <h3>Cross-sell</h3>
                  <span className={`${styles.cardTag} ${styles.cardTagMuted}`}>Out of scope</span>
                </div>
              </div>

              <p className={styles.outIntro}>
                What we&rsquo;re not focusing on with this program is the cross-sell.
              </p>

              <p className={styles.sectionLabel}>Other GitHub SKUs:</p>
              <div className={styles.skuGrid}>
                <div className={`${styles.skuCard} ${styles.skuCardMuted}`}>
                  <div className={`${styles.skuIcon} ${styles.skuIconMuted}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><rect x="3" y="11" width="18" height="11" rx="2" /><path d="M7 11V7a5 5 0 0110 0v4" /></svg>
                  </div>
                  <div className={styles.skuInfo}>
                    <span className={styles.skuName}>GHAS Secret Protection</span>
                  </div>
                  <div className={styles.skuPrices}>
                    <span className={`${styles.priceTag} ${styles.priceTagMuted}`}>$19</span>
                  </div>
                </div>

                <div className={`${styles.skuCard} ${styles.skuCardMuted}`}>
                  <div className={`${styles.skuIcon} ${styles.skuIconMuted}`}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" /></svg>
                  </div>
                  <div className={styles.skuInfo}>
                    <span className={styles.skuName}>GHAS Code Scanning</span>
                  </div>
                  <div className={styles.skuPrices}>
                    <span className={`${styles.priceTag} ${styles.priceTagMuted}`}>$30</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <BottomBar />
    </Slide>
  )
}
