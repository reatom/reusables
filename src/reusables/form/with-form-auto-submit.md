# withFormAutoSubmit

Auto-submits a Reatom form after the user stops changing fields for a short time.

## `withFormAutoSubmit(options?)`

Creates a form extension that returns a `waitAutoSubmit` action. Call it in
`reatomFactoryComponent` or a route loader — it loops forever, watching for
form changes with `take`, debouncing, and submitting.

### Parameters

| Parameter    | Type     | Description                           |
| ------------ | -------- | ------------------------------------- |
| `debounceMs` | `number` | Debounce delay in ms (default: `300`) |

### Returns

Extension object with:

- `waitAutoSubmit`: `Action<[], Promise<void>>` — starts the auto-submit loop. Call in `reatomFactoryComponent` or a route loader.

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

// in reatomFactoryComponent or route loader:
profileForm.waitAutoSubmit()
```
