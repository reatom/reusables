# withFormSubmitHandler

Adds a `handleSubmit` action to a form for event-driven submission with an optional dirty-guard.

## The problem

Submitting a Reatom form from a UI event handler requires boilerplate: calling `event.preventDefault()`, optionally checking the dirty state, and then calling `form.submit()`. This boilerplate is repeated in every form component and is easy to get wrong (e.g. forgetting `preventDefault` or the dirty check).

`withFormSubmitHandler` encapsulates this pattern into a single `handleSubmit` action that works with any framework event (DOM, React, Svelte, etc.).

## `withFormSubmitHandler(config?)`

Creates a form extension that adds a `handleSubmit` action.

The action:

- calls `event.preventDefault()` if an event is passed
- when `requireDirty` is set and the form is not dirty, skips submission (silently or with an error)
- calls `form.submit()` fire-and-forget (use `form.submit.onFulfill` / `form.submit.onReject` for async tracking)

### Parameters

| Parameter      | Type             | Description                                                                        |
| -------------- | ---------------- | ---------------------------------------------------------------------------------- |
| `requireDirty` | `true \| string` | `true` — silently skip when not dirty; `string` — skip and set `form.submit.error` |

### Returns

Form extension that adds `handleSubmit: Action<[event?: { preventDefault(): void }], void>` to the form.

### Example

```ts
import { reatomForm } from '@reatom/core'
import { withFormSubmitHandler } from '#reatom/extension/with-form-submit-handler'

const form = reatomForm(
  { name: '', email: '' },
  {
    onSubmit: async (state) => {
      await api.save(state)
    },
  },
).extend(withFormSubmitHandler({ requireDirty: true }))
```

### Framework integration

**React**

```tsx
<form onSubmit={form.handleSubmit}>{/* fields */}</form>
```

**Svelte**

```svelte
<form on:submit={form.handleSubmit}>
  <!-- fields -->
</form>
```

**Vanilla DOM**

```ts
document.querySelector('form')!.addEventListener('submit', form.handleSubmit)
```

See also ["Reatom extensibility saves the day"](https://dev.to/guria/reatom-extensibility-saves-the-day-595e) for more on the extension pattern.
