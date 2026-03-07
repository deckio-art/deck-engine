import { BottomBar, Slide } from '@lopezleandro03/canvas-engine'
import styles from './CertificationsSlide.module.css'

const certs = [
  {
    badge: 'AZ-305',
    title: 'Designing Microsoft Azure Infrastructure Solutions',
    credential: 'Microsoft Certified: Azure Solutions Architect Expert',
    provider: 'Microsoft',
    color: 'blue',
    skills: [
      'Design identity, governance & monitoring solutions',
      'Design data storage solutions',
      'Design business continuity solutions',
      'Design infrastructure solutions',
    ],
    url: 'https://learn.microsoft.com/en-us/credentials/certifications/exams/az-305/',
    logo: (
      <svg viewBox="0 0 23 23" fill="#fff">
        <path d="M0 0h11v11H0zM12 0h11v11H12zM0 12h11v11H0zM12 12h11v11H12z"/>
      </svg>
    ),
  },
  {
    badge: 'GH-300',
    title: 'GitHub Copilot Certification',
    credential: 'GitHub Certified',
    provider: 'GitHub',
    color: 'purple',
    skills: [
      'Use GitHub Copilot responsibly',
      'Prompt engineering & context crafting',
      'Improve developer productivity with Copilot',
      'Configure privacy, exclusions & safeguards',
    ],
    url: 'https://learn.microsoft.com/en-us/credentials/certifications/github-copilot/',
    logo: (
      <svg viewBox="0 0 16 16" fill="#fff">
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"/>
      </svg>
    ),
  },
  {
    badge: 'KCNA',
    title: 'Kubernetes and Cloud Native Associate',
    credential: 'CNCF Certified',
    provider: 'CNCF / Linux Foundation',
    color: 'cyan',
    skills: [
      'Kubernetes fundamentals (44%)',
      'Container orchestration (28%)',
      'Cloud native application delivery (16%)',
      'Cloud native architecture (12%)',
    ],
    url: 'https://www.cncf.io/training/certification/kcna/',
    logo: (
      <svg viewBox="0 0 722 702" fill="#326CE5">
        <path d="M358.986 0c-12.07 0-23.396 3.722-33.68 10.403l-271.2 156.558c-20.148 11.948-33.68 34.396-33.68 58.1v313.116c0 23.704 13.148 46.152 33.68 58.1L325.306 752.64c10.284 6.68 21.61 10.402 33.68 10.402s23.396-3.722 33.68-10.403l271.2-156.558c20.148-11.948 33.68-34.396 33.68-58.1V225.06c0-23.704-13.148-46.152-33.68-58.1L392.666 10.403C382.382 3.722 371.056 0 358.986 0z" opacity=".3"/>
        <path d="M361 51l-266 153.5V511L361 664.5 627 511V204.5z" fill="#326CE5"/>
        <path d="M361 131c-5.3 0-9.6 3.6-10.8 8.5l-15.3 59.7c-11 2.2-21.5 5.7-31.3 10.4l-51.3-35.2c-4.4-3-10.3-2.6-14.2 1.3l-.3.3c-3.9 3.9-4.3 9.8-1.3 14.2l35.2 51.3c-4.7 9.8-8.2 20.3-10.4 31.3l-59.7 15.3c-4.9 1.2-8.5 5.5-8.5 10.8v.4c0 5.3 3.6 9.6 8.5 10.8l59.7 15.3c2.2 11 5.7 21.5 10.4 31.3l-35.2 51.3c-3 4.4-2.6 10.3 1.3 14.2l.3.3c3.9 3.9 9.8 4.3 14.2 1.3l51.3-35.2c9.8 4.7 20.3 8.2 31.3 10.4l15.3 59.7c1.2 4.9 5.5 8.5 10.8 8.5h.4c5.3 0 9.6-3.6 10.8-8.5l15.3-59.7c11-2.2 21.5-5.7 31.3-10.4l51.3 35.2c4.4 3 10.3 2.6 14.2-1.3l.3-.3c3.9-3.9 4.3-9.8 1.3-14.2l-35.2-51.3c4.7-9.8 8.2-20.3 10.4-31.3l59.7-15.3c4.9-1.2 8.5-5.5 8.5-10.8v-.4c0-5.3-3.6-9.6-8.5-10.8l-59.7-15.3c-2.2-11-5.7-21.5-10.4-31.3l35.2-51.3c3-4.4 2.6-10.3-1.3-14.2l-.3-.3c-3.9-3.9-9.8-4.3-14.2-1.3l-51.3 35.2c-9.8-4.7-20.3-8.2-31.3-10.4l-15.3-59.7c-1.2-4.9-5.5-8.5-10.8-8.5zm.2 167c34.8 0 63 28.2 63 63s-28.2 63-63 63-63-28.2-63-63 28.2-63 63-63z" fill="#fff"/>
      </svg>
    ),
  },
]

export default function CertificationsSlide() {
  return (
    <Slide index={7} className={styles.slide}>
      <div className="content-frame content-gutter">
        <div className={styles.content}>
          <p className={styles.eyebrow}>Appendix</p>
          <h2 className={styles.heading}>Certifications</h2>
          <p className={styles.subtitle}>Target certifications for the development plan period</p>

          <div className={styles.cards}>
            {certs.map(c => (
              <div key={c.badge} className={`${styles.card} ${styles[c.color]}`}>
                <div className={styles.cardHeader}>
                  <div className={styles.logoWrap}>{c.logo}</div>
                  <div>
                    <span className={styles.badgeCode}>{c.badge}</span>
                    <span className={styles.provider}>{c.provider}</span>
                  </div>
                </div>
                <h3 className={styles.certTitle}>{c.title}</h3>
                <p className={styles.credential}>{c.credential}</p>
                <ul className={styles.skillList}>
                  {c.skills.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
      <BottomBar text="Aspire Development Plan · Dilruba Turan" />
    </Slide>
  )
}
