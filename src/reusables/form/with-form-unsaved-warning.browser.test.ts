import { assert, getCalls, noop, reatomForm } from '@reatom/core'
import { describe, expect, test, vi } from 'test'

import { withFormUnsavedWarning } from './with-form-unsaved-warning'

describe('withFormUnsavedWarning', () => {
  assert(typeof window !== 'undefined', 'Test requires a browser environment')

  test('prevents beforeunload only when form is dirty', () => {
    const form = reatomForm({ name: '' }, { onSubmit: noop }).extend(
      withFormUnsavedWarning(),
    )

    const clean = new Event('beforeunload', { cancelable: true })
    const cleanSpy = vi.spyOn(clean, 'preventDefault')
    window.dispatchEvent(clean)
    expect(cleanSpy).not.toHaveBeenCalled()

    form.fields.name.change('Ada')

    const dirty = new Event('beforeunload', { cancelable: true })
    const dirtySpy = vi.spyOn(dirty, 'preventDefault')
    window.dispatchEvent(dirty)
    expect(dirtySpy).toHaveBeenCalled()
  })

  test('uses custom checkUnsaved predicate', () => {
    const checkUnsaved = vi.fn(() => true)

    const form = reatomForm({ name: '' }, { onSubmit: noop }).extend(
      withFormUnsavedWarning(checkUnsaved),
    )

    const event = new Event('beforeunload', { cancelable: true })
    window.dispatchEvent(event)

    expect(checkUnsaved).toHaveBeenCalledWith(form)
  })

  test('exposes action to hook into its calls', () => {
    const form = reatomForm({ name: '' }, { onSubmit: noop }).extend(
      withFormUnsavedWarning(),
    )

    const event = new Event('beforeunload', { cancelable: true })
    window.dispatchEvent(event)

    expect(getCalls(form.preventNavigation)).toHaveLength(1)
  })
})
