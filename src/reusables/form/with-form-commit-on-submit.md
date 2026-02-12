# withFormCommitOnSubmit

Commits the submitted values as the new baseline after a successful submit, so the form becomes clean while keeping the new values.

## The problem

By default, `reatomForm` tracks dirty state by comparing the current field values against the _original_ initial values. After a successful submit the form still considers those original values as the baseline. This means `form.focus().dirty` stays `true` even though the data was just saved, and any UI that relies on the dirty flag (save buttons, unsaved-changes warnings, collapsed summaries) shows a stale state.

`withFormCommitOnSubmit` fixes this by calling `form.reset(currentState)` right after `onFulfill`, making the just-submitted values the new baseline so that `dirty` becomes `false` immediately.

See also ["Reatom extensibility saves the day"](https://dev.to/guria/reatom-extensibility-saves-the-day-595e) for a detailed walkthrough of the motivation behind this extension.

## `withFormCommitOnSubmit()`

Creates a form extension that:

- listens to `form.submit.onFulfill`
- reads the current form state via `form()`
- calls `form.reset(formState)` to update the baseline

### Returns

Form extension that can be used with `.extend()` and returns the original form.

### Example

```ts
import { reatomForm } from '@reatom/core'
import { withFormCommitOnSubmit } from '#reatom/extension/with-form-commit-on-submit'

const settingsForm = reatomForm(
  { name: '', email: '' },
  {
    onSubmit: async (state) => {
      await api.saveSettings(state)
    },
  },
).extend(withFormCommitOnSubmit())

// After submit succeeds, form.focus().dirty === false
// and form() still holds the submitted values.
```
