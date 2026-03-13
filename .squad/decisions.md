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

### THEME-002: SlideContext Theme Integration
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

---

### CLI-001: Version Bump + Export Map Fix for Tailwind Plugin
**Author:** Basher | **Date:** 2026-03-14 | **Status:** Implemented

1. **Engine version bumped `1.8.2` → `1.9.0`** — the theme/tailwind work from THEME-001 was never reflected in a version bump, so downstream `npm install` fetched old v1.8.2 without `tailwindPlugin`. Next publish must use this version or higher.
2. **Exports map includes both `./vite` and `./vite.js`** — Vite's resolver sometimes appends `.js` to the specifier. Both paths now resolve to `vite.js`.
3. **Scaffolder dep updated `^1.8.2` → `^1.9.0`** — ensures scaffolded projects pull the version that has tailwind/theme support.
4. **Default accent color changed `#3fb950` → `#6366f1`** — indigo-500 is more modern, works well across all three themes. Previous GitHub green was too brand-specific.
5. **CLI uses ANSI colors, no external dependencies** — decided against `gum` (charmbracelet) to avoid requiring a separate binary install. Pure ANSI escape codes via a `fmt` helper in `index.mjs`. Keeps the scaffolder zero-dependency.

**Key files:**
- `packages/deck-engine/package.json` — version + exports map
- `packages/create-deckio/utils.mjs` — scaffolded dep version
- `packages/create-deckio/index.mjs` — CLI prompts, colors, swatch preview

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

### CLI-002: TUI Overhaul + Color Presets + ReactBits Registry
**Author:** Basher | **Date:** 2026-03-14 | **Status:** Implemented

1. **@clack/prompts replaces readline** — first runtime dependency of create-deckio. Provides `intro()`, `text()`, `select()`, `confirm()`, `spinner()`, `outro()`. Handles Ctrl+C gracefully via `isCancel()`. Non-interactive mode (env vars + piped stdin) preserved.
2. **Color presets replace raw hex input** — 8 curated colors (Indigo, Emerald, Rose, Amber, Cyan, Violet, Orange, Blue) as `clack.select()` with true-color ANSI swatches. "Custom hex" option with validation for freeform input. Default: Indigo (#6366f1). `COLOR_PRESETS` exported from `utils.mjs` for testability.
3. **ReactBits registry in components.json** — `registries: { "@react-bits": "https://reactbits.dev/r/{name}.json" }` enables `npx shadcn add @react-bits/animated-content` in shadcn-enabled projects. Zero architecture change — uses shadcn's built-in registry protocol.
4. **`spinner()` wraps npm install** — replaces `stdio: 'inherit'` with `stdio: 'pipe'` + spinner animation. Cleaner output, same error handling.

**Key files:**
- `packages/create-deckio/package.json` — added `@clack/prompts` dependency
- `packages/create-deckio/index.mjs` — full TUI rewrite
- `packages/create-deckio/utils.mjs` — `COLOR_PRESETS` export, `registries` in `componentsJson()`

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
2. **CLI flow is lean** — only asks about shadcn components when `theme: "shadcn"` is selected. Dark/light users see no extra prompts. Default is Yes when asked.
3. **Pre-generated files, not `npx shadcn init`** — generates `components.json`, `src/lib/utils.js`, `jsconfig.json`, and the Vite `@` alias. Running `npx shadcn init` is interactive and fragile; pre-generation is faster and deterministic.
4. **`jsconfig.json` is required** — shadcn CLI fails without it. Needs the `@/*` path mapping to resolve `@/lib/utils` and `@/components/ui/*`.
5. **`tsx: false`, `rsc: false`** — DECKIO uses JSX (not TypeScript) and has no React Server Components. shadcn CLI generates `.jsx` accordingly.
6. **ReactBits registry in `components.json`** — `registries: { "@react-bits": "https://reactbits.dev/r/{name}.json" }` enables `npx shadcn add @react-bits/animated-content` in shadcn-enabled projects.
7. **Non-interactive mode** — reads `DECK_DESIGN_SYSTEM` env var. When `theme: "shadcn"` and no env var set, defaults to `"shadcn"` design system.
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

1. **`designSystem` drives template selection** — when `designSystem: "shadcn"`, the scaffolder emits distinct CoverSlide and ThankYouSlide templates. Dark/light themes use the original orb/glow aesthetic unchanged.
2. **shadcn CoverSlide removes orbs entirely** — no gradient orbs, no accent-bar. Replaced with a pill badge (pulsing dot + project slug), shimmer accent line, gradient-shift title, and clean card-style meta bar. All CSS uses semantic tokens (`--background`, `--foreground`, `--card`, `--border`, `--radius`, `--muted-foreground`, `--secondary`).
3. **shadcn ThankYouSlide is a local file** — dark/light themes reuse the engine's `GenericThankYouSlide` (with glows/streaks). shadcn generates a local `ThankYouSlide.jsx` + `.module.css` with animated gradient text, clean divider, no orbs/streaks. `deckConfig()` imports accordingly.
4. **ReactBits as inspiration, not dependency** — animations (gradient-shift, shimmer, pulse) are pure CSS, inspired by ReactBits' style. Each generated file includes a comment teaching users how to install ReactBits components (`// 💡 Add animated components: npx shadcn add @react-bits/animated-content`). Starter slides work without any ReactBits installation.
5. **New exports from `utils.mjs`** — `coverSlideJsxShadcn()`, `COVER_SLIDE_CSS_SHADCN`, `thankYouSlideJsxShadcn()`, `THANK_YOU_SLIDE_CSS_SHADCN`. All testable as pure functions.

**Key files:**
- `packages/create-deckio/utils.mjs` — shadcn template functions + CSS constants
- `packages/create-deckio/index.mjs` — conditional template selection

---

### DARK-001: Dark/Light Mode for shadcn Design System
**Author:** Basher | **Date:** 2026-03-15 | **Status:** Implemented

1. **Only for `designSystem: "shadcn"`** — dark/light single-mode themes don't get ThemeProvider or ModeToggle. They're already committed to one visual mode.
2. **Uses shadcn's official Vite pattern** — `.dark` class on `<html>` element toggles CSS variable overrides. No runtime CSS file switching needed.
3. **Two-layer architecture** — `data-theme="shadcn"` (from SlideProvider) is the theme identity; `.dark` class is the mode within that theme. They're orthogonal and don't conflict.
4. **ThemeProvider and ModeToggle are scaffolded files, not engine exports** — they live in the generated project at `src/components/`. This keeps the engine lean and avoids a browser/Node boundary issue with localStorage.
5. **Default mode is light** — `<ThemeProvider defaultTheme="light">`. Users can toggle to dark or system mode via the ModeToggle button.
6. **ModeToggle is unobtrusive** — fixed-position bottom-right, low opacity, inline SVG icons. No external icon library dependency.
7. **localStorage persistence** — mode survives page reloads via `deckio-ui-theme` key. System mode tracks `prefers-color-scheme`.
8. **`APP_JSX` constant replaced with `appJsx()` function** — now conditional on `designSystem`. Non-shadcn projects get the same output as before (no ThemeProvider/ModeToggle).

**Key files:**
- `packages/deck-engine/themes/shadcn.css` — `:root` (light) + `.dark` (dark) token blocks
- `packages/create-deckio/utils.mjs` — `themeProviderJsx()`, `modeToggleJsx()`, `appJsx()`
- `packages/create-deckio/index.mjs` — writes theme-provider.jsx, mode-toggle.jsx, conditional App.jsx

---

## Governance

- All meaningful changes require team consensus
- Document architectural decisions here
- Keep history focused on work, decisions focused on direction
