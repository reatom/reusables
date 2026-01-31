# withReset

Atom extension that adds a `.reset()` action to restore the atom to its initial value.

## `withReset(initialValue)`

Adds a `reset` action that sets the atom back to the provided initial value.

### Parameters

| Parameter      | Type    | Description           |
| -------------- | ------- | --------------------- |
| `initialValue` | `State` | The value to reset to |

### Returns

Extension that adds:

| Property | Type                | Description                         |
| -------- | ------------------- | ----------------------------------- |
| `reset`  | `Action<[], State>` | Action that resets to initial value |

### Example

```ts
import { atom } from '@reatom/core'
import { withReset } from '#reatom/extension/with-reset'

const counter = atom(0, 'counter').extend(withReset(0))

counter.set(10)
console.log(counter()) // 10

counter.reset()
console.log(counter()) // 0
```

### Form state example

```ts
interface FormState {
  username: string
  email: string
}

const initialState: FormState = { username: '', email: '' }

const formState = atom(initialState, 'formState').extend(
  withReset(initialState),
)

// User fills out form
formState.set({ username: 'john', email: 'john@example.com' })

// Clear form after submission
formState.reset()
```

### Composing with other extensions

```ts
import { withReset } from '#reatom/extension/with-reset'
import { withLocalStorage } from '@reatom/core'

const settings = atom({ theme: 'light' }, 'settings')
  .extend(withReset({ theme: 'light' }))
  .extend(withLocalStorage('settings'))

// Reset clears to initial value (also updates localStorage)
settings.reset()
```
