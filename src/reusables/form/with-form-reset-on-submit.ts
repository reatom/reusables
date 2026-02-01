import { withCallHook, type Form } from '@reatom/core'

/**
 * Form extension that resets the form to the submitted state after a successful
 * submit, so that `dirty` becomes `false` while keeping the new values.
 */
export const withFormResetOnSubmit =
  () =>
  <T extends Form<any>>(form: T): T => {
    form.submit.onFulfill.extend(
      withCallHook(() => {
        const formState = form()
        form.reset(formState)
      }),
    )

    return form
  }
