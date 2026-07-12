# abortErrorGuard

Collects `AbortError`s emitted by Reatom async actions' `.onReject` lifecycle
handlers. Use it in Storybook or Vitest setup to fail a test when an unexpected
abort reaches a public rejection handler.

## `installAbortErrorGuard()`

Registers the process-wide collector once and returns its helpers. Calling it
again is safe and does not register another collector.

### Parameters

| Parameter | Type | Description |
| --------- | ---- | ----------- |
| —         | —    | —           |

### Returns

| Property | Type                                    | Description                                     |
| -------- | --------------------------------------- | ----------------------------------------------- |
| `clear`  | `() => void`                            | Removes collected errors without returning them |
| `drain`  | `() => DrainAbortError[]`               | Returns grouped errors and clears the buffer    |
| `format` | `(errors: DrainAbortError[]) => string` | Formats errors for a failure message            |

`DrainAbortError` has the shape:

| Property     | Type     | Description                                    |
| ------------ | -------- | ---------------------------------------------- |
| `actionName` | `string` | Name of the `.onReject` action                 |
| `message`    | `string` | AbortError message                             |
| `count`      | `number` | Number of matching errors since the last reset |

### Example

```ts
import { beforeEach } from 'vitest'
import { installAbortErrorGuard } from '#reatom/utility/abort-error-guard'

const abortErrors = installAbortErrorGuard()

beforeEach(() => {
  abortErrors.clear()

  return () => {
    const errors = abortErrors.drain()
    if (errors.length > 0) {
      throw new Error(
        `Reatom AbortErrors detected during test:\n${abortErrors.format(errors)}`,
      )
    }
  }
})
```

### Filtering a specific action

Use `drain()` to write focused regression assertions without keeping a
project-specific helper in the reusable:

```ts
const errors = abortErrors.drain()
const loaderAborts = errors.filter(
  ({ actionName }) =>
    actionName.includes('users') && actionName.endsWith('.loader.onReject'),
)

if (loaderAborts.length > 0) {
  throw new Error(
    `Route loader surfaced AbortErrors:\n${abortErrors.format(loaderAborts)}`,
  )
}
```

### Notes

- `addGlobalExtension` cannot be uninstalled. After installation, the guard
  applies to all subsequently created actions in the process (and existing
  actions when it is installed).
- `clear()` and `drain()` reset only the collected error buffer; they do not
  disable the guard.
- Only payloads whose `error` is recognized by Reatom's `isAbort` are
  collected. Other rejections are ignored.
