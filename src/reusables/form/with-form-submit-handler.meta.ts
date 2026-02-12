import type { RegistryItem } from 'jsrepo'

export const withFormSubmitHandler = {
  name: 'withFormSubmitHandler',
  type: 'reatom:extension',
  files: [
    { path: './with-form-submit-handler.ts' },
    { path: './with-form-submit-handler.md', role: 'doc' },
    { path: './with-form-submit-handler.test.ts', role: 'test' },
    { path: './with-form-submit-handler.example.ts', role: 'example' },
  ],
} satisfies RegistryItem
