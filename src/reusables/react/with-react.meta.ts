import type { RegistryItem } from 'jsrepo'

export const withReact = {
  name: 'withReact',
  type: 'reatom:extension',
  files: [
    { path: './with-react.ts' },
    { path: './with-react.md', role: 'doc' },
    { path: './with-react.test.ts', role: 'test' },
    { path: './with-react.example.tsx', role: 'example' },
  ],
} satisfies RegistryItem
