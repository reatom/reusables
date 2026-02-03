import { atom } from '@reatom/core'
import { describe, test, expect } from 'test'

import { withHistory } from './with-history'

describe('withHistory', () => {
  test('adds .history computed to atom', () => {
    const counter = atom(0, 'counter').extend(withHistory())

    expect(counter.history).toBeDefined()
  })

  test('tracks current state as first element', () => {
    const counter = atom(0, 'counter').extend(withHistory())

    const unsub = counter.history.subscribe(() => {})
    expect(counter.history()[0]).toBe(0)
    unsub()
  })

  test('tracks state changes with default length', () => {
    const counter = atom(0, 'counter').extend(withHistory())

    const unsub = counter.history.subscribe(() => {})

    counter.set(1)
    expect(counter.history()).toEqual([1, 0])

    counter.set(2)
    expect(counter.history()).toEqual([2, 1, 0])

    // Default length is 2 past states, so oldest is dropped
    counter.set(3)
    expect(counter.history()).toEqual([3, 2, 1])

    unsub()
  })

  test('respects custom history length', () => {
    const counter = atom(0, 'counter').extend(withHistory(1))

    const unsub = counter.history.subscribe(() => {})

    counter.set(1)
    expect(counter.history()).toEqual([1, 0])

    counter.set(2)
    expect(counter.history()).toEqual([2, 1])

    unsub()
  })

  test('works with larger history length', () => {
    const counter = atom(0, 'counter').extend(withHistory(5))

    const unsub = counter.history.subscribe(() => {})

    counter.set(1)
    expect(counter.history()).toEqual([1, 0])

    counter.set(2)
    expect(counter.history()).toEqual([2, 1, 0])

    counter.set(3)
    expect(counter.history()).toEqual([3, 2, 1, 0])

    counter.set(4)
    expect(counter.history()).toEqual([4, 3, 2, 1, 0])

    counter.set(5)
    expect(counter.history()).toEqual([5, 4, 3, 2, 1, 0])

    counter.set(6)
    expect(counter.history()).toEqual([6, 5, 4, 3, 2, 1])

    unsub()
  })

  test('works with object values', () => {
    const user = atom({ name: 'John' }, 'user').extend(withHistory(2))

    const unsub = user.history.subscribe(() => {})

    user.set({ name: 'Jane' })
    expect(user.history()).toEqual([{ name: 'Jane' }, { name: 'John' }])

    user.set({ name: 'Bob' })
    expect(user.history()).toEqual([
      { name: 'Bob' },
      { name: 'Jane' },
      { name: 'John' },
    ])

    unsub()
  })

  test('history computed has correct name', () => {
    const counter = atom(0, 'myCounter').extend(withHistory())

    expect(counter.history.name).toBe('myCounter.history')
  })
})
