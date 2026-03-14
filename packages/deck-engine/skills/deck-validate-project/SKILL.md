---
name: deck-validate-project
description: Validate and audit a deck project for correctness. Use this when asked to validate, audit, polish, review, check, or verify slides.
---

# Validate & Audit a Deck Project

## Step 0 — Read `deck.config.js`

Open `deck.config.js` and read:

- `theme`
- `designSystem`
- `slides`

Then resolve the active theme descriptor using the same rules as `deck-add-slide`:

- Built-ins: read `dark.md`, `light.md`, or `shadcn.md` from the engine package descriptors folder
- Custom themes: read the project's custom `descriptor.md` or `*.descriptor.md`
- If no custom descriptor exists, fall back to the built-in descriptor implied by `designSystem`

Use the descriptor as the source of truth for required structure, required tokens, allowed components, decorative elements, and anti-patterns.

## Step 1: Audit `deck.config.js`

Verify:

1. Every imported slide resolves to an existing file in `src/slides/`
2. Every imported slide appears in the `slides` array
3. There are no unused imports or undefined slide entries
4. `slides` is non-empty
5. `theme` and `designSystem` were not changed accidentally during unrelated work

## Step 2: Validate slide structure against the descriptor

For each slide `.jsx` file in `src/slides/`, check:

### Common checks (all themes)

- [ ] Imports `{ Slide, BottomBar }` from `'@deckio/deck-engine'`
- [ ] Uses `<Slide index={index} className={styles.xxx}>`
- [ ] Uses a wrapper that includes `content-frame content-gutter`
- [ ] Places `<BottomBar />` as the last child inside `<Slide>`
- [ ] Uses consistent `BottomBar text` across slides

### Descriptor-driven checks

Read the descriptor and verify the slide matches:

- its **Exact JSX skeleton**
- its **Decorative elements available** section
- its **Available components** section
- its **Anti-patterns** section

Examples:

- If the descriptor requires `accent-bar` and orbs, those must be present
- If the descriptor forbids `accent-bar`, `orb`, or deep-space ornament, they must be absent
- If the descriptor allows shadcn / ReactBits imports, imports must stay inside that ecosystem

## Step 3: Validate CSS against the descriptor

For each `.module.css` file, check:

### Common checks (all themes)

- [ ] Root class includes `padding: 0 0 44px 0`
- [ ] No `flex: 1` on the body wrapper
- [ ] No redundant `flex-direction: column` on the slide root
- [ ] No obvious overflow-causing patterns

### Descriptor-driven checks

Read the descriptor and verify the CSS matches:

- its **Exact CSS skeleton**
- its **Token table**
- its **Anti-patterns**

Examples:

- If the descriptor requires `var(--background)`, `var(--card)`, `var(--border)`, or other semantic tokens, use those exact names
- If the descriptor forbids `var(--bg-deep)`, `var(--surface)`, `var(--text)`, or `var(--text-muted)`, flag them
- If the descriptor forbids orb positioning classes or card `::before` bars, flag them

## Step 4: Check companion files

- Every `.jsx` slide in `src/slides/` should have a matching `.module.css`
- No orphaned `.module.css` files without a matching `.jsx`

## Step 5: Validate theme/design-system alignment

Check whether the project configuration and descriptor agree:

- If `designSystem === 'shadcn'`, the project should visually and structurally follow the shadcn descriptor rules
- If `designSystem` is not `'shadcn'`, the project should follow a default DECKIO descriptor such as dark or light
- If the descriptor and `designSystem` disagree, report an **architecture mismatch** even if individual slides render

### When `designSystem === 'shadcn'`: validate preinstalled components

Verify the preinstalled component set is intact:

- [ ] `src/components/ui/button.jsx` exists
- [ ] `src/components/ui/card.jsx` exists
- [ ] `src/components/ui/badge.jsx` exists
- [ ] `src/components/ui/separator.jsx` exists
- [ ] `src/components/ui/alert.jsx` exists
- [ ] `src/lib/utils.js` exists (provides `cn()`)
- [ ] `components.json` exists at project root with correct aliases and registries
- [ ] `.vscode/mcp.json` exists with shadcn MCP server configured
- [ ] `MCP-GUIDE.md` exists at project root
- [ ] ReactBits files exist: `aurora.jsx`, `blur-text.jsx`, `shiny-text.jsx`, `decrypted-text.jsx`, `spotlight-card.jsx` in `src/components/ui/`

If any preinstalled file is missing, report it as a **scaffold integrity issue** — the file may have been accidentally deleted.

### Validate MCP integration

- [ ] `.vscode/mcp.json` exists and contains a `shadcn` server entry
- [ ] `components.json` has `registries` with `@react-bits` configured
- [ ] `components.json` has correct `aliases` (`@/components`, `@/lib/utils`, `@/components/ui`)

If MCP config is missing, the author loses the primary component expansion workflow.

### Validate component usage patterns

For each slide in a shadcn deck, check:

- [ ] Slides use real `<Card>`, `<Badge>`, `<Button>`, `<Alert>`, `<Separator>` imports instead of CSS-imitation divs where applicable
- [ ] No hand-built card-like patterns when the Card component is available
- [ ] No raw `<button>` or `<span className={styles.badge}>` when real components exist
- [ ] CSS Modules focus on layout (grid, spacing, positioning) not component surface styling

## Step 6: Report results

Summarize:

- Active theme detected
- Design system detected
- Descriptor used
- Number of slides validated
- Descriptor mismatches found
- Any issues found and fixed
- Overall project health: **pass** or **issues found**

## Quick checklist

- [ ] Read `theme` and `designSystem`
- [ ] Read the active descriptor
- [ ] If `designSystem === 'shadcn'`: read shadcn supplement instructions
- [ ] If `designSystem === 'shadcn'`: verified preinstalled component files exist
- [ ] If `designSystem === 'shadcn'`: verified MCP config (`.vscode/mcp.json`, `components.json` registries)
- [ ] If `designSystem === 'shadcn'`: verified slides use real components over CSS imitation
- [ ] All `deck.config.js` imports resolve
- [ ] `slides` array matches imports
- [ ] Every `.jsx` slide has a companion `.module.css`
- [ ] All slides match the descriptor and the design system
- [ ] `BottomBar` is present and consistent
- [ ] CSS root classes have required properties
- [ ] No descriptor anti-patterns slipped in
