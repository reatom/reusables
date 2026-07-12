# storyFrame

Holds the active Storybook Reatom frame so a `beforeEach` hook and a render decorator — which run in different scopes — can share the same frame.

## Why a module-level holder?

Storybook creates each story's Reatom frame inside `beforeEach` (or a loader), but the decorator that wraps the rendered story runs in a separate scope and can't receive that frame as an argument. `storyFrame` bridges the gap: the hook stores the frame via `setActiveStoryFrame`, and the decorator reads it via `getActiveStoryFrame` to feed `reatomContext.Provider`.

Because the holder is module-level, you **must** reset it to `null` in your cleanup — otherwise a previous story's frame leaks into the next one.

## `setActiveStoryFrame(frame)`

Stores (or clears) the active frame.

### Parameters

| Parameter | Type                | Default | Description                                                            |
| --------- | ------------------- | ------- | ---------------------------------------------------------------------- |
| `frame`   | `RootFrame \| null` | —       | The frame to make active, or `null` to clear it (call this on cleanup) |

### Returns

`void`

## `getActiveStoryFrame()`

Returns the frame stored by `setActiveStoryFrame`. Meant to be called inside a Storybook decorator.

### Returns

| Returns     | Type        | Description                                             |
| ----------- | ----------- | ------------------------------------------------------- |
| `RootFrame` | `RootFrame` | The active frame, for use with `reatomContext.Provider` |

**Throws** a `ReatomError` when no frame has been set.

## Example

```tsx
// .storybook/preview.tsx
import { atom, context, mock } from '@reatom/core'
import { reatomContext } from '@reatom/react'
import { definePreview } from '@storybook/react-vite'
import { type PropsWithChildren } from 'react'
import {
  getActiveStoryFrame,
  setActiveStoryFrame,
} from '#reatom/utility/story-frame'

// A stand-in for an app atom you want to fake per story. Because each story
// gets its own frame in `beforeEach`, a `mock()` override never leaks.
const featureEnabledAtom = atom(true, 'featureEnabledAtom')

// The decorator renders in a different scope than `beforeEach`, so it reads
// the frame the hook stored via the module-level holder.
function StoryFrameProvider({ children }: PropsWithChildren) {
  return (
    <reatomContext.Provider value={getActiveStoryFrame()}>
      {children}
    </reatomContext.Provider>
  )
}

const preview = definePreview({
  decorators: [
    (Story) => (
      <StoryFrameProvider>
        <Story />
      </StoryFrameProvider>
    ),
  ],
  beforeEach: () => {
    const frame = context.start()
    setActiveStoryFrame(frame)

    // Per-story mock: it lives only inside this frame and is cleaned up with it.
    frame.run(() => {
      mock(featureEnabledAtom, () => false)
    })

    // Reset the holder so the next story starts from a clean slate.
    return () => setActiveStoryFrame(null)
  },
})

export default preview
```

### How it works

1. `beforeEach` creates a fresh frame with `context.start()` and stores it via `setActiveStoryFrame`.
2. Per-story overrides (e.g. `mock(...)`) are installed inside `frame.run(...)` so they are scoped to that frame and never leak across stories.
3. The decorator calls `getActiveStoryFrame()` and passes the frame to `reatomContext.Provider`, so the rendered story reads and writes state in the same frame the hook set up.
4. The cleanup returned from `beforeEach` calls `setActiveStoryFrame(null)`, clearing the holder for the next story.

### When to prefer `setupStorybookUrl` instead

Use [`setupStorybookUrl`](#reatom/utility/setup-storybook-url) when your story only needs routing wired up — it creates the frame **inside** the decorator and returns it directly, so no module-level holder is required. Use `storyFrame` when frame creation needs to happen in `beforeEach` (for example to install per-story `mock()` overrides before the story mounts), forcing the frame to cross the hook/decorator scope boundary.

### Reference

Based on the per-story frame holder pattern used in [my-replicad-app](https://github.com/tolik-ux/my-replicad-app).
