# withResizeObserver

Atom extension that exposes an element's `ResizeObserverEntry` as reactive state.

## `withResizeObserver()`

Adds a `.sizeEntry` computed atom to an `Atom<HTMLElement | null>`. The computed returns the latest `ResizeObserverEntry` for the current element, or `undefined` before the first observation and when the target atom is `null`.

The underlying `ResizeObserver` is lazy: it is created only while `.sizeEntry` is connected. When the element changes, becomes `null`, or the computed disconnects, the previous observer is disconnected automatically.

### Parameters

| Parameter | Type | Default | Description |
| --------- | ---- | ------- | ----------- |
| —         | —    | —       | No options  |

### Returns

Extension that adds:

| Property    | Type                                         | Description                                     |
| ----------- | -------------------------------------------- | ----------------------------------------------- |
| `sizeEntry` | `Computed<ResizeObserverEntry \| undefined>` | Latest entry for the currently observed element |

### Example

```tsx
import { atom, wrap } from '@reatom/core'
import { reatomComponent } from '@reatom/react'
import { withResizeObserver } from '#reatom/extension/with-resize-observer'

const panelElement = atom<HTMLElement | null>(null, 'panelElement').extend(
  withResizeObserver(),
)

export const PanelSize = reatomComponent(() => {
  const entry = panelElement.sizeEntry()
  const rect = entry?.contentRect

  return (
    <section ref={wrap((node) => panelElement.set(node))}>
      {rect
        ? `${Math.round(rect.width)}×${Math.round(rect.height)}`
        : 'Measuring…'}
    </section>
  )
}, 'PanelSize')
```

### Notes

- `sizeEntry` must be read by a connected computation or subscribed to in order to create the observer
- The observer callback filters entries to the currently observed node
- Switching the target element disconnects the previous observer and observes the new element
