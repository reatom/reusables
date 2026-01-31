import {
  action,
  type Action,
  type Atom,
  type AtomState,
  type Ext,
} from '@reatom/core'

/** Extension interface for withReset. */
export interface ResetExt<State> {
  /** Resets the atom to its initial value. */
  reset: Action<[], State>
}

/**
 * Atom extension that adds a `.reset()` action to restore the atom to its
 * initial value.
 *
 * @example
 *   const counter = atom(0, 'counter').extend(withReset(0))
 *   counter.set(10)
 *   counter.reset() // State is now 0
 *
 * @param initialValue - The value to reset to
 */
export const withReset =
  <Target extends Atom>(
    initialValue: AtomState<Target>,
  ): Ext<Target, ResetExt<AtomState<Target>>> =>
  (target) => ({
    reset: action(() => target.set(initialValue), `${target.name}.reset`),
  })
