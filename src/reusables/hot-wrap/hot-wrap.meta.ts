import type { RegistryItem } from 'jsrepo'

export const hotWrap = {
  name: 'hotWrap',
  type: 'reatom:utility',
  files: [
    { path: './hot-wrap.ts' },
    { path: './hot-wrap.md', role: 'doc' },
    { path: './hot-wrap.test.ts', role: 'test' },
    { path: './hot-wrap.example.tsx', role: 'example' },
  ],
} satisfies RegistryItem
