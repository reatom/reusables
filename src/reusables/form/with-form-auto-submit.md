# withFormAutoSubmit

Auto-submits a Reatom form after the user stops changing fields for a short time.

## `withFormAutoSubmit(options?)`

Creates a form extension that:

- watches form state and `form.focus().dirty`
- waits `debounceMs`
- calls `form.submit()`
- re-initializes the form with the latest values via `form.init()`

If the form changes again before the debounce delay, the previous submit is
aborted and only the latest change is submitted.

### Parameters

| Parameter    | Type     | Description                           |
| ------------ | -------- | ------------------------------------- |
| `debounceMs` | `number` | Debounce delay in ms (default: `300`) |

### Returns

Form extension that can be used with `.extend()` and returns the original form.

### Example

```ts
import { reatomForm } from '@reatom/core'
import { withFormAutoSubmit } from '#reatom/extension/with-form-auto-submit'

const profileForm = reatomForm(
  { name: '', email: '' },
  {
    onSubmit: async (state) => {
      await api.saveProfile(state)
    },
  },
).extend(withFormAutoSubmit({ debounceMs: 500 }))
```
