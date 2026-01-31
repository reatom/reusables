import type { RegistryItem } from 'jsrepo'

export const withInstance: RegistryItem = {
  name: 'withInstance',
  type: 'reatom:extension',
  files: [
    { path: 'src/reusables/instance/with-instance.ts' },
    { path: 'src/reusables/instance/with-instance.md', role: 'doc' },
    { path: 'src/reusables/instance/with-instance.test.ts', role: 'test' },
    {
      path: 'src/reusables/instance/with-instance.example.ts',
      role: 'example',
    },
  ],
}
