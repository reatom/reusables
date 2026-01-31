import { defineConfig } from 'jsrepo'
import { repository } from 'jsrepo/outputs'

export default defineConfig({
  registry: {
    name: '@reatom/reusables',
    homepage: 'https://v1000.reatom.dev',
    bugs: 'https://github.com/reatom/reusables/issues',
    items: [
      {
        name: 'reatomInstance',
        type: 'reatom:factory',
        files: [
          { path: 'src/instance/reatom-instance.ts' },
          { path: 'src/instance/reatom-instance.md', role: 'doc' },
          { path: 'src/instance/reatom-instance.test.ts', role: 'test' },
          { path: 'src/instance/reatom-instance.example.ts', role: 'example' },
        ],
      },
      {
        name: 'withInstance',
        type: 'reatom:extension',
        files: [
          { path: 'src/instance/with-instance.ts' },
          { path: 'src/instance/with-instance.md', role: 'doc' },
          { path: 'src/instance/with-instance.test.ts', role: 'test' },
          { path: 'src/instance/with-instance.example.ts', role: 'example' },
        ],
      },
    ],
    outputs: [repository()],
    defaultPaths: {
      'reatom:utility': 'src/reatom',
      'reatom:factory': 'src/reatom',
      'reatom:extension': 'src/reatom',
    },
  },
})
