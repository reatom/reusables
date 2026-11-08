# Contributing

## Set up

Use Node 26.13.0 and pnpm 12.18.0. [mise](https://mise.jdx.dev) reads the pinned
versions in `.config/mise.toml`:

```sh
mise install
mise run setup
mise run dev
```

Without mise, install those versions and run:

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm dev
```

The site runs at http://localhost:4321/reusables/. The root workspace includes
the Remotion project, so one install and one lockfile cover both projects.

## Adding or changing a reusable

Each item lives under `src/reusables/<group>/` with its implementation, doc,
tests, example, and `.meta.ts` registration. Use `.browser.test.ts` or
`.node.test.ts` when a test needs a specific runtime. Other `.test.ts` files
run in both Node and Chromium.

Before opening a PR:

```sh
pnpm format
mise run check
```

`check` runs jactionlint, then verifies formatting, site and reusable types, video types, Node and
Chromium tests, the registry and website build, and the built site's routes
and interactions. CI runs these checks on pull requests too. The pre-commit
hook formats staged files only.

For focused work:

```sh
pnpm test:node
pnpm test:browser
pnpm test:browser:ui
pnpm typecheck
pnpm build
pnpm test:site # requires a completed build
```

`mise run check`, `mise run test`, and `mise run build` call the same scripts.
Use `pnpm video:dev` for Remotion Studio and `pnpm video:build` to render the
promo. See [the video README](remotion/README.md).

## Generated registry

`pnpm build` regenerates `registry.json` before building the site, so new
items appear locally without a separate command. Do not hand-edit or commit
`registry.json` in a PR. It changes across parallel contributions.

CI warns when the committed registry is stale on a pull request. Before
merging, a maintainer comments `/rebuild-registry` to regenerate and commit it
on the PR branch. Update the branch from `main` first. For forks, contributors
must run `pnpm jsrepo:build` and commit the result themselves because the
maintainer workflow cannot push to a fork.

On `main`, CI requires the committed registry to match the generated output.

## Dependency updates

Dependabot checks npm dependencies and GitHub Actions weekly. Keep Reatom,
React, Vitest, and Remotion package families aligned. Run `pnpm update -r
--latest`, inspect peer dependencies with `pnpm peers check`, and run
`mise run check`. Commit the root `pnpm-lock.yaml` with dependency changes.

The site uses TypeScript 6 because `astro check` does not support TypeScript 7.
The video project uses TypeScript 7 independently.

## Repository layout

Tool settings and helper scripts live in `.config/`. Root TypeScript, jsrepo,
and Prettier files only forward to those settings for editor and CLI discovery.
The video project uses its own `.config/`. GitHub configuration stays in
`.github/`, where GitHub requires it.

Builds, caches, screenshots, and rendered video live in `.var/`. The install
script links Astro's required `.astro` directory to `.var/astro`. The generated
`registry.json` stays at the root for jsrepo consumers.

Run `mise run lint` to lint workflows and Dependabot with pinned jactionlint.
