import { ReatomError, atom, context } from '@reatom/core'
import { beforeEach, describe, expect, test } from 'test'

import { getActiveStoryFrame, setActiveStoryFrame } from './story-frame'

beforeEach(() => {
  // The holder is module-level; reset it so tests stay isolated.
  setActiveStoryFrame(null)
})

describe('storyFrame', () => {
  test('getActiveStoryFrame throws when no frame is set', () => {
    expect(() => getActiveStoryFrame()).toThrow(ReatomError)
    expect(() => getActiveStoryFrame()).toThrow(
      'No active Storybook Reatom frame',
    )
  })

  test('returns the frame set by setActiveStoryFrame', () => {
    const frame = context.start()
    setActiveStoryFrame(frame)

    expect(getActiveStoryFrame()).toBe(frame)
  })

  test('throws again after the frame is cleared', () => {
    const frame = context.start()
    setActiveStoryFrame(frame)
    expect(getActiveStoryFrame()).toBe(frame)

    setActiveStoryFrame(null)
    expect(() => getActiveStoryFrame()).toThrow(ReatomError)
  })

  test('state read through frame.run works on the returned frame', () => {
    const counter = atom(0, 'counter')

    const frame = context.start()
    setActiveStoryFrame(frame)

    frame.run(() => counter.set(42))
    expect(frame.run(() => counter())).toBe(42)
    expect(getActiveStoryFrame().run(() => counter())).toBe(42)
  })
})
