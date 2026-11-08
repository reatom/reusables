import type { RegistryItem } from 'jsrepo'

export const storyFrame = {
  name: 'storyFrame',
  type: 'reatom:utility',
  files: [
    { path: './story-frame.ts' },
    { path: './story-frame.md', role: 'doc' },
    { path: './story-frame.test.ts', role: 'test' },
    { path: './story-frame.example.tsx', role: 'example' },
  ],
} satisfies RegistryItem
