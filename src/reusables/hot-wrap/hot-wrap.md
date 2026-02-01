# hotWrap

Combines `subscribe` + `wrap` in one call, with automatic cleanup on component unmount.

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
import { reatomComponent } from '@reatom/react'
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

export const Counter = reatomComponent(() => {
  const value = count()

  return (
    <div>
      <p>Count: {value}</p>
      {/* hotWrap subscribes -> socket listener starts */}
      {/* On unmount -> cleanup runs automatically */}
      <button onClick={hotWrap(reset)}>Reset</button>
    </div>
  )
}, 'Counter')
```

Without `hotWrap`, you'd need to subscribe via `effect` + `getCalls` and use `wrap` separately:

```tsx
// Manual approach - hotWrap does this for you
effect(() => {
  getCalls(reset)
})

<button onClick={wrap(reset)}>Reset</button>
```

### Cleanup

The subscription is connected to `abortVar`, so cleanup happens automatically on component unmount, context reset, or HMR.
