import { context, reatomForm, sleep } from '@reatom/core'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { withFormResetOnSubmit } from './with-form-reset-on-submit'

beforeEach(() => {
  context.reset()
})

describe('withFormResetOnSubmit', () => {
  test('resets dirty state after successful submit while keeping values', async () => {
    const submitSpy = vi.fn(async (state: { name: string }) => state)

    const form = reatomForm({ name: '' }, { onSubmit: submitSpy }).extend(
      withFormResetOnSubmit(),
    )

    form.fields.name.change('Ada')
    expect(form.focus().dirty).toBe(true)

    await form.submit()
    await sleep()

    expect(submitSpy).toHaveBeenCalledWith({ name: 'Ada' })
    expect(form.focus().dirty).toBe(false)
    expect(form().name).toBe('Ada')
  })
})
