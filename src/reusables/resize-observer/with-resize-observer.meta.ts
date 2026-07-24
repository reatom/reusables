import type { RegistryItem } from 'jsrepo'

export const withResizeObserver = {
  name: 'withResizeObserver',
  type: 'reatom:extension',
  files: [
    { path: './with-resize-observer.ts' },
    { path: './with-resize-observer.md', role: 'doc' },
    { path: './with-resize-observer.browser.test.ts', role: 'test' },
    { path: './with-resize-observer.example.ts', role: 'example' },
  ],
} satisfies RegistryItem
