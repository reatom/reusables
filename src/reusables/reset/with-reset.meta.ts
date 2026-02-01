import type { RegistryItem } from 'jsrepo'

export const withReset = {
  name: 'withReset',
  type: 'reatom:extension',
  files: [
    { path: './with-reset.ts' },
    { path: './with-reset.md', role: 'doc' },
    { path: './with-reset.test.ts', role: 'test' },
    { path: './with-reset.example.ts', role: 'example' },
  ],
} satisfies RegistryItem
