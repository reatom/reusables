import { action, context, ReatomError, withConnectHook } from '@reatom/core'
import {
  reatomComponent,
  reatomContext,
  reatomFactoryComponent,
} from '@reatom/react'
import { act, createElement, StrictMode, type FC } from 'react'
import { createRoot } from 'react-dom/client'
import { describe, test, expect } from 'test'

import { hotWrap } from './hot-wrap'

// @ts-expect-error React reads this global to enable `act`
globalThis.IS_REACT_ACT_ENVIRONMENT = true

const reatomProbe = (name: string) => {
  const connections = { connects: 0, disconnects: 0 }
  const target = action(() => {}, name).extend(
    withConnectHook(() => {
      connections.connects++
      return () => connections.disconnects++
    }),
  )
  return { target, connections }
}

const mount = async (Component: FC, { strict = false } = {}) => {
  const container = document.createElement('div')
  document.body.appendChild(container)
  const root = createRoot(container)
  let element = createElement(
    reatomContext.Provider,
    { value: context.start() },
    createElement(Component),
  )
  if (strict) element = createElement(StrictMode, null, element)
  await act(() => root.render(element))

  return async () => {
    await act(() => root.unmount())
    container.remove()
  }
}

const catchError = (cb: () => void) => {
  try {
    cb()
  } catch (error) {
    return error
  }
}

describe('hotWrap with @reatom/react', () => {
  test('in reatomFactoryComponent init: unsubscribes on unmount', async () => {
    const { target, connections } = reatomProbe('factoryInit')
    const Component = reatomFactoryComponent(() => {
      const onClick = hotWrap(target)
      return () => createElement('button', { onClick })
    }, 'FactoryInit')

    const unmount = await mount(Component)
    expect(connections).toEqual({ connects: 1, disconnects: 0 })

    await unmount()
    expect(connections).toEqual({ connects: 1, disconnects: 1 })
  })

  for (const strict of [false, true]) {
    const mode = strict ? ' (StrictMode)' : ''

    test(`in reatomFactoryComponent init: does not throw${mode}`, async () => {
      const { target } = reatomProbe('factoryInitNoThrow')
      const errors: unknown[] = []
      const Component = reatomFactoryComponent(() => {
        errors.push(catchError(() => hotWrap(target)))
        return () => null
      }, 'FactoryInitNoThrow')

      const unmount = await mount(Component, { strict })
      await unmount()
      expect(errors.length).toBeGreaterThan(0)
      expect(errors.every((error) => error === undefined)).toBe(true)
    })

    const renders: Array<[string, (render: () => null) => FC]> = [
      ['reatomComponent', (render) => reatomComponent(render, 'Render')],
      [
        'reatomComponent with abortOnUnmount',
        (render) =>
          reatomComponent(render, { name: 'Render', abortOnUnmount: true }),
      ],
      [
        'reatomFactoryComponent',
        (render) => reatomFactoryComponent(() => render, 'Render'),
      ],
    ]

    for (const [name, reatomRender] of renders) {
      test(`in ${name} render: throws and does not subscribe${mode}`, async () => {
        const { target, connections } = reatomProbe('render')
        const errors: unknown[] = []
        const Component = reatomRender(() => {
          errors.push(catchError(() => hotWrap(target)))
          return null
        })

        const unmount = await mount(Component, { strict })
        await unmount()
        expect(errors.length).toBeGreaterThan(0)
        for (const error of errors) {
          expect(error).toBeInstanceOf(ReatomError)
          expect((error as Error).message).toContain('factory body (init)')
        }
        expect(connections.connects).toBe(0)
      })
    }
  }
})
