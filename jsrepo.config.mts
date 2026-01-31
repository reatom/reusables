import { defineConfig } from 'jsrepo'
import { repository } from 'jsrepo/outputs'

import { reatomInstance } from './src/reusables/instance/reatom-instance.meta'
import { withInstance } from './src/reusables/instance/with-instance.meta'
import { withReset } from './src/reusables/reset/with-reset.meta'
import { withHistory } from './src/reusables/history/with-history.meta'
import { hotWrap } from './src/reusables/hot-wrap/hot-wrap.meta'
import { tweakpane } from './src/reusables/tweakpane/tweakpane.meta'
import { withLogger } from './src/reusables/logger/with-logger.meta'

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
