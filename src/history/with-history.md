# withHistory

Atom extension that tracks state history with configurable length.

## `withHistory(length?)`

Adds a `.history` computed atom that returns a tuple of `[currentState, ...previousStates]`.

### Parameters

| Parameter | Type     | Default | Description                       |
| --------- | -------- | ------- | --------------------------------- |
| `length`  | `number` | `2`     | Number of previous states to keep |

### Returns

Extension that adds:

| Property  | Type                                           | Description                           |
| --------- | ---------------------------------------------- | ------------------------------------- |
| `history` | `Computed<[current: State, ...past: State[]]>` | Computed with current and past states |

### Example

```ts
import { atom } from '@reatom/core'
import { withHistory } from '#reatom/extension/with-history'

const counter = atom(0, 'counter').extend(withHistory(3))

counter.set(1)
counter.set(2)
counter.set(3)

counter.history() // [3, 2, 1, 0]
```

### Undo functionality

```ts
const counter = atom(0, 'counter').extend(withHistory(10))

// Subscribe to activate the history computed
const unsub = counter.history.subscribe(() => {})

counter.set(1)
counter.set(2)
counter.set(3)

// Undo: restore previous state
const undo = () => {
  const [_current, previous] = counter.history()
  if (previous !== undefined) {
    counter.set(previous)
  }
}

undo()
console.log(counter()) // 2
```

### Tracking changes over time

```ts
const temperature = atom(20, 'temperature').extend(withHistory(5))

effect(() => {
  const [current, ...previous] = temperature.history()
  const all = [current, ...previous]
  const avg = all.reduce((a, b) => a + b, 0) / all.length
  console.log(`Current: ${current}°C, Average: ${avg.toFixed(1)}°C`)
})

temperature.set(22)
temperature.set(19)
temperature.set(23)
```

### Notes

- The history computed must be subscribed to in order to track changes
- History length does not include the current state (e.g., `length=2` keeps current + 2 previous = 3 total)
- Works with any state type (primitives, objects, arrays)
- Due to Reatom's batching, call `history()` between state changes to ensure each intermediate value is captured
