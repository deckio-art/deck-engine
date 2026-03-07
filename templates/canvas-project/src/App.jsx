import { useEffect } from 'react'
import { Navigation, SlideProvider } from '@lopezleandro03/canvas-engine'
import project from '../canvas.config.js'

export default function App() {
  const { accent, id, slides, subtitle, title } = project

  useEffect(() => {
    const root = document.documentElement
    const previousAccent = root.style.getPropertyValue('--accent')

    document.title = title
    root.style.setProperty('--accent', accent)

    return () => {
      if (previousAccent) {
        root.style.setProperty('--accent', previousAccent)
      } else {
        root.style.removeProperty('--accent')
      }
    }
  }, [accent, title])

  return (
    <SlideProvider totalSlides={slides.length} project={id}>
      <Navigation />
      <div className="deck" data-project-id={id}>
        {slides.map((SlideComponent, index) => (
          <SlideComponent
            key={`${id}-slide-${index}`}
            index={index}
            project={project}
            title={title}
            subtitle={subtitle}
          />
        ))}
      </div>
    </SlideProvider>
  )
}
