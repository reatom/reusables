import type { RegistryItem } from 'jsrepo'

export const tweakpane: RegistryItem = {
  name: 'tweakpane',
  type: 'reatom:integration',
  files: [
    {
      path: 'src/reusables/tweakpane',
      files: [
        { path: 'index.ts' },
        { path: 'core.ts' },
        { path: 'bindings.ts' },
        { path: 'blades.ts' },
        { path: 'essentials.ts' },
        { path: 'tweakpane.md', role: 'doc' },
        { path: 'tweakpane.test.ts', role: 'test' },
        { path: 'tweakpane.example.tsx', role: 'example' },
      ],
    },
  ],
}
