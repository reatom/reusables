import { atom } from '@reatom/core'
import { describe, test, expect, vi } from 'test'

import { withInstance } from './with-instance'

describe('withInstance', () => {
  test('adds .instance property to atom', () => {
    const source = atom(10, 'source')
    const extended = source.extend(
      withInstance(
        (target) => ({ doubled: target() * 2 }),
        () => {},
      ),
    )

    expect(extended.instance).toBeDefined()

    const unsub = extended.instance.subscribe(() => {})
    expect(extended.instance()).toEqual({ doubled: 20 })
    unsub()
  })

  test('recreates instance when source atom changes', () => {
    const source = atom(1, 'source')
    const dispose = vi.fn()
    const extended = source.extend(
      withInstance((target) => ({ val: target() * 3 }), dispose),
    )

    const unsub = extended.instance.subscribe(() => {})
    const first = extended.instance()
    expect(first).toEqual({ val: 3 })

    source.set(2)
    expect(extended.instance()).toEqual({ val: 6 })
    expect(dispose).toHaveBeenCalledWith(first)

    unsub()
  })

  test('disposes instance on abort', () => {
    const source = atom(1, 'source')
    const dispose = vi.fn()
    const extended = source.extend(
      withInstance((target) => ({ val: target() }), dispose),
    )

    const unsub = extended.instance.subscribe(() => {})
    const created = extended.instance()

    extended.instance.abort('done')
    expect(dispose).toHaveBeenCalledWith(created)

    unsub()
  })

  test('works with complex objects', () => {
    const dims = atom({ x: 1, y: 2, z: 3 }, 'dims')
    const extended = dims.extend(
      withInstance(
        (target) => {
          const { x, y, z } = target()
          return { volume: x * y * z }
        },
        () => {},
      ),
    )

    const unsub = extended.instance.subscribe(() => {})
    expect(extended.instance()).toEqual({ volume: 6 })

    dims.set({ x: 2, y: 3, z: 4 })
    expect(extended.instance()).toEqual({ volume: 24 })

    unsub()
  })
})
