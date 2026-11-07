import { action, context, withConnectHook } from '@reatom/core'
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

  test('in reatomComponent render: stays subscribed after unmount', async () => {
    const { target, connections } = reatomProbe('defaultRender')
    const Component = reatomComponent(
      () => createElement('button', { onClick: hotWrap(target) }),
      'DefaultRender',
    )

    const unmount = await mount(Component)
    await unmount()
    expect(connections).toEqual({ connects: 1, disconnects: 0 })
  })

  for (const strict of [false, true]) {
    test(`in reatomComponent render with abortOnUnmount${strict ? ', StrictMode' : ''}: unsubscribes on unmount`, async () => {
      const { target, connections } = reatomProbe('abortOnUnmount')
      const Component = reatomComponent(
        () => createElement('button', { onClick: hotWrap(target) }),
        { name: 'AbortOnUnmount', abortOnUnmount: true },
      )

      const unmount = await mount(Component, { strict })
      expect(connections.connects - connections.disconnects).toBe(1)

      await unmount()
      expect(connections.connects - connections.disconnects).toBe(0)
    })
  }
})
