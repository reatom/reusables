import type { RegistryItem } from 'jsrepo'

export const withFormResetOnSubmit = {
  name: 'withFormResetOnSubmit',
  type: 'reatom:extension',
  files: [
    { path: './with-form-reset-on-submit.ts' },
    { path: './with-form-reset-on-submit.md', role: 'doc' },
    { path: './with-form-reset-on-submit.test.ts', role: 'test' },
    { path: './with-form-reset-on-submit.example.ts', role: 'example' },
  ],
} satisfies RegistryItem
