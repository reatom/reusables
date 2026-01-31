import {
  type Action,
  type AtomLike,
  isAction,
  isWritableAtom,
  withConnectHook,
  wrap,
} from '@reatom/core'
import type { BladeApi } from '@tweakpane/core'
import type { BaseBladeParams, ButtonParams } from 'tweakpane'

import { type BladeRackApi, type Disposable, reatomDisposable } from './core'

/**
 * Extends an action to be triggered by a Tweakpane button.
 *
 * NOTE: You must subscribe to the action (e.g., using `getCalls` in an effect)
 * to ensure the binding is created and active.
 *
 * @example
 *   const pane = reatomPane({ name: 'controls' })
 *   const doThing = action(() => ...).extend(withButton({ title: 'Do Thing' }, pane))
 *   // Required to activate the binding:
 *   effect(() => getCalls(doThing))
 *
 * @param params - Button configuration
 * @param parent - Parent blade rack
 */
export const withButton =
  (params: ButtonParams, parent: AtomLike<BladeRackApi>) =>
  <T extends Action>(target: T) => {
    const buttonAtom = reatomDisposable(() => {
      const btnApi = parent().addButton(params)
      btnApi.on('click', wrap(target))
      return btnApi
    }, `${parent.name}.${target.name}.button`)

    target.extend(withConnectHook(() => buttonAtom.subscribe()))

    return { button: buttonAtom }
  }

/**
 * Generic extension to add any Tweakpane blade.
 *
 * @example
 *   const pane = reatomPane({ name: 'main' })
 *   const slider = atom(50).extend(
 *     withBlade({ view: 'slider', min: 0, max: 100 }, pane),
 *   )
 *
 * @param params - Blade definition
 * @param parent - Parent blade rack
 */
export const withBlade =
  <Api extends Disposable = BladeApi>(
    params: BaseBladeParams,
    parent: AtomLike<BladeRackApi>,
  ) =>
  <T extends AtomLike<unknown> | Action<unknown[], unknown>>(target: T) => {
    const bladeAtom = reatomDisposable(() => {
      const parentApi = parent()
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const bladeApi = parentApi.addBlade(params) as any

      if (isAction(target)) {
        bladeApi.on('click', wrap(target))
      } else if (isWritableAtom(target)) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        bladeApi.on(
          'change',
          wrap((ev: any) => target.set(ev.value)),
        )
      }

      return bladeApi as Api
    }, `${parent.name}.${target.name}.blade`)

    target.extend(withConnectHook(() => bladeAtom.subscribe()))

    return { blade: bladeAtom }
  }
