import { context, reatomForm } from '@reatom/core'
import { beforeEach, describe, expect, test, vi } from 'vitest'

import { withFormAutoFocusOnError } from './with-form-auto-focus-on-error'

beforeEach(() => {
  context.reset()
})

describe('withFormAutoFocusOnError', () => {
  test('focuses the first field with a validation error on submit rejection', async () => {
    const nameFocus = vi.fn()
    const emailFocus = vi.fn()

    const form = reatomForm(
      {
        name: {
          initState: '',
          validate: ({ value }) => (!value ? 'Required' : ''),
        },
        email: {
          initState: '',
          validate: ({ value }) => (!value ? 'Required' : ''),
        },
      },
      {
        onSubmit: async (state) => state,
      },
    ).extend(withFormAutoFocusOnError())

    form.fields.name.elementRef.set({ focus: nameFocus })
    form.fields.email.elementRef.set({ focus: emailFocus })

    await expect(form.submit()).rejects.toThrow('Required')

    expect(nameFocus).toHaveBeenCalledTimes(1)
    expect(emailFocus).toHaveBeenCalledTimes(0)
  })
})
