import { abortVar, reatomForm, sleep, wrap } from '@reatom/core'
import { describe, expect, test, vi } from 'test'

import { withFormAutoSubmit } from './with-form-auto-submit'

describe('withFormAutoSubmit', () => {
  test('submits after debounce when dirty', async () => {
    const submitSpy = vi.fn(async (state: { name: string }) => state)

    const form = reatomForm({ name: '' }, { onSubmit: submitSpy }).extend(
      withFormAutoSubmit({ debounceMs: 50 }),
    )

    form.waitAutoSubmit()

    form.fields.name.change('Ada')

    expect(submitSpy).toHaveBeenCalledTimes(0)

    await wrap(sleep(100))

    expect(submitSpy).toHaveBeenCalledTimes(1)
    expect(submitSpy).toHaveBeenCalledWith({ name: 'Ada' })
    expect(form.focus().dirty).toBe(false)
  })

  test('debounces rapid changes to the latest value', async () => {
    const submitSpy = vi.fn(async (state: { name: string }) => state)

    const form = reatomForm({ name: '' }, { onSubmit: submitSpy }).extend(
      withFormAutoSubmit({ debounceMs: 50 }),
    )

    form.waitAutoSubmit()

    form.fields.name.change('A')
    form.fields.name.change('B')

    await wrap(sleep(100))

    expect(submitSpy).toHaveBeenCalledTimes(1)
    expect(submitSpy).toHaveBeenCalledWith({ name: 'B' })
  })

  test('stops after abort', async () => {
    const submitSpy = vi.fn(async (state: { name: string }) => state)

    const form = reatomForm({ name: '' }, { onSubmit: submitSpy }).extend(
      withFormAutoSubmit({ debounceMs: 50 }),
    )

    abortVar.createAndRun(async () => {
      const controller = abortVar.get()!
      form.waitAutoSubmit()
      form.fields.name.change('Ada')
      await wrap(sleep(100))
      expect(submitSpy).toHaveBeenCalledTimes(1)

      controller!.abort()
      await wrap(sleep())

      form.fields.name.change('Bob')
      await wrap(sleep(100))
      expect(submitSpy).toHaveBeenCalledTimes(1)
    })
  })
})
