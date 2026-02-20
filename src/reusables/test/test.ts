import { type Mock, test as viTest, vi, beforeAll } from 'vitest'

import type { Action, AtomLike, Unsubscribe } from '@reatom/core'
import { clearStack, context, isAction, noop, notify, top } from '@reatom/core'

beforeAll(() => {
  clearStack()
})

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
 * Creates a mock subscriber for an atom or action that tracks all updates using
 * Vitest's mock functionality.
 *
 * For atoms, the mock is called with each new state value. For actions, the
 * mock is called with the action's params and returns the payload, making it
 * easy to test action results.
 *
 * @example
 *   import { test, expect, subscribe } from 'test'
 *   import { atom, action } from '@reatom/core'
 *
 *   test('subscribe captures atom updates', () => {
 *     const counter = atom(0, 'counter')
 *     const sub = subscribe(counter)
 *
 *     counter.set(1)
 *     counter.set(2)
 *
 *     expect(sub).toHaveBeenCalledTimes(3) // Initial + 2 updates
 *     expect(sub).toHaveBeenLastCalledWith(2)
 *
 *     sub.unsubscribe()
 *   })
 *
 * @example
 *   test('subscribe captures action calls', () => {
 *     const doSomething = action((x: number) => x * 2, 'doSomething')
 *     const sub = subscribe(doSomething)
 *
 *     doSomething(5)
 *
 *     expect(sub).toHaveBeenCalledWith(5)
 *     expect(sub).toHaveLastReturnedWith(10)
 *
 *     sub.unsubscribe()
 *   })
 */
export function subscribe<Params extends any[], Payload>(
  target: Action<Params, Payload>,
  cb?: (...params: Params) => Payload,
): Mock<(...params: Params) => Payload> & { unsubscribe: Unsubscribe }
export function subscribe<State, T extends (state: State) => any>(
  target: AtomLike<State>,
  cb?: T,
): Mock<T> & { unsubscribe: Unsubscribe }
export function subscribe(
  target: AtomLike,
  cb: (...args: any[]) => any = noop,
): Mock & { unsubscribe: Unsubscribe } {
  const mock = vi.fn(cb)

  if (isAction(target)) {
    const unsubscribe = target.subscribe((calls) => {
      for (const { params, payload } of calls) {
        mock.mockReturnValueOnce(payload)
        mock(...params)
      }
    })
    return Object.assign(mock, { unsubscribe })
  }

  const unsubscribe = target.subscribe(mock as any)
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
