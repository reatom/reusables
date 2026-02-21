# setupStorybookUrl

Configures `urlAtom` for Storybook: disables History API sync and restores the original iframe URL after every state change. Routing state still works internally — components respond to URL changes, links generate correct paths — but the iframe URL stays fixed so Storybook remains happy.

Returns a context frame suitable for passing to `reatomContext.Provider`, isolating each story's routing state.

## `setupStorybookUrl(initialPath?)`

Call in a Storybook decorator to set up routing per story.

### Parameters

| Parameter     | Type     | Default | Description                              |
| ------------- | -------- | ------- | ---------------------------------------- |
| `initialPath` | `string` | `''`    | Optional path to navigate to after setup |

### Returns

A context frame (`Frame`) to provide to React context.

### Example

```tsx
// .storybook/preview.tsx
import { reatomContext } from '@reatom/react'
import { useMemo, type PropsWithChildren } from 'react'
import { setupStorybookUrl } from '#reatom/utility/setup-storybook-url'

function ReatomDecorator({
  children,
  initialPath = '',
}: PropsWithChildren<{ initialPath?: string }>) {
  const frame = useMemo(() => setupStorybookUrl(initialPath), [])
  return (
    <reatomContext.Provider value={frame}>{children}</reatomContext.Provider>
  )
}

// Use in decorators:
// (Story, { parameters }) => (
//   <ReatomDecorator initialPath={parameters['initialPath']}>
//     <Story />
//   </ReatomDecorator>
// )
```

### How it works

1. Captures the current `window.location.href` (module-level)
2. Creates an isolated context frame via `context.start()`
3. Inside the frame:
   - Replaces `urlAtom.sync` with `noop` to prevent History API calls
   - Adds a change hook that restores the original URL via `history.replaceState` after every `urlAtom` update
   - Navigates to `BASE_URL + initialPath` via `urlAtom.go()`
4. Returns the frame for use with `reatomContext.Provider`

### Reference

Based on the pattern from [Reatom Extensibility Saves the Day](https://dev.to/guria/reatom-extensibility-saves-the-day-595e) and real usage in [modern-stack](https://github.com/Guria/modern-stack).
