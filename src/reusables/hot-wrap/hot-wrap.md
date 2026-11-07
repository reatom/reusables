# hotWrap

Combines `subscribe` + `wrap` in one call. The subscription is released when the
abort controller current at call time aborts.

## `hotWrap(target, frame?)`

Equivalent to:

```ts
abortVar.subscribe(target.subscribe())
return wrap(target, frame)
```

### Parameters

| Parameter | Type       | Description                         |
| --------- | ---------- | ----------------------------------- |
| `target`  | `AtomLike` | The action to subscribe and wrap    |
| `frame`   | `Atom`     | Optional frame for the wrap context |

### Returns

The wrapped action (same as `wrap` returns).

### When to use

Use `hotWrap` when you need subscription with lifecycle-aware cleanup, like
starting and stopping a remote control channel (socket/CRDT):

```tsx
import {
  action,
  atom,
  type Action,
  type Ext,
  withConnectHook,
} from '@reatom/core'
import { reatomFactoryComponent } from '@reatom/react'
import { hotWrap } from '#reatom/utility/hot-wrap'

// External control channel (socket/CRDT) for remote resets.
type ResetSocket = {
  on: (event: 'reset', handler: () => void) => () => void
  close: () => void
}

const connectResetSocket = (_url: string): ResetSocket => ({
  on: () => () => undefined,
  close: () => undefined,
})

const withRemoteReset = <Target extends Action<[], unknown>>(): Ext<Target> =>
  withConnectHook((target) => {
    const socket = connectResetSocket('wss://example')
    const off = socket.on('reset', () => target())
    return () => {
      off()
      socket.close()
    }
  })

const count = atom(0, 'count')
const reset = action(() => count.set(0), 'reset').extend(withRemoteReset())

export const Counter = reatomFactoryComponent(() => {
  // Factory body (init): subscribes -> socket listener starts.
  // Unmount aborts the init frame -> socket closes.
  const onReset = hotWrap(reset)

  return () => (
    <div>
      <p>Count: {count()}</p>
      <button onClick={onReset}>Reset</button>
    </div>
  )
}, 'Counter')
```

Without `hotWrap`, you'd subscribe and `wrap` separately in the factory body:

```tsx
abortVar.subscribe(reset.subscribe())
const onReset = wrap(reset)
```

### Cleanup

`hotWrap` ties the subscription to `abortVar` at call time, so where you call it
decides when it is released:

- **`reatomFactoryComponent` factory body:** released on unmount. The init frame
  is aborted when the component unmounts.
- **Component render** (`reatomComponent`, or the render function returned by
  `reatomFactoryComponent`): `hotWrap` throws. The render frame is not aborted
  on unmount by default, so the subscription would leak on every mount, keeping alive
  anything it started, such as a socket or a Tweakpane button from
  `withConnectHook`.

Don't work around the throw with `reatomComponent(..., { abortOnUnmount: true })`:
under StrictMode it currently aborts the whole Reatom context on unmount.

Under StrictMode, release from the factory body needs `@reatom/react` with
[reatom/reatom#1324](https://github.com/reatom/reatom/pull/1324); in 1001.0.1
and earlier the remount keeps the first init's subscription alive.
