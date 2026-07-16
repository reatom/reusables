import type { RegistryItem } from 'jsrepo'

export const abortErrorGuard = {
  name: 'abortErrorGuard',
  type: 'reatom:utility',
  files: [
    { path: './abort-error-guard.ts' },
    { path: './abort-error-guard.md', role: 'doc' },
    { path: './abort-error-guard.test.ts', role: 'test' },
    { path: './abort-error-guard.example.ts', role: 'example' },
  ],
} satisfies RegistryItem
