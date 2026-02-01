import type { RegistryItem } from 'jsrepo'

export const reatomInstance = {
  name: 'reatomInstance',
  type: 'reatom:factory',
  files: [
    { path: './reatom-instance.ts' },
    { path: './reatom-instance.md', role: 'doc' },
    { path: './reatom-instance.test.ts', role: 'test' },
    {
      path: './reatom-instance.example.ts',
      role: 'example',
    },
  ],
} satisfies RegistryItem
