import type { RegistryItem } from 'jsrepo'

export const withFormUnsavedWarning = {
  name: 'withFormUnsavedWarning',
  type: 'reatom:extension',
  files: [
    { path: './with-form-unsaved-warning.ts' },
    { path: './with-form-unsaved-warning.md', role: 'doc' },
    { path: './with-form-unsaved-warning.test.ts', role: 'test' },
    { path: './with-form-unsaved-warning.example.ts', role: 'example' },
  ],
} satisfies RegistryItem
