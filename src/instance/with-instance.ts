import { type AtomLike, type Ext } from '@reatom/core'

import { reatomInstance } from './reatom-instance'

type InstanceExt<I> = {
  instance: ReturnType<typeof reatomInstance<I>>
}

/**
 * Atom extension that adds an `.instance` property — a lifecycle-managed
 * instance derived from the atom's value.
 *
 * When the source atom changes, the previous instance is disposed and a new one
 * is created automatically.
 *
 * @example
 *   const dimensions = atom({ x: 1, y: 1, z: 1 }).extend(
 *     withInstance(
 *       (dims) => new BoxGeometry(dims().x, dims().y, dims().z),
 *       (geometry) => geometry.dispose(),
 *     ),
 *   )
 *   // Access via dimensions.instance()
 *
 * @param create - Factory receiving the source atom
 * @param dispose - Cleanup function called when instance changes
 */
export const withInstance =
  <T extends AtomLike, I>(
    create: (target: T) => I,
    dispose?: (instance: I) => void,
  ): Ext<T, InstanceExt<I>> =>
  (target) => ({ instance: reatomInstance(() => create(target), dispose) })
