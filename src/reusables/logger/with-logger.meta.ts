import type { RegistryItem } from 'jsrepo'

export const withLogger: RegistryItem = {
  name: 'withLogger',
  type: 'reatom:extension',
  files: [
    { path: 'src/reusables/logger/with-logger.ts' },
    { path: 'src/reusables/logger/with-logger.md', role: 'doc' },
    { path: 'src/reusables/logger/with-logger.test.ts', role: 'test' },
    { path: 'src/reusables/logger/with-logger.example.ts', role: 'example' },
  ],
}
