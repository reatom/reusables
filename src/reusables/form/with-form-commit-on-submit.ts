import { withCallHook, type Form } from '@reatom/core'

/**
 * Form extension that commits the submitted state as the new baseline after a
 * successful submit, so that `dirty` becomes `false` while keeping the new
 * values.
 */
export const withFormCommitOnSubmit =
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
