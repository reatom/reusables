import { reatomField, reatomForm } from '@reatom/core'
import { describe, expect, test, vi } from 'test'

import { withFormAutoFocusOnError } from './with-form-auto-focus-on-error'

describe('withFormAutoFocusOnError', () => {
  test('focuses the first field with a validation error on submit rejection', async () => {
    const nameFocus = vi.fn()
    const emailFocus = vi.fn()

    const form = reatomForm(
      {
        name: reatomField('', {
          validate: ({ value }) => (!value ? 'Required' : ''),
        }),
        email: reatomField('', {
          validate: ({ value }) => (!value ? 'Required' : ''),
        }),
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
