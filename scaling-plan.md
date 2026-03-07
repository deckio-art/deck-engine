## Plan: Canvas Engine Extraction — Local Workspace Package

**TL;DR:** Extract shared components (Slide, Navigation, BottomBar, SlideContext, global CSS, GenericThankYouSlide) into a local npm workspace package at `packages/canvas-engine/`. Move the ghcp project from top-level into `src/projects/ghcp/`. Refactor `App.jsx` to dynamically discover projects via `import.meta.glob`. Create a contributor project template. All work on a new `feature/canvas-engine` branch. 6 agent tasks across 2 parallel waves.

---

### Pre-flight (manual, before fleet)

1. Create branch `feature/canvas-engine` from `main`

---

### Wave 1 — 4 parallel agents, all create new files, zero conflict

**Agent A: Create engine package**
- Create `packages/canvas-engine/` with:
  - `package.json` — name `@canvas/engine`, type `module`, exports map for `.`, `./slides/*`, `./components/*`, `./styles/*`, `./vite`
  - `index.js` — re-exports `SlideProvider`, `useSlides`, `Slide`, `Navigation`, `BottomBar`
  - `components/Slide.jsx` — copy from `deck/src/components/Slide.jsx`
  - `components/Navigation.jsx` + `.module.css` — **generalized** version of `deck/src/components/Navigation.jsx`: remove hardcoded ghcp PDF logic, accept optional `pdfPath` prop instead
  - `components/BottomBar.jsx` + `.module.css` — copy from `deck/src/components/BottomBar.jsx`
  - `context/SlideContext.jsx` — copy from `deck/src/context/SlideContext.jsx`
  - `styles/global.css` — copy from `deck/src/styles/global.css`
  - `slides/GenericThankYouSlide.jsx` — copy, update imports to use relative engine paths
  - `scripts/export-pdf.mjs` — copy from `deck/scripts/export-pdf.mjs`
  - `scripts/capture-screen.mjs` — copy from `deck/scripts/capture-screen.mjs`
  - `scripts/generate-image.mjs` — copy from `deck/scripts/generate-image.mjs`

**Agent B: Create ghcp project folder**
- Create `deck/src/projects/ghcp/` containing:
  - `GhcpApp.jsx` — adapted from `deck/src/GhcpApp.jsx`, imports slides from `./` instead of `../slides/`, imports engine components from `@canvas/engine`
  - All 17 slide files + CSS modules copied from `deck/src/slides/` (everything except `GenericThankYouSlide`): `CoverSlide`, `AgendaSlide`, `SelectorSlide`, `OpportunitySlide`, `OpportunitySlideV2`, `IntentSlide`, `ScopeSlide`, `ApproachSlide`, `PresentersSlide`, `GovernanceSlide`, `ThankYouSlide`, `SpeakerInviteSlide`, `CustomerCoverSlide`, `CustomerIntroSlide`, `CustomerGoalsSlide`, `CustomerCommitmentSlide`, `CustomerNextStepsSlide`, `AppendixEmailSlide`
  - Fix all imports: `../components/Slide` → `@canvas/engine`, `../data/` → `../../data/` (one level deeper now)
  - Add `project.config.js` exporting `{ id: 'ghcp', title: 'GitHub Copilot', subtitle: '...', icon: '🤖', accent: '#7c3aed' }` (metadata currently hardcoded in ProjectPicker)

**Agent C: Create project template**
- Create `templates/canvas-project/` containing:
  - `package.json` — depends on `@canvas/engine` (file: reference for now, placeholder for npm later)
  - `vite.config.js` — imports `react` plugin + a `canvasPlugin` from `@canvas/engine/vite`
  - `canvas.config.js` — sample project config `{ id, title, subtitle, icon, accent, slides }`
  - `src/slides/CoverSlide.jsx` + `.module.css` — sample slide using engine imports
  - `src/slides/ThankYouSlide.jsx` — imports `GenericThankYouSlide` from engine
  - `README.md` — contributor quick-start guide (clone, install, dev)
  - `.devcontainer/devcontainer.json` — Codespaces config (node 22, auto-install, auto-start, forward 5173)

**Agent D: Create dynamic project discovery**
- Create `deck/src/utils/projectRegistry.js` — uses `import.meta.glob('../projects/*/project.config.js', { eager: true })` to discover projects, exports `getProjects()` returning array of `{ id, title, subtitle, icon, accent, component }`
- Create `deck/src/AppShell.jsx` — replacement for `App.jsx` that:
  - Uses `import.meta.glob('./projects/*/*.jsx', { eager: true })` to lazily match `<ProjectName>App.jsx` pattern
  - Keeps `VITE_PROJECT` env var support for locked single-project builds
  - Renders `ProjectPicker` when no route selected, renders matched project App component on hash match
  - No static imports of specific projects
- Create `deck/src/projects/dev-plan/project.config.js`, `deck/src/projects/dev-random/project.config.js`, `deck/src/projects/nordcloud-devday/project.config.js` — metadata files for existing projects (extract from current `ProjectPicker.jsx` hardcoded array)

---

### Wave 2 — 2 parallel agents, modify existing files

Depends on Wave 1 completion.

**Agent E: Update existing project imports**
- Modify all `.jsx` files in `deck/src/projects/dev-plan/`, `deck/src/projects/dev-random/`, `deck/src/projects/nordcloud-devday/`:
  - `../../components/Slide` → `@canvas/engine`
  - `../../components/Navigation` → `@canvas/engine`
  - `../../components/BottomBar` → `@canvas/engine`
  - `../../context/SlideContext` → `@canvas/engine`
  - `../../slides/GenericThankYouSlide` → `@canvas/engine/slides/GenericThankYouSlide`
- Verify no broken references after import changes

**Agent F: Wire workspace + cleanup old files**
- Update root `package.json` — add `"workspaces": ["packages/*", "deck"]`
- Update `deck/package.json` — add `"@canvas/engine": "workspace:*"` to dependencies
- Replace `deck/src/App.jsx` content with `AppShell.jsx` content (dynamic discovery version from Wave 1)
- Refactor `deck/src/ProjectPicker.jsx` — import project list from `utils/projectRegistry.js` instead of hardcoded array
- Delete `deck/src/GhcpApp.jsx` (moved to projects/ghcp/)
- Delete all slide files from `deck/src/slides/` (moved to projects/ghcp/ and engine)
- Update `.gitignore` — no new entries needed yet (private repo split comes later)
- Update `deck/src/main.jsx` — import `global.css` from `@canvas/engine/styles/global.css` instead of `./styles/global.css`

---

### Verification

After Wave 2 completes:
1. Run `npm install` from workspace root — verify workspace linking works
2. Run `cd deck && npx vite --port 5175` — verify dev server starts
3. Open browser → verify ProjectPicker shows all 4 projects dynamically
4. Navigate to each project → verify slides render correctly
5. Edit a slide → verify hot reload works
6. Press Escape → verify return to ProjectPicker

---

### Decisions

- **Local workspace** over npm publish: simpler start, no auth needed, publish path available later
- **ghcp normalized**: moves to `projects/ghcp/` so all projects follow identical structure
- **`import.meta.glob`** for project discovery: Vite-native, no manual registration needed — adding a project is just adding a folder
- **`project.config.js`** per project: carries metadata (title, icon, accent) so ProjectPicker discovers them automatically
- **Deferred**: Skills update, contributor devcontainer testing, npm publishing pipeline — next iteration
