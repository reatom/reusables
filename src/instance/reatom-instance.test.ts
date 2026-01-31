import { atom, context } from '@reatom/core'
import { describe, test, beforeEach, expect, vi } from 'vitest'

import { reatomInstance } from './reatom-instance'

beforeEach(() => {
  context.reset()
})

describe('reatomInstance', () => {
  test('creates instance lazily on subscribe', () => {
    const create = vi.fn(() => ({ value: 42 }))
    const instance = reatomInstance(create)

    expect(create).not.toHaveBeenCalled()

    const unsub = instance.subscribe(() => {})
    expect(create).toHaveBeenCalledOnce()
    expect(instance()).toEqual({ value: 42 })

    unsub()
  })

  test('disposes instance on abort', () => {
    const dispose = vi.fn()
    const instance = reatomInstance(() => ({ value: 1 }), dispose)

    const unsub = instance.subscribe(() => {})
    const created = instance()
    expect(dispose).not.toHaveBeenCalled()

    instance.abort('done')
    expect(dispose).toHaveBeenCalledWith(created)

    unsub()
  })

  test('disposes previous instance when dependency changes', () => {
    const source = atom(0)
    const dispose = vi.fn()
    const instances: Array<{ id: number }> = []

    const instance = reatomInstance(() => {
      const obj = { id: source() }
      instances.push(obj)
      return obj
    }, dispose)

    const unsub = instance.subscribe(() => {})
    expect(instance()).toEqual({ id: 0 })
    expect(dispose).not.toHaveBeenCalled()

    source.set(1)
    expect(instance()).toEqual({ id: 1 })
    expect(dispose).toHaveBeenCalledWith(instances[0])

    unsub()
  })

  test('recreates instance on reconnect', () => {
    const createCount = vi.fn()
    const source = atom(0)
    const instance = reatomInstance(() => {
      createCount()
      return { id: source() }
    })

    const unsub1 = instance.subscribe(() => {})
    expect(createCount).toHaveBeenCalledTimes(1)
    expect(instance()).toEqual({ id: 0 })
    unsub1()

    source.set(5)

    const unsub2 = instance.subscribe(() => {})
    expect(createCount).toHaveBeenCalledTimes(2)
    expect(instance()).toEqual({ id: 5 })
    unsub2()
  })

  test('works without dispose callback', () => {
    const instance = reatomInstance(() => 'hello')

    const unsub = instance.subscribe(() => {})
    expect(instance()).toBe('hello')
    unsub()
  })

  test('passes name to computed atom', () => {
    const instance = reatomInstance(() => 1, undefined, 'myInstance')
    expect(instance.name).toBe('myInstance')
  })
})
