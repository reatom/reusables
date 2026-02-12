import { action, onEvent, type Form } from '@reatom/core'

/**
 * Form extension that warns the user before leaving the page when the form has
 * unsaved changes, using the browser's `beforeunload` event.
 *
 * Accepts an optional callback that fires on every dirty state change, useful
 * for integrating with SPA router navigation guards.
 */
export const withFormUnsavedWarning =
  <Target extends Form<any>>(
    checkUnsaved: (form: Target) => boolean = (form) => form.focus().dirty,
  ) =>
  (target: Target) => {
    const preventNavigation = action((event: BeforeUnloadEvent) => {
      if (checkUnsaved(target)) {
        event.preventDefault()
      }
    })

    if (typeof window !== 'undefined') {
      onEvent(window, 'beforeunload', preventNavigation)
    }
    return { preventNavigation }
  }
