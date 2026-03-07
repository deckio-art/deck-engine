import photoPascal from './speakers/Pascal.png'
import photoGerald from './speakers/Gerald.png'
import photoEduard from './speakers/Eduard.png'
import photoAnton from './speakers/Anton.png'
import photoAli from './speakers/Ali.png'
import photoSimona from './speakers/Simona.png'

const ghIcon = (
  <svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
    <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
  </svg>
)

const msIcon = (
  <svg width="12" height="12" viewBox="0 0 23 23" fill="currentColor">
    <path d="M0 0h11v11H0zM12 0h11v11H12zM0 12h11v11H0zM12 12h11v11H12z" />
  </svg>
)

const speakers = [
  { initials: 'AS', name: 'Ali Soliman', title: 'Applied AI, Microsoft CoreAI', topic: 'Agents & Agent Skills for Azure AI Foundry', desc: 'Leveraging autonomous agents and composable skills to build Azure AI Foundry features from the inside.', avatarColor: 'purple', bgIndex: 2, org: 'Microsoft', orgClass: 'ms', icon: msIcon, photo: photoAli },
  { initials: 'EV', name: 'Eduard van Valkenburg', title: 'Sr. Software Engineer, Microsoft CoreAI', topic: 'Building MAF with Agents', desc: 'Sr. Engineer behind the Microsoft Agent Framework — building the agent framework that powers AI agents, using agents.', avatarColor: 'green', bgIndex: 4, org: 'Microsoft', orgClass: 'ms', icon: msIcon, photo: photoEduard },
  { initials: 'GV', name: 'Gerald Versluis', title: 'Sr. Software Engineer, .NET Core Framework', topic: 'Copilot CLI & Agent Fleet', desc: 'Commanding a fleet of agents via Copilot CLI to build the .NET MAUI framework itself at machine speed.', avatarColor: 'cyan', bgIndex: 3, org: 'Microsoft', orgClass: 'ms', icon: msIcon, photo: photoGerald },
  { initials: '?', name: 'TBD — GitHub Engineer', title: 'Software Engineer, GitHub', topic: 'Agentic Workflows & SDLC Transformation', desc: 'Copilot CLI, agentic workflows, and how AI is fundamentally reshaping the software development lifecycle.', avatarColor: 'blue', bgIndex: 1, org: 'GitHub', orgClass: 'gh', icon: ghIcon, photo: null },
  { initials: '?', name: 'TBD — Microsoft Engineer', title: 'Sr. Engineer, Microsoft', topic: 'Spec Driven Development', desc: 'From requirements to production code — spec-first engineering powered by frameworks like SpecKit and OpenSpec.', avatarColor: 'cyan', bgIndex: 3, org: 'Microsoft', orgClass: 'ms', icon: msIcon, photo: null },
  { initials: '?', name: 'TBD — GitHub Engineer', title: 'Sr. Engineer, GitHub', topic: 'AgentHQ — The Home of Coding Agents', desc: 'Inside AgentHQ: the single pane of glass for every coding agent — manage, orchestrate, and scale.', avatarColor: 'green', bgIndex: 4, org: 'GitHub', orgClass: 'gh', icon: ghIcon, photo: null },
]

export default speakers
