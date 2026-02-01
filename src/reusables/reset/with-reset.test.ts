import { atom } from '@reatom/core'
import { describe, test, expect } from 'test'

import { withReset } from './with-reset'

describe('withReset', () => {
  test('adds .reset action to atom', () => {
    const counter = atom(0, 'counter').extend(withReset(0))

    expect(counter.reset).toBeDefined()
    expect(typeof counter.reset).toBe('function')
  })

  test('resets atom to initial value', () => {
    const counter = atom(0, 'counter').extend(withReset(0))

    counter.set(10)
    expect(counter()).toBe(10)

    counter.reset()
    expect(counter()).toBe(0)
  })

  test('works with non-zero initial values', () => {
    const counter = atom(42, 'counter').extend(withReset(42))

    counter.set(100)
    expect(counter()).toBe(100)

    counter.reset()
    expect(counter()).toBe(42)
  })

  test('works with object values', () => {
    const initial = { name: 'John', age: 30 }
    const user = atom(initial, 'user').extend(withReset(initial))

    user.set({ name: 'Jane', age: 25 })
    expect(user()).toEqual({ name: 'Jane', age: 25 })

    user.reset()
    expect(user()).toEqual(initial)
  })

  test('works with array values', () => {
    const initial = [1, 2, 3]
    const list = atom(initial, 'list').extend(withReset(initial))

    list.set([4, 5, 6])
    expect(list()).toEqual([4, 5, 6])

    list.reset()
    expect(list()).toEqual(initial)
  })

  test('reset action has correct name', () => {
    const counter = atom(0, 'myCounter').extend(withReset(0))

    expect(counter.reset.name).toBe('myCounter.reset')
  })

  test('can reset multiple times', () => {
    const counter = atom(0, 'counter').extend(withReset(0))

    counter.set(5)
    counter.reset()
    expect(counter()).toBe(0)

    counter.set(10)
    counter.reset()
    expect(counter()).toBe(0)

    counter.set(15)
    counter.reset()
    expect(counter()).toBe(0)
  })
})
