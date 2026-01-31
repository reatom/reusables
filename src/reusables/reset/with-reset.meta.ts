import type { RegistryItem } from 'jsrepo'

export const withReset: RegistryItem = {
  name: 'withReset',
  type: 'reatom:extension',
  files: [
    { path: 'src/reusables/reset/with-reset.ts' },
    { path: 'src/reusables/reset/with-reset.md', role: 'doc' },
    { path: 'src/reusables/reset/with-reset.test.ts', role: 'test' },
    { path: 'src/reusables/reset/with-reset.example.ts', role: 'example' },
  ],
}
