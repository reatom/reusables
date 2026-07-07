import { atom, top, type Frame } from '@reatom/core'
import { describe, expect, test } from 'test'

import { withResizeObserver } from './with-resize-observer'

const nextFrame = () =>
  new Promise((resolve) => {
    requestAnimationFrame(() => resolve(undefined))
  })

const waitFor = async <T>(
  assertion: () => T,
  frame: Frame,
  timeout = 1500,
): Promise<T> => {
  const startedAt = performance.now()
  let lastError: unknown

  while (performance.now() - startedAt < timeout) {
    try {
      return frame.run(assertion)
    } catch (error) {
      lastError = error
      await nextFrame()
    }
  }

  throw lastError
}

const createBox = (width: number, height: number) => {
  const node = document.createElement('div')
  Object.assign(node.style, {
    width: `${width}px`,
    height: `${height}px`,
    boxSizing: 'border-box',
  })
  document.body.append(node)
  return node
}

describe('withResizeObserver', () => {
  test('observes an element and updates when its size changes', async () => {
    const box = createBox(80, 40)
    const target = atom<HTMLElement | null>(null, 'target').extend(
      withResizeObserver(),
    )
    const unsub = target.sizeEntry.subscribe(() => {})
    const frame = top()

    try {
      target.set(box)

      await waitFor(() => {
        const entry = target.sizeEntry()
        expect(entry?.target).toBe(box)
        expect(entry?.contentRect.width).toBe(80)
        expect(entry?.contentRect.height).toBe(40)
        return entry
      }, frame)

      box.style.width = '120px'
      box.style.height = '60px'

      await waitFor(() => {
        const entry = target.sizeEntry()
        expect(entry?.target).toBe(box)
        expect(entry?.contentRect.width).toBe(120)
        expect(entry?.contentRect.height).toBe(60)
        return entry
      }, frame)
    } finally {
      unsub()
      box.remove()
    }
  })

  test('returns no entry when the target atom is null', async () => {
    const box = createBox(50, 50)
    const target = atom<HTMLElement | null>(null, 'target').extend(
      withResizeObserver(),
    )
    const unsub = target.sizeEntry.subscribe(() => {})
    const frame = top()

    try {
      expect(target.sizeEntry()).toBeUndefined()

      target.set(box)
      await waitFor(() => {
        const entry = target.sizeEntry()
        expect(entry?.target).toBe(box)
        return entry
      }, frame)

      frame.run(() => {
        target.set(null)
        expect(target.sizeEntry()).toBeUndefined()
      })
    } finally {
      unsub()
      box.remove()
    }
  })

  test('switches observation to a second element', async () => {
    const first = createBox(30, 30)
    const second = createBox(90, 45)
    const target = atom<HTMLElement | null>(null, 'target').extend(
      withResizeObserver(),
    )
    const unsub = target.sizeEntry.subscribe(() => {})
    const frame = top()

    try {
      target.set(first)

      await waitFor(() => {
        const entry = target.sizeEntry()
        expect(entry?.target).toBe(first)
        expect(entry?.contentRect.width).toBe(30)
        return entry
      }, frame)

      frame.run(() => target.set(second))

      await waitFor(() => {
        const entry = target.sizeEntry()
        expect(entry?.target).toBe(second)
        expect(entry?.contentRect.width).toBe(90)
        expect(entry?.contentRect.height).toBe(45)
        return entry
      }, frame)
    } finally {
      unsub()
      first.remove()
      second.remove()
    }
  })

  test('names the computed from the target atom', () => {
    const target = atom<HTMLElement | null>(null, 'box').extend(
      withResizeObserver(),
    )

    expect(target.sizeEntry.name).toBe('box.sizeEntry')
  })
})
