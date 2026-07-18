import type { RegistryItem } from 'jsrepo'

export const withDocumentTitle = {
  name: 'withDocumentTitle',
  type: 'reatom:extension',
  files: [
    { path: './with-document-title.ts' },
    { path: './with-document-title.md', role: 'doc' },
    { path: './with-document-title.node.test.ts', role: 'test' },
    { path: './with-document-title.browser.test.ts', role: 'test' },
    { path: './with-document-title.example.ts', role: 'example' },
  ],
} satisfies RegistryItem
