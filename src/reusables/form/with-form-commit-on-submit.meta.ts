import type { RegistryItem } from 'jsrepo'

export const withFormCommitOnSubmit = {
  name: 'withFormCommitOnSubmit',
  type: 'reatom:extension',
  files: [
    { path: './with-form-commit-on-submit.ts' },
    { path: './with-form-commit-on-submit.md', role: 'doc' },
    { path: './with-form-commit-on-submit.test.ts', role: 'test' },
    { path: './with-form-commit-on-submit.example.ts', role: 'example' },
  ],
} satisfies RegistryItem
