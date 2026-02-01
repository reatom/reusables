import { noop, urlAtom, withChangeHook } from '@reatom/core'

/**
 * Configures `urlAtom` for Storybook: disables History API sync and restores
 * the original iframe URL after every state change.
 *
 * Call once in `.storybook/preview.tsx` before any routing runs.
 *
 * @see https://dev.to/guria/reatom-extensibility-saves-the-day-595e
 */
export const setupStorybookUrl = () => {
  const originalHref = window.location.href

  urlAtom.sync.set(() => noop)

  urlAtom.extend(
    withChangeHook(() => {
      window.history.replaceState({}, '', originalHref)
    }),
  )
}
