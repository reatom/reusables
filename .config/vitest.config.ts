import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  cacheDir: '.var/vitest',
  resolve: {
    alias: {
      test: resolve(import.meta.dirname, '../src/reusables/test/test.ts'),
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
    projects: [
      {
        extends: true,
        test: {
          name: 'node',
          execArgv: ['--no-experimental-webstorage'],
          exclude: ['src/**/*.browser.test.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'browser',
          exclude: ['src/**/*.node.test.ts'],
          browser: {
            headless: true,
            screenshotDirectory: '.var/screenshots',
            enabled: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
