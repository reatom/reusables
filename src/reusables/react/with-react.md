# withReact

Atom/action extension that adds a `.useReact()` hook to any target.

`useReact` delegates to `useAtom` for atoms and `useAction` for actions from `@reatom/react`.

## `withReact()`

Adds `useReact` to atoms and actions.

### Returns

Extension that adds:

| Target  | Property   | Type |
| ------- | ---------- | ---- |
| Atom    | `useReact` | `() => State` |
| Action  | `useReact` | `() => (...params: Params) => Result` |

### Example

```tsx
import { action, atom } from '@reatom/core'
import { reatomComponent } from '@reatom/react'
import { withReact } from '#reatom/extension/with-react'

const count = atom(0, 'count').extend(withReact())
const increment = action(() => count.set(count() + 1), 'increment').extend(
  withReact(),
)

export const Counter = reatomComponent(() => {
  const countValue = count.useReact()
  const incrementClick = increment.useReact()

  return <button onClick={incrementClick}>{countValue}</button>
}, 'Counter')
```

### Global setup (Zustand-style API)

You can make `useReact` available on every atom and action with `addGlobalExtension`.
This gives you a zustand-like experience where each atom acts like a store with
a built-in hook, while keeping Reatom's perfect logging, composable atoms, and
the rest of the ecosystem.

```ts
import { addGlobalExtension } from '@reatom/core'
import { withReact } from '#reatom/extension/with-react'

addGlobalExtension(withReact())
```

To make TypeScript aware of the global extension, add module augmentation:

```ts
declare module '@reatom/core' {
  interface AtomExt<State> {
    useReact: () => State
  }

  interface ActionExt<Params extends unknown[], Result> {
    useReact: () => (...params: Params) => Result
  }
}
```

Now you can use atoms like zustand stores:

```tsx
import { action, atom } from '@reatom/core'

const count = atom(0, 'count')
const increment = action(() => count.set(count() + 1), 'increment')

export const Counter = () => {
  const countValue = count.useReact()
  const incrementClick = increment.useReact()

  return <button onClick={incrementClick}>{countValue}</button>
}
```
