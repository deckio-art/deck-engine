import { useEffect, useState } from 'react'
import ProjectPicker from './ProjectPicker'
import { getProjects } from './utils/projectRegistry'

const FIXED_PROJECT = import.meta.env.VITE_PROJECT || null

function resetStoredSlide(projectId) {
  try {
    sessionStorage.removeItem(`slide:${projectId}`)
    return true
  } catch {
    return false
  }
}

const projectApps = new Map(
  getProjects().map(project => [project.id, project.component]),
)
const LOCKED_PROJECT = projectApps.has(FIXED_PROJECT) ? FIXED_PROJECT : null

function getRoute() {
  if (LOCKED_PROJECT) return LOCKED_PROJECT

  const hash = window.location.hash.replace(/^#\/?/, '')
  if (projectApps.has(hash)) return hash

  return null
}

export default function AppShell() {
  const [route, setRoute] = useState(getRoute)

  useEffect(() => {
    if (LOCKED_PROJECT) {
      window.location.hash = `#/${LOCKED_PROJECT}`
    }
  }, [])

  useEffect(() => {
    if (LOCKED_PROJECT) return

    const onHash = () => {
      const next = getRoute()

      if (next) {
        resetStoredSlide(next)
      }

      setRoute(next)
    }

    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  useEffect(() => {
    if (!route || LOCKED_PROJECT) return

    const onKey = event => {
      if (event.key !== 'Escape') return

      event.preventDefault()
      window.location.hash = ''
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [route])

  const ActiveProject = route ? projectApps.get(route) : null

  if (ActiveProject) {
    return <ActiveProject />
  }

  return <ProjectPicker />
}

