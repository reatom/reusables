# Contributing

## Adding or changing a reusable

Each item lives under `src/reusables/<group>/` as a set of files: the
implementation (`.ts`), a doc (`.md`), tests (`.test.ts`, or `.browser.test.ts`
/ `.node.test.ts` when the split matters), an example, and a `.meta.ts` that
registers the item.

Before opening a PR:

```bash
pnpm format        # prettier
pnpm test          # node + headless chromium
```

## Do not commit `registry.json`

`registry.json` is a **generated** file (`pnpm jsrepo:build`). Do not edit or
commit it in your PR — it changes on every item and would conflict across
parallel PRs.

CI on a pull request only **warns** if the committed `registry.json` is stale.
When your PR is ready to merge, a maintainer regenerates and commits it for you:

- Comment **`/rebuild-registry`** on the PR (maintainers only). A workflow
  rebuilds `registry.json` on your branch and pushes the result.
- If your branch is behind `main`, update it first (so the rebuild reflects
  items already merged), then run `/rebuild-registry`.

On `main`, `registry.json` must always be in sync — CI there fails if it is not.
