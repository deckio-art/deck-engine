import { Navigation, SlideProvider } from '@lopezleandro03/canvas-engine'
import CoverSlide from './CoverSlide'
import ButterflyArtSlide from './ButterflyArtSlide'
import HourglassSlide from './HourglassSlide'
import AlignmentGapSlide from './AlignmentGapSlide'
import AVDOpportunitySlide from './AVDOpportunitySlide'
import ThankYouSlide from '@lopezleandro03/canvas-engine/slides/GenericThankYouSlide'

const TOTAL = 6

export default function DevRandomApp() {
  return (
    <SlideProvider totalSlides={TOTAL} project="dev-random">
      <Navigation pdfPath="/exports/dev-random-slides.pdf" pdfLabel="dev-random deck PDF" />
      <div className="deck">
        <CoverSlide />
        <ButterflyArtSlide index={1} />
        <HourglassSlide index={2} />
        <AlignmentGapSlide index={3} />
        <AVDOpportunitySlide />
        <ThankYouSlide index={5} tagline="dev-random · 2026" footerText="dev-random" />
      </div>
    </SlideProvider>
  )
}
