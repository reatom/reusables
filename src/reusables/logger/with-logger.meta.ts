import type { RegistryItem } from 'jsrepo'

export const withLogger = {
  name: 'withLogger',
  type: 'reatom:extension',
  files: [
    { path: './with-logger.ts' },
    { path: './with-logger.md', role: 'doc' },
    { path: './with-logger.test.ts', role: 'test' },
    { path: './with-logger.example.ts', role: 'example' },
  ],
} satisfies RegistryItem
