import type { RegistryItem } from 'jsrepo'

export const withFormAutoFocusOnError = {
  name: 'withFormAutoFocusOnError',
  type: 'reatom:extension',
  files: [
    { path: './with-form-auto-focus-on-error.ts' },
    { path: './with-form-auto-focus-on-error.md', role: 'doc' },
    { path: './with-form-auto-focus-on-error.test.ts', role: 'test' },
    { path: './with-form-auto-focus-on-error.example.ts', role: 'example' },
  ],
} satisfies RegistryItem
