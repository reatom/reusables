# withFormAutoFocusOnError

Focuses the first field with a validation error after a failed submit.

## `withFormAutoFocusOnError()`

Creates a form extension that:

- listens to `form.submit.onReject`
- finds the first field with `field.validation().error`
- calls `field.elementRef()?.focus()`

### Returns

Form extension that can be used with `.extend()` and returns the original form.

### Example

```ts
import { reatomForm } from '@reatom/core'
import { withFormAutoFocusOnError } from '#reatom/extension/with-form-auto-focus-on-error'

const form = reatomForm(
  {
    name: {
      initState: '',
      validate: ({ value }) => (!value ? 'Required' : ''),
    },
    email: {
      initState: '',
      validate: ({ value }) => (!value ? 'Required' : ''),
    },
  },
  {
    onSubmit: async (state) => {
      await api.save(state)
    },
  },
).extend(withFormAutoFocusOnError())

// Connect refs (example with DOM elements)
form.fields.name.elementRef.set({ focus: () => nameInput.focus() })
form.fields.email.elementRef.set({ focus: () => emailInput.focus() })
```
