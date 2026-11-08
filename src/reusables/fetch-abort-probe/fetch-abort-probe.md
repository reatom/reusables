# fetchAbortProbe

Browser-test utility for asserting that Reatom route navigation aborts an in-flight loader fetch. It is useful in Storybook interaction tests and Vitest browser tests when a loader calls a slow endpoint or an MSW handler that deliberately waits.

`fetchAbortProbe` patches `window.fetch`. Always restore it after the test; use `fetchAbortLifecycle` with a test lifecycle hook when possible.

## `createFetchAbortProbe(match, label?)`

Creates a probe that observes fetch requests whose URL matches a substring or predicate.

### Parameters

| Parameter | Type                                 | Default         | Description                                                  |
| --------- | ------------------------------------ | --------------- | ------------------------------------------------------------ |
| `match`   | `string \| (url: string) => boolean` | —               | A URL substring or predicate identifying the loader request. |
| `label`   | `string`                             | `String(match)` | Label used in assertion timeout errors.                      |

### Returns

| Property       | Type                  | Description                                                                               |
| -------------- | --------------------- | ----------------------------------------------------------------------------------------- |
| `install`      | `() => void`          | Patches `window.fetch` and resets the probe. Re-entrant: restores a previous patch first. |
| `restore`      | `() => void`          | Restores the wrapped fetch. Safe to call more than once.                                  |
| `waitForStart` | `() => Promise<void>` | Resolves when a matching request starts.                                                  |
| `waitForAbort` | `() => Promise<void>` | Resolves when the matching request signal aborts.                                         |
| `label`        | `string`              | The label used in assertion errors.                                                       |

### Example

```ts
import { reatomRoute, wrap } from '@reatom/core'
import { afterEach, beforeEach, test } from 'vitest'
import {
  createFetchAbortProbe,
  expectFetchAbortOnNavigation,
} from '#reatom/utility/fetch-abort-probe'

const usersRoute = reatomRoute({
  path: 'users',
  async loader() {
    // MSW can delay this response, or use a slow test endpoint.
    const response = await wrap(fetch('/api/users'))
    return await wrap(response.json())
  },
})
const homeRoute = reatomRoute('')

const probe = createFetchAbortProbe('/api/users', 'users loader')

beforeEach(() => probe.install())
afterEach(() => probe.restore())

test('leaving users aborts its loader', async () => {
  usersRoute.go()

  await expectFetchAbortOnNavigation(probe, async () => homeRoute.go(), {
    assertLoading: async () => {
      // Assert the loader UI is visible before navigating away.
      document.querySelector('[data-testid="users-loading"]')
    },
  })
})
```

## `fetchAbortLifecycle(probe)`

Returns a callback suitable for a cleanup-aware lifecycle hook such as Storybook's `beforeEach`. The callback installs the probe and returns cleanup that restores `window.fetch`. In Vitest, use `beforeEach(() => probe.install())` and `afterEach(() => probe.restore())` instead.

## `expectFetchAbortOnNavigation(probe, navigateAway, options?)`

Waits for the matching request, optionally verifies its loading UI, navigates away, then asserts that the request signal was aborted.

### Parameters

| Parameter               | Type                     | Default | Description                                                            |
| ----------------------- | ------------------------ | ------- | ---------------------------------------------------------------------- |
| `probe`                 | `FetchAbortProbe`        | —       | Probe created by `createFetchAbortProbe`.                              |
| `navigateAway`          | `() => Promise<void>`    | —       | Navigation that leaves the route owning the loader.                    |
| `options.assertLoading` | `() => Promise<unknown>` | —       | Optional assertion run after the request starts and before navigation. |
| `options.timeoutMs`     | `number`                 | `1000`  | Timeout for waiting for the request start and abort.                   |

Timeout errors include the probe label, making a failed route test easier to identify.

### Notes

- This utility requires a browser environment because it patches `window.fetch`.
- It observes the request signal only; it does not mock or delay the network request. Use MSW or a controlled slow endpoint to keep a loader in flight.
- `install()` wraps whichever `window.fetch` implementation is present, so it works with a fetch mock installed before the probe.
- Call `restore()` in cleanup if you do not use `fetchAbortLifecycle`.
