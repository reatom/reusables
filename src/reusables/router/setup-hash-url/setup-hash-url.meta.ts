import type { RegistryItem } from 'jsrepo'

export const setupHashUrl = {
  name: 'setupHashUrl',
  type: 'reatom:utility',
  files: [
    { path: './setup-hash-url.ts' },
    { path: './setup-hash-url.md', role: 'doc' },
    { path: './setup-hash-url.browser.test.ts', role: 'test' },
    { path: './setup-hash-url.example.ts', role: 'example' },
  ],
} satisfies RegistryItem
