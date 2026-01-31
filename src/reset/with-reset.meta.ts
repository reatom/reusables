import type { RegistryItem } from 'jsrepo'

export const withReset: RegistryItem = {
  name: 'withReset',
  type: 'reatom:extension',
  files: [
    { path: 'src/reset/with-reset.ts' },
    { path: 'src/reset/with-reset.md', role: 'doc' },
    { path: 'src/reset/with-reset.test.ts', role: 'test' },
    { path: 'src/reset/with-reset.example.ts', role: 'example' },
  ],
}
