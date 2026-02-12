# withFormUnsavedWarning

Warns the user before leaving the page when the form has unsaved changes, using the browser's `beforeunload` event.

## The problem

When a user edits a form and accidentally closes the tab or navigates away, their unsaved changes are lost with no warning. Managing `beforeunload` listeners manually is error-prone — you need to wire them up in sync with the form lifecycle.

`withFormUnsavedWarning` adds a `beforeunload` listener that checks the form's dirty state and prevents the default browser action when unsaved changes are present.

## `withFormUnsavedWarning(checkUnsaved?)`

Creates a form extension that:

- exposes a `preventNavigation` action that calls `event.preventDefault()` when `checkUnsaved(form)` returns `true`
- registers a `beforeunload` event listener via `onEvent` that triggers `preventNavigation` (automatically cleaned up by reatom's lifecycle)
- SSR-safe: skips the listener when `window` is not available

### Parameters

- `checkUnsaved` (optional): `(form: Form) => boolean` — predicate called on `beforeunload` to decide whether to warn. Defaults to `form => form.focus().dirty`.

### Returns

Extension object with:

- `preventNavigation`: `Action<[BeforeUnloadEvent], void>` — action that prevents navigation when the form has unsaved changes. Can be extended with `withCallHook` to add custom side effects (e.g. SPA router navigation guards).

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

// With custom check:
const profileForm = reatomForm(
  { bio: '' },
  { onSubmit: async (state) => await api.saveProfile(state) },
).extend(withFormUnsavedWarning((form) => form.fields.bio.focus().dirty))
```

### Hooking into navigation prevention

Use `withCallHook` on the exposed `preventNavigation` action to run custom logic (e.g. block SPA router navigation):

```ts
import { reatomForm, withCallHook } from '@reatom/core'
import { withFormUnsavedWarning } from '#reatom/extension/with-form-unsaved-warning'

const form = reatomForm(
  { name: '' },
  { onSubmit: async (state) => await api.save(state) },
).extend(withFormUnsavedWarning())

form.preventNavigation.extend(
  withCallHook(() => {
    // e.g. router.block(() => 'You have unsaved changes')
  }),
)
```
