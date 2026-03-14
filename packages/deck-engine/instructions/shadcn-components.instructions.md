---
description: "Component reference and migration patterns for shadcn DECKIO decks. Read alongside shadcn-setup.instructions.md when designSystem is shadcn."
applyTo: "**/*"
---

# shadcn Component Reference

Read this file when `deck.config.js` has `designSystem: 'shadcn'`. It complements the setup contract (`shadcn-setup.instructions.md`) with component-specific authoring guidance.

## Component availability matrix

| Component | Status | How to get it | Import path |
|-----------|--------|---------------|-------------|
| `Button` | ✅ Preinstalled | Scaffolded automatically | `'@/components/ui/button'` |
| `Card` | ✅ Preinstalled | Scaffolded automatically | `'@/components/ui/card'` |
| `CardHeader` | ✅ Preinstalled | Scaffolded automatically | `'@/components/ui/card'` |
| `CardTitle` | ✅ Preinstalled | Scaffolded automatically | `'@/components/ui/card'` |
| `CardDescription` | ✅ Preinstalled | Scaffolded automatically | `'@/components/ui/card'` |
| `CardAction` | ✅ Preinstalled | Scaffolded automatically | `'@/components/ui/card'` |
| `CardContent` | ✅ Preinstalled | Scaffolded automatically | `'@/components/ui/card'` |
| `CardFooter` | ✅ Preinstalled | Scaffolded automatically | `'@/components/ui/card'` |
| `Badge` | ✅ Preinstalled | Scaffolded automatically | `'@/components/ui/badge'` |
| `Separator` | ✅ Preinstalled | Scaffolded automatically | `'@/components/ui/separator'` |
| `Alert` | ✅ Preinstalled | Scaffolded automatically | `'@/components/ui/alert'` |
| `Aurora` | ✅ Preinstalled | Scaffolded automatically | `'@/components/ui/aurora'` |
| `BlurText` | ✅ Preinstalled | Scaffolded automatically | `'@/components/ui/blur-text'` |
| `ShinyText` | ✅ Preinstalled | Scaffolded automatically | `'@/components/ui/shiny-text'` |
| `DecryptedText` | ✅ Preinstalled | Scaffolded automatically | `'@/components/ui/decrypted-text'` |
| `SpotlightCard` | ✅ Preinstalled | Scaffolded automatically | `'@/components/ui/spotlight-card'` |
| `Dialog` | ➕ Add first | `npx shadcn@latest add dialog` | `'@/components/ui/dialog'` |
| `Sheet` | ➕ Add first | `npx shadcn@latest add sheet` | `'@/components/ui/sheet'` |
| `Tooltip` | ➕ Add first | `npx shadcn@latest add tooltip` | `'@/components/ui/tooltip'` |
| `Accordion` | ➕ Add first | `npx shadcn@latest add accordion` | `'@/components/ui/accordion'` |
| `Tabs` | ➕ Add first | `npx shadcn@latest add tabs` | `'@/components/ui/tabs'` |
| `Input` | ➕ Add first | `npx shadcn@latest add input` | `'@/components/ui/input'` |
| `Table` | ➕ Add first | `npx shadcn@latest add table` | `'@/components/ui/table'` |
| `Progress` | ➕ Add first | `npx shadcn@latest add progress` | `'@/components/ui/progress'` |
| Any other shadcn | ➕ Add first | `npx shadcn@latest add <name>` | `'@/components/ui/<name>'` |
| Any ReactBits | ➕ Add first | `npx shadcn@latest add @react-bits/<name>` | `'@/components/ui/<name>'` |

### Preinstalled rule

- ✅ components: import directly, no setup needed
- ➕ components: run the CLI command first, **then** import — never import a file that doesn't exist

## Migration patterns: raw markup → real components

When updating slides from CSS-imitation patterns to real components, follow these transformations.

### Card surface

**Before (CSS imitation):**
```jsx
<div className={styles.card}>
  <h3 className={styles.cardTitle}>Title</h3>
  <p className={styles.cardText}>Description</p>
</div>
```
```css
.card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 24px;
}
.cardTitle { color: var(--card-foreground); font-weight: 600; }
.cardText { color: var(--muted-foreground); }
```

**After (real component):**
```jsx
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'

<Card className={styles.metricCard}>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <p>Description</p>
  </CardContent>
</Card>
```
```css
.metricCard {
  /* Only layout-specific overrides — component handles surface, border, radius */
}
```

### Badge / label

**Before (CSS imitation):**
```jsx
<span className={styles.badge}>Phase 1</span>
```
```css
.badge {
  background: var(--secondary);
  color: var(--secondary-foreground);
  padding: 2px 10px;
  border-radius: 9999px;
  font-size: 12px;
  font-weight: 500;
}
```

**After (real component):**
```jsx
import { Badge } from '@/components/ui/badge'

<Badge variant="secondary">Phase 1</Badge>
```

### Action button

**Before (CSS imitation):**
```jsx
<button className={styles.actionBtn}>Get started</button>
```
```css
.actionBtn {
  background: var(--primary);
  color: var(--primary-foreground);
  padding: 10px 20px;
  border-radius: var(--radius);
  border: none;
  font-weight: 500;
  cursor: pointer;
}
```

**After (real component):**
```jsx
import { Button } from '@/components/ui/button'

<Button>Get started</Button>
```

### Alert / callout

**Before (CSS imitation):**
```jsx
<div className={styles.callout}>
  <strong>Important</strong>
  <p>This is a key message for the audience.</p>
</div>
```
```css
.callout {
  background: var(--muted);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 16px;
}
```

**After (real component):**
```jsx
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert'

<Alert>
  <AlertTitle>Important</AlertTitle>
  <AlertDescription>This is a key message for the audience.</AlertDescription>
</Alert>
```

### Divider

**Before (CSS imitation):**
```jsx
<hr className={styles.divider} />
```
```css
.divider {
  border: none;
  border-top: 1px solid var(--border);
  margin: 16px 0;
}
```

**After (real component):**
```jsx
import { Separator } from '@/components/ui/separator'

<Separator />
```

## Component-first authoring decision tree

When building a new slide element in a shadcn deck:

1. **Is there a preinstalled component for this?** → Use it. (`Card`, `Badge`, `Button`, `Alert`, `Separator`)
2. **Is there a preinstalled ReactBits component?** → Use it for motion/effects. (`BlurText`, `SpotlightCard`, etc.)
3. **Would a non-preinstalled shadcn component fit?** → Add it via MCP or CLI, then import.
4. **None of the above?** → Write custom JSX + CSS Module using semantic tokens from the descriptor.

## Expanding with MCP — the primary workflow

**MCP is the recommended way to add components** beyond the preinstalled set. The shadcn MCP server is pre-configured in `.vscode/mcp.json` and gives AI assistants direct access to both the shadcn/ui and ReactBits registries.

### How it works

When an author (or an AI agent acting on behalf of the author) needs a component that isn't preinstalled:

1. **Prompt Copilot** with what you need — e.g., *"Add the Dialog component from shadcn"*
2. The MCP server resolves the component from the registry
3. The component source is written to `src/components/ui/`
4. Import it in your slide: `import { Dialog } from '@/components/ui/dialog'`

### Example prompts for agents and authors

**shadcn/ui components:**
- *"Add the Dialog component from shadcn"*
- *"Add Sheet, Tooltip, and Tabs from shadcn"*
- *"I need a data table — add Table from shadcn"*
- *"Add Accordion from shadcn for collapsible sections"*
- *"What shadcn components would work for a pricing comparison slide?"*

**ReactBits components:**
- *"Add Hyperspeed from React Bits for an animated background"*
- *"Show me available text animations from React Bits"*
- *"Add AnimatedContent from React Bits for scroll reveals"*

### Registry coexistence

Both registries are declared in `components.json` and share the same output directory:

| Registry | CLI syntax | MCP prompt pattern |
|----------|-----------|-------------------|
| **shadcn/ui** | `npx shadcn@latest add dialog` | *"Add Dialog from shadcn"* |
| **ReactBits** | `npx shadcn@latest add @react-bits/code-block` | *"Add code-block from React Bits"* |

They never conflict — shadcn/ui components use Radix primitives and Tailwind, ReactBits components use their own animation systems. Both consume the same `cn()` utility and `@/` path alias.

### CLI fallback

If MCP is unavailable, the CLI produces identical results:

```bash
npx shadcn@latest add dialog sheet tooltip
npx shadcn@latest add @react-bits/animated-content
```

### For agents: when to suggest MCP expansion

When generating slide code that would benefit from a non-preinstalled component:

1. **Don't silently import a component that doesn't exist** — check the preinstalled list above
2. **Suggest the MCP prompt** — e.g., "This slide would benefit from a Dialog. Run: *Add Dialog from shadcn* or `npx shadcn@latest add dialog`"
3. **Then generate the slide code** using the component, noting the dependency

## Design-system supplement discovery

The shadcn design system adds a supplementary authoring layer on top of the theme:

- **Theme descriptor** (`shadcn.md`) → visual language, token contract, slide personality, anti-patterns
- **Setup contract** (`shadcn-setup.instructions.md`) → infrastructure, what's wired, how to verify
- **Component reference** (this file) → what components exist, how to use them, migration patterns

Skills and agents should load all three when `designSystem: 'shadcn'` is detected in `deck.config.js`. The presence of this field is the trigger — there is no separate plugin or runtime discovery mechanism.

### How skills detect the design system

```js
// In deck.config.js
export default {
  // ...
  designSystem: 'shadcn',  // ← triggers component-first authoring
  theme: 'shadcn',          // ← drives visual token set
}
```

When a skill reads `designSystem: 'shadcn'`:
1. Load the theme descriptor for visual rules
2. Load `shadcn-setup.instructions.md` for infrastructure rules
3. Load `shadcn-components.instructions.md` for component authoring rules
4. Prefer real component imports over CSS imitation in all generated code

### Extending the supplement pattern

If a future design system is added (e.g., `designSystem: 'radix'`), the same pattern applies:
- Create `<name>-setup.instructions.md` and `<name>-components.instructions.md`
- Skills check `designSystem` and load the matching supplement files
- Theme descriptors remain independent of the design system choice
