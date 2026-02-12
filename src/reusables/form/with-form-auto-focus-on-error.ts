import { withCallHook, type Form } from '@reatom/core'

/**
 * Form extension that focuses the first field with a validation error after a
 * failed submit.
 */
export const withFormAutoFocusOnError =
  () =>
  <T extends Form<any>>(form: T): T => {
    form.submit.onReject.extend(
      withCallHook(() => {
        const errorField = form
          .fieldsList()
          .find((field) => !!field.validation().error)

        errorField?.elementRef()?.focus()
      }),
    )

    return form
  }
