import { atom, action, context } from '@reatom/core'
import { describe, test, beforeEach, expect, vi } from 'vitest'

import { withLogger, type LogEntry } from './with-logger'

beforeEach(() => {
  context.reset()
})

describe('withLogger', () => {
  test('adds logging middleware to atom', () => {
    const logs: LogEntry[] = []
    const logger = (entry: LogEntry) => logs.push(entry)

    const counter = atom(0, 'counter').extend(withLogger(logger))

    counter.set(5)

    expect(logs).toHaveLength(1)
    expect(logs[0].name).toBe('counter')
    expect(logs[0].params).toEqual([5])
    expect(logs[0].result).toBe(5)
  })

  test('does not log on read', () => {
    const logs: LogEntry[] = []
    const logger = (entry: LogEntry) => logs.push(entry)

    const counter = atom(0, 'counter').extend(withLogger(logger))

    // Just reading should not log
    counter()

    expect(logs).toHaveLength(0)
  })

  test('logs multiple updates', () => {
    const logs: LogEntry[] = []
    const logger = (entry: LogEntry) => logs.push(entry)

    const counter = atom(0, 'counter').extend(withLogger(logger))

    counter.set(1)
    counter.set(2)
    counter.set(3)

    expect(logs).toHaveLength(3)
    expect(logs.map((l) => l.result)).toEqual([1, 2, 3])
  })

  test('works with actions', () => {
    const logs: LogEntry[] = []
    const logger = (entry: LogEntry) => logs.push(entry)

    const greet = action((name: string) => `Hello, ${name}!`, 'greet').extend(
      withLogger(logger),
    )

    greet('World')

    expect(logs).toHaveLength(1)
    expect(logs[0].name).toBe('greet')
    expect(logs[0].params).toEqual(['World'])
    // Action results are wrapped in array with payload property
    expect(logs[0].result).toEqual([
      { params: ['World'], payload: 'Hello, World!' },
    ])
  })

  test('includes timestamp', () => {
    const logs: LogEntry[] = []
    const logger = (entry: LogEntry) => logs.push(entry)

    const counter = atom(0, 'counter').extend(withLogger(logger))

    const before = Date.now()
    counter.set(1)
    const after = Date.now()

    expect(logs[0].timestamp).toBeGreaterThanOrEqual(before)
    expect(logs[0].timestamp).toBeLessThanOrEqual(after)
  })

  test('uses default console logger when no logger provided', () => {
    const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => {})

    const counter = atom(0, 'counter').extend(withLogger())

    counter.set(42)

    expect(consoleSpy).toHaveBeenCalledTimes(1)
    expect(consoleSpy).toHaveBeenCalledWith('[counter]', [42], '->', 42)

    consoleSpy.mockRestore()
  })

  test('works with object state', () => {
    const logs: LogEntry[] = []
    const logger = (entry: LogEntry) => logs.push(entry)

    const user = atom({ name: 'John' }, 'user').extend(withLogger(logger))

    user.set({ name: 'Jane' })

    expect(logs[0].result).toEqual({ name: 'Jane' })
  })

  test('works with functional updates', () => {
    const logs: LogEntry[] = []
    const logger = (entry: LogEntry) => logs.push(entry)

    const counter = atom(0, 'counter').extend(withLogger(logger))

    counter.set((prev) => prev + 1)

    expect(logs[0].result).toBe(1)
  })
})
