// .storybook/preview.tsx
import { setupStorybookUrl } from './setup-storybook-url'

// Call once at Storybook preview setup.
// Routing state works internally — components respond to URL changes,
// links generate correct paths — but the iframe URL stays fixed.
setupStorybookUrl()
