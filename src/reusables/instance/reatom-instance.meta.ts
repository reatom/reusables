import type { RegistryItem } from 'jsrepo'

export const reatomInstance: RegistryItem = {
  name: 'reatomInstance',
  type: 'reatom:factory',
  files: [
    { path: 'src/reusables/instance/reatom-instance.ts' },
    { path: 'src/reusables/instance/reatom-instance.md', role: 'doc' },
    { path: 'src/reusables/instance/reatom-instance.test.ts', role: 'test' },
    {
      path: 'src/reusables/instance/reatom-instance.example.ts',
      role: 'example',
    },
  ],
}
