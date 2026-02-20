import { action, onEvent, type Action, type Form } from '@reatom/core'

interface FormUnsavedWarningExt {
  preventNavigation: Action<[BeforeUnloadEvent], void>
  waitUnsavedWarning: Action<[], void>
}

/**
 * Form extension that warns the user before leaving the page when the form has
 * unsaved changes, using the browser's `beforeunload` event.
 *
 * Returns a `waitUnsavedWarning` action that should be called in
 * `reatomFactoryComponent` or a route loader to register the listener.
 *
 * Also exposes `preventNavigation` for SPA router integration via
 * `withCallHook`.
 */
export const withFormUnsavedWarning =
  <Target extends Form<any>>(
    checkUnsaved: (form: Target) => boolean = (form) => form.focus().dirty,
  ) =>
  (target: Target): FormUnsavedWarningExt => {
    const preventNavigation = action((event: BeforeUnloadEvent) => {
      if (checkUnsaved(target)) {
        event.preventDefault()
      }
    }, `${target.name}.preventNavigation`)

    const waitUnsavedWarning = action(() => {
      if (typeof window !== 'undefined') {
        onEvent(window, 'beforeunload', preventNavigation)
      }
    }, `${target.name}.waitUnsavedWarning`)

    return { preventNavigation, waitUnsavedWarning }
  }
