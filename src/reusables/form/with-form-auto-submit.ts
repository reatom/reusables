import {
  effect,
  memo,
  sleep,
  wrap,
  type Form,
  type FormInitState,
} from '@reatom/core'

/** Options for configuring withFormAutoSubmit behavior. */
interface FormAutoSubmitOptions {
  /** Debounce delay before submitting (in ms). */
  debounceMs?: number
}

/**
 * Form extension that automatically submits after changes settle.
 *
 * Watches the form state and `form.focus().dirty`, waits for a debounce
 * interval, submits, and then re-initializes the form with the latest values to
 * clear the dirty state.
 *
 * @example
 *   const form = reatomForm({ name: '' }, { onSubmit }).extend(
 *     withFormAutoSubmit({ debounceMs: 500 }),
 *   )
 */
export const withFormAutoSubmit =
  ({ debounceMs = 300 }: FormAutoSubmitOptions = {}) =>
  <T extends FormInitState>(form: Form<T>) => {
    effect(async () => {
      const newValues = form()

      const dirty = memo(() => form.focus().dirty)
      if (!dirty) return

      await wrap(sleep(debounceMs))
      await wrap(form.submit())

      form.init(newValues)
    })
    return form
  }
