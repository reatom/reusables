# Test Harness

A reusable testing utilities on top of Vitest API for Reatom applications that provides enhanced testing capabilities with automatic context management and subscription mocking.

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
import { test, expect, subscribe } from '@reatom/reusables/test'
import { atom } from '@reatom/core'

test('subscribe captures all updates', () => {
  const counter = atom(0, 'counter')
  const sub = subscribe(counter)

  counter.set(1)
  counter.set(2)

  expect(sub).toHaveBeenCalledTimes(3) // Initial + 2 updates
  expect(sub).toHaveBeenLastCalledWith(2)
  expect(sub.mock.calls).toEqual([[0], [1], [2]])

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

### notify()

Re-exported from `@reatom/core` for manual transaction flushing in tests.

**Example:**

```typescript
import { test, expect, subscribe, notify } from '@reatom/reusables/test'
import { atom } from '@reatom/core'

test('manual notification', () => {
  const counter = atom(0, 'counter')
  const sub = subscribe(counter)

  counter.set(1)
  notify() // Manually flush the transaction

  expect(sub).toHaveBeenCalledTimes(2)
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
import { test, expect, subscribe } from '@reatom/reusables/test'
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
import { test, expect, subscribe } from '@reatom/reusables/test'
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

1. Import `test` from `@reatom/reusables/test` instead of `vitest`
2. Remove manual `context.start()` calls
3. Remove manual `context.reset()` from `beforeEach` hooks (handled automatically)
4. Use `subscribe()` helper instead of manual atom subscription + vi.fn()

**Before:**

```typescript
import { test, expect, beforeEach, vi } from 'vitest'
import { atom, context } from '@reatom/core'

beforeEach(() => {
  context.reset()
})

test('manual context setup', () => {
  context.start(() => {
    const counter = atom(0, 'counter')
    const sub = vi.fn()
    counter.subscribe(sub)

    counter.set(5)

    expect(sub).toHaveBeenCalledWith(5)
  })
})
```

**After:**

```typescript
import { test, expect, subscribe } from '@reatom/reusables/test'
import { atom } from '@reatom/core'

test('automatic context setup', () => {
  const counter = atom(0, 'counter')
  const sub = subscribe(counter)

  counter.set(5)

  expect(sub).toHaveBeenLastCalledWith(5)
  sub.unsubscribe()
})
```

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

The test harness is used throughout the [@reatom/reusables](https://github.com/reatom/reusables) project. Check out these files for real-world examples:

- `src/reusables/history/with-history.test.ts`
- `src/reusables/instance/with-instance.test.ts`
- `src/reusables/logger/with-logger.test.ts`

## Why Use This Test Harness?

1. **Reduces Boilerplate**: No need to manually manage context in every test
2. **Prevents Common Errors**: Eliminates "missed context" errors that are common in Reatom testing
3. **Better Debugging**: Mock subscriptions provide clear visibility into atom updates
4. **Isolation Guarantee**: Each test runs in a fresh context, preventing flaky tests
5. **Follows Core Patterns**: Aligned with testing patterns used in `@reatom/core`
