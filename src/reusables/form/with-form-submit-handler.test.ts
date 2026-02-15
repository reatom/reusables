import { reatomForm, sleep, wrap } from '@reatom/core'
import { describe, expect, silentQueuesErrors, test, vi } from 'test'

import { withFormSubmitHandler } from './with-form-submit-handler'

describe('withFormSubmitHandler', () => {
  test('calls preventDefault on the event', () => {
    const form = reatomForm(
      { name: '' },
      { onSubmit: async (state) => state },
    ).extend(withFormSubmitHandler())

    const event = { preventDefault: vi.fn() }
    form.handleSubmit(event)

    expect(event.preventDefault).toHaveBeenCalledTimes(1)
  })

  test('calls form.submit() on invocation', async () => {
    const submitSpy = vi.fn(async (state: { name: string }) => state)

    const form = reatomForm({ name: '' }, { onSubmit: submitSpy }).extend(
      withFormSubmitHandler(),
    )

    form.handleSubmit()
    await wrap(sleep())

    expect(submitSpy).toHaveBeenCalledTimes(1)
  })

  test('silently skips submit when requireDirty is true and form is not dirty', async () => {
    const submitSpy = vi.fn(async (state: { name: string }) => state)

    const form = reatomForm({ name: '' }, { onSubmit: submitSpy }).extend(
      withFormSubmitHandler({ requireDirty: true }),
    )

    expect(form.focus().dirty).toBe(false)

    form.handleSubmit()
    await wrap(sleep())

    expect(submitSpy).toHaveBeenCalledTimes(0)
    expect(form.submit.error()).toBeUndefined()
  })

  test('sets submit error when requireDirty is a string and form is not dirty', async () => {
    const submitSpy = vi.fn(async (state: { name: string }) => state)

    const form = reatomForm({ name: '' }, { onSubmit: submitSpy }).extend(
      withFormSubmitHandler({ requireDirty: 'No changes to save' }),
    )

    form.handleSubmit()
    await wrap(sleep())

    expect(submitSpy).toHaveBeenCalledTimes(0)
    expect(form.submit.error()).toBeInstanceOf(Error)
    expect(form.submit.error()?.message).toBe('No changes to save')
  })

  test('submits when requireDirty is true and form is dirty', async () => {
    const submitSpy = vi.fn(async (state: { name: string }) => state)

    const form = reatomForm({ name: '' }, { onSubmit: submitSpy }).extend(
      withFormSubmitHandler({ requireDirty: true }),
    )

    form.fields.name.change('Ada')
    expect(form.focus().dirty).toBe(true)

    form.handleSubmit()
    await wrap(sleep())

    expect(submitSpy).toHaveBeenCalledTimes(1)
  })

  test('submits when requireDirty is a string and form is dirty', async () => {
    silentQueuesErrors()
    const submitSpy = vi.fn(async (state: { name: string }) => state)

    const form = reatomForm({ name: '' }, { onSubmit: submitSpy }).extend(
      withFormSubmitHandler({ requireDirty: 'No changes to save' }),
    )

    form.fields.name.change('Ada')
    expect(form.focus().dirty).toBe(true)

    form.handleSubmit()
    await wrap(sleep())

    expect(submitSpy).toHaveBeenCalledTimes(1)
    expect(form.submit.error()?.message).not.toBe('No changes to save')
  })
})
