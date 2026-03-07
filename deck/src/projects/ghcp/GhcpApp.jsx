import { Navigation, SlideProvider } from '@lopezleandro03/canvas-engine'
import {
  AgendaSlide,
  AppendixEmailSlide,
  ApproachSlide,
  CoverSlide,
  CustomerCommitmentSlide,
  CustomerCoverSlide,
  CustomerGoalsSlide,
  CustomerIntroSlide,
  CustomerNextStepsSlide,
  GovernanceSlide,
  IntentSlide,
  OpportunitySlide,
  OpportunitySlideV2,
  PresentersSlide,
  ScopeSlide,
  SelectorSlide,
  SpeakerInviteSlide,
  ThankYouSlide,
} from './'

const TOTAL = 21
const INTERNAL_PDF_URL = 'https://microsofteur-my.sharepoint.com/:b:/g/personal/leandrolopez_microsoft_com/IQD4hQcOGVG8SpoqAAiCau_wAdwtd4zs0WsF5_VPwcy5x1M?e=M40yuI'

function getCustomerPdfUrl(selectedCustomer) {
  return selectedCustomer
    ? `/exports/${selectedCustomer.name.toLowerCase().replace(/\s+/g, '-')}-slides.pdf`
    : null
}

function getPdfPath({ current, selectedCustomer }) {
  if (current >= 1 && current <= 11) return INTERNAL_PDF_URL
  if (current >= 12 && current <= 20) return getCustomerPdfUrl(selectedCustomer)
  return null
}

function getPdfLabel({ current, selectedCustomer }) {
  if (current >= 1 && current <= 11) return 'Internal deck PDF'
  if (current >= 12 && current <= 20) {
    return selectedCustomer ? `${selectedCustomer.name} deck PDF` : 'Deck PDF'
  }

  return 'Deck PDF'
}

export default function GhcpApp() {
  return (
    <SlideProvider totalSlides={TOTAL} project="ghcp">
      <Navigation pdfPath={getPdfPath} pdfLabel={getPdfLabel} />
      <div className="deck">
        <SelectorSlide />
        <CoverSlide />
        <AgendaSlide />
        <OpportunitySlide />
        <OpportunitySlideV2 />
        <IntentSlide />
        <ScopeSlide />
        <ApproachSlide />
        <PresentersSlide />
        <GovernanceSlide />
        <ThankYouSlide />
        <SpeakerInviteSlide />
        <CustomerCoverSlide />
        <CustomerIntroSlide />
        <CustomerGoalsSlide />
        <ApproachSlide index={15} />
        <PresentersSlide index={16} />
        <CustomerCommitmentSlide />
        <CustomerNextStepsSlide />
        <ThankYouSlide index={19} />
        <AppendixEmailSlide />
      </div>
    </SlideProvider>
  )
}
