import {
  addChangeHook,
  withConnectHook,
  type AtomLike,
  type Ext,
} from '@reatom/core'

/**
 * Atom extension that mirrors a string atom's value into `document.title`.
 *
 * The sync is connect-gated: it starts on the first subscriber (setting the
 * title immediately), tracks further changes while connected, and stops on
 * disconnect. When nothing subscribes, `document.title` is left untouched. Safe
 * on the server — it no-ops when `document` is undefined.
 *
 * Applicable to any `AtomLike<string>`, including a `computed` (the primary use
 * case: derive a title, then extend it with `withDocumentTitle()`).
 *
 * @example
 *   const title = computed(() => `${pageLabel()} | My App`, 'title').extend(
 *     withDocumentTitle(),
 *   )
 *   // document.title stays untouched until something subscribes to `title`.
 */
export const withDocumentTitle = <
  Target extends AtomLike<string>,
>(): Ext<Target> =>
  withConnectHook<Target>((target) => {
    if (typeof document === 'undefined') return
    document.title = target()
    return addChangeHook(target, (title) => {
      document.title = title
    })
  })
