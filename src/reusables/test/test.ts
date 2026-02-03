import { type Mock, test as viTest, vi } from 'vitest'

import type { AtomLike, Unsubscribe } from '@reatom/core'
import { context, noop, notify, top } from '@reatom/core'

/**
 * Silences unhandled errors in Reatom's queues to prevent console noise during
 * tests that intentionally check for errors. This function overrides the
 * default queue push behavior to catch and ignore any errors thrown within
 * queue callbacks.
 *
 * @example
 *   import { test, silentQueuesErrors } from 'test'
 *
 *   test('handles errors silently', () => {
 *     silentQueuesErrors()
 *     // Now errors in Reatom queues won't log to console
 *   })
 */
export const silentQueuesErrors = () => {
  top().root.pushQueue = function pushQueue(cb, queue) {
    this[queue].push(async () => {
      try {
        await cb()
      } catch {
        // nothing
      }
    })
  }
}

/**
 * Enhanced version of Vitest's test function that automatically wraps test
 * callbacks in Reatom's context to ensure proper atom tracking and execution
 * within Reatom's reactive system.
 *
 * This wrapper preserves all functionality from Vitest while adding
 * Reatom-specific context handling, which prevents "missed context" errors when
 * testing Reatom atoms and actions.
 *
 * > **NOTE**: the test methods (`test.skip`, `test.each` and so on) are not
 * > supported, use `viTest` export for this cases (`viTest.skip`, `viTest.each`
 * > and so on)
 *
 * @example
 *   import { test, expect } from 'test'
 *   import { atom } from '@reatom/core'
 *
 *   test('atom updates correctly', () => {
 *     const counter = atom(0, 'counter')
 *     counter.set(5)
 *     expect(counter()).toBe(5)
 *   })
 *
 * @param name - The name of the test case
 * @param fn - The test function to execute within Reatom context
 * @returns The result of the Vitest test execution
 */
// Create the wrapped test function
const test = ((name: string, fn: () => void | Promise<void>) =>
  viTest(name, () => {
    Reflect.defineProperty(fn, 'name', { value: name })
    return context.start(fn)
  })) as typeof viTest

export { test, viTest, notify }

/**
 * Creates a mock subscriber for an atom that tracks all atom updates using
 * Vitest's mock functionality.
 *
 * This utility combines Reatom's subscription mechanism with Vitest's mocking
 * capabilities, providing an easy way to verify atom updates during tests. The
 * returned object is both a Vitest mock function (with call tracking) and has
 * an attached unsubscribe method.
 *
 * @example
 *   import { test, expect, subscribe } from 'test'
 *   import { atom } from '@reatom/core'
 *
 *   test('subscribe captures all updates', () => {
 *     const counter = atom(0, 'counter')
 *     const sub = subscribe(counter)
 *
 *     counter.set(1)
 *     counter.set(2)
 *
 *     expect(sub).toHaveBeenCalledTimes(3) // Initial + 2 updates
 *     expect(sub).toHaveBeenLastCalledWith(2)
 *
 *     sub.unsubscribe() // Stop listening to updates
 *   })
 *
 * @param target - The Reatom atom or computed value to subscribe to
 * @param cb - Optional callback function to execute on each atom update
 * @returns A Vitest mock function with unsubscribe method attached
 */
export function subscribe<State, T extends (state: State) => any>(
  target: AtomLike<State>,
  cb: T = noop as T,
): Mock<T> & { unsubscribe: Unsubscribe } {
  const mock = vi.fn(cb)
  // Cast mock to subscription callback type - Vitest's Mock is compatible at runtime
  const unsubscribe = target.subscribe(mock as unknown as (state: State) => any)
  return Object.assign(mock, { unsubscribe })
}

/**
 * Re-exports from Vitest for convenient testing.
 *
 * These exports provide all standard Vitest testing utilities while ensuring
 * compatibility with Reatom's testing utilities defined in this file.
 */
export {
  afterAll,
  afterEach,
  beforeAll,
  beforeEach,
  describe,
  expect,
  expectTypeOf,
  vi,
} from 'vitest'

/**
 * Re-exports all type definitions from Vitest.
 *
 * This ensures that Vitest types are available when importing from 'test'.
 */
export type * from 'vitest'
