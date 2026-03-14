---
name: "cli-ux-review"
description: "How to review scaffolders and TUIs without being fooled by the happy path"
domain: "review"
confidence: "high"
source: "observed"
---

## Context
Use this when reviewing CLI or TUI work, especially scaffolders that claim a polished onboarding flow. The right review is not “does the happy path look nicer now?” — it is “does the tool tell the truth at every step, including slow paths, failure paths, and terminology-heavy choices?”

## Patterns
### Review the real closure artifact, not just the PR title
- Find the PR that references the issue, then inspect any follow-up commits that landed before or shortly after closure.
- For issue reviews, note whether the merge commit alone solved the problem or whether a second patch was needed to make the fix real.

### Check spinner truthfulness
- A loading indicator only counts if it stays active through the whole slow operation.
- If the code stops the spinner before install/init completes, the UX is still lying.
- If blocking calls freeze the spinner, treat that as incomplete even if the labels are correct.

### Read the failure path with the same scrutiny as the success path
- Look for catch blocks and final outros.
- If the tool logs “Ready” after a failed bootstrap, the UX is not top notch no matter how polished the happy path looks.
- Success copy must be gated by actual completion, not by falling off the end of `main()`.

### Enforce terminology integrity
- Prompt labels and options must respect the product model.
- If a prompt says “Design system” but one option is really a theme, call it out. Clean copy with wrong concepts is still bad UX.

### Top-notch UX includes guardrails
- Check for existing-directory handling, cancellation behavior, validation, and clear next steps.
- A slick TUI without overwrite protection or honest failure messaging is only cosmetically improved.

## Examples
- `packages/create-deckio/index.mjs` — staged spinner flow, prompt tree, and final outro are the primary review surface for scaffold UX.
- Issue #2 review pattern: PR #3 improved the copy and stage messaging, but commit `8c117c9` was the patch that fixed the frozen spinner by replacing `execSync` with async `exec`.

## Anti-Patterns
- Reviewing only prompt text and ignoring install/init control flow.
- Treating a merged PR as the complete fix without checking nearby follow-up commits.
- Accepting “top notch” claims when failure paths still emit success copy.
- Ignoring terminology drift between architecture decisions and what the TUI actually asks users.
