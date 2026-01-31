import type { RegistryItem } from 'jsrepo'

export const withHistory: RegistryItem = {
  name: 'withHistory',
  type: 'reatom:extension',
  files: [
    { path: 'src/reusables/history/with-history.ts' },
    { path: 'src/reusables/history/with-history.md', role: 'doc' },
    { path: 'src/reusables/history/with-history.test.ts', role: 'test' },
    { path: 'src/reusables/history/with-history.example.ts', role: 'example' },
  ],
}
