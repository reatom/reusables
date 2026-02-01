# @reatom/reusables

A collection of reusable Reatom factories and extensions distributed via [jsrepo](https://www.jsrepo.dev).

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
