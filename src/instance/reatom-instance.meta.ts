import type { RegistryItem } from 'jsrepo'

export const reatomInstance: RegistryItem = {
  name: 'reatomInstance',
  type: 'reatom:factory',
  files: [
    { path: 'src/instance/reatom-instance.ts' },
    { path: 'src/instance/reatom-instance.md', role: 'doc' },
    { path: 'src/instance/reatom-instance.test.ts', role: 'test' },
    { path: 'src/instance/reatom-instance.example.ts', role: 'example' },
  ],
}
