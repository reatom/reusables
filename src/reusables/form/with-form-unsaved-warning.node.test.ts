import { reatomForm } from '@reatom/core'
import { describe, expect, test, vi } from 'test'

import { withFormUnsavedWarning } from './with-form-unsaved-warning'
import { assert } from 'node:console'

describe('withFormUnsavedWarning', () => {
  assert(
    typeof window === 'undefined',
    'This test should run in a Node environment',
  )

  test('does not crash without window (SSR)', () => {
    const form = reatomForm({ name: '' }, { onSubmit: async () => {} }).extend(
      withFormUnsavedWarning(),
    )

    form.fields.name.change('Ada')

    expect(form.focus().dirty).toBe(true)
  })
})
