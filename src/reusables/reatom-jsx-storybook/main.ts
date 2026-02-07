import type { StorybookConfig } from '@storybook/html-vite'

const config: StorybookConfig = {
  stories: [{ directory: '..', files: '**/*.stories.@(js|jsx|mjs|ts|tsx)' }],
  addons: [
    '@storybook/addon-vitest',
    '@storybook/addon-a11y',
    '@storybook/addon-docs',
  ],
  framework: '@storybook/html-vite',
}
export default config
