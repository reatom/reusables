import type { RegistryItem } from 'jsrepo'

export const withInstance = {
  name: 'withInstance',
  type: 'reatom:extension',
  files: [
    { path: './with-instance.ts' },
    { path: './with-instance.md', role: 'doc' },
    { path: './with-instance.test.ts', role: 'test' },
    {
      path: './with-instance.example.ts',
      role: 'example',
    },
  ],
} satisfies RegistryItem
