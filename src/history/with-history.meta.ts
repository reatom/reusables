import type { RegistryItem } from 'jsrepo'

export const withHistory: RegistryItem = {
  name: 'withHistory',
  type: 'reatom:extension',
  files: [
    { path: 'src/history/with-history.ts' },
    { path: 'src/history/with-history.md', role: 'doc' },
    { path: 'src/history/with-history.test.ts', role: 'test' },
    { path: 'src/history/with-history.example.ts', role: 'example' },
  ],
}
