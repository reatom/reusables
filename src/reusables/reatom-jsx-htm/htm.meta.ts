import type { RegistryItem } from 'jsrepo'

export const reatomJSXHtm = {
  name: 'reatomJSXHtm',
  type: 'reatom:integration',
  files: [{ path: './htm.ts' }, { path: './htm.md', role: 'doc' }],
} satisfies RegistryItem
