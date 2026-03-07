import { BottomBar, Slide } from '@lopezleandro03/canvas-engine'
import styles from './OneESPlatformSlide.module.css'

import vsLogo from '../../data/logos/ms-products/visualstudio.svg'
import vscodeLogo from '../../data/logos/ms-products/vscode.svg'
import k8sLogo from '../../data/logos/ms-products/kubernetes.svg'
import githubLogo from '../../data/logos/ms-products/github.svg'
import azureLogo from '../../data/images/northware-microsoft-azure-logo.webp'
import azureDevOpsLogo from '../../data/logos/ms-products/azuredevops.svg'
import copilotLogo from '../../data/images/icons8-github-copilot-48.png'

const products = [
  { name: 'Visual Studio', logo: vsLogo },
  { name: 'VS Code', logo: vscodeLogo },
  { name: 'GitHub', logo: githubLogo },
  { name: 'GitHub Copilot', logo: copilotLogo },
  { name: 'Azure', logo: azureLogo },
  { name: 'Azure DevOps', logo: azureDevOpsLogo },
  { name: 'Kubernetes', logo: k8sLogo },
]

const tiers = [
  {
    label: 'Product Teams',
    desc: 'Local customizations and extensibility',
    width: '42%',
  },
  {
    label: '1ES Core Platform',
    desc: 'Security, Platform Management and Integrated Experiences',
    width: '68%',
  },
  {
    label: 'Retail Microsoft, OSS & 3rd-Party',
    desc: 'Developer Product Experience',
    width: '94%',
  },
]

export default function OneESPlatformSlide({ index }) {
  return (
    <Slide index={index} className={styles.slide}>
      <div className="accent-bar" />
      <div className={`orb ${styles.orb1}`} />
      <div className={`orb ${styles.orb2}`} />
      <div className={`orb ${styles.orb3}`} />

      <div className={styles.container}>
        {/* Title */}
        <div className={styles.header}>
          <h2 className={styles.title}>
            <span className={styles.accent}>1ES</span> — Microsoft's Internal Engineering Platform
          </h2>
          <div className={styles.titleBar} />
        </div>

        {/* Main layout: pyramid centered, callouts positioned absolutely */}
        <div className={styles.body}>
          {/* Left callout */}
          <div className={`${styles.callout} ${styles.calloutLeft} ${styles.visible}`}>
            <div className={styles.calloutIcon}>⚡</div>
            <p className={styles.calloutText}>
              Integrated developer experiences that improve <strong>productivity &amp; satisfaction</strong>
            </p>
            <div className={styles.calloutArrows}>
              <span className={styles.calloutArrowDown}>↓</span>
            </div>
          </div>

          {/* Right callout */}
          <div className={`${styles.callout} ${styles.calloutRight} ${styles.visible}`}>
            <div className={styles.calloutArrows}>
              <span className={styles.calloutArrowUp}>↑</span>
            </div>
            <div className={styles.calloutIcon}>🛡️</div>
            <p className={styles.calloutText}>
              Performance and <strong>security</strong> at enterprise <strong>scale</strong>
            </p>
          </div>

          {/* Pyramid */}
          <div className={styles.pyramid}>
            {tiers.map((tier, i) => (
              <div key={i} className={styles.tierWrap}>
                <div
                  className={`${styles.tier} ${styles.visible}`}
                  style={{ '--tier-width': tier.width }}
                  data-level={i}
                >
                  <span className={styles.tierLabel}>{tier.label}</span>
                  <span className={styles.tierDesc}>{tier.desc}</span>
                  {i === 2 && (
                    <div className={styles.icons}>
                      {products.map((p, j) => (
                        <div key={j} className={styles.iconItem}>
                          <img src={p.logo} alt={p.name} className={styles.iconImg} />
                          <span className={styles.iconName}>{p.name}</span>
                        </div>
                      ))}
                      <div className={styles.iconItem}>
                        <span className={styles.moreIcon}>…</span>
                        <span className={styles.iconName}>& more</span>
                      </div>
                    </div>
                  )}
                  <div className={styles.tierGlow} />
                </div>

                {/* Arrow connector between tiers */}
                {i < tiers.length - 1 && (
                  <div className={`${styles.arrows} ${styles.visible}`}>
                    <div className={styles.arrowLine} />
                    <div className={styles.arrowIndicators}>
                      <span className={styles.arrowUp}>↑</span>
                      <span className={styles.arrowDown}>↓</span>
                    </div>
                    <div className={styles.arrowLine} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      <BottomBar text="Nordcloud Developer Day 2026" />
    </Slide>
  )
}
