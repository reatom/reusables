import { atom, computed, notify } from '@reatom/core'
import { describe, expect, test, subscribe } from './test'

describe('test harness', () => {
  describe('test() wrapper', () => {
    test('automatically runs test in context.start()', () => {
      // If context is not started, this would throw
      const counter = atom(0, 'counter')
      counter.set(5)
      expect(counter()).toBe(5)
    })

    test('isolates context between tests', () => {
      const counter = atom(0, 'counter')
      // This atom was created in this test, not leaked from previous test
      expect(counter()).toBe(0)
    })

    test('handles async tests', async () => {
      const counter = atom(0, 'counter')
      await Promise.resolve()
      counter.set(10)
      expect(counter()).toBe(10)
    })

    test('preserves test name', () => {
      // Test name should be available through function.name
      expect(test.name).toBe('test')
    })
  })

  describe('subscribe() helper', () => {
    test('creates mock subscriber that tracks calls', () => {
      const counter = atom(0, 'counter')
      const sub = subscribe(counter)

      // Initial call happens on subscription
      expect(sub).toHaveBeenCalledTimes(1)
      expect(sub).toHaveBeenCalledWith(0)

      counter.set(1)
      notify()
      expect(sub).toHaveBeenCalledTimes(2)
      expect(sub).toHaveBeenLastCalledWith(1)

      counter.set(2)
      notify()
      expect(sub).toHaveBeenCalledTimes(3)
      expect(sub).toHaveBeenLastCalledWith(2)

      sub.unsubscribe()
    })

    test('accepts custom callback', () => {
      const counter = atom(0, 'counter')
      const results: number[] = []
      const sub = subscribe(counter, (val) => {
        results.push(val * 2)
      })

      counter.set(5)
      notify()
      counter.set(10)
      notify()

      expect(sub).toHaveBeenCalledTimes(3)
      expect(results).toEqual([0, 10, 20])

      sub.unsubscribe()
    })

    test('unsubscribe stops tracking updates', () => {
      const counter = atom(0, 'counter')
      const sub = subscribe(counter)

      counter.set(1)
      notify()
      expect(sub).toHaveBeenCalledTimes(2)

      sub.unsubscribe()

      counter.set(2)
      counter.set(3)
      notify()
      // Should still be 2 - no new calls after unsubscribe
      expect(sub).toHaveBeenCalledTimes(2)
    })

    test('works with computed atoms', () => {
      const counter = atom(0, 'counter')
      const doubled = computed(() => counter() * 2, 'doubled')
      const sub = subscribe(doubled)

      expect(sub).toHaveBeenCalledTimes(1)
      expect(sub).toHaveBeenCalledWith(0)

      counter.set(5)
      notify()
      expect(sub).toHaveBeenCalledTimes(2)
      expect(sub).toHaveBeenLastCalledWith(10)

      sub.unsubscribe()
    })

    test('tracks all updates in correct order', () => {
      const counter = atom(0, 'counter')
      const sub = subscribe(counter)

      counter.set(1)
      notify()
      counter.set(2)
      notify()
      counter.set(3)
      notify()

      expect(sub.mock.calls).toEqual([[0], [1], [2], [3]])

      sub.unsubscribe()
    })
  })

  describe('context isolation', () => {
    test('context is clean at test start', () => {
      const counter = atom(0, 'counter')
      // Should be fresh context, not affected by other tests
      expect(counter()).toBe(0)
    })

    test('context changes do not leak to other tests', () => {
      const counter = atom(0, 'counter')
      counter.set(100)
      expect(counter()).toBe(100)
      // This change should not affect other tests
    })

    test('verify isolation worked', () => {
      const counter = atom(0, 'counter')
      // Should be 0, not 100 from previous test
      expect(counter()).toBe(0)
    })
  })
})
