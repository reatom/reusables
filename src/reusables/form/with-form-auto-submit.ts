import {
  action,
  isAbort,
  sleep,
  take,
  wrap,
  type Action,
  type Form,
  type FormInitState,
} from '@reatom/core'

interface FormAutoSubmitOptions {
  debounceMs?: number
}

interface FormAutoSubmitExt {
  waitAutoSubmit: Action<[], Promise<void>>
}

/**
 * Form extension that automatically submits after changes settle.
 *
 * Returns a `waitAutoSubmit` action that should be called in
 * `reatomFactoryComponent` or a route loader. The action loops forever, waiting
 * for form changes with `take`, debouncing, and submitting.
 *
 * @example
 *   const form = reatomForm({ name: '' }, { onSubmit }).extend(
 *     withFormAutoSubmit({ debounceMs: 500 }),
 *   )
 *   // in reatomFactoryComponent or route loader:
 *   form.waitAutoSubmit()
 */
export const withFormAutoSubmit =
  ({ debounceMs = 300 }: FormAutoSubmitOptions = {}) =>
  <T extends FormInitState>(form: Form<T>): FormAutoSubmitExt => {
    return {
      waitAutoSubmit: action(async () => {
        try {
          while (true) {
            await wrap(take(form))
            if (!form.focus().dirty) continue

            await wrap(sleep(debounceMs))
            if (!form.focus().dirty) continue

            const newValues = form()
            form.submit()
            await wrap(sleep())
            form.init(newValues)
          }
        } catch (error) {
          if (!isAbort(error)) throw error
        }
      }, `${form.name}.waitAutoSubmit`),
    }
  }
