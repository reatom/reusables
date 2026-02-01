# setupStorybookUrl

Configures `urlAtom` for Storybook: disables History API sync and restores the original iframe URL after every state change. Routing state still works internally — components respond to URL changes, links generate correct paths — but the iframe URL stays fixed so Storybook remains happy.

## `setupStorybookUrl()`

Call once in `.storybook/preview.tsx` before any routing runs.

### Parameters

None.

### Example

```ts
// .storybook/preview.tsx
import { setupStorybookUrl } from '#reatom/utility/setup-storybook-url'

setupStorybookUrl()
```

### How it works

1. Captures the current `window.location.href`
2. Replaces `urlAtom.sync` with `noop` to prevent History API calls
3. Adds a change hook that restores the original URL via `history.replaceState` after every `urlAtom` update

### Reference

Based on the pattern from [Reatom Extensibility Saves the Day](https://dev.to/guria/reatom-extensibility-saves-the-day-595e).
