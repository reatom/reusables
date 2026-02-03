import { atom, action } from '@reatom/core'
import { describe, test, expect } from 'test'

import { hotWrap } from './hot-wrap'

describe('hotWrap', () => {
  test('wraps atom and maintains value access', () => {
    const counter = hotWrap(atom(42, 'counter'))

    expect(counter()).toBe(42)
  })

  test('wrapped atom returns current value', () => {
    const source = atom(0, 'counter')
    const wrapped = hotWrap(source)

    expect(wrapped()).toBe(0)

    // Update via source, wrapped reflects it
    source.set(10)
    expect(wrapped()).toBe(10)
  })

  test('wraps action and maintains functionality', () => {
    let called = false
    const doThing = hotWrap(
      action(() => {
        called = true
      }, 'doThing'),
    )

    expect(called).toBe(false)
    doThing()
    expect(called).toBe(true)
  })

  test('wrapped action can return values', () => {
    const getValue = hotWrap(action(() => 'hello', 'getValue'))

    expect(getValue()).toBe('hello')
  })

  test('works with object values', () => {
    const user = hotWrap(atom({ name: 'John', age: 30 }, 'user'))

    expect(user()).toEqual({ name: 'John', age: 30 })
  })

  test('works with array values', () => {
    const list = hotWrap(atom([1, 2, 3], 'list'))

    expect(list()).toEqual([1, 2, 3])
  })
})
