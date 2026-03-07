import { Navigation, SlideProvider } from '@lopezleandro03/canvas-engine'
import CoverSlide from './CoverSlide'
import ObjectiveSlide from './ObjectiveSlide'
import TimelineSlide from './TimelineSlide'
import SessionsSlide from './SessionsSlide'
import CoachingTeamSlide from './CoachingTeamSlide'
import TestFlightTeamSlide from './TestFlightTeamSlide'
import CertificationsSlide from './CertificationsSlide'
import AppendixSlide from './AppendixSlide'
import ThankYouSlide from '@lopezleandro03/canvas-engine/slides/GenericThankYouSlide'

const TOTAL = 9

export default function DevPlanApp() {
  return (
    <SlideProvider totalSlides={TOTAL} project="dev-plan">
      <Navigation pdfPath="/exports/dev-plan-slides.pdf" pdfLabel="dev-plan deck PDF" />
      <div className="deck">
        <CoverSlide />
        <ObjectiveSlide />
        <SessionsSlide />
        <TimelineSlide />
        <CoachingTeamSlide />
        <TestFlightTeamSlide />
        <AppendixSlide />
        <CertificationsSlide />
        <ThankYouSlide index={8} tagline="Dilruba Turan · Aspire Development Plan · 2026" footerText="Aspire Development Plan · Dilruba Turan" />
      </div>
    </SlideProvider>
  )
}
