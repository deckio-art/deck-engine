import { BottomBar, Slide } from '@lopezleandro03/canvas-engine'
import styles from './HourglassSlide.module.css'
import bridgeImg from '../../data/generated/bridge.png'
import iconsImg from '../../data/generated/right-icons.png'

const Icon = ({ col, row, size = 24 }) => (
  <span
    className={styles.spriteIcon}
    style={{
      width: size,
      height: size,
      backgroundImage: `url(${iconsImg})`,
      backgroundSize: '300% 200%',
      backgroundPosition: `${col * 50}% ${row * 100}%`,
    }}
  />
)

const HourglassSvg = () => (
  <svg viewBox="0 0 320 520" className={styles.hourglassSvg} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="frame" x1="0" y1="0" x2="1" y2="0.8">
        <stop offset="0%" stopColor="#d5a12d" />
        <stop offset="45%" stopColor="#f2e29f" />
        <stop offset="100%" stopColor="#b8862d" />
      </linearGradient>
      <linearGradient id="topZone" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#67dce5" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#3ab8c4" stopOpacity="0.5" />
      </linearGradient>
      <linearGradient id="midZone" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#f2b84e" stopOpacity="0.95" />
        <stop offset="100%" stopColor="#f78166" stopOpacity="0.85" />
      </linearGradient>
      <linearGradient id="botZone" x1="0.5" y1="0" x2="0.5" y2="1">
        <stop offset="0%" stopColor="#5bd36a" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#3fb950" stopOpacity="0.95" />
      </linearGradient>
    </defs>

    <rect x="16" y="6" width="288" height="24" rx="8" fill="url(#frame)" stroke="#7e5d1f" strokeWidth="1.5" />
    <rect x="16" y="490" width="288" height="24" rx="8" fill="url(#frame)" stroke="#7e5d1f" strokeWidth="1.5" />

    <path
      d="M34 30 H286 C286 88 260 174 174 250 Q160 258 146 250 C60 174 34 88 34 30 Z"
      fill="url(#topZone)"
      stroke="#56d4dd"
      strokeWidth="3"
    />
    <ellipse cx="160" cy="260" rx="28" ry="9" fill="url(#midZone)" stroke="#d29922" strokeWidth="2" />
    <path
      d="M34 490 H286 C286 432 260 346 174 270 Q160 262 146 270 C60 346 34 432 34 490 Z"
      fill="url(#botZone)"
      stroke="#3fb950"
      strokeWidth="3"
    />

    <path d="M54 490 H266 C258 448 220 420 160 410 C100 420 62 448 54 490 Z" fill="#c6993a" opacity="0.65" />

    <g transform="translate(95 76)">
      <circle r="16" fill="none" stroke="#56d4dd" strokeWidth="2" />
      <text x="0" y="6" fontSize="18" textAnchor="middle" fill="#dff8fb" fontWeight="900">?</text>
    </g>
    <g transform="translate(225 84)">
      <circle r="13" fill="rgba(210,153,34,0.35)" stroke="#d29922" strokeWidth="1.5" />
      <text x="0" y="5" fontSize="14" textAnchor="middle" fill="#fef2b8" fontWeight="900">✦</text>
    </g>
    <g transform="translate(160 154)">
      <circle r="11" fill="none" stroke="#58a6ff" strokeWidth="2" />
      <line x1="7" y1="7" x2="14" y2="14" stroke="#58a6ff" strokeWidth="2" />
    </g>

    <g transform="translate(160 260)">
      <polygon points="0,-11 -4,0 3,0 -2,12 8,-2 1,-2 5,-11" fill="#f3d178" stroke="#d29922" strokeWidth="1" />
    </g>

    <g transform="translate(103 344)">
      <circle r="12" fill="rgba(63,185,80,0.2)" stroke="#3fb950" strokeWidth="2" />
      <polyline points="-6,0 -1,5 7,-6" fill="none" stroke="#3fb950" strokeWidth="2.2" />
    </g>
    <g transform="translate(220 346)">
      <rect x="-9" y="-4" width="18" height="14" rx="2" fill="rgba(63,185,80,0.22)" stroke="#3fb950" strokeWidth="1.5" />
      <path d="M-6 -4 V-10 C-6 -14 6 -14 6 -10 V-4" fill="none" stroke="#3fb950" strokeWidth="1.5" />
    </g>

    <circle r="2.5" fill="#f2bf56" opacity="0.8">
      <animate attributeName="cx" values="160;158;160" dur="3.2s" repeatCount="indefinite" />
      <animate attributeName="cy" values="250;282;462" dur="3.2s" repeatCount="indefinite" />
    </circle>
  </svg>
)

export default function HourglassSlide({ index }) {
  return (
    <Slide index={index} className={styles.slide}>
      <div className="accent-bar" />
      <div className={`orb ${styles.orb1}`} />
      <div className={`orb ${styles.orb2}`} />

      <div className={`content-frame content-gutter ${styles.body}`}>
        <header className={styles.header}>
          <h2 className={styles.title}>
            SDLC <span className={styles.highlight}>POWERED BY AI</span> IS NOW AN HOURGLASS
          </h2>
          <p className={styles.subtitle}>Software building in the era of AI explained like I'm 5!</p>
        </header>

        <div className={styles.columns}>
          <section className={styles.left}>
            <div className={styles.bridgeBox}>
              <span className={styles.intentLabel}>Intent</span>
              <img src={bridgeImg} alt="Bridge metaphor" className={styles.bridgeImg} />
              <div className={styles.bridgeOverlay}>
                <span className={styles.bridgeOverlayOld}>Old Way: A Long, Slow Bridge Middle.</span>
                <span className={styles.bridgeOverlayNew}>New Way: A FAST, Direct Jump!</span>
              </div>
            </div>

            <h3 className={styles.sectionTitle}>The OLD Way (Linear)</h3>
            <div className={styles.pipeline}>
              {[
                ['Requirements', 'Gathering all user needs & specs.'],
                ['Plan', 'Mapping out the project roadmap.'],
                ['Design', 'Architecting the system structure.'],
                ['Implement', 'Writing the actual code.'],
                ['Test', 'Verifying quality & functionality.'],
                ['Deploy', 'Releasing software to users.'],
                ['Maintain', 'Ongoing support & updates.'],
              ].map(([name, desc], i) => (
                <div key={name} className={styles.pipelineStep}>
                  <span className={styles.stepTop}>{i + 1}. {name}</span>
                  <span className={styles.stepDesc}>{desc}</span>
                </div>
              ))}
            </div>
            <p className={styles.oldNote}>Before: Building took FOREVER! We spent all our time here.</p>

            <h3 className={styles.pivotTitle}>Comparative View: The Pivot</h3>
            <div className={styles.pivotGrid}>
              <div className={styles.pivotHeads}>
                <div className={styles.pivotHead}>Traditional SDLC<br /><small>(Old Middle-Heavy)</small></div>
                <div className={styles.pivotHead}>Agentic SDLC<br /><small>(New Intent-Heavy)</small></div>
              </div>
              {[
                ['Requirements: Abstract tickets', 'Rich Context!'],
                ['Development: Manual Coding', 'Agentic Execution!'],
                ['Testing: Manual QA', 'Automated Assurance!'],
                ['Deployment: Stopgap', 'Integrated Loop!'],
                ["The 'Craft': Language Mastery", 'INTENT Mastery!'],
              ].map(([oldText, newText]) => (
                <div key={oldText} className={styles.pivotPair}>
                  <div className={styles.pivotOld}>{oldText}</div>
                  <div className={styles.pivotNew}>→ {newText}</div>
                </div>
              ))}
            </div>
          </section>

          <section className={styles.center}>
            <h3 className={styles.centerTitle}>The NEW Way (Hourglass) · Agentic SDLC</h3>
            <div className={styles.centerBody}>
              <div className={styles.zoneNotes}>
                <div className={styles.zoneTop}>
                  <strong>1. TOP:</strong> What to Build
                  <span>(Intent & Discovery)</span>
                  <p>We need to be VERY clear on WHAT we want. <em>(The New Heavyweight!)</em></p>
                </div>
                <div className={styles.zoneMid}>
                  <strong>2. MIDDLE:</strong> Building it FAST
                  <span>(Execution)</span>
                  <p>The bridge is tiny! AI Agents build it super fast. We just watch!</p>
                </div>
                <div className={styles.zoneBot}>
                  <strong>3. BOTTOM:</strong> Checking it’s RIGHT
                  <span>(Verification & Release)</span>
                  <p>With SO MUCH code, we need SMART tools to check it’s safe.</p>
                </div>
              </div>
              <div className={styles.hourglassWrap}>
                <HourglassSvg />
              </div>
            </div>
          </section>

          <section className={styles.right}>
            <div className={styles.statCard}>
              <Icon col={0} row={0} />
              <span className={styles.statSource}>Gartner</span>
              <span className={styles.statValue}>75%</span>
              <span className={styles.statDesc}>will use AI assistants (by 2028)</span>
            </div>
            <div className={styles.statCard}>
              <Icon col={1} row={0} />
              <span className={styles.statSource}>GitHub</span>
              <span className={styles.statValue}>55%</span>
              <span className={styles.statDesc}>FASTER tasks → More time for SOLUTIONS!</span>
            </div>
            <div className={styles.statCard}>
              <Icon col={2} row={1} />
              <span className={styles.statSource}>Stack Overflow 2024</span>
              <span className={styles.statValue}>70%+</span>
              <span className={styles.statDesc}>use AI tools</span>
            </div>

            <div className={styles.toolingList}>
              <div className={styles.toolingItem}><Icon col={0} row={1} size={20} />IDE: Diagnostic Dashboard</div>
              <div className={styles.toolingItem}><Icon col={0} row={0} size={20} />Automated Multi-step Fixes</div>
              <div className={styles.toolingItem}><Icon col={1} row={1} size={20} />DORA: Failure Rate is VOLATILE</div>
            </div>

            <div className={styles.concepts}>
              <span>AI-Augmented Testing</span>
              <span>Automated Reasoning</span>
              <span>Feedback Loop</span>
            </div>
          </section>
        </div>

        <div className={styles.conclusion}>
          <p>
            <strong>Strategic Conclusion:</strong> The "Middle" is now invisible infrastructure.
            The Workspace is the <span className={styles.highlight}>NEW COMPILER</span>, turning human intent into agent instructions.
          </p>
          <div className={styles.flow}>Human Intent → Agentic Execution</div>
        </div>
      </div>

      <BottomBar text="DevEx Keynote" />
    </Slide>
  )
}
