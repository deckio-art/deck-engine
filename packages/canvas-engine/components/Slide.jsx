import { useSlides } from '../context/SlideContext'

export default function Slide({ index, className = '', children }) {
  const { current } = useSlides()

  let stateClass = ''
  if (index === current) stateClass = 'active'
  else if (index < current) stateClass = 'exit-left'

  return (
    <div className={`slide ${stateClass} ${className}`} data-slide={index}>
      {children}
    </div>
  )
}
