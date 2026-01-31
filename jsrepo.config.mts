import { defineConfig } from 'jsrepo'
import { repository } from 'jsrepo/outputs'

import { reatomInstance } from './src/instance/reatom-instance.meta'
import { withInstance } from './src/instance/with-instance.meta'
import { withReset } from './src/reset/with-reset.meta'
import { withHistory } from './src/history/with-history.meta'
import { hotWrap } from './src/hot-wrap/hot-wrap.meta'
import { tweakpane } from './src/tweakpane/tweakpane.meta'
import { withLogger } from './src/logger/with-logger.meta'

export default defineConfig({
  registry: {
    name: '@reatom/reusables',
    homepage: 'https://v1000.reatom.dev',
    bugs: 'https://github.com/reatom/reusables/issues',
    items: [
      reatomInstance,
      withInstance,
      withReset,
      withHistory,
      hotWrap,
      tweakpane,
      withLogger,
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
