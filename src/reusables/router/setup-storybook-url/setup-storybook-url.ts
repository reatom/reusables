import { context, noop, urlAtom, withChangeHook } from '@reatom/core'

const originalHref = window.location.href

/**
 * Configures `urlAtom` for Storybook: disables History API sync and restores
 * the original iframe URL after every state change.
 *
 * Call once per story in a Storybook decorator. Returns a context frame
 * suitable for passing to `reatomContext.Provider`.
 *
 * @param initialPath - Optional path to navigate to after setup
 * @param beforeNavigate - Optional setup (e.g. auth state) executed inside the
 *   frame before navigation, so route matching and loader evaluation happen
 *   only once with the correct state, avoiding concurrent loader abort errors
 * @returns A context frame to provide to React context
 * @see https://dev.to/guria/reatom-extensibility-saves-the-day-595e
 */
export const setupStorybookUrl = (
  initialPath = '',
  beforeNavigate?: () => void,
) => {
  const frame = context.start()
  frame.run(() => {
    urlAtom.sync.set(() => noop)
    urlAtom.extend(
      withChangeHook(() => {
        window.history.replaceState({}, '', originalHref)
      }),
    )
    beforeNavigate?.()
    const base = import.meta.env.BASE_URL ?? ''
    urlAtom.go(base + initialPath)
  })

  return frame
}
