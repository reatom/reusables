import type { RegistryItem } from 'jsrepo'

export const withFormAutoSubmit = {
  name: 'withFormAutoSubmit',
  type: 'reatom:extension',
  files: [
    { path: './with-form-auto-submit.ts' },
    { path: './with-form-auto-submit.md', role: 'doc' },
    { path: './with-form-auto-submit.test.ts', role: 'test' },
    { path: './with-form-auto-submit.example.ts', role: 'example' },
  ],
} satisfies RegistryItem
