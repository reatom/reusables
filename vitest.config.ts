import { defineConfig } from 'vitest/config'
import { playwright } from '@vitest/browser-playwright'

export default defineConfig({
  test: {
    include: ['src/reusables/**/*.test.ts'],
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
          include: ['src/reusables/**/*.test.ts'],
          exclude: ['src/reusables/tweakpane/**/*.test.ts'],
        },
      },
      {
        extends: true,
        test: {
          name: 'browser',
          include: ['src/reusables/tweakpane/**/*.test.ts'],
          browser: {
            enabled: true,
            provider: playwright(),
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
})
