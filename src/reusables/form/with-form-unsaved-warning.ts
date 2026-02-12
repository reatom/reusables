import { effect, onEvent, type Form } from '@reatom/core'

/**
 * Form extension that warns the user before leaving the page when the form has
 * unsaved changes, using the browser's `beforeunload` event.
 *
 * Accepts an optional callback that fires on every dirty state change, useful
 * for integrating with SPA router navigation guards.
 */
export const withFormUnsavedWarning =
  (cb?: (dirty: boolean) => void) =>
  <T extends Form<any>>(form: T): T => {
    effect(() => {
      const dirty = form.focus().dirty

      cb?.(dirty)

      if (typeof window === 'undefined') return

      if (dirty) {
        onEvent(window, 'beforeunload', (event: BeforeUnloadEvent) => {
          event.preventDefault()
          event.returnValue = ''
        })
      }
    })

    return form
  }
