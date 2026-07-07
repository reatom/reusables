// .storybook/preview.tsx
import { atom } from '@reatom/core'
import { reatomContext } from '@reatom/react'
import { useMemo, type PropsWithChildren } from 'react'

import { setupStorybookUrl } from './setup-storybook-url'

// Stand-in for your app's session state read by protected-route loaders.
const authSessionAtom = atom<{ userId: string } | null>(null, 'authSessionAtom')
const mockSession = { userId: 'storybook' }

// Use in a Storybook decorator to provide a context frame per story.
// Routing state works internally — components respond to URL changes,
// links generate correct paths — but the iframe URL stays fixed.
function ReatomDecorator({
  children,
  initialPath = '',
  authenticated = true,
}: PropsWithChildren<{ authenticated?: boolean; initialPath?: string }>) {
  const frame = useMemo(
    () =>
      setupStorybookUrl(initialPath, () => {
        // Runs inside the frame before navigation, so route matching and
        // loader evaluation happen only once with the correct auth state.
        authSessionAtom.set(authenticated ? mockSession : null)
      }),
    [authenticated, initialPath],
  )
  return (
    <reatomContext.Provider value={frame}>{children}</reatomContext.Provider>
  )
}
