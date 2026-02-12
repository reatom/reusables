import { reatomForm, sleep } from '@reatom/core'
import { describe, expect, test, vi } from 'test'

import { withFormUnsavedWarning } from './with-form-unsaved-warning'

describe('withFormUnsavedWarning', () => {
  test('manages beforeunload listener based on dirty state', async () => {
    if (typeof window === 'undefined') return

    const form = reatomForm({ name: '' }, { onSubmit: async () => {} }).extend(
      withFormUnsavedWarning(),
    )

    form.fields.name.change('Ada')
    await sleep()

    const dirty = new Event('beforeunload', {
      cancelable: true,
    }) as BeforeUnloadEvent
    const dirtySpy = vi.spyOn(dirty, 'preventDefault')
    const dirtyReturnValueSetter = vi.fn()
    Object.defineProperty(dirty, 'returnValue', {
      get: () => '',
      set: dirtyReturnValueSetter,
      configurable: true,
    })
    window.dispatchEvent(dirty)
    expect(dirtySpy).toHaveBeenCalled()
    expect(dirtyReturnValueSetter).toHaveBeenCalledWith('')

    form.reset()
    await sleep()

    const clean = new Event('beforeunload', {
      cancelable: true,
    }) as BeforeUnloadEvent
    const cleanSpy = vi.spyOn(clean, 'preventDefault')
    const cleanReturnValueSetter = vi.fn()
    Object.defineProperty(clean, 'returnValue', {
      get: () => false,
      set: cleanReturnValueSetter,
      configurable: true,
    })
    window.dispatchEvent(clean)
    expect(cleanSpy).not.toHaveBeenCalled()
    expect(cleanReturnValueSetter).not.toHaveBeenCalled()
  })

  test('calls callback on dirty state changes', async () => {
    const cb = vi.fn()

    const form = reatomForm({ name: '' }, { onSubmit: async () => {} }).extend(
      withFormUnsavedWarning(cb),
    )

    await sleep()
    expect(cb).toHaveBeenLastCalledWith(false)

    form.fields.name.change('Ada')
    await sleep()
    expect(cb).toHaveBeenLastCalledWith(true)

    form.reset()
    await sleep()
    expect(cb).toHaveBeenLastCalledWith(false)
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
