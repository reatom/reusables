import { abortVar, wrap } from '@reatom/core'

/**
 * Combines `subscribe` + `wrap` in one call. The subscription is released when
 * the abort controller current at call time aborts.
 *
 * Equivalent to:
 *
 *     abortVar.subscribe(target.subscribe())
 *     return wrap(target, frame)
 *
 * In React, call it in the `reatomFactoryComponent` factory body: the init
 * frame is aborted on unmount. The `reatomComponent` render frame is not
 * (unless `abortOnUnmount: true`), so a call in render never unsubscribes.
 *
 * ```tsx
 * const toggle = action(() => paused.set((p) => !p), 'toggle').extend(
 *   withButton({ title: 'Toggle' }),
 * )
 *
 * const Toggle = reatomFactoryComponent(() => {
 *   const onToggle = hotWrap(toggle)
 *   return () => <button onClick={onToggle}>Toggle</button>
 * })
 * ```
 */
// @ts-ignore - intentionally typed as wrap but with subscription side effect
export const hotWrap: typeof wrap = (target, frame) => {
  abortVar.subscribe(target.subscribe())
  return wrap(target, frame)
}
