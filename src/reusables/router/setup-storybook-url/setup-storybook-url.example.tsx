// .storybook/preview.tsx
import { reatomContext } from '@reatom/react'
import { useMemo, type PropsWithChildren } from 'react'

import { setupStorybookUrl } from './setup-storybook-url'

// Use in a Storybook decorator to provide a context frame per story.
// Routing state works internally — components respond to URL changes,
// links generate correct paths — but the iframe URL stays fixed.
function ReatomDecorator({
  children,
  initialPath = '',
}: PropsWithChildren<{ initialPath?: string }>) {
  const frame = useMemo(() => setupStorybookUrl(initialPath), [])
  return (
    <reatomContext.Provider value={frame}>{children}</reatomContext.Provider>
  )
}
