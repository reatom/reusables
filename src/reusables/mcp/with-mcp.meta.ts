import type { RegistryItem } from 'jsrepo'

export const withMCP = {
  name: 'withMCP',
  type: 'reatom:extension',
  files: [
    { path: './with-mcp.ts' },
    { path: './with-mcp.md', role: 'doc' },
    { path: './with-mcp.test.ts', role: 'test' },
    { path: './with-mcp.example.ts', role: 'example' },
  ],
} satisfies RegistryItem
