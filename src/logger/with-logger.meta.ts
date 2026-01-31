import type { RegistryItem } from 'jsrepo'

export const withLogger: RegistryItem = {
  name: 'withLogger',
  type: 'reatom:extension',
  files: [
    { path: 'src/logger/with-logger.ts' },
    { path: 'src/logger/with-logger.md', role: 'doc' },
    { path: 'src/logger/with-logger.test.ts', role: 'test' },
    { path: 'src/logger/with-logger.example.ts', role: 'example' },
  ],
}
