# Test Harness

A reusable testing utilities on top of Vitest API for Reatom applications that provides enhanced testing capabilities with automatic context management and subscription mocking.

> **Note**: This reusable is built on top of Vitest, but you may choose to rewrite it to work with other test runners.

## Usage

After installation, import the test utilities:

```typescript
import { test, expect, subscribe } from './src/reatom/test'
```

Or use an alias (see Configuration section):

```typescript
import { test, expect, subscribe } from 'test'
```

## Features

- **Automatic Context Management**: Test functions are automatically wrapped in `context.start()`, eliminating "missed context" errors
- **Context Isolation**: Each test runs in a fresh context, preventing state leakage between tests
- **Mock Subscriptions**: Track atom updates using Vitest's mock functionality
- **Full Vitest Compatibility**: All standard Vitest utilities are re-exported for convenience

## API Reference

### test()

Enhanced version of Vitest's `test` function that automatically wraps test callbacks in Reatom's context.

> **NOTE**: the test methods (`test.skip`, `test.each` and so on) are not supported, use `viTest` export for this cases (`viTest.skip`, `viTest.each` and so on)

**Signature:**

```typescript
test(name: string, fn: () => void | Promise<void>): void
```

**Example:**

```typescript
import { test, expect } from 'test'
import { atom } from '@reatom/core'

test('atom updates correctly', () => {
  const counter = atom(0, 'counter')
  counter.set(5)
  expect(counter()).toBe(5)
})
```

**Key Benefits:**

- No need to manually call `context.start()`
- Automatic context isolation between tests
- Works with both sync and async tests
- Preserves all Vitest functionality

### subscribe()

Creates a mock subscriber for an atom that tracks all updates using Vitest's mock functionality.
Listeners are called on the next tick after the atom is updated, capturing batched updates.

**Signature:**

```typescript
subscribe<State, T extends (state: State) => any>(
  target: AtomLike<State>,
  cb?: T
): Mock<T> & { unsubscribe: Unsubscribe }
```

**Parameters:**

- `target`: The Reatom atom or computed value to subscribe to
- `cb`: Optional callback function to execute on each update (defaults to `noop`)

**Returns:**
A Vitest mock function with an attached `unsubscribe` method

**Example:**

```typescript
import { test, expect, subscribe } from 'test'
import { atom, sleep, wrap } from '@reatom/core'

test('subscribe captures batched updates', async () => {
  const counter = atom(0, 'counter')
  const sub = subscribe(counter)

  counter.set(1)
  await wrap(sleep())
  counter.set(2)
  await wrap(sleep())
  counter.set(3)
  counter.set(4)
  await wrap(sleep())

  expect(sub).toHaveBeenCalledTimes(4)
  expect(sub).toHaveBeenLastCalledWith(4)
  expect(sub.mock.calls).toEqual([[0], [1], [2], [4]])

  sub.unsubscribe() // Stop listening to updates
})
```

**With Custom Callback:**

```typescript
test('subscribe with custom callback', () => {
  const counter = atom(0, 'counter')
  const results: number[] = []

  const sub = subscribe(counter, (val) => {
    results.push(val * 2)
  })

  counter.set(5)
  counter.set(10)

  expect(results).toEqual([0, 10, 20])
  sub.unsubscribe()
})
```

### silentQueuesErrors()

Silences unhandled errors in Reatom's queues to prevent console noise during tests that intentionally check for errors. This function overrides the default queue push behavior to catch and ignore any errors thrown within queue callbacks.

**Signature:**

```typescript
silentQueuesErrors(): void
```

**Example:**

```typescript
import { test, silentQueuesErrors } from 'test'

test('handles errors silently', () => {
  silentQueuesErrors()
  // Now errors in Reatom queues won't log to console
})
```

## Re-exported Utilities

The following Vitest utilities are re-exported for convenience:

- `expect`
- `describe`
- `beforeEach`
- `afterEach`
- `beforeAll`
- `afterAll`
- `vi`
- `expectTypeOf`
- original `test` is aliased as `viTest`
- All Vitest types

## Usage Patterns

### Basic Atom Testing

```typescript
import { test, expect } from 'test'
import { atom } from '@reatom/core'

test('atom initialization', () => {
  const counter = atom(0, 'counter')
  expect(counter()).toBe(0)
})

test('atom updates', () => {
  const counter = atom(0, 'counter')
  counter.set(5)
  expect(counter()).toBe(5)
})
```

### Computed Atom Testing

```typescript
import { test, expect, subscribe } from 'test'
import { atom, computed } from '@reatom/core'

test('computed atom updates', () => {
  const counter = atom(0, 'counter')
  const doubled = computed(() => counter() * 2, 'doubled')
  const sub = subscribe(doubled)

  expect(doubled()).toBe(0)

  counter.set(5)
  expect(doubled()).toBe(10)
  expect(sub).toHaveBeenLastCalledWith(10)

  sub.unsubscribe()
})
```

### Testing Update Sequences

```typescript
import { test, expect, subscribe } from 'test'
import { atom } from '@reatom/core'

test('tracks all updates in order', () => {
  const counter = atom(0, 'counter')
  const sub = subscribe(counter)

  counter.set(1)
  counter.set(2)
  counter.set(3)

  expect(sub.mock.calls).toEqual([[0], [1], [2], [3]])
  sub.unsubscribe()
})
```

### Async Testing

```typescript
import { test, expect } from 'test'
import { atom } from '@reatom/core'

test('handles async operations', async () => {
  const counter = atom(0, 'counter')

  await Promise.resolve()
  counter.set(10)

  expect(counter()).toBe(10)
})
```

## Migration from Standard Vitest

If you're migrating existing tests, the main changes are:

1. Import `test` from `test` instead of `vitest`
2. Remove manual `context.start()` calls and `clearContext` call (if used)
3. Remove manual `context.reset()` from `beforeEach` hooks (if used)
4. Use `subscribe()` helper instead of manual atom subscription + vi.fn()

> It your application entrypoint started with reatom routing system, you can run it just with the url atom reading - `urlAtom()`

## Configuration

To set up the `test` alias in your project (optional but recommended):

**vitest.config.ts:**

```typescript
import { defineConfig } from 'vitest/config'

export default defineConfig({
  resolve: {
    alias: {
      test: './src/reatom/test/test.ts',
    },
  },
})
```

**tsconfig.json:**

```json
{
  "compilerOptions": {
    "paths": {
      "test": ["./src/reatom/test/test.ts"]
    }
  }
}
```

Note: The exact path may vary depending on your jsrepo configuration. Adjust the paths above to match where jsrepo installed the files in your project.

## Examples

The test harness is used throughout the [@reatom/reusables](https://github.com/reatom/reusables) project.

## Why Use This Test Harness?

1. **Universal implementation**: Easy to change Vitest to any other test runner
2. **Reduces Boilerplate**: No need to manually manage context in every test
3. **Prevents Common Errors**: Eliminates "missed context" errors that are common in Reatom testing
4. **Better Debugging**: Mock subscriptions provide clear visibility into atom updates
5. **Isolation Guarantee**: Each test runs in a fresh context, preventing flaky tests
6. **Follows Core Patterns**: Aligned with testing patterns used in `@reatom/core`
