import { reatomForm, sleep, withCallHook, wrap } from '@reatom/core'
import { describe, expect, test, vi } from 'test'

import { withFormUnsavedWarning } from './with-form-unsaved-warning'

describe('withFormUnsavedWarning', () => {
  test('prevents beforeunload only when form is dirty', () => {
    if (typeof window === 'undefined') return

    const form = reatomForm({ name: '' }, { onSubmit: async () => {} }).extend(
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
    if (typeof window === 'undefined') return

    const checkUnsaved = vi.fn(() => true)

    const form = reatomForm({ name: '' }, { onSubmit: async () => {} }).extend(
      withFormUnsavedWarning(checkUnsaved),
    )

    const event = new Event('beforeunload', { cancelable: true })
    const spy = vi.spyOn(event, 'preventDefault')
    window.dispatchEvent(event)

    expect(checkUnsaved).toHaveBeenCalledWith(form)
    expect(spy).toHaveBeenCalled()
  })

  test('exposes preventNavigation action extensible with withCallHook', async () => {
    if (typeof window === 'undefined') return

    const hook = vi.fn()

    const form = reatomForm({ name: '' }, { onSubmit: async () => {} }).extend(
      withFormUnsavedWarning(),
    )

    form.preventNavigation.extend(withCallHook(hook))

    form.fields.name.change('Ada')

    const event = new Event('beforeunload', { cancelable: true })
    window.dispatchEvent(event)
    await wrap(sleep())

    expect(hook).toHaveBeenCalled()
  })

  test('does not crash without window (SSR)', () => {
    if (typeof window !== 'undefined') return

    const form = reatomForm({ name: '' }, { onSubmit: async () => {} }).extend(
      withFormUnsavedWarning(),
    )

    form.fields.name.change('Ada')

    expect(form.focus().dirty).toBe(true)
  })
})
