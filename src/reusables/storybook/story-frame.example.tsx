// .storybook/preview.tsx
import { atom, context, mock } from '@reatom/core'
import { reatomContext } from '@reatom/react'
import { definePreview } from '@storybook/react-vite'
import { type PropsWithChildren } from 'react'

import { getActiveStoryFrame, setActiveStoryFrame } from './story-frame'

// A stand-in for an app atom you want to fake per story. Because each story
// gets its own frame in `beforeEach`, a `mock()` override never leaks across
// stories — the next story starts from a fresh frame.
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
