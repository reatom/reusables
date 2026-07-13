# withDocumentTitle

Atom extension that mirrors a string atom's value into `document.title`.

## `withDocumentTitle()`

Applies to any `AtomLike<string>` (typically a `computed` that derives the
title). While the atom is connected, its current value is written to
`document.title`.

### Parameters

None.

### Returns

Extension that adds no new properties — it only wires the connect-gated side
effect onto the target atom.

### Behavior

- **Connect-gated.** The sync activates on the first subscriber: it sets
  `document.title` immediately, then keeps it in sync on every change. With no
  subscriber, `document.title` is never touched.
- **Stops on disconnect.** When the last subscriber leaves, the change hook is
  removed and the title stops updating. The last written title is left as-is
  (see Notes on possible future options).
- **SSR-safe.** When `typeof document === 'undefined'` the extension no-ops, so
  subscribing and updating never throw on the server.

### Example

```ts
import { atom, computed } from '@reatom/core'
import { withDocumentTitle } from '#reatom/extension/with-document-title'

const pageLabel = atom('Home', 'pageLabel')

const title = computed(() => `${pageLabel()} | My App`, 'title').extend(
  withDocumentTitle(),
)

// The sync is active only while `title` has subscribers.
const unsub = title.subscribe(() => {})
// document.title === 'Home | My App'

pageLabel.set('Settings')
// document.title === 'Settings | My App'

unsub()
// Further changes no longer touch document.title.
```

### Notes

- `v1` intentionally takes no options. A future version could add opt-in
  behaviors such as restoring the previous `document.title` on disconnect.
