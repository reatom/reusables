import {
  isAction,
  type Action,
  type Atom,
  type AtomState,
  type Ext,
} from '@reatom/core'
import { useAction, useAtom } from '@reatom/react'

type ActionParams<T> = T extends Action<infer Params, unknown> ? Params : never

type ActionResult<T> = T extends Action<unknown, infer Result> ? Result : never

export type ReactAtomExt<T> = T extends Atom ? { useReact: () => AtomState<T> } : never

export type ReactActionExt<T> = T extends Action
  ? { useReact: () => (...params: ActionParams<T>) => ActionResult<T> }
  : never

function buildReactExt<T extends Atom>(target: T): ReactAtomExt<T>
function buildReactExt<T extends Action>(target: T): ReactActionExt<T>
function buildReactExt(target: Atom | Action) {
  if (isAction(target)) {
    const useReact = () => useAction(target)
    return { useReact }
  }

  const useReact = () => useAtom(target)
  return { useReact }
}

export function withReact<T extends Atom>(): Ext<T, ReactAtomExt<T>>
export function withReact<T extends Action>(): Ext<T, ReactActionExt<T>>
export function withReact<T extends Atom | Action>(): Ext<
  T,
  ReactAtomExt<T> | ReactActionExt<T>
> {
  return (target) => buildReactExt(target)
}
