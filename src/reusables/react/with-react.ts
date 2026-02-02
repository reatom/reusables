import {
  isAction,
  type Action,
  type Atom,
  type Computed,
  type Ext,
} from '@reatom/core'
import { useAction, useAtom } from '@reatom/react'

type UseAtomResult<T extends Atom> = typeof useAtom extends (
  atom: T,
  ...args: unknown[]
) => infer Result
  ? Result
  : never

type UseActionResult<T extends Action> = typeof useAction extends (
  action: T,
  ...args: unknown[]
) => infer Result
  ? Result
  : never

export type ReactAtomExt<T extends Atom> = {
  useReact: () => UseAtomResult<T>
}

export type ReactActionExt<T extends Action> = {
  useReact: () => UseActionResult<T>
}

function buildReactExt<T extends Action>(target: T): ReactActionExt<T>
function buildReactExt<T extends Atom>(target: T): ReactAtomExt<T>
function buildReactExt(target: Atom | Action) {
  if (isAction(target)) {
    const useReact = () => useAction(target)
    return { useReact }
  }

  const useReact = () => useAtom(target)
  return { useReact }
}

export function withReact<Params extends unknown[], Payload>(): Ext<
  Action<Params, Payload>,
  ReactActionExt<Action<Params, Payload>>
>
export function withReact<T extends Computed>(): Ext<T, ReactAtomExt<T>>
export function withReact<T extends Atom>(): Ext<T, ReactAtomExt<T>>
export function withReact<T extends Atom | Action>(): Ext<
  T,
  ReactAtomExt<T> | ReactActionExt<T>
> {
  return (target) => buildReactExt(target)
}
