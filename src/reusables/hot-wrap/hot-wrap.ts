import { abortVar, ReatomError, wrap } from '@reatom/core'

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
 * frame is aborted on unmount. A component render frame is not, so `hotWrap`
 * throws when called in render.
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
 *
 * @throws {ReatomError} If called in a component render frame
 */
// @ts-ignore - intentionally typed as wrap but with subscription side effect
export const hotWrap: typeof wrap = (target, frame) => {
  // `reatomAbstractRender` (React, Preact, Lit adapters) marks the render
  // frame controller as spawned.
  if (abortVar.get()?.spawned) {
    throw new ReatomError(
      `hotWrap(${target.name}) called in a component render, where its subscription is never released. Call hotWrap in the reatomFactoryComponent factory body (init) and use the returned handler in render.`,
    )
  }
  abortVar.subscribe(target.subscribe())
  return wrap(target, frame)
}
