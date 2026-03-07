import GenericThankYouSlide from '@lopezleandro03/canvas-engine/slides/GenericThankYouSlide'

export default function ThankYouSlide({ index = 1, title }) {
  return (
    <GenericThankYouSlide
      index={index}
      subtitle={<>Thanks for building with the canvas engine.</>}
      tagline={`${title} · contributor starter`}
      footerText={title}
    />
  )
}
