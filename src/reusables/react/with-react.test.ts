import { action, atom, context } from '@reatom/core'
import { useAction, useAtom } from '@reatom/react'
import { act, createElement } from 'react'
import { renderToString } from 'react-dom/server'
import { beforeEach, describe, expect, expectTypeOf, test } from 'vitest'

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

  test('works inside react act', () => {
    const count = atom(0, 'count').extend(withReact())
    const increment = action(() => count.set(count() + 1), 'increment').extend(
      withReact(),
    )
    let renderedValue = ''
    const App = () => {
      const [value] = count.useReact()
      const onClick = increment.useReact()
      renderedValue = String(value)
      return createElement('button', { onClick }, renderedValue)
    }

    act(() => {
      renderToString(createElement(App))
    })

    expect(renderedValue).toBe('0')
  })

  test('types match useAtom', () => {
    const count = atom(0, 'count').extend(withReact())

    type UseReactReturn = ReturnType<typeof count.useReact>
    type UseAtomReturn = ReturnType<typeof useAtom<typeof count>>

    expectTypeOf<UseReactReturn>().toEqualTypeOf<UseAtomReturn>()
  })

  test('types match useAction', () => {
    const add = action((value: number) => value, 'add').extend(withReact())

    type UseReactReturn = ReturnType<typeof add.useReact>
    type UseActionReturn = ReturnType<typeof useAction<typeof add>>

    expectTypeOf<UseReactReturn>().toEqualTypeOf<UseActionReturn>()
  })
})
