import { resolve } from 'path'
import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  resolve: {
    alias: {
      test: resolve(__dirname, './src/reusables/test/test.ts'),
    },
  },
  test: {
    include: ['src/**/*.test.ts'],
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          exclude: ['src/**/*.browser.test.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'browser',
          browser: {
            headless: true,
            enabled: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
