import { Navigation, SlideProvider } from '@lopezleandro03/canvas-engine'
import CoverSlide from './CoverSlide'
import AgenticEvolutionSlide from './AgenticEvolutionSlide'
import VibeCodingSlide from './VibeCodingSlide'
import AbstractionLadderSlide from './AbstractionLadderSlide'
import AbstractionLadderDiagramSlide from './AbstractionLadderDiagramSlide'
import TurboPascalSlide from './TurboPascalSlide'
import PriyankaInfographicSlide from './PriyankaInfographicSlide'
import SpecDrivenSlide from './SpecDrivenSlide'
import SpecificationSlide from './SpecificationSlide'
import OneESPlatformSlide from './OneESPlatformSlide'
import GenericThankYouSlide from '@lopezleandro03/canvas-engine/slides/GenericThankYouSlide'

const TOTAL = 11

export default function NordcloudDevdayApp() {
  return (
    <SlideProvider totalSlides={TOTAL} project="nordcloud-devday">
      <Navigation pdfPath="/exports/nordcloud-devday-slides.pdf" pdfLabel="nordcloud-devday deck PDF" />
      <div className="deck">
        <CoverSlide />
        <AgenticEvolutionSlide index={1} />
        <VibeCodingSlide index={2} />
        <TurboPascalSlide index={3} />
        <AbstractionLadderSlide index={4} />
        <AbstractionLadderDiagramSlide index={5} />
        <SpecificationSlide index={6} />
        <SpecDrivenSlide index={7} />
        <PriyankaInfographicSlide index={8} />
        <OneESPlatformSlide index={9} />
        <GenericThankYouSlide index={10} tagline="Nordcloud Developer Day 2026" footerText="Nordcloud Developer Day" />
      </div>
    </SlideProvider>
  )
}
