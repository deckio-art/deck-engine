import { useEffect } from "react";
import {
  InlineEditProvider,
  Navigation,
  SlideErrorBoundary,
  SlideProvider,
} from "@deckio/deck-engine";
import project from "../deck.config.js";

const overrides = {};

export default function App() {
  const { accent, id, slides, theme, title, hiddenSlides } = project;

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", accent);
    document.title = title;
  }, [accent, title]);

  return (
    <InlineEditProvider overrides={overrides} project={id}>
      <SlideProvider
        totalSlides={slides.length}
        project={id}
        slides={slides}
        theme={theme}
        hiddenSlides={hiddenSlides}
      >
        <Navigation />
        <div className="deck" data-project-id={id}>
          {slides.map((SlideComponent, index) => (
            <SlideErrorBoundary key={`${id}-slide-${index}`} index={index}>
              <SlideComponent index={index} project={project} />
            </SlideErrorBoundary>
          ))}
        </div>
      </SlideProvider>
    </InlineEditProvider>
  );
}
