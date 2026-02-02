import type { RegistryItem } from 'jsrepo'

export const test = {
  name: 'test',
  type: 'reatom:utility',
  add: 'optionally-on-init',
  description:
    'Enhanced Vitest test function wrapped in Reatom context for proper atom tracking during tests.',
  devDependencies: [{ name: 'vitest', version: '^4.0.18', ecosystem: 'js' }],
  files: [{ path: './test.ts' }, { path: './test.md', role: 'doc' }],
} satisfies RegistryItem
