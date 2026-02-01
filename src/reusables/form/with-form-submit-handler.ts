import { action, type Action, type Form } from '@reatom/core'

/** Event-like object with a `preventDefault` method (DOM, React, Svelte, etc.). */
interface PreventableEvent {
  preventDefault(): void
}

/** Configuration for {@link withFormSubmitHandler}. */
interface FormSubmitHandlerConfig {
  /**
   * Skip submission when the form is not dirty.
   *
   * - `true` — silently skip
   * - `string` — skip and set the string as `form.submit.error`
   */
  requireDirty?: true | string
}

/** Extension object added to the form by {@link withFormSubmitHandler}. */
interface FormSubmitHandlerExt {
  handleSubmit: Action<[event?: PreventableEvent], void>
}

/**
 * Form extension that adds a `handleSubmit` action for event-driven submission
 * with an optional dirty-guard.
 *
 * @example
 *   const form = reatomForm(
 *     { name: '' },
 *     { onSubmit: async (s) => api.save(s) },
 *   ).extend(withFormSubmitHandler({ requireDirty: true }))
 *
 *   // In a framework handler:
 *   form.handleSubmit(event)
 */
export const withFormSubmitHandler =
  ({ requireDirty }: FormSubmitHandlerConfig = {}) =>
  <T extends Form<any>>(form: T): FormSubmitHandlerExt => ({
    handleSubmit: action((event?: PreventableEvent) => {
      event?.preventDefault()
      if (requireDirty && !form.focus().dirty) {
        if (typeof requireDirty === 'string') {
          form.submit.error.set(new Error(requireDirty))
        }
        return
      }
      form.submit()
    }, `${form.name}.handleSubmit`),
  })
