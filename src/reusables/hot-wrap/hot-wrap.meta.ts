import type { RegistryItem } from 'jsrepo'

export const hotWrap: RegistryItem = {
  name: 'hotWrap',
  type: 'reatom:utility',
  files: [
    { path: 'src/reusables/hot-wrap/hot-wrap.ts' },
    { path: 'src/reusables/hot-wrap/hot-wrap.md', role: 'doc' },
    { path: 'src/reusables/hot-wrap/hot-wrap.test.ts', role: 'test' },
    { path: 'src/reusables/hot-wrap/hot-wrap.example.tsx', role: 'example' },
  ],
}
