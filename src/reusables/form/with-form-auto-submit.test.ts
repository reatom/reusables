import { context, reatomForm } from '@reatom/core'
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest'

import { withFormAutoSubmit } from './with-form-auto-submit'

beforeEach(() => {
  context.reset()
  vi.useFakeTimers()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('withFormAutoSubmit', () => {
  test('submits after debounce when dirty', async () => {
    const submitSpy = vi.fn(async (state: { name: string }) => state)

    const form = reatomForm(
      { name: '' },
      {
        onSubmit: submitSpy,
      },
    ).extend(withFormAutoSubmit({ debounceMs: 200 }))

    form.fields.name.change('Ada')

    expect(submitSpy).toHaveBeenCalledTimes(0)

    await vi.advanceTimersByTimeAsync(200)
    await Promise.resolve()

    expect(submitSpy).toHaveBeenCalledTimes(1)
    expect(submitSpy).toHaveBeenCalledWith({ name: 'Ada' })
    expect(form.focus().dirty).toBe(false)
  })

  test('debounces rapid changes to the latest value', async () => {
    const submitSpy = vi.fn(async (state: { name: string }) => state)

    const form = reatomForm(
      { name: '' },
      {
        onSubmit: submitSpy,
      },
    ).extend(withFormAutoSubmit({ debounceMs: 150 }))

    form.fields.name.change('A')
    form.fields.name.change('B')

    await vi.advanceTimersByTimeAsync(150)
    await Promise.resolve()

    expect(submitSpy).toHaveBeenCalledTimes(1)
    expect(submitSpy).toHaveBeenCalledWith({ name: 'B' })
  })
})
