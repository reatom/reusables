import type { RegistryItem } from 'jsrepo'

export const fetchAbortProbe = {
  name: 'fetchAbortProbe',
  type: 'reatom:utility',
  files: [
    { path: './fetch-abort-probe.ts' },
    { path: './fetch-abort-probe.md', role: 'doc' },
    { path: './fetch-abort-probe.browser.test.ts', role: 'test' },
    { path: './fetch-abort-probe.example.ts', role: 'example' },
  ],
} satisfies RegistryItem
