import {
  computed,
  type Atom,
  type AtomState,
  type Computed,
  type Ext,
} from '@reatom/core'

/** Extension interface for withHistory. */
export interface HistoryExt<State> {
  /** Computed atom containing current state and past states. */
  history: Computed<[State, ...State[]]>
}

/**
 * Atom extension that tracks state history with configurable length.
 *
 * Adds a `.history` computed atom that returns a tuple of `[currentState,
 * ...previousStates]`.
 *
 * @example
 *   const counter = atom(0, 'counter').extend(withHistory())
 *   counter.set(1)
 *   counter.set(2)
 *   counter.history() // [2, 1, 0] (current + 2 previous)
 *
 * @param length - Number of previous states to keep (default: 2)
 */
export const withHistory = <Target extends Atom>(
  length = 2,
): Ext<Target, HistoryExt<AtomState<Target>>> => {
  type State = AtomState<Target>
  type History = [State, ...State[]]

  return (target) => ({
    history: computed(
      (state: History | undefined) =>
        [target(), ...(state || []).slice(0, length)] satisfies History,
      `${target.name}.history`,
    ),
  })
}
