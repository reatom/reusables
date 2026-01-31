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
      {
        name: 'withReset',
        type: 'reatom:extension',
        files: [
          { path: 'src/reset/with-reset.ts' },
          { path: 'src/reset/with-reset.md', role: 'doc' },
          { path: 'src/reset/with-reset.test.ts', role: 'test' },
          { path: 'src/reset/with-reset.example.ts', role: 'example' },
        ],
      },
      {
        name: 'withHistory',
        type: 'reatom:extension',
        files: [
          { path: 'src/history/with-history.ts' },
          { path: 'src/history/with-history.md', role: 'doc' },
          { path: 'src/history/with-history.test.ts', role: 'test' },
          { path: 'src/history/with-history.example.ts', role: 'example' },
        ],
      },
      {
        name: 'hotWrap',
        type: 'reatom:utility',
        files: [
          { path: 'src/hot-wrap/hot-wrap.ts' },
          { path: 'src/hot-wrap/hot-wrap.md', role: 'doc' },
          { path: 'src/hot-wrap/hot-wrap.test.ts', role: 'test' },
          { path: 'src/hot-wrap/hot-wrap.example.tsx', role: 'example' },
        ],
      },
      {
        name: 'tweakpane',
        type: 'reatom:integration',
        files: [
          {
            path: 'src/tweakpane',
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
      },
    ],
    outputs: [repository()],
    defaultPaths: {
      'reatom:utility': 'src/reatom',
      'reatom:factory': 'src/reatom',
      'reatom:extension': 'src/reatom',
      'reatom:integration': 'src/reatom',
    },
  },
})
