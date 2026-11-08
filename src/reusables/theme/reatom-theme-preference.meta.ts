import type { RegistryItem } from 'jsrepo'

export const reatomThemePreference = {
  name: 'reatomThemePreference',
  type: 'reatom:factory',
  files: [
    { path: './reatom-theme-preference.ts' },
    { path: './reatom-theme-preference.md', role: 'doc' },
    {
      path: './reatom-theme-preference.browser.test.ts',
      role: 'test',
    },
    { path: './reatom-theme-preference.example.ts', role: 'example' },
  ],
} satisfies RegistryItem
