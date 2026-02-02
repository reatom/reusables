import { action, atom, context } from '@reatom/core'
import { beforeEach, describe, expect, test } from 'vitest'

import { withReact } from './with-react'

beforeEach(() => {
  context.reset()
})

describe('withReact', () => {
  test('adds .useReact to atom', () => {
    const count = atom(0, 'count').extend(withReact())

    expect(count.useReact).toBeDefined()
    expect(typeof count.useReact).toBe('function')
  })

  test('adds .useReact to action', () => {
    const increment = action(() => 1, 'increment').extend(withReact())

    expect(increment.useReact).toBeDefined()
    expect(typeof increment.useReact).toBe('function')
  })
})
