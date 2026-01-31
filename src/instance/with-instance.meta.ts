import type { RegistryItem } from 'jsrepo'

export const withInstance: RegistryItem = {
  name: 'withInstance',
  type: 'reatom:extension',
  files: [
    { path: 'src/instance/with-instance.ts' },
    { path: 'src/instance/with-instance.md', role: 'doc' },
    { path: 'src/instance/with-instance.test.ts', role: 'test' },
    { path: 'src/instance/with-instance.example.ts', role: 'example' },
  ],
}
