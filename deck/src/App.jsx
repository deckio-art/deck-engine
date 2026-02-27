import { useState, useEffect } from 'react'
import ProjectPicker from './ProjectPicker'
import GhcpApp from './GhcpApp'
import DevPlanApp from './projects/dev-plan/DevPlanApp'

function getRoute() {
  const hash = window.location.hash.replace('#/', '')
  if (hash === 'ghcp') return 'ghcp'
  if (hash === 'dev-plan') return 'dev-plan'
  return null
}

export default function App() {
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    const onHash = () => setRoute(getRoute())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  // Allow Escape to return to picker from any project
  useEffect(() => {
    if (!route) return
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault()
        window.location.hash = ''
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [route])

  if (route === 'ghcp') return <GhcpApp />
  if (route === 'dev-plan') return <DevPlanApp />
  return <ProjectPicker />
}
