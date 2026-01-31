# reatomInstance

Lifecycle-managed factory for imperative instances. Creates objects lazily on subscribe and disposes them automatically when dependencies change or on abort.

## `reatomInstance(create, dispose?, name?)`

Wraps a `computed` atom that calls `create` to produce an instance. The instance is:

- **Created lazily** — only when the atom gets a subscriber
- **Disposed on recompute** — when a reactive dependency changes, the previous instance is disposed before a new one is created
- **Disposed on abort** — calling `.abort()` triggers the dispose callback
- **Reset on disconnect** — when all subscribers leave, the atom resets so the next subscriber gets a fresh instance

### Parameters

| Parameter | Type                    | Description                                            |
| --------- | ----------------------- | ------------------------------------------------------ |
| `create`  | `() => I`               | Factory that creates the instance                      |
| `dispose` | `(instance: I) => void` | Cleanup callback (optional)                            |
| `name`    | `string`                | Debug name for the underlying computed atom (optional) |

### Returns

A computed atom extended with `withAbort()` and `withDisconnectHook()`.

### Example

```ts
import { reatomInstance } from '#reatom/factory/reatom-instance'

// Manage a Web Audio oscillator
const oscillator = reatomInstance(
  () => audioContext.createOscillator(),
  (osc) => osc.stop(),
)

// Instance is created when subscribed
const unsub = oscillator.subscribe((osc) => {
  osc.connect(audioContext.destination)
  osc.start()
})

// Disposed and reset when unsubscribed
unsub()
```

### Reactive dependencies

When the `create` function reads other atoms, the instance is automatically recreated (and the previous one disposed) when those atoms change:

```ts
import { atom } from '@reatom/core'
import { reatomInstance } from '#reatom/factory/reatom-instance'

const url = atom('/api/data')

const eventSource = reatomInstance(
  () => new EventSource(url()),
  (es) => es.close(),
)
// When `url` changes, the old EventSource is closed
// and a new one is created with the updated URL.
```

## See also

- [withInstance](./with-instance.md) — Atom extension that adds a lifecycle-managed `.instance` property
