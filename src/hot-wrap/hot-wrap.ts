import { abortVar, wrap } from '@reatom/core'

/**
 * Combines `subscribe` + `wrap` in one call, with automatic cleanup on
 * component unmount.
 *
 * Equivalent to: abortVar.subscribe(target.subscribe()) return wrap(target,
 * frame)
 *
 * @example
 *   const toggle = action(...).extend(withButton({ title: 'Toggle' }))
 *   return () => <button onClick={hotWrap(toggle)}>Toggle</button>
 */
// @ts-ignore - intentionally typed as wrap but with subscription side effect
export const hotWrap: typeof wrap = (target, frame) => {
  abortVar.subscribe(target.subscribe())
  return wrap(target, frame)
}
