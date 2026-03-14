# Project Context

- **Owner:** Ali Soliman
- **Project:** DECKIO / deck-engine — a presentation engine and scaffolder for creating beautiful, Copilot-powered slide decks
- **Stack:** Node.js monorepo (npm workspaces), Vite, HTML/CSS/JS, packages: `@deckio/deck-engine` and `@deckio/create-deck-project`
- **Created:** 2026-03-13

## Core Context

These are summarized key learnings from early sessions (2026-03-13 → 2026-03-14) that set the foundation:

1. **Dev Workflow + Infrastructure:** Phase 1 complete — root scripts added (dev/build/test/lint), Vitest workspace tests, prepublishOnly gate on engine tests. `capture-screen.mjs` cross-platform. Export logic consolidated. Foundation for downstream tooling work.

2. **Browser/Node Boundary:** Critical lesson: never re-export Node.js-only modules from main browser entry (`index.js`). Dev server hides mistakes; Rollup production build enforces the boundary. Engine `index.js` is browser-safe; Node.js utilities live in `vite.js` and `themes/theme-loader.js`. Enforced at exports map level.

3. **Scaffolder Best Practices:** Two critical bugs taught lasting lessons: (1) Never hardcode dependency versions in templates — always read from source `package.json` at scaffold time. For local dev, use `file:` protocol refs. (2) Unit tests are insufficient — full E2E gate is required: scaffold → npm install → dev server → production build. Dev mode masks Node.js module boundary violations.

4. **Theme Architecture + Tailwind Integration:** Installed Tailwind CSS v4, created `themes/` directory with pluggable CSS-only theme system. Vite plugin exports `deckPlugin()`, `deckPlugins()` (combo), `tailwindPlugin()`. Theme loader provides `resolveTheme()` and `getAvailableThemes()`. Each theme = CSS file with `@import "tailwindcss"`, `:root` properties, and `@theme inline` bridge. No runtime JS involvement.

5. **shadcn/ui + Design System Integration:** Added opt-in `designSystem` field (separate from `theme` axis). When enabled: `components.json`, `jsconfig.json`, `@/*` alias, `src/lib/utils.js`, `ThemeProvider`, `.dark` mode support. Pre-generate files instead of running interactive `npx shadcn init`. All scaffolded artifacts generated deterministically (not interactive CLI dependencies).

6. **File Pre-generation Strategy:** Proven effective across multiple areas — shadcn artifacts, `.vscode/mcp.json`, `components.json` — makes scaffolded projects deterministic and faster. Pattern extends to theme creator design (next).

## Learnings

<!-- Detailed session work below. Append new learnings as work progresses. -->
- **Phase 1 Dev Workflow (done):** Root scripts added (dev/build/test/lint) via npm workspace delegation. Engine ships raw .jsx — no build step needed, `build` uses `--if-present`. `prepublishOnly` added to engine. Scaffolder pinned engine dep `^1.7.7` → `^1.8.2`. `capture-screen.mjs` was Windows-only (hardcoded Edge path) — now cross-platform. Stale `.tgz` removed and `*.tgz` added to `.gitignore`. Key paths: root `package.json` (scripts), `packages/deck-engine/package.json` (prepublishOnly), `packages/deck-engine/scripts/capture-screen.mjs` (browser detection).
- **Critical Bug Fix: Production build "dirname" error (2026-03-14):** `index.js` re-exported Node.js-only modules. Rollup can't resolve `fs`/`path` browser-side. Fix: removed browser-unsafe re-exports, moved to `vite.js`. Key lesson: browser/Node boundary enforced at exports map, not import order.
- **Critical Bug Fix: Scaffolder version drift / ETARGET (2026-03-14):** Hardcoded version in template failed npm install. Fix: `resolveEngineRef()` reads live version from engine `package.json`. For local dev, use `file:` protocol. Key lesson: never hardcode versions.
- **shadcn/ui Design System Integration (2026-03-14):** Added opt-in `designSystem` field, separate from `theme`. Pre-generates `components.json`, `jsconfig.json`, `@/*` alias. Key lesson: `npx shadcn init` is interactive and fragile; pre-generation is more reliable.
- **Dark/Light Mode + Appearance Field (2026-03-15):** `shadcn.css` supports `.dark` class. Added `appearance` parameter to `deckConfig()` so skills know the deck's mode. Removed ModeToggle — appearance is a scaffold-time choice, not a runtime toggle.
- **File Pre-generation Pattern (2026-03-15):** Strategy proven: `.vscode/mcp.json`, `vscodeMcpConfig()`, pre-generated instead of `npx shadcn mcp init`. Pattern extends to theme creator.
- **Scaffolder Pipeline Verification (2026-03-15):** Added `copyEngineAssets()` to scaffold skills/instructions before npm install. Skills now available even if npm fails. Descriptor exports added to engine.
- **Theme Creator Feasibility Analysis (2026-03-15):** Analyzed theme pipeline — pure CSS, no JS. Architecture supports "drop a CSS file" already. `@deckio/create-theme` package (new workspace) recommended — cleanest boundary, keeps engine browser-safe. Theme = CSS + descriptor `.md` + optional preview PNG. Standalone CLI (pre-dev), not build-time or runtime. Top risk: token contract drift (84 properties must all exist). Mitigation: canonical token schema + Vitest contract test. Secondary risks: `@layer` in generated CSS, `@theme inline` typos.
- **Theme Creator Architecture Finalized + Implementation Planning (2026-03-14):** Architecture locked. ARCH-004 filed. (1) `@deckio/create-theme` package adopted. (2) Pre-generation file strategy extends to theme creator. (3) Theme format: CSS + descriptor `.md` + preview PNG. (4) Token contract as highest risk — mitigation: canonical list + Vitest test. (5) CSS layer risks: never emit `@layer`, use constant `@theme inline` template. (6) Standalone CLI workflow. (7) Dual-export: v1 local decks, v2 curated (same compiler targets both). (8) Validation: required gates + warnings. Canonical preview mandatory. (9) Integration: thin scaffolder calls, engine stays agnostic, skills resolve local descriptors. Implementation: 8-phase order (token → preview → compiler → validation → local → brand → v2 prep).
- **shadcn Component Integration — Phase 0 Scoping (2026-03-14T01:08Z):** Owner directive clarified: shadcn must be REAL component integration, not visual imitation. Rusty scoped 4-phase plan (Phase 0 contract cleanup → Phase 1 starter components → Phase 2 descriptors/skills → Phase 3 scaffolder polish → Phase 4 MCP). Owner answered 7 open questions: (1) Starter set = Button, Card, Badge, Separator, Alert + ReactBits; (2) Design system axis = `designSystem: 'shadcn'` independent of theme; (3) Component-native slides = yes, less bespoke CSS; (4) Pre-scaffold approach = deterministic source for starters, CLI/MCP for expansion; (5) Deck-friendly wrappers = yes (implied); (6) MCP authoring = core promoted workflow (implied); (7) Design-system supplement layer = yes, now (implied). SHADCN-001 filed in decisions. Basher + Livingston need to align on Phase 1 CLI requirements (shadcn add, environment detection, config setup). 5 GitHub issues created (#10-#14) for phased delivery.
