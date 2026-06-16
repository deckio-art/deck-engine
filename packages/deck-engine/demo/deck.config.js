import {
  GenericAgendaSlide,
  GenericGoalsSlide,
  GenericStepsSlide,
  GenericThankYouSlide,
  GenericTwoOptionsSlide,
} from "@deckio/deck-engine";

export default {
  id: "deck-engine-demo",
  title: "DECKIO Engine Demo",
  subtitle: "A small local preview for the package workspace.",
  description: "A small local preview for the package workspace.",
  icon: "🎴",
  accent: "#06b6d4",
  theme: "dark",
  order: 1,
  hiddenSlides: [],
  slides: [
    GenericAgendaSlide,
    GenericGoalsSlide,
    GenericTwoOptionsSlide,
    GenericStepsSlide,
    GenericThankYouSlide,
  ],
};
