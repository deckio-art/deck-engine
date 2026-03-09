# [Deckio](https://deckio.art)

## Get started

Create a new Deckio project with the scaffolder:

```bash
npm create @deckio/deck-project cool-deck
npx @deckio/create-deck-project cool-deck
```

This gives you a new Deckio presentation project powered by `@deckio/deck-engine`, with the base deck structure, Copilot instructions, and skills already in place.

## How to work on Deckio?

For a smooth ride, use `Dev Containers` locally or use `GitHub Codespaces`. That saves you from installing dependencies yourself. Once the container is up and running, the presentation starts in a simple browser session shared with GitHub Copilot and you can start editing.

If you want to run it directly on your machine:

```bash
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

Typical flow after GitHub Copilot is ready and the presentation is visible in Simple Browser:

1. Ask GitHub Copilot to make the change you want.
2. Let GitHub Copilot update the deck files for you.
3. Review what changed.
4. Look at the presentation and see the result immediately in real time, thanks to hot reload.
5. If something feels off, ask GitHub Copilot to refine it and repeat.

## GitHub Copilot in VS Code

Do not make deck changes by editing code directly unless you really need to. This project is set up so GitHub Copilot in VS Code can do most of the work for you.

Use GitHub Copilot Chat in Agent mode and describe the change you want. You can choose the model you like, but we recommend frontier models, `Claude Opus 4.6` or `GPT-5.3+`, for the best experience.

The optimal flow is achieved with `Claude Opus 4.6` in fast mode.

## What Copilot already knows

This repo includes custom instructions and skills. Copilot already knows what files it should touch and what files it should leave alone.

Useful skills:

- `deck-add-slide` for creating a new slide and wiring it into `deck.config.js`
- `deck-delete-slide` for removing a slide cleanly
- `deck-inspect` for visually checking a rendered slide
- `deck-validate-project` for auditing the whole deck for consistency
- `deck-sketch` for turning a rough whiteboard idea into a real slide
- `deck-generate-image` for generating artwork or icons used in slides

## Prompt examples

Use prompts like these instead of editing files yourself:

- `Add a slide that explains the rollout phases for strategic customers.`
- `Make this slide easier to scan and easier to present.`
- `Remove the speaker invite slide.`
- `Review this deck and fix anything that looks inconsistent or broken.`
- `Create a customer case study slide that fits the style of the rest of the presentation.`
- `Create a new slide based on my sketch.`
- `Inspect the current progress, tell me what looks off, and make visual improvements.`

## GitHub Copilot CLI

Open GitHub Copilot CLI in this repo:

Do you prefer TUIs? This works with GitHub Copilot CLI too.

```bash
gh copilot --yolo
```

## Contributing

Contributions are welcome.

If you find a bug, have a feature request, or see something unclear in the docs, open an issue. Please include enough detail to reproduce the problem, explain the expected behavior, and share relevant screenshots or examples when useful.

If you want to contribute code, submit a pull request. Small, focused PRs are easier to review and merge. For larger changes, open an issue first so the approach can be discussed before implementation.

Before opening a PR:

- make sure the change is scoped and well explained
- update docs when behavior or developer workflow changes
- include tests or validation steps when they are relevant

Whether you are reporting issues, improving docs, or sending code, thank you for helping make Deckio better.

## Release automation

This repo publishes both public packages automatically from GitHub Actions when changes land on `main`:

- `@deckio/deck-engine`
- `@deckio/create-deck-project`

Publishing is version-based. The workflow checks npm first and only publishes a package if the version in that package's `package.json` is not already present on npm.

GitHub repository secrets required:

- None

This workflow is set up for npm trusted publishing via GitHub Actions OIDC instead of an `NPM_TOKEN`.

One-time npm setup required outside GitHub:

- Configure npm trusted publishing for `@deckio/deck-engine`
- Configure npm trusted publishing for `@deckio/create-deck-project`
- Point both packages at this repository and the `.github/workflows/publish-engine.yml` workflow on the `main` branch

Once trusted publishing is configured in npm, merges to `main` can publish new package versions without storing npm credentials in GitHub.