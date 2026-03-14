# Squad Decisions

## Active Decisions

---

### DEV-001: Dev Workflow Conventions
**Author:** Basher | **Date:** 2026-03-13 | **Status:** Implemented

1. **Root scripts delegate via npm workspaces** — `dev` and `build` target `@deckio/deck-engine`; `test` and `lint` use `--workspaces --if-present` to broadcast.
2. **No build step for the engine** — ships raw `.jsx`; `build` uses `--if-present` (no-op until needed).
3. **`prepublishOnly` gates on tests** — `npm test --if-present` in the engine. Enforced once tests exist (now they do).
4. **`.tgz` files in `.gitignore`** — never commit pack artifacts.
5. **Cross-platform browser detection in `capture-screen.mjs`** — auto-detects Edge or Chrome on Windows, macOS, Linux.
6. **Scaffolder engine dep stays current** — bumped `^1.7.7` → `^1.8.2` to reflect actual engine version.

---

### TEST-001: Vitest Workspace Test Harness
**Author:** Linus | **Date:** 2026-03-13 | **Status:** Implemented

1. **Vitest 4.x at root** with `vitest.workspace.js` pointing at `packages/*`. Each package has its own `vitest.config.js`.
2. **Root `npm test`** → `npx vitest run` (runs all workspace tests).
3. **Extracted `utils.mjs`** from `create-deckio/index.mjs` — CLI entry auto-runs `main()` on import; pure logic must be exported from a utilities module for testability.
4. **Tests live in** `packages/<pkg>/__tests__/*.test.js`.
5. **Phase 2 React component tests** will need `@vitejs/plugin-react` + jsdom environment in deck-engine's vitest config.

---

### DESIGN-001: Design Token Audit Findings
**Author:** Saul | **Date:** 2026-03-13 | **Status:** Informational — feeds Phase 2

1. **Token coverage minimal** — 16 custom properties (14 color, 2 layout). Zero typography/spacing/radius/z-index/transition tokens.
2. **3 unused tokens** — `--blue-bright`, `--purple-deep`, `--orange` defined but never consumed.
3. **`--blue-glow` bypassed 6×** — raw `rgba(31,111,235,...)` hardcoded instead of using the token.
4. **`ThankYouSlide.module.css` is dead code** — 132 lines, not imported anywhere.
5. **Hardcoded colors need tokens** — `#f85149` error red (2 places), translucent surface rgba (4 places).
6. **No accessibility foundations** — no `focus-visible` styles, no `prefers-reduced-motion` queries.
7. Full audit at `.squad/agents/saul/design-token-audit.md`.

---

---

### 2026-03-13T01:15:00Z: User Directive — Theme System Scope
**By:** Ali Soliman (via Copilot) | **Date:** 2026-03-13 | **Status:** Implemented

Phase 2 will include a pluggable theme system with 3 initial themes (current dark, light, shadcn-inspired). Themes should use actual shadcn/Tailwind token values — not just CSS variable maps. Design tokens must be codified first. Theme picker added to CLI onboarding. Architecture must support future community/pluggable themes.

---

### ARCH-001: Theme System Scope
**Author:** Rusty | **Date:** 2026-03-13 | **Status:** Implemented

1. **Semantic token contract defined before theme expansion** — tokens codified first (DESIGN-002), then themes built on top. Contract is the stable interface.
2. **Three initial theme presets** — dark (default, original aesthetic), light (projection-optimized), shadcn (oklch values, editorial-neutral). New themes = drop a CSS file.
3. **Shadcn as visual language, not dependency** — neutral surfaces, clean typography, subtle borders, moderate radius, restrained accent. No shadcn component imports.
4. **`accent` overrides within themes, not replaces them** — per-deck color customization lives inside a selected theme.
5. **No runtime plugin system in Phase 2** — config-driven CSS variable approach sufficient. Plugin system deferred to later phase.
6. **Theme choice affects tokens and component chrome only** — slide content structure unchanged by theme selection.

---

### THEME-001: Tailwind CSS v4 + Pluggable Theme Architecture
**Author:** Basher | **Date:** 2026-03-13 | **Status:** Implemented

1. **Tailwind CSS v4 installed** — `tailwindcss` + `@tailwindcss/vite` as dependencies in deck-engine. Downstream projects get them as devDependencies via the scaffolder.
2. **Vite plugin expanded** — `vite.js` exports three functions:
   - `deckPlugin(options)` — core plugin (react dedup), accepts `{ theme }` option
   - `deckPlugins(options)` — combo array: deckPlugin + @tailwindcss/vite sub-plugins
   - `tailwindPlugin()` — standalone @tailwindcss/vite for manual composition
3. **Theme system is CSS-file-based** — each theme is a `.css` file in `packages/deck-engine/themes/`. Contains `:root` CSS custom properties + `@theme inline` block that bridges them to Tailwind utility classes. Adding a theme = drop a CSS file.
4. **Three built-in themes** — `dark.css` (original DECKIO aesthetic), `light.css` (projection-optimized), `shadcn.css` (exact shadcn/ui oklch values + card/popover/chart extras).
5. **Theme loader** (`themes/theme-loader.js`) — `resolveTheme(name)` resolves name to absolute CSS path, `getAvailableThemes()` reads directory listing. Supports custom paths (ending in `.css`). Unknown theme names silently return non-existent path (by design, allows custom themes — consumers check `existsSync()`).
6. **`deck.config.js` schema updated** — new `theme` field, defaults to `'dark'` for backwards compatibility.
7. **CLI onboarding** — theme prompt added after accent color: "Theme (dark / light / shadcn)". Validates input, falls back to "dark". Non-interactive mode reads `DECK_THEME` env var.
8. **Generated projects are Tailwind-ready** — `main.jsx` imports `@deckio/deck-engine/themes/{theme}.css`, `vite.config.js` includes `tailwindPlugin()`, `package.json` includes tailwindcss devDeps.
9. **Backwards compatible** — decks without a `theme` field still work (dark is the default everywhere).

**Key files:**
- `packages/deck-engine/vite.js` — plugin exports
- `packages/deck-engine/themes/` — theme CSS files + loader
- `packages/deck-engine/index.js` — re-exports theme functions
- `packages/create-deckio/utils.mjs` — deckConfig with theme param
- `packages/create-deckio/index.mjs` — CLI theme picker + vite config template

---

### DESIGN-002: Design Token System Codified
**Author:** Saul | **Date:** 2026-03-13 | **Status:** Implemented

1. **Token naming follows shadcn/ui conventions** — `--background`, `--foreground`, `--primary`, `--secondary`, `--muted`, `--accent`, `--destructive`, `--border`, `--input`, `--ring`, `--radius`, `--card` + `-foreground` variants. Engine CSS and all 3 theme files aligned.
2. **9 token categories in global.css** — Core semantic colors, decorative palette, derived overlays & glows, presentation layout, typography scale (font sizes 2xs→display, weights, letter-spacing, line-height), spacing scale (4px base, 15 steps), border radius, z-index, transitions. Documentation comment at top of file.
3. **Token renames (breaking):**
   - `--bg-deep` → `--background`
   - `--bg` → `--card`
   - `--text` → `--foreground`
   - `--text-muted` → `--muted-foreground`
   - `--surface` → `--secondary`
   - All references updated across engine CSS, export scripts, scaffolder, and theme files.
4. **Removed tokens:** `--blue-bright` and `--orange` (genuinely unused). Kept `--purple-deep` (consumed by scaffolder inline template).
5. **Zero hardcoded colors in component CSS** — All raw `rgba()` and hex values in rule bodies replaced with token references. Raw values only appear in `:root` token definitions.
6. **Dead CSS deleted** — `ThankYouSlide.module.css` (132 lines, not imported anywhere).
7. **All 49 tests pass** — no regressions at time of token work.

**Warning:** Always check JS template strings when auditing token usage, not just CSS files. `--purple-deep` appeared unused in CSS audit but is consumed by `create-deckio/index.mjs` line ~166.

---

### THEME-002: Theme Descriptor Architecture
**Author:** Rusty | **Date:** 2026-03-15 | **Status:** Implemented

1. **Theme authoring is descriptor-driven** — built-in themes no longer rely on hardcoded prose inside every skill. Each theme ships a dedicated authoring contract at `packages/deck-engine/themes/descriptors/<theme>.md`.
2. **Built-in descriptors are first-class package assets** — `dark.md`, `light.md`, and `shadcn.md` live beside the theme CSS and are exported from `@deckio/deck-engine` for downstream decks and tools.
3. **New themes scale without skill edits** — adding a theme means adding its CSS plus a descriptor file. Custom/on-demand themes can ship their own local descriptor and plug into the same workflow.
4. **`designSystem` remains the safety rail, not the source of visual truth** — skills resolve the descriptor from `theme`, then use `designSystem` only to cross-check for structural mismatches.

**Key files:**
- `packages/deck-engine/themes/descriptors/dark.md`
- `packages/deck-engine/themes/descriptors/light.md`
- `packages/deck-engine/themes/descriptors/shadcn.md`

---

### SKILL-001: Theme-Aware Skills
**Author:** Rusty | **Date:** 2026-03-15 | **Status:** Implemented

1. **Skills now start from project config** — Step 0 reads `deck.config.js`, captures `theme` and `designSystem`, and resolves the active descriptor before any slide work begins.
2. **Descriptor rules replaced hardcoded theme sections** — the old Section A–D / Section S split is gone. Skills follow the resolved descriptor exactly for JSX skeletons, CSS skeletons, tokens, components, and anti-patterns.
3. **The whole authoring toolchain was updated** — `deck-add-slide`, `deck-validate-project`, `deck-inspect`, `deck-sketch`, and `deck-generate-image` all use the same descriptor-resolution procedure.
4. **Skills are written for AI coding CLIs** — they are executable behavioral procedures with explicit steps and guardrails, not human-oriented narrative docs.

**Key files:**
- `packages/deck-engine/skills/deck-add-slide/SKILL.md`
- `packages/deck-engine/skills/deck-validate-project/SKILL.md`
- `packages/deck-engine/skills/deck-inspect/SKILL.md`
- `packages/deck-engine/skills/deck-sketch/SKILL.md`
- `packages/deck-engine/skills/deck-generate-image/SKILL.md`

---

### SCAFFOLD-001: Scaffolder Copies Engine Assets
**Author:** Basher | **Date:** 2026-03-15 | **Status:** Implemented

1. **`copyEngineAssets(dir)` runs before npm install** — the scaffolder copies skills, instructions, and `AGENTS.md` into the generated deck before dependency installation starts.
2. **The copy step is resilient to install failures** — Copilot assets remain available even if `npm install` fails, while `init-project.mjs` still re-syncs stateful project files after install.
3. **Descriptor files are reachable from generated decks** — built-in descriptors resolve through the local `node_modules/@deckio/deck-engine/themes/descriptors/*` path, including `file:` protocol symlink installs.
4. **The engine package explicitly exports descriptors** — `package.json` includes `"./themes/descriptors/*"` so tools can read them without private path hacks.

**Key files:**
- `packages/create-deckio/index.mjs` — `copyEngineAssets()`
- `packages/deck-engine/package.json` — descriptor export
- `packages/deck-engine/scripts/init-project.mjs` — post-install sync

---

### THEME-003: SlideContext Theme Integration
**Author:** Livingston | **Date:** 2026-03-14 | **Status:** Implemented

1. **`SlideProvider` accepts `theme` prop** — passed to context, sets initial theme state.
2. **`data-theme` attribute on `document.documentElement`** — CSS authors scope per-theme rules with `[data-theme="light"]` selectors without modifying theme CSS files.
3. **Context exposes `theme` and `setTheme`** — consumer components can read active theme and switch at runtime.
4. **No Node.js imports in browser code** — `SlideContext` uses a local `DEFAULT_THEME` constant instead of importing from `theme-loader.js` (which requires `fs`). Browser/Node.js boundary respected.
5. **Theme CSS loading is build-time** — scaffolded `main.jsx` imports the right theme CSS. `data-theme` is a signaling mechanism only. Full runtime switching deferred (requires pre-compiled CSS per theme).
6. **Export fallbacks valid** — `#080b10` in exportDeckPdf/Pptx is a safe server-side fallback for the dark background.

**Key files:**
- `packages/deck-engine/src/SlideContext.jsx` — theme prop, data-theme attribute, context value

---

### BUILD-001: Browser/Node Boundary
**Author:** Basher | **Date:** 2026-03-15 | **Status:** Implemented

1. **`@deckio/deck-engine` browser entry stays browser-safe** — `packages/deck-engine/index.js` exports runtime React components only and no longer pulls in modules that transitively require Node.js builtins.
2. **Node-only theme resolution lives behind `vite.js`** — `resolveTheme()`, `getAvailableThemes()`, and filesystem-backed theme loading stay in `packages/deck-engine/vite.js` and `themes/theme-loader.js`, not the browser entry.
3. **Exports map enforces the split** — `.` resolves to `index.js` for browser consumers, while `./vite` and `./vite.js` expose the Node-side integration point explicitly.
4. **This fixed production build crashes** — dev mode could mask the mistake, but Rollup production builds broke when browser bundles touched `fs`/`path` code.

**Key files:**
- `packages/deck-engine/index.js` — browser-safe exports
- `packages/deck-engine/vite.js` — Node-only theme helpers
- `packages/deck-engine/package.json` — exports map boundary

---

### 2026-03-14T01:52:00Z: User Directive — Verification Loop Required
**By:** Ali Soliman (via Copilot) | **Date:** 2026-03-14 | **Status:** Active

Every feature must go through a verification loop before being declared done. No half-baked features. Agents must test their work end-to-end — not just unit tests, but actual integration verification (scaffold a project, run it, confirm it works). Sloppy behavior is unacceptable.

**Why captured:** The `tailwindPlugin` export bug shipped because nobody verified the scaffolded project actually ran. Unit tests passed; the real project was broken.

---

### PROCESS-001: E2E Verification Standard for Scaffolder Features
**Author:** Linus | **Date:** 2026-03-14 | **Status:** Active

1. **Full E2E matrix is the minimum bar** — scaffold → npm install → dev server → production build. All four steps must pass for any scaffolder feature to be considered complete.
2. **Production build is not covered by unit tests** — unit tests validate pure function outputs (string generation). They never run a Vite build of the generated project. A passing unit suite does not imply a working production build.
3. **Dev server ≠ production build** — Vite serves modules individually in dev mode. Node.js builtins are available in the dev server's module graph but never sent to the browser. Rollup (production) is stricter.
4. **Browser/Node.js boundary must be respected in `index.js`** — `packages/deck-engine/index.js` is the browser entry point. Any module it imports (directly or transitively) must be browser-safe. Node.js-only utilities (fs, path, url) belong in server-only entry points (e.g., `vite.js`, `themes/theme-loader.js`).
5. **CI should automate the E2E check** — an automated step that scaffolds a project, installs deps, and runs `vite build` would catch the entire class of production bundle regressions that unit tests miss.

---

### CLI-001: CLI TUI Overhaul
**Author:** Basher | **Date:** 2026-03-15 | **Status:** Implemented

1. **`@clack/prompts` replaced the old readline flow** — the scaffolder now uses a proper TUI with `intro()`, `text()`, `select()`, `spinner()`, and `outro()`, plus graceful Ctrl+C handling.
2. **Prompt flow is hierarchical** — interactive onboarding now asks for design system first, then appearance, then the right color control for that path (accent presets for default decks, Aurora palette for shadcn decks).
3. **Default-system color choice uses curated swatches** — 8 preset accent colors render with ANSI swatches, plus a validated custom-hex escape hatch.
4. **Appearance is chosen at scaffold time** — there is no runtime ModeToggle in generated decks. The scaffolded `ThemeProvider` only applies the selected dark/light appearance.
5. **Non-interactive mode follows the same model** — `DECK_DESIGN_SYSTEM`, `DECK_APPEARANCE`, `DECK_ACCENT`, and `DECK_AURORA_PALETTE` mirror the interactive flow.

**Key files:**
- `packages/create-deckio/package.json` — `@clack/prompts`
- `packages/create-deckio/index.mjs` — prompt tree + install spinner
- `packages/create-deckio/utils.mjs` — preset exports and scaffolded app wiring

---

### REACTBITS-001: ReactBits Integration
**Author:** Basher | **Date:** 2026-03-15 | **Status:** Implemented

1. **Generated shadcn decks ship real ReactBits source** — Aurora, BlurText, ShinyText, DecryptedText, and SpotlightCard are scaffolded from verified local source files instead of hand-rolled imitations.
2. **Aurora is part of the app shell, not a single slide** — `App.jsx` renders the Aurora background once in a fixed global layer so it persists across navigation instead of only appearing on the cover.
3. **Starter slides exercise the curated component set** — the default shadcn slides use BlurText, ShinyText, DecryptedText, and SpotlightCard so fresh projects immediately demonstrate the intended ecosystem.
4. **shadcn onboarding includes curated Aurora palettes** — Ocean, Sunset, Forest, Nebula, Arctic, and Minimal are the supported palette choices, and the scaffold derives the accent from the selected palette.
5. **The ReactBits registry remains available for expansion** — generated `components.json` keeps `@react-bits` configured so users can pull in more components later with the shadcn CLI.

**Key files:**
- `packages/create-deckio/templates/react-bits/aurora.jsx`
- `packages/create-deckio/templates/react-bits/blur-text.jsx`
- `packages/create-deckio/templates/react-bits/shiny-text.jsx`
- `packages/create-deckio/templates/react-bits/decrypted-text.jsx`
- `packages/create-deckio/templates/react-bits/spotlight-card.jsx`
- `packages/create-deckio/utils.mjs`

---

### ARCH-002: Multi-Design-System Architecture Assessment
**Author:** Rusty | **Date:** 2026-03-15 | **Status:** Active

1. **Do not reposition DECKIO as a general multi-design-system engine** — too broad, too early, too likely to blur the product identity.
2. **`theme` and `designSystem` are separate axes** — `theme` controls CSS tokens (visual appearance); `designSystem` controls component library infrastructure. Conflating them will make the product muddy.
3. **One opt-in `shadcn` adapter is the right experiment** — framed as "presentation authoring with familiar components," not "full app UI inside slides."
4. **Engine stays lean** — shadcn infrastructure belongs in scaffolder presets and generated project files only. Never a runtime dep of `@deckio/deck-engine`.
5. **Presentation-valid shadcn primitives:** Card, Badge, Button (visual CTA), Separator, Tabs, Accordion, Table, Alert, Avatar. App-interaction widgets (Dialog, Sheet, Tooltip, Input) are low-value in a presentation context.
6. **Prove usage before supporting a second design system** — adapter explosion (MUI, Chakra, Park UI) is a real scope-creep risk.
7. **Success criteria:** do authors actually use generated shadcn components in real decks?

---

### SHADCN-001: shadcn/ui Design System Integration
**Author:** Basher | **Date:** 2026-03-15 | **Status:** Implemented

1. **`designSystem` is separate from `theme`** — `theme` controls visual appearance; `designSystem` controls component library infrastructure. You can have `theme: "shadcn"` with `designSystem: "none"` (just the look) or `designSystem: "shadcn"` (the full component system).
2. **CLI flow chooses design system first** — the scaffolder asks for design system, then appearance, then writes the shadcn-specific files only when the shadcn path is selected.
3. **Pre-generated files, not `npx shadcn init`** — generates `components.json`, `src/lib/utils.js`, `jsconfig.json`, and the Vite `@` alias. Running `npx shadcn init` is interactive and fragile; pre-generation is faster and deterministic.
4. **`jsconfig.json` is required** — shadcn CLI fails without it. Needs the `@/*` path mapping to resolve `@/lib/utils` and `@/components/ui/*`.
5. **`tsx: false`, `rsc: false`** — DECKIO uses JSX (not TypeScript) and has no React Server Components. shadcn CLI generates `.jsx` accordingly.
6. **ReactBits registry in `components.json`** — `registries: { "@react-bits": "https://reactbits.dev/r/{name}.json" }` enables `npx shadcn add @react-bits/animated-content` in shadcn-enabled projects.
7. **Non-interactive mode mirrors the interactive flow** — `DECK_DESIGN_SYSTEM` and `DECK_APPEARANCE` drive the shadcn path without needing interactive prompts.
8. **`VITE_CONFIG` replaced with `viteConfig()` function** — needed to conditionally include the `resolve.alias` block based on `designSystem`.

**Key files:**
- `packages/create-deckio/utils.mjs` — `packageJson()`, `deckConfig()`, `viteConfig()`, `componentsJson()`, `cnUtility()`, `jsConfig()`
- `packages/create-deckio/index.mjs` — shadcn prompt, conditional file generation, README shadcn section

---

### CSS-001: @layer Strategy for shadcn/ui Compatibility
**Author:** Livingston | **Date:** 2026-03-15 | **Status:** Implemented

1. **Engine adapts to the ecosystem** — `global.css` now declares `@layer theme, base, components, utilities;` matching Tailwind v4's internal layer names exactly.
2. **Layer order declaration lives in `global.css`** — it is imported first in scaffolded projects, so this declaration wins.
3. **Engine reset and token defaults in `@layer base`** — same cascade priority as Tailwind's preflight; no override war with spacing/margin/padding utilities.
4. **Engine component styles in `@layer components`** — Tailwind utilities (`@layer utilities`) correctly override engine defaults when needed.
5. **Theme CSS `:root` blocks remain unlayered** — unlayered = highest cascade priority; theme token values always win over Tailwind and engine defaults.
6. **CSS Modules don't need layers** — scoped hashed class names are inherently safe from Tailwind utility name collisions.
7. **Full shadcn compatibility** — engine and shadcn share the same CSS variable names (`--background`, `--foreground`, `--primary`, etc.); shadcn components read engine tokens correctly.

**Key files:**
- `packages/deck-engine/styles/global.css` — layer order declaration, `@layer base`, `@layer components`

---

### 2026-03-13T02:47:00Z: User Directive — ReactBits as Complementary Library
**By:** Ali Soliman (via Copilot) | **Date:** 2026-03-13 | **Status:** Implemented

ReactBits (reactbits.dev) should be included as a complementary animation and components library alongside shadcn in the design system. It has cool animations and UI components that complement shadcn's more structural components. Implemented via ReactBits registry entry in generated `components.json` for shadcn-enabled projects.

---

### SLIDES-001: shadcn-Specific Starter Slide Templates
**Author:** Saul + Livingston | **Date:** 2026-03-15 | **Status:** Implemented

1. **`designSystem` drives template selection** — when `designSystem: "shadcn"`, the scaffolder emits a four-slide starter deck (`CoverSlide`, `FeaturesSlide`, `GettingStartedSlide`, `ThankYouSlide`). Dark/light themes keep the original two-slide orb/glow starter.
2. **shadcn CoverSlide removes orbs entirely** — no gradient orbs, no accent-bar. Replaced with a pill badge (pulsing dot + project slug), shimmer accent line, gradient-shift title, and clean card-style meta bar. All CSS uses semantic tokens (`--background`, `--foreground`, `--card`, `--border`, `--radius`, `--muted-foreground`, `--secondary`).
3. **shadcn ThankYouSlide is a local file** — dark/light themes reuse the engine's `GenericThankYouSlide` (with glows/streaks). shadcn generates a local `ThankYouSlide.jsx` + `.module.css` with animated gradient text, clean divider, no orbs/streaks. `deckConfig()` imports accordingly.
4. **Starter slides use real ReactBits components** — generated shadcn decks scaffold actual `BlurText`, `ShinyText`, `DecryptedText`, and `SpotlightCard` source files locally, then import them directly in the starter slides. No network fetch is required at runtime.
5. **New exports from `utils.mjs`** — `coverSlideJsxShadcn()`, `featuresSlideJsxShadcn()`, `gettingStartedSlideJsxShadcn()`, `thankYouSlideJsxShadcn()` plus their CSS constants. All stay testable as pure functions.

**Key files:**
- `packages/create-deckio/utils.mjs` — shadcn template functions + CSS constants
- `packages/create-deckio/index.mjs` — conditional template selection

---

### DARK-001: Scaffold-Time Appearance Selection for shadcn
**Author:** Basher | **Date:** 2026-03-15 | **Status:** Implemented

1. **Only shadcn decks get appearance selection** — default DECKIO themes stay single-mode CSS themes, while shadcn decks choose `dark` or `light` during scaffolding.
2. **Generated projects still use the standard shadcn class pattern** — `ThemeProvider` applies `.dark` / `.light` classes on `<html>` so the same semantic tokens can drive both appearances.
3. **There is no runtime toggle UI** — `ModeToggle` was intentionally removed. Appearance is set when the deck is scaffolded, not changed live during presentations.
4. **`appJsx()` wires the chosen appearance into the scaffold** — the provider seeds the selected default theme, while non-shadcn projects still render without `ThemeProvider`.

**Key files:**
- `packages/create-deckio/utils.mjs` — `themeProviderJsx()` and `appJsx()`
- `packages/create-deckio/index.mjs` — appearance prompt + scaffolded file generation

---

### 2026-03-13T13:50:00Z: User Directive — Use Ecosystem Components First
**By:** Ali Soliman (via Copilot) | **Date:** 2026-03-13 | **Status:** Active

1. **Use existing ecosystem components whenever they fit** — prefer ReactBits, shadcn, and other established libraries over custom rebuilds.
2. **Do not reinvent integrated primitives** — shipping a homegrown substitute for something ReactBits/shadcn already provides is a product mistake, not craftsmanship.
3. **Custom implementations are the fallback path** — only build from scratch when the ecosystem genuinely does not cover the need.

---

### 2026-03-15T11:30:00Z: User Directive — No Runtime Dark/Light Toggle
**By:** Ali Soliman (via Copilot) | **Date:** 2026-03-15 | **Status:** Active

1. **Appearance is chosen at scaffold time** — generated decks should start in the selected appearance and stay there.
2. **`ModeToggle` is intentionally absent** — this is a design decision, not a bug or unfinished feature.
3. **Dark/light variation belongs in onboarding and config** — not in presentation-time chrome.

---

### 2026-03-15T12:00:00Z: User Directive — Skills Are for AI Coding CLIs
**By:** Ali Soliman (via Copilot) | **Date:** 2026-03-15 | **Status:** Active

1. **Skills are operational procedures for AI coding agents** — they must tell the agent exactly what to read, how to resolve the descriptor, and what rules to follow.
2. **Human-friendly essays are insufficient** — every skill needs explicit behavior, exact skeletons, and guardrails that an AI CLI can execute reliably.
3. **Future skill work should optimize for agent consumption first** — wording, structure, and examples should reduce ambiguity for autonomous coding tools.

---

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction

---

### BASHER-THEME-CREATOR-FEASIBILITY: Theme Creator Package Architecture Analysis
**Author:** Basher (Backend) | **Date:** 2026-03-15 | **Status:** Analysis — architecture adopted

Deep technical analysis of theme generation feasibility for the proposed theme creator engine.

**Key Findings:**

1. **Current theme loading is perfectly architected for generation** — themes are pure CSS files, no runtime JavaScript involved. Pipeline: `themes/{name}.css → static import in main.jsx → Vite CSS pipeline → browser`. Generation fits naturally: new `.css` file drops into `packages/deck-engine/themes/` and is auto-discovered by `getAvailableThemes()` directory scan.

2. **Package boundary recommendation: `@deckio/create-theme`** — new workspace package (not embedded in engine). Rationale: (a) keeps engine browser-safe (no Node.js deps), (b) follows existing `create-deckio` convention, (c) clean dependency boundary, (d) independent release cadence from engine.

3. **Export format:** Generated theme = 3 files:
   - `{name}.css` — full CSS with all 9 token categories + `@import "tailwindcss"` + `@theme inline` bridge
   - `descriptors/{name}.md` — theme descriptor following established schema
   - `previews/{name}.png` (optional) — representative screenshot

4. **Token contract drift is the high risk** — all ~84 CSS custom properties must exist in every theme or components break silently. Mitigation: extract canonical token list, add Vitest contract validation test covering all themes.

5. **CSS layer warnings:**
   - Theme CSS must remain **unlayered** (highest cascade priority)
   - Never emit `@layer` in generated CSS
   - `@theme inline` block must be exact (not derived) — use constant template

6. **Standalone CLI workflow (not build-time or runtime)** — theme creation is an authoring step that precedes development. User runs `npm create @deckio/theme`, gets output files, then creates a project using that theme.

**Key risks with mitigations:**
- Token drift → contract validation test
- @layer breaches → lint check in test suite
- @theme typos → use constant block template
- Font loading deps → document strategy, recommend fallback stacks
- color-scheme mismatch → ask for base appearance, set accordingly

**Files referenced:**
- `packages/deck-engine/themes/theme-loader.js` — resolution/discovery utilities
- `packages/deck-engine/themes/{name}.css` — existing theme files as templates
- `packages/deck-engine/themes/descriptors/` — descriptor pattern

**Conclusion:** Feasible. Recommend extracting token contract first, then building the creator package.

---

### SAUL-THEME-CREATOR-DESIGN-PERSPECTIVE: Token Tier Classification and Design Constraints
**Author:** Saul (UI/UX & Design) | **Date:** 2026-03-15 | **Status:** Design perspective — architecture adopted

Design system perspective on the theme creator engine requirements.

**Token Classification (3-tier model):**

| Tier | Tokens | Meaning | v1 Policy |
|---|---|---|---|
| **Tier 1: Required Identity Tokens** | 32 tokens | Define the theme's look. Missing any token = visual breakage. Examples: semantic colors (primary, secondary, accent, background, foreground, muted, destructive), ring, radius, key backgrounds | Must exist; validation fails if missing |
| **Tier 2: Derived Invariant Tokens** | 24 tokens | Generated from Tier 1 to maintain coherence. Never chosen independently. Examples: foreground-on-color pairs (primary-foreground), overlays (surface-overlay), glows (glow-primary), tint ramps, color-scheme | Must be compiler-generated, not AI-authored |
| **Tier 3: Optional Override Tokens** | ~39 tokens | Structural defaults that may inherit from archetype without breaking identity. Examples: typography families, spacing scale, transition durations | Optional in author input; explicit in final export |

**10 Design Non-Negotiables:**

1. Complete Tier 1 coverage — visual coherence depends on it
2. Auto-generated `@theme inline` bridge — must be exact, not guessed
3. Derived tokens always deterministically generated — no AI independent choice
4. WCAG AA contrast validation on critical pairs (foreground/background, primary-foreground/primary, card-foreground/card)
5. color-scheme/luminance coherence — dark theme gets `dark`, light gets `light`
6. Atomic CSS + descriptor generation — same compiled model feeds both files
7. Strict file structure enforcement — no workarounds or exceptions
8. No hardcoded hex in component CSS — must use tokens everywhere
9. Theme loader registration — for skill/descriptor discovery
10. Single unlayered `:root` block — cascade clarity, no @layer in theme CSS

**6 Major Failure Modes:**

1. **Color soup** — no 60/30/10 color ratio enforcement, results in chaotic unreadable themes
2. **Token orphans** — mismatched glow/overlay colors (derived from wrong base), breaks visual system coherence
3. **Typography disasters** — display fonts (e.g., 72px Bebas) used at body sizes, illegible
4. **Broken Tailwind bridge** — @theme inline typos or missing mappings, utilities silently resolve to nothing
5. **Design system mismatch** — theme claims shadcn compatibility but breaks under shadcn components
6. **Stale descriptors** — CSS changes without descriptor updates, skills generate incorrect slides

**Descriptor Minimum Schema (9 required sections):**

1. Metadata (id, authoring pattern, compatible design systems, mood)
2. Personality (prose description of visual feel)
3. JSX skeleton (starter code)
4. CSS skeleton (starter styles)
5. Token table (which tokens to use/avoid, with values)
6. Decorative elements table (automatic features vs. explicit JSX)
7. Anti-patterns list (forbidden styles for this theme)
8. Component examples
9. Example slide direction

**Validation scope:**
- Required checks: recipe schema, token contract, CSS structure, accessibility, color system, descriptor schema, canonical preview build
- Warning checks: extended contrast pairs, projector-risk heuristics, font warnings, overlay aggressiveness, extreme overrides

**Files referenced:**
- `packages/deck-engine/themes/descriptors/` — established descriptor pattern
- `packages/deck-engine/styles/global.css` — token contract definition

---

### ARCH-004: Final Theme Creator Architecture
**Author:** Rusty | **Requested by:** Ali Soliman | **Date:** 2026-03-14 | **Status:** Final architecture decision

**Moved from inbox decision (too large) — see full text in `.squad/decisions.md` entries above or in `ARCH-004-full.md` reference.**

## Settled Decisions

1. **Primary v1 user:** monorepo maintainers and advanced deck builders, not mass-market end users. End users should keep getting first-class built-in decks by default.
2. **Product boundary:** the theme creator is authoring-time tooling, not runtime theming, not a marketplace, and not a live browser-side generator.
3. **Primary v1 output:** local deck themes first. Architecture mirrors engine themes so local themes can be promoted to curated reusable themes later without re-authoring.
4. **Runtime contract stays intact:** finished theme is **theme CSS + descriptor**. Runtime code stays agnostic to whether theme was hand-authored or generated.
5. **Package boundary:** new workspace package `packages/create-theme/`, published as `@deckio/create-theme`, thin integration into `create-deckio`.
6. **Expressiveness:** v1 supports full range from safe corporate/editorial to loud expressive themes (funky-punk spirit). No limiting to conservative palettes.
7. **Archetypes:** built-in themes remain starting archetypes: `dark`, `light`, `shadcn`-inspired, `funky-punk`-inspired.
8. **shadcn meaning:** v1 is **visual vibe only**. Generated themes don't claim actual shadcn component compatibility unless future validator explicitly supports it.
9. **Image and brand ingestion:** included in v1. Images/logos may inform palette extraction, typography mood, decorative direction, but not drive copying of layouts or branded compositions.
10. **Accessibility bar:** WCAG AA required for critical text pairs. Extended contrast + coherence checks run as warnings.
11. **Preview step:** mandatory canonical preview deck build before export. Every generated theme must pass.
12. **AI boundary:** AI interprets brief, summarizes mood, chooses bounded style modules. Does **not** hand-author token bridge, derived values, or freeform CSS.

## Architecture Overview

### Package layout
**New package:** `packages/create-theme/`

Modules:
- `brief/` — parses prompt, brand text, optional images into `ThemeRecipe`
- `archetypes/` — base theme templates + bounded style modules
- `tokens/` — canonical token contract, tier metadata, deterministic compiler
- `descriptor/` — markdown descriptor generator
- `preview/` — canonical preview deck builder + screenshot runner
- `validate/` — required checks + warning heuristics
- `export/` — local deck export now; curated/package export later

### Pipeline

```
Prompt + structured inputs + optional images
→ ThemeRecipe normalization
→ Archetype selection
→ Palette extraction and typography direction
→ Deterministic token compilation
→ Deterministic derived-token generation
→ Bounded style-module application
→ Descriptor generation (same compiled model)
→ Validation
→ Canonical preview build + screenshots
→ Export
```

### Source of truth

**`theme.recipe.json`** — normalized source brief and selected options (creator-owned)

**`theme.manifest.json`** — generator version, archetype, export target, timestamps, provenance, validation summary (creator-owned)

**CSS + descriptor** — runtime-facing outputs (generated from recipe + manifest)

### File formats

#### Local deck export layout (v1 primary)

```
src/themes/<theme-id>.css
src/themes/descriptors/<theme-id>.md
.deckio/themes/<theme-id>/theme.recipe.json
.deckio/themes/<theme-id>/theme.manifest.json
.deckio/themes/<theme-id>/validation.json
.deckio/themes/<theme-id>/previews/*.png
```

- `src/themes/` holds runtime-facing files the deck imports
- `.deckio/themes/` holds creator metadata, validation, screenshots
- `src/main.jsx` imports `./themes/<theme-id>.css`
- `deck.config.js` stores `theme: './src/themes/<theme-id>.css'`

#### Curated reusable export layout (architected now, deferred operationally)

```
packages/deck-engine/themes/<theme-id>.css
packages/deck-engine/themes/descriptors/<theme-id>.md
packages/deck-engine/themes/descriptors/previews/<theme-id>/*.png
packages/deck-engine/themes/meta/<theme-id>.manifest.json
```

Compiler and exporter already structured for both layouts; same compiled theme model targets both.

## v1 Scope

### Ships in v1
1. `@deckio/create-theme` CLI/library
2. Local deck export as primary workflow
3. Theme generation from: text brief, structured brand fields, optional image/logo/brand-board inputs
4. Four visual archetype families: dark, light, shadcn-inspired, expressive/funky-punk-inspired
5. Deterministic token compiler with bounded style modules
6. Atomic generation: CSS theme, descriptor, recipe, manifest, validation report, preview screenshots
7. Required canonical preview build before export
8. Required WCAG AA validation on critical text pairs
9. Thin `create-deckio` integration for advanced/maintainer flow
10. Skill/instruction updates for local custom theme descriptor discovery

### Explicit v1 non-goals
- no runtime theme marketplace
- no live runtime theme switching project
- no arbitrary AI-written CSS blocks
- no automatic promotion into built-in themes
- no org-level theme registry UX
- no promise of actual shadcn component compatibility

## Token Contract (Rule Set)

### Rule 1 — Model the contract in tiers, export the contract in full

| Contract class | Meaning | v1 policy |
|---|---|---|
| **Required identity tokens** | Define theme's look; missing token = visual breakage | Must exist; validation fails if missing |
| **Derived invariant tokens** | Must stay coherent with identity; never chosen independently | Compiler-generated, not AI-authored |
| **Optional override tokens** | Structural defaults that may inherit from archetype | Optional in recipe, explicit in final export |

### Rule 2 — Exported CSS is always canonical and complete

- **Recipe** may omit structural overrides
- **Compiler** may inherit from archetype
- **Exported CSS** still writes full canonical token surface for portability

In practice:
- Tier 1 correctness tokens: required
- Tier 2 personality/coherence tokens: required in compiled output (even if derived)
- Tier 3 structural tokens: optional in author input, explicit in export

### Rule 3 — Derived tokens are not user-authored in v1

Deterministically derived:
- primary-foreground and foreground-on-fill pairs
- surface overlays
- glow tokens
- tint ramps and border emphasis
- color-scheme
- Tailwind @theme inline bridge mappings

Prevents "choose everything independently" chaos.

### Rule 4 — Optional style freedom lives in bounded modules, not open CSS

Non-token CSS through approved modules only:
- typography treatment
- heading treatment
- accent/decor treatment
- link treatment
- card treatment
- ambient texture/overlay treatment

Each module exposes small parameters; no freeform CSS escape hatch in v1.

## Validation Pipeline

### Required checks — export fails on any error

1. **Recipe schema validation** — valid id/slug, supported archetype, supported export target, image assets readable
2. **Token contract compilation** — required identity tokens resolved, derived tokens generated, final token map complete
3. **CSS structure validation** — one top-level unlayered `:root`, no `@layer` in theme CSS, valid CSS values, fixed `@import "tailwindcss"`, fixed `@theme inline`
4. **Accessibility validation** — foreground/background WCAG AA, primary-foreground/primary WCAG AA, card-foreground/card WCAG AA
5. **Color-system validation** — color-scheme matches luminance intent, derived overlays/glows from same base system
6. **Descriptor validation** — descriptor in required schema, CSS and descriptor emitted atomically
7. **Canonical preview build** — preview builds, screenshots render successfully

### Warning checks — export succeeds with warnings

- extended contrast pairs (secondary, accent, muted, callout surfaces)
- projector-risk heuristics (very low luminance, over-saturation)
- font fallback/licensing warnings
- overlay/glow aggressiveness
- extreme radius/spacing/typography overrides
- low-confidence image extraction or ambiguous brand input

### Canonical preview deck

Fixed 6-slide set exercising:
1. Title/hero slide
2. Content-frame with dense text
3. Cards/grid surface
4. Data/callout slide
5. Image-led or full-bleed composition
6. Closing/CTA slide

Not optional fluff — proof that theme survives contact with real slide surface.

## Integration Points

### Scaffolder (`packages/create-deckio/`)

Stays simple, prioritizes built-in themes for normal users:
- add advanced path: "create custom theme"
- call `@deckio/create-theme`
- write local artifacts into `src/themes/`
- write creator metadata into `.deckio/themes/`
- update `deck.config.js`
- update `src/main.jsx`

Should **not** absorb theme-generation logic.

### Engine (`packages/deck-engine/`)

Runtime responsibilities small:
- keep consuming CSS custom properties
- keep `theme` and `designSystem` as separate axes
- accept local theme CSS paths via existing custom-theme behavior
- stay agnostic to generated vs. hand-authored themes
- expose canonical token contract so creator and engine tests validate against same source

### Skills and descriptors

Descriptors remain first-class:
- skills/instructions resolve local descriptors at `src/themes/descriptors/<theme-id>.md` when `deck.config.js` points to local theme CSS
- built-in descriptor fallback for default themes
- generated descriptors use same structure as built-in descriptors
- `designSystem` defaults to `default` for generated themes unless stronger future contract says otherwise

## Deferred to v2

- curated reusable theme promotion workflow
- org-scoped theme libraries
- marketplace/discovery UI
- approval workflow for promoting generated theme as built-in
- true shadcn-compatible output mode
- watch mode / iterative live regeneration
- cross-project theme registry and version pinning
- policy tooling for brand/IP review beyond warnings

## Implementation Order

1. Formalize token contract (canonical list, tier metadata, shared code + tests)
2. Define canonical preview deck (6-slide set, screenshot harness)
3. Create `packages/create-theme/` package
4. Build deterministic compiler (palette → tokens → CSS)
5. Generate descriptors atomically (same compiled model)
6. Implement validation (required gates, warning heuristics)
7. Integrate local theme workflow (create-deckio, deck.config.js, main.jsx, skills)
8. Add image/brand ingestion (palette extraction, typography hints)
9. Prepare v2 promotion path (exporter abstraction, curated target disabled until ready)

## Bottom Line

v1 ships as a **maintainer-first, authoring-time theme creator** that generates **local, engine-compatible themes** with **complete canonical token export**, **mandatory descriptor**, **required preview build**, and **required WCAG AA checks on critical pairs**. Runtime stays simple, scaffolder stays thin, output stays portable, system architected for curated reusable themes later.

---

### 2026-03-14T00:46Z: User Directive — Owner decisions on theme creator architecture
**By:** Ali Soliman (via Copilot) | **Date:** 2026-03-14 | **Status:** Implemented

Owner input on open questions from theme creator design meeting. All points incorporated into ARCH-004.

1. **v1 user:** Monorepo maintainers first. End users get first-class defaults. Architect for future org/user curation.
2. **Output priority:** Local deck themes first. Curated reusable themes later — but architect for it now.
3. **Expressiveness:** Full range — user should have a choice (safe corporate through funky-punk).
4. **shadcn:** Visual vibe only, not actual compatibility. Popular with devs but not a hard requirement.
5. **Image/brand ingestion:** Yes, include in v1.
6. **Accessibility bar:** Team's call. WCAG AA on critical pairs confirmed as acceptable bar.
7. **Preview screenshots:** Team's call. Required mandatory canonical preview build confirmed.

**Why captured:** Owner input on open questions from theme creator design meeting.


---

### SHADCN-001: Real shadcn/ui Component Integration
**Author:** Rusty | **Date:** 2026-03-15 | **Status:** Scoping / ready for implementation planning

DECKIO already has a shadcn-looking theme and partial scaffold but **not** real shadcn authoring end to end. The gap is: **turn shadcn from a visual style into an actual component ecosystem path for decks** while keeping the engine lean and not breaking existing CSS-themed decks.

#### Current State
- `packages/deck-engine/themes/shadcn.css` is semantic token map + Tailwind v4 bridge, **not** component library
- Descriptor still treats shadcn as CSS-module authoring contract, not real component system
- Scaffolder already has CLI/MCP setup (`components.json`, aliases, ThemeProvider) but no real preinstalled primitives
- Slides still authored mostly through custom JSX + CSS Modules

#### What "Real shadcn" Means
1. Fresh shadcn deck projects can import real components from `@/components/ui/*` immediately
2. Those files are actual shadcn/ui source, not lookalikes
3. Projects can continue pulling more components via `npx shadcn@latest add ...`
4. MCP-based tooling can discover/add components against that registry structure
5. Starter slides and docs demonstrate component-native composition

#### Recommended Starter Set
Presentation-relevant preinstalled: `button`, `card`, `badge`, `separator`, `alert`  
Lower-priority (CLI/MCP expansion): `dialog`, `sheet`, `tooltip`, `input`, form primitives

#### Architecture Impact (Non-Negotiables)
1. **Engine package remains lean** — stays runtime primitives only, no bundled UI kit
2. **No breaking changes** — existing CSS-authored decks remain valid, new ones get real components
3. **`theme` and `designSystem` separate** — separation becomes more important, not less
4. **Design-system supplement layer** — activate when `designSystem: 'shadcn'`, orthogonal to theme choice
5. **Verify end to end** — scaffold → install → dev → build must work for real

#### Implementation Phases
1. **Phase 0:** Contract cleanup, audit CSS entry/Tailwind setup, make docs truthful
2. **Phase 1:** Scaffold curated starter components, update starter slides, E2E verification
3. **Phase 2:** Descriptor/instructions/skills updates, migration examples
4. **Phase 3:** Scaffolder UX refinement, README clarity
5. **Phase 4:** MCP registry integration polish (after local path is proven)

#### Open Questions for Ali (awaiting owner input)
1. Preinstalled component set — recommend Button, Card, Badge, Separator, Alert
2. Scope axis — `theme: 'shadcn'` only or `designSystem: 'shadcn'` independent of theme?
3. Starter slide visual level — more component-native or keep bespoke/editorial?
4. Scaffolding approach — pre-scaffolded source or run shadcn CLI during init?
5. Local wrapper layer — deck-friendly compositions like MetricCard, SectionBadge?
6. MCP in generated README — core promoted workflow or nice-to-have?
7. Descriptor architecture — keep theme-primary or add design-system supplement now?

#### Bottom line
Proceed in phases: clean contract → ship starter set → prove model → upgrade descriptors → polish MCP. Satisfies "immediately but carefully and methodically" directive. Preserves backwards compatibility, keeps engine lean, establishes foundation for future design system work.

Full scope: `.squad/decisions/inbox/rusty-shadcn-component-integration.md` (migrated from inbox)

---

### 2026-03-14T00:53Z: Owner directive — shadcn is real compatibility, not just visual vibe
**By:** Ali Soliman (via Copilot) | **Date:** 2026-03-14 | **Status:** Implemented

When the theme creator offers a shadcn option, it must use actual shadcn/ui design system and components, not just visual aesthetic. `designSystem: shadcn` should mean real shadcn compatibility.

---

### 2026-03-14T00:56Z: Owner directive — rebuild shadcn theme to use real shadcn/ui components
**By:** Ali Soliman (via Copilot) | **Date:** 2026-03-14 | **Status:** Implemented

Current shadcn theme uses clever CSS that looks like shadcn but doesn't actually use shadcn/ui components. Rebuild it to use real shadcn components. Devs who build on shadcn should have a native experience — they should be able to use shadcn MCPs to pull components. Tackle immediately but carefully and methodically.

**Why:** Owner directive — shadcn is not just a visual vibe, it's a real design system integration.

---

### 2026-03-14T01:08Z: Owner decisions on shadcn component integration
**By:** Ali Soliman (via Copilot) | **Date:** 2026-03-14 | **Status:** Implemented

Owner answers to 7 open questions from SHADCN-001 scoping:
1. **Starter components:** shadcn Button, Card, Badge, Separator, Alert PLUS relevant ReactBits components for initial template
2. **Design system axis:** Tie to `designSystem: 'shadcn'` independent of theme choice
3. **Component-native slides:** Yes — starter slides should use real components, less bespoke CSS
4. **Pre-scaffold approach:** Deterministic pre-scaffolded source for starters, CLI/MCP for expansion
5. **Deck-friendly wrappers:** Yes (implied by component-native slides)
6. **MCP authoring:** Core promoted workflow (implied by original directive)
7. **Design-system supplement layer:** Yes, now is the time (implied by "prerequisite to design system work")

**Why:** Owner input unblocks Phase 0 implementation.


---

### BASHER-THEME-CREATOR-FEASIBILITY: Theme Creator Package Architecture Analysis
**Author:** Basher (Backend) | **Date:** 2026-03-15 | **Status:** Analysis — architecture adopted

Deep technical analysis of theme generation feasibility for the proposed theme creator engine.

**Key Findings:**

1. **Current theme loading is perfectly architected for generation** — themes are pure CSS files, no runtime JavaScript involved. Pipeline: `themes/{name}.css → static import in main.jsx → Vite CSS pipeline → browser`. Generation fits naturally: new `.css` file drops into `packages/deck-engine/themes/` and is auto-discovered by `getAvailableThemes()` directory scan.

2. **Package boundary recommendation: `@deckio/create-theme`** — new workspace package (not embedded in engine). Rationale: (a) keeps engine browser-safe (no Node.js deps), (b) follows existing `create-deckio` convention, (c) clean dependency boundary, (d) independent release cadence from engine.

3. **Export format:** Generated theme = 3 files:
   - `{name}.css` — full CSS with all 9 token categories + `@import "tailwindcss"` + `@theme inline` bridge
   - `descriptors/{name}.md` — theme descriptor following established schema
   - `previews/{name}.png` (optional) — representative screenshot

4. **Token contract drift is the high risk** — all ~84 CSS custom properties must exist in every theme or components break silently. Mitigation: extract canonical token list, add Vitest contract validation test covering all themes.

5. **CSS layer warnings:**
   - Theme CSS must remain **unlayered** (highest cascade priority)
   - Never emit `@layer` in generated CSS
   - `@theme inline` block must be exact (not derived) — use constant template

6. **Standalone CLI workflow (not build-time or runtime)** — theme creation is an authoring step that precedes development. User runs `npm create @deckio/theme`, gets output files, then creates a project using that theme.

**Key risks with mitigations:**
- Token drift → contract validation test
- @layer breaches → lint check in test suite
- @theme typos → use constant block template
- Font loading deps → document strategy, recommend fallback stacks
- color-scheme mismatch → ask for base appearance, set accordingly

**Files referenced:**
- `packages/deck-engine/themes/theme-loader.js` — resolution/discovery utilities
- `packages/deck-engine/themes/{name}.css` — existing theme files as templates
- `packages/deck-engine/themes/descriptors/` — descriptor pattern

**Conclusion:** Feasible. Recommend extracting token contract first, then building the creator package.

---

### SAUL-THEME-CREATOR-DESIGN-PERSPECTIVE: Token Tier Classification and Design Constraints
**Author:** Saul (UI/UX & Design) | **Date:** 2026-03-15 | **Status:** Design perspective — architecture adopted

Design system perspective on the theme creator engine requirements.

**Token Classification (3-tier model):**

| Tier | Tokens | Meaning | v1 Policy |
|---|---|---|---|
| **Tier 1: Required Identity Tokens** | 32 tokens | Define the theme's look. Missing any token = visual breakage. Examples: semantic colors (primary, secondary, accent, background, foreground, muted, destructive), ring, radius, key backgrounds | Must exist; validation fails if missing |
| **Tier 2: Derived Invariant Tokens** | 24 tokens | Generated from Tier 1 to maintain coherence. Never chosen independently. Examples: foreground-on-color pairs (primary-foreground), overlays (surface-overlay), glows (glow-primary), tint ramps, color-scheme | Must be compiler-generated, not AI-authored |
| **Tier 3: Optional Override Tokens** | ~39 tokens | Structural defaults that may inherit from archetype without breaking identity. Examples: typography families, spacing scale, transition durations | Optional in author input; explicit in final export |

**10 Design Non-Negotiables:**

1. Complete Tier 1 coverage — visual coherence depends on it
2. Auto-generated `@theme inline` bridge — must be exact, not guessed
3. Derived tokens always deterministically generated — no AI independent choice
4. WCAG AA contrast validation on critical pairs (foreground/background, primary-foreground/primary, card-foreground/card)
5. color-scheme/luminance coherence — dark theme gets `dark`, light gets `light`
6. Atomic CSS + descriptor generation — same compiled model feeds both files
7. Strict file structure enforcement — no workarounds or exceptions
8. No hardcoded hex in component CSS — must use tokens everywhere
9. Theme loader registration — for skill/descriptor discovery
10. Single unlayered `:root` block — cascade clarity, no @layer in theme CSS

**6 Major Failure Modes:**

1. **Color soup** — no 60/30/10 color ratio enforcement, results in chaotic unreadable themes
2. **Token orphans** — mismatched glow/overlay colors (derived from wrong base), breaks visual system coherence
3. **Typography disasters** — display fonts (e.g., 72px Bebas) used at body sizes, illegible
4. **Broken Tailwind bridge** — @theme inline typos or missing mappings, utilities silently resolve to nothing
5. **Design system mismatch** — theme claims shadcn compatibility but breaks under shadcn components
6. **Stale descriptors** — CSS changes without descriptor updates, skills generate incorrect slides

**Descriptor Minimum Schema (9 required sections):**

1. Metadata (id, authoring pattern, compatible design systems, mood)
2. Personality (prose description of visual feel)
3. JSX skeleton (starter code)
4. CSS skeleton (starter styles)
5. Token table (which tokens to use/avoid, with values)
6. Decorative elements table (automatic features vs. explicit JSX)
7. Anti-patterns list (forbidden styles for this theme)
8. Component examples
9. Example slide direction

**Validation scope:**
- Required checks: recipe schema, token contract, CSS structure, accessibility, color system, descriptor schema, canonical preview build
- Warning checks: extended contrast pairs, projector-risk heuristics, font warnings, overlay aggressiveness, extreme overrides

**Files referenced:**
- `packages/deck-engine/themes/descriptors/` — established descriptor pattern
- `packages/deck-engine/styles/global.css` — token contract definition

---

### ARCH-004: Final Theme Creator Architecture
**Author:** Rusty | **Requested by:** Ali Soliman | **Date:** 2026-03-14 | **Status:** Final architecture decision

**Moved from inbox decision (too large) — see full text in `.squad/decisions.md` entries above or in `ARCH-004-full.md` reference.**

## Settled Decisions

1. **Primary v1 user:** monorepo maintainers and advanced deck builders, not mass-market end users. End users should keep getting first-class built-in decks by default.
2. **Product boundary:** the theme creator is authoring-time tooling, not runtime theming, not a marketplace, and not a live browser-side generator.
3. **Primary v1 output:** local deck themes first. Architecture mirrors engine themes so local themes can be promoted to curated reusable themes later without re-authoring.
4. **Runtime contract stays intact:** finished theme is **theme CSS + descriptor**. Runtime code stays agnostic to whether theme was hand-authored or generated.
5. **Package boundary:** new workspace package `packages/create-theme/`, published as `@deckio/create-theme`, thin integration into `create-deckio`.
6. **Expressiveness:** v1 supports full range from safe corporate/editorial to loud expressive themes (funky-punk spirit). No limiting to conservative palettes.
7. **Archetypes:** built-in themes remain starting archetypes: `dark`, `light`, `shadcn`-inspired, `funky-punk`-inspired.
8. **shadcn meaning:** v1 is **visual vibe only**. Generated themes don't claim actual shadcn component compatibility unless future validator explicitly supports it.
9. **Image and brand ingestion:** included in v1. Images/logos may inform palette extraction, typography mood, decorative direction, but not drive copying of layouts or branded compositions.
10. **Accessibility bar:** WCAG AA required for critical text pairs. Extended contrast + coherence checks run as warnings.
11. **Preview step:** mandatory canonical preview deck build before export. Every generated theme must pass.
12. **AI boundary:** AI interprets brief, summarizes mood, chooses bounded style modules. Does **not** hand-author token bridge, derived values, or freeform CSS.

## Architecture Overview

### Package layout
**New package:** `packages/create-theme/`

Modules:
- `brief/` — parses prompt, brand text, optional images into `ThemeRecipe`
- `archetypes/` — base theme templates + bounded style modules
- `tokens/` — canonical token contract, tier metadata, deterministic compiler
- `descriptor/` — markdown descriptor generator
- `preview/` — canonical preview deck builder + screenshot runner
- `validate/` — required checks + warning heuristics
- `export/` — local deck export now; curated/package export later

### Pipeline

```
Prompt + structured inputs + optional images
→ ThemeRecipe normalization
→ Archetype selection
→ Palette extraction and typography direction
→ Deterministic token compilation
→ Deterministic derived-token generation
→ Bounded style-module application
→ Descriptor generation (same compiled model)
→ Validation
→ Canonical preview build + screenshots
→ Export
```

### Source of truth

**`theme.recipe.json`** — normalized source brief and selected options (creator-owned)

**`theme.manifest.json`** — generator version, archetype, export target, timestamps, provenance, validation summary (creator-owned)

**CSS + descriptor** — runtime-facing outputs (generated from recipe + manifest)

### File formats

#### Local deck export layout (v1 primary)

```
src/themes/<theme-id>.css
src/themes/descriptors/<theme-id>.md
.deckio/themes/<theme-id>/theme.recipe.json
.deckio/themes/<theme-id>/theme.manifest.json
.deckio/themes/<theme-id>/validation.json
.deckio/themes/<theme-id>/previews/*.png
```

- `src/themes/` holds runtime-facing files the deck imports
- `.deckio/themes/` holds creator metadata, validation, screenshots
- `src/main.jsx` imports `./themes/<theme-id>.css`
- `deck.config.js` stores `theme: './src/themes/<theme-id>.css'`

#### Curated reusable export layout (architected now, deferred operationally)

```
packages/deck-engine/themes/<theme-id>.css
packages/deck-engine/themes/descriptors/<theme-id>.md
packages/deck-engine/themes/descriptors/previews/<theme-id>/*.png
packages/deck-engine/themes/meta/<theme-id>.manifest.json
```

Compiler and exporter already structured for both layouts; same compiled theme model targets both.

## v1 Scope

### Ships in v1
1. `@deckio/create-theme` CLI/library
2. Local deck export as primary workflow
3. Theme generation from: text brief, structured brand fields, optional image/logo/brand-board inputs
4. Four visual archetype families: dark, light, shadcn-inspired, expressive/funky-punk-inspired
5. Deterministic token compiler with bounded style modules
6. Atomic generation: CSS theme, descriptor, recipe, manifest, validation report, preview screenshots
7. Required canonical preview build before export
8. Required WCAG AA validation on critical text pairs
9. Thin `create-deckio` integration for advanced/maintainer flow
10. Skill/instruction updates for local custom theme descriptor discovery

### Explicit v1 non-goals
- no runtime theme marketplace
- no live runtime theme switching project
- no arbitrary AI-written CSS blocks
- no automatic promotion into built-in themes
- no org-level theme registry UX
- no promise of actual shadcn component compatibility

## Token Contract (Rule Set)

### Rule 1 — Model the contract in tiers, export the contract in full

| Contract class | Meaning | v1 policy |
|---|---|---|
| **Required identity tokens** | Define theme's look; missing token = visual breakage | Must exist; validation fails if missing |
| **Derived invariant tokens** | Must stay coherent with identity; never chosen independently | Compiler-generated, not AI-authored |
| **Optional override tokens** | Structural defaults that may inherit from archetype | Optional in recipe, explicit in final export |

### Rule 2 — Exported CSS is always canonical and complete

- **Recipe** may omit structural overrides
- **Compiler** may inherit from archetype
- **Exported CSS** still writes full canonical token surface for portability

In practice:
- Tier 1 correctness tokens: required
- Tier 2 personality/coherence tokens: required in compiled output (even if derived)
- Tier 3 structural tokens: optional in author input, explicit in export

### Rule 3 — Derived tokens are not user-authored in v1

Deterministically derived:
- primary-foreground and foreground-on-fill pairs
- surface overlays
- glow tokens
- tint ramps and border emphasis
- color-scheme
- Tailwind @theme inline bridge mappings

Prevents "choose everything independently" chaos.

### Rule 4 — Optional style freedom lives in bounded modules, not open CSS

Non-token CSS through approved modules only:
- typography treatment
- heading treatment
- accent/decor treatment
- link treatment
- card treatment
- ambient texture/overlay treatment

Each module exposes small parameters; no freeform CSS escape hatch in v1.

## Validation Pipeline

### Required checks — export fails on any error

1. **Recipe schema validation** — valid id/slug, supported archetype, supported export target, image assets readable
2. **Token contract compilation** — required identity tokens resolved, derived tokens generated, final token map complete
3. **CSS structure validation** — one top-level unlayered `:root`, no `@layer` in theme CSS, valid CSS values, fixed `@import "tailwindcss"`, fixed `@theme inline`
4. **Accessibility validation** — foreground/background WCAG AA, primary-foreground/primary WCAG AA, card-foreground/card WCAG AA
5. **Color-system validation** — color-scheme matches luminance intent, derived overlays/glows from same base system
6. **Descriptor validation** — descriptor in required schema, CSS and descriptor emitted atomically
7. **Canonical preview build** — preview builds, screenshots render successfully

### Warning checks — export succeeds with warnings

- extended contrast pairs (secondary, accent, muted, callout surfaces)
- projector-risk heuristics (very low luminance, over-saturation)
- font fallback/licensing warnings
- overlay/glow aggressiveness
- extreme radius/spacing/typography overrides
- low-confidence image extraction or ambiguous brand input

### Canonical preview deck

Fixed 6-slide set exercising:
1. Title/hero slide
2. Content-frame with dense text
3. Cards/grid surface
4. Data/callout slide
5. Image-led or full-bleed composition
6. Closing/CTA slide

Not optional fluff — proof that theme survives contact with real slide surface.

## Integration Points

### Scaffolder (`packages/create-deckio/`)

Stays simple, prioritizes built-in themes for normal users:
- add advanced path: "create custom theme"
- call `@deckio/create-theme`
- write local artifacts into `src/themes/`
- write creator metadata into `.deckio/themes/`
- update `deck.config.js`
- update `src/main.jsx`

Should **not** absorb theme-generation logic.

### Engine (`packages/deck-engine/`)

Runtime responsibilities small:
- keep consuming CSS custom properties
- keep `theme` and `designSystem` as separate axes
- accept local theme CSS paths via existing custom-theme behavior
- stay agnostic to generated vs. hand-authored themes
- expose canonical token contract so creator and engine tests validate against same source

### Skills and descriptors

Descriptors remain first-class:
- skills/instructions resolve local descriptors at `src/themes/descriptors/<theme-id>.md` when `deck.config.js` points to local theme CSS
- built-in descriptor fallback for default themes
- generated descriptors use same structure as built-in descriptors
- `designSystem` defaults to `default` for generated themes unless stronger future contract says otherwise

## Deferred to v2

- curated reusable theme promotion workflow
- org-scoped theme libraries
- marketplace/discovery UI
- approval workflow for promoting generated theme as built-in
- true shadcn-compatible output mode
- watch mode / iterative live regeneration
- cross-project theme registry and version pinning
- policy tooling for brand/IP review beyond warnings

## Implementation Order

1. Formalize token contract (canonical list, tier metadata, shared code + tests)
2. Define canonical preview deck (6-slide set, screenshot harness)
3. Create `packages/create-theme/` package
4. Build deterministic compiler (palette → tokens → CSS)
5. Generate descriptors atomically (same compiled model)
6. Implement validation (required gates, warning heuristics)
7. Integrate local theme workflow (create-deckio, deck.config.js, main.jsx, skills)
8. Add image/brand ingestion (palette extraction, typography hints)
9. Prepare v2 promotion path (exporter abstraction, curated target disabled until ready)

## Bottom Line

v1 ships as a **maintainer-first, authoring-time theme creator** that generates **local, engine-compatible themes** with **complete canonical token export**, **mandatory descriptor**, **required preview build**, and **required WCAG AA checks on critical pairs**. Runtime stays simple, scaffolder stays thin, output stays portable, system architected for curated reusable themes later.

---

### 2026-03-14T00:46Z: User Directive — Owner decisions on theme creator architecture
**By:** Ali Soliman (via Copilot) | **Date:** 2026-03-14 | **Status:** Implemented

Owner input on open questions from theme creator design meeting. All points incorporated into ARCH-004.

1. **v1 user:** Monorepo maintainers first. End users get first-class defaults. Architect for future org/user curation.
2. **Output priority:** Local deck themes first. Curated reusable themes later — but architect for it now.
3. **Expressiveness:** Full range — user should have a choice (safe corporate through funky-punk).
4. **shadcn:** Visual vibe only, not actual compatibility. Popular with devs but not a hard requirement.
5. **Image/brand ingestion:** Yes, include in v1.
6. **Accessibility bar:** Team's call. WCAG AA on critical pairs confirmed as acceptable bar.
7. **Preview screenshots:** Team's call. Required mandatory canonical preview build confirmed.

**Why captured:** Owner input on open questions from theme creator design meeting.


---

### SHADCN-001: Real shadcn/ui Component Integration
**Author:** Rusty | **Date:** 2026-03-15 | **Status:** Scoping / ready for implementation planning

DECKIO already has a shadcn-looking theme and partial scaffold but **not** real shadcn authoring end to end. The gap is: **turn shadcn from a visual style into an actual component ecosystem path for decks** while keeping the engine lean and not breaking existing CSS-themed decks.

#### Current State
- `packages/deck-engine/themes/shadcn.css` is semantic token map + Tailwind v4 bridge, **not** component library
- Descriptor still treats shadcn as CSS-module authoring contract, not real component system
- Scaffolder already has CLI/MCP setup (`components.json`, aliases, ThemeProvider) but no real preinstalled primitives
- Slides still authored mostly through custom JSX + CSS Modules

#### What "Real shadcn" Means
1. Fresh shadcn deck projects can import real components from `@/components/ui/*` immediately
2. Those files are actual shadcn/ui source, not lookalikes
3. Projects can continue pulling more components via `npx shadcn@latest add ...`
4. MCP-based tooling can discover/add components against that registry structure
5. Starter slides and docs demonstrate component-native composition

#### Recommended Starter Set
Presentation-relevant preinstalled: `button`, `card`, `badge`, `separator`, `alert`  
Lower-priority (CLI/MCP expansion): `dialog`, `sheet`, `tooltip`, `input`, form primitives

#### Architecture Impact (Non-Negotiables)
1. **Engine package remains lean** — stays runtime primitives only, no bundled UI kit
2. **No breaking changes** — existing CSS-authored decks remain valid, new ones get real components
3. **`theme` and `designSystem` separate** — separation becomes more important, not less
4. **Design-system supplement layer** — activate when `designSystem: 'shadcn'`, orthogonal to theme choice
5. **Verify end to end** — scaffold → install → dev → build must work for real

#### Implementation Phases
1. **Phase 0:** Contract cleanup, audit CSS entry/Tailwind setup, make docs truthful
2. **Phase 1:** Scaffold curated starter components, update starter slides, E2E verification
3. **Phase 2:** Descriptor/instructions/skills updates, migration examples
4. **Phase 3:** Scaffolder UX refinement, README clarity
5. **Phase 4:** MCP registry integration polish (after local path is proven)

#### Open Questions for Ali (awaiting owner input)
1. Preinstalled component set — recommend Button, Card, Badge, Separator, Alert
2. Scope axis — `theme: 'shadcn'` only or `designSystem: 'shadcn'` independent of theme?
3. Starter slide visual level — more component-native or keep bespoke/editorial?
4. Scaffolding approach — pre-scaffolded source or run shadcn CLI during init?
5. Local wrapper layer — deck-friendly compositions like MetricCard, SectionBadge?
6. MCP in generated README — core promoted workflow or nice-to-have?
7. Descriptor architecture — keep theme-primary or add design-system supplement now?

#### Bottom line
Proceed in phases: clean contract → ship starter set → prove model → upgrade descriptors → polish MCP. Satisfies "immediately but carefully and methodically" directive. Preserves backwards compatibility, keeps engine lean, establishes foundation for future design system work.

Full scope: `.squad/decisions/inbox/rusty-shadcn-component-integration.md` (migrated from inbox)

---

### 2026-03-14T00:53Z: Owner directive — shadcn is real compatibility, not just visual vibe
**By:** Ali Soliman (via Copilot) | **Date:** 2026-03-14 | **Status:** Implemented

When the theme creator offers a shadcn option, it must use actual shadcn/ui design system and components, not just visual aesthetic. `designSystem: shadcn` should mean real shadcn compatibility.

---

### 2026-03-14T00:56Z: Owner directive — rebuild shadcn theme to use real shadcn/ui components
**By:** Ali Soliman (via Copilot) | **Date:** 2026-03-14 | **Status:** Implemented

Current shadcn theme uses clever CSS that looks like shadcn but doesn't actually use shadcn/ui components. Rebuild it to use real shadcn components. Devs who build on shadcn should have a native experience — they should be able to use shadcn MCPs to pull components. Tackle immediately but carefully and methodically.

**Why:** Owner directive — shadcn is not just a visual vibe, it's a real design system integration.

---

### 2026-03-14T01:08Z: Owner decisions on shadcn component integration
**By:** Ali Soliman (via Copilot) | **Date:** 2026-03-14 | **Status:** Implemented

Owner answers to 7 open questions from SHADCN-001 scoping:
1. **Starter components:** shadcn Button, Card, Badge, Separator, Alert PLUS relevant ReactBits components for initial template
2. **Design system axis:** Tie to `designSystem: 'shadcn'` independent of theme choice
3. **Component-native slides:** Yes — starter slides should use real components, less bespoke CSS
4. **Pre-scaffold approach:** Deterministic pre-scaffolded source for starters, CLI/MCP for expansion
5. **Deck-friendly wrappers:** Yes (implied by component-native slides)
6. **MCP authoring:** Core promoted workflow (implied by original directive)
7. **Design-system supplement layer:** Yes, now is the time (implied by "prerequisite to design system work")

**Why:** Owner input unblocks Phase 0 implementation.

