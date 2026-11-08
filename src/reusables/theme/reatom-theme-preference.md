# reatomThemePreference

Persisted three-state theme preference (`'system' | 'light' | 'dark'`) with a derived `resolved` computed that collapses `'system'` to a concrete theme via the `(prefers-color-scheme: dark)` media query.

## `reatomThemePreference(options?)`

Creates an enum atom persisted to `localStorage` and extended with a `resolved` computed. The **preference** is what the user picks — including an automatic `'system'` option that follows the OS setting. The **resolved** value is the concrete `'light' | 'dark'` theme you should actually apply to the UI: an explicit preference passes straight through, while `'system'` is mapped through the `prefers-color-scheme` media query.

### Parameters

| Parameter      | Type     | Default             | Description                                        |
| -------------- | -------- | ------------------- | -------------------------------------------------- |
| `options.key`  | `string` | `'theme'`           | localStorage key the preference is persisted under |
| `options.name` | `string` | `'themePreference'` | Debug name for the underlying enum atom            |

### Returns

A persisted enum atom of `ThemePreference` (`'system' | 'light' | 'dark'`) extended with:

| Property   | Type                          | Description                                                                             |
| ---------- | ----------------------------- | --------------------------------------------------------------------------------------- |
| `resolved` | `Computed<'light' \| 'dark'>` | The concrete theme to apply — explicit preference as-is, `'system'` via the media query |

### Example

```ts
import { effect } from '@reatom/core'
import { reatomThemePreference } from '#reatom/factory/reatom-theme-preference'

const theme = reatomThemePreference()

theme.set('dark')
console.log(theme()) // 'dark'
console.log(theme.resolved()) // 'dark'

theme.set('system')
// theme.resolved() follows the OS `prefers-color-scheme` setting
```

### Applying the resolved theme to the DOM

`resolved()` is a computed — apply it to `document.documentElement` from an effect or a framework hook so the DOM updates whenever the preference or the OS setting changes:

```ts
import { effect } from '@reatom/core'
import { reatomThemePreference } from '#reatom/factory/reatom-theme-preference'

const theme = reatomThemePreference()

effect(() => {
  const resolved = theme.resolved()
  document.documentElement.classList.toggle('dark', resolved === 'dark')
  document.documentElement.style.colorScheme = resolved
})
```

### Using a custom storage key and name

```ts
const theme = reatomThemePreference({ key: 'app-theme', name: 'appTheme' })

theme.set('light')
// persisted to localStorage under the 'app-theme' key
```

### Notes

- An invalid persisted value (e.g. a manually edited localStorage entry) coerces back to `'system'` via the snapshot guard — it never throws or applies a broken theme.
- `'system'` follows the OS automatically because `resolved` reads the `(prefers-color-scheme: dark)` media query reactively; subscribe to `resolved` (directly or via an effect) so the media-query atom stays connected and the UI updates when the OS theme changes.
- `resolved()` always returns a concrete `'light' | 'dark'` — there is no `'system'` to handle on the rendering side.

## See also

- [`reatomEnum`](https://www.reatom.dev), [`withLocalStorage`](https://www.reatom.dev), [`reatomMediaQuery`](https://www.reatom.dev) — core primitives this factory builds on
