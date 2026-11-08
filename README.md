# @reatom/reusables

A collection of reusable Reatom factories and extensions distributed via [jsrepo](https://www.jsrepo.dev).

## Development

Use Node 26.13.0 and pnpm 12.18.0, or run `mise install` to install the pinned
versions.

```sh
pnpm install --frozen-lockfile
pnpm exec playwright install chromium
pnpm dev
```

Open http://localhost:4321/reusables/. Run `mise run check` for formatting, types,
Node and browser tests, and production site checks. `pnpm build` regenerates
the registry and builds the website. See [CONTRIBUTING.md](CONTRIBUTING.md)
for the contributor workflow and [remotion/README.md](remotion/README.md)
for the promo video.

## Installation

First, initialize jsrepo in your project:

```bash
npx jsrepo init https://github.com/reatom/reusables
```

## Usage

### Add a specific item

```bash
npx jsrepo add reatomInstance
```

### Add multiple items

```bash
npx jsrepo add reatomInstance withInstance
```

### Interactive mode

Browse and select items interactively:

```bash
npx jsrepo add
```

## Testing

This repository includes a reusable test harness for testing Reatom applications with automatic context management.

### Add the test harness

```bash
npx jsrepo add test
```

The test harness provides:

- Automatic Reatom context management in tests
- Mock subscription utilities for tracking atom updates
- Full Vitest compatibility with enhanced testing capabilities

For detailed documentation, see the [test harness README](src/reusables/test/test.md).

## Documentation

- [jsrepo Documentation](https://www.jsrepo.dev/docs)
- [Reatom Documentation](https://v1000.reatom.dev)

## License

MIT
