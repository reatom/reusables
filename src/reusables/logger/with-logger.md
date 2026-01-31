# withLogger

Atom/action extension that logs all state changes and action calls.

## `withLogger(logger?)`

Adds logging middleware that intercepts all updates and calls the provided logger function.

### Parameters

| Parameter | Type       | Description                               |
| --------- | ---------- | ----------------------------------------- |
| `logger`  | `LoggerFn` | Logger function (defaults to console.log) |

### LogEntry

The logger function receives a `LogEntry` object:

| Property    | Type        | Description                               |
| ----------- | ----------- | ----------------------------------------- |
| `name`      | `string`    | Name of the atom or action                |
| `params`    | `unknown[]` | Parameters passed to the action or setter |
| `result`    | `unknown`   | Result value (new state or return value)  |
| `timestamp` | `number`    | Timestamp of the log entry                |

### Example

```ts
import { atom } from '@reatom/core'
import { withLogger } from '#reatom/extension/with-logger'

const counter = atom(0, 'counter').extend(withLogger())

counter.set(5) // Logs: [counter] [5] -> 5
counter.set(10) // Logs: [counter] [10] -> 10
```

### Custom logger example

```ts
import { withLogger, type LogEntry } from '#reatom/extension/with-logger'

const logs: LogEntry[] = []

const counter = atom(0, 'counter').extend(
  withLogger((entry) => {
    logs.push(entry)
    console.log(`${entry.name} changed to ${entry.result}`)
  }),
)

counter.set(42) // Logs: "counter changed to 42"
```

### Action logging

```ts
import { action } from '@reatom/core'
import { withLogger } from '#reatom/extension/with-logger'

const greet = action((name: string) => `Hello, ${name}!`, 'greet').extend(
  withLogger(),
)

greet('World') // Logs: [greet] ["World"] -> "Hello, World!"
```

### Analytics integration

```ts
const analyticsLogger = (entry: LogEntry) => {
  analytics.track('state_change', {
    action: entry.name,
    params: entry.params,
    result: entry.result,
    timestamp: entry.timestamp,
  })
}

const settings = atom({ theme: 'light' }, 'settings').extend(
  withLogger(analyticsLogger),
)
```

### Composing with other extensions

```ts
import { withReset } from '#reatom/extension/with-reset'
import { withLogger } from '#reatom/extension/with-logger'

const form = atom({ name: '', email: '' }, 'form')
  .extend(withReset({ name: '', email: '' }))
  .extend(withLogger())

form.set({ name: 'John', email: 'john@example.com' }) // Logged
form.reset() // Also logged
```
