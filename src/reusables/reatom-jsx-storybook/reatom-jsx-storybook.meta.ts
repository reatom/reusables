import type { RegistryItem } from 'jsrepo'

export const reatomJSXStorybook = {
  name: 'reatomJSXStorybook',
  type: 'reatom:integration',
  files: [
    { path: './main.ts', target: '.storybook/main.ts' },
    { path: './preview.ts', target: '.storybook/preview.ts' },
    { path: './vitest.setup.ts', target: '.storybook/vitest.setup.ts' },
    {
      path: './reatom-jsx-renderer.ts',
      target: '.storybook/reatom-jsx-renderer.ts',
    },
    { path: './stories', target: './src/stories' },
    { path: './reatom-jsx-storybook.md', role: 'doc' },
  ],
} satisfies RegistryItem
