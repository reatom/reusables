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

Use `hotWrap` when you need subscription with lifecycle-aware cleanup:

```tsx
import { action, atom, withConnectHook } from '@reatom/core'
import { reatomComponent } from '@reatom/react'
import { hotWrap } from '#reatom/utility/hot-wrap'

// Extension that runs on connect/disconnect (activates when subscribed)
const withLog = (name: string) =>
  withConnectHook(() => {
    console.log(`${name} connected`)
    return () => console.log(`${name} disconnected`)
  })

const count = atom(0, 'count')
const reset = action(() => count.set(0), 'reset').extend(withLog('reset'))

export const Counter = reatomComponent(() => {
  const value = count()

  return (
    <div>
      <p>Count: {value}</p>
      {/* hotWrap subscribes → extension activates */}
      {/* On unmount → cleanup runs automatically */}
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
