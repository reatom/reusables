import type { RegistryItem } from 'jsrepo'

export const setupStorybookUrl = {
  name: 'setupStorybookUrl',
  type: 'reatom:utility',
  files: [
    { path: './setup-storybook-url.ts' },
    { path: './setup-storybook-url.md', role: 'doc' },
    { path: './setup-storybook-url.browser.test.ts', role: 'test' },
    { path: './setup-storybook-url.example.tsx', role: 'example' },
  ],
} satisfies RegistryItem
