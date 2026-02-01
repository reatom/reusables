import type { RegistryItem } from 'jsrepo'

export const withHistory = {
  name: 'withHistory',
  type: 'reatom:extension',
  files: [
    { path: './with-history.ts' },
    { path: './with-history.md', role: 'doc' },
    { path: './with-history.test.ts', role: 'test' },
    { path: './with-history.example.ts', role: 'example' },
  ],
} satisfies RegistryItem
