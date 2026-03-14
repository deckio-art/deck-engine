# Project Context

- **Owner:** Ali Soliman
- **Project:** DECKIO / deck-engine — a presentation engine and scaffolder for creating beautiful, Copilot-powered slide decks
- **Stack:** Node.js monorepo (npm workspaces), Vite, HTML/CSS/JS, packages: `@deckio/deck-engine` and `@deckio/create-deck-project`
- **Created:** 2026-03-13

## Learnings

<!-- Append new learnings below. Each entry is something lasting about the project. -->
- Theme creator v1 should live as authoring-time tooling with a separate package/library boundary; the runtime contract stays `theme CSS + descriptor`, and scaffolder integration should stay thin.
- Generated themes need atomic CSS+descriptor export plus deterministic validation; visual theme choice must stay separate from `designSystem` compatibility, or the authoring contract will lie to users and tools.
- The monorepo is intentionally minimal: root npm workspaces only, with two publishable packages — `@deckio/deck-engine` (runtime, styles, scripts, Copilot assets) and `@deckio/create-deck-project` (CLI scaffolder that generates deck projects and then runs engine bootstrap).
- `@deckio/deck-engine` is a thin React 19 presentation runtime: `SlideProvider` owns navigation state and persistence, `Slide` handles active/exit rendering plus dev overflow warnings, `Navigation` owns progress/export chrome, and `global.css` supplies the shared token system and slide shell primitives.
- The Vite integration point is small but critical: `packages/deck-engine/vite.js` dedupes `react` and `react-dom` so package subpath imports still share a single `SlideContext` instance.
- Copilot integration is file-driven, not code-plugin-driven: the engine ships `skills/`, `instructions/`, and `AGENTS.md`, and `scripts/init-project.mjs` copies them into a generated deck’s `.github/` and root files while also bootstrapping `.github/memory/state.md` and VS Code Simple Browser settings.
- Export is screenshot-first in both browser and CLI flows: in-app PDF/PPTX export captures each rendered slide with `modern-screenshot`, while the CLI PDF exporter drives a deck through Puppeteer and assembles a PDF from screenshots.
- There is no generalized runtime plugin API yet; extensibility today comes from composing React slides/components, overriding `--accent`, using `useSlides()`/`selectedCustomer`, passing `Navigation` export props, and adding more Copilot skills/instructions.
- The engine is already theme-adjacent but not yet theme-ready: styling is centralized around `styles/global.css` plus a few CSS modules, and the only runtime visual override today is `--accent` set by scaffolded `src/App.jsx`.
- A clean multi-theme system should build on semantic CSS variables and a named theme field in `deck.config.js`; bolting multiple presets onto the current raw token set would work short-term, but it would lock Phase 2 into the current dark palette assumptions and hardcoded decorative color relationships.
- The current “theme” system is intentionally skin-deep: built-in themes are just CSS files under `packages/deck-engine/themes/` that expose the same semantic token contract and Tailwind bridge, while downstream decks still author raw slide JSX + CSS Modules. There is no component-library abstraction yet.
- The scaffolder is not ready for full shadcn/ui onboarding: generated decks get Tailwind v4 and a theme CSS import, but no `components.json`, no `@` alias in `vite.config.js`, no `src/lib/utils`, and no shadcn dependency graph. Also, scaffolded `App.jsx` does not pass `project.theme` into `SlideProvider`, so runtime theme context is effectively unused today.
- Making DECKIO “multi-design-system” would change the product boundary from “presentation runtime with pluggable visual themes” to “presentation runtime plus opt-in app-style component ecosystems.” If pursued, it should be framed as a separate adapter layer and kept strictly optional so the default engine stays lean.
- Issue #2 landed through PR #3 plus follow-up commit `8c117c9`; the scaffolder lives in `packages/create-deckio/` even though the published package is `@deckio/create-deck-project`.
- The current create-deckio bootstrapping UX is materially better because `packages/create-deckio/index.mjs` keeps one `@clack/prompts` spinner alive across install/init with async `exec`, but the failure path still prints `✦ Ready!` after `npm install` fails and the “Design system” picker still mixes in `funky-punk`, which is really a theme choice.

- Theme creation in DECKIO should stay authoring-time, not runtime: the stable output contract is still `theme CSS + descriptor`, and generated themes should be portable enough to drop into the existing `themes/` + `themes/descriptors/` structure with no engine changes.
- The built-in themes already define the right archetypes for future generation work: dark, light, shadcn, and funky-punk prove that DECKIO themes are more than palette swaps, but the safe way to scale them is a deterministic token compiler plus bounded style modules, not raw freeform AI CSS.
- Final theme creator architecture is maintainer-first and local-export-first: build `@deckio/create-theme` as authoring-time tooling, keep runtime output to canonical theme CSS + descriptor, require a preview build before export, and enforce WCAG AA on critical token pairs while treating broader checks as warnings.
