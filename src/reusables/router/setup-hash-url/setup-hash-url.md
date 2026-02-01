# setupHashUrl

Switches `urlAtom` to hash-based routing (`#/path` instead of History API paths). All existing routing logic works unchanged — only the browser URL format changes.

## `setupHashUrl()`

Call once at app initialization before any routing runs.

### Parameters

None.

### Example

```ts
import { setupHashUrl } from '#reatom/utility/setup-hash-url'

setupHashUrl()

// Now urlAtom.go('/users/123') writes #/users/123 to the address bar
```

### Exported helpers

#### `hashToUrl()`

Converts the current `window.location.hash` into a URL object.

| Returns | Description                  |
| ------- | ---------------------------- |
| `URL`   | URL parsed from current hash |

#### `pathToHash(path)`

Converts a pathname to a hash-prefixed string.

| Parameter | Type     | Description      |
| --------- | -------- | ---------------- |
| `path`    | `string` | The path to hash |

| Returns  | Description                   |
| -------- | ----------------------------- |
| `string` | Hash-prefixed path (`#/path`) |

### How it works

1. Sets `urlAtom` initial value from `window.location.hash` (disables default History API init)
2. Subscribes to `hashchange` events via `onEvent`, syncing hash changes into `urlAtom`
3. Overrides `urlAtom.sync` to write hash URLs via `history.pushState` / `history.replaceState`

### Reference

Based on the pattern from [Reatom Extensibility Saves the Day](https://dev.to/guria/reatom-extensibility-saves-the-day-595e).
