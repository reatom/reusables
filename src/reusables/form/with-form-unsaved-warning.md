# withFormUnsavedWarning

Warns the user before leaving the page when the form has unsaved changes. Optionally accepts a callback for SPA router integration.

## The problem

When a user edits a form and accidentally closes the tab or navigates away, their unsaved changes are lost with no warning. Managing `beforeunload` listeners manually is error-prone — you need to add and remove them in sync with the form's dirty state.

`withFormUnsavedWarning` reactively watches the form's dirty state and manages the `beforeunload` listener automatically.

## `withFormUnsavedWarning(cb?)`

Creates a form extension that:

- watches `form.focus().dirty` via a reactive effect
- adds a `beforeunload` event listener when the form becomes dirty (via `onEvent`, automatically cleaned up by reatom's abort context when the effect re-runs)
- calls the optional `cb` callback on every dirty state change
- SSR-safe: skips the `beforeunload` listener when `window` is not available

### Parameters

- `cb` (optional): `(dirty: boolean) => void` — called whenever the dirty state changes, useful for integrating with SPA router navigation guards

### Returns

Form extension that can be used with `.extend()` and returns the original form.

### Example

```ts
import { reatomForm } from '@reatom/core'
import { withFormUnsavedWarning } from '#reatom/extension/with-form-unsaved-warning'

const settingsForm = reatomForm(
  { name: '', email: '' },
  {
    onSubmit: async (state) => {
      await api.saveSettings(state)
    },
  },
).extend(withFormUnsavedWarning())

// With SPA router callback:
const profileForm = reatomForm(
  { bio: '' },
  { onSubmit: async (state) => await api.saveProfile(state) },
).extend(
  withFormUnsavedWarning((dirty) => {
    if (dirty) {
      // e.g. router.block(() => 'You have unsaved changes')
    }
  }),
)
```
