# Copilot Instructions — deck-engine monorepo

## Repository overview

This monorepo contains two npm packages:

| Package | Path | Registry |
|---|---|---|
| `@deckio/deck-engine` | `packages/deck-engine` | npm (public) |
| `@deckio/create-deck-project` | `packages/create-deckio` | npm (public) |

Publishing is automated via `.github/workflows/publish-engine.yml`. Any push to `main` that touches a package directory triggers a publish **only if** the version in `package.json` doesn't already exist on npm.

---

## Versioning policy

This project follows [Semantic Versioning 2.0.0](https://semver.org/).

### Version format: `MAJOR.MINOR.PATCH`

| Segment | When to bump | Who decides |
|---|---|---|
| **MAJOR** (e.g. 0.x → 1.0, 1.x → 2.0) | Breaking changes: removed/renamed exports, changed public API signatures, dropped Node/React version support, incompatible config changes | **Human only** — never bump major automatically. Always ask the maintainer for explicit approval. |
| **MINOR** (e.g. 0.1.x → 0.2.0) | New features, new exports, new slide/component types, new themes, new CLI flags, significant non-breaking enhancements | Copilot may **recommend** a minor bump. Apply it if the changeset clearly adds functionality without breaking existing consumers. |
| **PATCH** (e.g. 0.1.0 → 0.1.1) | Bug fixes, typo corrections, CSS tweaks, documentation-only changes, dependency updates that don't change public API, refactors with no behavior change | Copilot may apply a patch bump directly when the change is clearly a fix or non-functional improvement. |

### Decision rules for Copilot

1. **Assess every change** against the table above before touching `version` in `package.json`.
2. **When in doubt, choose the lower bump** (prefer patch over minor) and flag it for human review.
3. **Never bump major version** — always ask: _"This looks like a breaking change. Should I bump the major version?"_
4. **Bump versions independently** — each package has its own version. Only bump the package that actually changed.
5. **Pre-1.0 packages** (`0.x.y`): treat minor bumps as potentially breaking per semver convention. Be extra cautious — prefer patch unless new public API surface is added.
6. **Update `package-lock.json`** after any version change by running `npm install` from the repo root.

### Version bump checklist

Before bumping a version, verify:

- [ ] The package actually has source changes (not just unrelated files).
- [ ] The chosen bump level matches the change type.
- [ ] Release notes are written (see below).
- [ ] No other in-flight version bump conflicts exist.

---

## Release notes

Every version bump **should** be accompanied by a release notes entry. If a curated file is present, it's used for the GitHub Release. If not, basic notes are auto-generated from recent commits (but curated notes are always preferred).

### Automation

The `publish-engine.yml` workflow handles everything after push to `main`:

1. **npm publish** — publishes the package if the version is new.
2. **GitHub Release** — creates a tagged release with:
   - The curated `releases/<package>/v<VERSION>.md` file if it exists.
   - An auto-generated summary from recent commits if no curated file is found.

Tags follow the pattern `<package-dir>/v<VERSION>` (e.g. `deck-engine/v0.1.0`, `create-deck-project/v1.0.6`).

### When are release notes produced?

| Who | When | What |
|---|---|---|
| **Copilot / Developer** | During the version bump, before pushing | Write the curated `releases/<package>/v<VERSION>.md` file |
| **GitHub Actions** | After successful npm publish | Creates the GitHub Release + tag automatically |

### File location

```
releases/
  deck-engine/
    v0.1.0.md
    v0.1.1.md
  create-deck-project/
    v1.0.5.md
    v1.0.6.md
```

### Release note template

Use this format for every release:

```markdown
# <Package Name> v<VERSION>

**Released:** <YYYY-MM-DD>

## What changed

### Added
- <New feature or capability>

### Changed
- <Non-breaking change to existing functionality>

### Fixed
- <Bug fix description>

### Removed
- <Removed feature (breaking — requires major bump)>

### Dependencies
- <Dependency update summary, if relevant>

## Upgrade guide

<If minor or major: brief migration/adoption notes. For patch: "No action required.">

## Contributors

- <@github-handle or name>
```

### Rules for writing release notes

1. **Keep entries concise** — one line per change, written from the consumer's perspective.
2. **Use present tense** — "Add theme support" not "Added theme support."
3. **Reference issues/PRs** where applicable — `Fix navigation overflow (#42)`.
4. **Group by category** — use the Added/Changed/Fixed/Removed/Dependencies sections. Omit empty sections.
5. **For patch releases** with a single fix, a simplified note is fine — skip empty sections.

---

## Workflow summary

When making changes that warrant a release:

1. Make the code changes.
2. Determine the bump level (patch / minor / major-needs-human).
3. Update `version` in the affected `package.json`.
4. Run `npm install` at the repo root to sync `package-lock.json`.
5. Create the release notes file in `releases/<package-name>/v<VERSION>.md`.
6. Commit all changes together with message: `release: <package-name> v<VERSION>`.
7. Push to `main` — the publish workflow handles the rest.
