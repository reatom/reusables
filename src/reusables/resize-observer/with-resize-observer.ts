import {
  computed,
  memo,
  reatomObservable,
  wrap,
  type Atom,
  type Computed,
  type Ext,
} from '@reatom/core'

/** Extension interface for withResizeObserver. */
export interface ResizeObserverExt {
  /** Computed atom containing the latest ResizeObserver entry. */
  sizeEntry: Computed<ResizeObserverEntry | undefined>
}

/**
 * Atom extension that observes an HTMLElement size with ResizeObserver.
 *
 * Adds a `.sizeEntry` computed atom that returns the latest ResizeObserverEntry
 * for the current element, or `undefined` before the first observation and when
 * the target atom has no element.
 *
 * @example
 *   const element = atom<HTMLElement | null>(null, 'element').extend(
 *     withResizeObserver(),
 *   )
 *   element.sizeEntry()?.contentRect.width
 */
export const withResizeObserver = <
  Target extends Atom<HTMLElement | null>,
>(): Ext<Target, ResizeObserverExt> => {
  return (target) => ({
    sizeEntry: computed(() => {
      const entryAtom = memo(() => {
        const node = target()
        if (!node) return null

        return reatomObservable<ResizeObserverEntry | undefined>({
          initState: undefined,
          subscribe: (set) => {
            const observer = new ResizeObserver(
              wrap((entries) => {
                set(entries.find((entry) => entry.target === node))
              }),
            )

            observer.observe(node)

            return () => observer.disconnect()
          },
        })
      })

      return entryAtom?.()
    }, `${target.name}.sizeEntry`),
  })
}
